# Surfaces, depth, and component finish

Read when: Deciding radius, borders, shadows, and elevation, or polishing buttons, fields, cards, and other components.

Generated UI applies one recipe to every box: large radius, soft shadow, hairline border, slight tint. Finished UI has a small set of surface rules, each with a meaning, applied without exception.

## Decide the system

Answer these four questions once, write the answers as tokens, and do not deviate.

| Question | Options | Guidance |
| --- | --- | --- |
| How is depth shown? | Flat with borders; tonal steps; shadows | Choose one primary method. Mixing all three on resting elements is the generated look |
| What is the corner personality? | Square (0), crisp (2 to 4px), soft (6 to 10px), round (12px and up, pills) | It must fit the tone: a legal or industrial product with pillowy corners looks wrong |
| What separates regions? | Space; a tone change; a rule | Prefer space, then tone, then a rule |
| What floats? | Menus, popovers, dialogs, toasts, dragged items | Only these get shadows |

## Radius

```css
:root {
  --radius-s: 4px;    /* inputs, small controls, tags */
  --radius-m: 8px;    /* buttons, cards */
  --radius-l: 12px;   /* dialogs, large panels */
  --radius-full: 999px;
}
```

- Scale radius with element size, within one family. A 12px radius on a 24px tag makes it a pill; on a 600px panel it is barely visible.
- Nested corners: inner radius equals outer radius minus the padding between them, floored at zero. Equal radii on nested boxes produce a visibly uneven band.
- Pills are for elements whose content is one short token (a tag, a toggle). A pill-shaped button holding a long label looks inflated.
- Images follow the same family as the surface they sit on, or are square. Do not round every image by default.
- Do not mix sharp and round arbitrarily. If inputs are 4px, buttons beside them are 4px.

## Borders and rules

- One weight: 1px. Use color, not thickness, to vary strength.
- Border color comes from the neutral scale and is just visible against both the page and the surface. On tinted or dark surfaces, a semi-transparent neutral adapts better than a fixed gray.
- A box needs a border only when its background does not already separate it. White card on off-white page: either the border or a tone difference, not both plus a shadow.
- Table and list rules are horizontal only in most cases. Vertical rules and full grids add noise; alignment separates columns.
- No colored borders except for state: focus, selected, invalid.
- No accent stripes on one edge. No gradient borders.

## Shadows and elevation

Resting content is flat. Shadows mean "this is above the page".

```css
:root {
  --shadow-color: 30 20% 20%;  /* HSL components, tinted toward the neutral hue */
  --shadow-menu:
    0 1px 2px hsl(var(--shadow-color) / 0.06),
    0 4px 12px hsl(var(--shadow-color) / 0.10);
  --shadow-dialog:
    0 2px 4px hsl(var(--shadow-color) / 0.06),
    0 12px 32px hsl(var(--shadow-color) / 0.16);
}
```

- One light source, from above. All shadows offset downward, none sideways.
- Layer two or three small shadows rather than one large blur; the result reads as contact plus ambient light.
- Tint the shadow toward the background hue at low opacity. Pure black shadows look dirty; colored glows look generated.
- Two or three elevation levels are enough: raised control (optional), menu, dialog.
- On dark themes, express elevation with a lighter surface and a subtle border; shadows are nearly invisible.
- No shadow on text. No inner glows or top-edge highlights unless the entire system is deliberately material.

## Backgrounds

The page background is a quiet neutral. Sections change tone to mark a change of subject, in at most two or three tones. No blobs, meshes, grids, noise, or spotlights. A texture is justified only when it is the real material of the brand and appears with restraint. Images used as backgrounds must leave a calm area for text and pass contrast at their worst point.

## Component finish

Go through each component type in the changed scope with this list. Most "it looks generated" feedback at the component level comes from skipped states and careless proportions.

### Buttons

- Height from the control scale (for example 32, 40, 48px), shared with inputs so they align in a row.
- Horizontal padding roughly equal to height times 0.4 to 0.5; a button is wider than it is tall by a clear margin.
- Label is a verb plus object, sentence case, weight 500 to 600, never wrapping in normal cases.
- Icon and label gap about 0.5em; icon sized to the text's cap height region, optically centered (many icons need a 0.5 to 1px nudge).
- Three ranks at most: primary (filled), secondary (bordered or tonal), tertiary (text). One primary per view.
- States: hover and pressed change tone, not size; focus-visible shows a 2px ring with offset; disabled lowers contrast and removes the pointer; loading keeps the width and shows progress in place.
- Hit area at least 24 by 24 CSS px, 44 by 44 for touch-first controls, without changing the visual size if the design is compact.

### Inputs and forms

- Visible label above the field. Placeholder is an example, never the label.
- Same height, radius, and border as buttons in the same row.
- Field width hints at the expected content: a postal code field is short, an address is long.
- Error text sits under the field, says how to fix the problem, and has an icon or prefix as a second cue besides red.
- Focus is unmistakable: a ring or a strong border change with 3:1 contrast.
- Style autofill, disabled, and read-only states; browser defaults leak through otherwise.

### Cards and panels

- A card is a group of related content that can stand alone. If removing its box changes nothing, remove it.
- Internal structure aligns across sibling cards: titles on one baseline, actions on one edge, even when text lengths differ.
- Clickable cards have one clear target and a hover state; non-clickable cards have no hover effect at all.
- Padding from the spacing scale, larger than the internal gaps.

### Tables and lists

- Text left, numbers right in tabular figures, headers aligned with their columns.
- Row height from the control scale; horizontal rules only; hover highlight only if rows are actionable.
- Header is quieter than the data: smaller or muted, not bold on a heavy colored bar.
- Truncate with a visible way to read the full value. Empty cells show a dash, not blank space.

### Navigation and chrome

- The current location is marked by more than color.
- Header height is modest; a tall sticky header steals the viewport.
- Footer is a tidy list of real links, not four padded columns of invented pages.

## Small things that get noticed

| Detail | Finished state |
| --- | --- |
| Focus rings | Visible on every interactive element, never clipped by `overflow: hidden` |
| Scrollbars and overscroll | Contained regions scroll without moving the page; no double scrollbars |
| Skeletons and placeholders | Match the size of the content they stand in for, so nothing shifts on load |
| Images | `width` and `height` or `aspect-ratio` set to prevent layout shift; meaningful `alt` text |
| Favicon, title, social preview | Present and on brand |
| `scroll-margin-top` | Anchored headings are not hidden under a sticky header |
| Tap highlight and selection colors | Set to fit the palette |
| Icons | One set, one stroke weight, one size per context |
| Dividers at list ends | No rule above the first or below the last item unless the container needs it |
| Edge cases | Zero items, one item, very many items, very long text all look intended |
