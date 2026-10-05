---
name: web-development
description: >-
  Build, fix, review, refactor, and ship web software in the existing stack: React, Next.js, and
  TypeScript front ends; Node, Python, and PHP back ends; REST and GraphQL APIs; SQL databases and
  migrations; payments, webhooks, and third-party integrations; forms and sign-in flows; WordPress
  and WooCommerce plugins and themes; CI, deploys, and incident debugging. Use whenever the user
  wants a feature implemented, a bug or flaky test diagnosed, a slow page or query sped up, a diff
  or pull request reviewed, a framework upgraded, or a release prepared, including vague asks like
  "make this work" or "why is this broken". Reads the project first, uses the installed versions'
  real APIs, protects secrets and data, and proves behavior by running it before reporting.
---

# Web Development

Deliver working web behavior inside the project that exists: its stack, conventions, contracts, and half-finished edits. A change is done when you can say what you ran and what it showed.

## How to work

1. **Orient before touching anything.** Read project instructions (AGENTS.md, CLAUDE.md, CONTRIBUTING, README), the manifest and lockfile, the available scripts, the files you will change and their callers, and `git status`. Find the closest existing example of what you are building and match its shape. Diffs that look native get merged; clever ones get rewritten.
2. **Use the installed contract, not memory.** Take versions from the lockfile, then read docs for that version: bundled docs (Next.js 16 ships them in `node_modules/next/dist/docs/`), type definitions, `--help`, or versioned official docs. APIs change between majors, and remembered APIs are the most common source of confident, broken code.
3. **Define done as observable behavior.** State one success path and the most likely failure path as given/when/then. For a bug, reproduce it first and keep the reproduction as the regression test.
4. **Enforce trust at the server boundary.** Authenticate, then authorize (actor, action, this specific resource), then validate shape and bounds, then act. Identity comes from verified credentials, never from a request field; scope every query by owner or tenant. Client checks are usability, not protection.
5. **Make writes safe to repeat.** Back invariants with unique constraints, transactions, or conditional updates, and give external side effects an idempotency key. After a timeout the outcome is unknown: look the operation up before retrying.
6. **Treat secrets as radioactive.** Refer to them by variable name, never print values, and keep them out of client bundles (`NEXT_PUBLIC_*`, `VITE_*` and similar are public), logs, commits, and screenshots. If one is exposed, report the location and arrange scoped rotation.
7. **Make the smallest complete change.** Fix the cause and update every caller, type, test, doc, and migration it touches, and nothing else. No drive-by refactors, reformatting, or new dependencies without a stated reason. Preserve the user's uncommitted work.
8. **Act within the authority you have.** Do what the request and standing instructions allow (edit, commit, push, deploy, migrate); do not add approval gates the user did not ask for, and do not stretch an approval past its target. When a live or destructive step lacks authorization or its target is ambiguous, finish everything reviewable (diff, plan, rollback), then ask for that one decision.
9. **Verify the way a user would meet the failure.** Run the project's tests, types, lint, and build, then exercise the behavior itself: open the page and look, call the endpoint with a valid and an invalid request. Never weaken or delete a failing check to get green.
10. **Report with labeled evidence.** Use *Verified* (ran it, saw the result), *Inferred* (read the code), *Assumed*, and *Not run*. A passing build is not a runtime check, and a local fix is not a deployment.

## Pick the mode

| Request | Mode | Deliver | Start with |
| --- | --- | --- | --- |
| Add or change a feature | Build | Working change, tests, handoff | The reference for the layer you touch |
| Broken, flaky, or slow | Diagnose | Evidence-backed cause, fix, regression guard | [debugging.md](references/debugging.md), then the layer |
| Review a diff, PR, or file | Review | Ranked findings with `path:line` and a fix; no edits unless asked | [delivery.md](references/delivery.md) review checklist |
| Upgrade, refactor, migrate | Change without behavior change | Proof of equivalence, staged steps, rollback | [delivery.md](references/delivery.md), [testing.md](references/testing.md), [database.md](references/database.md) |
| Choose a design or technology | Decide | Options, tradeoffs, recommendation, what would change it | [delivery.md](references/delivery.md) decision record |
| Deploy, CI, environment, incident | Operate | Release and rollback plan, evidence of the target's state | [operations.md](references/operations.md) |

## The loop

