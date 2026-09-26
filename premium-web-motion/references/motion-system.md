# Motion system: character, tokens, choreography

Use for a new motion system or an inconsistency audit. A local fix should reuse the existing system without requiring this entire process.

## Character and hierarchy

Choose a dominant character from the product's purpose: restrained for reading, precise for repeated work, tactile for manipulation, expressive for a requested story. Allow different tempos for different jobs; coherence does not require a button and a hero to share a duration.

Express character through distance, tempo, easing, and sequencing. Preserve immediate response for frequently used controls regardless of the visual style. Identify the focal change and reduce competing motion around it.

## A small starting vocabulary

Reuse existing token names and values. If none exist, these are examples to tune, not mandatory scales:

```css
:root {
  --motion-feedback: 140ms;
  --motion-state: 220ms;
  --motion-layer: 320ms;
  --motion-ease-out: cubic-bezier(.2, .8, .2, 1);
  --motion-ease-in-out: cubic-bezier(.4, 0, .2, 1);
  --motion-travel-small: 8px;
  --motion-travel-medium: 16px;
}
```

- Map repeated behavior to shared tokens. A justified one-off effect need not create a reusable token.
- Give JavaScript animations the same source of truth where practical; preserve unit conversion between CSS milliseconds and library seconds.
- Tune duration using input frequency, travel, and perceptual continuity. Distance alone does not determine it.
- Tune springs by settling behavior, overshoot, and interruption continuity. Do not present duration and spring parameters as interchangeable controls across libraries.
- For reduced motion, explicitly remove spatial effects at the component or owned utility level. Changing duration to 1ms can still produce an abrupt movement and does not remove delays.

## Choreography

Calculate the last item's arrival: `initial delay + (item count − 1) × stagger + duration`. A 60ms stagger across 30 items adds 1.74 seconds before the final item starts. Bound total waiting time or reveal a group; do not blindly apply a fixed stagger to arbitrary data.

Sequence by meaning and reading order. Preserve logical document order, and match spatial direction to the actual interaction, writing mode, and navigation model. A decorative direction does not need to mirror in RTL; navigation direction may.

Animate one focal change when attention is scarce. Parallel motions can be appropriate when explaining a connected change. Do not delay an actionable element to complete a visual composition.

For long narratives, define entry, pause/skip, resize, reverse scroll, and static/reduced-motion behavior. A sequence's length follows the content and user control, not an arbitrary number of viewport heights.

## Motion inventory

For a system, record one row per reusable behavior, not every DOM instance:

| Behavior / purpose | Trigger / semantic state | Properties / timing | Interruption | Reduced motion / fallback | Verification risk |
| --- | --- | --- | --- | --- | --- |
| Menu opens near trigger / orientation | Activate; expanded immediately | Small transform + opacity; state token | Reverse from current value; stale exit cannot hide reopened menu | Immediate open; existing menu still works without motion | Focus, Escape, hidden items |
| Card press / feedback | Pointer or keyboard activation | Subtle transform; feedback token | Release or cancel settles immediately | Color or immediate state | Competing hover/drag transform ownership |
| List reorder / continuity | Data order changes immediately | Position transforms; state token | New measurement includes current visual position | Immediate final order | Focus, stable keys, layout measurement |
| Upload / progress | Actual request progress | Determinate fill; no invented progress | Superseded request cannot update new one | Numeric/text progress remains | Announcements, cancellation, unknown total |

A design handoff should include the implementation choice, dependencies, ownership of animated properties, target support, and checks still needed. Keep the inventory current with the actual shipped behavior.

## Audit and consolidation

Search existing code for animation declarations, inline durations, transition classes, timers, observers, and library calls. Inspect usages before editing: a timer may manage data, not decoration.

Group findings by impact:
1. Incorrect state, focus, hidden content, stale callbacks, or missing motion alternative.
2. Input delay, layout work, unnecessary concurrent effects, or lifecycle leaks.
3. Inconsistent timing, easing, and choreography.

Consolidate repeated behavior with a clear owner. A large count of duration values is a clue to inspect, not proof of a broken system. Preserve a documented exception when it serves the interaction.
