# Composition from information

Read when: Choosing page structure, section rhythm, content density, or a replacement for repetitive cards.

## Layout decisions

| Information relationship | Useful composition | Check |
| --- | --- | --- |
| Comparable records | Aligned table or list | Values remain easy to compare; exceptions are visible |
| One primary feature, secondary support | Unequal emphasis | Size follows priority rather than novelty |
| Equal alternatives | Equal grid or comparison | Avoid manufacturing hierarchy |
| Long explanation with context | Reading column and optional side context | Sticky content fits the viewport and does not hide focus |
| Real visual evidence | Text/media relationship | Crop and caption preserve the meaning |
| Simple sequence | Ordered steps or timeline | Lines encode sequence only if needed; no ornamental connectors |

Define a page's reading path before arranging boxes. Use larger separation between topics than between a label and its value. Change section rhythm when the content relationship changes; do not make every section a card grid.

## Responsive composition example

```css
/* Example: two related regions; adapt the threshold to actual content. */
.product-section {
  display: grid;
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: start;
}
.product-section > * { min-inline-size: 0; }

@media (min-width: 60rem) {
  .product-section {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
}
```

Keep DOM order meaningful before CSS positioning. Inspect the actual headline and media at the breakpoint. Do not use a breakpoint merely because it is conventional.

For full-bleed media, use a full-width section with an inner content container. Avoid untested 100vw breakout recipes that create scrollbar overflow. Contain long URLs and code deliberately rather than hiding page overflow.
