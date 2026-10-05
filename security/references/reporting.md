# Findings, confidence, and verification

Read when producing an audit result or remediation plan. Write for someone deciding what to fix and how to verify it, not for a vulnerability count.

## Classify the evidence

| Status | Meaning | Report as |
| --- | --- | --- |
| Demonstrated | A safe test or a complete code and config trace establishes the policy violation under stated conditions | A finding; say which evidence is runtime and which is static |
| Supported hypothesis | A plausible path with one named missing condition, control, or deployment fact | The gap and the smallest check that confirms or disproves it |
| Hardening | An improvement with no established violation or attack path | Separate from vulnerabilities, with benefit and cost |
| Disproved or out of scope | An effective control, unreachable configuration, or unrelated surface | Not an active finding; mention only if it settles the user's concern |

A code review can establish a defect without running an exploit. Being unable to reach the deployment cannot prove it is safe. Keep uncertainty visible in both directions.

## Finding template

One finding per root cause; list every affected location under it. Use paragraphs for a single simple finding, and the full template when someone must act on it.

```markdown
### [High] Any signed-in user can read another tenant's invoices
**Where:** `src/data/invoices.ts:42` (`getInvoice`); same pattern in `exportInvoices` (`src/jobs/export.ts:18`). Revision `a1b2c3d`.
**Actor and prerequisites:** any account with a valid session; a target invoice id (ids are sequential).
**Invariant violated:** "A user reads only invoices of their own tenant."
**Evidence (Demonstrated, static plus local test):** `requireLogin` is the only middleware; the query filters by `id` only (trace below). A local test with two synthetic tenants returned tenant A's invoice to tenant B.
**Impact:** cross-tenant read of invoice contents (names, addresses, amounts). No write access shown.
**Confidence:** high for the read path; unverified whether a CDN caches the response.
**Fix:** scope by `tenantId` from the session in the data layer and return 404 on no match; apply the same scope in the export job.
**Verify:** two-tenant test against the route, the list and count endpoints, and the export; expect 404 and empty results across tenants.
```

Keep live secrets, personal records, and exploit output out of the report. Redact examples.

## Severity and priority

Use the project's scale if there is one. Otherwise justify the rating from reachability, required privileges and interaction, scope, and consequence. Vulnerability class does not decide severity: stored XSS, SSRF, exposed keys, and access-control flaws range from trivial to critical depending on capability and context. If a CVSS score is required, name the version and vector and justify each metric; never invent a precise score from a scanner label. Remediation priority can differ from severity because exposure, compensating controls, and deployment urgency differ.

| Priority | Supported by |
| --- | --- |
| Immediate containment | Ongoing exploitation or readily usable access to critical production authority or data |
| Urgent fix | Practical, substantial unauthorized access, state corruption, or loss of availability |
| Scheduled fix | A demonstrated boundary failure with a narrower consequence or stronger prerequisites |
| Hardening backlog | Reduced exposure with no demonstrated violation |

## Safe proof and regression

Use synthetic data, test actors, and minimal effects. Test provided code locally; a live target needs explicit authorization. Do not read real third-party records or extract credentials to demonstrate a flaw, and stop on unexpected sensitive exposure or unintended mutation.

For a requested fix, verify the attack shape is blocked and legitimate use still works. Cover alternate entry points, encoding variants, tenancy, replay, or concurrency only where they exercise the same mechanism. Prefer a test that fails on the old code and passes on the new; a documented manual check is acceptable when automation is impractical. State whether each check actually ran.

## Coverage statement

```text
Reviewed:    revision a1b2c3d; routes under src/routes, data layer, auth middleware
Evidence:    static traces; local two-tenant test (ran); no live environment access
Not covered: payment provider integration, infrastructure configuration, mobile client
Unresolved:  whether the CDN caches /api/invoices responses (check Cache-Control and Vary in staging)
```

No findings means no actionable issue was established within that scope; it does not mean every input or path is safe. Keep hardening notes separate, and do not pad a clean report with speculative vulnerabilities.
