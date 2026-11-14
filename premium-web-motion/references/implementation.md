# Implementation: state, interruption, presence, cleanup

Read when: Building or debugging animated components, especially ones that glitch when reversed, repeated, or unmounted.

Almost every animation bug is a state bug. The animation was treated as the source of truth, or a timer outlived the state that started it. Fix ownership first; timing second.

## Principles

| Principle | Meaning |
| --- | --- |
| State is authoritative | The application holds "open" or "closed". Animation renders the difference; it never decides the state |
| Retarget, do not restart | A change of mind mid-animation continues from the current visual value toward the new target |
| No timers as logic | `setTimeout(close, 300)` duplicates the duration and goes stale. Use the transition's own end event or the animation's promise, and check current state when it fires |
| One owner per element and property | Two systems animating the same property fight. Pick CSS or one library per property |
| Hidden means inert | An element that is invisible or exiting is not focusable or clickable |
| Everything created is destroyed | Animations, frames, observers, listeners, and pointer captures end with the component |

## Mechanisms and how they handle interruption

| Mechanism | On reversal mid-flight | Use for |
| --- | --- | --- |
| CSS transition | Reverses from the current value automatically | State-driven UI: hover, open and closed, selected. The default choice |
| CSS keyframe animation | Restarts or jumps unless carefully managed | One-shot or looping sequences that are never reversed |
| Web Animations API | Controllable: `reverse()`, `cancel()`, `playbackRate`, current time readable | Computed values (FLIP), sequencing, programmatic control without a library |
| Spring-based library | Retargets with velocity preserved | Gestures and layout animation |
| Timeline library | Reversible if the same timeline instance is reused | Authored multi-element sequences |

Prefer CSS transitions for anything with two or more stable states. They are interruption-safe with no code.

## Exit animations (presence)

Removing an element from the DOM cannot be animated after the fact, so exits need a strategy:

| Strategy | How | Caveat |
| --- | --- | --- |
| Keep mounted, toggle state | Element stays in the DOM; closed state is `visibility: hidden` or `display: none` via discrete transitions | Simplest; make sure the closed element is inert |
| Native top layer | `dialog` and `popover` with `@starting-style` and `allow-discrete` transitions | Check support; falls back to instant |
| Library presence | The project's library delays unmount until the exit completes (for example a presence wrapper in React) | Requires stable keys; exit must be cancellable by re-entry |
| Manual | On close, set an exiting state, wait for `transitionend` on the right element and property, then unmount if still closing | Easy to get wrong; guard every step with current state |

Manual pattern with the guard that prevents the "reopened dialog closes itself" bug:

```javascript
export function createPresence(element, { onExited }) {
  let state = 'closed';                      // 'open' | 'closing' | 'closed'

  const finish = event => {
    if (event.target !== element || event.propertyName !== 'opacity') return;
    if (state !== 'closing') return;         // reopened meanwhile: ignore
    state = 'closed';
    element.hidden = true;
    onExited?.();
  };
  element.addEventListener('transitionend', finish);
  element.addEventListener('transitioncancel', finish);

  return {
    open() {
      state = 'open';
      element.hidden = false;
      void element.offsetWidth;              // flush so the transition starts from the closed style
      element.dataset.state = 'open';
    },
    close() {
      if (state !== 'open') return;
      state = 'closing';
      element.dataset.state = 'closed';
      const duration = parseFloat(getComputedStyle(element).transitionDuration) || 0;
      if (duration === 0) finish({ target: element, propertyName: 'opacity' });
    },
    destroy() {
      element.removeEventListener('transitionend', finish);
      element.removeEventListener('transitioncancel', finish);
    },
  };
}
```

The zero-duration branch matters: with reduced motion or a missing transition, `transitionend` never fires, and code that waits for it leaves the element stuck. Never use a global rule that sets all durations to `0.01ms` and then depend on end events.

## Web Animations API essentials

