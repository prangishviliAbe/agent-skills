# Dependencies, CI/CD, secret exposure, headers, and cloud

Read when reviewing dependencies, build and release pipelines, a leaked credential, HTTP security headers, or hosting configuration. Focus on where code executes and what authority it receives.

## Dependency risk

Judge an advisory by the resolved version in the lockfile, the affected feature, whether the project calls it with attacker influence, the execution environment, and the available fix. A dev dependency can run with CI secrets or write production artifacts, so "dev only" is not low risk. Scanner output is an input; the verdict (reachable, not reachable, unknown) is yours.

- Install from the lockfile in frozen mode (`npm ci`, `pnpm install --frozen-lockfile`). Lockfiles give reproducibility, not trust, and do not apply future patches.
- Lifecycle scripts (`preinstall`, `postinstall`, `prepare`) run arbitrary code at install time; npm worm campaigns have spread through them. Install with `--ignore-scripts` in CI and run the few scripts you need explicitly. Inspect an unfamiliar package before adding it: name and publisher (typosquats), `npm view <package> scripts`, maintainer changes, provenance (`npm audit signatures`).
- Delay adoption of brand-new releases so the ecosystem can catch malicious versions: Dependabot `cooldown`, Renovate `minimumReleaseAge`, pnpm `minimumReleaseAge` (check the key for your tool version).
- Never run `npm audit fix --force` blindly; it can change major versions and still leave the feature reachable.
- Review lockfile diffs for unexpected registry hosts, removed integrity hashes, and git or tarball URL dependencies.

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    cooldown:
      default-days: 7
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

## Build and release trust

Trace contribution, workflow trigger, checked-out revision, command, token and secrets, artifact, deployment. Ask whether untrusted pull-request content, branch names, issue text, or artifacts can become shell syntax or privileged code.

- Grant the smallest `permissions:` at workflow or job level; keep untrusted builds away from deployment identities.
- Pin third-party actions to a full commit SHA with the version in a comment, and update through a reviewed process. Tags and branches can be repointed.
- `pull_request_target` and `workflow_run` run with base-repository authority. Never check out or execute the contributor's code under them with secrets available.
- `${{ ... }}` expressions are expanded into the shell script, so pass untrusted values as environment variables, not inline.
- Validate that the artifact you deploy is the one that was built and tested; caches and artifacts can cross trust boundaries even when the deploy job checks out nothing untrusted.
- Self-hosted runners persist state and may reach other workloads; an ephemeral job is not necessarily an isolated machine.
- Prefer OIDC to cloud providers over long-lived stored keys, and npm trusted publishing with provenance over stored publish tokens.
- Suggest branch protection and environment approvals when they address the real release policy, but do not change repository governance unasked. Lint workflows with `zizmor` or `actionlint`.

## Credential exposure

1. **Find, without printing.** Use scanner modes that redact values, or location-only search (see [audit-playbook.md](audit-playbook.md)). Never paste a secret into the conversation or a report, and never test it against any service to classify it.
2. **Classify:** live secret, test credential, public identifier (for example a publishable key), placeholder, or uncertain. Note the privilege and where it was exposed (public repository, private repository, client bundle, log).
3. **Contain, within authority:** revoke or rotate at the provider, scoped to that credential, in an order that avoids an outage, and update the dependents. Rotating while malicious code still runs can leak the new secret too.
4. **Check use:** review the provider's access logs for the exposure window.
5. **Clean up:** deleting the file or rewriting history does not revoke anything. A history rewrite is a separate, disruptive action that needs its own decision.

## Headers and cross-origin policy

Verify actual responses and the flows a header could break. A missing header alone supports a hardening note; establish a concrete consequence before calling it a vulnerability.

| Control | Evaluate |
| --- | --- |
| CSP | Real script and style needs, nonce or hash handling, report-only rollout; reports can contain sensitive URLs |
| HSTS | HTTPS readiness of every host and subdomain before `includeSubDomains` or `preload` |
| `frame-ancestors` / `X-Frame-Options` | Sensitive framed actions versus legitimate embeds |
| `X-Content-Type-Options: nosniff` | Correct media types, especially for user content |
| `Referrer-Policy` | Token-bearing URLs and needed integrations |
| COOP, COEP, CORP | A real isolation goal, and compatibility with sign-in popups and cross-origin resources |
| CORS | Exact allowed origins; a reflected origin with credentials is unsafe; a public read-only wildcard is not inherently a flaw |

CORS controls which pages may read a response; it does not stop a server-side client from sending a request and does not replace authentication, authorization, or CSRF defenses.

## Cloud and hosting

Check effective permissions, not names: public storage access, network reachability, workload identity, metadata service mode, cross-account grants, audit-log retention, and restore ability. A "private" bucket or subnet label is not evidence without effective policy and routes. Keep tests authorized and bounded; do not scan broad address ranges because a configuration hints at exposure, and keep infrastructure changes, rotation, and deletions inside the requested scope.

## Primary reference

[GitHub Actions secure use reference](https://docs.github.com/en/actions/reference/security/secure-use): expression injection, permissions, untrusted code, and pinning. Adapt it to the actual CI platform.
