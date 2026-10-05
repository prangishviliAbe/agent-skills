# Database: schema, queries, indexes, migrations

Read when designing tables, writing or tuning queries, or changing a schema that has live data. Handler-level concurrency patterns (conditional updates, idempotency keys, outbox) are in [backend.md](backend.md). SQL examples use PostgreSQL syntax; check the engine and version before copying them to MySQL or SQLite.

## Orient first

Identify the engine and version, the ORM or query builder, the migration tool, the schema source of truth (migrations directory, `schema.prisma`, models), and how migrations reach production (CI, deploy hook, manual). Look at the real table before changing it: `\d+ table` in `psql`, `SHOW CREATE TABLE table` in MySQL, `.schema table` in SQLite.

## Schema rules

- Let the database enforce invariants: primary keys, foreign keys with an explicit `ON DELETE`, `NOT NULL`, `UNIQUE`, `CHECK` for ranges and states. Application checks alone fail under concurrency.
- Types: `timestamptz` for instants; integer minor units or `numeric(p,s)` for money, with a currency code; `bigint` or `uuid` keys; `jsonb` only for genuinely schemaless extras, not for fields you filter, join, or constrain.
- Multi-tenant tables carry `tenant_id`, scope unique constraints per tenant (`UNIQUE (tenant_id, slug)`), and lead composite indexes with it. Row-level security is defense in depth; application scoping is still required.
- Soft delete needs partial unique indexes (`UNIQUE (email) WHERE deleted_at IS NULL`) and a default filter everywhere the table is read. Decide up front how erasure requests are honored.
- Case-insensitive uniqueness: `citext` or a unique index on `lower(email)`.

## Queries

- Bind values through the driver's placeholders; allowlist dynamic identifiers (sort columns, table names). ORM raw escape hatches (`$queryRawUnsafe`, `sql.raw`, string-built `raw()`) are where injection lives.
- Select the columns you need; bound every list with `LIMIT`; aggregate in SQL rather than in application loops.
- Find N+1 by counting queries per request (enable query logging) and fix it with a join, an `IN` batch, eager loading (`include`, `with`, `select_related`, `prefetch_related`), or a dataloader.
- Do not wrap an indexed column in a function in `WHERE` (`date(created_at) = ...` defeats the index; use a range, or add an expression index).
- Upsert with `INSERT ... ON CONFLICT (cols) DO UPDATE` (PostgreSQL, SQLite) or `ON DUPLICATE KEY UPDATE` (MySQL).
- Claim queue rows without double-processing using `FOR UPDATE SKIP LOCKED`:

```sql
WITH next AS (
  SELECT id FROM jobs
  WHERE status = 'queued' AND run_at <= now()
  ORDER BY run_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
UPDATE jobs SET status = 'running', locked_at = now()
FROM next WHERE jobs.id = next.id
RETURNING jobs.*;
```

## Indexes and query plans

Read the plan on representative data volume, with current statistics (`ANALYZE`), before prescribing an index:

```sql partial
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;   -- PostgreSQL
EXPLAIN ANALYZE SELECT ...;              -- MySQL 8.0.18+
EXPLAIN QUERY PLAN SELECT ...;           -- SQLite
```

Look for a sequential scan on a large table behind a selective filter, a sort that spills to disk, a large gap between estimated and actual rows (stale statistics), high "rows removed by filter", and nested loops over big inputs.

| Query shape | Index |
| --- | --- |
| `WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC` | `(tenant_id, status, created_at DESC)`: equality columns first, then the sort or range column |
| Only a small subset is ever queried (`status = 'queued'`) | Partial index `... WHERE status = 'queued'` |
| Query needs a few extra columns | Covering index with `INCLUDE (...)` |
| `lower(email) = ?` | Expression index on `lower(email)` |
| `ILIKE '%term%'`, fuzzy search | `pg_trgm` GIN index; full text uses `tsvector` with GIN |
| `jsonb` containment, array membership | GIN |

Foreign-key columns are not indexed automatically in PostgreSQL; index the ones used in joins and cascading deletes. Each extra index slows writes, so drop indexes that stay unused (`pg_stat_user_indexes.idx_scan`) over a representative period. Column order follows predicates, sort, and selectivity, not the textual order of the `WHERE` clause. Build indexes online with `CREATE INDEX CONCURRENTLY` (not allowed inside a transaction block; a failed attempt leaves an `INVALID` index to drop).

