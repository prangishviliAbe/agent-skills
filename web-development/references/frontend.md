# Frontend: React, forms, TypeScript, styling, accessibility

Read when building or fixing UI code in React-family projects (Next.js, Vite, Remix, Astro islands). Next.js specifics are in [nextjs.md](nextjs.md); Core Web Vitals, bundles, and SEO are in [web-performance.md](web-performance.md).

## Detect the setup first

```bash
npm ls react next vite tailwindcss typescript --depth=0   # swap in pnpm/yarn per the lockfile
```

Check for the React Compiler (`babel-plugin-react-compiler`, `reactCompiler: true`): when it is on, do not hand-write `useMemo` and `useCallback` by default. Check the Tailwind major version (see Styling). Use the project's existing data, form, and styling libraries instead of adding a second one.

## State: one owner per value

| Kind of state | Lives in | Why |
| --- | --- | --- |
| Server data (records, lists) | The project's data layer: framework loaders or Server Components, TanStack Query, SWR | Caching, deduplication, invalidation |
| Shareable view state (filter, sort, page, tab) | URL search params | Back button, links, reload |
| Form drafts | The form (uncontrolled inputs read via `FormData`, or the project's form library) | No re-render per keystroke |
| Ephemeral UI (open, hover, selected row) | `useState` next to its only consumer | Locality |
| Cross-cutting client state (theme, current user, cart) | Context or a small store, only when distant components share it | Avoid prop drilling without global sprawl |

Compute derived values while rendering. Do not mirror props into state and do not sync derived values in an effect. An editable copy of server data is legitimate when you define how refresh, dirty state, and conflicts reconcile it.

## Effects synchronize with the outside world

Use an effect for subscriptions, timers, DOM and third-party widget APIs, sockets, and analytics. Do not use one to derive state, to reset state when a prop changes (give the component a `key` instead), or to respond to a click (put that in the handler). StrictMode runs setup, cleanup, setup in development, so cleanup must restore a valid state.

Reads that can overlap need a guard, or query A's late response overwrites query B's:

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(setResults)
    .catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setError(error);
    });
  return () => controller.abort();
}, [query]);
```

Aborting a request never undoes a server mutation; use this pattern for reads. Prefer the data library when one exists.

To read the latest props or state inside an effect without re-subscribing, use `useEffectEvent` (React 19.2). Call it only from effects and never list it in the dependency array:

```tsx
import { useEffect, useEffectEvent } from 'react';

function Room({ roomId, muted }: { roomId: string; muted: boolean }) {
  const onConnected = useEffectEvent(() => {
    if (!muted) playChime();
  });
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('connected', onConnected);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return null;
}
```

## Model async UI as a union

```ts
type Load<T> =
  | { status: 'idle' }
  | { status: 'loading'; previous?: T }
  | { status: 'success'; data: T; refreshing?: boolean }
  | { status: 'error'; error: Error; previous?: T };
```

A union cannot represent "loading and error at once". Keep `previous` data visible during refresh and after a failed refresh. Distinguish first load, background refresh, empty result, failure, and stale data when the user would experience them differently. Debounce typing-driven requests only; never delay an explicit submit.

## React 19 form primitives

`useActionState` gives `[state, formAction, isPending]`. React resets uncontrolled fields after a successful action, so return the submitted values when you want them kept after an error:

```tsx
'use client';
import { useActionState } from 'react';

type State = { ok: boolean; errors?: Record<string, string>; values?: Record<string, string> };

export function ContactForm({
  action,
}: {
  action: (previous: State, formData: FormData) => Promise<State>;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false });
  const emailError = state.errors?.email;
  return (
    <form action={formAction} noValidate>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        aria-invalid={emailError ? true : undefined}
        aria-describedby={emailError ? 'email-error' : undefined}
      />
      {emailError && <p id="email-error">{emailError}</p>}
      <button type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Send'}
      </button>
      <p role="status">{state.ok ? 'Message sent.' : ''}</p>
    </form>
  );
}
```

`useOptimistic` shows the expected result immediately and reverts when the action finishes, so the server result must replace it:

```tsx
'use client';
import { useOptimistic } from 'react';

type Todo = { id: string; title: string; pending?: boolean };

