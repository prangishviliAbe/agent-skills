# Foundation: tokens, base CSS, and undoing framework defaults

Read when: Implementing a design in CSS, Tailwind, or a component kit, or when a codebase's defaults are the source of the generic look.

A design system is the smallest set of decisions that makes every screen consistent. Build it before the first component. Values below are examples of the mechanics; the real values come from the direction, typography, and color decisions.

## Token contract

```css
:root {
  /* Type */
  --font-text: "Brand Sans", system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, monospace;
  --text-xs: 0.8125rem;  --text-s: 0.875rem;  --text-m: 1rem;
  --text-l: 1.25rem;     --text-xl: 1.75rem;
  --text-2xl: clamp(2.125rem, 1.5rem + 2.6vw, 3.25rem);
  --leading-tight: 1.1;  --leading-snug: 1.3;  --leading-body: 1.6;

  /* Space: one scale, used for every margin, padding, and gap */
  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;  --space-4: 1rem;
  --space-5: 1.5rem;   --space-6: 2rem;    --space-7: 3rem;     --space-8: 4rem;
  --space-9: 6rem;

  /* Shape */
  --radius-s: 4px;  --radius-m: 8px;  --radius-l: 12px;
  --control-s: 2rem;  --control-m: 2.5rem;  --control-l: 3rem;

  /* Color roles are defined in the palette; listed here as the names to use */
  /* --page --surface --surface-sunk --border --text --text-muted
     --accent --accent-hover --accent-soft --on-accent --danger --focus */

  /* Motion */
  --dur-fast: 120ms;  --dur-base: 200ms;
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);

  /* Layout */
  --measure: 65ch;
  --page-max: 76rem;
  --gutter: clamp(1rem, 4vw, 2.5rem);
}
```

Rules:

- Components consume role tokens only. A raw hex value, pixel gap, or font size in a component is a defect to fix or a token to add.
- Add a token only when a value repeats with the same meaning. One-off values stay local with a comment explaining the optical reason.
- Names describe roles (`--text-muted`, `--radius-m`), never appearance (`--gray-500`, `--purple`).
- Keep the set small. A scale with twenty spacing steps is no scale.

## Base layer

```css
*, *::before, *::after { box-sizing: border-box; }
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-padding-top: var(--space-8);
}
body {
  margin: 0;
  background: var(--page);
  color: var(--text);
  font-family: var(--font-text);
  font-size: var(--text-m);
  line-height: var(--leading-body);
  font-kerning: normal;
  font-optical-sizing: auto;
}
h1, h2, h3 {
  margin: 0;
  line-height: var(--leading-tight);
  font-weight: 600;
  text-wrap: balance;
}
p { margin: 0; max-inline-size: var(--measure); text-wrap: pretty; }
img, svg, video { display: block; max-inline-size: 100%; block-size: auto; }
a { color: inherit; text-decoration-thickness: 0.06em; text-underline-offset: 0.18em; }
button, input, select, textarea { font: inherit; color: inherit; }
table { border-collapse: collapse; font-variant-numeric: tabular-nums; }
::selection { background: var(--accent-soft); color: var(--text); }
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
.container {
  inline-size: min(100% - 2 * var(--gutter), var(--page-max));
  margin-inline: auto;
}
.stack > * + * { margin-block-start: var(--stack-gap, var(--space-4)); }
@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto; }
}
```

Spacing between elements belongs to the parent (gap, or a stack rule like the one above), not to margins scattered on children. That single habit removes most spacing inconsistency.

