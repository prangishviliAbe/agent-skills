# Interaction patterns

Choose semantics first, then add motion. Timing ranges in the entrypoint are starting points; none changes the widget's interaction contract.

## Press, hover, and focus

Keep a focus indicator immediately visible. Gate decorative hover movement for a fine pointer that supports hover; preserve information and actions on touch and keyboard. A small press scale can confirm input, but keep the target's layout stable and prevent hover, press, and drag from fighting over one transform.

Cancel press feedback on pointer cancellation, loss of capture, or keyboard release. Do not trigger a destructive action on pointer-down merely to make it feel fast.

## Reveal on entry

Use for a selected noncritical group. Keep static/server content visible and start an enhancement only when the observer callback can run it. Avoid a global hidden state that depends on later hydration or callbacks.

Treat visibility detection separately from choreography: callback entry order is not document order. Select sibling order explicitly when stagger matters. Positive bottom root margin detects before entry; negative margin shrinks the detection area and triggers later.

Keep primary text, navigation, important media, and the likely LCP candidate free of artificial reveal delays. Replaying a reveal on every scroll reversal usually adds distraction; only repeat when the interaction calls for it.

## Menus, popovers, and tooltips

Position the origin near the trigger without prescribing one focus policy to every popup.

| Widget | Focus and state |
| --- | --- |
| Disclosure / navigation panel | Update expanded state; focus normally stays on the trigger; links follow normal tab order |
| Menu button with ARIA menu | Follow menu keyboard behavior and move focus to an appropriate menu item on opening |
| Nonmodal interactive popover | Follow its content's interaction model; popover is a display mechanism, not an automatic role or focus trap |
| Tooltip | Keep focus on the trigger; expose descriptive text; do not put interactive controls inside a tooltip |
| Modal dialog | Move focus inside and keep background interaction unavailable until dismissed |

Tooltips triggered by hover/focus must remain reachable by the pointer, dismissible when required, and persistent while their trigger/content remains active. Do not animate essential help away on a timer. The [APG tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) is a work in progress; the applicable [WCAG hover/focus requirements](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) are the conformance reference.

## Dialogs and sheets

Use the existing accessible primitive or native dialog semantics before custom animation. Choose initial focus based on content and task; focus need not always go to the first button. Preserve focus containment, Escape behavior, and a reachable close action. Return focus to the trigger or a logical replacement if it no longer exists. See [APG modal dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Define the closing boundary: either keep the dialog semantically modal through a brief, cancellable exit, or close it and animate a noninteractive visual representation. Do not return focus to inert background content or leave a transparent modal intercepting input.

Reserve scrollbar space where needed. Test zoom, long content, virtual keyboard, and dynamic viewport height. Drag-to-dismiss is optional; a close control must remain available. Reopening must invalidate a pending close callback.

## Disclosure and accordion

Prefer a native disclosure for a simple case. For custom controls, synchronize the trigger, panel exposure, and interaction state. When collapsing a panel containing focus, move focus to a sensible visible control before hiding or making it inert.

Choose immediate expansion, measured height, grid tracks, or supported intrinsic-size interpolation according to need. Height and grid tracks both require layout; neither is free. A grid child commonly needs `min-height: 0` and clipping. A collapsed visual wrapper alone does not remove its children from keyboard or assistive access.

Avoid arbitrary max-height caps: they can clip dynamic content and distort timing. Test inserted errors, late images, font changes, and rapid reversal.

## Cards and media

Use hover motion only when it supports an actual affordance. Keep link semantics and a stable target. Choose a small image zoom or surface lift without making all descendants move independently. A keyboard user must get the same information without needing a hover animation.

## Lists and shared layout

Keep identity stable across insertions, deletion, filtering, and reorder. Move focus to an appropriate neighbor when the focused item is removed. A visual exit may persist after logical removal, but it must no longer expose stale actions or duplicate announcements.

Use FLIP or library layout animation for continuity when useful. Do not animate the entire list for a single item's change. Reduced motion should commit the final layout directly. For virtualized lists, verify recycled nodes are not mistaken for the same item.

## Routes and view transitions

Let the router own navigation, data, focus, and history. Animate the accepted update; do not wait for an exit before starting navigation. Match shared elements only when they represent the same object. Ensure transition names are unique within each captured state.

For overlapping navigation, cancel stale data commits as well as skipping old visual effects. Skipping a view transition does not cancel its update callback. Preserve the router's scroll restoration on back/forward and its focus strategy; do not forcibly scroll every route to the top.

## Scroll storytelling

Use native scroll. CSS scroll timelines map continuous progress; IntersectionObserver is for entry/visibility thresholds. Provide complete static content if the effect is unsupported or motion is reduced. Consider bypass for lengthy pinned narratives.

Check reverse scroll, resize, content changes, anchor navigation, keyboard scrolling, browser find, and compact screens. An effect is not accessible merely because a trackpad can reach its end. Avoid animated smooth scrolling under reduced motion.

## Forms and async work

Show a pending state promptly without inventing progress or success. Keep labels intelligible and guard duplicate submission according to the actual operation; not every update should disable the whole form.

Display errors without decorative delay, associate them with their field, and announce status at meaningful intervals. Keep consequential success information available after a toast disappears. Match skeleton geometry to likely content and remove shimmer under reduced motion; reserve known dimensions to limit movement.

## Drag and gestures

Track the pointer directly during manipulation; apply easing or a spring after release if appropriate. Preserve native scroll on the unused axis through deliberate touch-action behavior. Handle pointer cancellation, capture loss, bounds changes, and teardown.

Provide both keyboard operation and a click/tap alternative without dragging, such as move buttons or a destination menu. Keyboard support alone does not meet [WCAG 2.5.7 Dragging Movements, AA](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). Essential and user-agent-controlled dragging have specific exceptions; do not assume ordinary app reordering qualifies.
