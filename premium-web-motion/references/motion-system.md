# Motion system: duration, easing, springs, tokens

Read when: Choosing or tuning timing and curves, defining motion tokens, or sequencing several elements.

Values here are starting points that hold up across most products. Tune by watching the real interaction at full speed on a mid-range device, and keep the result as tokens.

## Duration

| Interaction | Enter | Exit | Notes |
| --- | --- | --- | --- |
| Press, toggle, checkbox, color or opacity feedback | 80 to 120ms | same | Must feel instant; start on pointer down where possible |
| Hover feedback | 100 to 150ms | same or slightly longer | No delay on enter |
| Tooltip | 100 to 150ms after an intent delay | 75 to 100ms | Delay of roughly 300 to 500ms before showing; none when moving between adjacent tooltips |
| Menu, popover, dropdown | 120 to 180ms | 80 to 120ms | Scale and fade from the trigger |
| Accordion, disclosure | 200 to 280ms | 160 to 220ms | Scale with content height; cap it |
| Toast, banner | 200 to 260ms | 150 to 200ms | From the edge it lives on |
| Dialog, sheet, drawer | 200 to 300ms | 150 to 220ms | Larger surfaces and longer travel sit at the top of the range |
| Page or view transition | 200 to 350ms | part of the same transition | Cross-fade plus a small directional shift |
| Reorder, layout shift | 200 to 300ms | n/a | Proportional to distance, capped |
| Skeleton to content | 150 to 200ms fade | n/a | No movement |

Principles behind the numbers:

- **Exits are faster than entrances**, roughly 70 to 80 percent. The user has already decided; do not make them watch.
- **Distance and size earn time.** A full-height sheet needs more than a tooltip. If one token must serve both, the small one will feel slow.
- **Frequency removes time.** Something triggered constantly (tab switch, keyboard navigation, command palette) gets the shortest duration or none.
- **Above about 400ms, interface motion reads as slow.** Longer durations belong to narrative or brand moments that the user chose to watch.
- **Under about 80ms, motion is not perceived as motion**; use an instant change.

## Easing

| Situation | Curve | Example value |
| --- | --- | --- |
| Element enters or grows | Ease-out (fast start, gentle stop) | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Emphasized entrance of a large surface | Stronger ease-out | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Element leaves | Ease-in (accelerates away) or a quick fade | `cubic-bezier(0.4, 0, 1, 1)` |
| Element moves between two on-screen positions or resizes | Ease-in-out | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Opacity, color, progress bars | Linear or a mild ease | `linear` |
| Direct manipulation release, drag settle | Spring | Engine-specific; see below |

Rules:

- The keyword `ease` and the `ease-in-out` keyword are soft compromises; named tokens with deliberate curves look more decisive.
- Never ease-in an entrance. A slow start feels like lag.
- No overshoot (a control point above 1) on ordinary interface elements: menus, dialogs, cards, text. Overshoot belongs only to playful brands and to physical gestures, and even there it is small.
- Use one or two curves for almost everything. Variety in curves reads as inconsistency.
- Apply easing to the property that moves. Opacity can run shorter and more linear than the transform it accompanies, so the element is readable before it settles.

## Springs

A spring is defined by physics instead of a duration, so it can inherit velocity from a gesture and be retargeted mid-flight without a visible jump. Use it for dragging, swiping, pull-to-dismiss, and anything that follows the pointer. For discrete state changes a short ease-out curve is simpler and equally good.

| Feel | Characteristics | Use |
| --- | --- | --- |
| Critically damped (no bounce) | Fast, settles without overshoot | Default for UI: sheets, drawers, reorder |
| Slightly underdamped | One small overshoot | Playful confirmation, a thrown card settling |
| Loose, bouncy | Several oscillations | Rarely; never on text or data |

Parameter names and scales differ between engines (stiffness and damping, or duration and bounce). Read the installed library's documentation and tune by feel; values do not transfer between libraries. For reference, damping ratio is `damping / (2 * sqrt(stiffness * mass))`: 1 is critically damped, below 1 overshoots.

CSS `linear()` can approximate a spring's shape for a fixed-duration animation. It does not carry gesture velocity and does not retarget physically, so use it only for non-interactive transitions.

## Tokens

```css
:root {
  --dur-instant: 80ms;
  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-slow: 280ms;

  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-out-strong: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  --shift-s: 4px;
  --shift-m: 8px;
  --shift-l: 16px;
  --scale-in: 0.97;
}
```

Use the tokens in every transition and in JavaScript (read them with `getComputedStyle` or mirror them in one constants file). If the project already has motion tokens, extend those instead of adding a second set.

## Distance and scale

| Element | Typical offset |
| --- | --- |
| Tooltip, menu, popover | 4 to 8px toward its final position, scale 0.96 to 0.98 |
| Dialog | 8 to 16px, or scale 0.96 to 0.98, plus fade |
| Toast | Its own height or 16 to 24px from the edge |
| Sheet or drawer | Its full size (it is attached to an edge) |
| Page content on navigation | 8 to 24px in the direction of travel, plus cross-fade |

Fade alone is often enough. Add movement only when direction carries meaning (it comes from there, it goes back there).

## Choreography

- Animate the container, not each child. One surface moving reads cleaner than twelve elements arriving separately.
- Stagger only when order helps comprehension, such as a short list appearing after a search. Use 20 to 40ms between items, cap the total near 200ms, and apply it to the first handful of items; the rest appear with the group.
- When one element leaves and another enters the same place, overlap them slightly or cross-fade. Sequential exit-then-enter doubles the wait.
- Related elements share duration and curve so they read as one movement.
- Nothing choreographed may block input. The user can act on the final state before the animation ends.

## Tuning procedure

1. Slow playback to about 10 percent (browser dev tools animation panel, or temporarily multiply durations) and check the path: origin, direction, overlap, anything popping.
2. Return to full speed and judge feel on a mid-range device or with CPU throttling.
3. Trigger it ten times in a row. If it has become annoying, shorten it or remove movement and keep the fade.
4. Reverse it mid-flight. If it jumps, fix the implementation before touching timing.
5. Record the final values as tokens.
