# Frontend: state, rendering, performance, and SEO

Read the sections needed for the affected framework and feature. Inspect the installed framework version before adopting APIs or caching defaults.

## State and effects

Choose an authoritative owner for each value. Server data belongs in the existing query/framework layer, shareable navigation state in the URL, form drafts in the form, and transient UI state near its users. Editable snapshots of server data are legitimate; define how refresh, dirty state and conflicts reconcile them.

Compute inexpensive derived values during rendering. Use effects to synchronize with external systems; clean up subscriptions, timers, and listeners when they create ongoing work. Not every effect requires cleanup. Do not move per-user state, browser-only initialization, or request-specific work to module scope merely to avoid an effect.

Use stable identity keys for reorderable lists. Avoid conditional calls to ordinary hooks; check version-specific exceptions in official API docs. Memoize when profiling or a library contract gives a reason, rather than enforcing arbitrary component/prop counts.

## Async and mutations

- Distinguish first load, background refresh, empty results, failure and stale data when they affect the experience.
- Prevent query A's delayed response from replacing query B's result. Use keyed data state, cancellation, or stale-result guards; aborting a client request does not undo a server mutation.
- Debounce only where the interaction benefits. Do not delay explicit submit actions automatically.
- Keep a failure local when the rest of the page can still function; preserve entered data and provide a meaningful recovery action.
- For optimistic writes, define rollback or reconciliation, cache invalidation, and conflict behavior. Disabling a button is a usability control, not protection against duplicate requests.
- Preserve server validation as authoritative. Prefer structured field errors with stable codes over parsing message strings.

## Next.js App Router

Check the installed version and route configuration: data caching, request APIs, revalidation and rendering options change between versions.

- Keep data access and secrets server-side. Use the smallest practical client boundary for interactivity; a complex interactive subtree can reasonably be one client boundary.
- Treat callable Server Actions and route handlers as externally reachable operations. Authorize near data access, validate inputs, and return only permitted fields; hidden buttons and layouts do not provide the access policy.
- Respect the framework's supported serialization contract at server/client boundaries. Do not equate it with JSON-only data or pass privileged service objects.
- For cached mutable data, define key scope, freshness and invalidation. Verify user-specific data cannot appear in another session or public cache.
- Add loading, error, not-found and streaming boundaries where they improve behavior. Reuse inherited route boundaries when appropriate; do not create all boundary files on every route.
- Check hydration mismatches caused by time, randomness, locale or browser-only state. Do not silence warnings before understanding the mismatch.

## Accessibility and forms

Use native controls and semantics before custom keyboard behavior. For changed interactions, check accessible name, label, focus visibility, keyboard operation and announcements. Ensure dialogs, menus and disclosure controls follow the interaction pattern they claim; an ARIA role alone does not implement it.

Use suitable `type`, `inputmode`, `autocomplete` and `name` attributes. Associate field errors programmatically, preserve input on failure, and direct focus to an error summary or first invalid field when it helps correction. Avoid stealing focus on each keystroke or background refresh. Handle pending submission and repeated activation without trapping keyboard users.

Responsive checks should include narrow layouts, zoom, long/localized content and overflow in affected areas. Test reduced motion when adding animated interaction; do not use color alone to communicate an error or selection.

## Performance

Core Web Vitals good thresholds are LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds and CLS ≤ 0.1, evaluated at the 75th percentile with mobile and desktop considered separately. They are field metrics; one lab run cannot certify field performance. TTFB is a useful diagnostic, not a Core Web Vital.

- Measure the user's critical path before optimizing. Use the same device/network conditions for comparisons and identify synthetic versus real-user data.
- Reserve space for media and embeds. Use responsive source sizes; avoid lazy loading a likely LCP image. Add high fetch priority only for genuinely critical candidates, not every image.
- Load only needed font weights and subsets; compare fallback metrics and loading behavior before indiscriminate preloading or self-hosting.
- Investigate long tasks, hydration cost, layout thrashing and server latency from evidence. Reduce shipped JavaScript and expensive work before blanket memoization.
- Bound lists or virtualize when measured scale warrants it, while preserving keyboard access and discoverability.

## Indexable pages

Apply SEO work to pages intended for discovery. Server-render or prerender important content when appropriate; crawlers differ in JavaScript support. Check titles, meaningful headings, status codes, canonical decisions, structured data matching visible content, and crawlable links. Pagination needs deliberate canonical and indexing policy rather than blanket noindex.

A private page requires access control. `robots.txt` is crawl guidance, and `noindex` is indexing guidance; neither protects sensitive content. A crawler blocked by robots may not see a page's noindex instruction.

## Primary references

Use the deployed version's contract; these links are starting points, not a promise that all current APIs exist locally.

- [React useEffect](https://react.dev/reference/react/useEffect): external synchronization, dependencies and cleanup.
- [Next.js data security](https://nextjs.org/docs/app/guides/data-security): data-access boundaries and Server Actions.
- [Web Vitals](https://web.dev/articles/vitals): metric definitions and field thresholds.
