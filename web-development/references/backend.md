# Backend: endpoints, validation, concurrency, jobs, caching

Read when writing or changing endpoints, handlers, middleware, jobs, queues, caches, rate limits, or uploads. Schema, queries, and migrations are in [database.md](database.md); third-party calls and webhooks in [integrations.md](integrations.md); tests in [testing.md](testing.md).

## Every externally reachable handler follows one order

Authenticate (who), authorize (may this actor do this action on this resource), validate (shape and bounds), act atomically, respond with a minimal projection, log redacted context.

| Concern | Rule |
| --- | --- |
| Identity | Derive it from the verified session or token. Never trust `userId`, `tenantId`, `role`, `price`, or `isAdmin` from the body, query, or a client-set header |
| Resource access | Load by id **and** owner or tenant. Return 404 when existence must be hidden, 403 when revealing it is fine. A parent check does not cover an unrelated child id |
| Writable fields | Allowlist through the schema; never spread a request body into an ORM update (mass assignment) |
| Output | Return a projection, never a raw row: no hashes, tokens, internal ids, or other tenants' data. Counts, search, and exports are reads too |
| Limits | Body size, page size, request rate, timeout, concurrency |
| Public endpoints | Public by design still needs input limits and abuse controls. Do not invent a login requirement for a signup or webhook |

Fold the ownership and state guard into the write itself, so no gap exists between "check" and "update":

```sql
UPDATE invoices
SET status = $3, updated_at = now()
WHERE id = $1 AND tenant_id = $2 AND status IN ('draft', 'sent')
RETURNING id, status;
```

Zero rows returned means not found, not yours, or the wrong state; answer 404 or 409 accordingly.

## Error contract

Match the project's existing error shape. If there is none, use RFC 9457 problem details (`application/problem+json`) with a stable machine-readable `code`:

```ts
export function problem(status: number, code: string, extra: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({ type: `/problems/${code}`, title: code, status, code, ...extra }), {
    status,
    headers: { 'content-type': 'application/problem+json' },
  });
}
```

| Status | Use |
| --- | --- |
| 400 | Malformed request (bad JSON, bad syntax) |
| 401 / 403 | Not authenticated / authenticated but not allowed |
| 404 | Not found, or hidden because the caller may not know it exists |
| 409 | State or version conflict, or an idempotent request still in progress |
| 412 | `If-Match` precondition failed (optimistic concurrency over HTTP) |
| 413 / 415 | Body too large / unsupported media type |
| 422 | Well-formed but invalid fields (return per-field codes) |
| 429 | Rate limited; send `Retry-After` |
| 500 / 502 / 503 / 504 | Our fault / bad upstream / unavailable / upstream timeout. No stack traces or SQL in the body |

Never turn a failure into a success response or an empty list. Log the cause with a correlation id; give the client a safe message and a code.

## Validate and normalize

- Parse with a schema at the boundary instead of casting. Bound strings, arrays, numbers, and nesting. Reject unknown keys on writes or strip them consistently with the contract. Be careful with coercion: `Number('')` is `0`.
- Normalize before comparing or storing: trim, lowercase emails, Unicode NFC for names and usernames.
- **Money:** integers in minor units plus an ISO currency code, never floats. Minor units differ by currency (JPY has none, KWD has three). Display with `Intl.NumberFormat`.
- **Time:** store instants as UTC (`timestamptz`); store a local date plus an IANA time zone for calendar events and recurring schedules, since converting those to UTC breaks across DST. Use ISO 8601 on the wire.
- Unguessable ids (UUID, ULID) reduce discovery; they are not access control.

## Pagination, filtering, sorting

Paginate every list with a server-side maximum. Allowlist sortable and filterable fields. Use keyset (cursor) pagination for large or changing sets, with a unique tiebreaker so order is total; use offset only for small, static lists.

```sql
SELECT id, created_at, title
FROM posts
WHERE tenant_id = $1
  AND (created_at, id) < ($2, $3)
ORDER BY created_at DESC, id DESC
LIMIT $4;
```

