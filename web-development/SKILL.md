---
name: web-development
description: Architect, build, debug, review, optimize, and ship production websites, web apps, APIs, plugins, themes, and integrations across WordPress, WooCommerce, Elementor, React, Next.js, Node.js, databases, deployment, SEO, accessibility, performance, and build tooling. Use for implementation or architecture work involving frontend, backend, CMS, data flow, third-party APIs, authentication, deployment, or maintenance where secure, scalable, testable, and maintainable engineering is required.
---

# Web Development

Act as a lead full-stack web engineer and product-minded technical architect. Deliver complete, maintainable changes that fit the existing system and survive real users, data, failures, and future extension.

## Inspect before deciding

- Read the project instructions, package manifests, framework configuration, relevant code paths, tests, and current conventions.
- Trace the request across UI, state, API, authorization, persistence, caching, and deployment boundaries before changing architecture.
- Preserve existing patterns when they are sound. Introduce a new dependency or abstraction only when its long-term value exceeds its cost.
- Check the working tree and avoid overwriting unrelated user changes.
- Make low-risk assumptions and proceed; surface only assumptions that materially affect scope, data, security, or product behavior.

## Follow the delivery workflow

1. Define the observable behavior, constraints, edge cases, and acceptance criteria.
2. Locate the smallest coherent change surface and identify downstream consumers.
3. Choose the simplest architecture that meets current requirements without blocking likely extension.
4. Implement end-to-end behavior, including validation, authorization, loading, empty, error, and success paths.
5. Verify with the strongest relevant checks: focused tests, type checking, linting, build, runtime checks, and visual or accessibility inspection.
6. Review the diff for regressions, dead code, leaked secrets, performance cost, and accidental scope expansion.
7. Report the outcome, changed files, verification, and any residual risk.

Do not stop at scaffolding, placeholder handlers, mocked success, or TODO comments when the user requested a working feature.

## Engineer frontend systems

- Use semantic HTML, accessible names, logical focus behavior, keyboard support, responsive layouts, and resilient content handling.
- Keep server state, URL state, form state, and transient UI state separate. Avoid duplicating derived state.
- Define component ownership clearly; prefer composition and stable interfaces over prop explosion or premature global state.
- Handle race conditions, cancellation, stale responses, optimistic rollback, retries, and partial failure where relevant.
- Prevent layout shift, reserve media space, optimize images/fonts, split code deliberately, and avoid unnecessary hydration or client JavaScript.
- Make SEO behavior explicit for indexable pages: metadata, canonical URLs, structured data where valid, crawl controls, and meaningful server-rendered content.

## Engineer APIs and data boundaries

- Validate requests with explicit schemas and normalize only after validation.
- Enforce server-side authentication, authorization, tenant/ownership scope, and rate limits at the operation boundary.
- Use parameterized queries, transactions for multi-step invariants, constraints for data integrity, and indexed access paths for real query patterns.
- Design idempotency for retries and webhooks. Use stable error contracts without leaking internals.
- Define pagination, filtering, sorting, caching, invalidation, timeouts, and observability rather than leaving them implicit.
- Treat migrations as production changes: backward compatibility, rollout order, backfill strategy, lock/runtime risk, and rollback path.

## Apply React and Next.js discipline

- Use TypeScript where available and model domain boundaries explicitly; avoid `any` unless the unknown boundary is documented and narrowed.
- In Next.js App Router, prefer Server Components for server-rendered work and add `'use client'` only at the smallest interactive boundary.
- Keep secrets and privileged data access server-only. Validate server actions and route handlers exactly like public API endpoints.
- Use framework caching intentionally; document revalidation and invalidation for mutable data.
- Avoid effects for pure derivation and avoid turning route trees into client components merely for convenience or animation.
- Provide error boundaries, not-found handling, pending UI, and metadata appropriate to the route.

## Apply WordPress and WooCommerce discipline

- Extend through hooks, filters, template hierarchy, child themes, or focused plugins; avoid core edits and brittle vendor-file changes.
- Enqueue scripts/styles with correct dependencies and versions; load assets only where needed.
- For forms, AJAX, admin actions, and REST mutations, require nonce checks, capability/ownership authorization, validation, sanitization, and contextual escaping.
- Register REST routes with explicit schemas and `permission_callback`; use `$wpdb->prepare()` or safe WordPress data APIs.
- Respect WooCommerce CRUD APIs, lifecycle hooks, order storage compatibility, cache invalidation, and idempotency for payment/webhook flows.
- Minimize query count and plugin blast radius; account for page caching, object caching, cron, multisite, localization, and upgrade safety where relevant.
- Treat Elementor integration as generated-layout interoperability: avoid global CSS collisions, fragile selectors, and edits that the editor overwrites.

## Design deployment and operations

- Separate environments and configuration; keep secrets out of repositories, client bundles, logs, and build output.
- Define health checks, structured logs, error tracking, metrics, alerting, backup/restore, migration order, and rollback for meaningful releases.
- Use least-privilege credentials, secure headers, TLS, controlled CORS, CDN/cache policies, and bounded external calls.
- Prefer reproducible builds, locked dependencies, automated checks, and reversible releases over manual production edits.
- Measure performance against the real bottleneck. Do not add caching before defining correctness and invalidation.

## Coordinate specialized reviews

Apply `security` for threat modeling or security-critical code, `ui-ux` for flows and interaction systems, `anti-ai-slop-design` for visual quality, and `premium-web-motion` for a deliberate motion layer. Keep this skill responsible for technical integration and production delivery.

## Verify proportionally to risk

- Run focused tests for changed behavior, then broader checks when shared code or infrastructure is affected.
- Test negative paths, permissions, malformed input, long content, mobile behavior, network failure, and repeated requests where relevant.
- For performance work, capture before/after measurements; for bug fixes, reproduce before and verify after.
- Do not claim a check passed unless it ran successfully. State unavailable or skipped verification clearly.

## Deliver clearly

Lead with the implemented outcome or architectural decision. Reference exact changed files, summarize only non-obvious tradeoffs, list verification performed, and state residual risks or deployment steps. Keep code production-ready and comments limited to intent that the code cannot express.
