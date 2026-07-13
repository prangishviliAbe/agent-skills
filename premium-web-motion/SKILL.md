---
name: premium-web-motion
description: Design, audit, and implement purposeful premium website motion without copying a brand's visual identity. Use for polished UI animation, microinteractions, page transitions, scroll storytelling, motion-system design, or performance/accessibility reviews in HTML/CSS/JavaScript, React, Next.js, and component libraries.
---

# Premium Web Motion

Create restrained motion that clarifies hierarchy, gives controls tactile feedback, and makes state changes understandable. Aim for a calm, editorial, technically refined product feel; do not imitate a specific company's branding, layouts, or proprietary visual language.

## Workflow

1. Inspect the product goal, content hierarchy, interaction states, target devices, and existing motion. Preserve working project conventions and do not introduce a motion library unless it earns its cost.
2. Derive a motion character from the product: calm, precise, tactile, playful, cinematic, or utilitarian. Express it through a limited vocabulary of distance, tempo, easing, and sequencing rather than unrelated effects.
3. Make a motion inventory: for each proposed animation, name its trigger, UX purpose, properties, duration, easing, interruption behavior, reduced-motion behavior, and performance risk. Remove decorative movement with no clear purpose.
4. Define shared motion tokens before implementing. Use the project token system if one exists; otherwise use the baseline in [implementation.md](references/implementation.md).
5. Select the least complex implementation: CSS for state feedback; native Web Animations API for imperative, dependency-free sequences; Framer Motion/Motion for component lifecycle and shared layouts; the View Transitions API when progressive enhancement and browser support fit; GSAP only for genuinely complex, measured timelines.
6. Implement reusable primitives and semantic state changes. Keep animations composable rather than scattering one-off keyframes across pages.
7. Validate keyboard, touch, mobile, RTL/localized content, `prefers-reduced-motion`, interruption, loading/slow-device behavior, and performance. Report the motion decisions with code when coding is requested.

## Design Rules

- Assign one job to each animation: orient, reveal, confirm, preserve context, or communicate progress/error. If it cannot be named, omit it.
- Favor `transform` and `opacity`; use `filter` sparingly and only after checking the visual/performance cost. Avoid layout-affecting animation (`width`, `height`, `top`, `left`, margins, padding) and continuous expensive shadows.
- Keep ordinary UI movement small (8–24px). Reserve large spatial transitions for a meaningful navigation or product story.
- Use ease-out for arrivals, ease-in for departures, and a deliberate spring only for direct manipulation. Never use linear motion by default.
- Sequence related content with a subtle 40–80ms stagger; do not make every section enter identically.
- Animate only a few elements at once. Prefer a single hero focal motion over a page full of competing reveals.
- Make hover enhancements optional: every interaction must remain clear on touch and keyboard, and `:focus-visible` must stay obvious.
- Respect content: do not delay essential copy, navigation, form errors, or core CTA availability merely to stage an animation.

## Baseline Timing

Use these as starting points, then tune against the interaction and brand:

| Context | Duration | Default easing |
| --- | ---: | --- |
| Press, hover, focus feedback | 120–180ms | `cubic-bezier(.2,.8,.2,1)` |
| Menus, tabs, accordions, cards | 180–320ms | `cubic-bezier(.22,1,.36,1)` |
| In-view editorial reveal | 400–650ms | `cubic-bezier(.16,1,.3,1)` |
| Major hero or route transition | 650–1000ms | `cubic-bezier(.16,1,.3,1)` |

Do not treat these as a license to animate. Avoid durations above one second unless the user is intentionally watching a story sequence and can still act immediately.

## Pattern Guidance

### Reveal and hierarchy

Reveal a group once, near the viewport threshold, with opacity plus a small transform. Stagger only siblings that form one reading sequence. Never hide critical content indefinitely if JavaScript fails; use a no-JS-visible baseline.

### Controls and state changes

Make buttons press by 1–2% and give icons a small directional translation only when it reinforces the action. Menus, dialogs, and accordions should preserve focus management and use `aria-expanded`, `aria-controls`, or native dialog behavior; motion must not replace semantic state.

### Cards and media

Use a restrained lift or image scale inside an overflow mask. Avoid perpetual float, aggressive tilt, glow, or a matching scroll reveal on every card. Maintain tap targets and avoid using hover as the only way to expose information.

### Scroll storytelling

Use sticky/pinned sequences only where progress through a concept benefits comprehension. Bind movement to scroll sparingly, cap movement on small screens, avoid scroll-jacking, and test with keyboard scrolling. Prefer CSS `scroll-timeline` only when browser support and fallback are acceptable; otherwise use a minimal observer/timeline.

### Forms and asynchronous work

Animate focus, validation, and success only enough to make the state legible. Keep errors visible until corrected, announce meaningful changes through an appropriate live region, and never use motion as the sole error cue. Do not block submission with ornamental animation.

### Navigation and layout transitions

Preserve spatial continuity only when users benefit from understanding where content moved. Keep outgoing and incoming states interruptible, prevent duplicate navigation during staged transitions, and ensure focus lands at the correct destination. Do not animate layout from stale measurements or make route content unavailable while animation code loads.

### Gestures and direct manipulation

Keep the controlled element attached to input, constrain movement to meaningful axes, and provide obvious snap, cancel, and boundary behavior. Preserve a non-gesture alternative for essential actions. Use spring motion only where velocity and physical continuity help users understand the result.

## Accessibility and Responsive Behavior

- Build a reduced-motion path deliberately: remove parallax, large translation, scroll-linked effects, nonessential looping, and lengthy staging. Preserve instant or short opacity/state feedback when it aids understanding.
- Scope reduced-motion rules to the components or motion utilities you own. Do not apply an indiscriminate global `*` override that can break third-party controls, assistive interactions, or necessary transitions.
- Reduce travel, blur, and concurrent effects below the mobile breakpoint. Treat hover as progressive enhancement and prioritize immediate touch feedback and scroll responsiveness.
- Avoid autoplay or looping media that cannot be paused. Preserve readable contrast and visible focus throughout animated states.

Use the CSS and React implementation patterns in [implementation.md](references/implementation.md) whenever writing code or reviewing implementation details.

## Delivery Standard

When designing, specify the trigger, purpose, timing/easing, properties, mobile behavior, and reduced-motion alternative for every nontrivial motion pattern. When coding, deliver the working implementation, reusable tokens/primitives where appropriate, and avoid placeholder comments such as “add smooth animation.”

Before finishing, verify that motion is consistent, interruptible, optional where appropriate, meaningful without sound, usable without motion, and smooth on a representative low-end mobile profile. Check for layout shift, excessive main-thread work, stale observers/listeners, hydration regressions, and user-visible focus or state regressions. Never claim performance improvement without profiling the affected interaction.
