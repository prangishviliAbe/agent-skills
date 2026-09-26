# Delivery: scope, verification, and handoff

Read for nontrivial planning, shared contracts, review, or release handoff. A local edit usually needs a brief acceptance statement and focused verification, not a separate planning artifact.

## Establish the contract

Identify who can do what, the visible result, and which existing behavior must remain. Recover constraints from the request, tests, callers, schema, and project instructions. Do not infer that a confusing implementation is the intended policy.

| Choice | Action |
| --- | --- |
| Recoverable implementation detail | Follow the existing convention and proceed |
| Ambiguity changes product behavior or a public contract | Present the concrete alternatives and get the missing decision; continue independent work |
| Action already authorized in the session | Carry it through within that target and scope |
| Consequential live mutation with missing authorization | Prepare the diff, affected target, verification and recovery procedure before asking |
| Environment cannot run a needed check | Complete available work, record the limit, and give the exact remaining check |

Preserve uncommitted work. Do not reset, stash, reformat, or regenerate unrelated files to manufacture a clean workspace. Inspect generated changes and lockfile diffs just as carefully as source changes.

## Inspect enough of the system

Start with applicable instructions, manifest/lockfile, relevant config, affected code and tests. Expand to callers and integration points when the contract changes. Read sensitive configuration by key names or redacted values; avoid dumping secret-bearing files into logs.

For a shared change, identify:

- API consumers, schema readers/writers, serialized formats, and cache keys.
- Deployed versions that may coexist during rollout.
- Error and retry behavior consumers rely on.
- Whether data needs migration, backfill, versioning, or an explicit compatibility period.

Keep required changes and necessary enabling refactors in the diff. Mention unrelated improvements only when they matter; do not bury the handoff in a backlog of observations.

## Choose evidence for the failure mechanism

| Concern | Useful evidence |
| --- | --- |
| Layout or interaction | Render at relevant viewport sizes; keyboard/focus check for changed controls |
| Pure logic | Boundary cases and a meaningful invariant |
| API contract | Request/response exercise including invalid input and affected callers |
| Authorization | Allowed actor succeeds; forbidden actor cannot read or change the object |
| Cache | Write → read freshness, key isolation and invalidation behavior |
| External write | Duplicate delivery, timeout ambiguity, reconciliation and supported idempotency |
| Migration | Old/new code compatibility, resumability, lock/runtime estimate and recovery |
| Performance | Same workload/tool before and after; distinguish lab results from field data |

Use existing project checks. Broaden tests when shared callers, failures, or unresolved risks warrant it. A check that cannot observe the changed behavior is not evidence for that behavior. Synthetic fixtures are valid when they exercise the real contract; production data is not a prerequisite.

For regressions, make the check fail against the old behavior when feasible using an isolated fixture or temporary checkout. Do not revert unrelated user changes to demonstrate a failure. Small copy/style changes do not need tests that merely assert their new wording or CSS values.

## Review the final diff

Check against the task and observed failure, not a universal rewrite checklist:

- Error branches cannot silently fall through to success; asynchronous work is awaited or deliberately supervised.
- Valid falsy values, date-only values, time zones, currency precision and limits retain intended meaning.
- Access scope survives serialization, caching, jobs, and alternate routes.
- Growing datasets have bounded work or deliberate streaming/batching; avoid accidental N+1 requests.
- Shared contracts, generated artifacts and migrations agree; deployment order is viable.
- No debug credentials, temporary files, unrelated lockfile churn, or accidental formatting changes remain.

## Handoff

Lead with the result and its verification status. For a small edit, one paragraph can be enough. For a substantive change, include the reason, relevant locations, checks actually run with outcomes, and material operational limits.

Use accurate labels: `passed`, `failed`, `not run`, `inferred from code`, `verified locally`, `deployed and checked`. Summarize output rather than pasting long logs. Preserve enough command and environment detail for a teammate to repeat important checks. Do not imply a local build proves a live release.
