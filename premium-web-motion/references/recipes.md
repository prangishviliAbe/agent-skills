# Recipes

Read when: Implementing a specific interaction: press feedback, menu, dialog, accordion, toast, list reorder, page or view transition, scroll-linked effect, drag, or loading state.

Each recipe states purpose, values, interruption behavior, and reduced-motion variant. Tokens (`--dur-*`, `--ease-*`) are the ones defined in the motion system. Check browser support for the newer CSS features against the project's targets; every recipe below degrades to an instant, working state change when a feature is missing.

## Press and hover feedback

Purpose: confirm that the control received the input.

```css
.button {
  transition:
    background-color var(--dur-fast) var(--ease-out),
    transform var(--dur-instant) var(--ease-out);
}
@media (hover: hover) {
  .button:hover { background-color: var(--accent-hover); }
}
.button:active { transform: scale(0.98); }

@media (prefers-reduced-motion: reduce) {
  .button { transition: background-color var(--dur-fast) linear; }
  .button:active { transform: none; }
}
```

Name the properties; never `transition: all`. Hover styles sit behind `(hover: hover)` so touch devices do not get stuck hover states. No lift, glow, or scale-up on hover.

## Menu or popover

Purpose: show that the surface belongs to its trigger.

```css
.menu {
  transform-origin: top left;               /* the corner nearest the trigger */
  opacity: 0;
  transform: scale(0.97);
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out),
    overlay var(--dur-fast) allow-discrete,
    display var(--dur-fast) allow-discrete;
}
.menu:popover-open {
  opacity: 1;
  transform: none;
}
@starting-style {
  .menu:popover-open { opacity: 0; transform: scale(0.97); }
}
@media (prefers-reduced-motion: reduce) {
  .menu, .menu:popover-open { transform: none; }
}
```

This uses the native `popover` attribute, which supplies light dismiss, Escape, and top-layer placement. `@starting-style` and discrete transitions of `display` and `overlay` are progressive: without them the menu simply appears. Keyboard-opened menus should feel instant; keep this at the fast token.

## Modal dialog

Purpose: mark a focused interruption and its dismissal.

```css
dialog {
  opacity: 0;
  transform: translateY(var(--shift-m)) scale(0.98);
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out),
    overlay var(--dur-base) allow-discrete,
    display var(--dur-base) allow-discrete;
}
dialog[open] {
  opacity: 1;
  transform: none;
}
@starting-style {
  dialog[open] { opacity: 0; transform: translateY(var(--shift-m)) scale(0.98); }
}
dialog::backdrop {
  background-color: rgb(0 0 0 / 0);
  transition:
    background-color var(--dur-base) linear,
    overlay var(--dur-base) allow-discrete,
    display var(--dur-base) allow-discrete;
}
dialog[open]::backdrop { background-color: rgb(0 0 0 / 0.4); }
@starting-style {
  dialog[open]::backdrop { background-color: rgb(0 0 0 / 0); }
}
@media (prefers-reduced-motion: reduce) {
  dialog, dialog[open] { transform: none; }
}
```

Open with `showModal()` and close with `close()`. The browser handles focus containment, Escape, inert background, and focus return. Because the exit is a CSS transition on the element's own state, reopening during the exit simply reverses it; there is no timer to go stale. Do not add a backdrop blur.

## Accordion or disclosure

Purpose: show that content expands from its heading, without animating `height` to an unknown value.

```css
.panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur-base) var(--ease-in-out);
}
.panel[data-open="true"] { grid-template-rows: 1fr; }
.panel > .panel-inner {
  min-block-size: 0;
  overflow: hidden;
  visibility: hidden;
  transition: visibility 0s var(--dur-base);
}
.panel[data-open="true"] > .panel-inner {
  visibility: visible;
  transition-delay: 0s;
}
@media (prefers-reduced-motion: reduce) {
  .panel, .panel > .panel-inner { transition: none; }
}
```

The trigger is a `button` with `aria-expanded` and `aria-controls`. The `visibility` switch removes collapsed content from the tab order and from assistive technology. This animates layout, which is acceptable for a single panel; do not run many at once on a heavy page without measuring. Where supported, `interpolate-size: allow-keywords` lets `height: auto` transition directly.

## Toast

Purpose: announce a result without stealing focus.

```css
.toast {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}
.toast[data-state="closed"] {
  opacity: 0;
  transform: translateY(var(--shift-l));
  transition-duration: 150ms;
  transition-timing-function: var(--ease-in);
}
@starting-style {
  .toast { opacity: 0; transform: translateY(var(--shift-l)); }
}
@media (prefers-reduced-motion: reduce) {
  .toast, .toast[data-state="closed"] { transform: none; }
}
```

Enters from the edge it is anchored to. Pause its dismiss timer on hover and focus. When several stack, move the existing ones with a transform transition instead of letting them jump. The container is a `role="status"` region that exists before the first toast is inserted.

## Reorder, insert, and remove (FLIP)

Purpose: let the eye follow items to their new positions.

