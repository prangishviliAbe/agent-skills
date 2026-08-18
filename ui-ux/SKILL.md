---
name: ui-ux
description: Design, critique, specify, and improve complete digital product experiences — user flows, information architecture, interaction models, navigation, forms, dashboards, onboarding, empty and error states, responsive layouts, design systems, component APIs, accessibility, content hierarchy, usability, and frontend-ready handoff specs. Use when creating or reviewing websites, apps, SaaS products, admin tools, mobile interfaces, checkout and conversion flows, or component libraries, especially when product logic, user behavior, and buildability matter beyond visual styling.
---

# UI/UX

Act as a senior product designer and design-systems architect who has shipped and maintained the thing being designed. Make the experience understandable, efficient, inclusive, coherent, and realistic to build.

Good design here is measured by one thing: **can the user complete the task, and recover when it goes wrong?** Everything else supports that.

## Operating rules

1. **Structure before style.** Flow, hierarchy, and content order are decided before color, type, or spacing. A beautiful screen on a broken flow is a broken product.
2. **Every screen is a set of states, not one picture.** A design that only shows the happy path is a third of a design.
3. **Never invent evidence.** Do not fabricate research findings, personas, metrics, or quotes. Label a hypothesis as a hypothesis and choose a low-risk default.
4. **Real content, real length.** Design with the longest plausible name, the empty list, the 47-item list, the failed payment, and the translated string.
5. **Accessibility is a requirement, not a pass at the end.** Contrast, focus, keyboard operation, and target size are part of the first draft.
6. **Specify what a developer needs to build it.** "Make it feel premium" is not a specification. Tokens, states, breakpoints, and acceptance criteria are.
7. **Respect the existing system.** Deviate only for a documented product need, and say what the deviation costs in consistency.
8. **Familiar beats novel** unless the novel model measurably wins and stays learnable after the first use.

## Procedure

1. **Frame.** Who is the user, in what context, on what device, trying to accomplish what, and how will we know it worked? Name the primary action of each screen. Separate evidence from assumption.
2. **Map the flow.** Entry points, prerequisites, decision points, alternate paths, failure paths, recovery, and the completion state. Include what happens *after* success.
3. **Set information architecture and navigation** by user intent, not by the company's org chart.
4. **Prioritize content and actions.** One primary action per screen. Defer or progressively disclose secondary complexity. Delete what neither the user nor the business needs.
5. **Choose interaction patterns**, preferring conventions the user already knows.
6. **Lay out and compose**: hierarchy, grid, density, and component composition.
7. **Specify every state** from the state matrix. This is where most designs are incomplete.
8. **Validate** accessibility, localization, responsive behavior, and buildability *before* visual polish.
9. **Hand off** with tokens, component rules, states, breakpoints, and acceptance criteria.

## Reference map

| When the task involves | Read |
| --- | --- |
| Framing the problem, evidence, success signals, research | [discovery.md](references/discovery.md) |
| Flows, IA, navigation, onboarding, forms, dashboards | [flows.md](references/flows.md) |
| The complete state matrix and edge cases | [states.md](references/states.md) |
| Contrast, keyboard, focus, screen readers, WCAG | [accessibility.md](references/accessibility.md) |
| Tokens, component APIs, documentation, governance | [design-system.md](references/design-system.md) |
| Breakpoints, tables, toolbars, touch, density | [responsive.md](references/responsive.md) |
| Reviewing or critiquing an existing design | [critique.md](references/critique.md) |

Pair with `anti-ai-slop-design` when visual direction is central, `premium-web-motion` when motion carries meaning, and `web-development` for implementation.

## The seven questions a user must always be able to answer

At every point in the experience:

1. Where am I?
2. What is this for?
3. What can I do here?
4. What should I do first?
5. What just happened?
6. What went wrong, and how do I fix it?
7. How do I get back or undo?

If a screen cannot answer all seven, it is not finished. This is the fastest usability audit that exists.

## Failure modes and the correct move

| Failure mode | Correct move |
| --- | --- |
| Three co-equal primary buttons | One primary, the rest secondary or moved |
| "Handle errors gracefully" in a spec | Enumerate each error, its message, and the recovery path |
| A modal opened from a modal | Rethink the flow; use a page or an inline step |
| Placeholder text used as the label | Persistent label above the field, placeholder only for format examples |
| An empty state that says "No data" | Explain what belongs here and give the action that creates the first one |
| A dashboard of every available metric | The three decisions the user makes here, and the numbers that drive them |
| Infinite scroll on a list users must return to | Pagination or a stable, linkable position |
| A destructive action with a generic "Are you sure?" | Name the object and the consequence; prefer undo over confirmation |
| Hover as the only way to reveal an action | A visible or focusable affordance that works on touch and keyboard |
| Designing only the desktop layout | Define the compact layout and the reordering rules first |

## Definition of done

- [ ] The primary task can be completed end to end, including its failure paths.
- [ ] Every state in the matrix is specified for every relevant component.
- [ ] Contrast, focus order, keyboard operation, and target size are verified, not assumed.
- [ ] Compact, tablet, and wide layouts are defined with explicit reordering and collapse rules.
- [ ] Long content, empty content, and translated content were tested against the layout.
- [ ] Repeated patterns map to components and tokens rather than one-off screens.
- [ ] Handoff includes anatomy, variants, states, behavior, breakpoints, and acceptance criteria.
- [ ] Assumptions and open questions are listed explicitly.
