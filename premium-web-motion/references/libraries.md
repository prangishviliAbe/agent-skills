# Choosing a mechanism or library

Read when: Deciding how to implement motion, considering a new animation dependency, or working inside a project that already has one.

Use the smallest mechanism that meets the requirement, and use what the project already has before adding anything. A site does not become more refined by loading an animation library; it becomes heavier.

## Decision ladder

| Requirement | Mechanism |
| --- | --- |
| Feedback and two-state changes: hover, press, open and closed, selected | CSS transitions |
| Enter from `display: none` or the top layer | CSS `@starting-style` with discrete transitions, falling back to instant |
| One-shot or looping sequence with fixed timing | CSS keyframes |
| Computed start or end values, FLIP, programmatic control | Web Animations API |
| Scroll position drives progress | CSS scroll-driven animations, falling back to static |
| Continuity between views or pages | View Transitions API, falling back to instant |
| Velocity-aware gestures, springs, shared layout animation, exit orchestration in a component framework | A spring and layout library (for example Motion for React or Vue) |
| Authored multi-element timelines, complex SVG, scrubbed sequences | A timeline library (for example GSAP) |
| Designer-authored vector animation | A player for the exported format (for example Lottie or Rive), used sparingly |
| 3D or shader effects | WebGL or WebGPU through a library, only on explicit request |

Stop at the first row that satisfies the requirement.

## Before adding a dependency

```text
Requirement the platform cannot meet:
Existing project tools that could:
Candidate, version, and license:
Bundle cost (measured in this build, tree-shaken):
Runtime cost (loops, listeners, layers):
Reduced-motion support:
Cleanup model in this framework:
Fallback if it fails to load:
Decision:
```

If the first line cannot be written concretely, the dependency is not needed.

## Working with what is installed

Read the installed version from the lockfile and use that version's documentation. Animation libraries change names, import paths, and licensing between major versions; do not write API calls from memory.

| Library family | Strengths | Watch for |
| --- | --- | --- |
| Motion (formerly Framer Motion) | Declarative state-driven animation, springs, gestures, layout and shared-element animation, exit handling | Import path and package name depend on version; layout animation on large trees is costly; set the global reduced-motion behavior |
| GSAP | Precise timelines, sequencing, SVG, scroll-scrubbed sequences | Scope and revert in component lifecycles; do not change global ticker settings from a component; confirm current license terms for the plugins used |
| React Spring and similar | Physics-based values | Same ownership and cleanup rules |
| Auto-animate style helpers | Drop-in list transitions | Limited control; verify reduced-motion handling |
| Lottie, Rive | Complex authored illustration motion | File weight, CPU cost, no reduced-motion handling by default; pause off-screen |
| Smooth-scroll libraries (Lenis, Locomotive, and similar) | Scripted scroll | Replace native scrolling and frequently break keyboard scrolling, anchors, find-in-page, scroll restoration, and assistive technology. Do not add; if already present, verify each of those and keep a native path under reduced motion |
| Scroll-reveal helpers (AOS and similar) | Class-based entrance on scroll | The source of "everything fades up". Remove, or restrict to a deliberate few elements with visible fallbacks |
| CSS animation class packs | Prebuilt keyframes | Generic bounce and flip effects; do not use for interface motion |
| UI kits (Radix, Headless UI, shadcn/ui, MUI) | Components expose state attributes or transition hooks | Animate through their documented state attributes and CSS variables; do not fight their focus management |

Rules inside an existing setup:

- One engine per property per element. Do not let CSS transitions and a library both animate `transform` on the same node.
- Follow the project's patterns for tokens, variants, and cleanup; do not introduce a second style of doing the same thing.
- Do not start a second frame loop when the library already runs one.
- If the project's motion is the problem (decorative reveals everywhere), reduce it; do not layer more on top.

## Platform features and support

These are progressive enhancements. Check current support for the project's browser targets (the project's browserslist, MDN, or caniuse) and make sure the unsupported path is an instant, correct state change.

| Feature | Fallback |
| --- | --- |
| `@starting-style`, `transition-behavior: allow-discrete` | Element appears and disappears instantly |
| `interpolate-size`, `calc-size()` | Grid-rows technique or instant |
| `linear()` easing | A cubic-bezier curve |
| Scroll-driven animations (`animation-timeline`) | Static element, guarded by `@supports` |
| Same-document view transitions | Direct DOM update, guarded by a function check |
| Cross-document view transitions | Normal navigation |
| Native `popover` and anchor positioning | The project's existing popover primitive |

```css
@supports (animation-timeline: view()) {
  .figure { animation: reveal linear both; animation-timeline: view(); animation-range: entry 0% cover 30%; }
}
@keyframes reveal {
  from { opacity: 0.4; }
}
```

The fallback for the block above is the figure at full opacity, which is the correct default.

## When the answer is no library and no animation

A request for "more premium" motion on a page that is already slow, cluttered, or full of entrance effects is best answered by removing animation, shortening what remains, and fixing easing. Say so, do it, and show the before and after.
