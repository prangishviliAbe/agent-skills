---
name: ui-ux
description: >-
  Design, specify, build, review, and polish product interfaces: screens, components, forms,
  tables, dashboards, navigation, onboarding, settings, and whole user flows. Use for UI/UX
  work, "make this easier to use", "make it look better", visual polish, a redesign, a
  usability or accessibility review, a design system or tokens, responsive behavior, loading,
  empty, and error states, microcopy, or a developer handoff, even when the user only shares
  a screenshot. Works from the user's task to structure, states, and exact visual execution;
  holds spacing, type, alignment, and states to a perfectionist standard; keeps generic
  AI-looking patterns out; meets WCAG 2.2 AA; and verifies by rendering and operating the
  result, not by reading code.
---

# UI/UX

An interface is finished when a person can complete the task without thinking about the interface, and when nothing visible on screen was left to a default. Both conditions are required. Usable but careless is unfinished; beautiful but confusing is unfinished.

Work in this order, because each level makes the next one cheaper: **task → structure → states → system → execution → verification**. Most weak UI is polished at the bottom of that list while still broken at the top.

## Scope

| Request | Deliver | Do not |
| --- | --- | --- |
| New screen or flow | Task contract, structure, states, built or specified UI, verification | Start from a component library and look for a use |
| Improve or polish existing UI | The highest-level defect first, then execution detail | Restyle while the flow is still wrong, or redesign what works |
| Review or critique | Ranked findings: what, why it hurts the task, buildable fix, severity | Unranked lists of nitpicks or generic praise |
| Local fix | That fix, plus anything it visibly breaks | Rebrand or restructure neighbors |
| Handoff or spec | Dimensions as tokens, every state, copy, behavior, acceptance checks | Leave states and edge cases for the developer to invent |

Preserve the existing stack, design system, and approved brand. Extend a coherent system; do not start a parallel one. Do not invent research, metrics, or user quotes; label reasoning as Inferred.

## 1. Task contract

Write this before drawing anything. If a line cannot be filled, that is the first design problem.

```text
User and situation:  who, how often, on what device, under what pressure
Goal:                what they are trying to finish, in their words
Entry:               where they come from and what they already know
Inputs and choices:  what the system needs from them; what can be defaulted or removed
Outcome:             what success looks like and what happens next
Failure and return:  what can go wrong, how they recover, how they resume later
The thing not to miss: the exception, cost, or consequence that must be noticed
```

Then remove steps, fields, choices, and screens until the contract cannot be met with less. The best interface improvement is usually a deletion. See [flows.md](references/flows.md).

## 2. Structure

- One screen, one primary purpose. Name it; if it needs "and", consider two screens or a clear primary and secondary region.
- Choose the pattern from the task, not from habit: comparing means a table, one thing in depth means a detail page, a short interruption means a dialog. See [patterns.md](references/patterns.md).
- Order content by what the user needs first. The primary action is the most prominent control and there is one per view.
- Use conventional controls and placement. Novel navigation and custom input widgets cost every user time and usually lose accessibility.
- Put information where the decision happens: price beside the button, error beside the field, consequence inside the confirmation.

## 3. States

Every data region and action has more than a happy path. Before building, list which of these apply: default, hover, focus, pressed, selected, disabled, loading, empty, partial, error, success, unknown outcome, offline, no permission, too much content, too little content. Design the ones that apply and state which do not. See [states.md](references/states.md) and, for input, [forms.md](references/forms.md).

Rules that hold everywhere: state changes never shift layout; nothing essential depends on hover; the user's input is never lost; a failed action says how to recover; an action cannot be triggered twice by accident.

## 4. System

Decide tokens before components: type scale, spacing scale, color roles, radius, border, elevation, control heights, motion durations. Components consume tokens only. A raw value in a component is a defect or a missing token. See [design-system.md](references/design-system.md).

## 5. Execution standard

Hold every screen to this. Detail and method: [visual-craft.md](references/visual-craft.md).

| Area | Finished means |
| --- | --- |
| Hierarchy | One focal point per view; importance is obvious in a blurred screenshot; one primary action |
| Typography | Fixed scale, at most two families and three weights; body 16px or more on content pages (13 to 15px acceptable in dense tools); 45 to 75 characters per line; no orphaned words in headings; tabular figures in data |
| Spacing | Every value from the scale; gaps inside a group smaller than gaps between groups, at every level |
| Alignment | Few shared edges, all exact; icons optically centered on their labels; numbers end-aligned |
| Color | Neutrals carry the screen; one accent with one job; every color is a named role; meaning never by color alone |
| Surfaces | One radius family, one border weight, one elevation logic; a box only where it groups something |
| Controls | Shared height scale; visible labels; every applicable state designed; targets at least 24 by 24 CSS px, 44 for touch-first |
| Content | Real or realistic data including the longest cases; specific labels; no invented proof or filler |
| Responsive | Composed, not collapsed, from 320px upward; no page-level horizontal scroll; usable at 200% zoom |
| Motion | Only to explain a state change; 120 to 250ms; interruptible; reduced-motion path |

