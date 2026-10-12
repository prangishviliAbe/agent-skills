# Responsive content fit

Read when: Adapting layouts, components, tables, long text, sticky regions, or viewport-dependent controls.

Break where actual content becomes crowded, not at an arbitrary device label. Preserve information priority and DOM reading order.

| Pressure | Correct response | Avoid |
| --- | --- | --- |
| Long labels | Wrap, adjust measure, or use an accurate shorter translation | Truncating required meaning without an accessible route |
| Dense comparison | Contained scroll, priority columns plus accessible detail, or task-specific list | Hiding exceptions or turning every row into a giant card |
| Narrow toolbar | Wrap groups or provide a labeled overflow action | Horizontal page overflow |
| Tall overlay | Scrollable content with visible controls | Close action or focused field below an unreachable edge |
| On-screen keyboard | Recheck input, submit, and recovery visibility | Fixed footer covering the current field |
| Sticky context | Keep it only when it fits and helps | Sticky regions occupying most of a short viewport |
| Media | Responsive crop with intentional focal point | Stretching or losing the relevant subject |

## Component layout example

```css
.record-region { container-type: inline-size; }
.record-summary {
  display: grid;
  gap: 1rem;
}
.record-summary > * { min-inline-size: 0; }
.record-id { overflow-wrap: anywhere; }

@container (min-width: 36rem) {
  .record-summary {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }
}
```

Container queries are useful for reused components; media queries remain valid. Verify support against target browsers and the existing stack.

Inspect representative narrow, intermediate, and wide widths plus the breakpoint's neighboring widths. Example review widths are 360, 768, and 1440 CSS px, not a universal test matrix. Add zoom, long content, both supported languages, and short viewport height when relevant.

Do not hide overflow globally to conceal a layout defect. Fix the offending region and verify the task remains possible.
