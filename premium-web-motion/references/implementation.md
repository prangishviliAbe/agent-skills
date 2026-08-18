# Implementation patterns

Read when writing or reviewing motion code. Adapt names to the project's token scheme rather than introducing a competing system.

## Motion contract

```css
:root {
  --motion-instant: 120ms;
  --motion-fast:    180ms;
  --motion-base:    260ms;
  --motion-slow:    420ms;
  --motion-story:   720ms;

  --ease-out:        cubic-bezier(.2, .8, .2, 1);
  --ease-emphasized: cubic-bezier(.16, 1, .3, 1);
  --ease-in:         cubic-bezier(.4, 0, 1, 1);

  --motion-travel-sm: 8px;
  --motion-travel-md: 16px;
  --motion-stagger:   60ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-instant: 1ms;
    --motion-fast:    1ms;
    --motion-base:    1ms;
    --motion-slow:    1ms;
    --motion-story:   1ms;
    --motion-travel-sm: 0px;
    --motion-travel-md: 0px;
    --motion-stagger:   0ms;
  }
}
```

Scope any additional reduced-motion overrides to your own classes. Never apply a global `*` override — it breaks third-party widgets and transitions that carry meaning.

## Microinteraction

Name the properties. `transition: all` animates things you did not intend, including layout.

```css
.button {
  transition:
    transform       var(--motion-instant) var(--ease-out),
    background-color var(--motion-fast)    linear,
    box-shadow      var(--motion-fast)     var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .button:hover { transform: translateY(-1px); }
}

.button:active { transform: scale(.98); }

/* focus appears instantly — never animate a focus ring in */
.button:focus-visible {
  outline: 2px solid var(--color-focus, CanvasText);
  outline-offset: 2px;
  transition: none;
}
```

## Progressive in-view reveal

The content is visible by default. The hidden state is applied only once the observer is confirmed running, so a script failure never hides content.

```css
[data-motion-ready] .reveal {
  opacity: 0;
  transform: translateY(var(--motion-travel-md));
  transition:
    opacity   var(--motion-slow) var(--ease-emphasized),
    transform var(--motion-slow) var(--ease-emphasized);
}

[data-motion-ready] .reveal.is-visible {
  opacity: 1;
  transform: none;
}
```

```js
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = document.querySelectorAll('.reveal');

if (!reduced && 'IntersectionObserver' in window && items.length) {
  document.documentElement.dataset.motionReady = '';

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${Math.min(i, 4) * 60}ms`;
      entry.target.classList.add('is-visible');
      self.unobserve(entry.target);          // release after firing
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  items.forEach((item) => observer.observe(item));
}
```

Never apply `.reveal` to the LCP element.

## Accordion without animating height

`height: auto` does not animate. Animate the grid row fraction instead — no measurement, no JavaScript.

```css
.disclosure {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--motion-base) var(--ease-emphasized);
}
.disclosure[data-open='true'] { grid-template-rows: 1fr; }
.disclosure > .disclosure__inner { overflow: hidden; }
```

The semantic state changes immediately on the trigger (`aria-expanded`), independent of the transition.

## Web Animations API

Dependency-free imperative control, with a real handle for interruption.

```js
const animations = new WeakMap();

export function slideIn(el, { distance = 16, duration = 260 } = {}) {
  animations.get(el)?.cancel();               // interrupt, never queue

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animation = el.animate(
    [
      { opacity: 0, transform: `translateY(${reduced ? 0 : distance}px)` },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    {
      duration: reduced ? 1 : duration,
      easing: 'cubic-bezier(.16, 1, .3, 1)',
      fill: 'both',
    }
  );

  animations.set(el, animation);
  return animation.finished.catch(() => {});  // a cancelled animation rejects
}
```

## FLIP for reorder

Measure first, invert, then play. This is how a list item appears to travel instead of teleporting.

```js
export function flip(elements, mutate) {
  const first = new Map();
  elements.forEach((el) => first.set(el, el.getBoundingClientRect()));

  mutate();                                    // all DOM writes happen here

  elements.forEach((el) => {
    const last = el.getBoundingClientRect();
    const prev = first.get(el);
    const dx = prev.left - last.left;
    const dy = prev.top - last.top;
    if (!dx && !dy) return;

    el.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
      { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
  });
}
```

All reads happen before any write. Interleaving them forces a layout per element.

## View Transitions

```js
function navigate(update) {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();                                  // fallback: instant, still correct
    return;
  }
  document.startViewTransition(update);
}
```

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: var(--motion-base);
  animation-timing-function: var(--ease-emphasized);
}

/* shared element: same name in both views, and only one element per name at a time */
.product-image { view-transition-name: product-hero; }
```

Assign a `view-transition-name` to exactly one element at a time. Two elements sharing a name in the same document aborts the transition.

## React with Motion

Keep the client boundary small: animate a leaf, not the route.

```tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';

export function Reveal({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

For exit animations, the element must stay mounted until the animation finishes — wrap it in the library's presence component and key it by identity. For layout animations, keep the animated subtree small: layout animation measures, and measuring a large tree every frame is expensive.

## Scroll-driven CSS

Where supported, this runs off the main thread and needs no JavaScript.

```css
@supports (animation-timeline: view()) {
  .parallax-media {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 40%;
  }

  @keyframes rise {
    from { transform: translateY(24px); }
    to   { transform: translateY(0); }
  }
}

@media (prefers-reduced-motion: reduce) {
  .parallax-media { animation: none; transform: none; }
}
```

Wrap it in `@supports` and make the un-animated state the correct one, so unsupported browsers get a static, complete layout.

## Cleanup in a component

```tsx
useEffect(() => {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(handler);
  const onScroll = () => { /* rAF-scheduled work */ };

  window.addEventListener('scroll', onScroll, { passive: true });
  mq.addEventListener('change', onPreferenceChange);

  return () => {
    observer.disconnect();
    window.removeEventListener('scroll', onScroll);
    mq.removeEventListener('change', onPreferenceChange);
    cancelAnimationFrame(rafId.current);
  };
}, []);
```

Every subscription created in an effect is released in its cleanup. This is the difference between a page that stays smooth after ten navigations and one that does not.
