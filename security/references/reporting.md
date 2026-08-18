# Writing findings

Read when producing an audit result, a single finding, or a remediation plan.

## Finding template

```
[SEVERITY] Title that names the flaw and the location
Confidence: Confirmed | High | Medium | Low
Location:   path/to/file.ts:120  (and every other call site)
Class:      Broken access control / Injection / Exposure / Logic / Configuration

Path
  Entry:   POST /api/orders/:id  (any authenticated user)
  Flow:    req.params.id -> getOrder(id) -> render, with no ownership check
  Sink:    the full order record, including customer address and totals

Preconditions
  A valid session of any role. Order IDs are sequential.

Impact
  Any logged-in user can read every order in the system, including personal data.

Evidence
  <minimal redacted trace or code excerpt that shows the missing control>

Remediation
  <concrete code, at the root cause>

Verification
  <the test or check that proves the fix, and that fails without it>

Residual risk
  <what remains, what was not tested, what depends on deployment config>
```

Order the report by severity, not by file. The first finding is the one that would appear in the incident report.

## Severity

Judge impact against realistic exploitability. State them separately when they diverge.

| Severity | Meaning |
| --- | --- |
| Critical | Unauthenticated remote code execution, full database read/write, authentication bypass, or mass personal-data exposure |
| High | Privilege escalation, cross-tenant access, stored XSS in a privileged context, exposure of a live production secret, financial manipulation |
| Medium | Authenticated injection with limited scope, CSRF on a meaningful action, SSRF without a proven internal reach, sensitive data in logs |
| Low | Information disclosure with limited value, missing hardening header, rate-limit gap on a non-sensitive endpoint |
| Informational | Defense-in-depth improvement with no demonstrated attack path |

Adjust up when the flaw is unauthenticated, silent, scalable, persistent, or touches money, credentials, or personal data. Adjust down when it requires an already-compromised administrator, an unreachable configuration, or an unrealistic user action.

**Confidence is a separate axis.** "High severity, low confidence" is a legitimate and useful finding, as long as you say what would confirm it.

## Proof of concept ethics

- Non-destructive by default: read, do not write; one record, not the table; your own test account, not a real user's.
- Never include a working exploit against a live third-party system.
- Redact tokens, keys, personal data, and internal hostnames. A trace showing *that* the control is missing is sufficient; a payload that hands someone the keys is not necessary.
- Get written authorization before any active testing against systems you do not own. "The user asked me to" is not authorization for a third party's infrastructure.

## Remediation guidance

Every fix answers three questions:

1. **What is the root cause?** Not "the endpoint lacked validation" but "validation lives in the controller instead of the data layer, so every other caller is unprotected."
2. **What is the smallest complete fix?** Complete means it covers every path to the same sink.
3. **How is it verified?** A test that fails on the vulnerable version, or a documented manual check with the exact request and expected response.

Rank remediation by risk reduction per unit of effort, and say which fixes are quick wins versus structural work. Give the user a sequence they can actually execute this week, not a list of thirty equal-weight items.

## Scope statement

End every audit with what you did **not** cover. Without it, silence reads as safety.

```
Reviewed:      the API layer (routes, auth middleware, data access) at commit <sha>
Not reviewed:  frontend bundle, infrastructure config, third-party integrations,
               the admin panel, background jobs
Not tested:    no active exploitation; findings are from code trace only
Depends on:    deployment configuration for headers and TLS, not visible in this repo
```

## Reporting anti-patterns

| Anti-pattern | Why it hurts | Instead |
| --- | --- | --- |
| Thirty low-severity findings ahead of the real one | The important one gets skipped | Rank ruthlessly; group hardening notes at the end |
| "Potential SQL injection" on a prepared query | Destroys trust in every other finding | Trace it and drop it |
| Severity inflated to force attention | The next report is discounted | Argue impact honestly |
| A fix that only patches the reported endpoint | Leaves the other callers exploitable | Fix the shared sink |
| A clean report with no scope statement | Reads as "the system is secure" | Always state coverage |
| Copying a scanner's output verbatim | No reachability analysis, no value added | Verify each item against the code |
