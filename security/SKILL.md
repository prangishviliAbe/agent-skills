---
name: security
description: >-
  Security engineering for web applications, APIs, and the AI agents and tools around them: audit
  code or architecture, trace whether a flaw is exploitable, threat-model a feature, review
  sign-in, sessions, OAuth, access control and tenant isolation, injection, XSS, SSRF, CSRF, file
  uploads, cryptography and secrets, dependency and CI/CD supply chain, WordPress and
  WooCommerce, and prompt injection in LLM agents. Use for any request about vulnerabilities, "is
  this secure", security review, hardening, leaked keys, dependency alerts, incident triage, or
  whenever code handles authentication, payments, user files, or untrusted input. Delivers
  evidence-backed findings (violated invariant, path, impact, confidence, fix) or complete fixes
  with regression checks, and stays inside authorized scope: no live or third-party testing
  without permission.
---

# Application Security

Find and fix real, reachable risk, and say exactly how sure you are. A scoped review cannot certify a system as secure; it can show which invariants hold on the paths it examined.

## Principles

1. **Think in invariants.** State what must always hold ("a user reads only their own orders", "a refund never exceeds the captured amount"), then hunt for any path where it fails. Injection is one shape. Missing authorization, races, exposed secrets, and unsafe defaults break invariants without any input-to-sink chain.
2. **A lead is not a finding.** A dangerous function, scanner hit, missing header, or old dependency starts an investigation. Trace actor, entry, controls, operation, impact, and look for what refutes it: an upstream check, a safe API, dead code, a deployment condition.
3. **Rate only what you can show.** Keep three labels apart: *Demonstrated* (complete code trace or safe test), *Supported hypothesis* (plausible, one named fact missing), *Hardening* (reduces exposure, no violated invariant). Severity is impact; confidence is certainty. Report them separately.
4. **Stay inside the authorization you have.** Static analysis and isolated local tests of provided code are normally in scope. Active testing needs an authorized target, accounts, methods, and load. Never probe live or third-party systems on your own initiative, and stop and report if a test touches real data or changes state unexpectedly.
5. **Touch and keep as little as possible.** Use synthetic data and disposable accounts. Never read another person's record to prove access. Keep secrets and personal data out of your output, and never try a discovered credential against any service.
6. **Fix at the boundary that owns the invariant.** Cover alternate callers (jobs, exports, caches, sibling routes) and keep the legitimate flow working. A fix that blocks real users is unfinished.
7. **Deny on error for access; decide on purpose for availability.** An error must never grant access. Rate-limit and containment fallbacks need an explicit threat-versus-availability choice.
8. **State coverage honestly.** "No findings" means no actionable issue was established within a stated scope, never that the system is safe.

## Pick the mode

| Request | Mode | Output | Start with |
| --- | --- | --- | --- |
| Review, audit, "is this secure?" | Audit | Ranked findings; no edits | [audit-playbook.md](references/audit-playbook.md), [reporting.md](references/reporting.md) |
| Fix a vulnerability, harden something | Fix | Smallest complete correction plus a regression check | The reference for the class |
| New or changed sensitive feature | Threat model | Boundary table, abuse cases, controls with owners | [threat-model.md](references/threat-model.md) |
| Suspected compromise | Incident | Containment, evidence, scope, recovery | [wordpress.md](references/wordpress.md) or [supply-chain.md](references/supply-chain.md) |
| Scanner or dependency alert | Triage | Reachability verdict per alert | [supply-chain.md](references/supply-chain.md) |
| Leaked key or token | Exposure | Scoped revocation, use-log check, location only in the report | [supply-chain.md](references/supply-chain.md) |

## Audit procedure

1. **Scope.** Fix the revision or environment, the assets worth protecting, the attacker roles (anonymous, signed-in user, other tenant, staff, compromised dependency or integration), the allowed testing, and any exclusions.
2. **Map.** Locate entry points and trust boundaries: routes, actions, jobs, webhooks, uploads, exports, privileged tools, configuration. Use the commands in the playbook rather than reading everything.
3. **Prioritize.** Weigh exposure by impact. Start with authentication, object and tenant access, money and state workflows, file and URL handling, secrets, and privileged automation.
4. **Trace.** Follow each candidate end to end and try to refute it. Record missing facts as questions; never invent reachability, and never treat a missing fact as safety.
5. **Verify proportionately.** Prefer code and config evidence and isolated local tests. For an authorized active check, use the smallest observable effect, a request cap, and a stop condition. A timeout is not proof a mutation failed.
6. **Report.** Group symptoms by root cause, keep exact locations, and attach confidence ([reporting.md](references/reporting.md)).
7. **Remediate when asked.** Prove the attack shape is blocked and the intended use still works, and check the alternate paths.
8. **Close coverage.** List what was reviewed, which tests actually ran, the deployment assumptions, and what remains.

## Look here first

These classes produce most real findings. Each line names what to check.

