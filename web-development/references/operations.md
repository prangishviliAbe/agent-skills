# Operations: configuration, release, and recovery

Read for CI, environment changes, live delivery or operational incidents. Inspect the system's existing release process before adding new infrastructure or gates.

## Environments and secrets

Separate production identities and data from test activity. Use local, preview or staging environments according to available infrastructure and risk; do not require three environments for a static page. Prefer promotion of the same artifact, and explicitly account for any configuration embedded at build time.

Validate required configuration before its dependent feature runs. A missing critical database setting can justify startup failure; an optional integration may instead be disabled with a useful diagnostic. Document variable names, defaults and scope without real secrets.

Keep private credentials in the platform's supported secret store and grant only needed permissions. Treat browser-delivered values as public, including environment variables substituted into client bundles. A committed credential needs exposure assessment and scoped revocation/rotation; deleting the line does not invalidate copies. Coordinate rotation order to avoid unnecessary outages and never rotate unrelated secrets without need or authority.

## CI and artifacts

Use the repository's package manager and lockfile in application builds. Select type checks, lint, tests, build and security checks that match the project; preserve required gates instead of adding an arbitrary universal pipeline.

A reproducible build depends on the runtime/toolchain and generated inputs as well as the lockfile. Inspect lifecycle scripts and untrusted build inputs before granting credentials. Verify the artifact being promoted is the one checked, especially when several revisions build concurrently.

Separate untrusted contribution execution from deployment credentials. Use narrow per-job permissions and maintained dependencies. Treat scanner results as evidence to triage, not proof of exploitation or automatic permission for a major-version upgrade.

## Release sequence

Before an authorized release, establish:

- Exact target, revision/artifact, prerequisites, configuration and schema compatibility.
- Safe verification with a test account or non-mutating health check.
- Failure thresholds and a practical rollback, forward-fix or restore strategy.
- Any data migration, queue behavior or provider action that cannot be undone by redeploying code.

When versions coexist, deploy compatible schema first, code next, and destructive cleanup after compatibility is no longer required. Feature flags or staged rollout can reduce exposure when supported; do not add them to a trivial change without reason.

After deployment, verify the actual target and critical path, then inspect errors, latency and relevant business signals. Respect existing authorization for deployment. If a consequential target or required permission is missing, prepare everything reviewable and ask for that specific missing decision.

## Recovery

| Change | Questions before relying on rollback |
| --- | --- |
| Code | Is the previous artifact available and compatible with current data/config? |
| Additive schema | Can old code tolerate it, and did new code write incompatible values? |
| Destructive schema | Can restoration recover the lost data, and what later writes would it lose? |
| Cache/CDN | Can prior config be restored; would a purge overload the origin? |
| External integration | Are side effects reversible, or must they be reconciled/compensated? |
| Feature flag | Does disabling it also stop jobs, webhooks and already-started work? |

A backup is useful only with known scope and a tested restore. Record achievable data-loss and recovery-time objectives. Restore duration is one contributor to downtime, alongside detection, provisioning, replay and verification; it is not automatically the worst-case outage length.

## Monitoring and hardening

Monitor errors, latency distributions, saturation and business outcomes. Choose signals tied to the changed feature and make alerts actionable. Avoid logging personal data to create observability.

Set HTTPS, cache controls and security headers appropriate to the app. Test CSP, framing and cross-origin changes against sign-in, payments and required embeds before enforcement. HSTS subdomains/preload require understanding all affected hosts. CORS restricts browser response access; it does not replace authorization or CSRF defenses.

Bound expensive endpoints and external calls. Choose rate-limit keys, limits and fallback behavior from abuse and availability requirements. Keep runtimes on supported versions using a tested upgrade process rather than silently changing them during unrelated work.