export function Todos({ todos, addTodo }: { todos: Todo[]; addTodo: (formData: FormData) => Promise<void> }) {
  const [shown, addOptimistic] = useOptimistic(todos, (current, title: string) => [
    ...current,
    { id: `pending-${title}`, title, pending: true },
  ]);
  async function action(formData: FormData) {
    addOptimistic(String(formData.get('title')));
    await addTodo(formData);
  }
  return (
    <form action={action}>
      <input name="title" required />
      <button type="submit">Add</button>
      <ul>
        {shown.map((todo) => (
          <li key={todo.id} aria-busy={todo.pending}>{todo.title}</li>
        ))}
      </ul>
    </form>
  );
}
```

Disabling a button is a usability control, not duplicate-request protection; the server needs an idempotency or uniqueness guarantee ([backend.md](backend.md)).

## Forms

- Use native `form`, `label`, `input`, `select`, `button`. Associate every label with its control; do not use placeholder text as the label.
- Validate on the server, which is authoritative. Share the schema with the client for early feedback. Return structured field errors with stable codes, not message strings to parse.
- Set `type`, `inputmode`, `autocomplete`, and `name` to match the data. Use `inputmode="numeric"` with a `pattern` for codes and postal values, not `type="number"` (it mangles leading zeros and scroll-changes values).
- Connect errors with `aria-describedby` and `aria-invalid`. After a failed submit, move focus to an error summary or the first invalid field. Keep valid input. Do not move focus on each keystroke or background refresh.
- Allow paste and password managers. Use `autocomplete="current-password"`, `"new-password"`, and `"one-time-code"`; do not cap password length below 64 characters.
- Label the submit by its outcome ("Create account", not "Submit").

| Field | `autocomplete` token |
| --- | --- |
| Login identifier / email | `username` / `email` |
| Password at sign-in / on creation | `current-password` / `new-password` |
| SMS or authenticator code | `one-time-code` |
| Name, address | `given-name`, `family-name`, `street-address`, `postal-code`, `country` |
| Phone | `tel` |

Prefer provider-hosted card fields over custom `cc-*` inputs (see [integrations.md](integrations.md)).

## TypeScript habits that prevent bugs

- Keep `strict` on. Use `unknown` plus narrowing at boundaries; write `catch (error: unknown)`. Reaching for `any`, `as`, or `!` is a signal to fix the type instead.
- Parse external data (fetch responses, `searchParams`, `FormData`, `localStorage`, webhooks) with a schema at the edge. A type assertion is not validation.
- Use discriminated unions and an exhaustive `switch` with a `never` check so new variants fail the build.
- Use `satisfies` to check config objects and `as const` for literal tables.
- Never hand-edit generated types (Prisma, Drizzle, OpenAPI, Payload); regenerate them with the project's command.

## Styling

Follow the project's approach (Tailwind, CSS modules, vanilla CSS, CSS-in-JS). Do not introduce another.

**Tailwind v4 differs from v3.** Detect it by `@import "tailwindcss"` in the stylesheet (v4) versus `@tailwind` directives and `tailwind.config.js` (v3). In v4:

- Configure in CSS with `@theme`, register utilities with `@utility`, and load a legacy JS config with `@config`. Build through `@tailwindcss/postcss` or `@tailwindcss/vite`.
- Browser floor is Safari 16.4, Chrome 111, Firefox 128.
- Utilities were renamed: `shadow-sm` to `shadow-xs`, `shadow` to `shadow-sm`, `rounded-sm` to `rounded-xs`, `rounded` to `rounded-sm`, `outline-none` to `outline-hidden`, `ring` to `ring-3`. `bg-opacity-*` is gone; use `bg-black/50`.
- Default border color is `currentColor` and the default ring is 1px `currentColor`.
- `npx @tailwindcss/upgrade` migrates a v3 project; run it on a branch and review the diff.

Tailwind scans source as plain text, so a dynamic class like `` `text-${color}-500` `` is never generated. Map values to complete class names:

```ts
const tone = { success: 'text-green-700', danger: 'text-red-700' } as const;
```

Other rules: use design tokens (CSS variables or `@theme`) instead of raw hex in components; give flex and grid children `min-width: 0` so they can shrink; use `dvh` or `svh` instead of `100vh` on mobile; avoid fixed heights around dynamic text; define a z-index scale and use `isolation: isolate` to contain stacking contexts; prefer logical properties (`margin-inline`) so RTL works.

## Accessibility baseline

- Use native elements: `button` for actions, `a href` for navigation, `dialog` for modals, `details` for simple disclosure.
- Give every control an accessible name (icon-only buttons need `aria-label`). Alt text for informative images; empty `alt` for decorative ones.
- Keep a visible `:focus-visible` style. Move focus on purpose after route changes, dialog open and close, and failed submits; return focus to the trigger when an overlay closes.
- Make everything reachable and operable by keyboard; Escape closes overlays.
- Never use color alone for state. Text needs 4.5:1 contrast, controls and graphics 3:1.
- Announce async status with `role="status"` or `aria-live="polite"` without moving focus.
- Honor `prefers-reduced-motion`.

Check by tabbing through the flow, zooming to 200%, and running an automated checker (axe). Automated tools find only part of the problems; say so in the handoff.

## Composition and rendering

- Follow the Rules of Hooks (keep the `react-hooks` lint rules on): no hooks inside conditions, loops, or after an early return.
- Prefer composition (children, slots) over prop drilling, and context only for values many distant components need.
- Use stable ids for keys; never an array index for lists that reorder, insert, or filter.
- Memoize only when profiling or a library contract calls for it (and not at all under the React Compiler).
- Put error boundaries around independent regions so one failure does not blank the page, and make the fallback recoverable.
- Virtualize long lists when measured size demands it, and keep keyboard and screen-reader access to items.

## Browser-side safety

- Do not store auth tokens or secrets in `localStorage` or `sessionStorage`; use HttpOnly cookies set by the server.
- Use `dangerouslySetInnerHTML` only with HTML sanitized by a maintained sanitizer, and only when rich HTML is the requirement.
- Validate user-supplied URLs against an allowed scheme list (`https:`, `http:`, `mailto:`) before placing them in `href` or `src`.

## Verify frontend work

1. Run the project's type-check, lint, and unit tests.
2. Start the dev server with the project script, open the changed route, and read the console and network panel.
3. Operate the flow by keyboard, at 375 px width, and with the empty, error, and slow-network states forced (offline mode or a mocked failure).
4. Capture a screenshot when a browser tool is available, and run the project's Playwright tests if they exist.
5. Report what you saw. Mark anything you could not run as *Not run*.
