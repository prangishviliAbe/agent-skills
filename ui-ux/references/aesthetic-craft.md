# Meticulous visual styling

Read when: Styling or refining an implemented screen, component, form, or dashboard.

## Whole-screen craft first

Establish an obvious focal point, useful reading order, stable content widths, and a coherent density. Inspect at actual scale and as a whole-screen thumbnail: one reveals detail defects, the other reveals hierarchy. Avoid decorating each component independently.

| Priority | Decision | Evidence to inspect |
| --- | --- | --- |
| Structure | Widths and region emphasis follow the task | Primary action remains visible without competing emphasis |
| Type | Distinct roles, correct weights, sensible measure | Real font loaded; labels, headings, and values read differently |
| Rhythm | Related spacing is tighter than section spacing | Consistent inset and gap relationships throughout the screen |
| Alignment | Baselines and visible icon shapes align | Detail crops of rows, labels, toolbars, and buttons |
| Surfaces | Containment and depth explain relationships | Fewer nested boxes; overlays read as overlays |
| Content fit | Text and imagery balance | No awkward orphan, clipping, stretched image, or incidental overlap |
| States | Feedback preserves structure | No control width jumps, disappearing data, or color-only meaning |

Resolve major proportion problems before micro-adjusting radii. A clean flat surface can be fully finished. Glass, grain, spotlight borders, colored dots, and card accent lines are not craft requirements.

## Controls and radii

For truly concentric nested surfaces with a uniform inset, an inner radius near max(0, outer radius - inset) is a useful starting point. Do not apply that formula to every badge inside a panel; unrelated shapes have their own roles.

| Element | Inspect closely |
| --- | --- |
| Button | Optical label centering, icon gap, consistent height, real hit area, state width |
| Field | Label association, inset, caret/text alignment, hint/error position, focus |
| Menu | Row rhythm, selection, separators only where useful, bounds and anchor |
| Table | Column alignment, numeric precision, row density, exception emphasis |
| Panel | Redundant framing, heading/content spacing, media crop, nested surface relation |

Use elevation sparingly. A modal may need a shadow; a static information block may need none. Pure black, quiet gray, a single typeface, and symmetric composition are valid when deliberate and readable.

## Removal pass

Delete decorative colored dots, fake activity LEDs, card top/side stripes, short title flourishes, border beams, gradient outlines, generic icon bubbles, and unrelated background patterns. Keep meaningful state/data marks and necessary borders. Check pseudo-elements and hover states as well as default markup.

## Correction artifact

```text
Observed: The toolbar's icon looks low beside the loaded label font.
Cause to inspect: Icon ink bounds differ from its viewBox center.
Change: Adjust the icon wrapper optically within the component, rather than moving the entire row.
Recheck: Default, focused, narrow, and longer-label variants.
Evidence: Detail crop and keyboard check when a running artifact is available.
```

Pair every noticeable correction with an inspection. Avoid claiming perfection from a list of chosen CSS properties.
