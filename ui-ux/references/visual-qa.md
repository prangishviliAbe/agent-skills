# Render, inspect, refine

Read when: Implementing visual changes or deciding whether a styled screen is ready to deliver.

## Evidence workflow

1. Open the actual artifact with available preview/browser tools. Wait for relevant fonts, data, and images. Record the page, viewport, state, and any synthetic content.
2. Inspect the whole screen for priority and rhythm, then detail crops for type, alignment, borders, controls, and image quality.
3. Inspect representative narrow, intermediate, and wide layouts and affected states. Add the failing width and nearby widths rather than collecting redundant screenshots.
4. Compare the render with the intended direction or supplied reference. Transfer principles; do not treat a reference as permission to copy identity.
5. Fix observed defects in the source and inspect again. Maintain a short issue log when several corrections interact.
6. Test the changed behavior where it matters: keyboard focus, open/close, validation, pending, long text, reduced motion, or zoom.

A browser screenshot is evidence of one rendered state. A DOM measurement can establish overflow, not overall aesthetic quality. A build only establishes compilation. Do not substitute one for the other.

## Completion gate

| Severity | Examples | Action |
| --- | --- | --- |
| Blocker | Unreachable action, unreadable text, broken focus, hidden critical data, fabricated proof | Fix before delivery; if blocked by missing access, disclose the exact limit |
| Major craft defect | Wrong hierarchy, obvious misalignment, repeated spacing inconsistency, awkward clipping/crop, prohibited decoration | Refine and inspect again |
| Minor polish | Small optical adjustment with no task impact | Resolve within the requested polish scope; avoid an unrelated redesign |

Do not mark implemented styling complete with unresolved blockers or major defects in the changed scope. If a tool or artifact is unavailable, finish the authorized source/specification work and state visual QA **Not run**; do not claim it passed.

## Review artifact

```text
Artifact: shipment lookup screen, local preview
Viewport/state: 360 CSS px, Georgian, long tracking ID
Observed: Form action wraps and loses alignment with the field.
Correction: Stack controls at the content-fit breakpoint; preserve target size.
Recheck: Same state plus adjacent width, focus-visible, and pending label.
Outcome: Verified after inspection; screen-reader behavior Not run.
```

Avoid numeric beauty scores without a calibrated rubric. "Premium" is demonstrated through coherent decisions and corrected visible defects, not a 10/10 label.
