# Implementation patterns

Read this file when implementing or reviewing the motion layer. Adapt tokens to the project's naming scheme instead of creating a competing system.

## Motion contract

```css
:root {
  --motion-fast: 160ms;
  --motion-standard: 260ms;
  --motion-enter: 520ms;
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --ease-emphasized: cubic-bezier(.16, 1, .3, 1);
  --distance-xs: 8px;
  --distance-sm: 16px;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 1ms;
    --motion-standard: 1ms;
    --motion-enter: 1ms;
    --distance-xs: 0px;
    --distance-sm: 0px;
  }

  .motion-parallax,
  .motion-loop,
  .motion-scroll-story {
    animation: none;
    transform: none;
  }
}
```

## CSS microinteraction

Keep the resting state fully usable. Use a visible focus ring, respect input modality, and avoid `transition: all`.

```css
.button-primary {
  transition:
    transform var(--motion-fast) var(--ease-out),
    background-color var(--motion-fast) linear,
    box-shadow var(--motion-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .button-primary:hover { transform: translateY(-1px); }
}

.button-primary:active { transform: scale(.98); }
.button-primary:focus-visible {
  outline: 3px solid CanvasText;
  outline-offset: 3px;
}
```

## Progressive in-view reveal

Keep content visible before JavaScript enhances it. Add `data-motion-ready` only after the observer initializes; unobserve each item after entry.

```css
[data-motion-ready] .reveal {
  opacity: 0;
  transform: translateY(var(--distance-sm));
  transition:
    opacity var(--motion-enter) var(--ease-emphasized),
    transform var(--motion-enter) var(--ease-emphasized);
}

[data-motion-ready] .reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-motion-ready] .reveal { opacity: 1; transform: none; }
}
```

```js
const items = document.querySelectorAll('.reveal');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced && 'IntersectionObserver' in window) {
  document.documentElement.dataset.motionReady = '';
  const observer = new IntersectionObserver((entries, instance) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      instance.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10%', threshold: 0.1 });
  items.forEach((item) => observer.observe(item));
}
```

## React / Motion pattern

Use a shared variant contract, disable nonessential movement for reduced-motion users, and do not turn an entire route into a client component merely for animation.

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function Intro({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.52, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

## Performance review

- Profile a representative interaction and scroll path in browser performance tools; do not assume a smooth desktop is smooth on mobile.
- Verify animation does not cause layout shifts, long tasks, or repeated forced layout reads/writes.
- Keep observers, scroll handlers, and animation instances scoped and cleaned up. Throttle or avoid continuous JS scroll work.
- Do not promote every element with `will-change`; apply it briefly only to known, actively animating elements.
- Test loading, error, disabled, keyboard, and touch states, not only the happy-path hover demo.

## Lifecycle and interruption

- Cancel or replace in-flight animations when state changes; never queue stale transitions behind rapid user input.
- Clean up observers, timelines, event listeners, animation frames, and media-query listeners on unmount or route change.
- Avoid measuring layout and mutating styles repeatedly in the same frame. Batch reads before writes when measurement is unavoidable.
- Keep server-rendered content visible and deterministic. Add motion after hydration without changing the semantic reading order.
- For route or view transitions, preserve correct history, scroll restoration, focus placement, and a no-animation fallback.
