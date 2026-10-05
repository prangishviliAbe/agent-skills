# Integrations: payments, webhooks, sign-in, email, third-party APIs

Read when the work talks to an external service: payment providers, webhooks, OAuth or social sign-in, email, storage, search, maps, analytics, or AI APIs. Handler structure is in [backend.md](backend.md); data constraints in [database.md](database.md).

## Discipline for every provider

1. Read the provider's current docs for the API version and SDK major version the project uses. Pin the API version; provider APIs change behavior across versions.
2. Use sandbox or test mode and test keys. Never use real money or real customer data to test.
3. Wrap the provider in one adapter module: typed inputs and outputs, timeouts, error mapping, redacted logging, and retries only where the operation is safe to repeat.
4. Treat provider responses as untrusted input: validate their shape, tolerate unknown enum values, follow pagination, and honor 429 with `Retry-After`.
5. Store the provider's ids (customer, payment, event, object) beside your own so you can reconcile later.
6. Keep keys in server-only environment variables, one set per environment, scoped to the least privilege the provider offers.
7. A mock in a test is not an integration. Fake at the HTTP edge with provider-shaped fixtures, and label anything not exercised against the sandbox as *Not integrated*.

## Payments (Stripe-style flow)

- The server decides amount and currency from your catalog. The client sends item ids and quantities, never prices.
- Prefer the provider's hosted or embedded payment UI so card data never reaches your servers.
- Create the checkout or payment object on the server with an idempotency key derived from your order id, so a retry cannot charge twice. Build redirect URLs from trusted configuration, not from the `Origin` or `Host` header.
- **Fulfill from the webhook, not the browser redirect.** The return page only displays status read from your database.
- Model the order as a forward-only state machine (`created`, `payment_pending`, `paid`, `fulfilled`, `refunded`) and apply each transition with a conditional update.
- Handle the unhappy paths: payments that complete later, authentication challenges, failures, refunds, disputes, partial captures, currency or amount mismatch (compare the event's amount with the order), duplicate events, and events arriving out of order (re-fetch the object for its current state).

```ts
const session = await stripe.checkout.sessions.create(
  {
    mode: 'payment',
    line_items: items.map((item) => ({ price: item.stripePriceId, quantity: item.quantity })),
    client_reference_id: order.id,
    metadata: { orderId: order.id },
    success_url: `${config.appUrl}/orders/${order.id}`,
    cancel_url: `${config.appUrl}/cart`,
  },
  { idempotencyKey: `checkout-${order.id}` },
);
```

Test locally with the provider's CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`, then `stripe trigger payment_intent.succeeded`) and its published test cards.

## Webhooks from any provider

1. **Authenticate before acting.** Verify the provider's signature over the exact raw bytes, with a timestamp tolerance where the protocol has one, using a constant-time comparison. Parsing JSON first can change the bytes and break verification, so configure raw-body access for this route (`express.raw({ type: 'application/json' })`, `await request.text()` in a Web-standard handler).
2. Check the event belongs to your account and to a resource you know.
3. **Process each event exactly once in effect.** Commit the event id and the resulting database changes in one transaction. If processing fails, the transaction rolls back, the id is not recorded, and the provider's retry runs it again. Recording the id first and processing afterward loses the event when processing fails. Also guard the business operation itself (one fulfillment per order, applied with a conditional update), because a provider can send two different events for the same action.
4. Respond 2xx once the event is durably accepted, quickly. Use non-2xx for retryable failures. Do slow work (emails, fulfillment calls) through an outbox or queue.
5. Expect duplicates, delays, and reordering. When order matters, fetch the object's current state from the provider's API instead of trusting the event payload's snapshot.
6. Run a reconciliation job that compares provider records with your database to catch events that never arrived.

```ts
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) return new Response('missing signature', { status: 400 });

  const payload = await request.text(); // exact raw body
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('invalid signature', { status: 400 });
  }

  await db.transaction(async (tx) => {
    const isNew = await tx.events.insertIfNew(event.id); // UNIQUE(event_id)
    if (!isNew) return; // already applied in a committed transaction
    await applyEvent(tx, event); // all database effects in the same transaction
  });
  return new Response('ok');
}
```

For providers that sign with a plain HMAC (GitHub's `X-Hub-Signature-256`, for example):

```ts
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyHmacSha256(rawBody: string, header: string | null, secret: string): boolean {
  if (!header?.startsWith('sha256=')) return false;
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest();
  const received = Buffer.from(header.slice('sha256='.length), 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}
```

Use a different secret per endpoint and environment, and never log signing secrets.

## OAuth and social sign-in

- Use a maintained auth library or managed provider rather than hand-writing token handling. Use the authorization code flow with PKCE (S256), a `state` value bound to the initiating browser session, and exactly registered redirect URIs.
- Validate ID tokens: signature from the issuer's JWKS, `iss`, `aud`, `exp`, and the `nonce` you issued.
- Link identities by (issuer, subject). Email is a contact attribute, not an identity; linking by email is only safe when the provider vouches the address is verified, and it should require the user to authenticate to the existing account first.
- Request the minimum scopes. Store refresh tokens encrypted, server-side only. Plan for revoked and expired grants.
- Redirect URIs and client secrets differ per environment; the client secret is server-only.

## Email

- Send through a transactional provider from a queue job, idempotently. Render both HTML and plain text, and build absolute links from configuration.
- Authenticate the sending domain: SPF, DKIM, and DMARC (start at `p=none` with reports, then tighten). Keep transactional and marketing mail on separate streams or subdomains.
- Bulk and marketing mail needs `List-Unsubscribe` with one-click `List-Unsubscribe-Post`, plus bounce and complaint webhook handling that suppresses addresses.
- Password-reset and magic links: single-use, short expiry, high-entropy token stored hashed, never reusable after exchange.
- Test locally with a catch-all inbox (Mailpit, MailHog) rather than a real provider.

## Storage, search, maps, analytics, AI APIs

- **Object storage:** private buckets, presigned uploads with fixed key, size, and content type, narrow CORS, lifecycle rules, signed URLs for private downloads.
- **Search:** keep the index in sync through events or an outbox; give browsers search-only keys and enforce tenant filters server-side or with per-tenant keys. Never ship an admin key to the client.
- **Maps and public keys:** restrict browser keys by referrer, enable quotas and billing alerts.
- **Analytics and session replay:** respect consent, mask inputs, send no personal data you do not need.
- **LLM APIs:** call from the server only, set timeouts and per-user spend limits, validate structured output before acting on it, log redacted metadata, and never put credentials in prompts.

## Verify

Exercise the sandbox end to end: create, pay with a test method, receive the webhook, see the order become paid. Then replay the same event (no second effect), send a bad signature (400), send an unknown event type (2xx, ignored), force a timeout (no duplicate charge), and trigger a refund. Record which parts ran against the sandbox and which were mocked.
