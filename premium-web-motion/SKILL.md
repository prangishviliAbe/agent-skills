---
name: premium-web-motion
description: >-
  Design, implement, and debug refined web animation, transitions, gestures, and micro-interactions.
  Use for motion polish, springs, interruption-safe dialogs, shared-element transitions, scroll
  effects, reduced motion, or animation performance. Keep motion purposeful, controllable,
  accessible, and measured; avoid gratuitous card tilt, border beams, particles, and animation
  added solely to make ordinary UI feel premium.
---

# Premium Web Motion

Make state changes intelligible and interactions responsive. A quiet, well-timed transition can be more refined than a complex effect. Preserve the product's visual language, semantic controls, and native navigation.

## Decisions

- **Name the purpose.** Motion may show cause, continuity, hierarchy, progress, or direct manipulation. Remove effects with no useful role. Do not add decorative dots, card border beams, animated accent lines, particles, or hover spotlights. Use ambitious effects only when specifically requested and compatible with the task.
- **Choose the smallest mechanism.** Use CSS for simple feedback, an existing animation library for stateful gestures or choreography, and native APIs when their support and behavior fit. Do not add a dependency for a minor hover.
- **Choose easing by behavior.** Use a short ease for discrete state changes and a spring for direct manipulation or retargeting. Sampled CSS linear() easings have fixed duration; they do not preserve live velocity.
- **Preserve control.** Users can interrupt, reverse, reopen, cancel, and repeat actions. Avoid timer-driven state races, delayed click handling, and focusable invisible elements.
- **Prefer transform and opacity where appropriate.** Profile actual rendering. They are often inexpensive, not guaranteed GPU-only or 120fps. Small color transitions can be reasonable; layout animation needs a measured budget.
- **Start with usable content.** Content stays visible if JavaScript, an API, or animation initialization fails. Never hide primary content until an entrance animation runs.
- **Respect reduced motion in CSS and JavaScript.** Provide a stable final state with kinetic movement removed. Preferences can change during a session. Keep essential status comprehensible without looping decoration.
- **Own the lifecycle.** Cancel animation frames, timers, tweens, subscriptions, observers, and pointer capture appropriately. Reset inline styles on disposal. One component must not change global ticker settings for the whole app.
- **Verify current support.** Check installed library APIs and target-browser documentation before using view transitions, scroll timelines, discrete transitions, or framework motion features.

## Routed references

| Need | Read |
| --- | --- |
| Easing, spring behavior, duration, choreography | [motion-system.md](references/motion-system.md) |
| Purposeful interaction recipes and restrictions | [recipes.md](references/recipes.md) |
| Native dialogs, presence, cancellation, cleanup | [implementation.md](references/implementation.md) |
| Profiling, layout reads, layers, reduced motion | [performance.md](references/performance.md) |
| Choosing an engine without unnecessary dependencies | [libraries.md](references/libraries.md) |

## Verification

Exercise the changed interaction normally, during reversal, rapid repetition, navigation/unmount, keyboard use, touch where relevant, and reduced motion. For modal transitions, verify focus entry, Escape, background inertness, and focus return. For gestures, provide a non-drag equivalent.

Record browser/device, scenario, and observed result when profiling. A 120Hz display has about 8.3ms per frame; this is a budget, not an achievement claim. Do not promise a frame rate from property selection alone.

Finish with no interaction races, trapped focus, invisible hit targets, inaccessible essential content, or persistent animation work after disposal in the tested scope. Use **Verified**, **Inferred**, **Assumed**, and **Not run** to distinguish observation from expectation.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
