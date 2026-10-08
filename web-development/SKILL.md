---
name: web-development
description: >-
  Architect, build, debug, and optimize cutting-edge full-stack web applications using modern 2025/2026
  standards: Next.js 15/16 App Router, React 19 (Server Components, Server Actions, useActionState,
  useOptimistic), Tailwind CSS v4, TypeScript Strict, high-performance edge streaming, type-safe database
  access (Drizzle/Prisma), robust webhook verification, and sub-1.2s LCP / sub-100ms INP Core Web Vitals.
  Use when creating or refactoring web applications, building complex full-stack features, eliminating
  rendering waterfalls, writing server actions, or debugging performance, hydration, and routing issues.
---

# Full-Stack Web Development

Engineer resilient, ultra-fast, modern web applications. Prioritize server-first architecture, instant optimistic user feedback, zero data-fetching waterfalls, robust type-safety, and sub-100ms interaction latency.

## Core Directives

1. **Server-First Component Architecture:** Default to React Server Components (RSC). Only mark components with `'use client'` when state (`useState`), effects (`useEffect`), browser APIs, or event listeners are required. Push client boundaries as far down the component tree as possible.
2. **React 19 Server Actions & Optimistic UI:** Perform mutations via Server Actions using `useActionState` and validate inputs strictly with Zod. Never make the user wait for a network round-trip; update the UI immediately with `useOptimistic`.
3. **Eliminate Data Fetching Waterfalls:** Fetch data in parallel on the server using `Promise.all` or dedicated Suspense boundaries. Stream content progressively via React Suspense rather than blocking the entire route.
4. **Tailwind CSS v4 & Theme Variables:** Use modern CSS-first Tailwind v4 architecture with `@theme` blocks, CSS variables, and native color spaces (`oklch`).
5. **Strict TypeScript & Zod Validation:** Never use `any`. Validate all external data boundaries (API routes, Server Action payloads, URL search parameters, environment variables) with Zod schemas.
6. **Core Web Vitals Obsession:** Target LCP < 1.2s, INP < 100ms, and CLS = 0. Preload hero assets with `priority` / `fetchpriority="high"`, subset fonts, and yield long tasks to the browser main thread via `scheduler.yield()`.
7. **Idempotent & Resilient Backend Operations:** Webhooks (Stripe, GitHub) must verify signatures, record idempotent transaction IDs to prevent duplicate processing, and use connection-pooled database drivers (e.g. Neon serverless, Prisma, Drizzle).

## Full-Stack Architecture Flow

```text
[ Client Click ] ──► [ useOptimistic UI Update ]
       │
       ▼ (Server Action)
[ Zod Input Validation ] ──► [ DB Transaction (Drizzle/Prisma) ] ──► [ revalidateTag / Cache ]
       │
       ▼ (On Failure)
[ Rollback Optimistic State & Announce Error ]
```

## Quick Reference Map

| Topic | What it covers | Reference file |
| --- | --- | --- |
| **Frontend & React 19** | `useActionState`, `useOptimistic`, `use()`, client/server component boundaries | [frontend.md](references/frontend.md) |
| **Next.js App Router** | App router routing, caching (`revalidateTag`), Server Actions, PPR, middleware | [nextjs.md](references/nextjs.md) |
| **Backend & Databases** | Drizzle ORM, Postgres pooling, idempotent webhooks, rate limiting | [backend.md](references/backend.md) |
| **Web Performance** | Core Web Vitals (LCP, INP, CLS), font optimization, main-thread yielding | [web-performance.md](references/web-performance.md) |

## Failure Modes & Countermeasures

| Failure | Correct Move |
| --- | --- |
| Marking an entire page with `'use client'` | Keep the page an RSC; isolate only the interactive button or input inside a leaf `'use client'` component. |
| Sequential data fetching inside nested RSCs creating waterfalls | Lift data fetching or wrap each asynchronous component in independent `<Suspense>` boundaries. |
| Unvalidated Server Action arguments allowing injection | Parse arguments with `schema.safeParse(input)` at the very beginning of the server action. |
| Double charging in payment webhooks due to retries | Check database for unique `event.id` before dispatching balance updates; store processing locks. |
| Layout shifts (CLS) caused by dynamically loaded images or ads | Always declare explicit `width` and `height` aspect ratios on media containers. |

## Definition of Done

- [ ] Route built with React Server Components, pushing `'use client'` to leaf components.
- [ ] Mutations execute via Server Actions with Zod validation and optimistic UI feedback.
- [ ] No sequential data waterfalls; async components wrapped in Suspense boundaries.
- [ ] Strict TypeScript enforced across all props, state, actions, and API boundaries.
- [ ] Performance verified: LCP < 1.2s, INP < 100ms, and CLS = 0.
- [ ] Webhook handlers verify signatures and ensure idempotency.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
