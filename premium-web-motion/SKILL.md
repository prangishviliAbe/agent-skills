---
name: premium-web-motion
description: >-
  Architect and implement innovative, exotic, and ultra-refined web motion and physics. Covers
  spring dynamics (CSS linear() spring generator), magnetic cursors, 3D card tilt with specular
  reflection, text scramble reveals, View Transitions API, native scroll-driven animations
  (animation-timeline), SVG path morphing, Apple-style dock magnification, WebGL shader ripples,
  velocity-aware gesture dismiss, and 120fps compositor performance with strict reduced-motion
  accessibility. Use when adding cutting-edge animations, transitions, gestures, micro-interactions,
  or auditing web performance for silky-smooth 120fps frame rates.
---

# Premium Web Motion & Physics

Elevate user interfaces with innovative, exotic, and mathematically refined motion. Reject robotic, linear, or cliché transitions in favor of authentic spring physics, organic choreography, and fluid micro-interactions that feel alive and tangible under user input.

## Core Directives

1. **Physics Springs Over Hardcoded Bezier Curves:** Real physical objects have mass, tension, and damping. Use spring dynamics—either via the modern CSS `linear()` spring generator or motion engines (Motion / GSAP)—rather than arbitrary cubic-bezier curves.
2. **120fps Compositor-Only Execution:** Only animate compositor-friendly properties: `transform` and `opacity`. Never animate layout geometry (`width`, `height`, `margin`, `top`, `left`) or paint properties (`box-shadow`, `filter`) without GPU isolation.
3. **Innovative & Exotic Micro-Interactions:** Integrate distinct motion signatures: magnetic button pull, 3D card tilt with mouse-tracking specular reflection, text character decode scrambles, dynamic border beams, and Apple-grade dock magnification.
4. **Interruption-Safety & Velocity Continuity:** Animations must never lock user input. If a user interrupts an in-flight transition or drags with momentum, the animation must inherit velocity and seamlessly retarget without visual snapping.
5. **View Transitions & Seamless Morphs:** Use the native View Transitions API (`document.startViewTransition`) for shared-element page transitions and card-to-modal expansions.
6. **Native Scroll-Driven Scrubbing:** Replace heavy scroll listeners with native CSS `animation-timeline: view()` and `scroll()` for GPU-driven parallax, sticky stacking, and scroll progress.
7. **Strict Reduced-Motion Accessibility:** Every motion effect must gracefully degrade when `@media (prefers-reduced-motion: reduce)` is enabled. Keep the state change instantaneous or gentle fade without kinetic motion.

## Motion Tier Hierarchy

```text
Micro-Feedback   (100ms - 180ms) ──► Button press, toggle switch, micro-check, icon morph.
Tactile Response (200ms - 320ms) ──► Menus, hover lifts, tooltips, segmented pill slides.
Layout Morph     (350ms - 550ms) ──► Modal expand, card-to-sheet expansion, drawer slide.
Ambient Flow     (600ms - 900ms) ──► Page transition, hero scroll scrub, floating particles.
```

## Quick Reference Map

| Topic | What it covers | Reference file |
| --- | --- | --- |
| **Motion System** | Spring parameters (stiffness, damping, mass), CSS `linear()` generator, tokens | [motion-system.md](references/motion-system.md) |
| **Exotic Recipes** | Magnetic buttons, 3D tilt, text scramble, view transitions, shaders, dock hover | [recipes.md](references/recipes.md) |
| **Implementation** | Motion (Framer Motion v11+), GSAP (ScrollTrigger/Flip), Modern Vanilla CSS | [implementation.md](references/implementation.md) |
| **Performance** | 120fps compositor rules, avoiding layout thrashing, `will-change` lifecycle | [performance.md](references/performance.md) |
| **Libraries** | Choosing between Motion, GSAP, Lenis, and native CSS | [libraries.md](references/libraries.md) |

## Failure Modes & Countermeasures

| Failure | Correct Move |
| --- | --- |
| Jerky layout recalculation when animating dimensions | Use the FLIP technique (First, Last, Invert, Play) via `transform: scale()` or View Transitions. |
| Robotic, artificial `ease-in-out` transitions | Switch to a damped spring formula: stiffness `300`, damping `26`, mass `1`. |
| Unresponsive UI that blocks clicks while animating | Make transitions interruptible; cancel prior tweens and preserve instant event handling. |
| Animating heavy `filter: blur()` or multi-stop `box-shadow` directly | Pre-render layers and animate `opacity` between rendered states on separate compositor layers. |
| Page ignoring user's vestibular disorder preference | Wrap all transform-based motion in `@media (prefers-reduced-motion: no-preference)`. |

## Definition of Done

- [ ] All animations run strictly on the GPU compositor (`transform`, `opacity`) maintaining 60–120fps.
- [ ] Natural spring physics or custom `linear()` springs replace artificial linear transitions.
- [ ] Exotic motion recipes (magnetic pull, 3D tilt, view transitions, or scroll scrubbing) implemented cleanly.
- [ ] In-flight animations are interruption-safe and inherit user gesture velocity.
- [ ] Full graceful degradation provided for `@media (prefers-reduced-motion: reduce)`.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
