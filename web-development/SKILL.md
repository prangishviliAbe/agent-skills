---
name: web-development
description: >-
  Build, fix, review, refactor, and ship web software in the existing stack: React, Next.js,
  and TypeScript front ends; Node, Python, and PHP back ends; REST and GraphQL APIs; SQL
  databases and migrations; payments, webhooks, and third-party integrations; forms and
  sign-in flows; WordPress and WooCommerce; CI and deploys. Use for implementing a feature,
  diagnosing a bug or flaky test, speeding up a slow page or query, reviewing a diff,
  upgrading a framework, or vague asks like "make this work" or "why is this broken". Reads
  the project first, uses the installed versions' real APIs, enforces trust boundaries on the
  server, finishes the UI to a professional visual standard without generic AI styling, and
  proves behavior by running it.
---

# Web Development

Deliver the requested behavior inside the existing architecture, correct at its trust boundaries, finished in its UI, and proven by running it. Code that was written but never executed is a draft.

## Workflow

1. **Read before writing.** Repository instructions, the files in the change path and their callers, `package.json` or equivalent, lockfile versions, scripts, configuration, and existing tests. Find how the project already solves a similar problem and follow it.
2. **Pin the target.** For a bug, reproduce it and capture the failing behavior. For a feature, state the acceptance behavior in one or two sentences, including the failure cases. If neither is possible, say what is missing.
3. **Check the real API.** For anything version-sensitive (framework routing and caching, ORM methods, SDK calls), read the installed version's types or documentation. Do not write calls from memory of another version.
4. **Make the smallest complete change.** Complete means: validation, authorization, error handling, UI states, and migration included. Smallest means: no drive-by refactors, no new dependency or abstraction without a concrete need, no framework migration inside a bug fix.
5. **Run it.** Type check, lint, the relevant tests, and the actual behavior in the running app or with a real request. Exercise the failure path, not only success.
6. **Finish the UI.** If the change is visible, render it at narrow and wide sizes with real content and every affected state, and fix what looks wrong. See [ui-implementation.md](references/ui-implementation.md).
7. **Report with evidence.** What changed, what was run and its result, what was not run, and anything the user must do (migration, environment variable, deploy step).

When stuck on a defect, stop guessing and follow [debugging.md](references/debugging.md).

## Boundary decisions

| Boundary | Required decision |
| --- | --- |
| Architecture | Follow the installed framework's model. In a server-components app, keep data access and secrets on the server and make client boundaries as small as the interaction needs. Do not impose that model on other stacks |
| External input | Parse and bound all untrusted input at runtime with the project's validation library. A TypeScript type or cast validates nothing |
| Authentication and authorization | Check identity and permission inside every callable handler, action, and mutation. Page redirects, middleware, hidden fields, and unguessable IDs are not authorization |
| Data access | Parameterize values, scope every query to the trusted user or tenant, allowlist dynamic identifiers, select only the fields the client needs |
| Secrets | Server-side only, from environment or a secret store; never in client bundles, logs, error messages, or the repository |
| Mutations | Enforce invariants in the database: constraints, transactions, conditional writes, idempotency keys. A preflight check or a disabled button does not prevent a race |
| Async work | Start independent work together; keep real dependencies sequential. Set timeouts. Handle cancellation and stale responses |
| Caching | State who may see the data and how fresh it must be before caching it. Never share a cache entry across users for private data. Invalidate on write |
| Errors | Expected failures are handled and explained to the user with input preserved; unexpected ones are logged with context and without secrets. Let framework control-flow exceptions propagate |
| Migrations | Reversible or at least forward-safe; compatible with the code running during deploy; tested against realistic data volume when locking is a risk |
| Performance | Measure the bottleneck before changing code; compare before and after under the same conditions. See [web-performance.md](references/web-performance.md) |
| Dependencies | Prefer the platform and what is installed. Before adding one, check maintenance, size, license, and whether a few lines would do |

## UI is part of the work

A feature whose interface looks unfinished is unfinished. For any visible change:

- Use the project's design system and tokens; no raw one-off colors, sizes, or spacing.
- Cover the applicable states: loading, empty, error, success, disabled, long content. Preserve the user's input on failure. Keep layout stable when state changes.
- Use semantic elements, visible labels, a visible focus style, and keyboard operability.
- Fit real content from 320px wide to large screens with no horizontal page scroll.
- Do not add generated-looking styling: gradient text, purple or blue-violet gradients, glows, glassmorphism, accent stripes, decorative dots, icon bubbles, hover lift on static cards, fade-up-on-scroll, emoji as icons, invented metrics, testimonials, or placeholder names. Do not write stock copy such as "seamless" or "supercharge".

## Common failures

| Failure | Correct move |
| --- | --- |
| Fix written without reproducing the bug | Reproduce first; a fix for an unobserved cause is a guess |
| API used as it worked in an older or newer version | Read the installed version's types or docs |
| Authorization only in the page or middleware | Enforce in the handler or action itself |
| "Works on the happy path" | Run the failure, empty, concurrent, and unauthorized cases that apply |
| Error swallowed in an empty catch | Handle it, or let it surface with context |
| Bug fix arrives with a refactor of the file | Separate; keep the diff reviewable |
| Tests edited until they pass | Fix the code, or explain why the test's expectation was wrong |
| New dependency for a ten-line need | Write the ten lines |
| "Should work" in the report | Run it, or state plainly that it was not run |
| Feature done, UI left as unstyled defaults | Finish states, spacing, and responsive fit before reporting done |

## References

| Task | Read |
| --- | --- |
| Building or styling visible UI in code | [ui-implementation.md](references/ui-implementation.md) |
| Diagnosing a defect, flaky test, or "it doesn't work" | [debugging.md](references/debugging.md) |
| React state, forms, optimistic UI, rendering boundaries | [frontend.md](references/frontend.md) |
| Next.js actions, request APIs, caching, invalidation | [nextjs.md](references/nextjs.md) |
| Webhooks, retries, idempotency, transactions, connections | [backend.md](references/backend.md) |
| Loading, responsiveness, layout stability, asset cost | [web-performance.md](references/web-performance.md) |

## Completion

Done means: the acceptance behavior was observed working; the relevant existing checks pass; a regression test exists when a defect or invariant warrants one; visible changes were rendered and inspected; nothing unrelated changed. Do not write tests that only mirror implementation details, and do not run unrelated suites indefinitely.

Report the result, the commands run with their outcomes, and material limits. If a check fails, say so and show the output. Use **Verified**, **Inferred**, **Assumed**, and **Not run**. A passing build does not prove correct behavior, visual quality, production security, or field performance.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
