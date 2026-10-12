# Performance measured against the task

Read when: Investigating loading, interaction latency, layout stability, or asset cost.

| Metric / evidence | What it answers | Limit |
| --- | --- | --- |
| LCP | When the largest visible content paints | Identify the actual element and trace its delays |
| INP | Interaction responsiveness across the visit | A single fast click is not field INP |
| CLS | Unexpected visual movement | Reserve dimensions; inspect actual shifts |
| Lab trace | Controlled bottleneck and before/after comparison | Not proof of field results |
| Field data | Real-user outcomes at meaningful percentiles | Needs enough data and defined conditions |
| Bundle analysis | Shipped JavaScript and dependency cost | Size alone does not prove runtime latency |

Check current definitions and thresholds in [web.dev Web Vitals](https://web.dev/articles/vitals). Product goals such as LCP below 1.2s or INP below 100ms are aspirational budgets, not universal compliance thresholds or facts inferred from source.

## Diagnose before optimizing

```text
Route/task and user conditions:
Actual slow element/interaction:
Baseline tool, device/network, run count:
Trace evidence:
Smallest change addressing the bottleneck:
Comparable recheck:
Field data available / Not run:
```

| Bottleneck | Useful move |
| --- | --- |
| LCP image requested late | Make it discoverable; appropriate dimensions/source sizes; prioritize only the actual critical asset |
| Hero lazy loading | Remove lazy loading for the actual above-fold LCP candidate |
| Font delay or shift | Check real script coverage, licensed assets, fallback metrics, and loading behavior |
| Long interaction task | Profile; split work or use a worker; yield with a supported fallback |
| Client hydration cost | Reduce unnecessary client boundaries and dependencies |
| Layout shift | Reserve correct media/widget dimensions; keep pending-state geometry stable |
| Expensive motion | Profile paint/layout/layers rather than assuming GPU execution |

Verify framework image APIs against the installed version; older priority examples may not match current preload/fetchPriority options. Do not preload every image.

For multilingual font subsets, include the real supported scripts; Latin-only subsets may fail Georgian. A fixed "yield every 50 items" rule is not a latency guarantee; measure elapsed work and preserve cancellation.
