---
name: web-development
description: Build, debug, refactor, and review websites, web apps, APIs, WordPress plugins and themes, and integrations. Use for implementation and delivery work involving React, Next.js, TypeScript, Node.js, WooCommerce, databases, caching, or web deployment; preserve the existing stack and verify the changed behavior.
---

# Web Development

Deliver the requested web behavior in the existing system, with evidence proportional to the change. Preserve product intent, public contracts, user edits, and operational constraints. Distinguish implemented, verified, and deployed work.

## Operating rules

1. **Inspect before changing.** Read applicable project instructions, the affected code and callers, manifests, and available checks. Check the working tree; integrate with existing edits without overwriting them.
2. **Use the installed contract.** Resolve uncertain APIs from local types/source or official documentation for the installed version. Do not upgrade frameworks or replace the stack merely to fit a familiar solution.
3. **Keep the change coherent.** Include necessary callers, data changes, and failure handling; leave unrelated cleanup alone. Add dependencies when their maintained capability justifies cost, not according to a line-count rule.
4. **Enforce trust at the receiving boundary.** Protected server operations validate input and authorize actor, action, and resource. Client checks support usability. Public operations still need input and abuse controls appropriate to their purpose.
5. **Protect sensitive material.** Keep secrets out of client bundles, logs, screenshots, and commits. Report an exposure by location and arrange scoped rotation; do not print the value or silently rotate unrelated credentials.
6. **Preserve authorization.** Existing instructions can authorize pushing, deploying, or data changes. Do not invent a new approval gate. When a consequential action lacks authorization or its target is ambiguous, prepare the concrete change and recovery plan before requesting the missing decision.
7. **Bound side effects.** A timeout does not prove a write failed. Reconcile an uncertain result before retrying; retry only when the operation or its idempotency mechanism makes duplication safe.
8. **Report evidence accurately.** A passing build is not a runtime check; a local fix is not a deployment. State unavailable checks and remaining uncertainty without fabricating success or leaving independent work unfinished.

## Procedure

1. **Identify the mode.** Implement, debug, review, architecture, or release. A review produces findings; an architecture request produces decisions and tradeoffs. Neither implies unrequested edits or deployment.
2. **Frame the result.** Establish the observable behavior and relevant constraints. Use a brief assumption for a recoverable choice; ask only about ambiguity that changes the product, contract, cost, or irreversible effects.
3. **Trace the affected path.** Inspect the relevant UI, request, validation, access policy, persistence, cache, and response. Expand to other callers when a shared contract changes. Do not inventory the entire system for a local edit.
4. **Choose verification.** Select checks from the risk table before making a substantive change. Use repository scripts and existing test patterns; account for the environment and service access actually available.
5. **Implement or investigate.** Fix the cause, preserve compatibility, and handle relevant loading, error, permission, and retry states. Use synthetic data or approved test accounts for exercising behavior.
6. **Verify and inspect the diff.** Run the checks that can detect the likely regression. Review scope, secrets, error propagation, access scope, concurrency, and compatibility. Stop repeating checks once evidence is sufficient unless something changed.
7. **Finish the authorized delivery.** Update necessary docs or contracts, perform authorized release steps, and report the outcome, actual checks, and any unverified boundary. A blocked live action need not block a complete local change.

## Verification by risk

These are decision criteria, not a requirement to create a test suite for every edit. Explain meaningful gaps; do not replace a failed required project check with a weaker check and call it passed.

| Change | Evidence to seek |
| --- | --- |
| Copy, spacing, static asset | Inspect the diff and affected rendering at relevant sizes; no new automated test solely to mirror the edit |
| Local component or logic | Focused test or runtime exercise of the behavior; type/lint checks when they can catch a relevant defect |
| Shared API, data layer, rendering contract | Affected callers, positive and negative cases, targeted tests and relevant build/type checks; repository-required checks |
| Authentication, money, concurrent writes, migration, production operations | Access boundaries, replay/concurrency or data-integrity checks as applicable, compatibility and recovery plan; staged or dry-run evidence when feasible |
| Diagnosis without a runnable environment | Code/log/config evidence, explicit hypotheses, and a reproducible verification procedure; label runtime behavior unverified |

For bugs, reproduce first when feasible. For intermittent failures or incidents, use captured evidence and safe containment while narrowing the cause. Add a regression test where it protects meaningful behavior; do not make impossible deterministic reproduction a prerequisite to useful work.

## Reference map

Read only references relevant to the affected boundary.

| When the task involves | Read |
| --- | --- |
| Scoping, compatibility, verification selection, handoff | [delivery.md](references/delivery.md) |
| React, Next.js, forms, accessibility, performance, SEO | [frontend.md](references/frontend.md) |
| APIs, validation, SQL, migrations, caching, jobs and webhooks | [backend.md](references/backend.md) |
| WordPress, WooCommerce, Elementor, plugins and themes | [wordpress.md](references/wordpress.md) |
| Regressions, intermittent failures, production incidents | [debugging.md](references/debugging.md) |
| Configuration, CI, deployment, monitoring, recovery | [operations.md](references/operations.md) |

## Failure modes

| Failure | Correct move |
| --- | --- |
| Rebuilding a subsystem to fix one bug | Trace the cause and change its required callers only |
| Copying an API from another framework version | Check the installed source/types and versioned official docs |
| Treating a mock response as a completed integration | Wire the real contract or label the remaining boundary explicitly |
| Retrying a timed-out payment with a new key | Retrieve the original operation or replay the same supported key |
| Catching an error and returning success | Preserve error semantics and a user-recoverable path |
| Broadening a cache to improve hit rate | Preserve tenant, actor, locale, and authorization scope as relevant |
| Running every available check after a text edit | Select checks that can detect the actual regression |
| Declaring completion from code inspection alone | Separate implementation status from runtime evidence |

## Definition of done

Apply each item to the requested mode; explicitly mark a material item as unverified when the environment prevents it.

- [ ] The requested behavior, finding, or design decision is delivered within scope.
- [ ] Relevant callers, access rules, contracts, and failure paths are accounted for.
- [ ] Appropriate available checks ran; their outcomes and any required blocked checks are recorded.
- [ ] The final diff preserves user work and contains no accidental sensitive data or unrelated edits.
- [ ] Authorized delivery steps are completed, or the exact remaining blocker is stated.
- [ ] The handoff distinguishes observed results, assumptions, and residual risk.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
