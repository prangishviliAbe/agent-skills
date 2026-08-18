# Frontend: state, rendering, performance, SEO

Read when building or reviewing UI code, React/Next.js architecture, client performance, or indexable pages.

## Classify state before writing it

Most frontend bugs are state stored in the wrong place. Sort every value into exactly one bucket.

| Kind | Lives in | Never |
| --- | --- | --- |
| Server state | Data layer with caching, revalidation, and request dedup | Copied into `useState` on mount |
| URL state | Route params and search params | Duplicated in a store that can drift from the URL |
| Form state | The form library or the uncontrolled DOM | Lifted globally "just in case" |
| Ephemeral UI state | Local component state | Promoted to global state because two siblings need it (lift one level instead) |
| Derived values | Computed during render | Stored in state and synced by an effect |

**The single strongest rule:** if a value can be computed from other values, compute it. An effect that syncs derived state is a bug waiting for a race.

## Effects are for synchronizing with systems outside React

Legitimate uses: subscriptions, event listeners, imperative DOM APIs, timers, analytics, integrating a non-React widget. Each returns a cleanup function.

Not effects: deriving values, transforming props, resetting state on prop change (use a `key`), fetching that the framework's data layer can do, or "run once on mount" initialization that belongs at module scope or in an event handler.

## Async correctness

Every remote read must define behavior for all six of these, not just the happy path:

1. **Loading** — first load versus background refresh are different states with different UI.
2. **Empty** — no results is not an error; distinguish "none exist yet" from "none match the filter".
3. **Error** — with a retry affordance and a message that says what the user can do.
4. **Stale response** — a slow request for query A must not overwrite the result of query B. Use the data layer's key-based cache or an abort signal.
5. **Race on rapid input** — debounce input, cancel in-flight requests, and key the result to the input that produced it.
6. **Partial failure** — one widget failing must not blank the page.

For mutations: disable double submit, define the optimistic update *and its rollback*, invalidate exactly the affected cache keys, and make retried requests idempotent on the server.

## React discipline

- Type props explicitly. Reach for `any` only at a genuinely unknown boundary, and narrow it immediately with a schema parse.
- Prefer composition and `children` over prop explosion and boolean flag soup.
- A component that takes more than roughly seven props or renders more than three unrelated concerns is two components.
- Keep list keys stable and derived from identity, never from the array index when items can reorder, insert, or delete.
- Memoize only after a measured render problem, and memoize the expensive computation rather than wrapping everything reflexively.
- Keep refs out of render output. Read and write them in handlers and effects.
- Never conditionally call hooks; extract a child component instead.

## Next.js App Router

- Default to Server Components. Add `'use client'` at the **smallest leaf** that needs interactivity, not at the top of a route.
- Pass serializable data down; never pass a database client, a secret, or a non-serializable object across the boundary.
- Server Actions and route handlers are public endpoints. Validate the payload with a schema and authorize the actor exactly as you would for a REST endpoint. `'use server'` is not an access control.
- Choose the rendering strategy deliberately per route: static, revalidated (ISR), dynamic, or streamed. Write down the revalidation trigger for any cached mutable data.
- Provide `loading.tsx`, `error.tsx`, and `not-found.tsx` for routes that fetch. Stream the slow part with `Suspense` instead of blocking the whole route.
- Use `generateMetadata` for indexable routes. Set canonical URLs, Open Graph, and the correct robots directives for private or paginated pages.
- Do not turn a route tree into client components for a transition or an animation. That trades the entire server-rendering benefit for a visual flourish.

## Performance budgets

Design against numbers, not adjectives. Field targets at the 75th percentile:

| Metric | Target | Usual causes when it fails |
| --- | --- | --- |
| LCP | under 2.5s | Unoptimized hero image, render-blocking CSS/JS, slow server response, client-side data fetch for above-the-fold content |
| INP | under 200ms | Long tasks, heavy hydration, unmemoized expensive renders, synchronous layout thrash in handlers |
| CLS | under 0.1 | Images and embeds without dimensions, injected banners, late-loading fonts, content that appears after hydration |
| TTFB | under 800ms | Uncached upstream calls, N+1 queries, cold starts, missing CDN |

Practical rules:

- Set explicit `width` and `height` (or an aspect ratio) on every image, video, and embed.
- Serve modern image formats at the size actually rendered; lazy-load below the fold and eagerly load the LCP image with `fetchpriority="high"`.
- Self-host or preload critical fonts, use `font-display: swap`, and define a metric-compatible fallback to avoid a layout shift on swap.
- Split code at route boundaries and around genuinely heavy widgets. Do not micro-split into dozens of tiny chunks.
- Move work off the main thread or out of the browser entirely before optimizing it in place.
- Measure before and after with the same tool and the same throttling profile. Report both numbers or do not claim an improvement.

## Forms

- Native `<form>` with a real submit path first; enhance with JavaScript.
- Correct `type`, `inputmode`, `autocomplete`, and `name` on every field. This is a conversion feature, not a nicety.
- Validate on the client for speed and on the server for truth. The server result wins.
- Errors: field-level, adjacent to the field, programmatically associated, and announced. Never clear the user's input on a failed submit.
- Preserve scroll and focus position across a failed submit; move focus to the first invalid field.

## SEO for indexable pages

- Meaningful content in the server-rendered HTML. If the page is empty without JavaScript, it is invisible to a meaningful share of crawlers and social previews.
- One `<h1>` describing the page, with a heading hierarchy that survives being read alone.
- Canonical URL on every indexable page. Decide explicitly what happens to paginated, filtered, and parameterized variants.
- Structured data only when it is valid and true to what the page shows.
- `robots`, sitemap, and status codes coherent: a "not found" page must return 404, not 200 with sad text.

## Frontend anti-patterns

| Anti-pattern | Replace with |
| --- | --- |
| `useEffect` that copies props into state | Compute during render, or use a `key` to reset |
| A global store for one screen's toggle | Local state |
| `try/catch` around a fetch that only logs | Surface an error state the user can act on |
| Index keys on a reorderable list | Stable identity keys |
| `window` or `document` accessed during render | Access in an effect or an event handler, guarded |
| Spinner over the entire page for one slow widget | Scoped skeleton or streamed boundary |
| `dangerouslySetInnerHTML` with server content | Sanitize with a maintained allowlist sanitizer, or render structured data |
| Hard-coded breakpoints scattered through components | Tokens or container queries in one place |
