# Motion performance and accessibility

Read when implementing anything nontrivial, and always before claiming that motion is smooth.

## The frame budget

At 60fps you have 16.7ms per frame; at 120fps, 8.3ms. The browser needs part of that, so treat 8–10ms as the working budget for your own work.

Property cost, cheapest first:

| Property | Pipeline stages | Verdict |
| --- | --- | --- |
| `transform`, `opacity` | composite only | Animate freely |
| `filter`, `backdrop-filter` | paint plus composite, GPU-heavy | Use sparingly, always measure |
| `box-shadow`, `border-radius`, `background-position` | repaint every frame | Avoid animating; fake shadow with an overlaid pseudo-element whose opacity animates |
| `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size` | full layout, every frame, for the whole subtree | Never animate |

Substitutions that keep the effect and drop the cost: animate `transform: scale()` instead of size; `transform: translate()` instead of position; an overlay's opacity instead of a shadow; `grid-template-rows: 0fr → 1fr` instead of height.

## Avoiding layout thrash

Reading a layout property (`offsetHeight`, `getBoundingClientRect`, `scrollTop`, `getComputedStyle`) after a style write forces a synchronous layout. In a loop, that is one forced layout per iteration.

**Batch reads, then writes.**

```js
// bad: read/write/read/write
items.forEach((el) => { const h = el.offsetHeight; el.style.height = `${h * 2}px`; });

// good: all reads, then all writes
const heights = items.map((el) => el.offsetHeight);
items.forEach((el, i) => { el.style.height = `${heights[i] * 2}px`; });
```

## will-change and compositing

- Apply `will-change` only to elements that are about to animate, and remove it afterwards. It costs memory per layer.
- Never put it on a broad selector. A page of promoted layers is slower than a page with none.
- Prefer letting the browser decide; add it only when profiling shows a promotion problem.

## Scroll work

- Never do layout reads inside a `scroll` handler. Use IntersectionObserver for visibility, and CSS scroll-driven animations for progress-bound effects where supported.
- If a scroll handler is unavoidable, mark it `{ passive: true }`, and do the work in a `requestAnimationFrame` callback with a dirty flag rather than on every event.
- Unobserve entries after they have fired once. An observer holding a thousand elements after the reveal is finished is a leak.

## Cleanup

Every one of these must be released on unmount, route change, or teardown: observers, event listeners, `requestAnimationFrame` handles, timeouts, media-query listeners, running Web Animations, and library timelines. A leak is invisible on the first page and obvious after the fifth navigation.

## Interruption

- Cancel or reverse a running animation when the state changes. Never queue a stale transition behind fresh user input.
- With the Web Animations API, keep the handle and call `cancel()` or `reverse()`. With CSS, change the class and let the transition retarget from the current computed value.
- Test by clicking rapidly, opening and closing repeatedly, and navigating mid-transition. Anything that ends in the wrong visual state is a bug, not a rough edge.

## Reduced motion

`prefers-reduced-motion` is a request from someone who may experience nausea, dizziness, or migraine from motion. Honor it as a designed alternative.

Remove: parallax, large translation, scale on entry, scroll-linked movement, autoplaying loops, spinning, bouncing, and staged sequences.

Keep: opacity changes, instant state changes, color feedback, and progress indicators. The interface must still explain itself.

```css
@media (prefers-reduced-motion: reduce) {
  .motion-reveal,
  .motion-card,
  .motion-sheet {
    transition-duration: 1ms;
    animation: none;
    transform: none;
  }
}
```

**Scope it to your own utilities.** A global `*, *::before, *::after { animation: none !important }` breaks third-party widgets, assistive interactions, and transitions that are load-bearing for comprehension.

In JavaScript, read it *and* subscribe to changes — users toggle it mid-session:

```js
const mq = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = mq.matches;
mq.addEventListener('change', (e) => { reduced = e.matches; });
```

## Motion and Core Web Vitals

- **LCP:** never animate the largest element in, and never hide it behind a reveal. A hero that fades in at 500ms has an LCP of at least 500ms.
- **CLS:** animating layout properties, injecting elements, or revealing content that pushes other content all produce shift. Reserve space up front.
- **INP:** a handler that starts a heavy animation delays the visual response to the input. Keep the handler small; let the animation run on the compositor.

## Verification

1. Profile in the browser's performance panel with 4–6× CPU throttling, on the actual interaction and the actual scroll path.
2. Look for: long tasks over 50ms, forced synchronous layouts, dropped frames, and layer explosions.
3. Check for layout shift during the animation, not only at load.
4. Navigate away and back five times; watch memory and listener counts.
5. Test on a real mid-range phone. A desktop with a discrete GPU proves nothing.
6. Run the reduced-motion, keyboard-only, and JavaScript-disabled passes.

Never report "smoother" without a before-and-after measurement from the same profile.

## Quick audit checklist

- [ ] Only `transform` and `opacity` in continuous or scroll-linked animations
- [ ] No `transition: all` anywhere
- [ ] No layout property animated
- [ ] Observers unobserved after firing, listeners removed on teardown
- [ ] `will-change` scoped and temporary
- [ ] Reduced-motion path scoped to owned components and actually tested
- [ ] LCP element not animated in
- [ ] Interruption tested with rapid input
- [ ] Profiled on a throttled or real low-end device
