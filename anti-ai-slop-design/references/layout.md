# Layout and composition

Read when: Structuring a page or screen, choosing section forms, setting spacing and grids, or replacing repetitive card layouts.

Generated layouts repeat one move: center a heading, put a grid of equal cards under it, repeat. A composed layout gives each piece of content the form its information has, and makes importance visible through size, position, and space.

## Outline before boxes

Write the page as an argument or a task first, in plain lines:

```text
1. What this is and the one action           -> lookup field, one sentence
2. What a result looks like                  -> real example, annotated
3. What it costs                             -> tariff table
4. Where to bring or collect goods           -> address list with hours
5. How to reach a person                     -> phone, messenger, hours
```

Each line earns a section only if real content exists for it. Then choose a form for each line from the table below. Do not start from a list of section types and look for content to fill them.

## Form follows the information

| The content is | Use | Not |
| --- | --- | --- |
| One main idea with supporting points | Large statement plus a short plain list | Equal cards |
| Items compared on the same attributes | Table, or aligned rows | Cards with differing internal layout |
| A sequence | Numbered steps in reading order; a line only if it encodes order | Three cards with decorative connectors |
| Evidence: a screenshot, photo, figure | The figure large, with a caption that says what to notice | Thumbnail in a device frame |
| Reference data: prices, hours, specs | Table or definition list, set like a timetable | Prose paragraphs or icon cards |
| A handful of unequal features | One lead with evidence, the rest as a tight list | Bento by default |
| Truly parallel, independent items | Equal grid is correct | Forced asymmetry |
| A long explanation | Reading column with headings; optional margin notes | Chopped into cards |
| A quote that matters | Set as text at reading size with a real attribution | Card with avatar and stars |

Equal things get equal treatment and unequal things get unequal treatment. Manufacturing variety for parallel content is as wrong as flattening a hierarchy into a grid.

## Hierarchy

- Decide one focal point per viewport. Everything else supports it or waits.
- Make importance differences obvious. If the main element is only slightly larger than its neighbors, it reads as a mistake. Double it or equalize it.
- Rank with size, position, and space before weight and color. The top-left (or top-start) area and large empty margins are the strongest emphasis available.
- Limit primary actions to one per view. Secondary actions look secondary: text links or quiet buttons.
- Check with the squint test: blur the screenshot and see whether the order of attention matches the order of importance.

## Spacing

Use one scale and nothing outside it. Example on a 4px base:

```css
:root {
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.5rem;   --space-6: 2rem;
  --space-7: 3rem;     --space-8: 4rem;     --space-9: 6rem;
  --space-10: 8rem;
}
```

Rules that make spacing read as intentional:

- **Proximity is grouping.** The gap inside a group is always smaller than the gap between groups. Label to field is tighter than field to next field, which is tighter than section to section. Check this at every level; one violation makes the whole screen feel off.
- **Padding is at least the internal gap.** A container whose padding is smaller than the gap between its children looks like it is bursting.
- **Steps are large.** Neighboring spacing roles differ by about 1.5 times or more. 16 beside 20 looks like an error; 16 beside 32 looks like a decision.
- **Sections breathe at different rates.** Define two or three section spacings and use the open one for what matters most. Uniform padding everywhere removes pacing.
- **Whitespace is not empty.** Do not fill it with dots, icons, or filler sections. If an area feels empty, the content is too small, too little, or badly placed; fix that.

## Grids and alignment

- Establish a small number of vertical edges and put everything on them. Each stray edge adds noise. Count the left edges in a screenshot; fewer is better.
- Use a column grid for page structure (12 columns, or a simpler split derived from content) and let content span columns by importance. Asymmetric splits such as 5 and 7 or 4 and 8 suit unequal content; an even split suits a true comparison.
- Text columns keep their measure. A wide container does not mean wide lines: place the text block on the grid and leave the remainder empty or give it to a figure.
- Align across sections, not only within them. A heading that starts on the same edge as the paragraph three sections below ties the page together.
- Break the grid rarely and visibly: a full-bleed image, an oversized figure. A small misalignment is a bug; a large departure is a statement.

```css
.page   { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--space-5); }
.lead   { grid-column: 1 / span 7; }
.aside  { grid-column: 9 / span 4; }
.figure { grid-column: 1 / -1; }
@media (max-width: 48rem) {
  .lead, .aside { grid-column: 1 / -1; }
}
```

## Density

Match density to the task. Marketing pages can be spacious; tools must be compact enough to compare things without scrolling. Signs of wrong density:

| Symptom | Fix |
| --- | --- |
| One sentence per screen on a product page | Combine sections; bring evidence next to claims |
| A table turned into large cards on desktop | Restore the table; cards hide comparison |
| Dashboard showing four numbers above the fold | Tighten type and spacing; show the working data |
| Wall of equal text | Add hierarchy: lead sentence, subheads, a figure |

## Responsive composition

- Design the narrow layout as its own composition. Stacking the desktop columns in source order is a starting point, not a design.
- Break where the content gets crowded, not at device names. Resize slowly and watch for the width where a headline wraps badly or a column gets too narrow.
- Keep DOM order meaningful so reading order, focus order, and visual order agree.
- Prefer intrinsic layout (`minmax`, `auto-fit`, `clamp`, container queries for reused components) over many breakpoints.
- Tables on narrow screens: keep the key columns and scroll the rest inside a contained region, or restructure rows into label and value pairs. Do not let the page scroll sideways.
- Full-bleed media sits in a full-width section with an inner container; avoid `100vw` tricks that add a horizontal scrollbar.
- Full-height sections use `min-block-size: 100svh` with a `100vh` fallback so mobile browser chrome does not cut content, and still allow growth.

```css
.auto-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
}
.auto-grid > * { min-inline-size: 0; }
```

## Checks

| Check | Pass |
| --- | --- |
| Outline | Every section maps to a line of the outline and has real content |
| Form | No section is a card grid only because the previous one was |
| Focal point | One per view, obvious in a blurred screenshot |
| Proximity | Inner gaps smaller than outer gaps at every level |
| Edges | Few vertical alignment edges, shared across sections |
| Measure | No text line beyond about 75 characters |
| Narrow | Composed on purpose; nothing overflows at 320px |
