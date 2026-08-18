# Responsive and adaptive behavior

Read when defining layout behavior across viewports, input types, and densities.

## Design compact first

Not because mobile matters more, but because it forces prioritization. What survives at 360px is what actually matters; everything else is enhancement.

Test widths that represent real devices, not round numbers: **320** (the reflow floor), **360**, **390**, **414**, **768**, **1024**, **1280**, **1440**, and one very wide viewport where an unconstrained layout falls apart.

## Break on content, not on devices

A breakpoint belongs wherever the layout stops working, which is a property of the content, not of a phone model. Name breakpoints by intent (`compact`, `medium`, `wide`) rather than by device.

Prefer intrinsic techniques that need no breakpoint at all:

- `clamp()` for fluid type and spacing between defined bounds
- `minmax()` and `auto-fit`/`auto-fill` grids that reflow themselves
- `flex-wrap` with a sensible `min-width` on items
- Container queries when a component must adapt to *its own* space rather than the viewport — this is the correct tool for cards that appear in both a sidebar and a main column

## Responsive is transformation, not shrinking

For every layout, define these explicitly:

| Concern | Decision to make |
| --- | --- |
| Content priority | What is visible first at compact width, and what moves down or behind disclosure |
| Reorder | Which blocks change order, and whether the DOM order stays correct for keyboard and screen readers |
| Navigation | How it collapses, and which destinations stay visible |
| Tables | Card transformation, horizontal scroll with a pinned identifying column, or column hiding |
| Toolbars | Which actions stay visible, which collapse into an overflow menu |
| Charts | Fewer series, fewer labels, a simpler form, or a summary plus a link to the full view |
| Media | Art direction and crop, not just a smaller version of a wide image |
| Modals | Full-screen sheet on compact, centered dialog on wide |
| Text | Measure stays roughly 45–75 characters; a full-width paragraph on a wide screen is unreadable |

Never reorder visually in a way that contradicts the reading order without fixing the DOM order too.

## Input, not screen size

Screen width does not tell you the input method. A touchscreen laptop is wide and touch-driven; a phone can have a keyboard attached.

- Hover is an enhancement. Everything reachable by hover must be reachable by tap and by focus.
- Detect capability (`hover: hover`, `pointer: fine`) rather than inferring from width.
- Touch targets stay at 44×44 CSS px on every device that can be touched, with spacing between adjacent targets.
- Keep primary actions within comfortable thumb reach on tall screens; a critical action in the top corner is a poor choice on a 6.7-inch phone.
- Respect safe areas, the on-screen keyboard, and the dynamic browser chrome that changes viewport height mid-scroll. Use `dvh` where appropriate rather than assuming `100vh`.

## Density

Density is a separate axis from viewport. A data-heavy admin tool on a wide screen wants tighter rows than a marketing page.

Offer a density choice where the audience is professional and repetitive, but never remove capability at higher density — hiding actions to look tidy makes power users slower.

## Localization affects layout

- Plan for text expansion: many languages run 30–40% longer than English, and German or Finnish compounds break narrow buttons.
- Never build a layout that assumes a specific string length. Test with the longest real string, not the shortest.
- RTL flips layout, alignment, iconography with direction, and progress. Use logical properties (`margin-inline-start`, `padding-block`) so the flip is free.
- Scripts have different vertical metrics: Georgian, Armenian, Thai, and Devanagari need more line-height than Latin at the same size, and letter-spacing tricks borrowed from Latin type look wrong.
- Numbers, dates, currencies, and name order are locale-specific. Format them with the platform's internationalization APIs, never with string concatenation.

## Verification checklist

- [ ] 320px: no horizontal scroll, nothing clipped, everything reachable
- [ ] 360 / 390 / 414: primary action visible without scrolling past irrelevant content
- [ ] Tablet: layout does not look like a stretched phone or a squeezed desktop
- [ ] Wide: measure constrained, no lonely element stranded across an empty row
- [ ] 200% zoom: usable, no overlap, no lost content
- [ ] Touch: targets and spacing adequate, no hover-only affordance
- [ ] Keyboard: focus order matches the visual order at every breakpoint
- [ ] Longest string and translated locale: no overflow, no truncation of essential meaning
- [ ] Dark mode and reduced motion at each breakpoint
