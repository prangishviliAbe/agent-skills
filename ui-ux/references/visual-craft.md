# Visual craft

Read when: Styling or polishing any screen or component, or when a UI works but looks generic, cluttered, or unfinished.

Finish comes from a small number of decisions applied without exception. Work top down: hierarchy, then spacing and alignment, then type, then color, then surfaces, then details. Fixing a shadow on a screen with broken hierarchy changes nothing.

## 1. Hierarchy

Decide the order in which things should be noticed, then make the screen obey it.

- Write the ranking: the one focal element, the supporting information, the rest. The primary action is in the first group and appears once.
- Create rank with, in order of strength: position and size, surrounding space, weight, contrast, color. Use the strong tools for the top rank and nothing for the bottom.
- De-emphasize instead of emphasizing. Most screens improve when secondary content gets quieter (smaller, lighter, muted), not when the primary gets louder.
- Labels are usually less important than their values. Make the value prominent and the label quiet, or fold the label into the value ("12 in stock").
- Differences must be decisive. If two things differ in importance, make the visual difference obvious; if they do not, make them identical.
- Test: blur the screenshot or view it as a thumbnail. The focal point and the reading order should survive. Then view in grayscale: hierarchy and state must still be legible.

## 2. Spacing

One scale, used for every margin, padding, and gap. Example: 4, 8, 12, 16, 24, 32, 48, 64, 96.

| Rule | Check |
| --- | --- |
| Proximity equals relationship | Gap inside a group is smaller than the gap between groups, at every nesting level |
| Container padding is at least the gap between its children | Otherwise content appears to press against the edges |
| Steps are large | Neighboring roles differ by about 1.5 times or more; 16 next to 20 reads as a mistake |
| Same relationship, same value | Every label-to-field gap is identical; every card inset is identical |
| Space above a heading exceeds space below it | The heading attaches to its content |
| Start with too much space and remove | Cramped is the common failure in dense UI; lost is the failure in sparse UI |

Parents own spacing (gap or a stack rule). Margins on individual children are how one-off values creep in.

## 3. Alignment

- Reduce the number of vertical edges. Count the distinct left edges of text and controls on the screen; each one beyond the necessary few adds visual noise.
- Align by what the eye sees, not by the box. Icons, play triangles, text with ascenders, and buttons with icons often need a 1 to 2px optical shift to look centered. Record such exceptions in a comment.
- Baseline-align text of different sizes that sits on one line (a number and its unit, a label and a value).
- Icon and label: the icon is sized to about the text's line box (16 to 20px for body UI), centered on the text's x-height, with a gap near 0.5em.
- Numbers end-align in columns with tabular figures and equal decimals.
- Sibling cards and rows share internal alignment even when text lengths differ: titles on one line, actions on one edge. Subgrid or a fixed internal structure achieves this.

## 4. Typography

| Decision | Guidance |
| --- | --- |
| Families | One is usually enough; two when roles truly differ. Confirm the rendered font is the intended one and covers every shipped language |
| Scale | A fixed set of sizes with clear steps. Dense tools: about 12, 13 or 14, 16, 20, 24. Content pages: 14, 16 or 17, 20, 28, 40 and up |
| Weights | Two or three. Regular for text, medium or semibold for emphasis and headings. Avoid light weights for small text |
| Line height | About 1.5 to 1.65 for body, 1.3 to 1.4 for UI labels and small text, 1.05 to 1.2 for large headings |
| Measure | 45 to 75 characters for running text; constrain the text block, not the page |
| Tracking | Zero for body. Slightly negative for large Latin headings, slightly positive for small all-caps labels. Verify per font and script; do not apply Latin tracking to Georgian |
| Wrapping | Balanced headings without a lone last word; labels do not wrap in buttons and tabs in normal cases; long strings wrap or truncate deliberately |
| Numerals | Tabular figures in tables, timers, and anything that updates in place |
| Case | Sentence case for headings and buttons unless the brand says otherwise; all caps only for very short labels |

Each text level differs from its neighbor in two properties (size and weight, or size and color). If two levels look alike, merge them.

## 5. Color

