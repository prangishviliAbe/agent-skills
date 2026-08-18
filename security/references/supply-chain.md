# Dependencies, CI/CD, secrets, and infrastructure

Read when auditing dependencies, build pipelines, deployment configuration, or cloud and hosting setup.

## Dependencies

- Commit the lockfile and install with the frozen/CI variant everywhere, including production builds. A floating resolve means the artifact you tested is not the artifact you shipped.
- Judge a dependency before adding it: maintenance activity, release cadence, the size of its own dependency tree, and whether it needs install scripts or network access.
- Separate reachable risk from scanner noise. A critical advisory in a package used only by a dev-time tool is not the same as one in the request path. State which it is.
- Prefer a supported major version with a boring upgrade cadence over an emergency jump across three majors during an incident.
- Watch for typosquatting and hallucinated package names — verify the exact name and publisher of anything unfamiliar, especially names suggested by a code generator.
- Disable or review lifecycle install scripts where the ecosystem allows; they run arbitrary code at install time, on developer machines and in CI.
- Pin container base images by digest, rebuild on a schedule so patches land, and keep the runtime layer minimal.

## CI/CD

The pipeline holds production credentials and writes production artifacts. It is a production system.

- Workflows triggered by untrusted contributions must not receive secrets and must not run untrusted code with elevated tokens. Separate the "build the fork's code" job from the "deploy with credentials" job.
- Grant the minimum token permissions per job, not a broad default at the workflow level.
- Pin third-party actions and shared pipeline steps to an immutable reference, not a moving tag.
- Never echo secrets, and never let a debug mode print the environment. Masking is a fallback, not a design.
- Protect the deploy path: required review on the release branch, and no direct pushes that bypass checks.
- Keep a secret scanner and a dependency audit in the pipeline, and treat a scanner failure as a real failure rather than something to click past.

## Secrets

- Store in a secret manager or the platform's encrypted store. Not the repo, not the client bundle, not a public environment prefix, not a log line, not a screenshot in a ticket.
- A secret that was ever committed is compromised: it lives in the history and in every clone. Rotate it; removing the line is not remediation.
- Scope each credential to one service and the least privilege that works. One shared root token means one compromise is total.
- Give every secret an owner, an expiry, and a rotation procedure that has been executed at least once.
- Verify the client bundle: search the built output for anything resembling a key before shipping.

## HTTP security headers

Set what the application actually needs, and verify the response rather than trusting the configuration file.

| Header | Purpose | Note |
| --- | --- | --- |
| `Content-Security-Policy` | Limits script sources and reduces XSS impact | Nonce or hash based; `unsafe-inline` on scripts negates most of the benefit |
| `Strict-Transport-Security` | Forces HTTPS | Add subdomains and preload only once you are certain |
| `X-Content-Type-Options: nosniff` | Stops content-type guessing | Always |
| `X-Frame-Options` or CSP `frame-ancestors` | Clickjacking | `frame-ancestors` is the modern form |
| `Referrer-Policy` | Stops leaking URLs and tokens to third parties | `strict-origin-when-cross-origin` is a sane default |
| `Permissions-Policy` | Disables unused device APIs | Deny what the app does not use |
| `Cross-Origin-Opener-Policy` / `Resource-Policy` | Isolates the browsing context | Useful for sensitive apps |

Headers reduce impact. They never replace fixing the underlying flaw.

## CORS

- Allowlist exact origins. Never reflect the request's `Origin` header while allowing credentials — that is equivalent to allowing everyone.
- `Access-Control-Allow-Origin: *` with credentials is rejected by browsers, and attempting to work around it is a sign the design is wrong.
- CORS protects browser callers only. It is not authorization, and a server-side client ignores it entirely.

## Cloud and hosting

- Storage buckets private by default; audit for public listing and public objects, including ones created by a build step.
- Network boundaries: databases and internal services should not be reachable from the internet. Verify from outside rather than assuming.
- Instance metadata endpoints are a favorite SSRF target — restrict access and require the hardened version where the provider offers one.
- Identity: per-service roles with narrow permissions, no long-lived static keys where a workload identity is available.
- Enable provider-side audit logging, and confirm it is retained somewhere the compromised account cannot delete.
- Separate environments at the account or project level, not just by naming convention.
- Turn on protection against accidental deletion for data stores, and verify the restore path works.

## A pragmatic audit sequence

1. `git log -p` for secrets in history, and a secret scanner over the full history.
2. Manifest and lockfile: unmaintained packages, known advisories, install scripts.
3. Built client bundle: any key, internal URL, or source map exposing server code.
4. Response headers on a real request, from outside the network.
5. A deliberately broken URL: what does the error page reveal?
6. Storage and database reachability from an untrusted network.
7. CI configuration: token scope, trigger conditions, third-party step pinning.
