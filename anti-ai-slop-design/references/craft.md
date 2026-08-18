# Craft: typography, color, space, surface, detail

Read when making or reviewing concrete visual decisions. Numbers here are defaults to depart from deliberately, not laws.

## Typography

**Roles, not sizes.** Define display, h1–h3, body, body-small, label, and caption. Each role fixes size, line-height, weight, tracking, and color together. A size without a defined role is where inconsistency starts.

**Scale.** A ratio between roughly 1.2 (dense, utilitarian) and 1.333 (editorial, spacious). Larger ratios need larger jumps in content importance to justify them. Round to whole pixels at small sizes.

**Line-height.** Roughly 1.5–1.6 for body text, 1.2–1.35 for headings, tighter as size grows. Non-Latin scripts with tall ascenders and descenders need more — see [multilingual.md](multilingual.md).

**Measure.** 45–75 characters for prose. Below 40, wrapping becomes choppy and the eye works harder; above 85, the return sweep loses the line. Use `ch` units so the constraint follows the font.

**Weight contrast.** Two or three weights, with real distance between them (400 / 600, or 400 / 700). 500 next to 600 reads as an accident rather than a decision.

**Tracking.** Leave body text alone. Tighten large display type slightly (-0.01 to -0.02em). Loosen uppercase and small labels (+0.02 to +0.06em). Never track non-Latin scripts by Latin instinct.

**Practical checks:** the longest real heading does not break into a one-word orphan line; numerals in tables are tabular; a `<strong>` inside body text is distinguishable; text over an image is legible at the image's lightest region.

## Color

**Build roles, not a swatch collection.**

```
canvas, surface, surface-raised
text, text-muted, text-inverse
border-subtle, border-strong
action, action-hover, action-text, focus
success / warning / danger / info  — each with background, border, and text
```

Every role is defined in every theme. A dark theme is not an inversion; muted text and borders need re-tuning or they vanish.

**Neutrals carry the design.** Most surfaces, text, and borders come from one neutral ramp with a consistent slight temperature. A neutral ramp that drifts between warm and cool grays looks broken without anyone being able to say why.

**Accent discipline.** One accent for action. If a second exists, it must have a stated, different job (navigation state, a data category), not decoration. Semantic status colors are reserved for status — never used to add visual interest.

**Contrast is measured, not judged.** 4.5:1 for body text, 3:1 for large text and for component boundaries and meaningful icons. Check against the actual rendered background, including gradients and image overlays at their worst point.

**Dark themes.** Canvas near #0e1013–#16181d rather than pure black, which causes halation against light text. Desaturate accents slightly; a color tuned for a white background is usually too loud on a dark one. Signal elevation with lighter tonal steps rather than heavier shadows, which are invisible on dark surfaces.

## Space

**One scale.** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Every gap comes from it. An off-scale value is either a bug or a documented exception.

**Space is grouping.** Proximity says "these belong together" more clearly than any border. Before adding a divider or a card, try increasing the gap between groups and decreasing it within them.

**Vertical rhythm carries meaning.** Uniform spacing between all sections makes a page read as an undifferentiated stack. Tight within a topic, generous at a genuine change of topic.

**Optical over mathematical.** Equal numbers do not always look equal: text has visual sidebearings, icons have internal padding, round shapes need slight overshoot. Trust the eye at the final pass, but only after the system is in place.

## Surfaces, borders, elevation

Establish a separation strategy and use it consistently:

1. **Space** — the quietest and usually the best
2. **Tone** — a slightly different surface value
3. **Hairline** — a 1px subtle border
4. **Elevation** — shadow, reserved for things that genuinely float above the page

Most interfaces need only the first two. Shadow is for overlays, popovers, dropdowns, and dragged objects — things that are literally above the surface. A shadow on a static card is decoration.

**Radius logic**, stated once and applied by element size: small controls take the small radius, cards the medium, sheets and modals the large. A pill radius is a deliberate statement, not a default for every button.

**Borders:** two tokens. Subtle for structure, strong for emphasis or a focused state. Anything more is drift.

## Icons

One set, one stroke weight, one optical size, aligned to a shared grid. Icons sit on a consistent baseline with their labels. An icon that does not add recognition speed (a generic star beside a heading) is noise — remove it. Icon-only controls always carry an accessible name and, ideally, a visible label at larger sizes.

## Imagery

Every image has one of four jobs: **evidence** (this is the real thing), **atmosphere** (this is the world it lives in), **instruction** (this is how it works), or **recognition** (this is who we are). An image with no job is a filled rectangle.

Direct it concretely: subject, context, composition, crop ratio, lighting, treatment, and placement. "Professional photo of a team" is not direction; "three people at a shared workbench, shot from above, cool daylight, cropped to 3:2, hands and tools in frame, faces incidental" is.

Consistency: one crop ratio family, one grade, one treatment. Mixed color grading across a page is the fastest way to look assembled from stock.

## The detail pass

Run last, in one sitting, on the real rendered page:

- [ ] All radii from the defined set, applied by the stated logic
- [ ] All borders from the two tokens
- [ ] All spacing on-scale
- [ ] Icons: one set, one weight, optically aligned with labels
- [ ] Focus ring: visible, on-brand, 3:1 contrast, not clipped by an overflow container
- [ ] Hover, active, and disabled states defined for every interactive element
- [ ] Text over media legible at the worst point of the image
- [ ] Numbers tabular where they align in columns
- [ ] Long strings, empty states, and missing images do not break the layout
- [ ] Dark mode checked for muted text, borders, elevation, and accent saturation
