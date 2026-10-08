# Frontend Architecture & React 19

Read when: You are writing React 19 components, handling server action states, implementing optimistic UI updates, or managing client-server boundaries.

---

## 1. React 19 Server vs. Client Boundary Rules

- **Server Components (Default):** Fetch data directly, access database/backend secrets, render static markup on the server. Zero JavaScript sent to the client bundle.
- **Client Components (`'use client'`):** Required only when using hooks (`useState`, `useEffect`, `useRef`), browser APIs (`window`, `localStorage`, `navigator`), or DOM event listeners (`onClick`, `onChange`).

```tsx partial
// Server Component (app/dashboard/page.tsx)
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { MetricsOverview } from './metrics-overview';
import { UserActionButton } from './user-action-button';

export default async function DashboardPage() {
  const user = await db.query.users.findFirst();

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsOverview userId={user.id} />
      </Suspense>
      {/* Leaf client component */}
      <UserActionButton userId={user.id} />
    </main>
  );
}
```

---

## 2. React 19 `useActionState` & `useOptimistic` Pattern

```tsx partial
'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { updateProjectNameAction } from '@/actions/projects';

export function ProjectTitleEditor({ project }) {
  const [state, formAction, isPending] = useActionState(updateProjectNameAction, {
    success: true,
    error: null,
  });

  const [optimisticName, setOptimisticName] = useOptimistic(
    project.name,
    (current, update) => update
  );

  async function handleSubmit(formData) {
    const newName = formData.get('name');
    startTransition(() => {
      setOptimisticName(newName);
    });
    formAction(formData);
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-3">
      <input 
        name="name" 
        defaultValue={optimisticName} 
        disabled={isPending}
        className="px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900"
      />
      <input type="hidden" name="projectId" value={project.id} />
      <button type="submit" disabled={isPending} className="tactile-button">
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state.error && <p className="text-sm text-rose-500">{state.error}</p>}
    </form>
  );
}
```
