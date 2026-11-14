# Color

Read when: Building or repairing a palette, neutrals, a dark theme, or color roles.

Generated palettes fail in two ways: the hue is the default (purple, indigo, neon on black), and color is spread everywhere without roles. Fix both. An approved brand color is a constraint; apply everything below around it.

## Where the palette comes from

Derive hues from the subject, then test them. Sources, strongest first:

1. The approved brand colors.
2. Real things in the subject's world: materials, products, place, uniforms, signage, documents.
3. The photography or product imagery the page will show; the palette must sit comfortably beside it.
4. Function: what must be noticed, what must recede, what states exist.

Do not start from a trend palette or a color-scheme generator. If two unrelated products could share the palette, it was not derived.

## Structure: neutrals, one accent, states

| Role | Share of the screen | Rule |
| --- | --- | --- |
| Neutrals: page, surfaces, text, borders | Most of it | Tinted slightly toward one hue so they belong to the palette |
| Accent | Small | One job: the primary action and the current or selected thing. Used rarely enough to stay loud |
| Second brand color | Rare, optional | Only with a defined role distinct from the accent |
| State colors: success, warning, danger, info | Only where the state occurs | Chosen to be distinguishable from the accent and from each other, never used as decoration |

If the accent appears in headings, icons, borders, backgrounds, and buttons all at once, it no longer marks anything. Count where it is used and remove the uses that are not its job.

## Building the tokens

Work in OKLCH so lightness steps are perceptually even and hue stays put as lightness changes. Keep sRGB fallbacks if the project's browsers need them. The values below show the mechanics with a warm neutral and a rust accent; they are an example, not a recommended palette.

```css
:root {
  color-scheme: light;
  /* Neutrals: same hue, very low chroma, lightness does the work */
  --page:          oklch(98.5% 0.004 80);
  --surface:       oklch(100% 0 0);
  --surface-sunk:  oklch(96.5% 0.005 80);
  --border:        oklch(90% 0.006 80);
  --border-strong: oklch(80% 0.008 80);
  --text:          oklch(22% 0.012 80);
  --text-muted:    oklch(46% 0.012 80);
  --text-faint:    oklch(58% 0.010 80);   /* large or non-essential text only */

  /* Accent: one hue, a few lightness steps with stated jobs */
  --accent:        oklch(50% 0.16 35);    /* fills, links */
  --accent-hover:  oklch(44% 0.15 35);
  --accent-soft:   oklch(95% 0.03 35);    /* selected-row background */
  --on-accent:     oklch(99% 0.005 80);

  /* States */
  --danger:        oklch(50% 0.19 25);
  --warning:       oklch(72% 0.15 75);
  --success:       oklch(50% 0.12 150);
  --focus:         oklch(50% 0.20 255);
}
```

Method:

1. Fix the neutral hue (the brand hue or its warm or cool neighbor) and keep chroma between about 0.003 and 0.02. More than that reads as a colored background rather than a neutral.
2. Set text and page lightness first and check contrast. Then place surfaces and borders between them.
3. Give the accent a fill lightness that carries white or near-white text at 4.5:1, a darker hover, and a very light tint for selection backgrounds.
4. Name every token by role. A token called `purple-500` invites use anywhere; `--accent` does not.
5. Pure black and pure white are allowed when deliberate. As defaults they look harsh next to tinted neutrals, so decide rather than inherit.

## Contrast

| Pair | Minimum |
| --- | --- |
| Body text on its background | 4.5:1 |
| Large text (about 24px regular or 19px bold and up) | 3:1 |
| Control boundaries, icons that carry meaning, focus indicators | 3:1 against adjacent colors |
| Placeholder and disabled text | Exempt in the standard, but must still be legible enough to read |

Measure the actual rendered pair, including text over tints, images, and hover states. OKLCH lightness differences suggest contrast but do not prove it; use a contrast checker. Text over photographs needs a solid or strongly scrimmed area, checked at the worst part of the image.

## Dark theme

A dark theme is a second design, not an inversion.

```css
[data-theme="dark"] {
  color-scheme: dark;
  --page:          oklch(17% 0.008 80);
  --surface:       oklch(21% 0.009 80);   /* raised surfaces get lighter, not darker */
  --surface-sunk:  oklch(14% 0.008 80);
  --border:        oklch(29% 0.010 80);
  --border-strong: oklch(40% 0.012 80);
  --text:          oklch(93% 0.006 80);
  --text-muted:    oklch(72% 0.010 80);
  --accent:        oklch(72% 0.13 35);    /* lighter and less saturated than in light */
  --accent-hover:  oklch(78% 0.12 35);
  --accent-soft:   oklch(28% 0.04 35);
  --on-accent:     oklch(18% 0.02 35);
}
```

- Elevation is expressed by lighter surfaces; shadows barely show on dark backgrounds.
- Reduce accent chroma and raise its lightness; saturated color vibrates on dark.
- Avoid pure black pages with pure white text for long reading; the contrast is fatiguing and smears on some displays.
- Recheck every state color and every image. Logos and illustrations made for light backgrounds need dark variants.
- No glow. A dark theme does not need neon to feel finished.

## Using color in the layout

- Start in grayscale. If hierarchy does not work without color, color will not rescue it.
- Large colored areas: one per view at most, and it must have a reason (the lead section, a key figure). A page of alternating tinted bands has no emphasis.
- Borders and dividers are neutral. Coloring them with the accent turns structure into decoration.
- Charts and data need their own considered scale: ordered data gets one hue in lightness steps, categories get a few distinguishable hues, and every series has a label, not only a legend swatch.
- Never signal state by color alone. Pair with an icon, text, or position.
- Tints for backgrounds come from the token set (`--accent-soft`), not from lowering opacity on the fly, which gives unpredictable contrast over different surfaces.

## Gradients

Flat color is the default. A gradient is acceptable when all of these hold: it has a physical or brand reason (light falling across a surface, an approved brand gradient), it stays within one hue family or between close neighbors, it appears in one place, and text on it passes contrast at both ends. Never on text. Never as the fill for buttons, icons, and cards at once.

## Diagnosis

| Symptom | Cause | Fix |
| --- | --- | --- |
| Looks like a starter kit | Framework default palette | Define the project's own neutral hue and accent |
| Looks generated | Purple or blue-violet with gradients and glow | Derive the accent from the subject; flat fills; no glow |
| Lifeless | Untinted grays, accent too timid | Tint neutrals; give the accent one confident use |
| Noisy | Too many hues, tints behind every card | One accent, neutral surfaces, remove category tints |
| Muddy | Gray text on color, low-chroma accent on gray | Use shades of the background hue for text on color |
| Washed out | Low text contrast | Darken text, check 4.5:1 |
| Dark mode looks cheap | Inverted light theme, pure black, neon | Rebuild with tinted dark neutrals and a calmer accent |
