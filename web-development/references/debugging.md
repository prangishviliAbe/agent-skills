# Systematic debugging

Read when: Diagnosing a defect, a flaky test, a production incident, or any "it doesn't work" where the cause is not yet known.

Debugging is narrowing, not guessing. Each step should cut the space of possible causes roughly in half and end in an observation, not an opinion.

## Method

1. **State the symptom exactly.** What was done, what was expected, what happened instead, where (environment, browser, user, data), and since when. "Broken" is not a symptom.
2. **Reproduce.** Get the failure to happen on demand with the smallest input. If it cannot be reproduced, gather evidence (logs, traces, the exact request) before changing anything.
3. **Read the actual error.** The first error in the log, the full stack trace, the response body, the exit code. Later errors are often consequences.
4. **Locate by bisection.** Split the path between input and symptom and check the middle: is the value correct at the API boundary? In the database? Before rendering? Use `git bisect` when it used to work.
5. **Form one hypothesis and test it** with an observation that would prove it wrong: a log line, a breakpoint, a minimal script, a query. Change one thing at a time.
6. **Find the root cause.** Ask why the faulty state was possible, not only where it surfaced. A null check at the crash site usually hides the bug.
7. **Fix, then prove.** The reproduction now passes; the neighboring cases still pass; add a regression test at the level where the bug lived.
8. **Remove the scaffolding.** Debug logs, temporary flags, commented-out code.

## Where to look first

| Symptom | Check |
| --- | --- |
| Works locally, fails in production | Environment variables, build-time versus runtime config, Node or PHP version, case-sensitive paths, missing migration, CORS, HTTPS-only cookies, time zone |
| Hydration mismatch | Rendering that depends on time, locale, random values, `window`, or user data on the server; invalid HTML nesting; browser extensions |
| Stale or wrong data after a write | Cache not invalidated; optimistic state not reconciled; reading a replica; an older response arriving last |
| Works once, fails on repeat | Leaked state between requests or tests; missing cleanup; idempotency |
| Intermittent failure | Race condition, unawaited promise, ordering assumption, timeout, shared mutable state, test depending on another test |
| "Undefined is not a function" after an upgrade | API changed between versions; read the changelog and installed types |
| 401 or 403 | Token missing or expired, cookie not sent (SameSite, domain, secure), wrong audience, authorization check on the wrong identifier |
| 500 with no detail | Server logs, not the browser; the first exception |
| Slow endpoint | Query count and plans (N+1, missing index), sequential awaits, payload size, cold start |
| Layout broken at one width | An element with fixed width or `nowrap`; flex or grid child missing `min-width: 0`; long unbroken string |
| Build fails only in CI | Lockfile drift, missing environment variable, different OS or Node version, cached artifacts |
| Flaky end-to-end test | Waiting on time instead of state; animation; shared account or data; network dependency |

## Tools by layer

| Layer | Observe with |
| --- | --- |
| Browser | Console (first error), Network panel (request, response, status, timing, cookies), Elements (computed styles), Performance panel |
| Framework | Dev overlay, server console, React or Vue devtools, verbose logging flags |
| API | A direct request with `curl` or an HTTP client, outside the UI, with the same headers |
| Server | Structured logs with a request ID, stack traces, a debugger or targeted log lines |
| Database | The actual query and its parameters, `EXPLAIN`, row counts, constraint errors |
| Version control | `git log -p` on the file, `git bisect`, `git blame` for the intent of a line |

```bash
git bisect start
git bisect bad                 # current commit shows the bug
git bisect good v1.4.0         # last known good tag or commit
# test each commit git checks out, then mark it:
git bisect good                # or: git bisect bad
git bisect reset               # when finished
```

## Rules

- Do not change code to "see if it helps" without a hypothesis. Each such change adds a variable.
- Do not fix the test instead of the code unless the test's expectation is demonstrably wrong; if so, say why.
- Do not catch and ignore an error to make a symptom disappear.
- Do not retry a failing non-idempotent operation while investigating in production.
- Never print secrets or full personal data while logging; use synthetic values.
- After about three failed hypotheses, stop and re-read the evidence from the top; an assumption made early is probably wrong.
- When the cause is in a dependency, confirm with a minimal reproduction, check its issue tracker and changelog for the installed version, and prefer upgrading or configuring over patching.

## Report

```text
Symptom:      Saving a shipment clears the form and shows no error (production only).
Reproduced:   Yes, with an address longer than 120 characters.
Root cause:   API returns 422; the client treats any non-200 as success and resets state.
Fix:          Handle non-2xx: keep values, show the field error from the response.
Proof:        Reproduction now shows the error and keeps input; added a test for 422.
Not run:      Safari on iOS.
Follow-up:    Server limit (120) and client limit (255) disagree; aligned to 120.
```
