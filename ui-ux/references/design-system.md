# Design System & Token Architecture

Read when: You are establishing design tokens, standardizing colors in OKLCH, setting up fluid typography, configuring spacing scales, or architecting a cohesive component system.

---

## 1. The OKLCH Color Model

The sRGB hex system (`#3b82f6`) and HSL have severe perceptual uniformity flaws (e.g. pure yellow at 50% lightness appears blindingly brighter than pure blue at 50% lightness).

OKLCH fixes this: **Lightness (L)**, **Chroma (C)**, and **Hue (H)** are mathematically calibrated to human perception. Lightness `0.6` is equally bright across every hue.

```css
:root {
  /* Surface hierarchy: lightness steps */
  --color-canvas: oklch(0.12 0.015 250);
  --color-surface-subtle: oklch(0.16 0.02 250);
  --color-surface-card: oklch(0.20 0.025 250);
  --color-surface-elevated: oklch(0.25 0.03 250);
  --color-surface-popover: oklch(0.30 0.035 250);

  /* Primary Brand Accent in OKLCH (Vibrant Indigo-Violet) */
  --color-primary-50: oklch(0.96 0.03 265);
  --color-primary-100: oklch(0.90 0.07 265);
  --color-primary-200: oklch(0.80 0.12 265);
  --color-primary-500: oklch(0.62 0.23 265); /* Accessible base */
  --color-primary-600: oklch(0.54 0.24 265); /* Hover/active */
  --color-primary-900: oklch(0.25 0.10 265);

  /* Status Colors: Shared Lightness (0.64) ensures identical optical weight */
  --color-success: oklch(0.64 0.18 145); /* Emerald */
  --color-warning: oklch(0.68 0.17 65);  /* Amber */
  --color-danger: oklch(0.60 0.22 25);   /* Rose Crimson */
  --color-info: oklch(0.64 0.19 235);    /* Electric Cyan */

  /* Text hierarchy */
  --text-primary: oklch(0.98 0.005 250);
  --text-secondary: oklch(0.75 0.015 250);
  --text-tertiary: oklch(0.55 0.02 250);
  --text-muted: oklch(0.42 0.02 250);
}
```

---

## 2. Fluid Typography Scale (`clamp`)

Breakpoint-based font jumps feel jarring and require endless media query overrides. Fluid typography interpolates continuously between minimum (mobile: 360px) and maximum (desktop: 1440px) viewport widths.

$$\text{fontSize} = \text{clamp}(\text{minSize}, \text{intercept} + \text{slope} \times 100\text{vw}, \text{maxSize})$$

```css
:root {
  /* Fluid typographic tokens */
  --text-xs: clamp(0.7rem, 0.68rem + 0.1vw, 0.75rem);      /* 11px -> 12px */
  --text-sm: clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem); /* 13px -> 14px */
  --text-base: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem); /* 15px -> 17px */
  --text-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem);   /* 18px -> 20px */
  --text-xl: clamp(1.35rem, 1.22rem + 0.6vw, 1.625rem);    /* 21.6px -> 26px */
  --text-2xl: clamp(1.75rem, 1.5rem + 1.2vw, 2.25rem);     /* 28px -> 36px */
  --text-3xl: clamp(2.25rem, 1.85rem + 2.0vw, 3.25rem);    /* 36px -> 52px */
  --text-hero: clamp(2.85rem, 2.2rem + 3.2vw, 4.5rem);     /* 45.6px -> 72px */

  /* Optical Tracking & Leading */
  --leading-tight: 1.15;
  --leading-snug: 1.35;
  --leading-normal: 1.55;
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.04em;
}

h1, .hero-heading {
  font-size: var(--text-hero);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  font-weight: 700;
}

p, .body-text {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-normal);
  color: var(--text-secondary);
}
```

---

## 3. Spacing & Rhythm Hierarchy

Maintain rhythmic consistency across all containers with an 8pt-based exponential-proportional scale.

| Token | Size | Purpose |
| --- | --- | --- |
| `--space-1` | 4px | Micro padding, icon gaps, inline badge offsets. |
| `--space-2` | 8px | Button interior gaps, compact list item spacing. |
| `--space-3` | 12px | Input interior padding, card header sub-gap. |
| `--space-4` | 16px | Standard card interior padding, mobile container margins. |
| `--space-6` | 24px | Desktop card padding, bento item gutter. |
| `--space-8` | 32px | Section sub-group gap, modal dialog interior. |
| `--space-12`| 48px | Component cluster separation, medium section margin. |
| `--space-16`| 64px | Page section spacing, hero vertical padding. |

---

## 4. Component Token Contract

Every reusable component must expose and bind to standardized semantic slots.

```css
.ui-dialog {
  --dialog-bg: var(--color-surface-popover);
  --dialog-border: var(--border-subtle);
  --dialog-radius: 16px;
  --dialog-padding: var(--space-6);
  --dialog-shadow: 
    0 24px 64px -12px oklch(0 0 0 / 0.5),
    0 0 0 1px var(--dialog-border),
    inset 0 1px 0 oklch(1 0 0 / 0.15);

  background: var(--dialog-bg);
  border-radius: var(--dialog-radius);
  padding: var(--dialog-padding);
  box-shadow: var(--dialog-shadow);
  backdrop-filter: blur(24px);
}
```