Return an opaque `nextCursor` (base64url of the last row's sort keys) and treat a decoded cursor as untrusted input. Counts over big tables are expensive; make them optional or approximate.

## Idempotency and retries

Being retryable at the transport level does not make an operation idempotent.

| Situation | Action |
| --- | --- |
| Read failed transiently | Retry within attempt and elapsed-time limits |
| Validation, authentication, or permission failure | Fix the cause; never blind-retry |
| 429 | Honor `Retry-After` within the caller's deadline |
| Write timed out after dispatch | Look up the operation's status; do not assume failure |
| Provider supports idempotency keys | Persist the key with the logical operation and reuse it for every retry within its lifetime |
| Duplicate delivery or concurrent request | Deduplicate atomically in durable storage; an in-memory flag is not enough |

Every outbound call gets a timeout (`AbortSignal.timeout(5000)`) inside a total deadline. Retry at one layer only, with bounded exponential backoff and jitter, so retries do not multiply across layers.

To make your own unsafe `POST` idempotent, store the key with a hash of the request, insert before acting, and replay the stored result:

```ts
import { createHash } from 'node:crypto';
import type { Pool } from 'pg';

type Result = { code: number; body: unknown };

export async function withIdempotency(
  db: Pool, userId: string, key: string, payload: unknown, run: () => Promise<Result>,
): Promise<Result> {
  const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex'); // canonicalize key order first
  const claim = await db.query(
    `INSERT INTO idempotency_keys (user_id, key, request_hash, status)
     VALUES ($1, $2, $3, 'in_progress') ON CONFLICT (user_id, key) DO NOTHING RETURNING key`,
    [userId, key, hash],
  );
  if (claim.rowCount === 0) {
    const { rows } = await db.query(
      `SELECT request_hash, status, response_code, response_body
       FROM idempotency_keys WHERE user_id = $1 AND key = $2`, [userId, key]);
    const saved = rows[0];
    if (saved.request_hash !== hash) return { code: 422, body: { code: 'idempotency_key_reused' } };
    if (saved.status === 'completed') return { code: saved.response_code, body: saved.response_body };
    return { code: 409, body: { code: 'request_in_progress' } };
  }
  const result = await run();
  await db.query(
    `UPDATE idempotency_keys SET status = 'completed', response_code = $3, response_body = $4
     WHERE user_id = $1 AND key = $2`,
    [userId, key, result.code, JSON.stringify(result.body)],
  );
  return result;
}
```

Gaps to close in production use: record completion in the same transaction as the business write when you can; add a lock timeout so a crashed `in_progress` row can be retaken; expire rows after a day or so. `Idempotency-Key` is a widely used convention (the IETF draft has not become an RFC), so document your own semantics.

## Concurrency and transactions

| Problem | Tool |
| --- | --- |
| Lost update | Version column: `UPDATE ... SET ..., version = version + 1 WHERE id = $1 AND version = $2`; zero rows means conflict |
| Oversell or negative balance | Conditional update: `UPDATE stock SET qty = qty - $2 WHERE id = $1 AND qty >= $2` |
| "Check then insert" duplicate | Unique constraint; handle the violation (Postgres `23505`) |
| Double submit, webhook replay | Idempotency key or event-id dedupe table |
| Cross-row invariant | `SELECT ... FOR UPDATE` inside a transaction, or an advisory lock |
| Deadlock or serialization failure | Lock in a consistent order; retry on `40001` and `40P01` |

Do not hold a database transaction open across a slow network call. To commit data and publish a message consistently, write the message to an outbox table in the same transaction and let a worker publish it.

## Background jobs and queues

- Delivery is at least once, so handlers must be replay-safe. Record completion atomically with the effect.
- Set max attempts, backoff with jitter, a dead-letter path, and an alert on it. Make the visibility timeout longer than the longest run.
- Put ids in the payload, not blobs. Re-read current state when the job runs; the world may have changed.
- Guard scheduled jobs against overlap (a lock or unique job key). Shut down gracefully on `SIGTERM`.
- Cap concurrency per resource so a burst does not exhaust the database or a provider's rate limit.

## Caching

The key must contain every input that changes the output: tenant, permission scope, locale, parameters, schema version. A client-side filter cannot repair a cache that is too broad.

| Choice | Guidance |
| --- | --- |
| TTL only | Fine when staleness is acceptable |
| Strict freshness | Invalidate on write, version the key, or skip the cache |
| Personalized response | `Cache-Control: private`; never in a shared or CDN cache without the user in the key |
| Stampede on expiry | Single-flight, stale-while-revalidate, jittered TTLs |
| Misses worth remembering | Short-lived negative caching |

```ts
const inflight = new Map<string, Promise<unknown>>();

export function singleFlight<T>(key: string, load: () => Promise<T>): Promise<T> {
  const running = inflight.get(key);
  if (running) return running as Promise<T>;
  const promise = load().finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}
```

This collapses concurrent loads inside one process; use a distributed lock across instances. Measure the hit rate and the staleness cost before adding another cache layer.

## Rate limiting and abuse

Limit expensive and abusable operations: login, OTP send and verify, password reset, signup, search, exports, email-sending, and anything that costs money. Choose the key deliberately (user id, API key, IP behind a trusted proxy's `X-Forwarded-For` hop). Use a token bucket or sliding window in shared storage (Redis `INCR` with `EXPIRE`, atomically set or via Lua). Return 429 with `Retry-After`. Decide fail-open or fail-closed per route: a limiter outage should not take down checkout, but should not disable login throttling silently. Hard account lockout lets attackers lock victims out; prefer progressive delays, step-up verification, or per-IP plus per-account limits.

## File uploads (implementation)

Prefer direct-to-storage uploads with a presigned URL or POST policy that fixes the object key, content type, and maximum size, with a short expiry. The server generates the storage key (never use a client filename as a path), records metadata after the upload completes, and verifies it (size, detected type) before use. Keep objects private by default, serve user content from a separate origin with `Content-Disposition` and `X-Content-Type-Options: nosniff`, and bound size, count, and image pixel dimensions.

## Observability inside handlers

Log structured events with a request id, route, status, duration, and error code; propagate the id to outbound calls. Never log bodies, tokens, or personal data. Track rate, errors, and duration per route, and expose separate liveness and readiness checks (readiness verifies critical dependencies).

## Stack reminders

- **Node:** `new Error('message', { cause })` preserves causes; handle unhandled rejections; use `crypto.timingSafeEqual` for secret comparison; move CPU-heavy work off the event loop.
- **Python (FastAPI, Django):** validate with Pydantic or serializers; do not block an async event loop with sync I/O; use `transaction.atomic` and `F()` for atomic updates; `select_related` and `prefetch_related` against N+1.
- **PHP (Laravel):** Form Requests and policies for validation and authorization; guard mass assignment with `$fillable`; `DB::transaction` and `lockForUpdate`; `ShouldBeUnique` for jobs.
