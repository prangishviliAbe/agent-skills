---
name: security
description: >-
  Security engineering for web applications, APIs, and the AI agents and tools around them.
  Use to audit code or architecture, check whether a suspected flaw is exploitable,
  threat-model a feature, or harden sign-in, sessions, OAuth, access control and tenant
  isolation, injection, XSS, CSRF, SSRF, file uploads, cryptography and secrets, webhooks,
  race conditions, dependencies and CI/CD, WordPress, and prompt injection or tool permissions
  in LLM agents; also for "is this secure", leaked keys, dependency alerts, and incident
  triage. Traces real attack paths from attacker input to impact, reports evidence-backed
  findings with severity and a minimal fix, verifies fixes with adversarial cases, and stays
  inside authorized scope with no live or third-party probing without permission.
---

# Application and AI Agent Security

Find the places where an attacker's input crosses a trust boundary and reaches something valuable, prove the path, and close it with the smallest change that holds. No system is "secure" in the abstract; a review states what was examined, what was found, and what was not covered.

## Scope and authorization

Before anything else, establish: what is in scope (code, environment, accounts), what the user owns or is authorized to test, and whether the task is review only or review and fix. Read code and test locally or on systems the user controls. Do not send payloads to third-party or production systems, scan networks, or use discovered credentials without explicit authorization. Never print live secrets; refer to them by location.

## Method

1. **Map.** List entry points (routes, actions, webhooks, queues, file uploads, agent tools), the identities that can reach each, and the assets behind them (data, money, credentials, compute).
2. **Trace.** For each sensitive operation, follow attacker-controlled input from entry to sink. Note every check on the way and whether it runs on the server, on the right identity, and before the effect.
3. **Decide.** A finding needs a plausible path: who can do it, with what input, bypassing which defense, to what impact. A pattern match without a path is a lead, not a finding.
4. **Rank.** Severity comes from impact and reachability together, with the reasoning stated.
5. **Fix at the boundary.** Enforce the invariant where the operation happens, in code or in the database, not in the UI, a prompt, or a proxy alone.
6. **Prove.** Exercise the fix with the adversarial case and confirm legitimate use still works.

Search commands, the finding format, and CI and dependency review: [audit-playbook.md](references/audit-playbook.md).

## What to check at each boundary

| Boundary | Invariant to verify |
| --- | --- |
| Authentication | Identity comes from a verified session or token on the server. Password reset, email change, MFA, and OAuth callbacks cannot be used to take over an account. Sessions rotate on sign-in and are revocable |
| Authorization | Every handler, action, export, background job, and tool checks that this identity may perform this action on this object. Tenant scope is applied in the query itself. IDs from the client are selectors, never proof |
| Input to interpreters | SQL, shell, HTML, templates, file paths, regexes, and deserializers receive data as data: parameterized, encoded for the context, or allowlisted. Validation alone does not make concatenation safe |
| Browser | Output is encoded by context; untrusted HTML is sanitized by a maintained library; cookie-authenticated mutations are protected against cross-site requests; redirects go only to allowlisted destinations |
| Outbound requests | User-influenced URLs pass a connection policy covering scheme, port, resolved addresses, and every redirect, or go through a controlled egress |
| Files | Uploads are bounded in size and type, stored outside the web root or on object storage with generated names, never executed, and served with safe content types |
| Secrets and crypto | Secrets live outside the repository and client bundles; passwords use a maintained password hash; encryption is authenticated; comparisons of secrets are constant-time; nothing is homemade |
| State changes | Single-use and limited resources (coupons, balances, inventory, invitations) are enforced atomically in the database and are safe under concurrent and replayed requests |
| Webhooks | Signature verified over the raw body with the provider's method, replay bounded, processing idempotent |
| Supply chain and CI | Dependencies locked and assessed for reachable vulnerabilities; CI does not run untrusted code with secrets or write tokens; actions and images are pinned |
| AI agents | Retrieved or user-supplied text is treated as data. Tool permissions, filesystem and network limits, and approval for consequential actions are enforced in code, outside the model |
| Logging and errors | No secrets or unnecessary personal data in logs; errors do not reveal internals to clients; security-relevant events are recorded |

Detail by area: [web-vulnerabilities.md](references/web-vulnerabilities.md), [access-control.md](references/access-control.md), [data-protection.md](references/data-protection.md), [ai-agents.md](references/ai-agents.md).

## Findings

Report each finding with enough for a developer to confirm and fix it without re-deriving it:

```text
Title:        Any signed-in user can download another tenant's invoices
Severity:     High: cross-tenant data disclosure, low effort, authenticated attacker
Location:     api/invoices/[id]/route.ts:18
Path:         GET /api/invoices/:id loads by id only; no organization check.
              Invoice ids are sequential.
Precondition: Any valid account.
Evidence:     Verified locally with two seeded tenants: tenant B received tenant A's PDF.
Fix:          Add organizationId = session.organizationId to the query; return 404 on miss.
Regression:   Test that a cross-tenant request returns 404.
```

| Severity | Typical meaning |
| --- | --- |
| Critical | Unauthenticated or trivial path to code execution, full data access, account takeover at scale, or loss of funds |
| High | Authenticated or conditional path to another user's or tenant's data, privilege escalation, or significant integrity loss |
| Medium | Limited-impact or hard-to-reach flaw; a missing defense that makes another bug exploitable |
| Low | Minor information leak or hardening gap with no direct path to impact |
| Informational | Good practice not followed; no demonstrated risk |

Order findings by severity. Separate confirmed vulnerabilities from unverified risks and from optional hardening. Do not pad a report with speculative items, and do not omit a real one because the fix is inconvenient.

## Common failures

| Failure | Correct move |
| --- | --- |
| Checklist items reported as vulnerabilities | Trace a path to impact, or label as hardening |
| "Uses an ORM, so no SQL injection" | Check raw queries, dynamic identifiers, and ORDER BY built from input |
| Authorization verified only in the UI or middleware | Verify inside each handler, action, and job |
| A stronger system prompt as the fix for prompt injection | Enforce capability limits and approvals in tool code |
| Hostname regex as SSRF protection | Validate resolved addresses and redirects; pin the connection or use egress control |
| Audit count treated as exploitability | Check version, reachable code path, and conditions |
| Fix verified only with the benign case | Run the attack case and confirm it now fails |
| "The app is secure" | State scope reviewed, findings, and what was not examined |

## Completion

For a review: scope covered, findings in the format above, and explicit gaps. For a fix: the change, the adversarial case that now fails, the legitimate case that still works, and any follow-up outside code (rotating an exposed key, revoking sessions, notifying affected users) that only the owner can do.

Use **Verified** for what was demonstrated, **Inferred** for what was reasoned from code, **Assumed** for missing context, and **Not run** for checks that did not happen. During an incident, preserve evidence, act only within authorization, and remember that a code fix does not revoke a leaked credential.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
