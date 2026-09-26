---
name: ui-ux
description: Design or improve product usability, user flows, navigation, forms, dashboards, interaction states, responsive behavior, accessibility, and component systems. Use for UX reviews, interface specifications, prototypes, product redesigns, and frontend-ready handoffs where task completion and recovery matter; a purely cosmetic edit does not require a full UX process.
---

# Product UI/UX

Make the requested experience understandable, usable, inclusive, and realistic to build. Judge the result by whether people can complete their task, understand its outcome, and recover from mistakes. Scale the method to the assignment.

## Operating rules

1. **Honor the brief and existing product.** Preserve working behavior, brand, platform conventions, and authorized scope. A request to fix one form is not permission to redesign the application.
2. **Separate evidence from inference.** Never invent users, research, metrics, technical capabilities, or observed behavior. Label assumptions and identify which would change the decision.
3. **Design transitions as well as screens.** For consequential interactions, state the trigger, pending behavior, result, recovery, and what happens to entered data and focus.
4. **Match effort to consequence.** A label change needs a context check; a payment flow needs failure and return paths. Do not apply every reference or every possible state to every task.
5. **Use familiar patterns when they fit.** Novel presentation can serve the brand; unfamiliar controls must still be understandable and operable. Do not force one primary button onto a workspace with independent tasks.
6. **Build accessibility into decisions.** Use the project's target; for web work without one, use WCAG 2.2 AA as a design baseline. Distinguish requirements, advisory practices, and checks that require a running interface.
7. **Use realistic, honest content.** Include representative content and relevant extremes. Mark sample data, draft copy, and unverified claims visibly; do not convert them into purported evidence.
8. **Report what was verified.** A static frame cannot establish keyboard behavior, screen-reader support, persistence, or conformance. Record untested behavior without declaring it passed.

## Procedure

1. **Choose the mode and inspect the artifact.** Identify whether the user needs a review, focused fix, new flow, prototype, implementation, or handoff. Read the relevant existing screens, components, content, and constraints first.
2. **Frame only the consequential unknowns.** Identify the user task, context, success condition, platform, and constraints from available evidence. Ask when a missing answer changes a costly or irreversible choice; otherwise state a reversible assumption and proceed. Use [discovery.md](references/discovery.md) for substantial uncertainty.
3. **Map the affected journey.** Cover entry, prerequisites, decisions, completion, errors, exit, and return. Choose a list, diagram, or prototype that makes branching understandable. Use [flows.md](references/flows.md).
4. **Set hierarchy and interaction rules.** Group information by user intent; distinguish competing actions without hiding necessary choices. Keep terminology and navigation consistent with the product. Preserve existing components unless they fail the task.
5. **Specify relevant transitions and states.** Select the applicable rows in [states.md](references/states.md). State persistence, retry safety, permissions, and partial outcomes where they matter; mark irrelevant states as unnecessary rather than manufacturing screens.
6. **Resolve layout and accessibility together.** Test the content at widths where it breaks, relevant input modes, and supported locales. Use [responsive.md](references/responsive.md) and [accessibility.md](references/accessibility.md). For a mockup, annotate implementation requirements instead of claiming runtime verification.
7. **Validate the important paths.** Walk through the primary task and the failure most likely to lose work, money, or access. On a running interface, inspect the real behavior. Use [critique.md](references/critique.md) to rank issues and distinguish observations from hypotheses.
8. **Deliver the requested artifact and its contract.** Explain the meaningful decisions, tested behavior, limitations, and next required action. Give enough detail to implement without guessing, but omit a full design-system specification for a small fix.

## Deliverable selection

| Requested work | Useful result |
| --- | --- |
| Focused UX correction | Corrected artifact, affected states, concise rationale, relevant verification |
| Review of screenshots | Prioritized visual/content findings; behavior and measurement limits explicitly stated |
| Review of a running flow | Reproducible findings with location, user impact, correction, and retest criteria |
| New flow or prototype | Entry and return paths, decision logic, representative content, transitions, assumptions |
| Developer handoff | State/behavior contract, component reuse, responsive rules, accessibility semantics, acceptance criteria |
| Component-system work | Changes to supported variants/tokens, usage decisions, compatibility and migration notes |

An acceptance criterion should name the condition, action, and observable outcome. Example: "When saving fails, the form retains entered values, announces the failure, and allows a retry without creating a duplicate record." Verify the server capability before promising that guarantee.

## Reference map

Read only the resources needed for the current decision.

| When the task involves | Read |
| --- | --- |
| Discovery, evidence, research, scope, success signals | [discovery.md](references/discovery.md) |
| Flows, IA, navigation, onboarding, forms, data work | [flows.md](references/flows.md) |
| Async behavior, failure recovery, validation, destructive actions | [states.md](references/states.md) |
| WCAG, keyboard, focus, names, authentication, verification | [accessibility.md](references/accessibility.md) |
| Tokens, component contracts, system changes and migration | [design-system.md](references/design-system.md) |
| Responsive layouts, tables, zoom, input methods, localization | [responsive.md](references/responsive.md) |
| Evidence-based review and severity | [critique.md](references/critique.md) |

## Failure modes

| Failure | Correct move |
| --- | --- |
| Broad redesign in response to a narrow defect | Fix the affected flow; separate optional improvements |
| All buttons made secondary to enforce one primary action | Prioritize within each task or decision region |
| "Handle errors gracefully" | Specify the failure, preserved data, message, recovery, and focus behavior |
| Disabled action with no explanation | Explain the prerequisite or expose an actionable alternative |
| Every empty state asks users to create data | Distinguish first use, no matches, no access, and a correctly empty result |
| Important content hidden to fit a phone | Choose reflow, disclosure, or contained scrolling that preserves the task |
| Review infers behavior from a screenshot | Mark the behavior unverified and give the smallest useful check |
| Attractive happy path with uncertain transaction outcome | Design pending, confirmed, failed, and unknown outcomes separately |

## Definition of done

For the agreed scope, mark each item complete or explain why it is not applicable or remains unverified.

- [ ] The requested artifact or correction is delivered and preserves relevant existing behavior.
- [ ] The primary task and consequential failure/return paths are specified or exercised.
- [ ] Relevant states explain data preservation, feedback, recovery, and focus.
- [ ] Content hierarchy and actions remain understandable with representative real content.
- [ ] Applicable accessibility, responsive, and localization checks are recorded with their actual results.
- [ ] Handoff or implementation decisions are concrete enough for the next person to act.
- [ ] Assumptions, unresolved dependencies, and testing limits are explicit; none are presented as verified facts.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)