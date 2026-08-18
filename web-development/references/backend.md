# Backend: APIs, data, migrations, caching, jobs

Read when designing or reviewing an endpoint, a database change, a background job, or an integration with a third party.

## Endpoint contract

Every endpoint answers these before it is written:

```
Method + path
Who may call it        (auth requirement, role, ownership/tenant scope)
Input schema           (types, required, ranges, max lengths)
Output schema          (success shape, and every error shape)
Failure modes          (400 / 401 / 403 / 404 / 409 / 422 / 429 / 5xx and when each is returned)
Idempotency            (safe to retry? keyed how?)
Side effects           (writes, emails, webhooks, payments, jobs enqueued)
Limits                 (page size cap, payload cap, rate limit, timeout)
```

If any line is blank, the endpoint is not designed yet.

## Validation and authorization, in that order

1. **Parse, then use.** Validate against an explicit schema at the boundary and work only with the parsed value afterwards. Never validate one variable and then use the raw one.
2. **Reject unknown fields** on write endpoints so a client cannot smuggle `role`, `isAdmin`, `price`, or `userId` into a mass assignment.
3. **Authorize the object, not the route.** A user with a valid session is not authorized for row 4211. Check ownership or tenant scope on the specific record.
4. **Scope the query, do not filter after.** `where tenant_id = :actor_tenant` at the database, not `records.filter(...)` in application code. Broad-then-filter leaks through counts, pagination, and future refactors.
5. **Deny by default.** New routes are private until explicitly opened. A missing permission check must fail closed.
6. **Never trust an identifier as proof of access.** IDs in URLs, hidden inputs, JWT claims not verified server-side, and client-sent tenant hints are all attacker-controlled.

## Errors

- Stable machine-readable `code`, human-readable `message`, and optional `details` for field errors.
- Never leak stack traces, SQL, internal hostnames, file paths, or dependency versions to clients.
- Distinguish 401 (who are you) from 403 (I know who you are, and no). Use 404 instead of 403 only when existence itself is sensitive, and do it consistently.
- Log the full context server-side with a correlation ID, and return that ID to the client so support can trace it.

## Database

**Query health**

- Every list query is bounded: a page size with a hard maximum, or an explicit limit. No unbounded `SELECT *` on a growing table.
- No query inside a loop. Batch with `IN`, a join, or a dataloader.
- Indexes match the real access pattern: the columns you filter on, in the order you filter them, including the sort column when it drives the plan. Verify with the query planner rather than assuming.
- Watch for the silent killers: a function wrapped around an indexed column, a leading wildcard `LIKE`, an implicit type cast, and `OFFSET` deep-paging on a large table (prefer keyset pagination).

**Integrity**

- Enforce invariants in the schema: `NOT NULL`, unique constraints, foreign keys, check constraints. Application-level uniqueness loses to concurrency.
- Wrap multi-step invariants in a transaction, keep the transaction short, and never perform network calls inside one.
- Concurrency: use a unique constraint plus upsert, an atomic conditional update, or explicit row locking. Read-then-write without protection is a race.
- Money is never a float. Use integer minor units or a decimal type, and store the currency alongside it.
- Store timestamps in UTC with timezone awareness; convert at the presentation edge only.

## Migrations

Treat every migration as a production event.

1. **Expand, migrate, contract.** Add the new nullable column or table. Backfill in batches. Dual-write and read from the new path. Only then drop the old one, in a later release.
2. **Never destructive and deploy-coupled in one step.** A `DROP COLUMN` in the same release as the code that stops using it makes rollback impossible.
3. **Backfill in batches** with a bounded loop and a resumable cursor, not one statement across millions of rows.
4. **Know the lock behavior** of your engine for the specific operation. Adding an index on a large table can block writes; use the concurrent variant where available.
5. **Write the rollback before running the migration.** If a clean rollback is impossible, say so explicitly and get confirmation first.
6. **Test on a realistic data volume.** A migration that takes 40ms on 200 rows can take 40 minutes on 20 million.

## Idempotency and external calls

- Any endpoint that can be retried by a client, a queue, or a payment provider must be safe to run twice. Use an idempotency key, a unique constraint on a natural key, or a state machine that ignores repeats.
- Webhook receivers: verify the signature over the **raw** body before parsing, reject stale timestamps, deduplicate by event ID, respond fast, and do the work asynchronously.
- Outbound calls always have a timeout, a bounded retry with exponential backoff and jitter, and a defined behavior when the dependency is down. Unbounded retries turn a partner outage into your outage.
- Never let a third party's latency hold a database transaction or a user's request open.

## Caching

Add a cache only after these four are answered: what is cached, what is the key, when is it invalidated, and what breaks if it serves stale data.

- Prefer deriving the key from every input that changes the output, including the actor when the output is user-specific. A cache keyed too broadly is a data leak.
- Never cache authorized responses in a shared cache without including the authorization scope in the key or marking them private.
- Invalidate on write at the source of truth. Time-based expiry is a fallback, not a strategy.
- Measure the hit rate. A cache below a meaningful hit rate is complexity with no benefit.

## Background jobs

- Jobs are retried, so they must be idempotent.
- Set a maximum attempt count and a dead-letter path. A job retrying forever is an outage with no alert.
- Pass identifiers, not whole objects: the payload can be stale by the time it runs.
- Make progress observable: enqueue time, start time, duration, outcome, failure reason.
- Long jobs must be resumable and cancellable, and must not hold a lock or a transaction open.

## Observability

Every meaningful operation emits: what happened, who triggered it, which resource, how long it took, and the outcome. Structured fields, not string concatenation.

- Log at the boundary and at failures. Do not log inside tight loops.
- Never log secrets, tokens, passwords, full card numbers, or personal data beyond what is necessary.
- Propagate a correlation ID from the inbound request through jobs and outbound calls.
- Alert on symptoms users feel (error rate, latency, queue depth), not on individual log lines.
