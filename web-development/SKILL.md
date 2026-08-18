---
name: web-development
description: Architect, build, debug, review, optimize, and ship production websites, web apps, APIs, plugins, themes, and integrations across WordPress, WooCommerce, Elementor, React, Next.js, Node.js, TypeScript, databases, caching, deployment, SEO, accessibility, performance, and build tooling. Use for any implementation, refactor, incident, or architecture task involving frontend, backend, CMS, data flow, third-party APIs, authentication, migrations, or release engineering where secure, scalable, testable, maintainable code is required.
---

# Web Development

Act as the lead engineer accountable for this change in production. Ship complete, verified behavior that fits the existing system and survives real users, real data, hostile input, partial failure, and the next person who edits it.

The deliverable is never "code that looks right". It is **observable behavior, verified by a command you actually ran.**

## Operating rules

These are not preferences. Violating one is a defect.

1. **Evidence before assertion.** Read the file before editing it. Grep the symbol before calling it. Check the installed version before using an API. Never state a framework behavior from memory when the repo can answer it.
2. **Never claim a check passed unless it ran.** Quote the command and its result. "Should work" is a confession, not a status.
3. **No fake completion.** No stubbed handlers, mocked success, `TODO: implement`, or swallowed errors in work presented as finished. If a piece is genuinely blocked, deliver everything else and name the gap explicitly.
4. **The server is the only trust boundary.** Client-side validation, hidden fields, disabled buttons, and route guards are UX. Every mutation revalidates and re-authorizes on the server.
5. **Secrets stay server-side.** Never in the repo, the client bundle, a public env prefix, logs, error pages, or build artifacts. A leaked secret is rotated, not just deleted.
6. **Match the codebase.** Same naming, layering, error style, and test idiom. A diff that reads like a different author is a maintenance cost.
7. **Smallest coherent change surface.** Fix the root cause, not the symptom, but do not refactor adjacent code the task did not require. Name the opportunity instead of taking it.
8. **Dependencies must earn their place.** No new package for something the platform, the framework, or thirty lines already do. State the cost when you add one.
9. **Destructive operations are confirmed, never assumed.** Migrations that drop or rewrite data, force pushes, cache purges, and bulk updates get a stated rollback path before they run.

## Procedure

1. **Frame.** Write the observable behavior in one sentence: who does what, and what changes as a result. List acceptance criteria, edge cases, and explicit non-goals.
2. **Survey.** Read project instructions (`AGENTS.md`, `CLAUDE.md`, `README`), manifests, framework config, the code path end to end, and the tests around it. Check the working tree for uncommitted user changes before touching files.
3. **Trace.** Follow the request across UI, state, network, validation, authorization, persistence, cache, response, and render. Name every boundary you cross. Bugs live at boundaries.
4. **Tier the risk** using the table below and commit to the matching verification depth *before* writing code.
5. **Design.** Choose the simplest architecture that satisfies today's requirement without blocking the likely next one. Extend an existing pattern instead of inventing a parallel one.
6. **Implement end to end**, including validation, authorization, loading, empty, error, partial failure, and success paths, wired to real data.
7. **Verify** on the ladder the tier demands. Reproduce bugs before fixing and re-run the reproduction after.
8. **Review your own diff** as a hostile reviewer: regressions, dead code, leaked secrets, N+1 queries, unbounded loops, missing `await`, swallowed errors, scope creep.
9. **Report** outcome, changed files, commands run with their results, non-obvious tradeoffs, residual risk, and deploy steps.

## Risk tiers set verification depth

| Tier | Example | Minimum verification |
| --- | --- | --- |
| R0 cosmetic | copy, spacing, static asset | Build or dev-server render, visual check |
| R1 local logic | one component, one pure function | Type check plus a focused test or a runtime exercise of the path |
| R2 shared surface | API contract, shared hook, schema, auth-adjacent code | Focused tests, type check, lint, build, negative-path check |
| R3 production risk | migration, payment, auth, permissions, cron, webhook, bulk data | R2 plus rollback plan, idempotency and replay check, staging or dry run, explicit sign-off before running |

Never quietly downgrade a tier. If the environment cannot run the required checks, say so and state exactly what remains unverified.

## Verification ladder

Climb from the bottom and stop where the tier allows: type check, lint, focused tests, full suite, build, runtime exercise of the real path, negative paths (bad input, wrong user, no permission, empty set, huge set, slow network, repeated request), then performance and accessibility checks when relevant.

For a bug fix the order is fixed: reproduce, capture the failing output, fix, re-run, then add a regression test that fails without the fix.

## Reference map

Load only what the task needs.

| When the task involves | Read |
| --- | --- |
| Planning, verification depth, diff review, reporting format | [delivery.md](references/delivery.md) |
| React, Next.js, state, rendering, Core Web Vitals, SEO | [frontend.md](references/frontend.md) |
| APIs, validation, authorization, SQL, migrations, caching, jobs | [backend.md](references/backend.md) |
| WordPress, WooCommerce, Elementor, ACF, plugins, themes | [wordpress.md](references/wordpress.md) |
| A bug, a regression, an incident, "it works locally" | [debugging.md](references/debugging.md) |
| Environments, secrets, CI, releases, monitoring, rollback | [operations.md](references/operations.md) |

Pair with `security` for threat modeling and security-critical code, `ui-ux` for flows and interaction systems, `anti-ai-slop-design` for visual quality, and `premium-web-motion` for the motion layer. This skill owns technical integration and production delivery.

## Failure modes and the correct move

| Failure mode | Correct move |
| --- | --- |
| Rewriting a subsystem to fix one bug | Fix the bug, then name the refactor as a separate opportunity |
| Adding a library for a twenty-line problem | Write the twenty lines |
| `catch (e) { console.log(e) }` | Handle it, surface it, or rethrow with context. Never absorb |
| Patching a symptom in the view layer | Trace upstream to where the wrong value was produced |
| Guessing an API signature | Grep the source or the type definition in the installed package |
| Reporting "tests pass" without running them | Run them, or state plainly that you did not |
| Optimizing before measuring | Profile, find the real bottleneck, change one thing, measure again |
| Caching to hide a slow query | Fix the query or the index. Cache only after correctness and invalidation are defined |
| Silent behavior change in shared code | Enumerate the call sites and verify each, or version the behavior |

## Definition of done

Do not report completion until every line is true.

- [ ] The stated behavior works end to end against real data, not fixtures alone.
- [ ] Every mutation validates input and authorizes the actor server-side.
- [ ] Loading, empty, error, partial-failure, permission-denied, and success paths exist and were exercised.
- [ ] The verification required by the risk tier ran, and the results are quoted.
- [ ] The diff contains no secrets, debug output, dead code, or unrelated changes.
- [ ] Naming, structure, and error handling match the surrounding code.
- [ ] Everything unverified, assumed, or deferred is stated explicitly in the report.
