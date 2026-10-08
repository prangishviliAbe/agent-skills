# Modern Motion System & Spring Physics

Read when: You are defining motion tokens, calculating spring physics parameters, configuring CSS `linear()` springs, or choreographing staggered element entrances.

---

## 1. Physics-Based Springs: Principles & Parameters

CSS `cubic-bezier()` functions are time-constrained curves that cannot model realistic momentum or overshoot. Real physical springs are defined by three parameters:

$$\omega_0 = \sqrt{\frac{k}{m}}, \quad \zeta = \frac{c}{2\sqrt{km}}$$

- **Stiffness ($k$):** The tension of the spring. Higher values snap back faster. (Standard: `180` to `400`).
- **Damping ($c$ / $\zeta$):** The frictional resistance.
  - $\zeta < 1$: Underdamped (bouncy overshoot).
  - $\zeta = 1$: Critically damped (fastest arrival without overshoot).
  - $\zeta > 1$: Overdamped (gentle, sluggish landing).
- **Mass ($m$):** The simulated weight of the object. Higher mass creates sluggish startup and high momentum. (Standard: `1.0`).

---

## 2. Native CSS `linear()` Spring Generator

Modern CSS supports `linear(...)` easing curves with multi-stop interpolation, allowing 100% native GPU-accelerated spring animations without JavaScript runtime overhead!

### The Snappy UI Spring (`stiffness: 300, damping: 24, mass: 1`)

```css
:root {
  /* Ultra-snappy tactile spring for buttons, hover states, and popovers */
  --ease-spring-snappy: linear(
    0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%,
    0.932 37.7%, 0.983 44.2%, 1.008 50.8%, 1.018 57.8%, 1.017 65.5%,
    1.008 74.3%, 1.002 84.4%, 1
  );

  /* Bouncy playful spring for badges, checkmarks, and celebratory toggles */
  --ease-spring-bouncy: linear(
    0, 0.009, 0.035 2.9%, 0.141 6.4%, 0.281 10%, 0.723 21.4%, 0.884 27.4%,
    0.977 33.7%, 1.034 40.4%, 1.057 47.7%, 1.053 55.8%, 1.033 64.9%,
    1.013 75.3%, 1.003 86.9%, 1
  );

  /* Smooth luxury ease for modal sheets and hero panels */
  --ease-luxury: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 3. Motion Duration Tiers

Match durations strictly to the physical scale of the moving element:

| Tier | Duration | Use Cases |
| --- | --- | --- |
| **Micro** | `120ms – 180ms` | Checkbox toggles, button press scale, icon swaps. |
| **Medium** | `220ms – 320ms` | Hover card lift, dropdown open, sliding tabs. |
| **Large** | `380ms – 520ms` | Modal dialog reveals, drawer sheets, card-to-hero expansions. |
| **Macro** | `600ms – 900ms` | Full-page view transitions, complex SVG morphs. |

---

## 4. Choreography & Spatial Stagger

When multiple elements enter the viewport, never animate them simultaneously—it feels robotic. Stagger their entrances based on reading direction or radial distance from the trigger:

```css
/* Cascading list entrance */
.stagger-item {
  opacity: 0;
  transform: translateY(16px);
  animation: enter-up 0.4s var(--ease-spring-snappy) forwards;
  animation-delay: calc(var(--index, 0) * 45ms);
}

@keyframes enter-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
