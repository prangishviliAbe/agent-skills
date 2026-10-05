# Next.js App Router: version-sensitive rules

Read when the project depends on `next`. Next.js 15 and 16 changed APIs that older training data still teaches, so ground yourself in the installed version before writing code. General React, forms, and styling live in [frontend.md](frontend.md); Core Web Vitals and SEO in [web-performance.md](web-performance.md).

## Ground yourself in the installed version

```bash
node -p "require('next/package.json').version"
ls node_modules/next/dist/docs/01-app/02-guides     # bundled docs ship from 16.2; also 03-api-reference
rg -n "cacheComponents|reactCompiler|serverActions|output" next.config.*
ls app src/app proxy.* middleware.* 2>/dev/null
```

From 16.2 the version-matched docs are bundled in `node_modules/next/dist/docs/`; read the guide for the feature before coding. On 16.1 and earlier use the versioned web docs (append `.md` to a docs URL for plain Markdown). If the project has a `pages/` directory, it uses the Pages Router; do not introduce App Router conventions unasked.

## What changed and what agents still get wrong

| Old belief | Reality in 16.x |
| --- | --- |
| `cookies().get()`, `headers().get()`, `params.id`, `searchParams.q` work synchronously | Async only: `await cookies()`, `await headers()`, `await props.params`, `await props.searchParams`. Synchronous access was removed in 16 |
| Auth and redirects belong in `middleware.ts` | The file is `proxy.ts`, exporting `proxy` (default export also works). `middleware` is deprecated; a codemod renames it |
| `next build` lints, `next lint` exists | `next lint` was removed and `next build` no longer lints. Run ESLint or Biome yourself, and in CI |
| `next dev --turbopack` | Turbopack is the default for dev and build. A custom `webpack` config makes `next build` fail unless you pass `--webpack` or `--turbopack` |
| `fetch` is cached by default; wrap queries in `unstable_cache` | Data fetching is dynamic by default. With `cacheComponents: true` you opt in per function or component with `'use cache'` |
| `revalidateTag('posts')` | Two arguments: `revalidateTag('posts', 'max')`. The one-argument form is deprecated and a type error |
| `experimental.ppr`, `dynamicIO`, `useCache` flags | Removed. One flag: `cacheComponents: true` |
| `serverRuntimeConfig` and `publicRuntimeConfig` | Removed. Use environment variables |
| `images.domains` | Deprecated. Use `images.remotePatterns` |
| Node 18, TypeScript 4 | Node 20.9 or newer, TypeScript 5.1 or newer |

Migration helpers: `npx @next/codemod@canary upgrade latest` and `npx @next/codemod@canary next-async-request-api .`. Run `npx next typegen` to generate the global `PageProps`, `LayoutProps`, and `RouteContext` helper types.

