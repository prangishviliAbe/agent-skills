# Backend, Databases & Webhook Engineering

Read when: You are connecting databases with Drizzle/Prisma, configuring serverless connection pooling, or writing idempotent webhook handlers.

---

## 1. Idempotent Webhook Processing (Stripe / GitHub)

Webhooks can deliver duplicate events due to network retries. Always enforce an idempotency key:

```typescript partial
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { processedEvents, subscriptions } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  // 1. Check idempotency: Have we already processed this event?
  const existing = await db.query.processedEvents.findFirst({
    where: eq(processedEvents.eventId, event.id),
  });

  if (existing) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
  }

  // 2. Process event inside transaction
  await db.transaction(async (tx) => {
    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object;
      await tx.update(subscriptions)
        .set({ status: sub.status, currentPeriodEnd: new Date(sub.current_period_end * 1000) })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));
    }

    // Record processed event ID
    await tx.insert(processedEvents).values({
      eventId: event.id,
      eventType: event.type,
      processedAt: new Date(),
    });
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
```

---

## 2. Serverless Database Connection Pooling

Serverless lambdas can easily overwhelm database connection pools. Always connect via a connection pooler (e.g. PgBouncer, Neon, Supabase Pooler):

```typescript partial
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```
