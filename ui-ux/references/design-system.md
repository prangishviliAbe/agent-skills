# Design system: tokens, components, themes

Read when: Defining, extending, auditing, or reconciling tokens and components, or setting up styling for a new product.

A design system is the smallest set of decisions that keeps every screen consistent. Reuse the project's existing system before adding to it. Create a new one only when none exists or the user asks.

## Token layers

| Layer | Example | Rule |
| --- | --- | --- |
| Primitive | `--neutral-200`, `--space-4` | Raw scales. Not used directly in components when a semantic token exists |
| Semantic | `--text-muted`, `--surface`, `--border`, `--accent`, `--danger` | Named by role. This is what components consume |
| Component | `--control-height-m`, `--dialog-padding` | Only when a repeated component decision differs from the semantic default |

Names describe purpose, never appearance. `--accent` survives a rebrand; `--purple-500` does not. Keep the set small enough to remember: a system with forty grays is not a system.

## A complete minimal set

Values are examples of the mechanics. Derive real ones from the brand and verify contrast in use.

```css
:root {
  color-scheme: light;

  /* Color roles */
  --page: oklch(98.5% 0.004 250);
  --surface: oklch(100% 0 0);
  --surface-sunk: oklch(96.5% 0.005 250);
  --border: oklch(90% 0.006 250);
  --border-control: oklch(72% 0.01 250);     /* 3:1 against surface for input boundaries */
  --text: oklch(24% 0.015 250);
  --text-muted: oklch(46% 0.015 250);
  --accent: oklch(48% 0.14 250);
  --accent-hover: oklch(42% 0.14 250);
  --accent-soft: oklch(95% 0.025 250);
  --on-accent: oklch(99% 0.003 250);
  --danger: oklch(50% 0.19 25);
  --danger-soft: oklch(95% 0.03 25);
  --warning: oklch(70% 0.15 75);
  --success: oklch(50% 0.12 150);
  --focus: oklch(55% 0.2 255);

  /* Type */
  --font-text: system-ui, sans-serif;        /* replace with the product's face */
  --text-xs: 0.75rem;  --text-s: 0.875rem;  --text-m: 1rem;
  --text-l: 1.25rem;   --text-xl: 1.5rem;   --text-2xl: 2rem;
  --leading-ui: 1.35;  --leading-body: 1.6; --leading-heading: 1.15;
  --weight-regular: 400;  --weight-medium: 500;  --weight-strong: 650;

  /* Space and size */
  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;  --space-4: 1rem;
  --space-5: 1.5rem;   --space-6: 2rem;    --space-7: 3rem;     --space-8: 4rem;
  --control-s: 2rem;   --control-m: 2.5rem; --control-l: 3rem;

  /* Shape and depth */
  --radius-s: 4px;  --radius-m: 8px;  --radius-l: 12px;
  --shadow-overlay: 0 1px 2px rgb(20 25 40 / 0.06), 0 8px 24px rgb(20 25 40 / 0.12);

  /* Motion */
  --dur-fast: 120ms;  --dur-base: 200ms;  --dur-slow: 320ms;
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  color-scheme: dark;
  --page: oklch(17% 0.01 250);
  --surface: oklch(21% 0.012 250);
  --surface-sunk: oklch(14% 0.01 250);
  --border: oklch(29% 0.012 250);
  --border-control: oklch(48% 0.015 250);
  --text: oklch(93% 0.006 250);
  --text-muted: oklch(72% 0.012 250);
  --accent: oklch(74% 0.12 250);
  --accent-hover: oklch(80% 0.11 250);
  --accent-soft: oklch(28% 0.04 250);
  --on-accent: oklch(18% 0.02 250);
  --shadow-overlay: 0 0 0 1px oklch(32% 0.012 250), 0 8px 24px rgb(0 0 0 / 0.5);
}
```

## Token contract

Each semantic token has a stated use, a stated non-use, and a check. Write this down for the tokens that get misused.

