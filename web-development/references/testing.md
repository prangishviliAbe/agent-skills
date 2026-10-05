# Testing: choose, write, and trust tests

Read when adding or fixing tests, deciding what needs a test, proving a bug fix, testing authorization or concurrency, writing browser tests, or dealing with flaky tests. Use the project's runner and conventions; do not add a second test framework.

## Put each test at the lowest layer that can catch the failure

| Layer | Use for | Typical tools |
| --- | --- | --- |
| Unit | Pure logic, parsing, calculations, state machines | Vitest, Jest, `node:test`, pytest, PHPUnit |
| Integration | Handler plus real database, data-access layer, access policy, webhook processing | Same runner with a real database (container or CI service) |
| Contract | The request and response shape other code depends on; provider-shaped fixtures | Schema validation, Pact |
| End-to-end | A few critical journeys across layers: sign-in, checkout, signup | Playwright |
| Accessibility and visual | Axe scans, layout regressions | `@axe-core/playwright`, screenshots |

Cover every validation rule in unit or integration tests, not in browser tests. Reserve end-to-end tests for flows that genuinely cross layers.

## Bug fix protocol

1. Write a failing test or script first, and read its failure message to confirm it fails for the reported reason.
2. Fix the cause. See the test pass.
3. Prove the test is real by running it against the old code in a throwaway worktree (recipe in [delivery.md](delivery.md)).
4. Keep the test, named by behavior: `rejects an expired reset token`.

If a deterministic reproduction is impossible (a race, an incident), capture the evidence you have, test the mechanism you can isolate, and say what remains unreproduced.

## Writing tests that earn their keep

- Arrange, act, assert. One behavior per test. Assert observable outcomes through the public interface, not private calls. Assert call counts only when the call is the behavior (an email sent exactly once).
- Cover boundaries and failures: zero, one, many; empty and maximum length; Unicode; invalid input; permission denied; duplicates; timeouts.
- Make tests deterministic: inject or fake the clock, randomness, network, and filesystem; set the time zone explicitly (and test a DST boundary when dates matter); give every test its own data (unique ids, per-test transaction rollback, or truncate between tests) so they can run in parallel and in any order.
- Never use sleeps. Wait on a condition or an event. Avoid conditionals inside tests.
- Snapshot only small, stable output. Large snapshots get approved without being read.
- Ask whether a plausible bug would turn the test red. If not, the test proves little.
- Use synthetic data. Never put production data in fixtures.

## Authorization tests: actors by actions

Write a matrix with the actors that exist (owner, other user, other tenant, staff, signed out, revoked member) and test each against the real route or data function, not only a helper.

```ts
import { describe, it, expect } from 'vitest';

describe('GET /api/invoices/:id', () => {
  it.each([
    ['owner', 'tenantA-user', 200],
    ['user from another tenant', 'tenantB-user', 404],
    ['signed out', null, 401],
  ])('%s gets %i', async (_label, user, status) => {
    const response = await api.get(`/api/invoices/${invoiceA.id}`, { as: user });
    expect(response.status).toBe(status);
  });
});
```

Add the paths that bypass the main route: list and search endpoints (counts too), exports, bulk actions, background jobs, and cached responses.

## Concurrency and idempotency tests

Race conditions need a real database, because constraints and locks are what make the code correct. Fire the requests together and assert the invariant:

```ts
it('creates one charge when the same request arrives twice at once', async () => {
  const headers = { 'Idempotency-Key': 'k-123' };
  const body = { orderId, amountCents: 5000 };
  const [first, second] = await Promise.all([
    api.post('/api/charge', body, { headers }),
    api.post('/api/charge', body, { headers }),
  ]);
  expect([first.status, second.status].sort()).toEqual([200, 409]); // or two 200s with one body, per your contract
  expect(await db.charges.countForOrder(orderId)).toBe(1);
});
```

Also test: webhook replay (second delivery changes nothing), a failure mid-processing followed by a retry (the event is applied once), stock that cannot go below zero under parallel purchases, and optimistic-lock conflicts.

## External services, time, and data

- Fake HTTP at the network edge (MSW, nock, or a local fake provider) with fixtures captured from the provider's sandbox. Never call live providers from CI.
- Fake time (`vi.useFakeTimers()` then `vi.setSystemTime(new Date('2026-03-29T00:30:00Z'))`) and restore it afterward.
- Run integration tests on the same engine and migrations as production. SQLite stands in for PostgreSQL only when no engine-specific behavior is under test.
- Capture outgoing email in an in-memory outbox instead of sending it.

## Browser tests with Playwright

- Locate by role, label, and visible text (`getByRole`, `getByLabel`), not CSS or XPath. Use web-first assertions that retry (`await expect(locator).toBeVisible()`); never `waitForTimeout`.
- Isolate each test: fresh context, data seeded through an API or fixture, saved `storageState` for signed-in tests.
- Keep `trace: 'on-first-retry'` so failures can be inspected. Run against a production build when hydration or performance matters.

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('guest adds an item and sees the cart total', async ({ page }) => {
  await page.goto('/shop/sensor-kit');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: /cart/i }).click();
  await expect(page.getByRole('row', { name: /sensor kit/i })).toBeVisible();
  await expect(page.getByTestId('cart-total')).toHaveText('€49.00');
});

test('cart page has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/cart');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});
```

An automated accessibility scan finds only part of the problems. Say so, and add a keyboard pass for changed interactions.

## Flaky tests

Reproduce first: repeat the test many times (`playwright test --repeat-each=20`), shuffle order, run it alone, run it under CPU load. Classify the cause, then fix the cause:

| Cause | Fix |
| --- | --- |
| Missing `await` or an unawaited assertion | Await it; lint with `no-floating-promises` |
| Sleeps or fixed timeouts | Wait for the actual condition |
| Shared state or order dependence | Isolate data per test; reset between tests |
| Clock, time zone, DST, locale | Fake the clock; pin `TZ` and locale |
| Randomness | Seed or inject it |
| Port, file, or resource contention | Use ephemeral ports and temp directories per worker |
| Real network | Fake it |
| Passes locally, fails in CI | Compare CPU, locale, time zone, versions, and data |

Quarantine a test only with an owner and a ticket, and never "fix" flakiness with blind retries.

## Coverage and signals

Coverage shows which code ran, not what was verified. Use it to find untested branches; do not chase a percentage. Type checks and lint are tests too. For critical logic (money, permissions), consider mutation testing to see whether the suite notices deliberate breakage.

## Run tests efficiently

Run the narrowest check first (a single file or test: `vitest run path -t "name"`, `pytest path::test -x`, `phpunit --filter name`), then the package, then the full required suite once before handoff. In monorepos use the workspace filter (`pnpm --filter`, `turbo run test --filter`). Read the tail of a failing log before pasting any of it.

## Report

State which tests you added or changed, whether the new test failed on the old code, the commands run with their results, and any test you could not run and why.
