# Evidence-led security review

Read when: Investigating a vulnerability, writing findings, reviewing CI privileges, or prioritizing dependency/header hardening.

## Find boundaries, then trace

```bash partial
rg -n 'exec|spawn|eval|dangerouslySetInnerHTML' src
rg -n 'getSession|authorize|tenant|organizationId' src
rg -n 'fetch|redirect|webhook|signature' src
rg -n 'pull_request_target|permissions:|secrets\.' .github
```

Search names/callers first and inspect the actual source-to-sink path. Do not print credential matches. A risky API can be used safely; absence of a search hit does not prove absence of a flaw.

## Finding artifact

```text
Location:
Attacker-controlled input:
Required privilege/precondition:
Boundary bypass and impact:
Existing defenses considered:
Evidence: Verified / Inferred
Severity rationale:
Smallest fix:
Regression or verification:
Not run:
```

## Common review decisions

| Area | Review |
| --- | --- |
| Privileged CI | Untrusted head checkout/code under pull_request_target; expression injection; token permissions |
| Shell input | Pass untrusted values as structured arguments/environment with proper quoting; no raw template interpolation |
| Dependencies | Lockfile version and integrity, advisory path, execution conditions, compatible patch |
| Actions | Pin trusted actions by full commit SHA; do not mistake pinning for a fix to untrusted privileged execution |
| CSP | Context-appropriate output protection first; nonce/hash policy matched to framework; staged rollout |
| CORS | Explicit allowed origins when needed; CORS is not authorization or a universal CSRF defense |
| HSTS | Apply when HTTPS/subdomains and deployment support the policy |
| Rate limits | Enforce at the protected resource/account boundary and distinguish distributed behavior |

A workflow that executes a pull request's code with a deploy token is a concrete privilege problem, regardless of whether its action versions are pinned. Fix the untrusted execution path and least-privilege permissions.

For dependency changes, inspect the advisory and run relevant existing checks. Avoid forcing major upgrades merely to remove an audit count. Do not claim exploitability without a plausible application path.

During an incident, preserve evidence and act only within authorized scope. A code fix does not revoke an exposed key; coordinate actual revocation when authorized.
