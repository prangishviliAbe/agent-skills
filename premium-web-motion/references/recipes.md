# Recipes: effects with their reduced-motion paths

Read when you need a concrete, adaptable implementation. Every recipe renders correct content without motion, keeps state authoritative, and has a reduced-motion version. Adapt tokens to the project, and check support for the browsers you target (notes in each recipe).

## Motion tokens and a spring easing

```css
:root {
  --motion-feedback: 140ms;
  --motion-state: 220ms;
  --motion-layer: 320ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  /* Damped spring (zeta 0.7, about 4.5% overshoot), sampled for linear(). Baseline since 2023. */
  --ease-spring: linear(0, 0.071, 0.231, 0.42, 0.601, 0.753, 0.871, 0.953, 1.005, 1.033, 1.045, 1.045, 1.04, 1.032, 1.023, 1.015, 1.009, 1.004, 1.001, 0.999, 0.998, 0.998, 0.998, 0.998, 1);
}
@media (prefers-reduced-motion: reduce) {
  :root { --motion-feedback: 0ms; --motion-state: 0ms; --motion-layer: 0ms; }
}
```

Zeroing durations removes delay but not meaning; still remove travel in the components themselves.

## Dialog enter and exit with native elements

`@starting-style` and `transition-behavior: allow-discrete` (Baseline 2024) let a closed `dialog` animate in and out without script. Browsers without the `overlay` transition still close correctly, just without the exit animation.

```css
dialog {
  opacity: 0;
  translate: 0 8px;
  transition:
    opacity var(--motion-layer) var(--ease-out),
    translate var(--motion-layer) var(--ease-out),
    overlay var(--motion-layer) allow-discrete,
    display var(--motion-layer) allow-discrete;
}
dialog[open] { opacity: 1; translate: 0 0; }
@starting-style { dialog[open] { opacity: 0; translate: 0 8px; } }

dialog::backdrop {
  background: rgb(0 0 0 / 0);
  transition: background var(--motion-layer) var(--ease-out), overlay var(--motion-layer) allow-discrete, display var(--motion-layer) allow-discrete;
}
dialog[open]::backdrop { background: rgb(0 0 0 / 0.45); }
@starting-style { dialog[open]::backdrop { background: rgb(0 0 0 / 0); } }

@media (prefers-reduced-motion: reduce) {
  dialog { translate: 0 0; }
}
```

Use `showModal()` and `close()`; focus handling, Escape, and the inert background come from the element. Return focus to the trigger on close.

## Staggered entrance with a capped total delay

```css
.stagger > * {
  animation: rise var(--motion-state) var(--ease-out) both;
  animation-delay: calc(min(var(--i, 0), 8) * 40ms); /* the 9th item and later share one delay: total wait stays about 320ms */
}
@keyframes rise { from { opacity: 0; translate: 0 12px; } }
@media (prefers-reduced-motion: reduce) { .stagger > * { animation: none; } }
```

Set `--i` per item (`style="--i: 3"`). With `animation-fill-mode: both` the items start hidden, so apply the class from script only after the content is mounted, or accept the animation as an enhancement for non-critical content; never for the likely LCP element or primary text.

## Accordion height without script

Animating `grid-template-rows` from `0fr` to `1fr` works in current browsers and is layout work, so keep it to small panels. A `min-height: 0` clipped child is required. Chromium also supports `interpolate-size: allow-keywords` (other engines did not at the time of writing; verify), which animates to `height: auto` directly.

```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--motion-state) var(--ease-out); }
.panel[data-open="true"] { grid-template-rows: 1fr; }
.panel > .panel-inner { overflow: hidden; min-height: 0; }
@media (prefers-reduced-motion: reduce) { .panel { transition: none; } }
```

Collapsed visual geometry is not semantic hiding: also set `hidden` or `inert` on the collapsed content, move focus out before collapsing a focused region, and keep the trigger's `aria-expanded` in sync. For simple disclosure, native `details` needs no animation at all.

## View transitions with feature detection and fallback

Same-document view transitions are supported across current major browsers (Firefox joined in 2025); cross-document support is narrower, so verify. The router or state manager stays authoritative; the transition only wraps an accepted update.

```js
export function transitionTo(update) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduced) return Promise.resolve(update());
  const transition = document.startViewTransition(() => update());
  return transition.updateCallbackDone; // rejects only if the update itself failed
}
```

Give a shared element `view-transition-name: product-123` (unique per captured state) in both states. `skipTransition()` skips the animation, not the update. Do not re-run an update that may have partially committed. Preserve the router's scroll restoration and focus handling.

## Count-up number that is correct without motion

Put the final value in the HTML, and animate only a visual copy for users who have not reduced motion:

```js
export function countUp(element, { duration = 900 } = {}) {
  const final = Number(element.dataset.value);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !Number.isFinite(final)) return;
  const start = performance.now();
  const format = new Intl.NumberFormat(document.documentElement.lang || undefined);
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = format.format(Math.round(final * (1 - (1 - progress) ** 3)));
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

Run it once when the element first becomes visible, announce only the final value to assistive technology (`aria-live` off, text already final in the DOM or set `aria-label`), and never animate a number that implies a metric you cannot support.

## Marquee or ticker with a pause control

Automatically moving content that lasts more than five seconds needs a way to pause, stop, or hide it (WCAG 2.2.2, Level A). Provide a real button, pause on focus and hover, and render static content under reduced motion:

```css
.ticker-track { display: flex; gap: 2rem; width: max-content; animation: scroll-x 30s linear infinite; }
.ticker[data-paused="true"] .ticker-track, .ticker:hover .ticker-track, .ticker:focus-within .ticker-track { animation-play-state: paused; }
@keyframes scroll-x { to { translate: -50% 0; } }
@media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; flex-wrap: wrap; width: auto; } }
```

## Loading: skeleton to content

Match skeleton geometry to the likely content to avoid layout shift, crossfade when real content arrives, and drop shimmer under reduced motion (a static placeholder plus a visible "Loading" label remains).

```css
.skeleton { background: var(--skeleton-base, #e5e7eb); border-radius: 0.5rem; animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
```
