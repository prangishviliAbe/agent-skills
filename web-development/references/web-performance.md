# Web Performance & Core Web Vitals Mastery

Read when: You are optimizing Largest Contentful Paint (LCP), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS), or font loading performance.

---

## 1. Largest Contentful Paint (LCP < 1.2s)

The LCP element is almost always the hero image or primary heading.

### Rules for Sub-1.2s LCP:
1. **Preload Hero Image with High Fetch Priority:**
   ```html partial
   <link rel="preload" fetchpriority="high" as="image" href="/hero.webp" type="image/webp" />
   ```
2. **Never Lazy-Load the Hero:**
   In Next.js `<Image>`, always add `priority` to the hero image:
   ```tsx partial
   <Image src="/hero.webp" alt="Dashboard Hero" priority width={1200} height={630} />
   ```
3. **Self-Host & Subset Fonts:** Use `next/font` with `display: 'swap'` and specify subsets (`['latin']`).

---

## 2. Interaction to Next Paint (INP < 100ms)

INP measures responsiveness to user clicks, taps, and keypresses. Long JavaScript tasks block the browser main thread.

### Yielding to the Main Thread via `scheduler.yield()`

```typescript partial
export async function processLargeDataset(items: any[]) {
  for (let i = 0; i < items.length; i++) {
    // Process item...
    performHeavyComputation(items[i]);

    // Yield control every 50 items so user clicks process instantly
    if (i % 50 === 0 && 'scheduler' in window && 'yield' in (window as any).scheduler) {
      await (window as any).scheduler.yield();
    }
  }
}
```

---

## 3. Cumulative Layout Shift (CLS = 0)

Prevent visual jumping by reserving dimensions:

```css
/* Maintain strict aspect ratio on dynamic containers */
.media-container {
  aspect-ratio: 16 / 9;
  width: 100%;
  background: oklch(0.18 0.02 260); /* Skeleton placeholder prevents flash */
}
```
