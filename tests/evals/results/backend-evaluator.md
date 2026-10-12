# Backend evaluator record

## Original task input

Repository AGENTS.md requires independent evaluation of substantial skill changes. Use only the named skills and routed references in C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills; do not read tests/evals, edit the repository, or contact external targets. Complete these actual realistic requests, stating evidence limits, without grading yourself. Request 1: Use web-development. In a Next.js 16 app, a page redirects signed-out users. An action deleteProject(projectId, ownerId) runs DELETE FROM projects WHERE id = projectId and then revalidateTag('projects'). Recommend a focused safe implementation. getSession() is available; installed framework docs/types and the running app are not provided in this evaluation. Request 2: Use web-development. Fix a webhook design that verifies a signature on JSON.stringify(parsedBody), queries processed_events for event.id, inserts the marker outside a transaction, then updates the order. Concurrent provider retries and a database failure after insertion are possible. Give the replacement processing contract and useful local verification cases; no actual database or provider fixture is supplied. Request 3: Use security. Findings only: a link-preview handler blocks hostnames with a regex for 10.*, 127.*, 192.168.*, then calls fetch(input) with redirects enabled. A ticket-reading agent may look up any customer and send an email. Give actionable findings and safeguards. Do not send requests or treat this description as an executed exploit.

## Actual resources and commands used

All read commands used this working directory:

```text
C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills
```

First command:

```powershell
Get-Content -LiteralPath 'AGENTS.md'; Get-Content -LiteralPath 'web-development/SKILL.md'; Get-Content -LiteralPath 'security/SKILL.md'
```

The following five independent read commands were issued in one functions.exec call using Promise.allSettled:

```powershell
Get-Content -LiteralPath 'web-development/references/nextjs.md'
Get-Content -LiteralPath 'web-development/references/backend.md'
Get-Content -LiteralPath 'security/references/audit-playbook.md'
Get-Content -LiteralPath 'security/references/ai-agents.md'
Get-Content -LiteralPath 'security/references/access-control.md'
```

Absolute resource paths:

- C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\AGENTS.md
- C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\web-development\SKILL.md
- C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\security\SKILL.md
- C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\web-development\references\nextjs.md
- C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\web-development\references\backend.md
- C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\security\references\audit-playbook.md
- C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\security\references\ai-agents.md
- C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\security\references\access-control.md

No tests/evals were read. No scenario, application, database, provider fixture, external request, or email was executed. No repository files were edited. This record was saved with tools.apply_patch after the responses were complete; it does not rerun or grade the scenarios.

Record-only file-existence verification (exit code 0):

```powershell
Get-Item -LiteralPath 'C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\evaluations\backend-evaluator.md' | Select-Object FullName, Length
```

## Exact completed responses

1. **Project deletion**

The page redirect does not protect the callable action. Authenticate inside `deleteProject`, discard the client-supplied `ownerId`, and enforce ownership in the delete itself.

A focused implementation should:

- Accept and runtime-validate only `projectId`, using the application’s existing ID format and validation library.
- Call `getSession()` inside the action and require a trusted authenticated user ID.
- Execute a parameterized, ownership-scoped delete. For an owner-owned model, a PostgreSQL-style fragment is:

```sql partial
DELETE FROM projects
WHERE id = $1 AND owner_id = $2
RETURNING id;
-- $1: validated project ID
-- $2: authenticated user ID from getSession()
```

- Check the affected rows. Return the same minimal “Project unavailable” result for a missing project and a project owned by someone else. Invalidate only after a successful committed deletion.
- Preserve existing dependency and foreign-key behavior; put dependent writes in a transaction when required.

Remove `ownerId` from the action’s public signature and update its callers. If deletion depends on team roles, add the actual trusted tenant and delete-capability predicate instead of assuming ownership alone grants permission.

For immediate freshness after deletion, the routed Next.js reference recommends `updateTag` in a Server Action. Use a server-derived tag such as `projects:${authenticatedUserId}`, with matching tagged reads. If stale-while-revalidate behavior is acceptable, the reference identifies `revalidateTag(tag, 'max')` as the alternative. Verify the chosen signature against the installed Next.js 16 types/docs before implementing; the original one-argument call should not be retained mechanically.

The underlying read query and cache key must also include trusted user/tenant identity. A scoped tag alone does not isolate cached private data. A cache failure after the database commit does not undo deletion; preserve that outcome and provide refresh/recovery handling.

Useful verification cases: signed-out direct action invocation; another user’s valid project ID; a forged old `ownerId`; malformed IDs; missing IDs; successful own-project deletion; database failure; and freshness/isolation for two users.

**Evidence:** Inferred from the supplied design. Assumed: an owner-owned project model and PostgreSQL-style illustrative SQL. Not run: application, database, compiler, cache behavior, or installed API verification.

2. **Webhook processing**

Verify the signature over the exact received raw bytes. `JSON.stringify(parsedBody)` reconstructs a different representation and is unsuitable unless the provider explicitly specifies that representation.

Replace the processing sequence with this contract:

