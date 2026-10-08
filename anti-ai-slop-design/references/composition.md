# Composition & Layout Tension

Read when: You are breaking monotonous grids, engineering asymmetric tension, constructing bento layouts, or designing sticky editorial columns.

---

## 1. Asymmetric Visual Tension

Symmetry often feels corporate, passive, and uninspired. Asymmetric composition guides the human eye through deliberate visual tension:

```text
[   Large Typographic Anchor   ]   [ Interactive Product Demo ]
[ Headline, Thesis & CTA       ]   [ Live Canvas / Code / UI  ]
[                              ]   [                          ]
────────────────────────────────────────────────────────────────
[ Metric A ]  [ Metric B ]  [ Long Detailed Bento Feature Card ]
```

---

## 2. The Sticky Editorial Sidebar Layout

Keeps context persistently visible while content scrolls smoothly alongside it:

```html partial
<div class="editorial-container">
  <aside class="sticky-sidebar">
    <span class="eyebrow-tag">Architecture</span>
    <h2 class="sidebar-title">Engineered for extreme zero-latency throughput</h2>
    <p class="sidebar-description">
      Explore how our multi-region replication fabric synchronizes edge nodes in sub-millisecond intervals.
    </p>
  </aside>
  <main class="scrolling-content">
    <div class="feature-block">...</div>
    <div class="feature-block">...</div>
  </main>
</div>
```

```css
.editorial-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 1024px) {
  .editorial-container {
    grid-template-columns: 380px 1fr;
    gap: 64px;
    align-items: start;
  }

  .sticky-sidebar {
    position: sticky;
    top: 96px;
  }
}
```

---

## 3. Full-Bleed Media Break

Interrupt repetitive boxed layouts with a dramatic edge-to-edge section that resets the user's visual momentum:

```css
.full-bleed-break {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 80px 24px;
  background: radial-gradient(circle at 50% 50%, oklch(0.20 0.03 260) 0%, oklch(0.12 0.015 260) 100%);
  border-block: 1px solid oklch(1 0 0 / 0.1);
}
```
