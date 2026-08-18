---
name: premium-web-motion
description: Design, audit, and implement purposeful premium website motion without copying a brand's visual identity. Use for UI animation, microinteractions, hover and press feedback, page and view transitions, scroll storytelling, gesture and drag behavior, loading and skeleton choreography, motion-system and token design, and motion performance or accessibility reviews in HTML/CSS/JavaScript, React, Next.js, and component libraries.
---

# Premium Web Motion

Motion is an interface layer, not a decoration layer. Its job is to explain: where something came from, what changed, what is still happening, and what the user just did.

Premium motion is recognized by restraint and responsiveness, never by quantity. The most common failure is not bad easing — it is animating things that did not need to move.

## Operating rules

1. **Every animation states its job** in one word: orient, reveal, confirm, connect, or report progress. If you cannot name it, delete it.
2. **Never block content.** Text, navigation, form errors, and the primary action are available immediately, before and regardless of any animation.
3. **Interruptible always.** A user action mid-animation takes over instantly. Nothing queues behind a stale transition.
4. **`transform` and `opacity` first.** Animating layout properties (`width`, `height`, `top`, `left`, margins) causes reflow and jank. `filter` and `box-shadow` are expensive — use sparingly and verify.
5. **Reduced motion is a designed path, not a global kill switch.** Remove travel, parallax, scroll-linked effects, and looping; keep short opacity and state feedback so the interface still explains itself.
6. **Motion never carries meaning alone.** A state change that is only visible while it animates is invisible to anyone who missed it, and to assistive technology.
7. **The resting state must be complete.** If JavaScript fails or is slow, content is visible and usable. Never ship `opacity: 0` that depends on a script to undo.
8. **Never claim smoothness without profiling** the specific interaction on a representative device.

## Procedure

1. **Read the product**: content hierarchy, primary interactions, target devices, existing motion conventions, and whether a motion library is already present.
2. **Choose a motion character** — calm, precise, tactile, playful, cinematic, or utilitarian — and express it through a small vocabulary of distance, tempo, easing, and sequencing rather than assorted effects.
3. **Write the motion inventory** before writing code. One row per animation: trigger, job, properties, duration, easing, interruption, reduced-motion behavior, and performance risk. Rows without a job get cut here, which is the cheapest place to cut them.
4. **Define tokens** first, reusing the project's system if one exists. See [motion-system.md](references/motion-system.md).
5. **Pick the least complex implementation** that does the job (table below).
6. **Build reusable primitives**, not one-off keyframes scattered across pages.
7. **Validate**: keyboard, touch, compact viewport, RTL, `prefers-reduced-motion`, interruption, slow network, low-end device, and no-JS fallback.
8. **Report** the motion decisions alongside the code.

## Choose the smallest tool

| Need | Use |
| --- | --- |
| Hover, press, focus, and simple state changes | CSS transitions |
| Enter and exit on a class or attribute change | CSS transitions plus a state class, or `@starting-style` where support allows |
| Imperative sequences without a dependency | Web Animations API |
| Component lifecycle, exit animations, shared layout in React | Motion (Framer Motion) |
| Cross-document or cross-view continuity | View Transitions API, with a fallback |
| Scroll-linked effects | CSS scroll-driven animations where supported, otherwise a minimal IntersectionObserver |
| Genuinely complex, measured timelines with sequencing control | GSAP, only after the simpler options were considered and rejected |

Adding a 40KB animation library for a fade-in is a cost with no benefit. State the reason whenever you introduce one.

## Baseline timing

| Context | Duration | Easing |
| --- | --- | --- |
| Press, hover, focus feedback | 120–180ms | `cubic-bezier(.2,.8,.2,1)` |
| Menus, tabs, accordions, tooltips, cards | 180–320ms | `cubic-bezier(.22,1,.36,1)` |
| Dialogs, sheets, in-view reveals | 320–520ms | `cubic-bezier(.16,1,.3,1)` |
| Major hero or route transition | 500–900ms | `cubic-bezier(.16,1,.3,1)` |

Rules that go with the numbers: ease-out for arrivals, ease-in for departures, ease-in-out for movement that starts and ends on screen, springs only for direct manipulation, and never `linear` except for continuous indeterminate loops. Larger distance justifies longer duration; small movements at long durations feel broken. Exits run slightly faster than entrances.

Anything over one second must be either a deliberate narrative sequence the user chose to watch, or a bug.

## Reference map

| When the task involves | Read |
| --- | --- |
| Tokens, character, choreography, the motion inventory | [motion-system.md](references/motion-system.md) |
| Specific patterns: reveals, menus, dialogs, cards, scroll, gestures | [patterns.md](references/patterns.md) |
| Writing the code: CSS, WAAPI, React, view transitions | [implementation.md](references/implementation.md) |
| Profiling, budgets, jank, INP, reduced motion, verification | [performance.md](references/performance.md) |

Pair with `anti-ai-slop-design` for the visual layer and `web-development` for integration.

## Failure modes and the correct move

| Failure mode | Correct move |
| --- | --- |
| Every section fades up on scroll | Reveal one focal group; let the rest simply exist |
| A 600ms hover transition | 120–180ms. Direct feedback must feel immediate |
| Content hidden until an observer fires | Visible by default; enhance after the script confirms it is running |
| `transition: all` | Name the properties. `all` animates things you did not intend, including layout |
| Perpetual floating or pulsing | Tie motion to a state change |
| An intro sequence before the page is usable | Content first, motion second |
| A global `*` reduced-motion override | Scope it to your own motion utilities; a blanket override breaks third-party and assistive behavior |
| Animating `height: auto` | Animate a transform, `grid-template-rows: 0fr → 1fr`, or a measured max-height |
| A spinner that runs for 30 seconds | Progress, an estimate, or a cancel option |
| Scroll-jacking the page | Let the user own the scroll; bind to progress, do not seize it |

## Definition of done

- [ ] Every animation has a named job and appears in the inventory.
- [ ] Timing and easing come from tokens, not from ad-hoc values.
- [ ] Reduced-motion path designed and tested, scoped to owned components.
- [ ] Interruption tested with rapid, repeated input.
- [ ] Content is usable with JavaScript disabled or delayed.
- [ ] Keyboard focus lands correctly through every transition, dialog, and route change.
- [ ] Compact viewport reduces travel and concurrency; no hover-only affordance.
- [ ] Profiled on a representative device: no layout shift, no long tasks, observers and listeners cleaned up.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
