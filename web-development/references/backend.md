# Backend: contracts, data, migrations, and integrations

Read for endpoints, persistence, jobs, webhooks, and third-party calls. Adapt the contract to the service rather than requiring every possible mechanism for every endpoint.

## Endpoint boundary

Establish the caller, resource policy, accepted fields, output shape, side effects, resource limits and error contract. Authenticate before expensive parsing where the transport permits; parse enough to identify and authorize the target without trusting an unvalidated identifier.

- Work with validated values. Reject or strip unknown write fields consistently with the API contract; explicitly select writable properties so raw input never becomes a database update object.
- Derive identity from verified credentials. A requested tenant or object ID is a selector that must be authorized, not proof of access.
- Scope protected reads and writes to permitted resources before returning data. Include counts, search, exports and nested resources. A deliberately public endpoint needs explicit public policy, not invented login requirements.
- Recheck sensitive state-dependent conditions atomically with the write where races matter.
- Return stable machine-readable errors and useful safe messages. Follow existing HTTP semantics, including consistent handling when resource existence must be hidden.
- Log redacted diagnostic context with a correlation identifier. Do not echo raw query text, credentials, request bodies or infrastructure details to clients.

## Data integrity and query shape

Use schema constraints for invariants the database can enforce: uniqueness, references, nullability and valid ranges. Application checks alone are insufficient under concurrency. Use transactions, conditional updates, version checks or locks according to the actual contention pattern.

Inspect query plans against the database engine and representative volume before prescribing indexes. Composite index order depends on predicates, sorting, selectivity and engine behavior, not the textual order of a WHERE clause. Avoid accidental N+1 work; bounded loops or streaming batches may legitimately issue repeated queries.

Bound user-facing lists with pagination and maximum sizes. For large exports/backfills, use streaming or batching with a stable cursor; compare keyset pagination to offset when deep pages matter.

Represent money with suitable exact arithmetic and an explicit currency; minor units vary by currency. Store instants with unambiguous time-zone semantics. Preserve local dates and time zones for calendar events and recurring schedules instead of converting every domain value blindly to UTC.

## Migrations

Choose rollout complexity based on data volume, availability and coexistence requirements.

1. Inspect the exact engine/version, table size, lock behavior and transactional DDL support.
2. When old/new application versions coexist, use an expand/backfill/contract sequence with explicit read/write transition and reconciliation. Dual writes add consistency work; do not add them reflexively.
3. Bound and checkpoint substantial backfills. Make interruption, rerun and partial completion safe; verify counts and representative invariants.
4. Define rollback, forward repair or restoration before consequential execution. Code rollback cannot reconstruct deleted data. Confirm backup freshness and actual restoration capability when relying on backups.
5. Run a dry run or representative rehearsal when feasible. Inspect for concurrent writes and version skew, not just small-fixture execution time.
6. Apply authorized changes to the verified target. Ask only for missing authorization or an unresolved consequential choice; do not invent a second sign-off.

## Retry and idempotency

An operation being retryable in transport does not make its effects idempotent.

| Result | Action |
| --- | --- |
| Read failed transiently | Retry within attempt and elapsed-time limits when appropriate |
| Validation/authentication/permission failure | Correct the cause; do not blind-retry |
| Rate limit | Respect provider guidance such as Retry-After within the caller's deadline |
| Write timed out after dispatch | Look up operation status or reconcile; do not assume failure |
| Provider supports an idempotency key | Persist and reuse the same key for the same logical operation, within its documented lifetime |
| Duplicate delivery or concurrent request | Deduplicate atomically with durable state; in-memory flags are insufficient |

Set per-call timeouts, total deadlines, response-size limits and cancellation behavior. Use bounded backoff with jitter only for retry-safe transient failures. Avoid retry multiplication across several layers. When a provider gives an unknown outcome, surface a pending/reconciliation state rather than claiming failure or success.

## Webhooks and jobs

Follow the provider's signature protocol exactly: some require unmodified raw bytes, timestamp tolerance, or a particular canonical form. Verify identity before side effects, check account/resource scope, and avoid logging signing secrets.

Durably accept the event before acknowledging successful receipt. Deduplicate by the provider's event identity and business operation when necessary; duplicate event IDs are not the only way one logical action can repeat. Expect out-of-order delivery and retrieve authoritative state or validate transitions. A queue consumer must make side effects replay-safe and record completion atomically where possible.

Do not mark an event processed before its effect succeeds. Avoid holding database transactions across slow external calls; use a durable outbox or state machine when committing data and publishing a message must stay consistent. Specify maximum attempts, retryable failures, a dead-letter/reconciliation path and useful alerts. Acknowledgement or enqueue success alone is not proof that the business action completed.

## Caching

Define key inputs, authorization scope, freshness tolerance and invalidation. Include tenant, actor or permission scope when they affect the representation; a client UI filter cannot repair an overly broad server cache. Distinguish a private browser cache from a shared cache.

TTL can be a valid freshness strategy for data that tolerates staleness. For stricter invariants use invalidation, versioned keys or an uncached read. Consider stampedes, negative caching and failed writes. Measure benefit against consistency cost before adding another cache layer.

## Primary reference

[Stripe webhook documentation](https://docs.stripe.com/webhooks) illustrates provider-specific raw-body verification, repeated events and delivery ordering. Apply each integration's own protocol instead of assuming Stripe's rules are universal.
