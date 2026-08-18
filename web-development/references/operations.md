# Operations: environments, releases, monitoring, rollback

Read when configuring environments, handling secrets, setting up CI, planning a release, or defining what happens when it breaks.

## Configuration and environments

- Configuration comes from the environment. Code is identical across environments; only configuration differs.
- Keep at least three environments distinct — local, staging, production — with separate credentials, separate data, and separate third-party accounts. A staging job that writes to production data is a data-loss incident with a delay fuse.
- Validate configuration at boot with a schema and fail fast with a clear message. A missing variable must stop startup, never silently produce `undefined` in a URL.
- Never branch business logic on a hostname string. Use an explicit environment flag.
- Document every variable: name, purpose, required or optional, default, and which environments need it. Keep an `.env.example` in sync and never commit a real `.env`.

## Secrets

- Secrets live in a secret manager or the platform's encrypted store. Not in the repo, not in the client bundle, not in a public env prefix, not in a screenshot, not in a log line.
- Anything exposed to the browser is public. Prefixing a variable for client use publishes it.
- Rotation, not deletion, is the response to exposure: a secret committed and then removed is still in the git history and in every clone.
- Scope credentials to the least privilege that works: a read-only key for a read-only job, a per-service identity rather than one shared root token.
- Log redaction is a safety net, not a strategy: never pass a secret to something that logs its arguments.

## CI

Minimum useful pipeline, in order, failing fast:

1. Install with a lockfile (`ci`/`--frozen-lockfile`), never a loose resolve.
2. Type check.
3. Lint and format check.
4. Unit and integration tests.
5. Build.
6. Security checks: dependency audit, secret scan.
7. Optional: end-to-end tests on the critical path, bundle-size budget, Lighthouse or accessibility check.

Rules: the pipeline must be reproducible from a clean checkout, must not depend on a developer's machine state, and must not be routinely bypassed. A check that is always skipped should be deleted or fixed, not tolerated.

## Releases

- Prefer small, frequent, reversible releases over large batched ones. Blast radius scales with batch size.
- **Deploy order matters.** Backward-compatible schema first, then code, then cleanup in a later release. Never ship code that requires a schema that has not landed.
- Decouple deploy from release with feature flags for risky changes. Ship dark, enable for a small group, then widen.
- Every release states: what changed, what it needs (migrations, env vars, cache clears), how to verify it worked, and how to undo it.
- Verify after deploy against production, not against your local machine: hit the real endpoint, load the real page, check the real logs.

## Rollback

Define the rollback path **before** deploying, not while paging someone at midnight.

| Change type | Rollback |
| --- | --- |
| Code only | Redeploy the previous build |
| Additive schema | Redeploy previous code; the extra column is harmless |
| Destructive schema | No clean rollback. Requires a restore. Do not ship it in the same release as the code change |
| Feature behind a flag | Flip the flag |
| Cache or CDN change | Purge and re-warm, with the previous configuration retained |
| Third-party integration | Circuit breaker or a disable switch that degrades gracefully |

If a change cannot be rolled back, it is R3: it requires a stated plan, a backup verified as restorable, and explicit confirmation before it runs.

## Monitoring

Instrument what users feel, not what is easy to graph.

- **Availability:** error rate and status-code distribution per critical route.
- **Latency:** p50, p95, p99. Averages hide the users who are suffering.
- **Saturation:** queue depth, connection pool usage, memory, disk.
- **Business signals:** signups, orders, payments, uploads. A silent drop to zero is the fastest true outage signal.
- **Client reality:** real-user Core Web Vitals and client error tracking, not just synthetic tests.

Every alert must be actionable and name what to do. An alert nobody acts on trains everyone to ignore alerts, including the real one.

## Backups

A backup that has never been restored is a hypothesis. Verify by restoring into a scratch environment on a schedule, and record how long a full restore actually takes — that number is your worst-case outage length.

Know your two targets and state them: how much data you can afford to lose, and how long you can afford to be down.

## Hardening defaults

- HTTPS everywhere, HSTS once the certificate chain is stable, and redirects that do not lose the path.
- Security headers appropriate to the app: content security policy, frame protection, content-type protection, referrer policy, permissions policy.
- CORS with an explicit origin allowlist. Reflecting the request origin with credentials enabled is the same as having no policy.
- Rate limit authentication, password reset, search, and any expensive or enumerable endpoint.
- Bound every external call with a timeout and a maximum response size.
- Keep runtimes and dependencies on supported versions with a scheduled, boring upgrade cadence rather than an emergency jump three majors at once.
