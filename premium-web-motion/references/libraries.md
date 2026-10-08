# Motion Libraries & Ecosystem Evaluation

Read when: You are selecting between Motion (React/Vanilla), GSAP, Lenis, and native CSS for a project.

---

## 1. Decision Matrix

| Requirement | Recommended Tool | Rationale |
| --- | --- | --- |
| **Modern React / Next.js Apps** | **Motion** (`motion/react`) | Native React 19 support, declarative gesture bindings, automatic FLIP layout animations, tiny footprint. |
| **Complex SVG / Timeline Choreography** | **GSAP 3.12+** | Unrivaled timeline control, SVG path morphing (`MorphSVG`), smooth layout FLIP (`Flip`). |
| **Inertia Smooth Scrolling** | **Lenis** | Lightweight (3KB), accessible, does not hijack native keyboard/touch navigation. |
| **Simple Micro-Interactions & Popovers** | **Native CSS** | Zero runtime overhead using `@starting-style` and `linear()` spring generator. |
| **Liquid Distortion & WebGL Effects** | **Curtains.js / OGL / Three.js** | GPU fragment shaders for fluid ripples, magnetic noise, and organic particle mesh. |

---

## 2. Lenis + GSAP ScrollTrigger Integration

```javascript partial
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  return lenis;
}
```