- Build the screen in neutrals first; it should work in grayscale.
- Neutrals are tinted slightly toward the brand hue, with enough steps for page, surface, sunken surface, border, muted text, and text.
- One accent, used for the primary action and the current or selected item. If it appears on headings, icons, and decorations as well, it marks nothing.
- State colors (danger, warning, success, info) appear only where the state is real, always with an icon or text.
- Text contrast at least 4.5:1 (3:1 for large text); control boundaries and meaningful icons at least 3:1. Check actual rendered pairs, including on tints and in hover and disabled states.
- Secondary text is a darker step of the neutral, not a lowered opacity that changes with the background.
- No gradients, glows, or tinted card backgrounds as decoration.

## 6. Surfaces

| Decision | Rule |
| --- | --- |
| Depth method | Choose one: borders (flat), tonal steps, or shadows. Resting content is flat; shadows are for things that float (menus, dialogs, toasts) |
| Radius | One family scaled by element size (for example 4, 8, 12). Nested radius equals outer radius minus the padding between. Inputs and adjacent buttons match |
| Borders | 1px, neutral, one strength for structure and a stronger one for controls. No colored or gradient borders except for state |
| Containers | A box exists only when its contents need separating. Prefer space, then a tone change, then a rule, then a box. Never box inside box inside box |
| Dividers | Horizontal hairlines between list or table rows; not above the first or below the last unless the container needs it |
| Backgrounds | Quiet neutrals; a second tone marks a different kind of region. No patterns or blobs |

## 7. Components

| Component | Inspect |
| --- | --- |
| Button | Height from the control scale; padding about 0.4 to 0.5 of height each side at minimum; label centered optically; one primary per view; hover, pressed, focus, disabled, and loading states with no size change |
| Field | Visible label; height and radius match buttons; clear focus state; hint and error positions; styled autofill, disabled, read-only |
| Select and menu | Same height as fields; option row height from the control scale; current option marked; keyboard highlight distinct from selection |
| Checkbox, radio, switch | Aligned to the first line of their label; label is clickable; target size adequate |
| Tabs | Current tab marked by more than color; consistent with the content edge; scroll or overflow menu when they do not fit |
| Table | See patterns reference; alignment and row height above all |
| Dialog | Title states the task; content width fits its content; actions at the end with the primary last or as the platform expects, consistently |
| Toast and banner | One position; does not cover actions; has a dismiss; errors do not disappear on a timer |
| Badge and tag | Only for real status or category; neutral by default; short text; never decoration |
| Avatar and image | Fixed aspect ratio; fallback for missing image; crops keep the subject |
| Tooltip | Supplementary only; appears on hover and focus; never holds essential information |

## 8. Detail pass

Zoom in and go region by region.

| Look for | Fix |
| --- | --- |
| Off-scale values (13px gaps, 15px text) | Snap to tokens |
| Edges that nearly align | Make them align exactly or differ clearly |
| Icons from different sets or stroke weights | One set, one weight |
| Text touching or crowding a border | Restore the inset |
| Headline with one word on the last line | Adjust measure or size |
| Truncated text with no way to read it | Wrap, widen, or provide the full value |
| Unequal padding on opposite sides | Equalize, or correct optically on purpose |
| Hover or focus that moves neighbors | Hold dimensions constant |
| Blurry or stretched images and icons | Correct source size and aspect ratio |
| Leftover ornament: dots, stripes, glows, badges | Remove, including pseudo-elements |
| Inconsistent capitalization and punctuation | One style everywhere |

## Diagnosis

| It looks | Usually because | Do |
| --- | --- | --- |
| Generic | Default font, palette, radius, shadows; template layout | Decide each from the product; remove the template elements |
| Cluttered | Everything boxed, bordered, and equally loud | Remove containers and rules; rank and quiet the secondary |
| Flat or lifeless | Weak hierarchy and timid contrast | Larger steps in size and weight; darker text; one confident accent |
| Amateur | Inconsistent spacing and near-miss alignment | One spacing scale; fewer edges; exact alignment |
| Heavy | Thick borders, dark dividers, bold everywhere | Hairlines, lighter neutrals, weight only where earned |
| Cheap "premium" | Glows, gradients, glass | Remove effects; invest in type, space, and states |
