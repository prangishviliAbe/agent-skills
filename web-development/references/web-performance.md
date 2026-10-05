# Web performance and SEO

Read when a page feels slow, a Core Web Vitals metric is failing, a bundle grew, or pages must be discoverable by search engines and social previews. Server-side and database latency are covered in [backend.md](backend.md) and [database.md](database.md).

## Method: measure, locate, change one thing, measure again

1. State the scenario: route, device and network throttle, cache state, signed in or not.
2. Pick the metric that matches the complaint, then capture a baseline with the tool and settings you will reuse.
3. Locate the cause with a trace or analyzer, not intuition. Change one thing. Re-measure. Keep only changes that moved the number.
4. Report numbers with their source. "Good" Core Web Vitals are field metrics at the 75th percentile, assessed for mobile and desktop separately: **LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less**. A single Lighthouse or local run is lab data: a diagnostic, never a certification. TTFB is a useful diagnostic, not a Core Web Vital.

```bash
npm run build && npm run start      # measure a production build, not the dev server
npx lighthouse http://localhost:3000/page --only-categories=performance --form-factor=mobile --output=json --output-path=./lh.json
```

Tools: Chrome DevTools Performance panel (long tasks, layout, paint), PageSpeed Insights and CrUX for field data, the `web-vitals` library for real-user data, `@next/bundle-analyzer` or `rollup-plugin-visualizer` for bundles, React DevTools Profiler for render cost.

## From symptom to cause

| Symptom | Likely cause and evidence | Fix |
| --- | --- | --- |
| LCP slow, LCP element is an image | Image discovered late, lazy-loaded, or oversized | Never lazy-load the likely LCP image; add `fetchpriority="high"`; serve right-sized AVIF or WebP with `srcset` and `sizes`; use the framework image component |
| LCP slow, TTFB high | Slow server render, cold cache, query waterfall | Cache, remove sequential awaits, stream with Suspense, fix slow queries, use a CDN |
| LCP element appears only after JS runs | Client-rendered above-the-fold content | Server-render or prerender it |
| Text LCP waits for the font | Blocking or late web font | Preload the one critical font, `font-display: swap` or `optional`, subset, match fallback metrics |
| INP slow after click or typing | Long task in the handler (over about 50 ms), large re-render, third-party script | Split work (`startTransition`, `setTimeout`, `scheduler.yield()` where supported), move heavy work to a worker, shrink re-render scope, defer or facade third parties |
| Slow before the page responds to input | Hydrating a large client tree | Shrink client boundaries, stream, lazy-load below-the-fold widgets |
| CLS from images, embeds, ads | No reserved space | Set `width` and `height` or `aspect-ratio`; reserve slots for late content |
| CLS from text jumping | Font swap changes metrics | `size-adjust` and metric overrides on the fallback, or the framework font loader |
| Large JS bundle | One heavy dependency, duplicate versions, whole-library imports | Inspect with the analyzer; `import()` heavy code on demand; `npm ls` to dedupe; named ESM imports; replace with native `Intl` or a smaller library |
| Jank while animating | Layout or paint on each frame | Animate `transform` and `opacity`; avoid reading layout in loops |

## Images, fonts, and third parties

```html
<img
  src="/hero-1200.avif"
  srcset="/hero-640.avif 640w, /hero-1200.avif 1200w, /hero-2000.avif 2000w"
  sizes="(min-width: 1024px) 50vw, 100vw"
  width="1200" height="800" alt="Warehouse robot arm loading a pallet"
  fetchpriority="high" decoding="async">
```

- Lazy-load only below-the-fold images (`loading="lazy"`). Give every image intrinsic dimensions. Use SVG for icons and logos.
- Fonts: WOFF2, only the weights you use (a variable font when you need several), self-hosted or through the framework loader, `font-display` chosen deliberately, preload only the critical file. Subsets must include the scripts you ship. Georgian needs U+10A0–10FF, U+1C90–1CBF (Mtavruli), and U+2D00–2D2F; confirm the delivered file actually contains the glyphs.
- Third-party scripts: load with `async` or `defer`, after interaction or idle where possible, behind a facade for heavy embeds (video, chat, maps), and remove what nobody uses. In Next.js use `next/script` with a strategy.
- Use `content-visibility: auto` with `contain-intrinsic-size` for long static sections, and virtualize long interactive lists.

## Caching and the network

```http
Cache-Control: public, max-age=31536000, immutable   # fingerprinted static asset
Cache-Control: no-cache                              # HTML: always revalidate (ETag still saves bytes)
Cache-Control: private, no-store                     # personalized or sensitive responses
```

- Fingerprint static assets so they can be cached for a year. Compress with Brotli. Avoid redirect chains. Preconnect only to the two or three origins that gate rendering.
- A shared cache must never hold a response that varies by user, tenant, or locale unless that input is in the cache key (see [backend.md](backend.md)).
- Fetch independent data in parallel on the server (`Promise.all`); sequential awaits create waterfalls. Preload data a component will need before it renders.

## SEO and metadata

Apply to pages meant to be discovered.

- Put important content in the HTML (server-render, prerender, or static generation); crawlers differ in JavaScript support.
- One unique `title` and meta description per page, one `h1`, descriptive link text, a `lang` attribute, and a canonical URL (also to collapse tracking-parameter duplicates).
- Return honest status codes: a missing page is a real 404, a moved page a 301, not a 200 "not found" screen.
- Provide `sitemap.xml` and `robots.txt`; add reciprocal `hreflang` for translated alternates; add Open Graph and Twitter card tags for sharing.
- Add JSON-LD only for facts visible on the page. Serialize it HTML-safely, because `JSON.stringify` alone does not escape `<`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
/>
```

- `robots.txt` is crawl guidance and `noindex` is indexing guidance; neither protects private content, and a page blocked by robots cannot show its `noindex`. Private pages need access control.
- Paginated lists need crawlable links and self-referencing canonicals, not infinite scroll alone.
- Next.js has conventions for all of this: the Metadata API (`generateMetadata`), `app/sitemap.ts`, `app/robots.ts`, and `opengraph-image`.

## Verify

Report baseline and after values with the tool, scenario, build mode, and throttle. Say whether each number is lab or field. Do not claim a Core Web Vitals pass from one Lighthouse run, and do not claim a mobile result from a throttled desktop run.
