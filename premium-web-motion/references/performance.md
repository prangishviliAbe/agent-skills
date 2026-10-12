# Measured animation performance

Read when: Diagnosing jank, layout reads, layer use, dropped frames, or reduced-motion behavior.

Transform and opacity often avoid layout work, but compositing depends on the element, browser, effects, layer allocation, and surrounding content. Filters, clipping, gradients, and large surfaces can still be expensive.

| Symptom | Inspect | Change |
| --- | --- | --- |
| Layout thrash | Interleaved geometry reads and style writes | Batch reads, then writes |
| Pointer jank | Many events schedule overlapping work | Coalesce to one frame; keep work bounded |
| Memory pressure | Large or numerous promoted layers | Reduce surface size; use will-change only when justified |
| Idle CPU | Loops/tickers remain active after interaction | Stop at rest and dispose on unmount |
| Stale frame | Old callback writes after state reversal | Invalidate/cancel prior work |
| Reduced-motion failure | JS continues after CSS disables movement | Check preference in JS and handle changes |
| Hidden content on failure | Entrance sets initial opacity zero | Make usable content the baseline |

## Read then write

```javascript partial
const positions = items.map(item => item.getBoundingClientRect().top);
items.forEach((item, index) => {
  item.style.transform = `translateY(${positions[index] * 0.1}px)`;
});
```

This illustrates batching, not a complete animation. A transform write can affect future measurements; choose a stable measurement reference.

Use scoped reduced-motion overrides that show the final state and disable kinetic effects. A global 0.01ms animation reset can break event-driven logic and does not stop JavaScript loops. See [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

## Profiling record

```text
Browser/device:
Refresh rate and viewport:
Scenario and affected elements:
Trace conditions:
Observed frame/layout/paint behavior:
Change:
Recheck:
Remaining limits:
```

At 60Hz a frame is about 16.7ms; at 120Hz about 8.3ms. Account for all browser work. Report actual traces and conditions rather than claiming "GPU-only" or "120fps" from a CSS recipe.