```javascript
const animation = element.animate(
  [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
  { duration: 200, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
);
animation.finished.then(
  () => { /* completed */ },
  () => { /* cancelled: not an error */ }
);
// Later: animation.reverse(); animation.cancel();
```

- `finished` rejects when the animation is cancelled. Always supply a rejection handler or the console fills with unhandled rejections.
- Avoid `fill: 'forwards'` as a way to hold the end state; it keeps the animation alive and overrides later style changes. Set the final style on the element and let the animation play over it, as above.
- Cancel running animations on the same element and property before starting a conflicting one, or read the current computed value and start from it.

## Framework integration

| Stack | Guidance |
| --- | --- |
| React with CSS transitions | Toggle a class or data attribute from state. For exits, keep mounted or use a presence helper. Do not animate in `useEffect` when a class change will do |
| React with Motion | State drives `animate`; a presence wrapper handles exit; give list children stable keys; use the library's layout animation for reorder; read its reduced-motion setting. Confirm import paths and API names in the installed version |
| GSAP in components | Create tweens inside the library's scoped context or hook and revert it in cleanup, so strict-mode double invocation and unmounts leave no orphaned tweens or inline styles |
| Vue, Svelte | Use the built-in transition primitives; they manage enter and leave classes and cancellation |
| Server-rendered pages | The server-rendered state is the final, visible state. Entrances are enhancements applied after hydration, never a hidden initial state in the HTML |
| Routers | Prefer the router's or platform's view-transition support over hand-timed exits; never block navigation on an animation |

React cleanup shape:

```javascript partial
useEffect(() => {
  const animation = ref.current.animate(keyframes, options);
  animation.finished.catch(() => {});
  return () => animation.cancel();
}, [dependency]);
```

## Overlays: the non-visual half

An animated overlay is correct only if the non-visual behavior is correct at every moment of the animation:

- On open: focus moves into the overlay; the background is inert (native `dialog` does this; otherwise the `inert` attribute).
- While exiting: the overlay does not accept clicks or focus. Use `pointer-events: none` and `inert` during the exit, or rely on native top-layer behavior.
- On close: focus returns to the trigger, unless the trigger is gone, in which case to a sensible neighbor.
- Escape closes at any point, including during the entrance.
- Scroll position of the page is preserved; scroll lock does not shift the layout (reserve the scrollbar gutter).

## Gestures

- Use Pointer Events with `setPointerCapture`; handle `pointercancel` as a cancel, never as a commit.
- Set `touch-action` narrowly on the draggable handle so the browser does not also scroll, and so content elsewhere still scrolls.
- Track the pointer one-to-one during the drag: no easing or lag while the finger is down.
- Decide on release by both distance and velocity; settle with a spring or a short ease-out.
- Provide a non-gesture alternative for every gesture: a button, a key.
- Coalesce pointer moves into at most one visual update per frame.

## Cleanup checklist

```text
On unmount or disposal:
- cancel WAAPI animations and library tweens created here
- cancel pending requestAnimationFrame and timers
- disconnect IntersectionObserver, ResizeObserver, MutationObserver
- remove event listeners, including matchMedia change listeners
- release pointer capture
- remove inline styles and will-change set here
- restore anything global that was changed (scroll lock, inert, body classes)
```

## Debugging

| Symptom | Check |
| --- | --- |
| Animation does not run on first open | Element went from `display: none` to its final state in one style pass; add `@starting-style` or flush styles between |
| Jumps on reverse | Keyframe animation or new tween starting from the default state; switch to a transition or start from the current value |
| Element stuck invisible | Waiting for an end event that never fired (zero duration, cancelled, wrong property or target) |
| Runs twice | Effect ran twice (strict mode), or two systems own the property |
| Flicker at the end | `fill: forwards` removed, or final styles differ from the last keyframe |
| Clicks land on something invisible | Exiting element still interactive |
| Works locally, janky in production | Heavier page; profile there, with throttling |
