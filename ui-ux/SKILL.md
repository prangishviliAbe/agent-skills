---
name: ui-ux
description: >-
  Design, specify, and style world-class user interfaces with obsessive visual craft, modern design
  systems, and human-centered UX. Covers aesthetic perfectionism, surface elevation, glassmorphism,
  bento grids, design tokens (OKLCH), typography scale, micro-interactions, full state styling (hover,
  active, focus, loading, error, empty), WCAG 2.2 AA accessibility, responsive container queries, and
  AI interfaces. Use whenever designing screens, components, design tokens, dashboards, or flows,
  polishing rough prototypes into luxury products, or reviewing UI for beauty and usability.
---

# UI/UX & Visual Craft

Create interfaces that unite visual beauty, aesthetic perfectionism, and rigorous human-centered usability. Reject wireframe-style skeleton placeholders in favor of fully realized, high-density, beautifully styled experiences with intentional depth, tactile surfaces, and exquisite typography.

## Core Directives

1. **Aesthetic Craft Over Wireframe Skeletons:** Never deliver generic, unstyled wireframe boxes. Every component must have deliberate surface styling, lighting, borders, depth, typography, and optical alignment.
2. **Surface Depth & Optical Hierarchy:** Use multi-layered elevation. Ground dark interfaces in rich chromatic grays (`oklch`) with subtle 1px border highlights (`border-white/10`) and soft atmospheric ambient glow, not flat flat-black `#000` or raw gray `#111`.
3. **Corner Radius Math & Optical Alignment:** Always calculate nested radii correctly: `outer_radius = inner_radius + padding`. Align icons with text baselines optically, not purely by mathematical bounding boxes.
4. **State Completeness Is Non-Negotiable:** Every interactive element must define 7 discrete states: default, hover, active (tactile press), focus-visible, disabled (or interactive invalid), loading/optimistic, and error.
5. **Fluid Typography & Perceptual Color:** Build token systems with OKLCH for uniform perceptual lightness across hues. Implement fluid type scales with `clamp()` for flawless cross-device proportion without jarring breakpoint jumps.
6. **Accessible by Default:** Meet WCAG 2.2 AA without sacrificing visual beauty. Ensure 4.5:1 text contrast (3:1 for large text), 44x44px touch targets via invisible pseudo-element expansion, and two-tone offset focus rings.
7. **Bespoke Modern Patterns:** Build bento grids, command palettes (`Cmd+K`), floating blur docks, sliding segmented pills, and drawer sheets instead of cookie-cutter templates.
8. **Word Craft as Visual Structure:** Microcopy is visual design. Labels, placeholder hints, empty-state descriptions, and inline error guidance must be concise, active, and localization-ready (including Georgian Mkhedruli script).

## Workflow

```text
1. Architecture & Flow   ──► Map journey, inputs, decisions, error branches, and edge cases.
2. Token Foundation      ──► Define OKLCH palette, elevation surfaces, typography, radii, and grid.
3. Component Craft       ──► Style surfaces, specular borders, bento hierarchy, and optical balance.
4. 7-State Matrix        ──► Specify default, hover, press, focus-visible, loading, error, empty.
5. Responsive Dynamics   ──► Adapt via container queries (@container) and fluid clamp layouts.
6. Accessibility Audit   ──► Verify keyboard flow, screen-reader semantics, contrast, and hit zones.
```

## Quick Reference Map

| Area | What it covers | Reference file |
| --- | --- | --- |
| **Aesthetic Craft** | Depth, glassmorphism, lighting, ambient glow, corner math, luxury surfaces | [aesthetic-craft.md](references/aesthetic-craft.md) |
| **Design System** | OKLCH color palettes, fluid type scales (`clamp`), token taxonomy, elevation | [design-system.md](references/design-system.md) |
| **Component Patterns** | Bento grids, command palettes (`Cmd+K`), floating docks, drawers, segmented pills | [patterns.md](references/patterns.md) |
| **State Styling** | Hover micro-elevations, tactile press `scale(0.98)`, focus rings, empty & error states | [states.md](references/states.md) |
| **Accessibility** | WCAG 2.2 AA/AAA, two-tone focus rings, ARIA live announcements, 44px touch targets | [accessibility.md](references/accessibility.md) |
| **Responsive & Layout** | Container queries (`@container`), subgrid, fluid clamp typography, dynamic viewports | [responsive.md](references/responsive.md) |
| **Content & Microcopy** | Active verbs, error recovery guidance, empty-state narratives, Georgian typography | [content-design.md](references/content-design.md) |
| **AI Interfaces** | Token streaming, reasoning disclosure trays, tool-execution badges, inline rollbacks | [ai-interfaces.md](references/ai-interfaces.md) |

## Failure Modes & Countermeasures

| Failure | Correct Move |
| --- | --- |
| Empty skeleton wireframe with unstyled grey rectangles | Apply real surface tokens, specular border highlights (`rgba(255,255,255,0.08)`), subtle gradient backdrop, and realistic content. |
| Hard-disabled button (`disabled` attribute) with no tooltip | Keep action clickable and validate with inline assistance, or show prerequisite popover on interaction. |
| Nested containers having the same corner radius | Compute `border-radius: max(0px, parent_radius - padding)` to prevent awkward corner gaps. |
| Pure black `#000000` dark mode with harsh white text | Use rich deep indigo/slate darks (`oklch(0.14 0.02 260)`) and off-white text (`oklch(0.95 0.01 260)`) with layered elevation. |
| Generic "Something went wrong" alert toast | Position inline contextual recovery right at the fault source with preserved user inputs. |
| Generic card grid where all cards have equal weight | Structure as an asymmetrical bento grid with hero cards highlighting key metrics or primary actions. |
| Touch targets too small on mobile | Add `::after` with `min-width: 44px; min-height: 44px; position: absolute; inset: -8px` to preserve tight visual footprint. |

## Definition of Done

- [ ] Interface features deliberate aesthetic craft: high-end surfaces, specular borders, and optical alignment.
- [ ] Complete 7-state matrix specified for all interactive components.
- [ ] Tokens utilize perceptually uniform OKLCH color spaces and fluid `clamp()` typography scales.
- [ ] Responsive behavior verified using Container Queries (`@container`) and mobile thumb-friendly layouts.
- [ ] WCAG 2.2 AA accessibility met: 4.5:1 text contrast, two-tone focus rings, keyboard navigable, screen-reader labeled.
- [ ] Microcopy is clear, active, concise, and tested with real long text (including Georgian Mkhedruli script).

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