## A component built from tokens

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  min-block-size: var(--control-m);
  padding-inline: var(--space-4);
  border: 1px solid transparent;
  border-radius: var(--radius-m);
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 550;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out);
}
.button:hover { background: var(--accent-hover); }
.button:active { background: var(--accent-hover); transform: translateY(1px); }
.button[aria-disabled="true"], .button:disabled { opacity: 0.5; cursor: not-allowed; }
.button--quiet {
  background: transparent;
  border-color: var(--border-strong);
  color: var(--text);
}
.button--quiet:hover { background: var(--surface-sunk); }
```

No gradient, glow, scale-on-hover, or `transition: all`. Feedback is a tone change within 120ms.

## Undoing Tailwind defaults

Tailwind's default palette, radius, and shadow scales are the look of thousands of generated pages. Keep the utility workflow; replace the values. The syntax below is for Tailwind 4; check the installed version, since version 3 configures the same thing in `tailwind.config.js` under `theme` (not `theme.extend`, which keeps the defaults available).

```css partial
@import "tailwindcss";

@theme {
  /* Remove the default palette so indigo-500 and slate-900 cannot be used by habit */
  --color-*: initial;
  --color-page: oklch(98.5% 0.004 80);
  --color-surface: oklch(100% 0 0);
  --color-border: oklch(90% 0.006 80);
  --color-text: oklch(22% 0.012 80);
  --color-muted: oklch(46% 0.012 80);
  --color-accent: oklch(50% 0.16 35);
  --color-on-accent: oklch(99% 0.005 80);

  --font-sans: "Brand Sans", system-ui, sans-serif;

  --radius-*: initial;
  --radius-s: 4px;
  --radius-m: 8px;
  --radius-l: 12px;

  --shadow-*: initial;
  --shadow-menu: 0 1px 2px rgb(40 30 20 / 0.06), 0 4px 12px rgb(40 30 20 / 0.1);
}
```

Habits to break in utility markup:

| Reflex | Replace with |
| --- | --- |
| `rounded-2xl shadow-lg border` on each container | The one surface rule decided for the system |
| `transition-all duration-300` | `transition-colors duration-150` or a named property |
| `hover:scale-105` | A tone change, and only on interactive elements |
| `text-gray-500` for secondary text | The muted text token, contrast checked |
| `bg-gradient-to-r from-* to-*` | A flat token color |
| `h-screen` | `min-h-svh` with content allowed to grow |
| `space-y-*` and margins mixed ad hoc | Parent `gap` from the scale |
| Arbitrary values `p-[13px]`, `text-[15px]` | A token, or a commented optical exception |

## Component kits (shadcn/ui, Radix themes, MUI, and similar)

A kit installed with its default theme looks like every other project using that kit. Keep its behavior and accessibility; replace its appearance.

1. Set the kit's theme variables (color roles, radius, font) to the project tokens before building screens. Most kits expose these as CSS variables or a theme object; check the installed version's documentation.
2. Change the default radius and neutral. The stock neutral and stock radius are the two most recognizable giveaways.
3. Review each component used: remove default shadows on resting cards, default badge colors, and default icon choices that were not decided.
4. Do not fork component internals to restyle them when a token or variant will do; forks drift and lose fixes.
5. Keep focus, keyboard, and ARIA behavior exactly as provided.

## Modern CSS worth using

Verify support for the project's browser targets before relying on any of these, and keep a sound fallback.

| Feature | Use |
| --- | --- |
| `clamp()`, `min()`, `max()` | Fluid type and spacing with fixed bounds |
| Container queries | Components that adapt to their container, not the viewport |
| `text-wrap: balance` and `pretty` | Better headline and paragraph breaks |
| Logical properties (`inline`, `block`) | Layouts that survive other writing directions |
| `oklch()` and `color-mix()` | Even lightness steps and derived tints |
| `:has()` | Parent styling without extra classes |
| `svh`, `dvh` units | Full-height sections that respect mobile browser chrome |
| `aspect-ratio` | Reserved media space, no layout shift |
| Subgrid | Aligning card internals across a row |
| `@layer` | Predictable cascade between reset, tokens, components, utilities |

## Code hygiene that shows on screen

- No `!important` to win specificity fights; fix the cascade.
- No inline styles for anything a token covers.
- No duplicated component variants with slightly different padding. Find the existing one.
- Remove dead ornament completely: the markup, the pseudo-element, the keyframes, the asset.
- Semantic elements first (`button`, `a`, `nav`, `table`, `label`); they bring correct behavior and focus handling for free.
