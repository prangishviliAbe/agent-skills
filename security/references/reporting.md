# Findings, confidence, and verification

Read when producing an audit result or remediation plan. Write for someone deciding what to fix and how to verify it, not for a vulnerability count.

## Classify the evidence

| Status | Meaning | Report action |
| --- | --- | --- |
| Demonstrated | A safe test or complete code/config trace establishes the policy violation under stated conditions | Report a finding and identify which evidence is runtime versus static |
| Supported hypothesis | A plausible path has a material missing condition, deployment detail or control | State the gap and smallest confirming/disproving check |
| Hardening | Improvement without an established policy violation or attack path | Separate from vulnerabilities and explain expected benefit/cost |
| Disproved or out of scope | Effective control, unreachable configuration, or unrelated surface | Do not retain as an active finding; note only if it resolves the user's concern |

A code review can establish a defect without executing an exploit. Conversely, inability to access the deployment cannot prove the deployment is safe. Keep uncertainty visible in both directions.

## Finding format

Use only fields needed to make the claim reviewable:

- **Title and priority:** name the violated behavior and affected surface.
- **Location and revision:** precise path/line, route or configuration; include related callers where they share the cause.
- **Actor and prerequisites:** initial privilege, input/control, deployment conditions and required interaction.
- **Evidence and path:** observed or traced steps, effective controls considered, and why the invariant fails.
- **Impact:** data, operations, tenants or availability affected; distinguish proven extent from potential amplification.
- **Confidence:** certainty in the path and the material missing evidence, separate from impact.
- **Correction and verification:** smallest complete fix, legitimate behavior to preserve and meaningful regression check.

For a single simple finding, paragraphs can convey this more clearly than a large template. Group repeated symptoms by root cause while retaining actionable locations. Do not paste live credentials, personal records or unnecessary exploit output.

## Severity and priority

Use the project's severity system when one exists. Otherwise explain the qualitative judgment using reachability, required privileges/interaction, scope and consequence. Class names do not dictate severity: stored XSS, SSRF, exposed keys and auth bypasses vary by actual capability and context.

| Priority direction | Evidence that supports it |
| --- | --- |
| Immediate containment | Ongoing exploitation or readily usable access to critical production authority/data |
| Urgent correction | Practical substantial unauthorized access, state corruption or availability loss |
| Scheduled correction | A demonstrated boundary failure with narrower consequence or stronger prerequisites |
| Hardening/backlog | Reduced exposure without a demonstrated violation |

When CVSS is required, identify the version and vector and justify its metrics. Do not manufacture a precise score from a scanner label. Remediation priority may differ from severity because exposure, compensating controls and deployment urgency differ.

## Safe proof and regression

Use synthetic data, test actors and minimal effects. A provided local application can be tested in isolation; a live target must be within the authorized scope. Avoid reading real third-party records or extracting credentials to demonstrate a flaw. Stop on unexpected sensitive exposure or unintended mutation.

For a requested fix, verify both the rejected attack shape and legitimate use. Add alternate entry points, encoding variants, tenancy, replay or concurrency only where they exercise the same failure mechanism. Prefer a test that can demonstrate old-versus-new behavior safely; a documented manual check is valid when automation is impractical. State whether it actually ran.

## Coverage statement

Include the reviewed revision/components, mode of assessment, tests run, material excluded surfaces and deployment assumptions. Example structure, not a result to copy:

```
Reviewed: <revision and affected components>
Evidence: <static traces, local tests, or authorized environment checks actually performed>
Not covered: <material boundaries outside this assessment>
Unresolved: <missing control/configuration facts and the check that would resolve them>
```

A no-findings outcome means no actionable issue was established within that scope. It does not mean every input or system path is safe. Keep hardening notes separate and avoid filling a clean report with speculative vulnerabilities.