## Request APIs and `proxy.ts`

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const { preview } = await props.searchParams;
  return <h1>{slug}{preview ? ' (preview)' : ''}</h1>;
}
```

Reading `cookies()`, `headers()`, or `searchParams` makes the part of the tree that uses it dynamic. Wrap that part in `<Suspense>` with a fallback rather than letting it block the route.

`proxy.ts` runs before routing and is the place for redirects, rewrites, and *optimistic* checks such as "is there a session cookie". It is not an authorization layer: it runs separately from rendering, may be deployed to the edge of a CDN, and cannot protect Server Actions, route handlers, or data reads by itself. Verify the session again where data is read or written.

```ts
// proxy.ts
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has('session');
  if (!hasSession && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

// Without a matcher, proxy runs on every request, including static assets.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

## Server and Client Components

- Components are Server Components by default: no hooks, state, effects, or browser APIs. Add `'use client'` at the smallest interactive leaf. A client boundary also makes everything it imports client code.
- Props crossing into a Client Component must be serializable and are visible to the user. Pass a minimal DTO, never a raw database row or a user object with hashes and tokens.
- Mark server-only modules with `import 'server-only'` so a stray client import fails the build. Only `NEXT_PUBLIC_*` variables reach the browser, and they are inlined at build time, so changing one needs a rebuild.
- Pass Server Components to Client Components as `children` or props to keep them on the server.
- With Cache Components, hidden routes can stay mounted under `<Activity>`: effects are cleaned up on hide and recreated on show, and local state such as an open dropdown can persist. Check the bundled "Preserving UI state" guide when UI looks stale after navigation.

## Data access layer and Server Actions

A Server Action is a public POST endpoint. Hiding the form, redirecting in the page, or checking in `proxy.ts` does not protect it. Put authentication, authorization, and validation inside every action, and keep database access in a `server-only` data access layer that returns DTOs.

```ts
// data/invoices.ts
import 'server-only';
import { cache } from 'react';
import { getSession } from '@/lib/session'; // verifies the signed cookie on the server
import { db } from '@/lib/db';

export const getInvoice = cache(async (id: string) => {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHENTICATED');
  const row = await db.invoice.findFirst({ where: { id, tenantId: session.tenantId } });
  if (!row) return null; // missing and not-yours look identical
  return { id: row.id, number: row.number, totalCents: row.totalCents, status: row.status };
});
```

```ts
// app/invoices/actions.ts
'use server';
import { z } from 'zod';
import { updateTag } from 'next/cache';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';

const Input = z.object({ invoiceId: z.string().min(1), note: z.string().trim().min(1).max(500) });
export type State = { ok: boolean; errors?: Record<string, string>; values?: Record<string, string> };

export async function addNote(_previous: State, formData: FormData): Promise<State> {
  const session = await getSession();
  if (!session) return { ok: false, errors: { form: 'Please sign in again.' } };

  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = Input.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? 'form')] ??= issue.message;
    return { ok: false, errors, values: { note: raw.note ?? '' } };
  }

  // Authorization: schema validation proves shape, not ownership.
  const invoice = await db.invoice.findFirst({
    where: { id: parsed.data.invoiceId, tenantId: session.tenantId },
  });
  if (!invoice) return { ok: false, errors: { form: 'Invoice not found.' } };

  await db.note.create({
    data: { invoiceId: invoice.id, authorId: session.userId, body: parsed.data.note },
  });
  updateTag(`invoice-${invoice.id}`); // read-your-own-writes; Server Actions only
  return { ok: true }; // return what the UI needs, not the database row
}
```

Facts that shape the design:

- The client sends a reference and the user's change; derive identity and ownership from the session and re-read the rest from the database.
- Action IDs are encrypted and unused actions are removed from client bundles, but treat that as defense in depth. Closed-over variables are encrypted; do not rely on that to protect secrets.
- The framework compares `Origin` to `Host` and only allows POST. Behind a proxy or CDN set `serverActions.allowedOrigins`. The request body limit is 1 MB by default (`serverActions.bodySizeLimit`).
- The client dispatches actions one at a time, so `Promise.all` over actions does not parallelize them. Do parallel work inside one action.
- `redirect()` throws, so code after it never runs; call revalidation before it.
- Add rate limiting to expensive or abusable actions (email, writes, search).

## Caching with Cache Components

Check `cacheComponents` in `next.config.*` before choosing a model. When it is `true`, everything is dynamic until you opt in:

```tsx
// lib/products.ts
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';

export async function getProduct(slug: string) {
  'use cache';
  cacheLife('hours'); // seconds | minutes | hours | days | weeks | max, or a custom profile
  cacheTag(`product-${slug}`);
  return db.product.findUnique({ where: { slug } });
}
```

Rules:

- Cached functions and components must be async. Set `cacheLife` inside every `'use cache'` scope so the lifetime is explicit at the call site.
- The cache key is the build id, the function id, and the serialized arguments (including captured closure variables). Anything that changes the output must be an argument. Different arguments produce separate entries.
- Do not read `cookies()` or `headers()` inside a `'use cache'` scope. Read them outside and pass the values as arguments. For per-request data you cannot refactor, `'use cache: private'` is available; its results are not stored in a server cache across requests.
- Arguments must be serializable. Return values may also contain JSX.
- Cache Components requires the Node.js runtime; migrate routes that set `runtime = 'edge'`.

| After a mutation you want | Use |
| --- | --- |
| The user to see their own change immediately | `updateTag(tag)` inside the Server Action |
| Stale-while-revalidate refresh (also callable from route handlers) | `revalidateTag(tag, 'max')` |
| One URL refreshed, tagging not worth it | `revalidatePath(path)` |
| The current route re-fetched without touching caches | `refresh()` |

When a route reads uncached data or runtime APIs outside `<Suspense>`, the dev server and `next build` print the "blocking prerender" error with labeled fixes. Choose by the data: wrap per-user or fast-changing reads in `<Suspense>` (stream), cache shared data with `'use cache'` (cache), or opt out with `export const instant = false` only when blocking is truly acceptable.

## Route handlers

`app/**/route.ts` handlers use the Web `Request` and `Response` APIs and are separate entry points: authenticate, authorize, and validate in each. Do not have a Server Component call your own route handler over HTTP; call the shared function directly. For webhooks read the raw body with `await request.text()` before any JSON parsing (see [integrations.md](integrations.md)). Use `after()` from `next/server` for work that should run after the response is sent.

## Verification loop

```bash
npm run build          # type-checks and compiles; does not lint in 16
npx eslint .           # or the project's lint script; run it in CI too
npx next typegen       # refresh PageProps / LayoutProps / RouteContext
```

For runtime evidence, use the real dev server:

1. Run the project's dev script. It writes its PID, port, and URL to `.next/dev/lock`; if one is already running, reuse it instead of starting a second server.
2. On 16.2 and later `next dev` forwards browser console errors and warnings to the terminal (`logging.browserToTerminal`), and the dev server exposes an MCP endpoint at `/_next/mcp` with routes, logs, and compilation issues. Prefer these over guessing.
3. Open the changed route in a browser tool, read the console and network, and exercise the interaction. For prerender problems use `next build --debug-prerender` to get source-mapped stacks.

## Deployment gotchas

- Server Action IDs change per build (rotated at most every 14 days). A tab left open across a deploy can fail with "Failed to find Server Action"; prefer rolling deploys and show a retry or refresh path.
- Self-hosting several instances: set the same `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` on all of them (a base64 value of 16, 24, or 32 bytes) so action references and closures decrypt everywhere.
- Add `.env*` files to `.gitignore`; only `NEXT_PUBLIC_*` values are public. Read secrets only in the data access layer.
- Metadata, sitemaps, `robots`, `next/image`, `next/font`, and `next/script` have built-in conventions; use them instead of hand-rolled equivalents.
