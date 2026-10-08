# Innovative & Exotic Web Motion Recipes

Read when: You are implementing high-end, innovative, or exotic micro-interactions: magnetic buttons, 3D card tilt with specular parallax, text scramble reveals, View Transitions, scroll-driven scrubbing, or dock magnification.

---

## 1. Magnetic Button with Fluid Lerp

The button smoothly gravitates toward the user's cursor within a magnetic radius, snapping back via spring physics upon cursor exit.

```javascript partial
// Magnetic cursor pull implementation
export function initMagneticButton(buttonEl, strength = 0.35) {
  let rafId = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  function onMouseMove(e) {
    const rect = buttonEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    targetX = (e.clientX - centerX) * strength;
    targetY = (e.clientY - centerY) * strength;
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  function onMouseLeave() {
    targetX = 0;
    targetY = 0;
    buttonEl.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    buttonEl.style.transform = 'translate3d(0px, 0px, 0px)';
  }

  function update() {
    currentX += (targetX - currentX) * 0.18; // Smooth lerp
    currentY += (targetY - currentY) * 0.18;
    buttonEl.style.transition = 'none';
    buttonEl.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0px)`;

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      rafId = requestAnimationFrame(update);
    } else {
      rafId = null;
    }
  }

  buttonEl.addEventListener('mousemove', onMouseMove);
  buttonEl.addEventListener('mouseleave', onMouseLeave);
}
```

---

## 2. 3D Card Tilt with Specular Light Reflection

The card tilts in true 3D perspective following the mouse cursor, while a specular reflection gradient glides across its surface.

```css
.card-perspective-wrapper {
  perspective: 1000px;
}

.card-3d-tilt {
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
  border-radius: 20px;
  background: oklch(0.18 0.025 260);
  border: 1px solid oklch(1 0 0 / 0.1);
  overflow: hidden;
}

.card-3d-specular {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--light-x, 50%) var(--light-y, 50%),
    oklch(1 0 0 / 0.22) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  mix-blend-mode: overlay;
}

.card-3d-tilt:hover .card-3d-specular {
  opacity: 1;
}
```

```javascript partial
// 3D tilt calculation
export function init3DTilt(cardEl, maxRotation = 14) {
  cardEl.addEventListener('pointermove', e => {
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    const rotateX = ((0.5 - y) * maxRotation).toFixed(2);
    const rotateY = ((x - 0.5) * maxRotation).toFixed(2);

    cardEl.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    cardEl.style.setProperty('--light-x', `${(x * 100).toFixed(1)}%`);
    cardEl.style.setProperty('--light-y', `${(y * 100).toFixed(1)}%`);
  });

  cardEl.addEventListener('pointerleave', () => {
    cardEl.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    cardEl.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });

  cardEl.addEventListener('pointerenter', () => {
    cardEl.style.transition = 'none';
  });
}
```

---

## 3. Cyberpunk Text Scramble Decoding Reveal

Characters rapidly scramble through glyphs before locking into the final string with a crisp mechanical rhythm:

```javascript partial
export function scrambleText(element, finalText, duration = 800) {
  const glyphs = 'ABCDEFGHIKLMNOPQRSTVXYZ0123456789!@#$%^&*~';
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const lockedChars = Math.floor(progress * finalText.length);

    let output = '';
    for (let i = 0; i < finalText.length; i++) {
      if (i < lockedChars) {
        output += finalText[i];
      } else if (finalText[i] === ' ') {
        output += ' ';
      } else {
        output += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
    }

    element.textContent = output;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}
```

---

## 4. View Transitions API: Shared Element Expansion

Seamlessly expands a preview card into a full-screen modal without third-party layout libraries:

```css
/* Card in list view */
.preview-thumbnail {
  view-transition-name: selected-card;
}

/* Modal view */
.modal-hero-image {
  view-transition-name: selected-card;
}

/* Custom view transition animation */
::view-transition-old(selected-card),
::view-transition-new(selected-card) {
  animation-duration: 0.42s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
```

```javascript partial
// Trigger transition
export function openModal(cardData) {
  if (!document.startViewTransition) {
    renderModal(cardData);
    return;
  }
  document.startViewTransition(() => {
    renderModal(cardData);
  });
}
```

---

## 5. Native CSS Scroll-Driven Animations

100% native GPU scroll scrubbing without `window.onscroll` listeners:

```css
/* Sticky card stacking effect */
@keyframes card-scale-down {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.85);
    opacity: 0.4;
  }
}

.stacked-card {
  position: sticky;
  top: 100px;
  animation: card-scale-down linear;
  animation-timeline: view();
  animation-range: exit 0% exit 100%;
}
```

---

## 6. Apple-Style Dock Magnification

Icons swell smoothly based on exponential distance from the mouse cursor:

```javascript partial
export function initDockMagnification(dockEl, maxScale = 1.7, radius = 120) {
  const items = dockEl.querySelectorAll('.dock-icon');

  dockEl.addEventListener('pointermove', e => {
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - itemCenterX);

      if (dist < radius) {
        const factor = Math.cos((dist / radius) * (Math.PI / 2));
        const scale = 1 + (maxScale - 1) * factor;
        item.style.transform = `scale(${scale.toFixed(3)}) translateY(-${((scale - 1) * 16).toFixed(1)}px)`;
      } else {
        item.style.transform = 'scale(1) translateY(0px)';
      }
    });
  });

  dockEl.addEventListener('pointerleave', () => {
    items.forEach(item => {
      item.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      item.style.transform = 'scale(1) translateY(0px)';
    });
  });
}
```

---

## 7. Border Beam Light Sweep

A luminous beam travels endlessly around the perimeter of a premium card:

```css
.border-beam-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: oklch(0.18 0.02 260);
  border: 1px solid oklch(1 0 0 / 0.08);
}

.border-beam-card::after {
  content: "";
  position: absolute;
  inset: -100%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    oklch(0.7 0.22 265) 60deg,
    transparent 120deg
  );
  animation: beam-spin 4s linear infinite;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: 1.5px;
  pointer-events: none;
}

@keyframes beam-spin {
  to { transform: rotate(360deg); }
}
```
