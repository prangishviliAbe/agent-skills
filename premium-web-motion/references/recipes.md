# Purposeful motion recipes

Read when: Selecting or implementing a particular interaction effect.

## Recipe selection

| Request | Approach | Required fallback / limit |
| --- | --- | --- |
| Open a detail view | Short reveal or shared-element transition | Native focus/navigation still works without animation |
| Reorder objects | Transform-based FLIP or existing layout engine | DOM order and focus remain authoritative |
| Drag to dismiss | Direct tracking plus threshold/velocity decision | Visible close button; keyboard equivalent; pointercancel |
| Explain reading progress | Native scroll timeline when supported | Content remains fully usable without the timeline |
| Brand-specific interactive object | Optional bounded tilt or pointer effect when explicitly requested | Fine-pointer only, reduced motion, stable hit target, disposal |
| Text reveal | Prefer whole-text opacity if movement is useful | Accessible text stays stable; no essential scrambled labels |
| Decorative card beam / particles / pulsing dots | Do not propose | Remove from ordinary UI; no replacement ornament |

A motion recipe must describe initialization, allowed inputs, maximum movement, cancellation, reduced motion, and cleanup. An effect copied without lifecycle ownership is incomplete.

## Shared transition enhancement

```javascript partial
export function changeView(update) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof document.startViewTransition !== 'function') {
    return Promise.resolve().then(update);
  }
  const transition = document.startViewTransition(update);
  return transition.updateCallbackDone;
}
```

Handle rejection at the caller and preserve the underlying navigation/action. Do not call update again merely because the visual animation failed; that can duplicate a mutation. Keep view-transition names unique among participating rendered elements.

## Pointer effect lifecycle contract

```text
Activate only: Fine pointer, hover available, reduced motion off.
Read: Stable wrapper bounds, batched before writes.
Write: Visual child transform; keep the actual target stable.
Frames: One scheduled frame; use elapsed time, stop when settled.
Cancel: Pointer leave/cancel, visibility loss, preference change, unmount.
Dispose: Remove listeners/observers, cancel frame/tween, reset owned styles.
```

Avoid moving the measured target itself: feedback between its bounds and the pointer can create drift. Do not reveal meaningful content only on hover.
