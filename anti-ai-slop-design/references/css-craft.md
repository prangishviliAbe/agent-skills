# CSS Craft & Styling Recipes

Read when: You are writing CSS tokens, implementing specular borders, fine-tuning gradient masks, or setting up atmospheric canvas backgrounds.

---

## 1. Specular Highlight Gradient Border

Instead of a flat border, apply a gradient border mask that simulates light shining from the top:

```css
.specular-border {
  position: relative;
  background: oklch(0.18 0.02 260);
  border-radius: 16px;
}

.specular-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    180deg,
    oklch(1 0 0 / 0.2) 0%,
    oklch(1 0 0 / 0.05) 50%,
    oklch(1 0 0 / 0.01) 100%
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
```

---

## 2. Atmospheric Ambient Dark Canvas

Create depth without using generic purple circular blur blobs:

```css
.canvas-atmospheric {
  min-height: 100vh;
  background-color: oklch(0.12 0.015 260);
  background-image: 
    radial-gradient(ellipse 90% 60% at 50% 0%, oklch(0.24 0.04 260 / 0.4), transparent),
    linear-gradient(180deg, transparent 0%, oklch(0.10 0.01 260) 100%);
  color: oklch(0.96 0.005 260);
}
```