```text
Read raw body with a size limit.
Verify using the provider-supported mechanism and configured endpoint secret.
Parse/validate the authenticated event and relevant business identifiers.
Derive provider/account/environment scope from trusted endpoint configuration.

Begin database transaction:
  Insert a marker under a unique
    (provider, account, environment, event_id) constraint.
  If a committed duplicate wins the conflict:
    finish without applying the effect again.
  Otherwise:
    apply the order transition with a valid-state/version guard.
    insert a durable outbox task if an external effect is required.
Commit.

Acknowledge only after durable success.
On transaction failure, roll back both marker and order change;
return the provider-appropriate retryable failure response.
```

Remove the separate existence check as the deduplication authority. The unique constraint must arbitrate concurrent retries. Use the database’s conflict-handling semantics correctly: a competing transaction may need to wait, and a uniqueness error may abort a transaction rather than permit further statements.

The marker and order change must commit together. If the database fails after marker insertion but before the order update, rollback must leave the event retryable. If commit succeeds but the acknowledgment is lost, the retry must recognize the committed duplicate.

Event deduplication also does not establish ordering. Define permitted order transitions and use provider-supported versions or authoritative reconciliation to prevent a late event from regressing state. A valid obsolete event can commit as an explicitly classified no-op. Do not silently mark an unexpected missing order as successfully processed if it requires retry or reconciliation.

For external effects, commit an outbox entry alongside the order change. Workers need provider-supported idempotency or reconciliation for the crash window after external success and before local acknowledgment; an outbox alone does not guarantee exactly-once delivery.

Useful local verification cases:

| Case | Required result |
|---|---|
| Valid signed raw body | One marker and intended order change commit |
| Modified bytes or invalid signature | No trusted processing |
| Sequential replay | No repeated effect |
| Concurrent duplicate deliveries | One committed effect |
| Failure after marker insert, before order update | Neither change commits; retry succeeds |
| Failure after order update, before commit | Neither change commits |
| Commit succeeds, acknowledgment is lost | Retry acknowledges without repeating effect |
| Older event arrives later | Order state does not regress |
| Same event ID in different legitimate scopes | Correct independent treatment |
| Outbox worker crashes after external success | Idempotency/reconciliation prevents duplicate effect |

**Evidence:** Inferred processing defects and replacement contract. Not run: provider verification, concurrent transactions, rollback behavior, or worker recovery; no database or provider fixture was supplied.

3. **Security findings only**

**Finding: Link-preview destination policy permits plausible SSRF bypasses.**

- **Location:** The described link-preview handler’s hostname regex and redirect-enabled `fetch(input)`.
- **Precondition:** An attacker can submit a preview URL, and the server can reach a protected destination.
- **Path to impact:** A hostname can resolve to an internal address without matching the regex. Public destinations can redirect internally. The filter also omits address families and ranges such as IPv6 loopback, IPv4-mapped IPv6, link-local addresses, and other private/reserved ranges. A DNS check followed by an uncontrolled lookup during connection would additionally permit rebinding.
- **Impact/severity:** High, inferred where reachable internal services or sensitive responses exist. The description establishes inadequate filtering; actual network reachability and disclosure are unverified.
- **Smallest useful fix:** Apply one connection policy to literals, DNS answers, and redirect targets. Use standard URL parsing, permit required HTTP(S) schemes and ports, reject credentials, normalize addresses with a maintained library, and validate every A/AAAA candidate. Connect to the validated address while preserving TLS hostname/certificate checks, or use controlled egress that enforces this policy. Disable redirects unless needed; otherwise bound and revalidate every hop. Bound response size, decompression, and time, and prevent forwarding service credentials.
- **Verification:** Synthetic resolver/listener cases for public success, private and loopback rejection, mixed DNS answers, redirect rejection, changed DNS answers, and bounded responses.
- **Not run:** Requests, probes, or exploit execution.

**Finding: Broad customer-read and email capabilities create a plausible agent exfiltration path.**

- **Location:** The ticket-reading agent’s customer lookup and email tools.
- **Precondition:** An attacker controls ticket text; customer lookup exposes sensitive data outside the legitimate task scope; email permits unauthorized destination/content combinations.
- **Path to impact:** Ticket instructions could induce lookup of another customer and transmission of the result. Ticket content must remain untrusted data and cannot grant lookup or send authority.
- **Impact/severity:** High, inferred if those tool-level authorization and data-flow restrictions are absent. “May look up any customer and send an email” describes the capabilities, but does not prove that recipient controls are absent or an injection succeeds.
- **Smallest useful fix:** Enforce trusted acting identity, tenant/object scope, permitted action, and minimum returned fields in tool code. Bind the workflow to authorized ticket/customer context where appropriate. Restrict send recipients and permitted data outside the model; remove send capability when the workflow does not need it. Preserve existing exact user authorization. Where a send lacks authorization, prepare the exact recipient and content for approval. A prompt reminder alone cannot enforce these boundaries.
- **Verification:** Synthetic tickets should fail to gain cross-tenant reads, expanded capabilities, or unauthorized sends while legitimate authorized workflows remain possible.
- **Not run:** Agent execution, customer access, or email transmission.
