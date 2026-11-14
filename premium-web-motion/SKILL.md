---
name: premium-web-motion
description: >-
  Design, implement, tune, and debug web motion: hover and press feedback, menus, dialogs,
  drawers, accordions, toasts, page and view transitions, list reordering, drag and gesture
  feedback, scroll-driven effects, loading states, and motion tokens, in CSS, the Web
  Animations API, React, Motion, GSAP, and component libraries. Use for "add animation",
  "make it feel smoother or more premium", janky, slow, or glitchy transitions, animations
  that break when interrupted, reduced-motion support, or a review of how a UI moves. Gives
  every motion a purpose, exact duration and easing, interruption safety, a reduced-motion
  path, and measured performance, and removes decorative animation that makes a site look
  generated.
---

# Premium Web Motion

Motion in an interface has one job: to make a change understandable. Where something came from, what it is connected to, what just happened, what is still happening. Motion that does that well is felt as responsiveness and quality. Motion that does anything else is felt as waiting.

"Premium" is not more animation. It is fewer animations, each with the right duration, the right curve, and correct behavior when interrupted. The fastest way to make a site look generated is to animate everything the same way.

## Decide whether to animate

| Purpose | Example | Animate? |
| --- | --- | --- |
| Feedback | A press, a toggle, a drag following the finger | Yes, immediately and briefly |
| Continuity | A panel opening from its trigger; an item moving to its new position | Yes |
| Orientation | Forward and back navigation moving in opposite directions | Yes, subtly |
| Attention | One new item that needs noticing | Once, small |
| Progress | Real loading or streaming | Yes, truthfully |
| Decoration | Blocks fading up on scroll, floating shapes, hover lifts on static cards | No |
| Frequent actions | Something the user triggers dozens of times a session | Almost none; speed is the feature |

If no purpose from the first five rows applies, do not animate. If the action is frequent, cut the duration or remove the motion.

## Banned by default

Do not add these, and remove them from the scope being changed unless explicitly requested: fade-and-rise on scroll for every section; staggered entrance of whole pages; hover scale or lift on non-interactive cards; bounce, elastic, or overshoot on ordinary UI; `transition: all`; count-up numbers; typewriter and text-scramble headlines; infinite marquees; floating, pulsing, or shimmering loops; animated gradients; border beams and glows; particles; parallax; cursor followers; magnetic buttons; card tilt; scroll hijacking and smooth-scroll libraries that replace native scrolling; page-load curtains and splash animations. An explicitly requested expressive effect is allowed when it has a lifecycle, a reduced-motion path, and does not block content or input.

## Rules

1. **Respond within 100ms.** Feedback starts on the input event, not after a request returns. Never delay an action to let an animation play.
2. **Short, and shorter on exit.** Most UI motion lives between 120 and 300ms. Exits run faster than entrances. Larger distance earns more time; frequency earns less. Tokens and tables: [motion-system.md](references/motion-system.md).
3. **Curve by direction.** Entering elements decelerate (ease-out). Leaving elements accelerate or simply fade fast. Elements moving between two on-screen positions use ease-in-out. Linear is for opacity, color, and progress only. Springs are for things the user drags or throws.
4. **Small distances.** Enter and exit offsets of 4 to 16px and scale changes of 2 to 5 percent read as refined. Large slides and zooms read as a slideshow.
5. **Origin matters.** A menu grows from its trigger, a dialog from where it was invoked or from center, a toast from the edge it lives on. Set `transform-origin` accordingly.
6. **Always interruptible.** Every animation can be reversed mid-flight and continues from its current value. State lives in the application, never in an animation's completion callback or a timer. See [implementation.md](references/implementation.md).
7. **Content first.** Everything is visible and usable if JavaScript fails, the animation never runs, or the user scrolls fast. Never ship content at `opacity: 0` waiting for an observer.
8. **Animate cheap properties.** Prefer `transform` and `opacity`. Animating layout properties, large blurs, and shadows needs a measured reason. See [performance.md](references/performance.md).
9. **Reduced motion is a designed variant.** Replace movement with an instant change or a short fade; keep feedback and progress. Handle it in CSS and in JavaScript. See [reduced-motion.md](references/reduced-motion.md).
10. **Smallest mechanism.** CSS transition, then CSS keyframes or the Web Animations API, then the library already in the project. Add a dependency only for a requirement the platform cannot meet. See [libraries.md](references/libraries.md).
11. **One motion system.** A handful of duration and easing tokens used everywhere. Ten different curves on one page is the motion equivalent of ten fonts.
12. **Clean up.** Cancel animations, frames, timers, observers, and listeners on unmount; release pointer capture; remove `will-change`.

