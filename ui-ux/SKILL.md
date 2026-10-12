---
name: ui-ux
description: >-
  Design and meticulously style screens, components, dashboards, forms, and product flows.
  Use for UI/UX, "make it look better", visual refinement, perfectionist polish, typography,
  spacing, responsive layouts, design tokens, interaction states, accessibility, or developer
  handoff. Emphasize composition, optical alignment, content fit, and render-inspect-refine
  verification; avoid decorative colored dots, card accent lines, and generic AI styling.
---

# UI/UX and Visual Perfectionism

Treat styling as substantive work. Deliver deliberate composition, precise typography, coherent surfaces, complete applicable interactions, and careful responsive behavior. A screen that compiles but still looks unfinished is unfinished.

## Scope and visual direction

Inspect the artifact, primary task, real content, brand constraints, component library, fonts, and assets. Preserve approved choices and the existing stack. For a new screen, choose a direction from the product and audience; for a small fix, improve the local relationship. Honor an explicitly requested wireframe or specification without pretending it is a finished UI.

**Do not add decorative colored dots, faux status LEDs, card accent rails, top or side stripes, ornamental divider lines, border beams, gradient outlines, icon bubbles, glow blobs, or unrelated background patterns.** Remove them in the area being refined unless that exact motif is explicitly required. Preserve functional borders, separators, selected states, focus rings, labeled statuses, and data graphics. Generic "premium" styling is not permission to add ornament.

Do not prescribe glassmorphism, bento grids, serif pairings, dark mode, asymmetry, or OKLCH as universal requirements. Use the existing design language when it is coherent; improve its execution.

## Craft priorities

| Area | What to perfect |
| --- | --- |
| Composition | Primary task is obvious; section widths and density follow the content; each region has a clear role. |
| Typography | Actual font coverage and weights; headline measure and wrapping; readable body size; clear label/value hierarchy; stable numeral alignment. |
| Spacing | Related items read as a group; larger separations mark meaningful transitions; consistent insets and deliberate optical corrections. |
| Alignment | Text baselines, icon ink bounds, button labels, field edges, table columns, and adjacent media align perceptually. |
| Surfaces | Controlled contrast and restrained containment; consistent radii and borders; shadows explain elevation rather than decorate every box. |
| Color | Semantic roles and primary action are clear; neutral surfaces remain calm; color does not carry meaning alone. |
| Assets | Authentic product content; intentional crop, aspect ratio, focal point, and sharpness; no fake proof or filler imagery. |
| Interaction | Applicable hover, press, focus, selected, disabled, pending, success, error, empty, and unknown states preserve layout and meaning. |
| Responsive fit | Content-driven breakpoints; readable narrow layouts; long labels and localization; zoom and on-screen keyboard do not hide the task. |

Polish the largest hierarchy or proportion defect before tuning small shadows. Do not apply equal visual weight to primary, supporting, and incidental information.

## Working method

1. **Define the task contract.** Identify the action, inputs, decisions, outcome, and relevant failure or return paths. Do not invent user research.
2. **Style with real content.** Reuse tokens and patterns; tune type, width, rhythm, controls, imagery, and information priority together. Avoid a collection of individually decorated components.
3. **Specify applicable states.** Read [states.md](references/states.md). A button does not need an "empty" state; a destructive transaction may need an unknown-outcome state. Do not invent seven states for every element.
4. **Implement or hand off concretely.** For implementation, edit the actual source and reuse the established system. For a specification, provide dimensions or tokens, behaviors, content, and acceptance checks a developer can use.
5. **Render and inspect.** For implementation, use the available preview/browser tooling to inspect the whole screen and detail crops at representative narrow, intermediate, and wide widths. Exercise affected controls and states. Use [visual-qa.md](references/visual-qa.md).
6. **Refine and recheck.** Correct hierarchy, wrapping, alignment, inconsistent spacing, awkward crops, clipping, and state jumps. Inspect again after material corrections. Stop when the changed scope has no unresolved blockers or major craft defects; avoid unrelated scope expansion.
7. **Check accessibility proportionally.** Inspect semantics and test relevant keyboard/focus behavior where possible. Report untested behavior honestly. Contrast values alone do not establish WCAG conformance.

A screenshot supports visible design findings. It cannot prove focus order, announcements, hidden states, or responsive behavior. If rendering tools are unavailable, make the source/specification as complete as possible and mark visual QA **Not run**.

## Routed references

| Need | Read |
| --- | --- |
| Detailed styling and optical corrections | [aesthetic-craft.md](references/aesthetic-craft.md) |
| Tokens, type, radii, and themes | [design-system.md](references/design-system.md) |
| Choosing components by task | [patterns.md](references/patterns.md) |
| State and recovery contracts | [states.md](references/states.md) |
| Keyboard, semantics, contrast, and targets | [accessibility.md](references/accessibility.md) |
| Reflow, container fit, and viewport behavior | [responsive.md](references/responsive.md) |
| Microcopy and multilingual content | [content-design.md](references/content-design.md) |
| Streaming, sources, draft actions, and uncertainty | [ai-interfaces.md](references/ai-interfaces.md) |
| Visual review and completion gates | [visual-qa.md](references/visual-qa.md) |

## Completion evidence

Deliver the requested artifact with consistent styling, truthful content, usable applicable states, and corrections supported by inspection. Record representative viewport/state checks and material limits, without a ceremonial report for a tiny edit.

Use **Verified**, **Inferred**, **Assumed**, and **Not run** precisely. Never claim "pixel-perfect", accessibility compliance, user validation, or responsive verification beyond the evidence collected.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
