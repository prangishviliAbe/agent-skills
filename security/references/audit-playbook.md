# Audit playbook: orient, map, trace, verify safely

Read when auditing an unfamiliar codebase or service, deciding where to start, interpreting scanner output, or checking a suspicion without causing harm. The output format is in [reporting.md](reporting.md).

## 1. Orient before you search

Write down, from files rather than assumptions: language and framework versions, how authentication and sessions work, where authorization is decided, data stores, third-party services, how it is deployed, and what CI can reach. Read `README`, the manifest and lockfile, `Dockerfile`, workflow files, and route or controller directories.

```bash
git log --oneline -5
rg --files | rg '(^|/)(package\.json|pyproject\.toml|composer\.json|go\.mod|pom\.xml|Gemfile|Dockerfile|docker-compose\.ya?ml)$'
rg --files .github/workflows
```

Record the revision you reviewed. Findings without a revision cannot be re-checked.

## 2. Map entry points and sinks

These patterns generate leads. They miss things and match noise, so read every match in context and trace it before it becomes a finding. Run only the stacks the project uses.

```bash
# Entry points: routes, handlers, actions
rg -n -e '\b(app|router|server|fastify|api)\.(get|post|put|patch|delete|all|use)\('
rg -n --glob '*route.{ts,js}' -e 'export (async )?function (GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b'
rg -l -e '^\s*[\x22\x27]use server[\x22\x27]'
rg -n -e '@(Get|Post|Put|Patch|Delete|All)\(|@UseGuards\(|createTRPCRouter|publicProcedure|protectedProcedure'
rg -n -e '@(app|router|bp|api)\.(route|get|post|put|patch|delete)\(|csrf_exempt|permission_classes|login_required|permission_required|Depends\('
rg -n -e 'wp_ajax(_nopriv)?_|admin_post(_nopriv)?_|register_rest_route|add_shortcode|Route::(get|post|put|patch|delete|any|resource|apiResource)\('
rg -n -e '\bHandleFunc\(|@(Get|Post|Put|Patch|Delete|Request)Mapping|@PreAuthorize|@Secured|permitAll'
```

```bash
# Sinks: where attacker-influenced data meets an interpreter, the filesystem, or the network
rg -n -e 'queryRawUnsafe|sql\.raw|whereRaw|selectRaw|orderByRaw|DB::raw|execute\(\s*f[\x22\x27]|execute\([^)]*[\x22\x27]\s*%\s|->query\(\s*[\x22\x27][^)]*\$|\.execute\([^)]*\.format\('
rg -n -e 'child_process|\bexec(Sync)?\(|\bspawn(Sync)?\(|os\.system|subprocess\.(run|Popen|call|check_output)|shell\s*=\s*True|shell_exec|passthru|proc_open|\bpopen\('
rg -n -e '\beval\(|new Function\(|vm\.(runIn|Script)|pickle\.loads?|yaml\.load\(|unserialize\(|ObjectInputStream|Marshal\.load|BinaryFormatter|node-serialize'
rg -n -e 'dangerouslySetInnerHTML|\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML|document\.write\(|v-html|\[innerHTML\]|\|\s*safe\b|\{!!|mark_safe|html_safe'
rg -n -e '(fetch|axios(\.(get|post|request))?|got|needle|request|urlopen|requests\.(get|post|request)|curl_init|file_get_contents|http\.Get)\(.*(req\.|request\.|params|query|body|input|FormValue|URL\.Query|\$_(GET|POST|REQUEST))'
rg -n -e '(readFile|readFileSync|createReadStream|sendFile|unlink|writeFile|open|file_get_contents|include|require)\(.*(req\.|request\.|params|query|body|input|\$_(GET|POST|REQUEST))|path\.(join|resolve)\(.*(req\.|params|query|body)'
```

