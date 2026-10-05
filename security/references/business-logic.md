# Business logic, races, and workflow abuse

Read when reviewing or building money movement, coupons, stock, balances, invitations, quotas, multi-step workflows, or event handlers. These flaws have no malicious payload: every request is valid, and the invariant still breaks.

## Write the invariant first

"A coupon redeems at most `max_uses` times." "Stock never drops below zero." "Refunds never exceed the captured amount minus earlier refunds." "An order is fulfilled only after payment is confirmed." "An invitation grants only its stated role." Review the code against these sentences, under repeats, parallel requests, and out-of-order events. Protect legitimate use too: blocking every refund stops abuse and breaks the product.

## Races: a check followed by a write is not atomic

Two requests can both pass the check before either writes. Any `await`, database round trip, or network call between check and write opens the window, and several requests released together reliably land inside it.

```sql
-- Vulnerable: both requests read uses_left = 1, then both decrement
SELECT uses_left FROM coupons WHERE code = $1;
UPDATE coupons SET uses_left = uses_left - 1 WHERE code = $1;

-- Safe: check and write are one atomic statement
UPDATE coupons SET uses_left = uses_left - 1 WHERE code = $1 AND uses_left > 0 RETURNING uses_left;
```

| Problem | Fix |
| --- | --- |
| Limit overrun (coupon, stock, balance) | Conditional atomic update (`WHERE qty >= $n`) and check the affected row count |
| Duplicate creation | Unique constraint, handle the violation |
| Double submit or webhook replay | Idempotency key or event-id table committed with the effect |
| Cross-row invariant | `SELECT ... FOR UPDATE` in one transaction, an advisory lock, or SERIALIZABLE with retry on `40001` |
| Per-entity ordering | Serialize through a queue keyed by the entity |
| Multi-instance app | Never an in-memory lock or flag; use the database |

**Test it** against a local or authorized instance with synthetic data and a counter invariant. Release a bounded burst (about 20) at the same instant, then assert the invariant:

```ts
export async function fireTogether<T>(count: number, send: () => Promise<T>): Promise<T[]> {
  const gate = Promise.withResolvers<void>();
  const pending = Array.from({ length: count }, async () => {
    await gate.promise; // every request is ready before any is sent
    return send();
  });
  gate.resolve();
  return Promise.all(pending);
}
```

In a local run of a check-then-write handler with one remaining use, 15 simultaneous requests all succeeded (`uses left = -14`); the atomic version let exactly one through. Report the violated invariant and the counts, not an exploit script.

## Workflows and state machines

- Define allowed transitions in a table and enforce them inside the write: `UPDATE orders SET status = 'paid' WHERE id = $1 AND status = 'payment_pending'`. A request that skips a step, repeats one, or arrives late then changes nothing.
- Never trust step progress, prices, or totals carried in hidden fields or client state; recompute on the server at each step and at the final commit.
- Time-of-check versus time-of-use: bind an approval to the exact parameters (a hash) and an expiry, and re-verify at execution time.
- Events are at-least-once and unordered. Accept only forward transitions, key deduplication on the event id, and re-fetch authoritative state when order matters.

## Money, quotas, and rewards checklist

- Amounts, currency, and discounts come from the server; quantities and prices cannot be negative; set maximums.
- Totals equal the sum of their parts in integer minor units; decide rounding once, per line or per total.
- Coupons: per-user and global limits, expiry, eligibility, and stacking rules enforced atomically; discounts cannot exceed the total.
- Refunds and credits are bounded by what was captured minus what was already returned, under a lock or conditional update; partial refunds and rounding included.
- Gift cards, invite codes, and referral codes have high entropy and attempt limits; self-referral and referral loops are blocked.
- Reservations (stock holds, seat holds) expire; deleted or archived items cannot be purchased; a price changing mid-checkout follows a stated rule.
- Currency and unit conversions cannot be exploited by rounding or round-tripping.

## Sensitive flows and automation abuse

Signup, invitations, password reset and OTP sending, coupon redemption, ticket and drop purchases, trials, comments, and scraping can all be abused at scale with valid requests. Limit per identity and per target (including per recipient for SMS and email, which also controls toll-fraud cost), add friction or step-up only where abuse concentrates, cap spend, and alert on unusual redemption and signup patterns. Treat "works as designed" as incomplete until the abuse case has an owner.
