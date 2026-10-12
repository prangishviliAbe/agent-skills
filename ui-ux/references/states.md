# State and recovery contracts

Read when: Designing a form, action, data region, async flow, or destructive operation.

Apply states by behavior rather than requiring a fixed number for every element.

| State | Visual/content requirement | Behavior |
| --- | --- | --- |
| Default | Task and action clear | Stable labels and layout |
| Hover / press | Restrained feedback for a real control | No pointer-only access to essential content |
| Focus-visible | Strong, unclipped focus cue | Logical navigation and visible focused control |
| Selected / expanded | Persistent non-color cue | State exposed in appropriate semantics |
| Unavailable | Explain prerequisite near the action | Native disabled or aria-disabled according to interaction; prevent activation correctly |
| Invalid | Specific error beside the field | Preserve value; associate message; focus first relevant issue on submission |
| Pending | Honest progress; stable control size | Prevent accidental duplicate operation without blocking unrelated work |
| Confirmed success | Actual outcome and next useful step | Update source of truth and announce proportionally |
| Confirmed failure | Explain recovery | Preserve safe input; retry only when safe |
| Unknown outcome | Say confirmation is pending | Reconcile authoritative state before repeating consequential work |
| Empty | Explain absence and useful action | Distinguish initial empty, no matches, permission limit, and load failure |
| Partial / stale | Identify incomplete or old data | Keep useful results while offering refresh/recovery |

A native disabled control is valid when a nearby explanation makes the prerequisite clear. Do not make every disabled action clickable simply to show an error. Do not depend on a tooltip that a disabled element cannot receive focus to expose.

## Unknown transfer example

```text
Pending: "Submitting transfer…"
Timeout: "We have not confirmed this transfer yet."
Recovery: "Check transfer status" fetches the authoritative result.
Confirmed failure: Keep amount and recipient for a safe retry.
Confirmed success: Show the actual reference and final amount.
Unknown: Do not say "failed" and do not promise duplicate prevention without backend support.
```

For deletion, state the actual object and consequence. Preserve a stable reference while pending. If deletion may complete after timeout, reconcile before offering another destructive action. Provide undo only when the system supports it.
