# Motion patterns

Read when designing or reviewing a specific interaction. Each pattern: the job, the spec, and the failure to avoid.

## Press, hover, focus

**Job:** confirm that the interface received the input.

- Press: `scale(.97–.98)` or a 1px depression, 120ms, ease-out. It must feel simultaneous with the click.
- Hover: 1–2px lift or a background shift, 140–180ms. Gate it behind `@media (hover: hover) and (pointer: fine)` so touch devices do not get a sticky hover state.
- Focus-visible: the ring appears **instantly**. Never animate a focus indicator in — a keyboard user is moving fast and a 200ms fade reads as lag.

**Avoid:** long hover transitions, hover as the only affordance, and a focus style removed because it "looked bad".

## Reveal on scroll

**Job:** direct attention to one group as it enters the reading flow.

- Opacity 0→1 plus `translateY(12–20px)`, 400–550ms, emphasized ease-out.
- Trigger slightly before the element is fully visible (a root margin of about `-10%`), so it has finished by the time the user reads it.
- `once: true`. Re-animating on scroll-back is a distraction.
- Stagger siblings by 60ms, capped at about five items.
- **The element is visible by default.** Add the hidden state only after the observer is confirmed running, and unobserve after entry.

**Avoid:** revealing every section, revealing the LCP element (it delays your largest paint and damages the metric), and content that stays invisible if the script fails.

## Menus, popovers, tooltips

**Job:** connect the panel to the control that opened it.

- Transform origin at the trigger. Scale from 0.96 plus a small translate, 180–240ms in, 140–180ms out.
- The semantic state (`aria-expanded`, the popover's own state) changes immediately; the animation is decoration on top of it.
- Focus moves into the panel on open and returns to the trigger on close. `Escape` closes.
- Tooltips: a 300–500ms open delay, near-zero close delay, and no delay at all when moving between adjacent triggers.

**Avoid:** motion that substitutes for the semantic state, and panels that animate from the center of the screen when they belong to a corner control.

## Dialogs and sheets

**Job:** establish a new layer above the page.

- Desktop dialog: opacity plus `scale(.97→1)` and a small upward translate, 260–320ms.
- Mobile sheet: slide from the edge it belongs to, 300–380ms, with a drag-to-dismiss that follows the finger.
- Backdrop fades slightly faster than the panel arrives.
- Focus moves in and is trapped; on close it returns to the trigger. Background scroll is locked without a layout shift from the disappearing scrollbar.
- The exit runs faster than the entrance, and can be interrupted by reopening.

**Avoid:** animating a dialog that carries an error message the user needs immediately, and stacking a modal on a modal.

## Accordions and disclosure

**Job:** show that content belongs to the header that revealed it.

Animate `grid-template-rows: 0fr → 1fr` on a wrapper, or a measured height, never `height: auto` (which does not animate). Keep it at 200–300ms; content height varies, so cap the duration rather than scaling it with content length.

Rotate the chevron in the same duration so the indicator and the content agree.

**Avoid:** animating every item in a list open at once, and a duration that grows with a long panel.

## Cards and media

**Job:** signal interactivity and, on click, connect to the destination.

- Lift 2–4px with a slight shadow increase, 160–200ms, or a 1.03–1.05 image scale inside an `overflow: hidden` mask.
- Only one of the two. A card that lifts, scales its image, shifts its text, and reveals an arrow is four animations for one hover.
- Preserve the tap target and make the same information reachable without hover.

**Avoid:** perpetual float, 3D tilt on a content card, and a reveal animation on every card in a grid.

## Lists: add, remove, reorder

**Job:** preserve the user's sense of what changed.

- Enter: fade plus a small translate from the direction it arrived.
- Exit: fade plus collapse, faster than the entrance, and remove it from layout only after it finishes.
- Reorder: FLIP (measure first, apply the inverse transform, then play) so items appear to travel rather than teleport.
- After a deletion, focus moves to a sensible neighbor, not to the top of the page.

**Avoid:** re-animating the whole list when one item changes, and layout jumps when an item is removed.

## Route and view transitions

**Job:** preserve continuity between two views.

- Use a shared-element transition only when the same object genuinely exists in both views. Otherwise a fast cross-fade is better than a fake relationship.
- Total transition under about 400ms. Users navigate far more often than they admire transitions.
- The new route's content must be reachable even if the transition code fails to load.
- Focus lands at the top of the new view, or on its main heading. Scroll position is restored on back navigation.
- Cancel an in-flight transition when the user navigates again. Never queue navigations.

**Avoid:** blocking navigation until an animation ends, and transitions that make the back button feel slow.

## Scroll storytelling

**Job:** make progress through a concept legible.

- Bind to scroll progress only when the movement genuinely explains something. Otherwise use a plain in-view reveal.
- Prefer CSS scroll-driven animations where supported; otherwise a minimal observer or a throttled progress calculation. Never a heavy per-frame handler doing layout reads.
- Cap total pinned length: two or three viewport heights is usually the limit of patience.
- Reduce or disable on compact viewports, where pinning fights the browser chrome and the user's scroll momentum.
- Test keyboard scrolling (`Space`, `PageDown`) and jump links.

**Avoid:** scroll-jacking, animation tied to a `scroll` handler that reads layout every frame, and content that is unreachable without scrolling through a sequence.

## Forms and async work

**Job:** report state honestly.

- Submit: the button enters a busy state immediately, is non-repeatable, and keeps its label plus an indicator rather than becoming an anonymous spinner.
- Validation errors appear without motion delay, stay visible until corrected, and are announced. Motion is never the only error cue.
- Success: a short confirmation adjacent to the action, plus a persistent state change. A toast alone disappears before a distracted user sees it.
- Skeletons match the final layout so nothing shifts when the data arrives. If you cannot match it, use a plain spinner instead of a misleading skeleton.
- Determinate progress whenever the value is real; indeterminate only when it genuinely is.

## Gestures and drag

**Job:** keep the object attached to the finger.

- 1:1 tracking during the drag with no easing — easing during direct manipulation feels like lag.
- Constrain to the meaningful axis, show the snap targets, and make the cancel gesture obvious.
- Release velocity carries into a spring settle. This is the one place a spring is clearly right.
- Every gesture has a non-gesture equivalent: a button, a menu item, or a keyboard action.
- Respect the platform's system gestures near screen edges.
