# Select the smallest motion mechanism

Read when: Choosing a motion dependency or integrating an existing animation engine.

| Need | First choice | Reason to add an engine |
| --- | --- | --- |
| Hover, focus, small reveal | Existing CSS | Usually none |
| Native dialog/popover | Native behavior + progressive CSS | Complex coordinated state requiring a tested existing primitive |
| Dynamic retargeting/gesture | Existing runtime spring or WAAPI controller | Needed behavior not supported cleanly by current tools |
| Multi-element timeline / complex SVG | Existing timeline library | Concrete choreography requirement |
| Shared-element navigation | Native view transitions if supported | Tested fallback with real semantic continuity |
| Smooth scrolling | Native scrolling | Explicit requirement and verified accessibility/restoration |
| WebGL material effect | No effect by default | Explicit visual brief and measured benefit |

Avoid claims of universal package size, compatibility, licensing, or accessibility. Verify the installed version, import path, tree-shaken bundle, current license, and target browser behavior using official documentation.

## Dependency decision artifact

```text
Needed behavior:
Current stack can/cannot support it because:
Candidate and installed/current version:
Bundle and runtime cost:
Keyboard/touch/reduced-motion path:
Cleanup ownership:
Fallback:
Decision and evidence:
```

Do not introduce Lenis, GSAP, Motion, or WebGL just because a page should feel premium. If already integrated, preserve the project's architecture and avoid duplicate frame loops.
