# Next.js App Router Architecture

Read when: You are configuring Next.js 15/16 App Router routing, caching models, Server Actions, route handlers, or middleware.

---

## 1. Type-Safe Server Actions with Zod

Server Actions must validate incoming arguments before performing database mutations:

```typescript partial
'use server';

import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const UpdateProjectSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(2).max(64),
});

export async function updateProjectNameAction(prevState, formData) {
  const result = UpdateProjectSchema.safeParse({
    projectId: formData.get('projectId'),
    name: formData.get('name'),
  });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await db.update(projects)
      .set({ name: result.data.name, updatedAt: new Date() })
      .where(eq(projects.id, result.data.projectId));

    revalidateTag(`project-${result.data.projectId}`);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: 'Failed to update project name. Please try again.' };
  }
}
```

---

## 2. Dynamic IO & Tag-Based Caching

Next.js 15/16 replaces blanket caching with granular, explicit cache tags:

```typescript partial
// Fetching with targeted revalidation tags
export async function getProject(id: string) {
  'use cache';
  cacheTag(`project-${id}`);

  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
  });
}
```
