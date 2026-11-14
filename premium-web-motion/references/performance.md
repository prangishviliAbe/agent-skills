# Performance

Read when: Animation stutters, input feels delayed, a device heats up, or before animating anything other than transform and opacity.

A smooth animation delivers every frame on time: about 16.7ms per frame at 60Hz, 8.3ms at 120Hz, including everything else the browser has to do. One dropped frame in a 150ms transition is visible. Performance is measured in a named scenario; it is never guaranteed by a choice of property.

## What each property costs

| Animated property | Browser work per frame | Guidance |
| --- | --- | --- |
| `transform`, `opacity` | Usually compositing only, off the main thread | Default choice |
| `filter` (small blur, brightness), `clip-path`, `backdrop-filter` | Compositing or paint, cost grows with area | Small elements only; measure. Avoid animating large blurs |
| `background-color`, `color`, `border-color`, `box-shadow` | Paint | Fine for small elements and short feedback; avoid on large areas and many elements at once |
| `width`, `height`, `top`, `left`, `margin`, `padding`, `grid-template-*`, `font-size` | Layout, then paint, for the element and often its neighbors | Avoid, or confine to one small subtree and measure |

"Usually" matters: an element with a huge area, a complex filter, or thousands of siblings can be slow even with transform. And the main thread still has to be free at the start of an animation for it to begin on time.

Substitutes for layout animation:

| Instead of animating | Use |
| --- | --- |
| `top`, `left` | `transform: translate()` |
| `width`, `height` of a box to reveal content | `clip-path` or a scale on a wrapper; or the grid-rows technique for one disclosure |
| A box-shadow growing on hover | A pseudo-element with the larger shadow, animating its `opacity` |
| Reordering by changing layout over time | FLIP: change layout instantly, animate the inverse transform |
| Scroll listener that writes styles | Scroll-driven animation timeline, or IntersectionObserver for discrete triggers |

## Common causes and fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Stutter at the start | Main thread busy (hydration, data processing, image decode) when the animation begins | Start after the heavy work, split the work, or make the transition compositor-only |
| Stutter throughout | Layout or paint properties animated; large painted area | Switch to transform and opacity; shrink the animated area |
| Jank when many items animate | Too many simultaneous animations or layers | Animate the container; limit stagger to a few items |
| Forced reflow warnings | Reading layout (`offsetWidth`, `getBoundingClientRect`) after writing styles, in a loop | Batch all reads, then all writes |
| Pointer-follow lag | Work on every pointer event | One update per animation frame; passive listeners |
| High memory, flicker on mobile | Too many or too-large composited layers; permanent `will-change` | Remove `will-change` except just before and during the animation |
| Idle CPU or battery drain | Loop or ticker running with nothing to animate, or while the tab is hidden | Stop at rest; pause on `visibilitychange`; use IntersectionObserver to pause off-screen loops |
| Slow interaction response | Animation or handler blocks input | Keep handlers short; yield; never await an animation before acting |
| Blurry text | Text on a fractional or scaled layer | End on whole pixels; animate a wrapper; avoid scaling text |
| Scroll jank | Non-passive wheel or touch listeners; scroll-linked JavaScript | Passive listeners; native scroll; CSS scroll timelines |

## Read, then write

```javascript
// Wrong: read and write interleaved, one forced layout per item
for (const item of items) {
  const top = item.getBoundingClientRect().top;
  item.style.transform = `translateY(${top * 0.1}px)`;
}

// Right: all reads, then all writes, one layout
const tops = items.map(item => item.getBoundingClientRect().top);
items.forEach((item, index) => {
  item.style.transform = `translateY(${tops[index] * 0.1}px)`;
});
```

For per-frame work, schedule a single `requestAnimationFrame`, read at its start, write after, and compute from elapsed time, not from frame count, so speed is the same at 60Hz and 120Hz.

```javascript
export function createLoop(step) {
  let frame = 0, last = 0;
  const tick = now => {
    const delta = Math.min(now - last, 64);   // clamp after a background pause
    last = now;
    if (step(delta) !== false) frame = requestAnimationFrame(tick);
    else frame = 0;
  };
  return {
    start() { if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); } },
    stop() { cancelAnimationFrame(frame); frame = 0; },
  };
}
```

`step` returns `false` when the motion has settled, which stops the loop. A loop that never stops is a bug.

## Layers and `will-change`

- The browser promotes an element to its own layer while it animates transform or opacity. That is normally enough.
- `will-change: transform` tells the browser to promote in advance. Use it only when a measured first-frame hitch exists, add it shortly before the animation, and remove it afterwards.
- Never set `will-change` on many elements or in a global rule. Each layer costs memory, and too many make everything slower.
- `contain: layout paint` or `content-visibility: auto` on independent regions limits how far layout and paint work spreads.

## Measuring

1. Reproduce on a realistic device, or with CPU throttling (4x to 6x) in dev tools. A fast development machine hides most problems.
2. Record the interaction in the Performance panel. Look for long tasks at the start, layout and paint work inside the animation, and dropped frames.
3. Turn on paint flashing and layer borders in the rendering tools to see what repaints and what is promoted.
4. Change one thing and record again under the same conditions.
5. For responsiveness, check the interaction's delay from input to next paint; animations must not push it up.

```text
Scenario:    Open filter drawer on product list (120 items)
Device:      Mid-range Android, Chrome; also desktop with 4x CPU throttle
Before:      Layout on every frame (animating width); 9 of 15 frames late
Change:      Drawer animates transform; list no longer resizes during the transition
After:       No layout during animation; 0 late frames in 5 runs
Not tested:  Safari on iOS
```

Report traces and conditions like this. Do not write "60fps", "120fps", or "GPU-accelerated" as a conclusion from reading CSS.

## Budget

| Guideline | Value |
| --- | --- |
| Simultaneously animating elements | A few; animate containers |
| Per-frame JavaScript | A small fraction of the frame; ideally none |
| Infinite animations on a page | Zero by default; spinners only while loading |
| Animated blur or backdrop-filter | Avoid; if required, small area and measured |
| Animation library weight | Justified by a requirement the platform cannot meet |
