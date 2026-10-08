# Visual Craft & Typography Pairing

Read when: You are selecting typefaces, setting optical tracking, refining borders, and perfecting micro-details.

---

## 1. High-Taste Typography Pairings

Never rely on a single generic sans-serif font for both headings and body text. Master pairings create rich typographic dialogue:

| Style & Mood | Display / Heading Typeface | Body / Interface Typeface |
| --- | --- | --- |
| **Editorial Prestige** | *Instrument Serif*, *Fraunces*, *Playfair* | *Geist Sans*, *Inter*, *Plus Jakarta* |
| **High-Tech Engineering** | *Cabinet Grotesk*, *Space Grotesk* | *JetBrains Mono*, *Geist Mono* |
| **Contemporary Minimalist** | *Satoshi*, *General Sans* | *Inter*, *Newsreader* (for editorial notes) |
| **Bespoke Artisan** | *Clash Display*, *Syne* | *Satoshi*, *Switzer* |

---

## 2. Optical Kerning & Tracking Rules

Display headings and fine print require opposite letter-spacing adjustments:

- **Large Headings (> 32px):** Human eyes perceive large letters as having excessive whitespace between glyphs. Tighten tracking: `letter-spacing: -0.025em` to `-0.04em`.
- **Uppercase Eyebrows & Badges (< 12px):** Small capital letters cluster and become illegible without breathing room. Loosen tracking: `letter-spacing: 0.05em` to `0.08em` with `text-transform: uppercase`.
- **Tabular Numerals for Financial Data:** Ensure numbers do not wobble or jitter during live updates by enabling monospaced numeral glyphs: `font-variant-numeric: tabular-nums`.

```css
h1, .hero-display {
  font-family: var(--font-display);
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.eyebrow-tag {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: oklch(0.7 0.18 265);
}

.data-figure {
  font-variant-numeric: tabular-nums;
}
```
