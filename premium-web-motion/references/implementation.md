# State ownership and native behavior

Read when: Implementing dialogs, presence transitions, gesture cleanup, or framework motion.

## Native dialog contract

| Event | State owner | Required behavior |
| --- | --- | --- |
| Open | Application + native showModal | Meaningful initial focus, labeled dialog, inert background |
| Escape | Native cancel event + application state | Close according to the task; preserve native keyboard behavior |
| Animated exit | One cancellable controller, if needed | No stale timer closing a newly reopened dialog |
| Reopen during exit | Same controller | Cancel/retarget prior work and keep state coherent |
| Close | Native close + application reconciliation | Restore focus appropriately; remove hidden hit targets |
| Unmount | Component disposal | Cancel animations and listeners; restore owned resources |

Prefer native semantics and the project's tested primitive. CSS @starting-style with discrete display/overlay transitions can enhance a native dialog when supported. Verify the exact selector/state and fallback against current [MDN dialog guidance](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Unsupported animation must still open and close correctly.

## Framework integration

| Engine | Implementation decision |
| --- | --- |
| Existing React motion library | Keep authoritative state outside animation completion; check installed presence and layout APIs |
| Existing GSAP timeline | Scope timeline/context to component; cancel and revert on cleanup |
| Web Animations API | Own the animation instance, handle cancellation, avoid unhandled finished-promise rejection |
| CSS transition | Listen only when state depends on completion; filter target/property and handle cancellation |
| Smooth-scroll library | Preserve anchors, keyboard, restoration, focus scrolling, reduced motion; dispose all integrations |

Avoid global ticker changes or permanent will-change flags from a local component. Do not make an opacity-zero exiting region remain interactive.

## Lifecycle artifact

```text
Controller owns:
- current animation and target state
- interruption and cancellation path
- pending completion callbacks
- resources created by this component

Unmount must:
- cancel current work
- invalidate stale callbacks
- remove listeners/tickers/observers
- release pointer capture where applicable
- restore owned inline styles
```

Check API imports, licenses, and browser support from installed types or official docs. A partial recipe is not production-ready until integrated with the actual state and focus model.