```bash
# Cryptography, secrets, configuration, and authorization smells
rg -n -e 'Math\.random\(|createHash\(\s*[\x22\x27](md5|sha1)[\x22\x27]|\b(md5|sha1)\(|createCipher\(|aes-\d+-ecb|rejectUnauthorized\s*:\s*false|verify\s*=\s*False|InsecureSkipVerify|NODE_TLS_REJECT_UNAUTHORIZED'
rg -n -e 'algorithms?\s*[:=]\s*\[?\s*[\x22\x27]none|jwt\.decode\(|ignoreExpiration|verify_signature[\x22\x27]?\s*:\s*False'
rg -n -i -o -r '[redacted]' -e '(api[_-]?key|secret|token|passwd|password|private[_-]?key|client[_-]?secret)[\x22\x27]?\s*[:=]\s*[\x22\x27][A-Za-z0-9_\-/+=]{16,}[\x22\x27]'
rg -n -o -r '[redacted]' -e '\b(AKIA|ASIA)[A-Z0-9]{16}\b|sk_live_[0-9A-Za-z]{16,}|ghp_[0-9A-Za-z]{36}|xox[baprs]-[0-9A-Za-z-]{10,}|-----BEGIN (RSA |EC |OPENSSH |DSA |)PRIVATE KEY-----'
rg -n -i -e 'AllowAny|permitAll|csrf_exempt|csrf\(\)\.disable|disable\(\)\.csrf|@PermitAll|skip_before_action :authenticate|isAdmin\s*[:=]\s*(req|request|body)'
rg -n -i -e '\bDEBUG\s*=\s*True|APP_DEBUG\s*=\s*true|WP_DEBUG[\x22\x27]?\s*,\s*true|graphiql|introspection\s*:\s*true|origin\s*:\s*true|Access-Control-Allow-Origin'
rg -n -e '\.\.\.(req\.body|request\.body|body|input)\b|Object\.assign\([^,]+,\s*req\.body|\$request->all\(\)|params\.permit!|\*\*request\.(data|POST|json)'
rg -n -e 'redirect\(.*(req\.|request\.|query|params|next|returnTo|return_to|redirect_uri)'
rg -n -i -e '(console\.log|logger\.\w+|print|log\.\w+)\(.*(password|token|secret|authorization|cookie|req\.body)'
```

The two secret patterns print only the location (`-o -r '[redacted]'`), so a found value never enters your output. Never paste a matched secret into a report. To find when a value entered history without printing it: `git log --all --oneline -S'fragment' -- .`

## 3. Build a route inventory

This table is the most useful audit artifact. Build it from the entry-point matches, one row per route, action, or handler, and fill each cell from the code, not from the route's name.

| Route or action | Reachable by | Authentication | Authorization (actor, action, this resource) | Scoping in the query | Input validation | Sensitive operation |
| --- | --- | --- | --- | --- | --- | --- |
| `GET /orders/:id` | any signed-in user | `requireLogin` | none | none | id format only | reads an order |
| `POST /orders/:id/refund` | staff | `requireLogin` | `role === 'staff'` | tenant in `WHERE` | amount range | moves money |
| `PATCH /me` | self | `requireLogin` | implicit (session user) | n/a | spreads `req.body` | updates profile and role |
| `POST /webhooks/pay` | provider | none | signature check | n/a | schema | marks orders paid |

Rows with an empty authorization or scoping cell, a spread request body, or a money-moving operation are your first candidates. Do not read every file; read the rows.

## 4. Trace a candidate end to end

For each candidate answer these in order, and write down what you could not determine:

1. Who can reach it: network exposure, required authentication state, required role.
2. Which attacker-controlled values arrive, and in what form after parsing.
3. Which controls sit on the path: middleware, validators, policy functions, database constraints, row-level security, gateways.
4. What the dangerous operation is, and its maximum impact (one record, one tenant, all tenants, code execution).
5. What would disprove it: an upstream check you missed, a safe API, dead code, a deployment-only condition.
6. How to demonstrate it safely (section 7).

Example: `GET /orders/:id` calls `db.order.findUnique({ where: { id } })`; the only middleware is `requireLogin`; the policy in the brief says users read only their own orders. That is a complete static trace of an unauthorized object read: *Demonstrated* (static). Add a local test with two synthetic users to upgrade the evidence.

## 5. Review questions by feature

