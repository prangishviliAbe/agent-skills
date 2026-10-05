# CSS craft: tokens, type, color, and measured contrast

Read when implementing a visual system in CSS. Snippets are starting points to adapt to the project's stack (Tailwind v4 maps these tokens through `@theme`); keep the project's naming and structure.

## Token starter

```css
:root {
  color-scheme: light dark;

  /* Color roles. Neutrals share the brand hue with very low chroma so grays feel related to the accent. */
  --brand-hue: 255;
  --canvas: light-dark(oklch(0.985 0.004 var(--brand-hue)), oklch(0.18 0.01 var(--brand-hue)));
  --surface: light-dark(oklch(1 0 0), oklch(0.23 0.012 var(--brand-hue)));
  --text: light-dark(oklch(0.22 0.02 var(--brand-hue)), oklch(0.95 0.005 var(--brand-hue)));
  --text-muted: light-dark(oklch(0.45 0.02 var(--brand-hue)), oklch(0.75 0.01 var(--brand-hue)));
  --accent: oklch(0.55 0.19 var(--brand-hue));
  --accent-on: oklch(0.99 0 0);
  --focus: oklch(0.65 0.2 var(--brand-hue));
  --danger: oklch(0.55 0.2 27);

  /* Type: fluid, bounded, with room for zoom (rem plus a viewport term, never viewport units alone). */
  --step-0: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  --step-1: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --step-2: clamp(1.6rem, 1.35rem + 1.2vw, 2.25rem);
  --step-3: clamp(2rem, 1.5rem + 2.4vw, 3.5rem);
  --leading-body: 1.55;
  --leading-heading: 1.15;
  --measure: 65ch;

  /* Space and shape: a scale, with deliberate exceptions. */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-6: 1.5rem; --space-8: 2rem; --space-12: 3rem; --space-16: 4rem;
  --radius-control: 0.5rem;
  --radius-surface: 1rem;
  --shadow-raised: 0 1px 2px oklch(0.2 0.02 var(--brand-hue) / 0.12), 0 8px 24px oklch(0.2 0.02 var(--brand-hue) / 0.08);
}

body { background: var(--canvas); color: var(--text); font-size: var(--step-0); line-height: var(--leading-body); }
h1, h2, h3 { line-height: var(--leading-heading); text-wrap: balance; }
p, li { max-width: var(--measure); text-wrap: pretty; }
.numeric, table { font-variant-numeric: tabular-nums; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; }
}
@media (forced-colors: active) {
  :focus-visible { outline-color: Highlight; }
}
```

Notes on support and meaning:

- `light-dark()` needs `color-scheme` set; it is the lightest way to define both themes in one place. Add dark mode only when the product supports it.
- `text-wrap: balance` is widely supported; `text-wrap: pretty` is a progressive enhancement (not in every browser) and falls back to normal wrapping.
- `ch` is the width of the "0" glyph, not a character count: confirm the rendered measure, especially for Georgian and other scripts.
- Tabular numerals keep columns of figures aligned in tables and dashboards.
- OKLCH makes lightness comparable across hues, which helps build ramps; still verify contrast by measurement.

## Build a ramp, then measure

Pick the brand hue, define steps by lightness (for example 0.97, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2) at a chroma that suits the hue, and assign roles (surface, border, text, accent, on-accent). Check each text and background pair, in every theme and state, with a formula rather than by eye:

```js
const channel = (value) => {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

export function contrast(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}
// contrast([0, 0, 0], [255, 255, 255]) === 21; contrast([118, 118, 118], [255, 255, 255]) is about 4.54
```

Thresholds (WCAG 2.2): 4.5:1 for normal text, 3:1 for large text (at least 24 CSS px, or about 18.67 CSS px bold) and for UI component boundaries and focus indicators that identify state. Compute against the rendered color, including opacity and the worst region of any image or gradient behind text.

## Typography details worth the effort

- Roles over sizes: display, heading, body, label, data, code, each with size, line height, weight, and tracking. Keep heading level (semantics) independent of visual size.
- Real weights only: check that the delivered font files contain the weights and glyphs you use, including Georgian and numerals, and that the fallback stack has similar metrics (`size-adjust`).
- Quotation marks, dashes, and ellipses follow the language's conventions. Avoid fixed-height text boxes and manual line breaks.

## Details that read as craft

- One focus style used everywhere, visible against every surface.
- Optical alignment of icons with text, and consistent stroke weight across the icon set.
- States designed for hover (fine pointers only), focus, pressed, disabled, loading, and error, using the same tokens.
- Dividers, shadows, and fills with one stated meaning each.
