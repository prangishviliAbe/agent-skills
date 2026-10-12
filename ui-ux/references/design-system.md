# Tokens and component consistency

Read when: Defining, extending, or reconciling typography, spacing, surface, state, and theme tokens.

Reuse the established system before creating a parallel one. Token names describe roles; primitive values alone do not explain how a component should behave.

| Layer | Example role | Decision |
| --- | --- | --- |
| Primitive | neutral scale, spacing scale | Keep a small coherent range; values are not universal standards |
| Semantic | page, surface, text, muted text, action, danger, focus | Assign meaning and check contrast in actual use |
| Component | field height, dialog inset, toolbar gap | Add only when repeated behavior differs meaningfully |
| State | selected, hover, pending, error | Preserve role and structure across transitions |
| Theme | light/dark mappings | Verify each role independently; do not invert colors mechanically |

## Practical token contract

```text
role: text-secondary
used for: supporting copy on page and panel surfaces
not used for: critical errors or disabled controls by default
verification: actual rendered contrast on both surfaces and supported themes

role: control-height
used for: aligned text fields and primary form actions
verification: real text fit, zoom, touch spacing, loading labels
```

Use CSS variables, framework tokens, or design-tool variables according to the project. OKLCH can aid palette tuning but does not prove contrast or brand fit. Verify target support and fallbacks for advanced CSS.

For fluid typography, combine a rem-based floor/ceiling with a viewport term where appropriate, then test zoom and long text. Do not use viewport-only sizing that defeats enlargement.

Document intentional optical adjustments. Avoid a new token for every one-off value, and avoid silently replacing approved brand colors during "cleanup".