- **Login and signup:** Are attempts limited per account and per source? Do responses reveal whether an account exists? Is the hash Argon2id, scrypt, or bcrypt with sound parameters? Is the session id rotated at login? Are MFA enrollment and recovery as strong as the password path?
- **Password reset and magic links:** Is the token random, hashed at rest, short-lived, and single-use atomically? Is the link built from trusted configuration, not the `Host` header? Are sessions revoked after reset?
- **File upload:** Size and type limits, a generated storage name, no execution from the upload location, a separate serving origin, decoder resource limits, authorization on read and delete.
- **Payments and webhooks:** Server-side amounts, signature verification on raw bytes, replay and ordering safety, amount and currency matched to the order, state-transition guards.
- **Admin panel and internal tools:** Enforced on the server per action, not by hiding links; separate authentication strength; audit log.
- **Search, list, and export:** Scoped counts and totals, bounded sizes, formula-safe CSV, authorization re-checked in the background job.
- **Multi-tenant data access:** Tenant derived from the session, in every query and cache key, including jobs and exports.
- **Public API and GraphQL:** Object and field authorization per resolver, query depth and cost limits, introspection policy, rate limits, no mass assignment.
- **OAuth and SSO:** Exact redirect URIs, `state`, PKCE, nonce, audience and issuer checks, account linking by issuer and subject.
- **Outbound fetch features:** Destination validation after DNS resolution, redirects handled, response size and time limits, no ambient credentials forwarded.
- **Background jobs and queues:** Replay safety, scope carried from the requester, secrets not placed in payloads, dead-letter handling.
- **Email sending:** Header injection, user-controlled links, enumeration through notification differences.
- **Third-party scripts and embeds:** Subresource integrity or self-hosting, CSP, what data they can read.

## 6. Tools: run locally, then triage

Run what is installed and relevant; do not install tools, upload code or dependency manifests to a hosted service, or contact an external API without the user's approval.

```bash
npm audit --omit=dev --json        # or: pnpm audit --prod, yarn npm audit
osv-scanner scan source -r .       # older releases: osv-scanner -r .
pip-audit                          # Python
composer audit                     # PHP
govulncheck ./...                  # Go
gitleaks detect --redact --no-banner   # secrets; newer releases also offer `gitleaks git` and `gitleaks dir`
semgrep scan --config p/owasp-top-ten --metrics=off .
trivy fs --scanners vuln,secret,misconfig .
zizmor .github/workflows           # GitHub Actions weaknesses
```

Triage rules, because raw tool output is not a report:

- **Dependency advisories:** map the advisory to the vulnerable function or feature, check whether the project calls it with attacker influence, confirm the resolved version in the lockfile, and note the fix and its upgrade risk. Verdict: reachable, not reachable, or unknown, with the reason. Never run `npm audit fix --force`; it can cross major versions and still leave the feature reachable.
- **Static analysis hits:** keep only those you traced. Count the rest as leads you did not confirm.
- **Secrets:** classify as live, test, placeholder, or uncertain without using the value anywhere. Report the location, type, and privilege; follow the exposure steps in [supply-chain.md](supply-chain.md).
- **Misconfiguration:** tie each item to a concrete consequence, or file it as hardening.

## 7. Verify safely

Probe only code you were given to run locally or a target the user has authorized, with synthetic data.

| Class | Safe probe | A positive result looks like |
| --- | --- | --- |
| Access control | Two synthetic users or tenants; user B requests user A's object through every route, including list, count, and export | A's data returned, or a different count |
| SQL injection | A lone `'` in a value, or an `AND 1=1` versus `AND 1=2` pair | A database error, or different results between the pair |
| XSS | An inert marker such as `<b>zq1</b>` in each output context, then inspect the DOM | The tag renders as markup instead of text |
| SSRF | A URL pointing at a listener you run on localhost | A request arrives at your listener |
| Path traversal | `../` sequences toward a marker file you planted in a temp directory | The marker's content comes back |
| CSRF | A form post from a local page against a local instance holding a test session | State changes without a token |
| Races | At most about 20 parallel identical requests against a local instance, with a counter invariant | Balance below zero, or two redemptions of one coupon |
| Rate limits | Slightly above the documented limit in a test environment | No 429 |
| Token handling | Expired, tampered, algorithm-changed, or signature-stripped tokens against the local app | The request is accepted |
| Open redirect | `//example.org` as the next parameter, reading only the `Location` header | `Location` points off-site |

Stop immediately when a probe returns real personal data, leaves the authorized scope, or changes state you did not mean to change. Keep only redacted evidence. A timeout is not proof a mutation failed; check state before retrying.

## 8. Finish

Write findings with [reporting.md](reporting.md). State the revision, what you read, which tests actually ran, which boundaries you did not cover, and which hypotheses remain.
