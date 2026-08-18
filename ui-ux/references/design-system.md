# Design systems: tokens, components, governance

Read when creating, extending, documenting, or auditing a component library or token set.

## Token layers

Three layers, in this order. Skipping the middle layer is why systems cannot be rethemed.

```
1. Primitive   raw values, no meaning        blue-600: #2563eb   space-4: 16px
2. Semantic    role in the interface         color-action, color-danger, color-text-muted, space-section
3. Component   scoped to one component       button-padding-x, card-radius   (only when genuinely needed)
```

Design and code both reference the **semantic** layer. A component that hardcodes `blue-600` cannot support dark mode, a second brand, or a rebrand.

**Semantic color roles worth defining once:** canvas, surface, surface-raised, border-subtle, border-strong, text, text-muted, text-inverse, action, action-hover, action-text, focus, and one pair per status (success, warning, danger, info) covering background, border, and text.

Define every role in every theme. A dark mode that only inverts the background will fail contrast somewhere.

## Scales

- **Spacing:** one geometric-ish scale (4, 8, 12, 16, 24, 32, 48, 64, 96). Every gap comes from it. An arbitrary 13px is a bug.
- **Type:** roles, not sizes — display, h1..h3, body, body-small, label, caption, code. Each role fixes size, line-height, weight, and letter-spacing together.
- **Radius:** three values at most, applied consistently by element size (control, card, sheet).
- **Elevation:** two to four levels, each mapped to a meaning (raised, overlay, popover, modal), not chosen per component.
- **Motion:** duration and easing tokens, plus a reduced-motion path. See `premium-web-motion`.

If a value cannot be expressed as a token, either the scale is wrong or the design is inconsistent. Find out which before adding an exception.

## Component API rules

A component's props are its contract. Design them like an API.

- **Variants over booleans.** `variant="danger"` beats `isDanger`, `isPrimary`, `isGhost` — booleans multiply into impossible combinations.
- **Restrict to what the system supports.** A `color` prop taking any string re-opens every inconsistency the system was built to close.
- **Composition over configuration.** Slots and children beat twenty props describing what to render inside.
- **Sensible defaults.** The most common use should require the fewest props.
- **Never leak layout outward.** A component sets its internal spacing; its parent decides where it sits. A component that sets its own external margin cannot be reused.
- **Forward the escape hatches:** `className`, `ref`, and `...rest` to the underlying element, so a one-off need does not require forking the component.
- **Accessibility is inside the component**, not the caller's responsibility: labels, roles, focus management, and keyboard behavior ship with it.

Survivability test for a component API — does it hold up under all six?

1. A very long label
2. A translated string 40% longer
3. Missing optional data
4. A disabled state
5. A loading state
6. A 320px viewport

## Documentation, per component

```
Purpose        what it is for, and when to use something else
Anatomy        named parts
Variants       each with the decision rule for choosing it
Sizes          and what determines the choice
States         from the state matrix
Content rules  label length, capitalization, tone, truncation behavior
Accessibility  role, name, keyboard behavior, announcements
Responsive     what changes at each breakpoint
Do / Don't     two or three real, specific pairs
Code           the minimal usage example, plus the most common variant
```

The "when to use something else" line prevents more misuse than any other part of the documentation.

## Auditing an existing system

Find the drift with real queries against the codebase:

```bash
# hardcoded colors that should be tokens
grep -rn "#[0-9a-fA-F]\{3,8\}\b" src --include=*.tsx --include=*.css | grep -v tokens

# off-scale spacing
grep -rnE "(margin|padding|gap)[^;]*: *[0-9]+px" src | grep -vE ": *(0|4|8|12|16|24|32|48|64|96)px"

# duplicate component concepts
find src -iname "*button*" -o -iname "*modal*" -o -iname "*dialog*"
```

Then rank what you find: unused components, duplicated concepts (three buttons, four modals), one-off values, components with more than roughly eight props, and components with no documented states.

Fix by consolidation, not by adding a seventh variant to the wrong component.

## Governance

- Every new component answers: does something existing cover this with a variant? Will it be used in more than one place? Who maintains it?
- Version and communicate breaking changes; give consumers a migration path rather than a surprise.
- Contribution beats decree: a system nobody can extend gets bypassed, and the bypasses become the real system.
- Measure adoption. A component library that half the product ignores is documentation of a failed handoff, not a design system.
