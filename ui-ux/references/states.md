# States and recovery

Read when: Designing any interactive element, data region, async action, or destructive operation.

The happy path is a fraction of what users see. An interface feels unfinished mostly because its other states were never designed. List the applicable states first, design those, and say which do not apply. Do not invent states an element cannot have.

## Coverage matrix

| State | Applies to | Requirement |
| --- | --- | --- |
| Default | Everything | Purpose and primary action clear without interaction |
| Hover | Pointer-operable controls | Subtle tone change; never the only way to reveal essential content or actions |
| Focus-visible | Every interactive element | Ring or equivalent with 3:1 contrast, not clipped, not removed |
| Pressed / active | Buttons, toggles | Immediate feedback within about 100ms |
| Selected / current / expanded | Tabs, rows, nav, toggles, disclosures | Persistent cue beyond color; exposed with the right ARIA state |
| Disabled / unavailable | Controls with unmet prerequisites | Looks inactive and says why nearby; prefer keeping the control enabled and explaining on activation when the reason is not obvious |
| Read-only | Fields the user may see but not change | Distinct from disabled; text selectable |
| Loading | Regions and actions that wait | See timing table below; layout does not shift when content arrives |
| Empty: first use | Collections | What this is for and the one action that starts it |
| Empty: no results | Search and filters | Echo the query or filters; offer to clear or broaden |
| Empty: cleared | Inboxes, queues | A plain confirmation that nothing is waiting |
| Partial | Lists, dashboards with several sources | Show what loaded; mark what did not, with retry for that part |
| Stale | Cached or offline data | Say how old it is; offer refresh |
| Error: validation | Inputs | At the field, specific, value preserved |
| Error: system | Any request | What failed in plain words, whether data is safe, how to retry or get help |
| Error: permission | Restricted areas | What is restricted and how to get access; do not show a broken page |
| Offline | Networked actions | What still works; queued actions are visible |
| Success | Completed actions | What changed; the next step; proportionate, no celebration for routine work |
| Unknown outcome | Payments, sends, deletes that time out | Say it is unconfirmed; check authoritative state before allowing a repeat |
| Overflow | Any text or collection | Longest name, largest number, hundreds of items, zero items, one item |

## Loading by duration

| Expected wait | Show |
| --- | --- |
| Under about 100ms | Nothing; a flash of spinner is worse than none |
| 100ms to 1s | Subtle inline indicator on the control or region; keep existing content visible |
| 1s to 10s | Skeleton matching the final layout, or a spinner with a label for actions |
| Over 10s | Progress with steps or percentage if truthful, a description of what is happening, and a way to cancel or leave and return |

- Delay the indicator briefly (about 150 to 300ms) so fast responses show none, and keep it visible long enough not to flicker.
- Skeletons mirror the real layout: same heights, same number of lines. A generic gray block that jumps when content arrives defeats the purpose. Shimmer is optional; do not add it for effect.
- Prefer optimistic updates for reversible, likely-to-succeed actions (toggle, reorder, like), with a clear rollback and message on failure. Never optimistic for payments, sends, or deletes.
- Buttons in progress keep their width, show a spinner or label change in place ("Saving…"), and ignore further activation.
- Announce completion of long operations to assistive technology with a polite status region.

## Empty states

```text
First use:   "No shipments yet. Create your first shipment to get a tracking code."  [Create shipment]
No results:  "No shipments match "GE-104" with status Delayed."  [Clear filters]
Cleared:     "Nothing needs your attention."
No access:   "You do not have access to invoices. Ask an admin of Tbilisi Cargo for the Billing role."
Failed:      "Could not load shipments. Your data is safe."  [Try again]
```

These five are different situations and must not share one generic "Nothing here" screen. An empty state needs one sentence and one action. An illustration is optional and never a substitute for the sentence.

## Errors

A good error message answers three things: what happened, whether the user's work is safe, and what to do now.

| Instead of | Write |
| --- | --- |
| "Something went wrong" | "We could not save your changes. They are still here; try again." |
| "Invalid input" | "Enter the 10-digit code from your receipt." |
| "Error 500" | "Our server did not respond. Try again in a minute." (keep the code available for support) |
| "Unauthorized" | "Your session ended. Sign in again; your draft is saved." |

- Place the message where the problem is. Page-level summary plus field-level messages for long forms.
- Never blame the user, never use humor in failure, never clear what they typed.
- Do not rely on color; add an icon and text.
- Offer retry only when retrying is safe. For non-idempotent actions, reconcile first.
- Log technical detail for support; show a reference the user can quote when it helps.

## Destructive actions

| Reversibility | Design |
| --- | --- |
| Easily reversible | Do it immediately, offer Undo for several seconds, and keep Undo reachable by keyboard |
| Reversible within a period | Move to trash or archive; say how long it stays |
| Irreversible, low impact | Confirmation that names the object: "Delete draft 'Q3 tariffs'?" with the button "Delete draft" |
| Irreversible, high impact | Confirmation stating the consequence and scope; require typing the name only for truly severe cases |

The confirm button states the action, never "OK" or "Yes". The safe choice has initial focus. Destructive buttons are visually distinct and placed apart from frequent actions. Bulk destructive actions state the count.

## Unknown outcome

```text
Pending:    "Submitting transfer…"                       (button disabled, width unchanged)
Timeout:    "We have not confirmed this transfer yet."   (not "failed")
Action:     "Check status" fetches the authoritative result.
Confirmed:  show reference and final amount.
Failed:     keep amount and recipient for a safe retry.
Guard:      do not offer "Try again" until the outcome is known,
            unless the backend guarantees idempotency.
```

## Layout stability

- Reserve space for content that arrives later: images with dimensions, error messages under fields, counters, badges.
- Changing state never changes size: bold on hover, a border appearing on focus, or a spinner replacing a label must not move neighbors. Use outline or an existing transparent border.
- Insert new items where the user expects them and do not move content under the pointer or the focused element.

## Checks

| Check | Pass |
| --- | --- |
| Inventory | Applicable states listed per component; non-applicable ones stated |
| Loading | Matches final layout; no flicker; no shift |
| Empty | Each kind distinct, with one sentence and one action |
| Errors | Specific, placed at the cause, input preserved, recovery offered |
| Destructive | Undo or a named confirmation; safe default focus |
| Unknown | Never reported as failure; repeat guarded |
| Extremes | Zero, one, many, longest text all look intended |
