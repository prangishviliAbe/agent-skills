# Implementation patterns

Adapt these patterns to the existing application. Establish semantics and property ownership before copying animation code. Check browser targets and installed package versions.

## CSS feedback with explicit ownership

Here the button owns its transform. If a layout or gesture library also owns it, animate a separate visual child.

```css
.action {
  transition: background-color var(--motion-feedback, 140ms) linear;
}

.action:focus-visible {
  outline: 2px solid var(--color-focus, CanvasText);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: no-preference) {
  .action {
    transition:
      background-color var(--motion-feedback, 140ms) linear,
      transform var(--motion-feedback, 140ms) ease-out;
  }
  @media (hover: hover) and (pointer: fine) {
    .action:hover { transform: translateY(-1px); }
  }
  .action:active { transform: scale(.98); }
}
```

The reduced-motion path has no spatial movement or delayed focus ring. Supply the project's actual color, disabled, and keyboard activation states; this snippet only illustrates motion ownership.

## Visible-first viewport enhancement

Do not add a hidden class before an observer fires. The following optional effect animates an already visible, noncritical wrapper when it intersects. Without JavaScript, WAAPI, or the observer, it remains in its resting state. No fill mode persists beyond the effect.

```js
export function enhanceEntry(elements, { duration = 240, distance = 12 } = {}) {
  if (!("IntersectionObserver" in window) ||
      !("animate" in Element.prototype)) return () => {};

  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const running = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (preference.matches ||
          entry.target.contains(document.activeElement)) continue;

      const effect = entry.target.animate(
        [
          { transform: `translateY(${distance}px)` },
          { transform: "none" },
        ],
        { duration, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
      running.add(effect);
      effect.finished.then(
        () => running.delete(effect),
        () => running.delete(effect)
      );
    }
  }, { threshold: 0 });

  const settle = () => {
    if (!preference.matches) return;
    for (const effect of running) effect.cancel();
    running.clear();
  };

  preference.addEventListener("change", settle);
  for (const element of elements) observer.observe(element);

  return () => {
    observer.disconnect();
    preference.removeEventListener("change", settle);
    for (const effect of running) effect.cancel();
    running.clear();
  };
}
```

Use an otherwise untransformed wrapper; the keyframes temporarily own its transform. Select content deliberately rather than applying this to headings, primary media, navigation, or all page sections. The effect does not provide semantic disclosure or change visibility. Cancellation returns it to its complete static state.

The [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) describes threshold and root-margin behavior. Positive margins expand the detection region; negative margins shrink it. Observer callback order is not an appropriate stagger order.

## Interruption without restarting from zero

For decorative opacity only, sample the current rendered value before cancellation, store the latest target as the underlying style, then animate toward it. Cancelling an older effect cannot restore an obsolete target.

```js
export function createDecorationFade(element) {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let active = null;

  function settle() {
    active?.cancel();
    active = null;
  }

  function onPreferenceChange() {
    if (preference.matches) settle();
  }
  preference.addEventListener("change", onPreferenceChange);

  return {
    to(opacity, { duration = 180 } = {}) {
      const from = getComputedStyle(element).opacity;
      settle();
      element.style.opacity = String(opacity);

      if (preference.matches || !element.animate || duration === 0) {
        return Promise.resolve("finished");
      }

      const effect = element.animate(
        [{ opacity: from }, { opacity }],
        { duration, easing: "ease-out" }
      );
      active = effect;
      return effect.finished.then(
        () => {
          if (active === effect) active = null;
          return "finished";
        },
        (error) => {
          if (active === effect) active = null;
          if (error.name !== "AbortError") throw error;
          return "cancelled";
        }
      );
    },
    destroy() {
      preference.removeEventListener("change", onPreferenceChange);
      settle();
    },
  };
}
```

This controller owns the element's inline opacity; do not combine it with another opacity controller. It is not a dialog/disclosure manager: opacity zero alone leaves content interactive and exposed to assistive technology. Keep decorative layers out of the interaction/accessibility tree as appropriate.

Animation cancellation can reject the finished promise with AbortError; see [WAAPI cancellation](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel). Check returned status and the current operation identity before any completion-driven removal. A cancelled effect is not a completed user operation.

For controlled panels, maintain explicit desired state and visual phase. Set semantics and focus deliberately; only the latest operation may finalize an exit. If animation is skipped, complete the visual phase synchronously. Do not rely solely on transitionend: it may not fire when the property does not change, the effect is cancelled, or duration is zero.

