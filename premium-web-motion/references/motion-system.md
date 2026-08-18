# Motion system: character, tokens, choreography

Read before writing any motion code, and when auditing an inconsistent motion layer.

## Motion character

Pick one and hold it. Character is expressed through four variables — distance, tempo, easing, and sequencing — not through different effects per section.

| Character | Distance | Tempo | Easing | Reads as |
| --- | --- | --- | --- | --- |
| Calm / editorial | small (8–16px) | slow-ish (400–600ms reveals) | soft ease-out | considered, quiet, premium |
| Precise / technical | very small (4–8px) | fast (120–240ms) | near-linear ease-out | responsive, engineered, tight |
| Tactile / product | small, with scale | fast, springy | spring, low bounce | physical, immediate, app-like |
| Playful | larger, with rotation or overshoot | fast with a bounce | spring with visible overshoot | energetic, informal |
| Cinematic | large, on few elements | slow (600–900ms) | strong ease-out | dramatic, staged, story-driven |
| Utilitarian | minimal or none | 100–160ms | ease-out | invisible, fast, workmanlike |

A page with calm reveals, springy buttons, and a cinematic hero has no character — it has three. Choose one and let the others be quiet.

## Token contract

```css
:root {
  /* duration */
  --motion-instant: 120ms;   /* press, hover, focus */
  --motion-fast:    180ms;   /* small state changes */
  --motion-base:    260ms;   /* menus, tabs, tooltips */
  --motion-slow:    420ms;   /* dialogs, sheets, reveals */
  --motion-story:   720ms;   /* hero, route, narrative */

  /* easing */
  --ease-out:        cubic-bezier(.2, .8, .2, 1);
  --ease-emphasized: cubic-bezier(.16, 1, .3, 1);
  --ease-in:         cubic-bezier(.4, 0, 1, 1);
  --ease-in-out:     cubic-bezier(.4, 0, .2, 1);

  /* distance */
  --motion-travel-xs: 4px;
  --motion-travel-sm: 8px;
  --motion-travel-md: 16px;
  --motion-travel-lg: 24px;

  /* choreography */
  --motion-stagger: 60ms;
}
```

Rules:

- Components reference tokens, never literal values. A literal `0.3s` in a component is drift.
- If a value is not in the scale, either the scale is wrong or the animation is special — decide which, do not silently add a sixth duration.
- Reuse the project's existing token names if it has any. Two competing motion systems is worse than one imperfect one.

## Duration by distance

Duration follows travel distance, not importance. A large element moving a short distance is still a short animation.

| Travel | Duration |
| --- | --- |
| 0–8px | 120–180ms |
| 8–24px | 180–280ms |
| 24–100px | 280–450ms |
| Full viewport | 450–800ms |

Exits run roughly 20–30% faster than entrances: the user has already decided, and waiting for something to leave feels slow.

## Choreography

- **Stagger only true siblings** that form one reading sequence, at 40–80ms. Longer intervals read as a slideshow.
- **Cap the stagger**: after roughly five items, the last one arrives too late to feel connected. Reveal the group instead.
- **One focal motion per view.** If three things animate at once, none of them is emphasized.
- **Sequence by meaning**, not by DOM order: the thing the user needs first arrives first.
- **Overlap, do not queue.** Starting the second element at 60% of the first creates continuity; waiting for completion creates a wait.
- **Match the direction to the mental model.** A panel from the right leaves to the right. A step forward moves forward; back moves back.

## The motion inventory

Write this table before implementing. It is the deliverable for a motion design task and the artifact that keeps a motion layer consistent as a team grows.

```
Name             Trigger            Job        Properties          Duration/Easing        Interrupt        Reduced motion       Risk
nav-open         click / Enter      orient     transform, opacity  260ms ease-emph        reverse instantly opacity only        low
card-hover       pointer hover      confirm    transform           140ms ease-out         reverse           none                 low
hero-reveal      in view, once      reveal     transform, opacity  520ms ease-emph        skip to end       visible immediately  medium (LCP)
route-change     navigation         connect    view transition     380ms ease-emph        cancel prior      cross-fade only      medium
upload-progress  request lifecycle  progress   width (determinate) linear                 n/a               unchanged            low
```

Rows with an empty "Job" column are removed. That column is the entire point of the exercise.

## Auditing an inconsistent motion layer

```bash
# literal durations that should be tokens
grep -rnE "transition[^;]*[0-9.]+m?s" src | grep -v "var(--motion"

# the blunt instrument
grep -rn "transition: all" src

# global reduced-motion overrides that break third-party UI
grep -rn "prefers-reduced-motion" src -A3 | grep -n "\*"

# stray keyframes that duplicate a system primitive
grep -rn "@keyframes" src
```

Then consolidate: count the distinct durations and easings in use. More than five durations or four easings means there is no system yet — there is an accumulation.
