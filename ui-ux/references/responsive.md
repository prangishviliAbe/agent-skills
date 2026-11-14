# Responsive behavior

Read when: Adapting a layout or component across widths, input types, zoom levels, or orientations.

Responsive design is recomposition by priority, not shrinking. Each width gets a layout that suits it, and the same content and capability remain reachable everywhere.

## Method

1. **Rank the content.** At the narrowest width, what must be seen first, what follows, and what can sit behind one tap? The ranking drives every later decision.
2. **Design the narrow layout as its own composition.** Then widen and let the layout add columns, side-by-side context, and persistent navigation when there is room.
3. **Find breakpoints from the content.** Resize slowly; where a line gets too long, a column too narrow, or a row wraps badly, that is a breakpoint. Device names are not.
4. **Prefer intrinsic layout.** Flexible grids, `minmax()`, `auto-fit`, `clamp()`, wrapping flex rows, and container queries remove most breakpoints.
5. **Keep source order meaningful.** Visual order, reading order, and focus order agree at every width. Do not reorder with CSS in ways that scramble tab order.

## Typical recompositions

| Wide | Narrow |
| --- | --- |
| Side navigation | Bottom tab bar for up to about five destinations, or a labeled menu button |
| List beside detail | List, then detail as its own view with a back control |
| Multi-column form | One column |
| Table with many columns | Priority columns with the rest in a contained horizontal scroll, or rows restructured as label and value pairs, or a detail view per row |
| Toolbar of labeled actions | Primary action visible; the rest in a labeled overflow menu |
| Side panel | Full-screen sheet with a clear close |
| Hover-revealed row actions | Always-visible action or a row menu |
| Filters in a sidebar | A "Filters" button opening a sheet, with active filters shown as chips |
| Sticky header and sticky footer | At most one, kept short |

Never remove a capability at narrow widths because it is hard to fit. Move it, collapse it, or put it one tap away.

## Pressures and responses

| Pressure | Do | Avoid |
| --- | --- | --- |
| Long labels and translations | Let text wrap; size controls to content; test the longest language | Fixed widths, `nowrap`, clipping |
| Long unbroken strings | `overflow-wrap: anywhere` on URLs, codes, emails | Page-level horizontal scroll |
| Short viewports (landscape phones, small laptops) | Let sticky elements scroll away; keep dialogs scrollable with actions reachable | Fixed bars that leave a sliver of content |
| On-screen keyboard | Keep the focused field and its submit action visible; use `dvh` for full-height layouts | Fixed footers covering inputs |
| Notches and rounded corners | `env(safe-area-inset-*)` padding on edge-anchored bars | Controls under the home indicator |
| Touch | Targets about 44px with space between; no hover dependence; gestures have a visible alternative | Tiny adjacent icons |
| Very wide screens | Cap text measure and overall content width; use extra room for context, not longer lines | Content stretched edge to edge |
| Zoom to 200% and 400% | Layout reflows as if the viewport were narrower | Text in viewport units; fixed-height containers |
| Pointer and hover differ by device | `@media (hover: hover) and (pointer: fine)` for hover enhancements | Assuming width implies input type |

## Building blocks

```css
/* Reusable component adapts to its own container */
.record { container-type: inline-size; }
.record__body { display: grid; gap: var(--space-4); }
.record__body > * { min-inline-size: 0; }          /* allow children to shrink */
@container (min-width: 36rem) {
  .record__body { grid-template-columns: minmax(0, 1fr) auto; align-items: start; }
}

/* Cards that wrap without breakpoints */
.grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}

/* Table that scrolls inside itself, not the page */
.table-wrap { overflow-x: auto; overscroll-behavior-inline: contain; }
.table-wrap:focus-visible { outline: 2px solid var(--focus); }

/* Full-height shell that respects mobile browser chrome */
.shell { min-block-size: 100vh; min-block-size: 100dvh; }

/* Edge-anchored bar clear of device insets */
.tabbar { padding-block-end: max(var(--space-2), env(safe-area-inset-bottom)); }
```

A scrollable region that contains no focusable elements needs `tabindex="0"` and an accessible name so keyboard users can scroll it. Container queries, `dvh`, and `overscroll-behavior` are widely available but still check them against the project's browser targets.

`min-inline-size: 0` on grid and flex children is the fix for most unexplained overflow: by default they refuse to shrink below their content.

## Images and media

- Set `width` and `height` or `aspect-ratio` so space is reserved.
- Serve responsive sources with `srcset` and `sizes`; use `picture` when the crop itself should change between narrow and wide.
- Choose `object-position` so the subject stays in frame when the ratio changes.
- Video and embeds keep their ratio and never exceed the container.

## Finding overflow

```javascript
[...document.querySelectorAll('body *')]
  .filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
  .map(el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().replace(/\s+/g, '.') : ''));
```

Run it at the narrowest width. Fix the element that is too wide. Do not hide the symptom with `overflow-x: hidden` on the page, which also breaks sticky positioning and hides content.

## What to test

| Dimension | Values |
| --- | --- |
| Width | 320, about 375 to 414, about 768, about 1024, 1280 to 1440, and one very wide; plus each breakpoint and a few pixels either side |
| Height | A short viewport (about 600px) for sticky elements and dialogs |
| Zoom | 200% at desktop width |
| Content | Longest real strings, every shipped language, empty and very full collections |
| Input | Keyboard, pointer, and touch emulation at least; a real phone when available |
| Orientation | Landscape on a phone for forms and media |

These are representative, not a universal matrix. Record which were actually checked.

## Checks

| Check | Pass |
| --- | --- |
| Priority | Narrow layout shows the most important content and action first |
| Capability | Nothing is unavailable at any width |
| Overflow | No page-level horizontal scroll from 320px up |
| Order | Visual, reading, and focus order agree |
| Touch | Targets large enough and separated; nothing hover-only |
| Zoom | Usable at 200%; text is not in viewport-only units |
| Wide | Text measure capped; layout does not sprawl |
