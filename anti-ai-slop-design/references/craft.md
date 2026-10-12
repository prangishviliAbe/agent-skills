# Typography, imagery, and optical craft

Read when: A design's direction is sound but execution still feels generic or unfinished.

## Inspection passes

| Pass | Inspect | Correct |
| --- | --- | --- |
| Type hierarchy | Actual font, weight, size, leading, measure, headline breaks | Make roles distinct; resolve awkward wraps without arbitrary hard breaks |
| Optical alignment | Visible glyph/icon bounds, baselines, label centering | Correct the perceived relation; document intentional token exceptions |
| Spacing rhythm | Insets, related gaps, section transitions | Use a small coherent scale; avoid one-off gaps on every component |
| Numerals | Columns, currencies, decimal places, live value changes | Tabular numerals where supported; align precision meaningfully |
| Imagery | Focal point, crop, native resolution, caption, alt text | Use authentic assets; preserve useful detail at narrow widths |
| Controls | Label measure, icon gap, target size, focus | Keep proportions and state dimensions stable |
| Surfaces | Number of containers and visual boundaries | Remove redundant framing; retain useful grouping |

Select typefaces from available assets, licensing, script coverage, and brand fit. Do not force two families or reject Inter/system fonts by name. Avoid fake bold/italic and unsupported feature tags.

Tune large display tracking only after inspecting the actual font and script. A fixed negative tracking value is not a universal improvement. Use content measure and font weight before squeezing letters.

## Craft review artifact

```text
Observed: At the narrow layout, the title leaves one short word on its last line.
Change: Reduce the headline maximum size and adjust the text measure within the approved layout.
Recheck: Actual Georgian and English titles at the failing width and adjacent widths.
Status: Verified only after inspecting the render.
```

Finish micro-details after correcting hierarchy. A precise image crop and balanced text block usually matter more than a new shadow recipe.
