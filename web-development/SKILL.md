---
name: web-development
description: >-
  Build, refactor, debug, and optimize web applications, frontend components, API routes,
  server actions, databases, and webhooks. Use for full-stack implementation, hydration,
  routing, caching, performance, or resilient mutations. Preserve the installed stack,
  validate trust boundaries, finish visual UI styling, and verify relevant behavior without
  forcing a framework migration or decorative AI templates.
---

# Web Development

Deliver the requested behavior in the existing architecture with reliable data boundaries, deliberate UI styling, and evidence appropriate to the change.

## Establish context

Read repository instructions, relevant source, package versions, lockfiles, scripts, and runtime constraints. Use installed documentation/types or current official documentation for version-sensitive APIs. Do not treat a calendar year as an architectural requirement.

Reproduce the defect or identify the acceptance behavior before making a broad change. Preserve working conventions; introduce a dependency, abstraction, migration, or server/client boundary only for a concrete benefit.

## Implementation decisions

| Boundary | Required decision |
| --- | --- |
| Architecture | In an RSC-capable app, keep server-only data and secrets on the server and limit client boundaries to interaction needs. Do not impose RSC on other stacks. |
| External input | Parse and bound untrusted input with the project's validation tools; type assertions do not validate runtime data. |
| Authorization | Authenticate and authorize inside each callable mutation or handler. Page redirects, middleware/proxy, hidden fields, and opaque IDs do not establish ownership. |
| Data access | Parameterize values, scope queries to trusted identity/tenant, allowlist dynamic identifiers, and return minimal client-safe data. |
| Async work | Parallelize independent work; preserve genuine dependencies. Suspense does not make sequential requests parallel. |
| Mutation UI | Show pending and outcome clearly. Use optimistic state only when failure recovery is safe; distinguish a timeout from confirmed failure. |
| Concurrency | Enforce invariants in the database with constraints, transactions, conditional writes, or durable idempotency. A preflight existence check or disabled button is insufficient. |
| Caching | State freshness and isolation requirements. Verify the installed API and avoid shared caching of private user data. |
| Errors | Preserve user input, handle expected errors explicitly, log safely, and let framework control flow propagate as required. |
| Styling | Complete hierarchy, typography, spacing, states, and responsive fit. Do not add decorative colored dots, card accent stripes, ornamental lines, border beams, or filler visuals. |
| Performance | Measure a relevant bottleneck; distinguish lab results, field data, and an aspirational budget. Do not claim metrics from code inspection. |

Use native semantics and the established component system. Avoid fake product data or invented testimonials. Functional boundaries, chart markings, status labels, and focus indicators remain valid.

## Routed references

| Task | Read |
| --- | --- |
| React state, forms, optimistic UI, rendering boundaries | [frontend.md](references/frontend.md) |
| Next.js actions, request APIs, caching, invalidation | [nextjs.md](references/nextjs.md) |
| Webhooks, durable retries, concurrency, connection handling | [backend.md](references/backend.md) |
| Measuring and improving loading, responsiveness, stability | [web-performance.md](references/web-performance.md) |

## Completion

Run relevant existing checks and a meaningful regression when a defect or invariant warrants one. Inspect UI changes in the running preview at representative sizes and affected states; fix visible craft defects. Do not create tests that only mirror an implementation detail or run unrelated suites indefinitely.

Report the concrete result, relevant verification, and material limits. Use **Verified**, **Inferred**, **Assumed**, and **Not run**. A passing build does not prove visual polish, production security, or field performance.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
