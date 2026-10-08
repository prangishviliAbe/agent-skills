# Output Craft & Before/After Transformations

Read when: You are condensing responses, writing status summaries, or communicating technical concepts with high density in English and Georgian.

---

## 1. Concrete Transformation: Fluff to Signal

### Before (Wordy, 220 Tokens):
> "Hello! Certainly, I would be more than happy to help you with your query regarding caching in Next.js. Next.js offers a powerful suite of caching mechanisms designed to optimize your application's speed. To invalidate your cache when a user updates their profile, you can use the `revalidatePath` function which is provided by `next/cache`. Here is an example of how you might write that function in your server action..."

### After (High Signal, 35 Tokens):
> Call `revalidateTag` inside your Server Action to purge the targeted cache without invalidating unrelated routes:
> ```typescript partial
> 'use server';
> import { revalidateTag } from 'next/cache';
> 
> export async function updateUser(id: string) {
>   await db.update(...);
>   revalidateTag(`user-${id}`);
> }
> ```

---

## 2. Georgian (ქართული) Precision Communication

Keep Georgian technical communication sharp and direct:

```text
[Weak / Overly Verbose]:
"გამარჯობა! რა თქმა უნდა, სიამოვნებით დაგეხმარებით ამ პრობლემის მოგვარებაში. აღნიშნული შეცდომა გამოწვეულია იმით, რომ..."

[High-Signal / Direct]:
"შეცდომის მიზეზია ვალიდაციის ნაკლებობა Server Action-ში. გამოსწორება:
1. `UpdateSchema.safeParse(data)`-ით შეამოწმე პარამეტრები.
2. გაუშვი `npm run check` გადასამოწმებლად."
```
