# Modern UI Patterns

Read when: You are constructing component architecture: Bento grids, Command Palettes (`Cmd+K`), Floating Nav Docks, Sliding Segmented Controls, Drawer Sheets, or Interactive Tables.

---

## 1. The Dynamic Bento Grid

Bento grids organize asymmetric information with high visual interest, replacing repetitive 3-column cards.

### Structural Blueprint

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(220px, auto);
  }
  
  .bento-hero {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  .bento-tall {
    grid-column: span 1;
    grid-row: span 2;
  }

  .bento-wide {
    grid-column: span 2;
    grid-row: span 1;
  }
}
```

### Dynamic Mouse Spotlight Effect (CSS + JS)

Cards track cursor position to illuminate their borders dynamically:

```css
.bento-card {
  --mouse-x: 50%;
  --mouse-y: 50%;
  position: relative;
  border-radius: 20px;
  background: oklch(0.18 0.02 260 / 0.6);
  border: 1px solid oklch(1 0 0 / 0.08);
  overflow: hidden;
}

.bento-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: radial-gradient(
    400px circle at var(--mouse-x) var(--mouse-y),
    oklch(0.7 0.2 265 / 0.25),
    transparent 80%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.bento-card:hover::before {
  opacity: 1;
}
```

```javascript partial
// Efficient pointer tracking across cards
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});
```

---

## 2. Floating Dock Navigation

Replaces heavy top bars with an elegant, responsive floating pill:

```css
.floating-dock {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: oklch(0.18 0.025 260 / 0.75);
  backdrop-filter: blur(20px) saturate(190%);
  -webkit-backdrop-filter: blur(20px) saturate(190%);
  border: 1px solid oklch(1 0 0 / 0.12);
  border-radius: 9999px;
  box-shadow: 
    0 12px 36px -6px oklch(0 0 0 / 0.45),
    inset 0 1px 0 oklch(1 0 0 / 0.2);
  z-index: 1000;
}

.dock-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 9999px;
  color: oklch(0.8 0.01 260);
  transition: color 0.15s ease, background 0.15s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dock-item:hover {
  color: oklch(1 0 0);
  background: oklch(1 0 0 / 0.1);
  transform: translateY(-2px);
}
```

---

## 3. Sliding Segmented Control (Active Pill)

Instead of individual button toggles, use a shared sliding pill indicator:

```html partial
<div class="segmented-control" role="tablist">
  <div class="segmented-indicator" style="transform: translateX(0%); width: 33.33%;"></div>
  <button role="tab" aria-selected="true" class="segmented-tab active">Overview</button>
  <button role="tab" aria-selected="false" class="segmented-tab">Analytics</button>
  <button role="tab" aria-selected="false" class="segmented-tab">Settings</button>
</div>
```

```css
.segmented-control {
  position: relative;
  display: inline-flex;
  padding: 4px;
  background: oklch(0.14 0.015 260);
  border-radius: 12px;
  border: 1px solid oklch(1 0 0 / 0.06);
}

.segmented-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  border-radius: 8px;
  background: oklch(0.24 0.03 260);
  border: 1px solid oklch(1 0 0 / 0.12);
  box-shadow: 0 1px 3px oklch(0 0 0 / 0.3);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.segmented-tab {
  position: relative;
  z-index: 1;
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: oklch(0.7 0.01 260);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease;
}

.segmented-tab.active {
  color: oklch(0.98 0 0);
}
```

---

## 4. Modern Command Palette (`Cmd+K`)

The command palette requires immediate keyboard control, high search density, and categorized groups:

```html partial
<dialog class="command-dialog" id="palette">
  <div class="command-container">
    <div class="command-header">
      <svg class="search-icon" viewBox="0 0 24 24"><path d="..." /></svg>
      <input type="text" placeholder="Type a command or search..." autofocus />
      <kbd>ESC</kbd>
    </div>
    <div class="command-list" role="listbox">
      <div class="command-group-heading">Navigation</div>
      <div class="command-item" role="option" aria-selected="true">
        <span>Go to Dashboard</span>
        <kbd>G D</kbd>
      </div>
      <div class="command-item" role="option">
        <span>Project Settings</span>
        <kbd>G S</kbd>
      </div>
    </div>
  </div>
</dialog>
```