## Transactions

- Keep transactions short and free of network calls. Set `statement_timeout`, `lock_timeout`, and `idle_in_transaction_session_timeout` so one stuck session cannot stall everything.
- Know the engine default: PostgreSQL uses READ COMMITTED, MySQL InnoDB uses REPEATABLE READ. Prefer constraints, conditional updates, and targeted locks over raising isolation. Under SERIALIZABLE, retry on SQLSTATE `40001`.
- In ORMs, use the transaction handle inside the callback. Using the outer client there silently runs outside the transaction.
- Connection pools: pool size times instance count must stay under the server's `max_connections`. Serverless needs an external pooler; transaction-mode pooling breaks session state and may break prepared statements.

## Migrations that survive live traffic

Treat every schema change as a deployment with two code versions alive at once. Use **expand, backfill, contract**.

Rename a column without downtime:

1. **Expand.** `ALTER TABLE users ADD COLUMN full_name text;` Deploy code that writes both columns and reads the new one, falling back to the old.
2. **Backfill in bounded batches**, throttled, resumable, safe to rerun. Watch replication lag. Verify counts and a sample at the end:

```sql
UPDATE users SET full_name = name
WHERE id IN (SELECT id FROM users WHERE full_name IS NULL ORDER BY id LIMIT 5000);
```

3. **Switch** reads and writes to the new column. Keep dual writes only as long as old code can still run.
4. **Contract** in a later release: drop the old column after confirming no reader remains and a restorable backup exists.

Lock-aware PostgreSQL patterns:

```sql
SET lock_timeout = '3s';  -- fail fast instead of queueing behind a long transaction and blocking all traffic

-- Add NOT NULL without a long exclusive scan
ALTER TABLE orders ADD CONSTRAINT orders_customer_nn CHECK (customer_id IS NOT NULL) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_nn;   -- scans without blocking writes
ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;    -- uses the validated check (PostgreSQL 12+)
ALTER TABLE orders DROP CONSTRAINT orders_customer_nn;

-- Add a foreign key in two steps
ALTER TABLE orders ADD CONSTRAINT orders_customer_fk FOREIGN KEY (customer_id) REFERENCES customers (id) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_fk;

-- Add a unique constraint without blocking writes
CREATE UNIQUE INDEX CONCURRENTLY orders_number_uq ON orders (number);
ALTER TABLE orders ADD CONSTRAINT orders_number_uq UNIQUE USING INDEX orders_number_uq;
```

Adding a nullable column, or one with a constant default on PostgreSQL 11 and later, is a metadata change; a volatile default rewrites the table. MySQL: use `ALGORITHM=INPLACE, LOCK=NONE` where supported, and gh-ost or pt-online-schema-change for very large tables.

Rules that prevent the usual disasters:

- Dropping or renaming a column or table breaks the old code that is still running during a rolling deploy. Do it in the contract step.
- Never edit a migration that has already been applied elsewhere; add a new one. Keep schema and data migrations separate.
- Review generated migrations. ORMs detect a rename as drop plus add, which destroys data. Never run `prisma migrate reset`, `db push --force-reset`, or any "reset" against a database that is not disposable.
- Define the recovery path before running anything destructive. Reverting code cannot restore dropped data. Confirm a recent backup exists and that a restore has actually been tested.
- Rehearse on a restored copy of production-shaped data: record duration, locks taken, and app behavior against both the old and new schema.

## Operating on live data

Before any destructive statement: confirm the exact target and authorization, run a `SELECT` with the same `WHERE` and check count and sample, run inside a transaction you can roll back, and have a backup or snapshot. Give the application a role without DDL rights and run migrations with a separate role. Investigate with read-only roles or replicas. Use synthetic or masked data outside production; never copy personal data into a development database.

## Verify

Run the migration up on an empty database and on a production-shaped copy, run the application tests against the result, and exercise old and new application versions against both schema states when deploys roll. For a slow-query fix, record the plan and timing before and after on the same data. Report what you could not rehearse.
