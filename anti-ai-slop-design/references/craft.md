# Craft: typography, color, composition, and assets

Read for concrete visual decisions. Preserve an effective existing system. Numerical examples are starting points, except where explicitly identified as standards.

## Typography

Define only needed roles: display, section heading, body, label, caption, data, or code. Keep semantic heading structure independent of visual size.

Choose a font for the actual script, reading task, tone, license/availability, and delivery cost. Inspect real weights and fallback behavior rather than trusting a font name.

| Decision | Starting point | Judge by |
| --- | --- | --- |
| Body measure | Roughly 45–75 characters can suit Latin prose | Font, script, reading task, line tracking, and viewport; not a universal limit |
| Body line-height | Around 1.5 can be useful | Actual glyph metrics, size, script, line length, and spacing overrides |
| Heading leading | Often tighter than body | No collisions/clipping; readable wrapping at supported widths |
| Type scale | A small set of meaningful roles | Clear hierarchy with actual content, not adherence to one ratio |
| Weight | Distinguishable emphasis using available weights | Font rendering and readability; adjacent weights can be valid |
| Tracking | Natural spacing first | Display intent and script behavior; avoid blanket letter-spacing tricks |

The CSS unit `ch` measures the advance of the "0" glyph, not an exact count of arbitrary characters. Validate the rendered measure. Use bounded fluid type where appropriate and check zoom; do not rely only on viewport units.

Avoid fixed-height text boxes, nonresponsive manual line breaks, and ellipsis that hides essential differences. A one-word final heading line is a composition choice to inspect, not an automatic defect.

## Color and themes

Assign roles rather than a palette without purpose: canvas, surface, text, muted text, action, focus, and relevant statuses. Reuse the supplied brand palette and build needed accessible pairings around it.

A colorful identity can use several accents. Ensure actions, selected states, categories, and warnings remain distinguishable and that color is not the only signal.

Tune supported themes independently. Pure black, warm neutrals, cool neutrals, saturation, and tonal elevation are choices to validate in context, not universal quality rules. Do not add dark mode unless it is requested or part of the existing product.

## Accessibility for visual decisions

| Check | Standard distinction / action |
| --- | --- |
| Text | WCAG 1.4.3 AA uses 4.5:1 ordinary text and 3:1 large text: at least 24 CSS px regular or about 18.67 CSS px bold, with defined exceptions |
| Contrast measurement | Evaluate intended rendered color pairs including opacity and worst-case media/gradient regions; screenshot samples can be approximate |
| Non-text information | WCAG 1.4.11 AA applies 3:1 to necessary control/state identification and meaningful graphics, not every decorative border |
| Focus | Keep keyboard focus visible and not entirely obscured; inspect custom indicator contrast. Extra area/change-of-contrast criteria in 2.4.13 are AAA |
| Targets | WCAG 2.5.8 AA uses 24×24 CSS px with specified exceptions; 44×44 is a useful touch aim and the AAA enhanced criterion, not a universal AA minimum |
| Reflow and scaling | Inspect 200% text enlargement and 320 CSS px reflow or equivalent 400% zoom; necessary two-dimensional content has defined reflow exceptions |
| Text spacing | Layout must tolerate the applicable user spacing overrides; fixed label heights and clipped controls often fail |
| Meaning | Supplement color with another cue, provide image alternatives, and keep essential information available as text |
| Motion | Keep interaction usable with reduced motion and avoid blocking content behind effects; inspect applicable motion/media criteria separately |

Sources: [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html), [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).

This subset helps visual work; it does not establish complete WCAG conformance. A design file can specify focus treatment but cannot prove keyboard or screen-reader behavior.

## Space and composition

Use proximity, alignment, contrast, repetition, and rhythm to express relationships. Consistent section spacing can be appropriate; vary it when a real grouping or pacing benefit exists.

Reuse a spacing scale where practical. Permit deliberate optical corrections, calculated dimensions, and expressive composition. A 13px value is not intrinsically a bug; unexplained divergence between equivalent roles is a useful audit target.

Distinguish large-screen breathing room from unused space that separates related information. Inspect both a content-heavy region and the hero. Align icons and text optically after establishing stable layout rules.

## Surfaces and details

Choose space, tone, border, or shadow according to the needed separation and visual language. Shadow can suit a static card, and a strong border can be a brand feature. Make each recurring use predictable.

Define radius relationships by role, geometry, and nesting; do not require every element size to map to a different radius. Nested outlines need appropriate inset relationships, not identical numbers everywhere.

Use a coherent icon vocabulary and optical sizing. Icon-only controls need an accessible name; labels or discoverable help can clarify unfamiliar actions. Tooltips must not contain the only essential instruction.

## Imagery and asset direction

Give an asset a job: evidence, atmosphere, instruction, recognition, or deliberate expression. Specify relevant subject, context, composition, crop, treatment, and placement. A useful image can be photographic, generated, illustrated, or abstract.

- Prefer supplied brand assets and real product material when they fit.
- Check permitted use and attribution requirements for sourced assets; do not invent permission or provenance.
- Label conceptual/product-demo imagery so it does not masquerade as evidence of real people, events, or capabilities.
- Preserve a useful focal point at compact and wide crops, with readable text over media and a sensible missing-image fallback.
- Inspect generated content for distorted detail, invented text/logos, and inconsistent series treatment.
- Account for payload, dimensions, animation cost, and font loading when implementing; a small visual gain may not justify a large dependency.

## Inspect the delivered artifact

Check actual fonts, content, images, focal hierarchy, repeated-role consistency, meaningful states, compact/wide behavior, and relevant accessibility criteria. If implementation is available, inspect the rendered artifact and operate its affected controls. Record what could not be checked instead of calling the design "verified" from a single frame.