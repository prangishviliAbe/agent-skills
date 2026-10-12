# Durable mutation and webhook handling

Read when: Implementing webhooks, retries, idempotency, database transactions, or connection handling.

## Webhook contract

| Stage | Invariant |
| --- | --- |
| Receive | Bound body size; verify the provider signature over the exact raw bytes before trusting payload fields |
| Parse | Use the provider's supported verifier/parser and check required configuration |
| Identify | Scope event identity to provider/account/environment as needed |
| Apply | Dedupe and business changes commit atomically |
| External effect | Queue a durable outbox entry in the same transaction; worker uses provider-supported idempotency |
| Respond | Acknowledge only after required durable work succeeds; retryable failures remain retryable |
| Replay/order | Concurrent duplicates and out-of-order events cannot corrupt business state |

See [Stripe webhook documentation](https://docs.stripe.com/webhooks) for provider-specific signature, retry, and ordering behavior. Do not generalize one provider's verifier to all webhooks.

## Transaction example

```text
verify provider signature over raw body
validate event and relevant business identity

begin transaction
  insert unique (provider, account, event_id)
  if insertion reports conflict:
    finish as duplicate; do not apply the effect again
  apply business transition with valid-state/version guard
  insert outbox task if an external effect is needed
commit

on failure: rollback event marker and business transition together
after durable success: acknowledge
```

A separate "does event exist?" query cannot enforce concurrency. Inserting a processed marker outside the effect transaction can permanently lose a retried event. An outbox alone does not make a non-idempotent external effect exactly once; design crash recovery and reconciliation.

## Relevant regression matrix

| Scenario | Expected invariant |
| --- | --- |
| Valid delivery | Business change and marker committed |
| Replay | No repeated effect |
| Concurrent replay | Unique constraint decides one winner |
| Database fails before commit | No marker or business partial commit; retry can succeed |
| Older event arrives later | State/version guard prevents regression |
| Worker fails after external success | Retry/reconciliation does not duplicate effect |
| Invalid signature | No trusted business processing |

Choose a database driver and pool compatible with the deployment and transaction needs. Do not assume an HTTP driver supports every interactive transaction. Bound connections, timeouts, and retries; never retry a non-idempotent action blindly.