## Workflow

1. **Inventory.** List the state changes in scope and what currently happens for each. Read the existing motion tokens, library, and versions.
2. **Assign purpose.** For each change, pick a purpose from the table or mark it "no motion". Remove decorative animation first; this alone usually improves the result.
3. **Specify.** For each remaining motion: properties, from and to values, duration, easing, origin, interruption behavior, reduced-motion variant.

   ```text
   Menu open:   opacity 0→1, scale 0.97→1, origin top-left of trigger
                140ms ease-out; close 100ms ease-in
                Interrupt: reverses from current value (CSS transition)
                Reduced:   opacity only, 80ms
   ```

4. **Implement** with the smallest mechanism, using tokens. Recipes: [recipes.md](references/recipes.md).
5. **Exercise.** Trigger normally, then abuse it: reverse mid-animation, repeat rapidly, navigate away mid-flight, use the keyboard, emulate reduced motion, throttle the CPU. Watch at reduced playback speed to see the path, then at full speed to judge the feel.
6. **Measure** when anything stutters or when animating beyond transform and opacity. Record the conditions.
7. **Tune.** If it feels slow, shorten it before changing the curve. If it feels abrupt, check the curve and the distance before lengthening. If you notice the animation itself on the third viewing, it is too much.

## Diagnosis

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Feels sluggish | Duration over 300ms, or ease-in on an entrance | Shorten; use ease-out |
| Feels cheap or toy-like | Overshoot, bounce, large travel | Remove overshoot; cut distance to a few pixels |
| Feels abrupt | Linear or missing curve; exit and enter identical | Proper easing; asymmetric timing |
| Feels generated | Everything fades up with the same stagger | Remove entrances; animate state changes only |
| Jumps when reversed | Keyframe animation restarted from the start, or state tied to a timer | CSS transition or retargetable animation; single state owner |
| New dialog closes by itself | Stale exit timer or completion callback | Cancel previous work; derive from current state |
| Stutter | Layout or paint properties animated; too many elements; main thread busy | Transform and opacity; fewer elements; profile |
| Blurry text during motion | Fractional transforms or scaling text containers | Animate a wrapper; avoid scaling text; end on whole pixels |
| Content invisible | Entrance depends on JavaScript or an observer that did not fire | Visible baseline; animation as enhancement |
| Layout shifts | Animating size without reserved space | Transform-based technique or reserved space |

## Verification

Check each changed interaction for: normal use; reversal mid-flight; rapid repetition; keyboard operation; touch where relevant; navigation or unmount during the animation; reduced motion; and a slow device or throttled CPU. For overlays also check focus entry, Escape, background inertness, and focus return. For gestures check that a non-gesture alternative exists.

Finish with no interaction race, no focusable invisible element, no content that depends on animation to appear, no animation work continuing after disposal, and no decorative loop in the changed scope. Report browser, device or throttling, scenario, and what was observed. A frame rate is something measured in a named scenario, never something promised from property choice. Use **Verified**, **Inferred**, **Assumed**, and **Not run** to separate observation from expectation.

## References

| Need | Read |
| --- | --- |
| Durations, easing curves, springs, stagger, tokens | [motion-system.md](references/motion-system.md) |
| Working patterns: press, menu, dialog, accordion, toast, reorder, page and view transitions, scroll-linked, drag | [recipes.md](references/recipes.md) |
| Interruption, state ownership, presence, cleanup, framework integration | [implementation.md](references/implementation.md) |
| Reduced-motion variants in CSS and JavaScript; vestibular safety | [reduced-motion.md](references/reduced-motion.md) |
| Profiling, compositor properties, layout thrash, layers | [performance.md](references/performance.md) |
| Choosing or integrating CSS, WAAPI, Motion, GSAP, view transitions | [libraries.md](references/libraries.md) |

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
