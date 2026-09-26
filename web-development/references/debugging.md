# Debugging: evidence to cause

Read for a regression, intermittent failure, environment mismatch or incident. Choose the next observation that most cheaply distinguishes plausible causes.

## Investigation loop

1. Record expected and observed behavior, exact input/actor, revision, environment and timing. Attempt a minimal reproduction when safe.
2. If reproduction is intermittent or unavailable, preserve logs, traces and conditions; state the uncertainty and continue evidence-based analysis. Do not block incident containment on deterministic reproduction.
3. Trace the value or control decision through the relevant boundaries. Find the first observed divergence, not merely the last place an error appears.
4. Form a falsifiable hypothesis and choose a discriminating check. Change one relevant variable at a time when feasible; do not impose literal halving on every investigation.
5. Implement the narrowest complete fix. Rerun the original reproduction or the closest justified check and label any remaining environmental gap.
6. Add a regression test when it can detect the defect and offers durable value. Check alternate callers with the same mechanism; do not infer that all similar-looking code is defective.

A stack trace points to the failed operation, not necessarily the root cause. Follow owned frames and original error causes. For async failures, correlate the enclosing operation rather than replacing the cause with a generic message.

## Environment differences

| Axis | Evidence to compare |
| --- | --- |
| Data | Volume, nulls, legacy records, encoding and permissions |
| Configuration | Presence and redacted fingerprints of relevant values; flags and service versions |
| Build | Dev versus production behavior, bundling, minification, generated artifacts |
| Timing | Cold starts, delays, timeouts, rate limits and resource saturation |
| Concurrency | Request ordering, simultaneous writes and shared mutable state |
| Caching | Browser, CDN, page/object cache, framework cache and invalidation |
| Platform | Filesystem case, path separators, runtime version and process environment |
| Time | DST, UTC versus local dates, locale parsing and clock drift |

Use cache clearing, restarts and fresh sessions as controlled experiments when warranted. Capture evidence first; a symptom disappearing after a restart does not establish a permanent fix. Do not rebuild dependencies or purge production caches without considering scope and effects.

## Instrumentation

Log operation IDs, types, bounded sizes, timing and safe state transitions. Redact credentials, personal values and full request bodies. Add temporary probes only where they separate hypotheses; remove them or convert them into intentional structured diagnostics before delivery.

Use a debugger for control flow, network traces for contracts, and profilers for performance. A delay is not a synchronization primitive: await the actual event, completion or condition. Preserve the original error with a supported cause mechanism when adding context.

## Incident mode

1. Assess impact and identify authorized reversible containment: rollback, feature flag, traffic reduction or a known safe fallback.
2. Preserve minimal useful evidence when that does not materially delay urgent containment. Never require copying a full production database merely to begin diagnosis.
3. Verify the affected target and execute within existing incident authority. Confirm the mitigation reduced impact using service and business signals.
4. Diagnose the mechanism from preserved evidence, implement the durable correction, and check for recurrence.
5. Hand off cause, impact, actual recovery status, detection gap and remaining uncertainty. Do not claim the incident resolved solely because a deployment completed.
