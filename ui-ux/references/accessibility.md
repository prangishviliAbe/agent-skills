# Accessibility with evidence

Read when: Checking semantics, keyboard behavior, focus, contrast, targets, or dynamic announcements.

## Standards and practical decisions

| Concern | Baseline | Verification |
| --- | --- | --- |
| Text contrast | 4.5:1 normal text; 3:1 large text under WCAG definitions | Actual foreground/background and states, including transparent layers |
| Non-text contrast | Applicable controls, state indicators, and meaningful graphics generally need 3:1 | Boundary or indicator against adjacent colors; review exceptions |
| Pointer targets | WCAG 2.2 AA SC 2.5.8 uses 24 by 24 CSS px or its spacing/other exceptions | Actual target geometry and adjacent targets |
| Comfortable touch | Aim for 44 by 44 CSS px for frequent touch controls where practical | A design target; 44px is not the AA minimum |
| Keyboard | All functions operable with appropriate standard behavior | Tab order and widget-specific keys; no keyboard trap |
| Focus | Visible and not entirely obscured | Open overlays, sticky headers, scroll, and clipped wrappers |
| Reflow | Preserve the task at narrow/zoomed layouts | Inspect 320 CSS px equivalent where applicable; account for legitimate two-dimensional content |
| Color | Meaning also expressed by text/shape/pattern | Errors, selection, status, charts |
| Motion | Reduced-motion path and control of distracting moving content | CSS and JS paths, including preference changes |
| Names/roles | Native controls and programmatic labels | Accessibility tree plus actual assistive-technology checks when available |

Sources: [W3C target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [W3C contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), and [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Check applicable criteria and current standards when making a compliance claim.

Prefer real button padding/minimum dimensions over overlapping pseudo-element hit areas.

```css
.icon-button {
  display: inline-grid;
  place-items: center;
  min-inline-size: 2.75rem;
  min-block-size: 2.75rem;
  padding: 0.625rem;
}
.icon-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

## Focus and announcements

Prefer native dialog or the project's tested primitive over a hand-written static focusable-node loop. Modal behavior needs initial focus, dynamic focus containment, inert background, Escape handling, and focus restoration. A nonmodal drawer has a different contract.

Label fields explicitly. Associate hints/errors and avoid duplicate announcements. Use a restrained status region for discrete async results; do not announce every streamed token. Critical alerts deserve clear copy and appropriate urgency, not decorative red dots.

Automated scans, pixel measurements, and source inspection each cover only part of accessibility. State **Not run** for keyboard/screen-reader checks not actually performed.