```text
--text-muted
  Use:     secondary text, hints, table headers
  Not for: disabled controls, placeholder text standing in for a label, errors
  Check:   4.5:1 on --page, --surface, and --surface-sunk in both themes

--accent
  Use:     primary button fill, links, selected and current indicators
  Not for: headings, decorative icons, borders, backgrounds of resting cards
  Check:   --on-accent on --accent is 4.5:1; accent on surface is 3:1 for indicators

--control-m
  Use:     default height of buttons, inputs, selects, and table rows in standard density
  Check:   real labels fit; 200% zoom; touch layouts use --control-l
```

## Themes

- A dark theme is designed, not inverted. Surfaces get lighter as they rise, accent chroma drops and lightness rises, shadows give way to borders and tone.
- Every role is checked in every theme: contrast, state colors, focus ring, images, and logos.
- Respect the system preference by default and let the user override it; persist the choice; avoid a flash of the wrong theme on load by setting the theme before first paint.
- Set `color-scheme` so native controls and scrollbars match.
- High-contrast and forced-colors modes: do not carry meaning with background images or box shadows alone; test that borders and focus remain visible.

## Components

A component is defined by its anatomy, variants, sizes, states, and behavior. Document only what a developer or the next designer would otherwise guess.

```text
Component: Button
Anatomy:   [leading icon] label [trailing icon]
Variants:  primary (one per view), secondary, quiet, danger
Sizes:     s 32 / m 40 / l 48 high; padding-inline 12 / 16 / 20
States:    default, hover, pressed, focus-visible, disabled, loading
Behavior:  label never wraps; loading keeps width and blocks repeat activation;
           icon-only requires an accessible name and tooltip
Content:   verb plus object, sentence case
Do not:    place two primaries side by side; use danger for non-destructive actions
```

Rules for a healthy library:

- Fewer, more capable components beat many near-duplicates. Before adding a variant, check whether an existing one serves.
- Variants are named by purpose (primary, danger), not look (blue, big).
- Components do not set their own outer margins; the parent layout spaces them.
- Every interactive component ships with all its states and keyboard behavior, or it is not done.
- Use the platform or a tested headless primitive for complex widgets (dialog, combobox, menu, tabs, date picker). Hand-rolled versions almost always miss focus and keyboard details.

## Working with an existing kit

When the project uses a component kit (shadcn/ui, Radix, MUI, Ant, Bootstrap, or similar):

1. Theme it through its supported variables or theme object so it carries the product's tokens. Check the installed version's documentation for the mechanism.
2. Change the defaults that make every project look alike: neutral palette, accent, radius, font, shadow.
3. Do not restyle by overriding internals with deep selectors or `!important`; that breaks on upgrade.
4. Keep its accessibility behavior intact.
5. Do not mix two kits on one screen.

## Auditing a system

Count what is really in use; the numbers show where the system has eroded.

| Measure | Healthy | Sign of erosion |
| --- | --- | --- |
| Distinct font sizes | About 5 to 8 | A dozen or more, some 1px apart |
| Distinct text colors | 3 to 5 plus states | Many near-identical grays |
| Distinct spacing values | On the scale | Arbitrary 5, 7, 13, 18px values |
| Distinct radii | 2 to 4 | A different radius per component |
| Distinct shadows | 1 to 3 | Shadows on resting cards, each slightly different |
| Button styles | 3 or 4 | Many one-off buttons |

Consolidate by mapping each stray value to the nearest token, then check the screens that change. Do not silently replace approved brand colors during cleanup.

## Fluid values

Use `clamp()` with rem bounds for type and spacing that should scale with the viewport, and test at 200% zoom and at the narrowest width. Never size text in viewport units alone; it defeats zoom.

```css
:root {
  --text-display: clamp(2rem, 1.4rem + 2.6vw, 3.25rem);
  --section-gap: clamp(3rem, 2rem + 4vw, 6rem);
}
```
