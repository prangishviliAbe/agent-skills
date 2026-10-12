# Next.js request and cache boundaries

Read when: Modifying App Router actions, request APIs, route handlers, caching, or invalidation.

Inspect the installed Next.js version, configuration, types, and bundled documentation. Current docs can differ from the project. Do not mechanically migrate routing, caching, or middleware/proxy naming during an unrelated fix.

| Boundary | Decision |
| --- | --- |
| Server Action | Authenticate and authorize inside the action; arguments are untrusted |
| Request API | Use the installed signatures; modern request APIs such as cookies/headers may require await |
| Private data | Scope identity and avoid leaking through shared caches |
| Mutation result | Return minimal safe state; preserve framework redirect/not-found control flow |
| Invalidation | Match required freshness and installed API; distinguish stale-while-revalidate from read-your-writes |
| Cache tags | Define their resource/tenant scope; do not let a client choose arbitrary invalidation tags |

## Authorized mutation fragment

```typescript partial
'use server';

import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { updateTag } from 'next/cache';
import { getSession, db, projects } from './project-services';

const inputSchema = z.object({ projectId: z.string().uuid() });

export async function deleteOwnProject(input: unknown) {
  const session = await getSession();
  if (!session) return { error: 'Sign in to continue.' };

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { error: 'Choose a valid project.' };

  const deleted = await db.delete(projects)
    .where(and(
      eq(projects.id, parsed.data.projectId),
      eq(projects.ownerId, session.user.id)
    ))
    .returning({ id: projects.id });

  if (deleted.length === 0) return { error: 'Project unavailable.' };
  updateTag(`projects:${session.user.id}`);
  return { error: null };
}
```

The fragment assumes the installed version supports updateTag, that tagged reads use the same trusted scope, and that deletion has the required dependency/transaction semantics. It is not a complete application. A signed-in page redirect does not protect this callable action.

For current Next.js, [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) is intended for read-your-writes in Server Actions. [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) with a profile such as "max" provides stale-while-revalidate behavior; the one-argument form is deprecated in current docs. Verify these facts against the installed version.

Test wrong-owner requests, signed-out calls, stale UI after success, and failure recovery when relevant. Do not catch framework control-flow exceptions and convert them blindly into generic errors.
