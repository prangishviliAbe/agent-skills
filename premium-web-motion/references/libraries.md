# Libraries: when to add one, and the pitfalls

Read when choosing or integrating an animation library, smooth scrolling, Lottie, Rive, or 3D. Reuse what the project already ships; add a dependency only when it provides a capability you cannot get from CSS or the Web Animations API at acceptable cost. Check bundle weight, the installed version, and the license terms before adopting.

## Decision table

| Need | Prefer | Notes |
| --- | --- | --- |
| Hover, focus, small state changes, native dialogs and popovers | CSS | No bundle cost; see [recipes.md](recipes.md) |
| A few imperative animations with cancel and finish control | Web Animations API | Built in; `animation.finished` rejects with `AbortError` on cancel |
| React enter and exit, shared layout, gestures, springs | Motion (`motion/react`) | Layout animation measures at render, so profile it; keep client boundaries narrow |
| Complex timelines, scroll-pinned sequences, SVG morphing | GSAP | Strong for choreography; confirm current license terms |
| Illustrations and icon animation exported from a design tool | Lottie or dotLottie | Watch file size; pause offscreen; provide a static fallback |
| Interactive state-driven vector animation | Rive | State machines map well to UI state; lazy-load the runtime |
| 3D scenes | Three.js or React Three Fiber | Heavy; lazy-load, give a still-image fallback, pause offscreen |

## Motion (React)

- Server output reflects the initial state. `initial={{ opacity: 0 }}` on server-rendered content hides it until hydration, so keep critical content visible on first render (`initial={false}` or animate later, user-triggered changes).
- For exits use the library's presence component with stable keys; make sure removed content cannot keep focus or stale handlers.
- Read the reduced-motion preference through the library's hook and remove travel, not only duration. Use the same duration tokens as CSS, remembering CSS uses milliseconds and the library uses seconds.

## GSAP

- Scope and clean up every tween and trigger. In React use the official integration hook with a scope ref, or `gsap.context()` and `revert()` on unmount, so Strict Mode's setup, cleanup, setup cycle does not duplicate animations.
- ScrollTrigger pins and measurements depend on layout; refresh them after fonts, images, and dynamic content change, and test resize and reverse scroll.
- Respect reduced motion with `gsap.matchMedia()` so reduced users get a static or minimal version.

## Smooth scrolling (Lenis and similar)

Smooth-scroll libraries replace native scrolling, which affects keyboard scrolling, find in page, anchor links, scroll restoration, touch behavior, and assistive technology. Adopt only for a clear product reason, disable it under reduced motion, keep native behavior for nested scrollers, and test anchor links and focus-driven scrolling. A site rarely needs it.

## Lottie, Rive, and 3D

- Lazy-load the runtime and the asset, reserve the box size to avoid layout shift, pause when offscreen or when the tab is hidden, and provide a static poster under reduced motion.
- For 3D: render on demand rather than every frame when the scene is idle, cap pixel ratio, dispose geometries and textures on unmount, and keep the page usable if WebGL is unavailable.
- Measure on a mid-range phone, not only a desktop GPU.

## Before you add any of them

1. Can CSS or WAAPI do this? Try it first.
2. What is the added JavaScript weight and runtime cost on the target device?
3. Does it work with server rendering, route changes, and hydration in this stack?
4. How is it cleaned up, and how does it respect reduced motion?
