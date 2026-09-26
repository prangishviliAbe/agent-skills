---
name: premium-web-motion
description: Design, implement, and audit purposeful web motion including UI animation, hover and press feedback, menus and dialogs, page transitions, scroll storytelling, drag interactions, loading feedback, and motion tokens. Use for motion refinement or animation performance and accessibility work in HTML/CSS/JavaScript, React, Next.js, and component libraries; preserve the product's identity and existing stack.
---

# Premium Web Motion

Use motion to explain changes, preserve orientation, and respond to input. Deliver the smallest coherent motion layer that serves the requested experience, remains usable when motion is absent, and survives interruption.

## Operating rules

1. **State each animation's purpose.** Connect it to orientation, feedback, continuity, progress, or an explicitly requested narrative or expressive effect. Remove effects that distract from that purpose.
2. **Keep state authoritative.** Inputs, navigation, errors, and data updates must not wait for decorative animation. Define focus and interaction behavior for entering, exiting, cancelled, and reopened states.
3. **Retarget from the current state.** Fresh input supersedes stale motion. Reverse or continue from the current visual value; prevent an old completion callback from hiding or removing a reopened element.
4. **Prefer inexpensive properties; measure exceptions.** `transform` and `opacity` often avoid layout, but large layers and effects can still be costly. Height and grid-track interpolation both incur layout; use them when surrounding content genuinely needs to reflow and profile the affected area.
5. **Design the reduced-motion path.** Remove nonessential travel, zoom, parallax, looping, and stagger. Use immediate changes or a brief opacity change where helpful, without requiring opacity animation either. Keep equivalent content and actions.
6. **Do not let enhancement hide content.** Preserve visible server/static content and existing application behavior if animation code fails, hydration is delayed, or an API is unsupported. A client-only app need not gain unrelated no-JavaScript functionality.
7. **Preserve meaning and access.** Communicate states beyond movement alone. Respect the widget's keyboard and focus model, browser scroll behavior, and pointer alternatives to gestures.
8. **Make evidence match the claim.** Verify installed library versions and target-browser support. Report measured performance only for the tested scenario and environment; distinguish review, simulation, and device testing.

## Procedure

1. **Scope the work.** For an audit, reproduce and prioritize observed problems before changing code. For implementation, inspect affected components, existing tokens, installed libraries, browser targets, and rendering lifecycle. A motion specification describes behavior without inventing implementation results.
2. **Choose a coherent character.** Use the product's vocabulary of distance, easing, and tempo. Borrow interaction principles without copying a reference's identity. A hover fix does not require a site-wide motion system.
3. **Record the motion contract.** Identify trigger, purpose, semantic state, properties, timing, interruption, reduced motion, fallback, and performance risk. A sentence suffices for one simple transition; use an inventory for a system.
4. **Choose the simplest compatible implementation** from the table below. Reuse primitives. Introduce dependencies only when their capabilities justify measured bundle and maintenance cost.
5. **Implement semantics and the resting state first.** Add motion around them. Specify property ownership so CSS, gestures, layout effects, and libraries do not overwrite one another.
6. **Exercise transitions, not just endpoints.** Test rapid reversal, repeated input, cancellation, unmount/navigation, runtime preference changes, and dynamic content where relevant. Read [implementation.md](references/implementation.md) for lifecycle details.
7. **Verify proportionately.** Check keyboard, pointer, reduced motion, responsive layout, and unsupported/delayed enhancement. Profile new layout, scroll, large-area, or concurrent animation; identify unavailable checks.
8. **Deliver the change and evidence.** State the behavior change, relevant checks, measured limits, and unresolved risks. A proposal or static review is not an executed browser test.

## Choose the smallest compatible tool

| Need | Starting choice |
| --- | --- |
| Hover, press, focus, simple state change | CSS transitions with named properties |
| Native popover or dialog entry/exit | Existing accessible primitive; progressively enhance with supported starting/discrete transition features |
| Imperative control or short sequence | Web Animations API with cancellation and cleanup |
| React presence or shared layout | Existing animation library; Motion when its capabilities are needed |
| Continuity between views | View Transitions API with normal navigation/update as fallback |
| One-time viewport entry | IntersectionObserver; visible content is the fallback |
| Continuous scroll progress | CSS scroll-driven animations where supported; static fallback or measured progress implementation |
| Complex interactive timeline | Existing timeline library, or a justified addition such as GSAP |

IntersectionObserver detects visibility thresholds; it is not a substitute for continuous scroll progress. Check new API support against the actual browser target.

## Timing as a starting point

These ranges are tuning examples, not accessibility standards or universal acceptance thresholds. Use the product system and adjust for input frequency, travel, and content.

| Context | Initial range | Decision |
| --- | --- | --- |
| Hover or press feedback | 100–180ms | Begin responding on input; avoid delayed feedback |
| Menu, disclosure, small state change | 160–280ms | Keep frequently repeated actions quick |
| Dialog, sheet, view continuity | 200–400ms | Preserve orientation without delaying focus or navigation |
| Opt-in narrative sequence | Content-dependent | Keep reading and skipping under the user's control |

Ease-out often suits arrivals; ease-in-out suits movement between stable positions. Linear timing suits accurate progress and direct scroll mapping. Springs can express continuity or physical settling beyond drag alone; tune overshoot and respect reduced motion. Do not add duration or bounce merely to signal importance.

## Reference map

| When the task involves | Read |
| --- | --- |
| Character, tokens, choreography, inventory | [motion-system.md](references/motion-system.md) |
| Interaction-specific focus, semantics, gestures, failure states | [patterns.md](references/patterns.md) |
| CSS, WAAPI, React, FLIP, lifecycle, progressive enhancement | [implementation.md](references/implementation.md) |
| Profiling, reduced motion, WCAG scope, verification scenarios | [performance.md](references/performance.md) |

Load only relevant references. This folder is self-contained; no other skill is required.

## Failure modes

| Failure | Correct move |
| --- | --- |
| All content waits for reveals or hydration | Render visible; animate selected noncritical content after enhancement is available |
| Tooltip takes keyboard focus | Leave focus on its trigger; use an appropriate interactive popup for controls |
| Grid rows described as layout-free height animation | Treat grid interpolation as layout work; constrain and profile it |
| Animation completion controls business state | Commit state independently; make visual cleanup cancellation-safe |
| Reduced motion only shortens large movement | Remove movement and delay; preserve information and the final state |
| Cancel-and-restart jumps to the beginning | Sample current state before cancellation or reverse the effect |
| Exiting content remains invisibly focusable | Remove interaction at the correct semantic boundary; transfer focus deliberately |
| Library or API claimed fast by default | Inspect properties, layer size, main-thread work, and device trace |
| Scroll sequence captures wheel or touch to force a story | Retain native scroll and reachable content; provide bypass for extended sequences |

## Definition of done

- [ ] Each changed animation has a purpose and documented normal, interrupted, and reduced-motion outcomes.
- [ ] Input and semantic state remain correct during entry, exit, cancellation, and rapid reversal.
- [ ] Focus, hidden content, and pointer alternatives follow the widget's interaction model.
- [ ] Enhancement failure and delayed initialization preserve underlying content and behavior.
- [ ] Tokens and property ownership are consistent; dependency and browser assumptions are justified.
- [ ] Cleanup and runtime preference handling cover subscriptions and active animations.
- [ ] Relevant checks have recorded results; performance claims identify the environment and evidence.
- [ ] Untested behavior and remaining issues are identified in the handoff.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