1. **Object access (IDOR/BOLA):** every route, action, or resolver that takes an id: is the lookup scoped by owner or tenant? Include list, search, count, export, and nested ids.
2. **Function access (BFLA):** are admin and staff operations enforced in the handler itself, not just in the UI, layout, or edge middleware? Check Server Actions, route handlers, GraphQL mutations, internal APIs.
3. **Mass assignment and over-exposure:** request bodies spread into updates; role, price, owner, or tenant fields writable; responses carrying hashes, tokens, or internal flags.
4. **Authentication paths:** login, signup, reset, magic link, OTP, MFA enrollment and recovery, API keys, token verification (algorithm, issuer, audience, expiry).
5. **Client-trusted values:** price, quantity sign, discount, `userId`, `tenantId`, `role`, or a decoded-but-unverified token payload.
6. **Interpreter sinks:** raw SQL or ORM escape hatches, NoSQL operators, shell and process calls, template engines, `eval`, deserialization, regexes built from input.
7. **Browser output sinks:** `innerHTML`, `dangerouslySetInnerHTML`, `v-html`, `|safe`, unescaped attribute, URL, or script contexts, markdown renderers without a sanitizer, `postMessage` handlers.
8. **Server-side requests (SSRF):** URL previews, image proxies, importers, webhooks, PDF renderers, any "fetch this URL" feature; redirects; DNS rebinding; cloud metadata.
9. **Files:** upload type, size, path, execution, and serving origin; downloads and path traversal; archive extraction; decoder resource limits.
10. **Ambient-credential requests (CSRF):** cookie-authenticated state changes, GET with side effects, CORS that reflects origins with credentials.
11. **Business logic and races:** coupons, refunds, stock, balances, and invitations under repeat, parallel, and out-of-order requests; webhook replay; skipped workflow steps.
12. **Secrets:** repository and history, client bundles, logs, error pages, CI output, default or test credentials.
13. **Configuration:** debug mode, verbose errors, exposed admin, metrics, or introspection, public buckets and ports, permissive CORS or CSP.
14. **Cryptography:** hand-rolled schemes, `Math.random()` for tokens, fast hashes for passwords, nonce reuse, `==` on secrets, flexible JWT algorithms.
15. **Supply chain and CI:** unpinned actions, `pull_request_target`, script injection, install scripts, lockfile drift, secrets reachable by untrusted code.
16. **Agents and LLM features:** untrusted content reaching a model that has tools, over-broad tool credentials, model output used as code, HTML, or SQL, secrets in prompts, unbounded loops and spend.
17. **Failure handling:** exceptions that fail open, errors that leak state, partial commits, missing security-event logging.

## Reference map

| When the task involves | Read |
| --- | --- |
| Unfamiliar codebase, where to start, commands, scanner triage, safe verification | [audit-playbook.md](references/audit-playbook.md) |
| Threat modeling, trust boundaries, abuse cases | [threat-model.md](references/threat-model.md) |
| Authentication, passwords, sessions, tokens, OAuth, authorization, tenancy | [access-control.md](references/access-control.md) |
| SQL and NoSQL injection, XSS, command and path handling, SSRF, CSRF, redirects, deserialization | [injection.md](references/injection.md) |
| Uploads, encryption, secrets, privacy, logging | [data-protection.md](references/data-protection.md) |
| Races, limits, refunds, coupons, workflow abuse, replay | [business-logic.md](references/business-logic.md) |
| Dependencies, CI/CD, secrets exposure, headers, cloud | [supply-chain.md](references/supply-chain.md) |
| LLM agents, tools, prompt injection, MCP, RAG | [ai-agents.md](references/ai-agents.md) |
| WordPress and WooCommerce code or compromise | [wordpress.md](references/wordpress.md) |
| Findings, severity, confidence, fix verification, coverage statements | [reporting.md](references/reporting.md) |

## Failure modes

| Failure | Correct move |
| --- | --- |
| Every raw query reported as injection | Trace parameter binding, attacker control, and reachability |
| A grep or scanner hit reported as a finding | Treat it as a lead until traced end to end |
| "I could not run an exploit, so it is not vulnerable" | Static evidence counts; label the missing runtime facts |
| A public endpoint called an authentication bypass | Establish the intended policy; public mutations need abuse controls, not a login |
| Severity copied from the vulnerability name | Rate privileges, data, scope, and practical consequence |
| Fixing with a blocklist, a regex, or a client-side check | Allowlist, parameterize, and enforce at the server sink |
| Fix covers one route and misses siblings | Search for the same pattern in exports, jobs, GraphQL, caches, and other routes |
| A prompt that says "ignore malicious instructions" | Enforce capabilities and permissions outside the model |
| Security headers offered as the fix for a logic flaw | Fix the invariant; headers are hardening |
| Secrets or personal data copied into the report | Report the location and type, never the value |
| Hardening that breaks login, embeds, or integrations | Test intended flows and state the compatibility cost |
| Active testing of a live or third-party target | Work statically and locally first; ask for the scope |
| "Looks secure" with no scope | State what was reviewed, how, and what remains |

## Definition of done

- [ ] Each finding names the violated invariant, the path, the evidence, and the realistic impact.
- [ ] Severity, confidence, and deployment assumptions are separate; hypotheses and hardening are separate from demonstrated findings.
- [ ] Testing stayed in scope, and the output contains no live secrets or unnecessary personal data.
- [ ] Requested fixes cover alternate paths, preserve intended behavior, and have a regression check or a stated reason why not.
- [ ] Coverage and remaining uncertainty are explicit; no blanket assurance is implied.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