**Keep generated-looking patterns out.** Do not add, and remove from the scope being changed unless explicitly requested: gradient text; purple or blue-violet gradients and glows; glassmorphism; gradient borders and border beams; accent stripes on card edges; decorative dots and fake status lights; tinted icon bubbles; pill badges as decoration; blobs, grids, and grain behind content; the same large radius and shadow on every box; hover lift on non-interactive cards; fade-up on scroll for every block; emoji as icons; the four-KPI-card dashboard with invented numbers; stock phrases such as "unlock", "seamless", and "supercharge"; invented testimonials, logos, and metrics. Functional marks stay: labeled status, chart series, focus rings, selected states, progress, necessary rules and borders.

Do not swap one template for another. A direction (serif and cream, monospace and black borders, bento, dark with neon) is justified only by the product and audience, never by fashion.

## 6. Verification

Open the result in a browser and use it.

1. Render at narrow, middle, and wide sizes with real content and loaded fonts.
2. Complete the task end to end with the keyboard alone, then with pointer or touch.
3. Trigger every state that applies: loading, empty, error, long content, disabled, success.
4. Inspect whole-screen for hierarchy, then zoomed crops for alignment, spacing, wrapping, and crops.
5. Fix what is found in the source and inspect again. Stop when a full pass finds nothing above minor.

Method, severity levels, and report format: [visual-qa.md](references/visual-qa.md). Accessibility checks: [accessibility.md](references/accessibility.md).

A screenshot is evidence of one state at one size. It does not prove focus order, announcements, or behavior. If rendering or interaction is not possible, finish the source or spec fully and mark the visual and interaction checks **Not run**.

## Common failures

| Failure | Correct move |
| --- | --- |
| Polishing a screen whose flow is wrong | Fix the task and structure first; then style |
| Only the happy path designed | List applicable states before building; design empty, loading, error, long content |
| Every element given equal weight | Rank; make the primary action and the key data unmistakable; quiet the rest |
| "Premium" pursued with effects | Finish comes from type, spacing, alignment, and complete states |
| Clean look achieved by hiding things | Keep needed information and controls reachable; simplify hierarchy, not capability |
| Accessibility claimed from a contrast check | Report exactly what was tested; keyboard and screen reader are separate checks |
| Desktop layout squeezed onto a phone | Recompose for narrow width; reorder by priority |
| Handoff with one static mockup | Specify states, behavior, copy, tokens, and acceptance checks |

## References

| Need | Read |
| --- | --- |
| Flows, information architecture, navigation, onboarding | [flows.md](references/flows.md) |
| Choosing components and layouts by task; tables and dashboards | [patterns.md](references/patterns.md) |
| State coverage and recovery, async and destructive actions | [states.md](references/states.md) |
| Forms, validation, and input design | [forms.md](references/forms.md) |
| Visual execution: hierarchy, spacing, type, alignment, surfaces | [visual-craft.md](references/visual-craft.md) |
| Tokens, components, themes | [design-system.md](references/design-system.md) |
| Keyboard, semantics, contrast, targets, announcements | [accessibility.md](references/accessibility.md) |
| Reflow, breakpoints, touch, narrow and wide layouts | [responsive.md](references/responsive.md) |
| Labels, errors, empty states, Georgian and multilingual copy | [content-design.md](references/content-design.md) |
| Streaming, sources, approvals, and uncertainty in AI features | [ai-interfaces.md](references/ai-interfaces.md) |
| Render, operate, inspect, report | [visual-qa.md](references/visual-qa.md) |

## Completion evidence

Deliver the requested artifact with the task contract met, applicable states present, the execution standard held in the changed scope, and no generated-looking pattern added. Report briefly what was built, what was rendered and operated (sizes, states, input methods), and what remains open. Scale the report to the task: a one-line fix gets one line.

Use **Verified** for observed results, **Inferred** for reasoned conclusions, **Assumed** for missing context, and **Not run** for checks that did not happen. Never claim "pixel-perfect", "fully accessible", "user-tested", or "responsive" beyond the evidence collected.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
