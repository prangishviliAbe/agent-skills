# Operations: configuration, CI, releases, monitoring, hardening

Read when changing CI or CD, environment configuration, releases, security headers, containers, or monitoring, or when responding to an operational issue. Inspect the project's existing release process before adding infrastructure or gates.

## Environments and configuration

- Keep production identities and data separate from test activity. Use local, preview, or staging environments according to the infrastructure that exists and the risk; a static page does not need three. Promote the same artifact between environments, and know which values are baked in at build time (public client variables are).
- Validate required configuration when the process starts so a missing variable fails loudly with its name, and disable optional integrations with a clear log line:

```ts
import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
});

export const env = Env.parse(process.env); // throws at boot, listing invalid or missing names
```

- Document variable names, defaults, and scope in `.env.example` without real values; keep `.env*` out of git.
- Keep private credentials in the platform's secret store with least privilege. A browser-delivered value is public. A committed credential needs an exposure assessment and scoped revocation or rotation: deleting the line does not invalidate copies, and rewriting history is a separate, disruptive decision. Rotate in an order that avoids outages, and never rotate unrelated secrets without need or authority.

## CI

- Install with the lockfile in frozen mode: `npm ci`, `pnpm install --frozen-lockfile`, `yarn install --immutable`, `bun install --frozen-lockfile`.
- Order stages for fast failure: install, lint, type-check, unit tests, build, integration and end-to-end tests. Cache dependencies keyed by the lockfile hash and run independent jobs in parallel. Use the same commands as the local scripts.
- Note that Next.js 16's `next build` does not lint; give lint its own step.
- Keep required gates. Do not replace a project's pipeline with a generic one, and do not delete a check to turn CI green.

A hardened GitHub Actions workflow:

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read # least privilege; widen per job only when needed

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@<full-commit-sha> # pin to the 40-character SHA; note the version in the comment
        with:
          persist-credentials: false
      - uses: actions/setup-node@<full-commit-sha> # same rule
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci --ignore-scripts
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

Rules behind it:

- Pin third-party actions to a full commit SHA and let Dependabot or Renovate propose updates; tags and branches can be repointed.
- Never combine `pull_request_target` (it runs with repository secrets) with a checkout or execution of pull-request code.
- `${{ ... }}` is expanded into the script before the shell runs, so untrusted values (titles, branch names, issue text) become shell syntax. Pass them as data:

```yaml
# Vulnerable: the title is pasted into the shell script
- run: |
    echo "Title: ${{ github.event.pull_request.title }}"

# Safe: the value reaches the script as an environment variable
- run: |
    echo "Title: $PR_TITLE"
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
```

- Deploy from a separate workflow with environment protection rules, and authenticate to the cloud with OIDC rather than long-lived keys. Confirm the artifact you promote is the one that was tested.
- `npm ci --ignore-scripts` stops dependency install scripts from running with CI credentials; run the few required scripts explicitly.

## Release sequence

Before an authorized release, establish:

- The exact target, revision or artifact, configuration, and schema compatibility.
- A safe verification: a test account or a non-mutating health check.
- Failure thresholds, and a practical rollback, forward fix, or restore.
- Anything redeploying code cannot undo: data migrations, queued messages, provider actions.

When versions coexist, ship compatible schema first, code next, and destructive cleanup after compatibility is no longer needed. Use feature flags or a staged rollout (internal users, then a small percentage) for risky changes, not for trivial ones.

After deploying, verify the real target and the critical path, then watch errors, latency, and business signals for a defined window:

```bash
curl -fsS https://app.example.com/healthz
curl -fsS -o /dev/null -w "%{http_code} %{time_total}s\n" https://app.example.com/
```

Respect existing authorization for deploying. When the target or a required permission is missing, prepare everything reviewable and ask for that one decision.

## Recovery

| Change | Ask before relying on rollback |
| --- | --- |
| Code | Is the previous artifact available and compatible with current data and config? |
| Additive schema | Can old code tolerate it, and did new code write values old code cannot read? |
| Destructive schema | Can a restore bring back the data, and what later writes would it lose? |
| Cache or CDN | Can the prior configuration be restored, and would a purge overload the origin? |
| External integration | Are the effects reversible, or must they be reconciled or compensated? |
| Feature flag | Does turning it off also stop jobs, webhooks, and work already started? |

A backup counts only with known scope and a tested restore. Record the recovery point and recovery time you can actually achieve. Restore time is one part of downtime, alongside detection, provisioning, replay, and verification.

## Monitoring and alerting

- Watch latency, traffic, errors, and saturation, plus business outcomes (signups, checkouts, payments) for the feature you changed.
- Alert on user-visible symptoms with an owner and a runbook link, not on every internal cause. Page only for what needs a human now.
- Use structured logs with request ids and no personal data; tag errors with the release; upload source maps privately.
- Add external uptime checks, synthetic checks for critical flows, and heartbeat monitors for scheduled jobs.
- Keep liveness (the process is up) separate from readiness (dependencies are healthy). A liveness check that depends on the database turns a database blip into a restart storm.

## HTTP hardening

- Serve everything over HTTPS. Set `Strict-Transport-Security: max-age=31536000; includeSubDomains`; add `preload` only after confirming every subdomain is HTTPS-ready. Set cookies `Secure; HttpOnly; SameSite=Lax`, with the `__Host-` prefix where it fits.
- Start CSP in report-only mode, use nonces for inline scripts, and enforce after checking sign-in, payments, and embeds.

```ts
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

export default {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
```

- Control framing with CSP `frame-ancestors` (and `X-Frame-Options` for old browsers). Add COOP, COEP, and CORP only for a real isolation goal, and test them against sign-in popups, payment frames, and cross-origin assets first.
- CORS lists exact origins; never combine a wildcard with credentials. CORS governs which pages may read a response, not whether a server-side client may send a request, so it does not replace authorization or CSRF defenses.
- Bound expensive endpoints and outbound calls with rate limits, size limits, and timeouts. Keep runtimes and dependencies on supported versions through a tested upgrade, not as a side effect of unrelated work.

## Containers

Pin base images by version (and by digest for production), build in stages, run as a non-root user, exclude `.env`, `.git`, and `node_modules` with `.dockerignore`, keep secrets out of image layers (use build secrets), install production dependencies only in the final stage, and add a health check.

## Verify

Run the pipeline's commands in a clean checkout. Lint workflow files with `actionlint` or `zizmor` when available. Confirm that a missing environment variable fails at startup with a clear message. Smoke-test the deployed target and record the exact revision that is live.
