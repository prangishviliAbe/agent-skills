# Motion Implementation Guide

Read when: You are coding motion in Motion (formerly Framer Motion v11+), GSAP 3.12+, or modern native CSS (`@starting-style`).

---

## 1. Modern CSS `@starting-style` & Discrete Transitions

CSS now animates elements to and from `display: none` natively:

```css
/* Animate popover entrance from display: none */
.dialog-overlay {
  display: block;
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              display 0.3s allow-discrete;
}

@starting-style {
  .dialog-overlay {
    opacity: 0;
    transform: scale(0.95);
  }
}

.dialog-overlay.is-closing {
  opacity: 0;
  transform: scale(0.95);
  display: none;
}
```

---

## 2. Motion (Framer Motion v11+) Architecture

The modern React motion standard:

```tsx partial
import { motion, AnimatePresence } from 'motion/react';

const springTransition = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
  mass: 1,
};

export function NotificationToast({ isVisible, message, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
          transition={springTransition}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={(_, info) => {
            if (Math.abs(info.velocity.x) > 400 || Math.abs(info.offset.x) > 120) {
              onClose();
            }
          }}
          className="fixed bottom-6 right-6 p-4 rounded-xl bg-slate-900 border border-white/10 shadow-2xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 3. GSAP 3.12+ (Flip & ScrollTrigger)

When synchronizing complex multi-element layout changes:

```javascript partial
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export function morphLayout(container, changeDomCallback) {
  // 1. Capture initial state
  const state = Flip.getState(container.querySelectorAll('.flip-target'));

  // 2. Perform DOM mutations
  changeDomCallback();

  // 3. Animate layout delta with silky spring physics
  Flip.from(state, {
    duration: 0.55,
    ease: 'power4.out',
    stagger: 0.04,
    absolute: true,
  });
}
```
