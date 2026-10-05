# Debugging: from symptom to cause

Read for a regression, an intermittent failure, an environment mismatch, a slow request, or a production incident. Choose the next observation that most cheaply separates the plausible causes.

## The loop

1. **Describe.** Write the expected behavior, the observed behavior, the exact input and actor, the revision, the environment, and the timing. One sentence each.
2. **Reproduce.** Aim for a minimal, deterministic reproduction. When that is not possible (a race, an incident), preserve logs, traces, request ids, and timestamps, state the uncertainty, and keep going. Never block containment on a perfect reproduction.
3. **Localize.** Find the first place the value or control flow diverges from what you expect, not the last place an error appears. Halve the path (inspect at boundaries), run `git bisect` for regressions, compare working and failing environments, and shrink the input until it stops failing.
4. **Hypothesize.** State a falsifiable claim ("if X is the cause, then Y is visible at Z") and run the cheapest experiment that could disprove it. Change one variable at a time.
5. **Fix the cause** with the narrowest complete change, then check other callers that share the mechanism. Do not assume all similar-looking code is defective.
6. **Prove it.** Rerun the reproduction, add a regression test when it can detect the defect ([testing.md](testing.md)), remove temporary probes, and label any remaining environmental gap.

A stack trace shows where the failure surfaced, not why. Follow your own frames and the original error `cause`; do not replace a specific error with a generic message.

## Tools by symptom

Find the commit that introduced a regression (the command must exit non-zero when the bug is present):

```bash
git bisect start
git bisect bad                         # the current commit is broken
git bisect good v1.4.0                 # a commit known to be fine
git bisect run npm test -- path/to/failing.test.ts
git bisect reset
```

Inspect a running service:

```bash
curl -i -sS -X POST http://localhost:3000/api/items -H 'content-type: application/json' -d '{"name":"x"}'   # status, headers, body
curl -v https://example.com/health                  # request headers, redirects, TLS handshake
node --inspect-brk dist/server.js                   # attach Chrome DevTools or an IDE debugger
node --trace-warnings dist/server.js                # where warnings and deprecations originate
NODE_DEBUG=http,net node dist/server.js             # low-level HTTP and socket tracing
```

Find slow, blocked, or stuck queries in PostgreSQL:

```sql
SELECT pid, state, wait_event_type, wait_event,
       now() - query_start AS running, pg_blocking_pids(pid) AS blocked_by, left(query, 120) AS query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY running DESC;
```

In the browser: Network panel with cache disabled and "preserve log", Application panel for cookies, storage, and service workers (a stale service worker explains many "my fix does nothing" reports), Performance panel for long tasks, Console for errors. Check `Set-Cookie` attributes (`Secure`, `SameSite`, `Domain`, `Path`) when a session does not stick. Look for a process already holding a port with `lsof -i :3000` (macOS and Linux) or `netstat -ano | findstr :3000` (Windows).

## Compare environments

| Axis | What to compare |
| --- | --- |
| Data | Volume, nulls, legacy rows, encodings, permissions |
| Configuration | Presence of variables (by name, redacted value fingerprints), flags, service versions |
| Build | Dev versus production build, bundling, minification, generated artifacts, build-time inlined variables |
| Timing | Cold starts, timeouts, rate limits, resource saturation |
| Concurrency | Request ordering, parallel writes, shared mutable state |
| Caching | Browser, CDN, framework, object cache, invalidation |
| Platform | Filesystem case sensitivity, path separators, runtime and OS versions |
| Time | DST, UTC versus local dates, locale parsing, clock drift |

Treat cache clears, restarts, and fresh sessions as controlled experiments, and capture evidence first. A symptom that disappears after a restart is not a fix.

## Frequent root causes

| Symptom | Likely cause | Check |
| --- | --- | --- |
| Works locally, fails in production | Missing or different environment variable; a variable inlined at build time; case-sensitive filesystem; different Node version; production-only minification; `Secure` cookies behind a proxy that hides HTTPS | Compare config by name, build mode, runtime version, `X-Forwarded-Proto` handling |
| Intermittent 500s or timeouts | Connection-pool exhaustion, unawaited promise, race, dependency without a timeout, memory pressure | Pool metrics, unhandled-rejection logs, latency of each outbound call |
| One user sees another user's data | Cache key missing tenant or user; module-level mutable state in server code; a CDN caching a personalized response | Cache key inputs, `Cache-Control`/`Vary`, globals on the server |
| Hydration mismatch | Time, randomness, locale, or `window` used while rendering; invalid HTML nesting | The first differing node in the warning. Fix the cause; use `suppressHydrationWarning` only for content that is meant to differ (a timestamp) |
| Stale UI after a change | Cache not invalidated, wrong query key, optimistic update never reconciled, service worker | Invalidation call, key equality, Application panel |
| Infinite re-render or effect loop | Effect updates its own dependency; unstable object or function dependency; state set during render | Dependency array and what each run changes |
| "Cannot read properties of undefined" | Data-shape assumption or a race; optional chaining hiding the real defect | Where the value first becomes undefined |
| Date off by one day | Date-only string parsed as UTC then shown in local time; DST; `toISOString()` on a local date | Time zone of parse and of display |
| Amount off by cents | Floating point or inconsistent rounding; wrong minor-unit assumption | Types and rounding at each step |
| Memory keeps growing | Listeners or timers never removed; unbounded cache or map; closures retaining large objects | Heap snapshots over time |
| Slow endpoint | N+1, missing index, sequential awaits, huge payload, outbound call without timeout, lock contention | Query count and plans, timing per span |
| Webhook never arrives | Wrong endpoint or secret per environment; signature verified on parsed body; non-2xx replies; provider disabled the endpoint after failures | Provider delivery log, raw-body handling, response codes |
| Login redirect loop | Cookie not stored (domain, path, `Secure`, `SameSite`), redirect URL mismatch, clock skew on a token, session store unavailable | Response `Set-Cookie`, then the next request's `Cookie` |
| 404 on page refresh in a single-page app | Server lacks a history fallback to `index.html` | Hosting rewrite rule |
| CORS error | Preflight not handled, credentials with a wildcard origin, or a server error hidden behind a missing CORS header | Server logs for the real status |

## Instrumentation

Log operation ids, types, bounded sizes, timing, and safe state transitions. Redact credentials, personal values, and full request bodies. Add temporary probes only where they separate hypotheses, then remove them or turn them into intentional structured diagnostics before delivery. A delay is not synchronization: await the real event or condition. When adding context to an error, keep the original with `new Error('message', { cause: error })`.

## Incident mode

1. Assess impact, then take authorized, reversible containment: rollback, feature flag, reduced traffic, or a known safe fallback.
2. Preserve the minimum useful evidence when that does not delay containment. Never require a full copy of a production database to begin diagnosis.
3. Verify you are acting on the affected target. Confirm the mitigation reduced impact with service and business signals, not only a finished deploy.
4. Diagnose the mechanism from preserved evidence, implement the durable fix, and check for recurrence.
5. Hand off:

```markdown
**Impact:** who and what, since when (UTC), how it was measured
**Containment:** action taken and the signal that confirmed it worked
**Cause:** the mechanism and its evidence, or "unknown; leading hypothesis is ..."
**Fix:** the change and how it was verified
**Follow-ups:** detection gap, tests, runbook updates
**Uncertainty:** what is still unproven
```

## Report

State whether you reproduced the problem, the evidence, which hypotheses you ruled out, the fix, how you verified it, and what remains uncertain.
