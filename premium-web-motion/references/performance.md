# 120fps Motion Performance & Compositor Architecture

Read when: You are optimizing animations for 120fps displays, eliminating layout thrashing, managing GPU layer promotion, or debugging dropped frames.

---

## 1. The Rendering Pipeline & Compositor Rules

The browser rendering engine consists of three phases:
$$\text{Layout (Reflow)} \longrightarrow \text{Paint (Raster)} \longrightarrow \text{Composite}$$

- **Properties that trigger Layout:** `width`, `height`, `margin`, `padding`, `top`, `left`, `bottom`, `right`, `font-size`, `grid-template-columns`. **Never animate these.**
- **Properties that trigger Paint:** `background-color`, `border-color`, `box-shadow`, `color`.
- **Properties that run solely on the GPU Compositor:** `transform` and `opacity`. **Always animate these.**

---

## 2. Dynamic `will-change` Lifecycle

Setting `will-change: transform` permanently on hundreds of DOM nodes exhausts GPU video memory (VRAM). Promote elements only immediately before interaction and release them afterwards:

```javascript partial
// Efficient will-change management
export function prepareElementForMotion(element) {
  element.addEventListener('pointerenter', () => {
    element.style.willChange = 'transform, opacity';
  }, { passive: true });

  element.addEventListener('transitionend', () => {
    element.style.willChange = 'auto';
  });
}
```

---

## 3. Eliminating Layout Thrashing

Never interleave DOM reads (`getBoundingClientRect`, `offsetWidth`) with DOM writes (`style.transform = ...`):

```javascript partial
// BAD: Causes synchronous layout thrashing (jank)
cards.forEach(card => {
  const top = card.getBoundingClientRect().top; // Read
  card.style.transform = `translateY(${top * 0.1}px)`; // Write
});

// GOOD: Batch reads before writes
const tops = cards.map(card => card.getBoundingClientRect().top); // Read phase
cards.forEach((card, i) => {
  card.style.transform = `translateY(${tops[i] * 0.1}px)`; // Write phase
});
```

---

## 4. Reduced-Motion Graceful Degradation

Always respect user vestibular preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