## Intrinsic-size and disclosure choices

A native details/summary is often enough without animation. For custom expansion:
- A grid track can interpolate 0fr to 1fr, with a shrinkable clipped inner wrapper.
- A measured height needs remeasurement when contents change and cleanup of the explicit height at rest.
- Supporting browsers can interpolate a length and an intrinsic keyword with `interpolate-size: allow-keywords`.

Use feature detection and an immediate/static fallback for intrinsic-size enhancement. Do not assume arbitrary intrinsic-keyword pairs interpolate. Scope inherited opt-in to the intended component; see [intrinsic sizing guidance](https://developer.chrome.com/docs/css-ui/animate-to-height-auto).

All these size approaches can cause layout. Collapsed visual geometry is not semantic hiding: manage focus, inertness or hidden state, trigger relationships, and cancellation separately. Display-none content cannot perform an ordinary height exit while hidden. A native top-layer exit may need supported discrete transitions for display/overlay; verify the specific primitive.

## FLIP for reorder

FLIP means first layout, last layout, inverse transform, play. Use dedicated wrappers with stable identities and no competing transform owner.

1. Collect every starting visual rectangle before cancelling active reorder effects.
2. Cancel owned effects, then apply the accepted reorder/layout mutation.
3. Read every final layout rectangle into a second collection. Finish this entire read phase before starting any new animation.
4. Compute the inverse displacement and animate from it to the resting transform.
5. Under reduced motion, commit the final layout and skip the spatial effect.
6. Cancel and remeasure on a new reorder; release handles on teardown.

Measurements are coordinate-system dependent. Ancestor transforms, nested scrolling, size changes, and virtualization complicate a simple rectangle subtraction. Use the existing layout library when it already handles these cases. Do not publish a short translation snippet as a complete shared-layout engine.

## View Transitions integration

Keep the router or state manager authoritative:
1. Validate that the requested navigation/update is still current.
2. In unsupported or reduced-motion cases, run the normal update.
3. Otherwise, start the view transition around that accepted update.
4. Track the current transition. Skip obsolete visual effects, and independently abort or ignore stale data work.
5. Handle ready rejection (a visual transition can be skipped) separately from updateCallbackDone rejection (the update failed). Do not rerun a failed update automatically if it may have partially committed.
6. Ensure names are unique within both captured states, and preserve the router's history, focus, and scroll behavior.

[skipTransition](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/skipTransition) skips the animation, not the DOM update callback. It is not a request-cancellation mechanism. Do not run simultaneous update callbacks without sequencing/identity controls in the owner.

## React and Motion

Use the installed package/version and keep client boundaries narrow. Server output reflects Motion's initial state; `initial={{ opacity: 0 }}` can hide SSR content until hydration. For existing server-visible content, keep a complete initial render and enhance only after the client is ready, or animate later user-triggered changes.

```tsx
import { motion, useReducedMotion } from "motion/react";

export function SelectionMark({ selected }: { selected: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      initial={false}
      animate={{ opacity: selected ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.14 }}
      className="selection-mark"
    />
  );
}
```

The parent control must convey selection semantically and visually without requiring movement. This example is an ornamental mark, not a complete selectable control. Frameworks with server/client component separation require an appropriate client boundary for hooks.

The [Motion component reference](https://motion.dev/docs/react-motion-component) documents initial state and SSR. Presence-based exit must preserve stable identity and prevent removed content from retaining focus or stale actions. Library layout animation does not remove the need to profile measurement and rendering cost.

## Scroll-driven enhancement

Keep content complete without the effect. A decorative wrapper can opt into supported scroll timelines:

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .scroll-decoration {
      animation: settle-in linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 40%;
    }
    @keyframes settle-in {
      from { transform: translateY(16px); }
      to { transform: none; }
    }
  }
}
```

Declare animation-timeline after the animation shorthand, which resets it. Match the exact timeline/range syntax to target support. A scroll timeline does not make layout or paint-heavy properties free; compositor execution depends on the property and browser implementation. See [scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations).

## Lifecycle checklist

For each component, identify the owner of its observers, events, timers, animation handles, timelines, and animation frames. Cleanup must cancel only the work it owns, remove subscriptions, and leave valid state. Run setup/cleanup/setup during verification when the framework can remount effects in development.
