# Frontend boundaries, forms, and state

Read when: Working on React rendering boundaries, forms, async feedback, or optimistic state.

| Decision | Correct approach | Failure to avoid |
| --- | --- | --- |
| Server/client boundary | Use the installed framework model; isolate browser interaction | Moving secrets or the entire page into a client bundle |
| Data loading | Start independent requests together; stream meaningful boundaries | Assuming Suspense parallelizes sequential awaits |
| Forms | Native labels, clear submit action, retained input, relevant validation | Placeholder-only labels or erased values after error |
| Pending | Communicate actual work and keep layout stable | Showing success before server confirmation |
| Optimistic update | Only for a recoverable operation with reconciliation | Optimistic finality for money movement or irreversible deletion |
| Stale responses | Track attempt/version and apply only relevant outcomes | Older response overwrites a newer edit |
| Styling | Real content, coherent tokens, responsive fit, state polish | Decorative dots, card stripes, fake data, or unfinished boxes |

React Server Components can reduce shipped component JavaScript, but their rendered tree may contain Client Components and hydration work. Do not claim an entire route ships zero JavaScript merely because the page is server-rendered.

## Action-state form example

```tsx partial
'use client';

import { useActionState } from 'react';
import { saveName } from './actions';

export function NameForm() {
  const [state, action, pending] = useActionState(saveName, { error: null });
  return (
    <form action={action}>
      <label htmlFor="project-name">Project name</label>
      <input
        id="project-name"
        name="name"
        required
        aria-describedby={state.error ? 'name-error' : undefined}
        aria-invalid={state.error ? true : undefined}
      />
      <button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save name'}
      </button>
      <p role="status" id="name-error">{state.error}</p>
    </form>
  );
}
```

This is a structural fragment, not a finished styled form or proof of accessible behavior. Integrate project identity, server-side authorization, retained field values, success feedback, and the actual design system. Check [React useActionState](https://react.dev/reference/react/useActionState) for the installed version's action context and reset behavior.

For optimistic UI, perform the optimistic update within the action/transition context and await the authoritative operation as required. Keep server identity/state as the source of truth; reconcile success and failure deliberately.
