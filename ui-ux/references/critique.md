# Critique with evidence and proportionate severity

Read for a design review, audit, or assessment of an existing experience.

## Establish what can be evaluated

| Artifact available | Can support | Cannot establish alone |
| --- | --- | --- |
| Screenshot | Visible hierarchy, wording, grouping, apparent layout issues | Semantics, keyboard operation, dynamic states, exact computed styling |
| Design file / prototype | Specified values, intended flows, component consistency | Production behavior, persistence, assistive-technology support |
| Source code | Implemented semantics and logic, candidate defects | Actual runtime behavior in every environment |
| Running interface | Observed task behavior in tested conditions | Untested environments or all-user outcomes |
| Research or analytics | Findings within the documented method and scope | Unsupported generalization or causality |

Name the review target and constraints. Do not invent a screenshot, DOM inspection, measured ratio, or user test you did not perform.

## Review against the task

1. Identify the user's task and the supplied brand/product constraints.
2. Inspect hierarchy and information needed to act. A quick first impression is a heuristic, not a measured usability study.
3. Walk the primary path and consequential failure/return paths where possible.
4. Inspect relevant states, accessibility, responsive behavior, and content.
5. Review system consistency and detail after higher-impact issues are understood.
6. Preserve successful decisions and rank the smallest useful corrections.

A blocker may invalidate downstream polish, but need not stop independent review of unaffected paths. Use judgment instead of a blanket "stop at first blocker" rule.

## Severity and confidence

| Severity | Meaning |
| --- | --- |
| Blocker | An important task cannot complete, or a serious loss/exclusion is demonstrated |
| High | Substantial harm or repeated failure is likely on an important path |
| Medium | Recoverable friction, confusion, or avoidable effort with meaningful impact |
| Polish | Refinement with limited task impact |
| Preference | An optional alternative serving a comparable outcome, not a defect |

Assign severity from impact, reach, frequency, and recoverability, not appearance or a fixed metric alone. An accessibility failure should identify the relevant criterion and affected use; do not label every contrast failure a total task blocker.

Record confidence separately: observed, strongly inferred from evidence, or hypothesis requiring validation. Do not predict drop-off percentages or specific behavior without support.

## Actionable finding

Use this structure when a full finding is useful:

```text
Issue:    Removing a filter is inaccessible by keyboard
Where:    Search results, active-filter controls
Evidence: In the tested page, Tab skips the remove controls; Enter cannot activate them
Impact:   Keyboard users cannot remove individual filters
Fix:      Use accessible buttons with descriptive names and visible focus
Verify:   Tab to each remove control, activate it, confirm results update and focus remains useful
Confidence: Observed in the stated environment
```

For a screenshot, say "Keyboard removal is unverified; inspect the control's semantics and focus behavior" rather than claiming the example above occurred.

## Avoid false findings

| Temptation | Better assessment |
| --- | --- |
| "The 32px control fails AA" | Evaluate 24px target minimum and exceptions; describe 44px as a larger-target recommendation or AAA criterion |
| "Users will abandon this" | State the observed friction and propose a way to measure abandonment |
| "Validation on submit is bad" | Assess whether timing gives useful correction without premature errors |
| "The CTA is below the fold" | Check whether necessary context precedes it and the action remains discoverable |
| "Three radii are inconsistent" | Identify conflicting use of the same role, if present |
| "Feels dated" | Name a concrete readability, hierarchy, interaction, or brand-fit issue |

Conclude with prioritized corrections, what should be preserved, and the material unknowns. A short review may need only a few findings; do not fill an arbitrary quota.