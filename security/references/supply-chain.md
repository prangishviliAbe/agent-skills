# Dependencies, CI/CD, secrets, and infrastructure

Read when reviewing the software supply chain, deployment configuration or hosting controls. Focus on where code executes and what authority it receives.

## Dependency risk

Inspect the resolved version and advisory range, affected feature/configuration, execution environment, reachable path and available fix. A dev dependency may execute with CI secrets or write production artifacts; it is not low risk solely because it is absent from runtime dependencies.

Use committed lockfiles and deterministic install modes for applications where the ecosystem supports them. Lockfiles and container digests improve reproducibility, but do not prove trust or apply future patches. Pair pinning with reviewed updates and artifact provenance where available.

Verify unfamiliar package names and publishers, lifecycle scripts and transitive execution. Installing a repository or running its tests may execute code; inspect relevant scripts before exposing credentials or network access. Do not blindly run a package manager's force-fix option: it can alter major versions or leave the affected feature reachable.

Separate confirmed vulnerable use from unproven exposure, unsupported components and defense-in-depth recommendations. Scanner output is an input to this analysis, not the final finding.

## Build and release trust

Trace contribution → workflow trigger → checkout revision → command → token/secrets → artifact → deployment. Check whether untrusted pull request content, issue text, branch names or artifacts can become shell syntax or privileged code.

- Give jobs the smallest needed token scopes; isolate untrusted builds from deployment identities.
- Review triggers that run with base-repository authority, especially if they check out or execute a contributor's code.
- Pin third-party executable workflow dependencies to immutable identities and use a reviewed update process.
- Do not interpolate untrusted expression values into shell source; pass them as data using the shell's supported safe mechanism.
- Validate artifacts and their producer/revision before promotion. Cache or artifact reuse can cross a trust boundary even when the deploy job itself contains no untrusted checkout.
- Inspect self-hosted runner persistence and access to other workloads. An ephemeral process is not necessarily an isolated machine.

Suggest branch protection or environment gates when they address the actual release policy; a skill must not silently change repository governance or block already-authorized work on invented rules.

## Credential exposure

Inspect current files, generated bundles and history when they are in scope using redacted scanner output or controlled local review. Do not dump git history or environment values into the conversation to search for secrets.

Determine whether a discovered value is a live secret, public identifier, placeholder or uncertain candidate. Report location and privilege/exposure context without reproducing the value. Never test a credential against an unrelated service just to classify it.

For a credible exposure, identify affected identity, revoke/rotate within authority, update dependents, and check relevant use logs. Removing a file or rewriting history does not revoke credentials. History rewriting is a separate disruptive action and needs its own scoped decision.

## Headers and cross-origin policy

Verify actual responses and the flows affected by configuration. Missing a header alone usually supports a hardening recommendation; establish a concrete consequence before asserting a vulnerability.

| Control | Evaluate |
| --- | --- |
| CSP | Real script/style needs, nonce/hash handling and rollout; reports may contain sensitive URLs |
| HSTS | HTTPS readiness of affected hosts, subdomains and consequences of preload |
| frame-ancestors / X-Frame-Options | Sensitive framed actions and legitimate embedding |
| nosniff | Correct media types and user-controlled content |
| Referrer-Policy | Token-bearing URLs and necessary integrations |
| COOP / COEP / CORP | Isolation goals and compatibility with sign-in popups, embeds and cross-origin resources |
| CORS | Exact permitted origins and credentials; reflection is unsafe when unrestricted |

CORS affects browser access to responses, not whether a server-side attacker may send a request. It does not replace authentication, authorization or CSRF controls. An intentional wildcard public read API is not inherently a vulnerability.

## Cloud and hosting

Check effective policies, not names: public storage access, network reachability, workload identity, metadata access, cross-account grants, audit retention and restoration ability. A private subnet or private bucket label is insufficient evidence without effective routes and permissions.

Use authorized, bounded tests; do not scan broad address ranges or probe providers merely because configuration suggests possible exposure. Keep infrastructure changes, secret rotation and deletion within the requested scope.

## Primary reference

[GitHub Actions secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) covers workflow expression injection, permissions, untrusted code and dependency pinning. Adapt those mechanisms to the actual CI platform.
