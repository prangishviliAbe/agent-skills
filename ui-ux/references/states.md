# State Styling & Lifecycle Architecture

Read when: You are styling or verifying the 7 essential interaction states: Default, Hover, Active/Press, Focus-Visible, Disabled, Loading/Optimistic, and Error/Empty.

---

## 1. The 7-State Matrix

Never ship an interface where only the `default` state is designed. Every interactive control must declare all 7 states:

```text
[Default] ──► [Hover] ──► [Active / Press] ──► [Pending / Loading] ──► [Success / Optimistic]
   │             │               │
   ▼             ▼               ▼
[Focus-Visible]  [Disabled / Gated] [Error / Inline Recovery]
```

---

## 2. Hover & Press States: Micro-Elevations

Amateur buttons only change background color. World-class buttons combine scale, border illumination, and dual shadows:

```css
.action-button {
  --btn-scale: 1;
  --btn-y: 0px;
  --btn-shadow: 0 1px 2px oklch(0 0 0 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.15);
  --btn-border: oklch(1 0 0 / 0.1);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 500;
  border: 1px solid var(--btn-border);
  box-shadow: var(--btn-shadow);
  transform: translateY(var(--btn-y)) scale(var(--btn-scale));
  transition: 
    transform 0.12s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.12s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.15s ease,
    background-color 0.15s ease;
}

/* Hover: Subtle lift & specular glow */
.action-button:hover {
  --btn-y: -1px;
  --btn-shadow: 0 4px 12px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.25);
  --btn-border: oklch(1 0 0 / 0.22);
}

/* Active / Press: Tactile depress & inset shadow */
.action-button:active {
  --btn-scale: 0.98;
  --btn-y: 1px;
  --btn-shadow: 0 0 0 oklch(0 0 0 / 0), inset 0 2px 4px oklch(0 0 0 / 0.4);
}
```

---

## 3. Focus-Visible: The Two-Tone Accessible Ring

Standard browser outlines clash with dark themes. A two-tone offset ring guarantees 100% visibility on both black and white backgrounds:

```css
:focus-visible {
  outline: 2px solid oklch(0.7 0.2 265);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px oklch(0.12 0.015 250); /* Dark halo matches canvas */
}
```

---

## 4. Rethinking Disabled States

Hard-disabled buttons (`<button disabled>`) damage UX because:
1. They hide **why** the action cannot be taken.
2. They do not emit hover, click, or focus events, preventing assistive tooltips.
3. They fail contrast guidelines.

### Better Pattern: Interactive Invalid State

```html partial
<!-- Accessible invalid button with prerequisite explanation -->
<button 
  type="submit" 
  aria-disabled="true" 
  class="action-button is-invalid"
  title="Please fill in your billing address to proceed"
>
  Complete Purchase
</button>
```

```css
.action-button.is-invalid {
  opacity: 0.55;
  cursor: not-allowed;
  filter: grayscale(40%);
}

.action-button.is-invalid:hover {
  transform: none; /* No lift */
  border-color: oklch(0.6 0.22 25 / 0.5); /* Subtle warning tint */
}
```

---

## 5. Loading & Shimmer Skeletons

Avoid generic spinning wheels that displace page content. Use structural shimmer skeletons matching exact typographic heights:

```css
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    oklch(0.18 0.02 260) 0%,
    oklch(0.25 0.03 260) 50%,
    oklch(0.18 0.02 260) 100%
  );
  background-size: 200% 100%;
  animation: shimmer-sweep 1.8s infinite ease-in-out;
  border-radius: 6px;
}

@keyframes shimmer-sweep {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Skeleton typography heights */
.skeleton-title { height: 28px; width: 65%; margin-bottom: 12px; }
.skeleton-paragraph { height: 16px; width: 90%; margin-bottom: 8px; }
.skeleton-avatar { width: 44px; height: 44px; border-radius: 9999px; }
```

---

## 6. Error & Inline Recovery

When an input fails validation:
1. Keep the entered data intact.
2. Shake the field horizontally to register human attention.
3. Place an accessible inline message with an icon directly below the field.

```css
@keyframes field-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.input-field.has-error {
  border-color: oklch(0.6 0.22 25);
  animation: field-shake 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: oklch(0.72 0.2 25);
  margin-top: 6px;
}
```
