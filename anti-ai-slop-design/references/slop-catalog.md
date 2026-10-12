# Slop catalog and decoration audit

Read when: Removing generic styling, decorative dots, card lines, repetitive layouts, or unsupported proof.

## Prohibited ornament and functional exceptions

Remove the ornament from the changed scope. Do not disguise it with another color, animation, shape, or name.

| Motif | Prohibited use | Keep only for this role |
| --- | --- | --- |
| Colored dot / status LED | Heading decoration, card corner, fake "live" activity, rainbow dot group | Actual labeled status, chart legend, map/data point; use a second cue |
| Card line | Accent rail, top stripe, short flourish under title, inset ornamental divider | Necessary grouping separator, progress indicator, selected-state affordance |
| Border effect | Beam, tracing stroke, gradient outline, top-lit decorative streak | Quiet containment boundary or a clear focus/selection indicator |
| Icon bubble | Repeated colored circles behind unrelated icons | Meaningful avatar, actual interactive control, required brand motif |
| Badge / pill | "AI powered", "NEW", "premium", numbered eyebrow as filler | Genuine category/status/filter/action where the label helps |
| Backdrop | Radial blobs, wire grids, orbit rings, ambient particles, all-over grain | User-required brand motif or a graphic that explains the subject |
| Animation | Every card lifts/tilts; every section staggers in; cursor spotlight | Useful feedback or explicitly requested effect with accessible fallback |
| Product imagery | Fake live metrics, simulated customer activity, invented dashboard claims | Authentic capture or clearly labeled synthetic/concept demo |

The removal test: if the element disappears, does the user lose information, grouping, control, or a required brand expression? If no, delete it. Do not rationalize visual filler as "engagement".

## Replace the underlying weakness

| Weakness | Buildable correction |
| --- | --- |
| Three identical cards tell unrelated stories | Organize by user priority; use rows, sections, comparison, or unequal emphasis when warranted |
| Centered hero feels interchangeable | Improve product-specific headline, measure, image relationship, and action placement; centering itself is permitted |
| Flat component feels unfinished | Fix insets, type scale, content hierarchy, control sizing, and alignment before adding depth |
| Page feels empty | Bring useful content into a clearer composition; avoid filling space with dots or fake metrics |
| Every region has a border | Group related content with proximity and section rhythm; retain boundaries that improve comprehension |
| Glow distracts from a fixed purple brand | Keep the purple identity; reduce decorative implementation within the allowed scope |
| Invented testimonial creates "trust" | Remove it; use real evidence if supplied, otherwise let the product explanation stand |

## Audit artifact

Example for a cargo product with a fixed brand:

| Element | Diagnosis | Action | Evidence |
| --- | --- | --- | --- |
| Purple logo | Approved identity | Preserve | Supplied brief |
| Three colored card dots | No status label or data meaning | Remove spans and associated CSS | Visible ornament |
| Shipment status dot + "Delayed" | Actual state, text cue present | Keep semantic marker | State model |
| Card top stripe | Repeated ornament | Remove pseudo-element | Visible ornament |
| "10,000 happy shippers" | No source | Remove claim | Assumed / unsupported |
| Shipment table separators | Aid row scanning | Keep quietly | Task needs comparison |

Inspect pseudo-elements, SVG strokes, background images, shadows, and hover styles too. Removing a dot in markup while leaving its pseudo-element is incomplete.
