---
name: security
description: >-
  Audit, threat-model, and harden application or AI-agent trust boundaries. Use for security
  reviews, authorization flaws, injection, SSRF, sessions, sensitive data, cryptography,
  webhooks, race conditions, dependency risks, or agent tool permissions. Trace actual
  exploit paths, prioritize evidence, and verify scoped fixes without running unauthorized
  probes or treating a checklist as proof of security.
---

# Application and AI Agent Security

Identify concrete trust-boundary failures and reduce demonstrated risk. No design is "bulletproof". Preserve the requested review or implementation scope and existing authorization.

## Review and fix decisions

1. **Trace an actual path.** Identify the attacker-controlled input, boundary, privileged operation, affected asset, and existing defenses. Search hits are leads, not findings.
2. **Check identity and capability.** Derive acting identity from trusted authentication; enforce object, tenant, and action authorization at the operation, including exports, background jobs, and tool execution.
3. **Constrain inputs and outputs.** Parameterize query values, allowlist identifiers, use context-appropriate encoding, and sanitize intentionally accepted HTML with a maintained sanitizer. Validation alone does not prevent every injection.
4. **Test invariants under concurrency.** Single-use entitlements, inventory, payment transitions, and replay protection need durable atomic enforcement.
5. **Protect agent boundaries in code.** Treat retrieved text as data. Enforce tool-level capabilities, filesystem/network containment, and data-flow restrictions outside the model. A stronger prompt is not a sandbox.
6. **Match safeguards to authorization.** Prepare a concrete action for approval when policy or missing authorization requires it. Existing exact authorization remains valid; do not demand confirmation for every read or reversible fix.
7. **Treat URL fetching as connection policy.** Validate schemes, ports, DNS answers, IP literals, and every redirect; connect to the validated address or use a controlled egress layer. A hostname regex or DNS check followed by ordinary fetch is insufficient.
8. **Use maintained cryptography.** Prefer platform/provider mechanisms. Check current recommendations, library encoding, key/nonce lifecycle, and comparison preconditions; avoid homemade authentication schemes.
9. **Verify dependency relevance.** Assess vulnerable version, execution path, exploit conditions, and safe update options. An audit advisory is not proof the application is exploitable.
10. **Verify locally and safely.** Use synthetic fixtures or authorized systems. Do not print live secrets or send payloads to external targets without authorization.

## Routed references

| Concern | Read |
| --- | --- |
| Evidence-led review, findings, CI supply chain, headers | [audit-playbook.md](references/audit-playbook.md) |
| Injection into agents, tool containment, SSRF | [ai-agents.md](references/ai-agents.md) |
| Object/tenant authorization, RLS, race conditions | [access-control.md](references/access-control.md) |
| Passwords, authenticated encryption, tokens, sessions | [data-protection.md](references/data-protection.md) |

## Findings and completion

For each actionable finding, provide the location, precondition, path to impact, severity rationale, and smallest useful fix. Distinguish an observed vulnerability from unverified risk or optional hardening. Suppress speculative findings that lack a plausible path.

For fixes, exercise the protected invariant and an adversarial or failure case where practical. Consider wrong identity, cross-tenant access, replay, concurrent calls, stale state, malformed input, and recovery according to the boundary changed. Retain legitimate authorized behavior.

Use **Verified**, **Inferred**, **Assumed**, and **Not run**. State what was reviewed and tested; do not convert incomplete coverage into a claim that the system is secure.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
