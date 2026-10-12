# Authorization, RLS, and atomic invariants

Read when: Protecting object/tenant boundaries, exports, row-level policies, or concurrent mutations.

| Operation | Enforce |
| --- | --- |
| Read one object | Object scope plus trusted acting identity and permitted action |
| List/search/export | Tenant scope and field-level disclosure as required |
| Update/delete | Authorization in the write predicate or equivalent atomic operation |
| Background job | Trusted identity/capability carried from the authorized request |
| Role-sensitive action | Actual role/capability check, not merely signed-in status |
| Single-use entitlement | Atomic state/constraint enforcement, not read-then-write |

Client-supplied organization/owner IDs are selectors, not proof of authority. Return minimal safe data; error behavior should not unnecessarily reveal another tenant's objects.

## Transaction-local RLS fragment

```sql partial
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_scope ON documents
  USING (
    organization_id =
      NULLIF(current_setting('app.current_org_id', true), '')::uuid
  )
  WITH CHECK (
    organization_id =
      NULLIF(current_setting('app.current_org_id', true), '')::uuid
  );
```

This assumes a trusted server sets the organization from the authenticated context, transaction-locally, on the same connection. Application users must not be able to set arbitrary tenant context. Superusers and BYPASSRLS roles bypass RLS; FORCE addresses table-owner behavior, not every privilege. Review all policies, service roles, views, functions, and pooled-connection reset behavior. See [PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) for the deployed version.

## Atomic entitlement example

```sql partial
UPDATE coupons
SET uses_left = uses_left - 1
WHERE id = $1
  AND organization_id = $2
  AND uses_left > 0
RETURNING id;
```

Check the affected rows. Couple dependent business effects in the necessary transaction; define who may redeem the coupon and enforce any per-user constraints too.

Test wrong identity/tenant, boundary roles, missing context, inserts/updates under policy, and bounded concurrent attempts. An in-memory lock or disabled button does not establish a database invariant across workers.
