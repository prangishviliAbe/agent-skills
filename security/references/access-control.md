# Access Control & IDOR Prevention

Read when: You are securing multi-tenant databases, setting up Postgres Row-Level Security (RLS), or preventing Insecure Direct Object References (IDOR/BOLA).

---

## 1. IDOR / BOLA Prevention Architecture

Never assume an authenticated user is authorized to view or mutate a specific resource simply because they know its ID.

```typescript partial
// VULNERABLE: Direct access via ID only
export async function getInvoice(invoiceId: string) {
  return await db.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId)
  });
}

// HARDENED: Scoped to authenticated tenant
export async function getInvoiceSecure(invoiceId: string, sessionOrgId: string) {
  const invoice = await db.query.invoices.findFirst({
    where: and(
      eq(invoices.id, invoiceId),
      eq(invoices.organizationId, sessionOrgId) // Enforce ownership
    )
  });

  if (!invoice) {
    throw new Error('Not found or unauthorized');
  }
  return invoice;
}
```

---

## 2. Postgres Row-Level Security (RLS)

RLS provides defense-in-depth at the database engine level:

```sql
-- Enable RLS on sensitive table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Define tenant isolation policy
CREATE POLICY tenant_isolation_policy ON documents
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id')::uuid);
```
