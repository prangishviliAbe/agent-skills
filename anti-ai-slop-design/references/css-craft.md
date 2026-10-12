# Restrained CSS implementation

Read when: Translating a visual direction into maintainable layout, typography, and component styling.

Use semantic tokens and the existing CSS framework. These neutral values illustrate mechanics; they are not a universal palette. Validate actual contrast and theme behavior in the target product.

```css
:root {
  --page: #f8f8f6;
  --surface: #ffffff;
  --text: #202522;
  --muted: #515a54;
  --boundary: #d5dbd6;
  --action: #254b38;
  --space-small: 0.5rem;
  --space-medium: 1rem;
  --space-large: 1.5rem;
  --radius-panel: 0.75rem;
}
.content-panel {
  padding: var(--space-large);
  border: 1px solid var(--boundary); /* Containment, not ornament. */
  border-radius: var(--radius-panel);
  background: var(--surface);
  color: var(--text);
}
.content-panel h2 {
  margin: 0;
  max-inline-size: 24ch;
  font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
  line-height: 1.2;
}
.content-panel p {
  margin-block: var(--space-medium) 0;
  max-inline-size: 62ch;
  color: var(--muted);
  line-height: 1.55;
}
.primary-action {
  min-block-size: 2.75rem;
  padding-inline: 1rem;
  border: 0;
  border-radius: 0.5rem;
  background: var(--action);
  color: #ffffff;
  font: inherit;
}
.primary-action:focus-visible {
  outline: 2px solid var(--text);
  outline-offset: 3px;
}
```

Do not add pseudo-element dots, gradient masks, card stripes, border beams, or atmospheric backgrounds to this base. A material effect belongs only to an explicitly required direction.

Keep focus outside clipping wrappers. Verify token roles across states and themes; do not infer contrast from OKLCH lightness alone. Scope selectors so a local refinement does not restyle unrelated content.