```javascript
export function flip(elements, mutate, { duration = 220, easing = 'cubic-bezier(0.4, 0, 0.2, 1)' } = {}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const first = new Map(elements.map(el => [el, el.getBoundingClientRect()]));
  mutate();                                   // change the DOM or layout
  if (reduce) return;
  for (const el of elements) {
    if (!el.isConnected) continue;
    const from = first.get(el);
    const to = el.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    el.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
      { duration, easing }
    );
  }
}
```

All measurements happen before any write, so there is one layout pass. Calling it again mid-animation works: the first measurement includes the in-flight transform, so items continue from where they visibly are. DOM order stays the source of truth for focus and reading order. If the project already uses a library with layout animation, use that instead of adding this.

## View transition between states or pages

Purpose: continuity between two views, with one element optionally carried across.

```javascript
export function changeView(update) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof document.startViewTransition !== 'function') {
    return Promise.resolve().then(update);
  }
  return document.startViewTransition(update).updateCallbackDone;
}
```

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: var(--dur-base);
  animation-timing-function: var(--ease-in-out);
}
.product-image[data-active="true"] { view-transition-name: product-image; }
```

`update` performs the actual DOM change and is never called twice: an animation failure must not repeat a mutation. Each `view-transition-name` must be unique among rendered elements at the moment of capture, so assign it only to the element involved. The page is not interactive during the transition, which is one more reason to keep it short. Cross-document transitions, where the project's browsers support them, are enabled in CSS with `@view-transition { navigation: auto; }`.

## Scroll-linked progress

Purpose: show reading position. This is the main legitimate scroll-linked effect; parallax and scroll-triggered entrances are not.

```css
.reading-progress {
  position: fixed;
  inset: 0 0 auto 0;
  block-size: 3px;
  background: var(--accent);
  transform-origin: 0 50%;
  transform: scaleX(0);
}
@supports (animation-timeline: scroll()) {
  .reading-progress {
    animation: reading-progress linear both;
    animation-timeline: scroll(root block);
  }
}
@keyframes reading-progress {
  to { transform: scaleX(1); }
}
```

Runs off the main thread where supported and is simply absent elsewhere. `animation-timeline` must be declared after the `animation` shorthand, which resets it. Do not replace it with a scroll event listener that writes styles every frame unless the indicator is essential.

## Drag to dismiss

Purpose: direct manipulation of a sheet or card. The surface tracks the pointer exactly, then settles according to distance and velocity.

```javascript partial
function enableDragDismiss(sheet, { onDismiss }) {
  let startY = 0, lastY = 0, lastTime = 0, velocity = 0, dragging = false;

  const setOffset = y => { sheet.style.transform = `translateY(${Math.max(0, y)}px)`; };

  const settle = dismiss => {
    const from = sheet.style.transform || 'none';
    const to = dismiss ? 'translateY(100%)' : 'none';
    sheet.style.transform = dismiss ? to : '';
    const animation = sheet.animate([{ transform: from }, { transform: to }], {
      duration: 200, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
    });
    if (dismiss) animation.finished.then(onDismiss, () => {});
  };

  sheet.addEventListener('pointerdown', event => {
    if (!event.isPrimary) return;
    dragging = true;
    startY = lastY = event.clientY;
    lastTime = event.timeStamp;
    sheet.getAnimations().forEach(a => a.cancel());
    sheet.setPointerCapture(event.pointerId);
  });
  sheet.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dt = event.timeStamp - lastTime;
    if (dt > 0) velocity = (event.clientY - lastY) / dt;     // px per ms
    lastY = event.clientY;
    lastTime = event.timeStamp;
    setOffset(event.clientY - startY);
  });
  const end = event => {
    if (!dragging) return;
    dragging = false;
    const distance = event.clientY - startY;
    const cancelled = event.type === 'pointercancel';
    settle(!cancelled && (distance > sheet.offsetHeight * 0.4 || velocity > 0.5));
  };
  sheet.addEventListener('pointerup', end);
  sheet.addEventListener('pointercancel', end);
}
```

Requirements around it: `touch-action: none` on the drag handle only, so content still scrolls; a visible close button and Escape as non-gesture alternatives; no dismissal on `pointercancel`; with reduced motion, keep tracking (it is direct manipulation) but settle instantly. A spring from the project's animation library gives a better settle because it carries the release velocity.

## Loading

| Wait | Motion |
| --- | --- |
| Under about 300ms | None |
| Short, unknown length | Small spinner in the control or region, appearing after a short delay |
| Content region | Skeleton matching the final layout, cross-fading to content in about 150ms |
| Long, measurable | Determinate progress bar that only moves forward |

A skeleton does not need shimmer. If the brand wants it, keep the sweep slow and low-contrast, and stop it under reduced motion.

## Not recipes

| Request | Response |
| --- | --- |
| "Make sections animate in as you scroll" | Show content immediately. If one key figure benefits from a reveal, do that one, once, and keep it visible without JavaScript |
| "Add a hover effect to the cards" | If cards are links, a border or tone change. If they are not, none |
| "Animate the numbers counting up" | Show the number |
| "Add smooth scrolling" | Native scrolling; `scroll-behavior: smooth` for in-page anchors with a reduced-motion override |
| "Make the hero more dynamic" | Improve the content and composition; consider a single purposeful product demonstration that the user can pause |
| "Add a page loader animation" | Make the page fast; show real content or a skeleton |
