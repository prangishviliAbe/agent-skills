---
name: ui-ux
description: >-
  Design, specify, review, and improve product UX: user flows, information architecture, forms,
  dashboards, tables, onboarding, navigation, loading, empty, error, and destructive-action states,
  microcopy, responsive behavior, accessibility (WCAG 2.2 AA), design systems, and UX for AI
  features. Use whenever the user wants a screen or flow designed or critiqued, a developer
  handoff or acceptance criteria, a usability or accessibility review, a redesign, "make this
  easier to use", or wording for buttons, errors, and empty states, even if they only share a
  screenshot. Delivers concrete, buildable decisions (states, focus, copy, edge cases,
  verification) scaled to the task, and labels what was inferred rather than tested.
---

# Product UI/UX

Make the experience understandable, usable, inclusive, and realistic to build. Judge it by whether people can finish their task, understand the outcome, and recover from mistakes. Scale the method to the assignment.

## How to work

1. **Anchor on the task and the existing product.** Preserve working behavior, brand, platform conventions, and authorized scope. A request to fix one form is not permission to redesign the application.
2. **Separate evidence from inference.** Never invent users, research, metrics, capabilities, or observed behavior. Label assumptions and say which one would change the decision.
3. **Design transitions, not only screens.** For any consequential interaction state the trigger, the pending state, the result, the failure, the recovery, what happens to entered data, and where focus goes.
4. **Make the main path obvious.** Prioritize within each decision region; a workspace with independent tasks does not need one primary button. Hiding a needed choice to look simple only moves the confusion.
5. **Use familiar patterns unless novelty earns its place.** Choose controls and containers with the decision tables in [patterns.md](references/patterns.md); put distinctiveness in composition and content, not in how a checkbox works.
6. **Write the words as part of the design.** Labels, errors, empty states, and confirmations carry much of the usability. Use [content-design.md](references/content-design.md).
7. **Treat accessibility as a design input.** Use the project's target, or WCAG 2.2 AA for web. Keep requirements, recommendations, and checks that need a running interface apart ([accessibility.md](references/accessibility.md)).
8. **Test the design against real content.** Long names, zero, one, and many items, slow networks, translations (including Georgian), and users with different abilities and input methods.
9. **Say what was verified.** A static frame cannot establish keyboard operation, screen-reader behavior, persistence, or conformance. Mark untested behavior as untested.

## Pick the deliverable

| Request | Useful result |
| --- | --- |
| Focused UX fix | The corrected artifact, affected states, short rationale, relevant verification |
| Review of a screenshot | Prioritized visible findings; behavior and measurement limits stated |
| Review of a running flow | Reproducible findings with location, user impact, fix, and retest criteria |
| New flow or prototype | Entry and return paths, decision logic, representative content, transitions, assumptions |
| Developer handoff | State and behavior contract, component reuse, responsive rules, semantics, acceptance criteria |
| Component or system work | Variants and tokens, usage rules, compatibility and migration notes |
| Copy | Final strings with context, plus rules that explain the choices |
| AI feature | Expectations, streaming and error states, source display, approval and undo ([ai-interfaces.md](references/ai-interfaces.md)) |

An acceptance criterion names the condition, the action, and the observable outcome: "When saving fails, the form keeps the entered values, announces the failure, and allows a retry without creating a duplicate record." Check the server can actually guarantee that before promising it.

## Procedure

1. **Inspect first.** Read the existing screens, components, content, and constraints. Choose the mode: review, fix, new flow, prototype, implementation, or handoff.
2. **Frame only the consequential unknowns:** task, context, success condition, platform, constraints. Ask when the answer changes cost, permissions, or irreversible behavior; otherwise state a reversible assumption and go on ([discovery.md](references/discovery.md)).
3. **Map the journey:** entry, prerequisites, decisions, completion, errors, exit, return ([flows.md](references/flows.md)).
4. **Set hierarchy and interaction rules,** grouped by user intent, using consistent terms and the product's navigation.
5. **Specify the relevant states** from [states.md](references/states.md). Mark irrelevant states unnecessary rather than inventing screens.
6. **Resolve layout and accessibility together** at the widths where content breaks ([responsive.md](references/responsive.md)).
7. **Walk the important paths:** the primary task and the failure most likely to lose work, money, or access. Rank issues with [critique.md](references/critique.md).
8. **Deliver the artifact and its contract,** with enough detail to build without guessing and no design-system essay for a small fix.

## Reference map

| When the task involves | Read |
| --- | --- |
| Discovery, evidence, research planning, success signals | [discovery.md](references/discovery.md) |
| Journeys, navigation, onboarding, forms, search, tables, dashboards | [flows.md](references/flows.md) |
| Choosing a control, container, or feedback pattern | [patterns.md](references/patterns.md) |
| Loading, errors, validation timing, destructive actions, uncertain outcomes | [states.md](references/states.md) |
| Labels, errors, empty states, confirmations, tone, localization-ready strings | [content-design.md](references/content-design.md) |
| WCAG 2.2, keyboard, focus, semantics, forms, verification | [accessibility.md](references/accessibility.md) |
| Breakpoints, tables on small screens, zoom, input methods, localization | [responsive.md](references/responsive.md) |
| Tokens, component contracts, migration | [design-system.md](references/design-system.md) |
| Heuristic review, severity, finding format | [critique.md](references/critique.md) |
| Chat, generation, agents, citations, approval and undo | [ai-interfaces.md](references/ai-interfaces.md) |

## Failure modes

| Failure | Correct move |
| --- | --- |
| Broad redesign for a narrow defect | Fix the affected flow; list optional improvements separately |
| All buttons made secondary to enforce one primary action | Prioritize within each task or decision region |
| "Handle errors gracefully" | Specify the failure, preserved data, message, recovery, and focus |
| Disabled action with no explanation | Explain the prerequisite, or keep it enabled and validate on use |
| Every empty state says "Create your first..." | Separate first use, no results, no access, and a correctly empty list |
| Placeholder text used as the label | A persistent label; the placeholder only shows an example |
| Generic "Are you sure?" confirmation | Name the action, the object, and the consequence; label buttons with the verbs |
| Toast used for an error that needs action | Inline or persistent feedback next to the cause |
| Important content hidden to fit a phone | Reflow, disclose, or scroll inside a container without losing the task |
| A screenshot review that infers behavior | Mark the behavior unverified and name the smallest check |
| Happy path only for a transaction | Design pending, confirmed, failed, and unknown outcomes separately |
| AI output presented as certain, with no source or undo | Show provenance, make edits and reversal easy, gate consequential actions |

## Definition of done

- [ ] The requested artifact or correction is delivered and preserves relevant existing behavior.
- [ ] The primary task and the consequential failure and return paths are specified or exercised.
- [ ] Relevant states explain data preservation, feedback, recovery, and focus.
- [ ] Copy is final or clearly marked as draft, and works with realistic content.
- [ ] Applicable accessibility, responsive, and localization checks are recorded with their actual results.
- [ ] Decisions are concrete enough for the next person to act on.
- [ ] Assumptions, dependencies, and testing limits are explicit; none are presented as verified.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
