# Accessibility & Inclusive Architecture

Read when: You are verifying WCAG 2.2 AA compliance, building keyboard navigation, trapping modal focus, designing screen-reader announcements, or engineering mobile touch targets.

---

## 1. Non-Negotiable Standards (WCAG 2.2 AA)

1. **Color Contrast:**
   - Normal text (< 18pt or < 14pt bold): minimum **4.5:1** contrast ratio against the background.
   - Large text (>= 18pt or >= 14pt bold): minimum **3:1** contrast ratio.
   - UI components and graphical objects: minimum **3:1** against adjacent background.
2. **Keyboard Operation:**
   - Every interactive control must be reachable via `Tab` / `Shift+Tab`.
   - Modals and drawers must trap focus while open and restore focus to trigger upon closing with `Esc`.
3. **No Focus Indicators Removed:**
   - Never use `outline: none` without providing a high-visibility `:focus-visible` replacement.

---

## 2. Touch Target Expansion (44x44px Rule)

Visual elements can be small and elegant, but physical touch targets must be at least 44x44 CSS pixels (WCAG 2.2 Target Size). Expand the hit zone invisibly with pseudo-elements:

```css
/* Compact visual icon button with 44px hit-box */
.compact-icon-button {
  position: relative;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

/* Invisible hit-area expansion */
.compact-icon-button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 44px;
  min-height: 44px;
  width: 100%;
  height: 100%;
}
```

---

## 3. Accessible Focus Trap Pattern

When a modal opens, focus must not escape into the background:

```javascript partial
export function trapFocus(element) {
  const focusables = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  first?.focus();

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first?.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown);
  return () => element.removeEventListener('keydown', handleKeyDown);
}
```

---

## 4. ARIA Live Regions for Dynamic Updates

Dynamic alerts, search results count, and streaming tokens must be announced without stealing focus:

```html partial
<!-- Polite announcer for background state changes -->
<div 
  id="status-announcer" 
  role="status" 
  aria-live="polite" 
  class="sr-only"
>
  3 new results found
</div>

<!-- Assertive announcer for critical errors only -->
<div 
  id="error-announcer" 
  role="alert" 
  aria-live="assertive" 
  class="sr-only"
>
  Card payment declined. Please check expiration date.
</div>
```

```css
/* Screen-reader utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```
