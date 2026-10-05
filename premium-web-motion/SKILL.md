---
name: premium-web-motion
description: >-
  Design, implement, and audit purposeful web motion: UI transitions, hover and press feedback,
  menus, dialogs, drawers and accordions, page and view transitions, scroll-driven effects,
  staggered reveals, drag and gesture feedback, loading states, and motion tokens, in CSS, Web
  Animations API, React, Next.js, Motion, GSAP, and component libraries. Use whenever the user
  asks to add or refine animation, make an interface feel more polished or premium, fix janky,
  slow, or inaccessible motion, handle reduced-motion, or review how a UI moves, even if they
  only say "make it feel smoother". Keeps content usable without motion, makes animations
  interruption-safe, matches the existing stack and brand, and reports measured results only.
---

# Premium Web Motion

Use motion to explain change, keep people oriented, and answer input. Premium motion is mostly restraint and correctness: fast response, small purposeful movement, consistent timing, and no broken states when interrupted. Deliver the smallest coherent motion layer that serves the experience and still works when motion is absent.

## How to work

1. **Give every animation a job.** Orientation, feedback, continuity, progress, or an explicitly requested expressive moment. Remove movement that only decorates; one focal change at a time reads as confident.
2. **Keep state authoritative.** Input, navigation, errors, and data updates never wait for an animation to finish. Define focus and interaction behavior for entering, exiting, canceled, and reopened states.
3. **Retarget from where the element is.** New input supersedes old motion: reverse or continue from the current visual value, and make sure a stale completion callback cannot hide or remove a reopened element.
4. **Prefer cheap properties and measure the rest.** `transform` and `opacity` usually avoid layout; height, grid tracks, large blurs, and shadows can still cost. Profile what you actually animate.
5. **Design the reduced-motion path.** Remove travel, zoom, parallax, looping, and stagger; use an immediate change, or a brief fade, and keep the same content and actions.
6. **Never let enhancement hide content.** Render visible content first; if the animation code fails, hydration is late, or an API is missing, the page must still work. Do not start elements hidden.
7. **Preserve meaning and access.** Convey state beyond movement, respect the widget's keyboard and focus model and native scrolling, and give pointer alternatives to gestures.
8. **Make evidence match the claim.** Check installed library versions and target-browser support. Report performance only for the scenario and environment you measured.

## Premium versus cheap

| Cheap tell | Premium practice |
| --- | --- |
| Everything fades up on scroll | Animate one meaningful change; leave primary content static and instantly visible |
| Long durations and bounce to "add personality" | Short, decisive timing; overshoot only where physical continuity suits the brand |
| Linear easing on UI movement | Ease-out for arrivals, ease-in-out between stable positions, linear for progress and scroll mapping |
| Same stagger on every list | Capped total delay; order by reading flow; none for long lists |
| Hover lift on every card | Hover only where it signals an action, only on fine pointers |
| Animation blocks the next action | Interaction is live from the first frame |
| Layout properties animated | Transform and opacity, or a measured, bounded layout change |
| Motion that ignores the user's setting | A designed reduced-motion version |

## Pick the mode

| Request | Do |
| --- | --- |
| Specify motion | Write the contract for each behavior: trigger, purpose, semantic state, properties, timing, interruption, reduced motion, fallback, risk ([motion-system.md](references/motion-system.md)) |
| Implement | Inspect components, tokens, libraries, and browser targets; implement semantics and the resting state first, then motion; exercise rapid reversal and cancellation |
| Audit | Reproduce and prioritize observed problems before changing code: state, focus, and hidden content first, then input delay and layout cost, then polish |

## Choose the smallest tool that works

| Need | Start with |
| --- | --- |
| Hover, press, focus, simple state | CSS transitions on named properties |
| Dialog or popover enter and exit | The native element plus `@starting-style` and `transition-behavior: allow-discrete`, with an immediate fallback ([recipes.md](references/recipes.md)) |
| Imperative control or short sequence | Web Animations API with cancellation and cleanup |
| React presence or shared layout | The project's animation library; Motion when its capabilities are needed ([libraries.md](references/libraries.md)) |
| Continuity between views | View Transitions API, with a normal update as the fallback |
| One-time entry into view | IntersectionObserver on an element that is already visible |
| Continuous scroll progress | CSS scroll-driven animations where supported, behind `@supports`; a static fallback |
| Complex timeline | The existing timeline library, or GSAP when justified |

IntersectionObserver detects thresholds; it does not give continuous scroll progress. Check any new API against the real browser target before relying on it.

## Timing starting points

Examples to tune against the product's own system and the input frequency, not standards. Hover or press feedback 100 to 180 ms. Menus and small state changes 160 to 280 ms. Dialogs, sheets, and view continuity 200 to 400 ms. Narrative sequences depend on content and stay skippable. Frequent actions should feel fastest. Do not add duration or bounce just to signal importance.

## Reference map

| When the task involves | Read |
| --- | --- |
| Character, tokens, springs, choreography math, inventory, audit | [motion-system.md](references/motion-system.md) |
| Focus, semantics, gestures, and failure states per interaction | [patterns.md](references/patterns.md) |
| CSS, WAAPI, React, FLIP, view transitions, lifecycle, progressive enhancement | [implementation.md](references/implementation.md) |
| Ready-to-adapt effects with reduced-motion paths | [recipes.md](references/recipes.md) |
| Motion, GSAP, smooth scroll, Lottie, Rive, 3D | [libraries.md](references/libraries.md) |
| Profiling, reduced motion, WCAG scope, verification scenarios | [performance.md](references/performance.md) |

## Failure modes

| Failure | Correct move |
| --- | --- |
| Content waits for reveals or hydration | Render visible; enhance selected noncritical content afterward |
| Tooltip takes keyboard focus | Leave focus on the trigger; use an interactive popup for controls |
| Grid-row animation described as layout-free | It is layout work; constrain and profile it |
| Animation completion controls business state | Commit state independently; make visual cleanup cancellation-safe |
| Reduced motion only shortens the movement | Remove movement and delay; keep content and the final state |
| Cancel-and-restart jumps to the beginning | Sample the current state before canceling, or reverse |
| Exiting content stays focusable while invisible | Remove interaction at the right semantic boundary; move focus deliberately |
| A library or API called fast by default | Inspect properties, layer size, main-thread work, and a device trace |
| Scroll story captures wheel or touch | Keep native scroll, reachable content, and a way to skip long sequences |
| Looping or auto-moving content with no control | Provide pause, stop, or hide for motion longer than five seconds |

## Definition of done

- [ ] Each changed animation has a purpose and defined normal, interrupted, and reduced-motion behavior.
- [ ] Input and semantic state stay correct during entry, exit, cancellation, and rapid reversal.
- [ ] Focus, hidden content, and pointer alternatives follow the widget's interaction model.
- [ ] Enhancement failure or delay leaves the content and behavior intact.
- [ ] Tokens and property ownership are consistent; dependency and browser-support assumptions are justified.
- [ ] Cleanup and runtime preference changes cover subscriptions and active animations.
- [ ] Checks and results are recorded; performance claims name the environment and evidence.
- [ ] Untested behavior and remaining issues are stated.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
