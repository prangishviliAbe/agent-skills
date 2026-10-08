---
name: security
description: >-
  Audit, model threats, and harden modern web applications and AI agent architectures against
  critical vulnerabilities. Covers OWASP Top 10, AI Agent security (direct/indirect prompt injection,
  tool sandbox containment, SSRF via URL fetching), Broken Object Level Authorization (BOLA/IDOR),
  Postgres Row-Level Security (RLS), cryptographic hygiene (Argon2id, AES-256-GCM, timing-safe equality),
  secure headers (CSP), and dependency supply-chain security. Use when auditing code, evaluating
  threat models, hardening endpoints, securing agent tool executions, or investigating incidents.
---

# Application & AI Agent Security

Engineer bulletproof defense-in-depth across modern web architectures and autonomous AI agent systems. Assume zero trust: every incoming request, user input, webhook, and external agent context is potentially hostile.

## Core Directives

1. **Zero-Trust Access Control & IDOR Prevention:** Never rely on client-supplied identifiers (`req.body.userId`, `params.id`) without verifying ownership against the authenticated session. Enforce Postgres Row-Level Security (RLS) or explicit authorization checks on every database read and write.
2. **Defend AI Agents Against Prompt & Tool Injection:**
   - Treat all untrusted data ingested by agents (web pages, user uploads, external APIs) as potential **Indirect Prompt Injection** vectors.
   - Never pass raw LLM text outputs directly into terminal shells (`eval`, `exec`, `bash`) or unparameterized database queries.
   - Sandbox tool executions and restrict network access to prevent Server-Side Request Forgery (SSRF) into cloud metadata endpoints (`169.254.169.254`).
3. **Parameterized Queries Exclusively:** Never concatenate strings into SQL, GraphQL, or NoSQL queries. Use parameterized statements or type-safe query builders (Drizzle, Prisma).
4. **State-of-the-Art Cryptographic Standards:**
   - Password hashing: **Argon2id** (minimum 64MB memory, 3 iterations) or bcrypt (cost factor >= 12).
   - Symmetric encryption: **AES-256-GCM** with a unique 96-bit initialization vector (IV) per message.
   - Comparison: Always use `crypto.timingSafeEqual` for tokens, HMAC signatures, and API keys to prevent timing attacks.
5. **Strict Content Security Policy (CSP):** Prevent Cross-Site Scripting (XSS) with strict CSP headers, nonce-based script execution, and disallow `unsafe-inline` and `unsafe-eval`.
6. **Supply Chain & Dependency Integrity:** Audit dependencies continuously with `npm audit`, lock versions with integrity hashes (`package-lock.json`), and verify webhook signatures with secret tokens.

## Threat Modeling Flow

```text
[ External Input / AI Agent Context ]
              │
              ▼
[ Boundary Validation (Zod) ] ──► [ Anti-SSRF IP Validation ]
              │
              ▼
[ Auth & Session Verification ] ──► [ Database RLS / Tenant Isolation ]
              │
              ▼
[ Sanitized & Sandboxed Tool Execution ]
```

## Quick Reference Map

| Topic | What it covers | Reference file |
| --- | --- | --- |
| **Audit Playbook** | Ripgrep vulnerability search patterns, auth bypass, injection scans | [audit-playbook.md](references/audit-playbook.md) |
| **AI Agent Security** | Prompt injection defense, SSRF sandbox guards, tool authorization | [ai-agents.md](references/ai-agents.md) |
| **Access Control** | IDOR / BOLA mitigation, Postgres Row-Level Security, tenant isolation | [access-control.md](references/access-control.md) |
| **Data Protection** | Argon2id hashing, AES-256-GCM, timing-attack prevention, secret storage | [data-protection.md](references/data-protection.md) |

## Failure Modes & Countermeasures

| Failure | Correct Move |
| --- | --- |
| Fetching a resource by ID without checking `tenant_id` (IDOR) | Always scope queries: `WHERE id = $1 AND organization_id = $2`. |
| AI agent browsing user-supplied URLs fetching AWS metadata | Block private RFC1918 IPs (`10.0.0.0/8`, `192.168.0.0/16`, `169.254.169.254`) in DNS resolution. |
| Timing attack on HMAC signature verification | Use `crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))`. |
| Storing API keys or secrets in plaintext git commits | Use environment variables, secret managers, and pre-commit secret scanners. |
| Trusting unauthenticated client webhook callbacks | Verify cryptographic HMAC-SHA256 signatures before reading payload data. |

## Definition of Done

- [ ] All database queries parameterized; zero raw string interpolation.
- [ ] Authorization boundaries verified; all queries scoped to authenticated tenant.
- [ ] AI agent tool calls strictly sandboxed; URL fetching protected against SSRF.
- [ ] Passwords hashed with Argon2id; secret comparisons utilize timing-safe equality.
- [ ] Security headers (CSP, HSTS, X-Content-Type-Options) configured properly.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
