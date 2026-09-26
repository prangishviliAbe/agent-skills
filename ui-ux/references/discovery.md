# Discovery: evidence, scope, and useful questions

Read when uncertainty could change a flow, architecture, or product decision. Skip a discovery workshop for a well-specified local fix.

## Start with available evidence

Inspect the request, existing product, supplied research, content, analytics definitions, and technical constraints. Extract what is already known before asking the user to repeat it.

| Decision input | Capture only what matters |
| --- | --- |
| User and context | Who acts, what they know, frequency, device/input, environmental constraints |
| Task and outcome | Trigger, intended result, how the user recognizes completion |
| Business and system | Required obligations, data availability, permissions, platform, delivery constraints |
| Evidence | Source, date, sample or context, and limits |
| Assumptions | Unverified belief, consequence if wrong, cheapest useful check |
| Scope | What the requested deliverable includes and what it does not change |

If the user requests a specific solution, understand its purpose without treating the request as invalid. Deliver it when workable. If a smaller alternative would materially help, explain the tradeoff; do not silently substitute it.

## Ask or proceed

Ask when the answer changes access permissions, business rules, costly architecture, irreversible behavior, or the core user task and cannot be inferred. Bundle the consequential unknowns. Continue independent work while awaiting an answer when the environment permits.

For reversible details, choose a reasonable default, state the assumption briefly, and proceed. Do not demand personas, brand workshops, or analytics before correcting an evident issue.

## Keep claims calibrated

| Input | What it supports | What it does not establish |
| --- | --- | --- |
| Observed usability session | The behavior and difficulty seen in that scenario | Prevalence across all users |
| Support tickets | Reported problems and their documented frequency | Problems nobody reported |
| Funnel/usage data | Instrumented behavior, sequence, and correlation | Motive or causality by itself |
| Interview | A participant's account and contextual needs | Guaranteed future behavior |
| Survey | Responses within its sampling and question limitations | Representative prevalence without a suitable sample |
| Competitor pattern | A possible convention or hypothesis | Proof that it works for this audience |
| Expert review | A reasoned usability/accessibility hypothesis | Research findings or measured conversion lift |

Avoid invented quotations and personas. A useful provisional user description is an assumption, not a research artifact.

## Select success signals

Choose a primary outcome appropriate to the task and guardrails against harm. Examples include completion, accurate recovery, time on a repeated task, preventable errors, and reduced support contacts. Fewer steps alone is not success if they hide decisions or remove necessary review.

Define denominators, time window, and baseline when actual measurement is available. Do not invent improvement percentages or imply causality from a before/after comparison without considering confounders. For a small design fix, a concrete acceptance criterion may be enough.

## Research when it changes a decision

- Write neutral tasks with a realistic starting point and outcome; avoid naming the control the participant should find.
- Observe before assisting. Record any assistance because it changes how completion should be interpreted; helping does not invalidate every later observation.
- Recruit for relevant user groups and accessibility needs. Determine coverage by task variety, population differences, and risk; no fixed small participant count guarantees discovery of most problems.
- Use interviews for context, observation for behavior, and analytics for patterns. Combine methods when one leaves a consequential question unanswered.
- Report observations, interpretations, proposed changes, and confidence separately. A severe single failure can warrant a fix even without a common pattern.

## Control scope without ignoring new evidence

Finish the authorized task. Record unrelated opportunities separately. If a newly discovered dependency is necessary to make the requested outcome work, explain it and address it within the existing authorization where possible.

A useful decision note is brief: **decision → reason/evidence → tradeoff → what would change it**. Keep it only for choices the next person needs to understand.