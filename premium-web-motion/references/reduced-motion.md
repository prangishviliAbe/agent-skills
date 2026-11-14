# Reduced motion and motion safety

Read when: Adding any animation, or auditing a site for motion accessibility.

Some people get dizzy, nauseous, or distracted by on-screen movement, and they say so through the operating system's reduced-motion setting. Honoring it is a WCAG expectation and part of the design, not an afterthought. Reduced motion does not mean no feedback: it means no travel, zoom, or spin.

## What to change

| Motion | Reduced variant |
| --- | --- |
| Slide, scale, or rotate entrances and exits | Short fade (about 80 to 150ms) or instant |
| Page and view transitions with movement | Cross-fade or instant |
| Reorder and layout animation | Instant |
| Parallax, scroll-linked movement, zoom on scroll | Removed |
| Autoplaying, looping, or background animation and video | Stopped, with a play control if the content matters |
| Smooth scrolling | Instant jump |
| Spinner and determinate progress | Kept; they convey state. A spinner may be replaced by text for very long waits |
| Color, opacity, and underline feedback | Kept |
| Direct manipulation (drag follows the finger) | Kept while dragging; settle instantly on release |

Large movement across the screen, scaling of large areas, and anything that moves while the user scrolls are the main triggers. Small opacity and color changes are generally safe.

## CSS

Write motion so the reduced variant is explicit per component. Two workable structures:

```css
/* A: default includes motion; override per component */
.drawer {
  transition: transform var(--dur-base) var(--ease-out), opacity var(--dur-base) linear;
}
@media (prefers-reduced-motion: reduce) {
  .drawer { transition: opacity var(--dur-fast) linear; transform: none; }
}

/* B: default is static; motion is opt-in */
.card-link { transition: background-color var(--dur-fast) linear; }
@media (prefers-reduced-motion: no-preference) {
  .hero-figure { animation: settle var(--dur-slow) var(--ease-out) both; }
}
@keyframes settle {
  from { opacity: 0; transform: translateY(var(--shift-m)); }
}

html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

Structure B is the safer default for anything decorative: if the query is unsupported or forgotten, the result is the static version.

Avoid the blanket reset that forces every animation and transition to near-zero duration with `!important`. It leaves keyframe end states and iteration counts in odd conditions, breaks code that waits for `transitionend`, and does nothing about JavaScript-driven motion. If a legacy codebase needs a stopgap, scope it and still fix components individually.

## JavaScript

CSS media queries do not reach animations started in script, library tweens, canvas, WebGL, or video.

```javascript
const query = matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => query.matches;

export function onMotionPreferenceChange(callback) {
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
```

- Check the preference at the time of each animation, not once at load; users change it during a session.
- When the preference turns on, stop running loops and move elements to their final state.
- Libraries usually offer a setting: a global reduced-motion configuration or hook in React animation libraries, a `matchMedia` helper in timeline libraries. Use it, and verify what it actually disables, since some only remove transforms and keep opacity.
- Autoplaying video: do not start it under reduced motion; show the poster and a play button.

## Beyond the preference

These apply to everyone, whatever their setting.

| Rule | Reason |
| --- | --- |
| Anything that moves, blinks, or scrolls automatically for more than 5 seconds alongside other content can be paused, stopped, or hidden | WCAG 2.2.2 |
| Nothing flashes more than three times per second | Seizure risk, WCAG 2.3.1 |
| Motion triggered by interaction can be disabled unless essential | WCAG 2.3.3 (AAA), and good practice |
| No motion triggered by device tilt or shake without an alternative and an off switch | WCAG 2.5.4 |
| Animation never delays reading or acting | Usability |
| Focus is never moved or lost by an animation | Keyboard and screen reader users |
| Carousels do not auto-advance; if they must, they pause on hover and focus and have a visible pause control | Reading time and control |

## Testing

1. Turn on the operating system setting, or emulate it in browser dev tools (rendering panel: emulate `prefers-reduced-motion`).
2. Walk through every animated interaction in scope. Each should still communicate its state change.
3. Confirm nothing is stuck invisible or mid-state. This catches code that waited for an animation that no longer runs.
4. Toggle the setting while the page is open; loops should stop.
5. Check script-driven motion separately: scroll effects, canvas, video, library animations.

Report which interactions were checked under reduced motion and which were not.
