# Responsive Architecture & Container Queries

Read when: You are adapting components across viewport sizes, using CSS Container Queries (`@container`), subgrid, dynamic viewport units (`dvh`), or engineering thumb-friendly mobile navigation.

---

## 1. Container Queries Over Viewport Media Queries

Viewport media queries (`@media (min-width: 768px)`) break when a component is placed inside a narrow sidebar. **Container Queries** adapt components based on the space allocated to them, making them truly modular and reusable anywhere.

```css
/* Establish a query container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Base mobile-first layout (Stacked) */
.user-profile-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

/* When the container is at least 420px wide (Row layout) */
@container card (min-width: 420px) {
  .user-profile-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
  }
}

/* When the container is spacious (Expanded Bento layout) */
@container card (min-width: 680px) {
  .user-profile-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 24px;
  }
}
```

---

## 2. CSS Subgrid for Flawless Card Alignment

Cards in a multi-column grid often have mismatched title lengths, causing buttons to misalign vertically. `subgrid` links internal card rows directly to parent grid tracks:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card-grid .card-item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* 1: Header/Image, 2: Description, 3: Footer Action */
  gap: 12px;
}
```

---

## 3. Dynamic Viewport Units (`dvh` / `lvh` / `svh`)

Mobile browser address bars resize dynamically on scroll. Classic `100vh` causes bottom navigation to be hidden under browser UI.

```css
/* Prevents mobile bottom bar clipping */
.full-screen-modal {
  min-height: 100dvh; /* Dynamic Viewport Height */
  height: 100dvh;
}
```

---

## 4. Mobile Thumb-Zone Ergonomics

On mobile devices, users navigate with one thumb. Critical interactive controls must live in the natural bottom-reach zone.

- **Primary actions, search, and navigation:** Position within the bottom 35% of the viewport.
- **Top header area:** Reserved for reading, titles, and non-blocking back buttons.
- **Bottom Sheet vs Modal:** On screens `< 640px`, transform floating desktop modal dialogs into bottom-anchored swipeable sheets.