1. **Frame.** Restate the outcome and constraints in two lines. List unknowns that would change the design. Ask only about product behavior, public contracts, cost, or irreversible effects; otherwise state a reversible assumption and continue.
2. **Trace.** Follow the affected path end to end: UI, request, validation, access policy, persistence, cache, response. Widen to other callers only when a shared contract changes.
3. **Plan the proof.** Choose the checks from the table below before editing, so the change is shaped to be checkable.
4. **Change.** Fix the cause. Handle the loading, error, empty, permission, and retry states the path really has.
5. **Prove.** Run the checks, then read your own diff as a reviewer would: unintended files, secrets, swallowed errors, widened access, unbounded queries, N+1, race windows, compatibility breaks.
6. **Hand off.** Result first, then evidence and limits (template in [delivery.md](references/delivery.md)).

## Evidence by change type

Pick checks that can detect the regression you are worried about. Explain gaps; never substitute a weaker check for a failed required one.

| Change | Minimum evidence |
| --- | --- |
| Copy, spacing, static asset | Diff, plus rendering at 375, 768, and 1280 px when layout can shift |
| Component or pure logic | Focused test or runtime run including one edge or failure case; type-check |
| Shared API, data layer, rendering contract | Affected callers, positive and negative cases, targeted tests, build and type checks, repository-required checks |
| Auth, money, concurrent writes, migration, production operations | Allowed and forbidden actor; duplicate, replay, and concurrent case; integrity check and recovery plan; dry run or staging when feasible |
| No runnable environment | Code, log, and config evidence; explicit hypotheses; a reproducible procedure; runtime behavior marked *Not run* |

## Reference map

Read only what the task touches.

| When the task involves | Read |
| --- | --- |
| Orienting, scoping, review checklist, decision records, handoff, dependencies, git hygiene | [delivery.md](references/delivery.md) |
| React, forms, state and effects, TypeScript, CSS and Tailwind, accessibility basics | [frontend.md](references/frontend.md) |
| Next.js App Router: async request APIs, `proxy.ts`, Server Actions, Cache Components, deploy gotchas | [nextjs.md](references/nextjs.md) |
| Core Web Vitals, bundles, images, fonts, hydration, SEO | [web-performance.md](references/web-performance.md) |
| API design, validation, authorization scoping, errors, jobs, caching, rate limits, uploads | [backend.md](references/backend.md) |
| Payments, webhooks, OAuth sign-in, email, storage, any third-party API | [integrations.md](references/integrations.md) |
| Schema design, queries, indexes, transactions, pagination, migrations | [database.md](references/database.md) |
| Choosing and writing tests, Playwright, concurrency and time, flaky tests | [testing.md](references/testing.md) |
| Regressions, intermittent failures, environment mismatch, incidents | [debugging.md](references/debugging.md) |
| Environments, CI/CD, releases, rollback, monitoring, headers | [operations.md](references/operations.md) |
| WordPress, WooCommerce, Elementor, plugins, themes, REST, WP-CLI | [wordpress.md](references/wordpress.md) |

## Failure modes

| Failure | Correct move |
| --- | --- |
| Rebuilding a subsystem to fix one bug | Trace the cause; change it and its required callers only |
| Writing an API from memory of an older major | Check installed docs and types first (Next.js 16: `await cookies()`, `proxy.ts`) |
| "Fixing" a failing test by loosening or deleting it | Fix the code, or prove the test wrong and say so |
| Silencing the compiler or linter (`any`, `@ts-ignore`, `eslint-disable`) | Fix the type; if an escape hatch is unavoidable, narrow it and explain |
| Catching an error and returning success or an empty list | Propagate, or return an explicit error state with a recovery path |
| A mock or stub counted as an integration | Wire the real contract, or label the boundary *Not integrated* |
| Retrying a timed-out payment with a new idempotency key | Reuse the original key or look up the operation |
| Trusting a client-supplied price, role, user id, or tenant id | Derive or recompute it on the server |
| Protecting a route only in the UI (hidden button, layout redirect) | Authorize inside the handler or action itself |
| Unbounded list or query | Paginate with a maximum; index from the query plan |
| Cache key missing tenant, user, or locale | Include every input that changes the output, or do not cache |
| Hand-editing generated files, lockfiles, or snapshots | Regenerate with the project's command and review the diff |
| Running every check or none | Run what can detect this regression, then the required project checks once at the end |
| Declaring done from reading the code | Run it; label whatever you could not |

## Definition of done

- [ ] The requested behavior, finding, or decision is delivered within scope; the user's uncommitted work is intact.
- [ ] Failure, permission, and retry paths on the affected route are handled or explicitly out of scope.
- [ ] Checks that can detect the likely regression ran; results, including failures and skips, are recorded.
- [ ] The diff contains no secrets, debug leftovers, unrelated edits, widened access, or unbounded work.
- [ ] Docs, contracts, and migrations are updated where the change touches them.
- [ ] Authorized delivery steps are complete, or the single missing decision is named.
- [ ] The handoff separates Verified, Inferred, and Not run, and states residual risk.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
