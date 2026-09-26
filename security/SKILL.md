---
name: security
description: Audit application code and architecture, investigate suspected vulnerabilities, threat-model sensitive features, and implement security fixes. Use for explicit security reviews, exploitability analysis, incident triage, or changes to authentication, authorization, secrets, tenant isolation, injection defenses, file handling, and privileged AI tools.
---

# Application Security

Find and reduce concrete risk within the requested scope. Trace how an actor crosses a security boundary, establish the consequence, and distinguish demonstrated vulnerabilities from unresolved hypotheses and hardening opportunities. A scoped review cannot certify that a system is secure.

## Operating rules

1. **Match the requested mode.** Audit and explain without unrequested edits; implement when asked to fix; prioritize containment and evidence during an incident. Do not turn ordinary development into a full audit solely because user input exists.
2. **Follow evidence.** Read actual code, policy, configuration, and versions. A dangerous function or scanner match starts an investigation; it is not itself a finding. Verify version-sensitive advice against primary documentation when needed.
3. **Identify the violated invariant.** Use actor → entry → control/data path → sensitive operation → impact. Injection is only one shape: unauthorized reads, race conditions, exposed credentials, and insecure defaults can violate an invariant without a classic input-to-sink chain.
4. **Respect the testing boundary.** Local analysis of provided artifacts and isolated tests are normally part of the request. Active tests must stay within authorized targets, accounts, methods, and load. Clarify missing scope before testing live or third-party systems; do not re-request authorization already supplied.
5. **Minimize effects and evidence.** Use synthetic fixtures and disposable accounts where possible. Do not read another person's record simply to prove access. Stop an active test if it exposes unexpected real data, crosses scope, or causes unintended state change; retain only necessary redacted evidence.
6. **Separate confidence from severity.** Estimate impact and realistic exploitation conditions; label whether each is observed or inferred. Keep unresolved high-impact questions visible without presenting them as confirmed defects.
7. **Deny unauthorized access.** Errors in authentication or authorization must not grant protected access. Availability controls, rate-limit fallbacks, and incident containment need an explicit threat/availability tradeoff rather than a universal fail-closed rule.
8. **Preserve intended behavior.** Fix the policy or unsafe operation at the narrowest complete boundary, including alternate callers. A security change that removes a legitimate user flow without agreement is incomplete.

## Procedure

1. **Scope.** Identify the requested output, code revision or environment, assets, relevant attacker roles, allowed testing, and material exclusions. Scale detail to the task.
2. **Map.** Locate affected entry points and trust boundaries: routes, jobs, exports, storage, callbacks, privileged tools, and configuration. Start where exposure and impact are greatest, not with a fixed vulnerability checklist.
3. **Trace.** Follow access decisions, untrusted input, state transitions, and sensitive outputs. Check normalization, alternate routes, caches, failures, and concurrency when they affect the invariant.
4. **Challenge the hypothesis.** Look for effective upstream controls, dead code, safe APIs, deployment conditions, and legitimate policy exceptions. Record missing evidence instead of inventing reachability or silently treating it as safety.
5. **Verify proportionately.** Prefer code/config evidence and isolated tests. For an authorized active check, use the smallest observable effect, cap requests, and define a stop condition. A timeout is not a failed mutation; reconcile before retrying.
6. **Rank and report.** Group duplicate symptoms by root cause, retain precise locations, state confidence separately, and prioritize practical impact. Give a specific next check for unresolved hypotheses.
7. **Remediate if requested.** Implement the smallest complete correction. Verify that prohibited behavior is blocked and intended behavior still succeeds. Use meaningful regression checks where the failure can be exercised safely.
8. **Close coverage.** State what was reviewed, which tests actually ran, deployment-dependent assumptions, residual risk, and outstanding work. Do not claim that all possible paths are safe.

## Investigation routing

| Task or evidence | Next focus |
| --- | --- |
| Object IDs, roles, tenants, exports | Access policy per actor/action/resource; scoped reads, writes, counts and caches |
| Login, recovery, session or token changes | Authentication transitions, revocation, reauthentication and abuse limits |
| Attacker-controlled values at interpreters | Context-specific safe APIs, parsing/encoding boundaries and reachable output |
| Balance, stock, refund, invitation or workflow abuse | Invariants under repeats, concurrency and out-of-order transitions |
| Uploads, user URLs or external callbacks | Isolation, bounded resource use, destination validation and identity |
| Secrets, dependencies or build credentials | Actual exposure, executing environment, credential scope and supply-chain path |
| Agent tools processing retrieved content | Instruction/data separation and independently enforced tool permissions |

## Reference map

| When the task involves | Read |
| --- | --- |
| Threat modeling, business logic, AI agents and prompt injection | [threat-model.md](references/threat-model.md) |
| Authentication, sessions, OAuth, access policy and tenancy | [access-control.md](references/access-control.md) |
| XSS, SQL/command injection, CSRF, SSRF and unsafe parsing | [injection.md](references/injection.md) |
| Uploads, cryptography, sensitive data and logging | [data-protection.md](references/data-protection.md) |
| WordPress and WooCommerce code or compromise | [wordpress.md](references/wordpress.md) |
| Dependencies, CI/CD, secrets, headers and infrastructure | [supply-chain.md](references/supply-chain.md) |
| Findings, confidence, prioritization and scope statements | [reporting.md](references/reporting.md) |

## Failure modes

| Failure | Correct move |
| --- | --- |
| Every raw query is reported as injection | Trace parameterization, attacker control and reachability |
| Inability to run an exploit is treated as no vulnerability | Assess static evidence and label missing runtime conditions |
| A public mutation is automatically called an auth bypass | Establish the intended policy and anti-abuse requirements |
| A fixed severity is assigned from a vulnerability label | Describe privileges, affected data, scope and practical consequence |
| A prompt tells a model to ignore malicious text | Enforce capabilities and resource permissions outside the model too |
| An audit log captures full tokens and request bodies | Keep redacted event metadata with controlled retention |
| Hardening breaks login, embeds, recovery or integrations | Test intended flows and explain the control's compatibility cost |

## Definition of done

Apply to the requested mode; an audit does not require unrequested remediation.

- [ ] Findings identify a violated invariant, relevant path, evidence and realistic impact.
- [ ] Severity, confidence and deployment assumptions are distinguishable.
- [ ] Unresolved hypotheses and hardening notes are separate from demonstrated findings.
- [ ] Testing stayed within scope and the report contains no live secrets or unnecessary personal data.
- [ ] Requested fixes cover relevant alternate paths and preserve authorized behavior, with actual verification or a stated limitation.
- [ ] Coverage and remaining uncertainty are explicit; no blanket security assurance is implied.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
