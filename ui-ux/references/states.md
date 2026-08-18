# The state matrix

Read whenever specifying a screen or a component. Most incomplete designs are incomplete here.

## The matrix

Walk every row for every screen and every component that displays data or accepts input. Mark each cell as designed, not applicable, or open.

| Group | States |
| --- | --- |
| Interaction | default, hover, focus-visible, active/pressed, selected, disabled, read-only |
| Data loading | initial load, skeleton, background refresh, optimistic, stale-while-revalidating, timeout |
| Emptiness | empty first use, empty after filtering, empty after deletion, no permission, feature unavailable |
| Errors | field validation, form-level error, request failure, partial failure, offline, permission denied, not found, conflict, rate limited, server error |
| Success | inline confirmation, toast, redirect with context, undo window, next-step prompt |
| Content extremes | one item, many items, very long string, missing image, missing optional field, huge number, negative number, zero |
| Identity and access | signed out, signed in, expired session, restricted role, trial or quota exceeded |
| Environment | small viewport, keyboard only, touch, reduced motion, dark mode, slow network, RTL, translated text |

## The four that get skipped, and what each must contain

**Empty state.** Never just "No data". It contains: what belongs here, why it is empty right now, and the single action that fills it. Distinguish *"you have not created one yet"* (teach and invite) from *"your filter matched nothing"* (offer to clear the filter). These are different states with different copy and different actions.

**Error state.** Contains: what happened in the user's terms, whether their data was lost, what they can do now, and a way to retry or get help. Never expose a stack trace or a raw code alone. Never blame the user. Preserve everything they typed.

**Loading state.** First load and background refresh are different. First load: a skeleton that matches the final layout so nothing shifts when data arrives. Background refresh: keep the old data visible with a subtle indicator; do not blank the screen. Anything over roughly ten seconds needs progress or a cancel option, not a spinner that spins forever.

**Partial failure.** One widget failing must not blank the page. Design the degraded view: which parts still work, how the broken part reports itself, and how to retry just that part.

## Validation timing

| Moment | Behavior |
| --- | --- |
| While typing, first attempt | Silent. Do not shout at someone mid-word |
| On blur | Validate if the field has content and a clear format rule |
| After a failed submit | Validate live on every keystroke so the user sees the fix land |
| On submit | Validate everything, focus the first invalid field, and summarize the count |

Error messages say what is wrong **and** what correct looks like: "Password needs at least 12 characters" beats "Invalid password". Never clear the field. Never lose the rest of the form.

## Destructive actions

Scale the friction to the consequence:

| Consequence | Pattern |
| --- | --- |
| Reversible, low value | Do it immediately, offer undo |
| Reversible, high value | Do it, offer undo prominently and for longer |
| Irreversible, low value | One confirmation naming the object |
| Irreversible, high value | Confirmation that states the consequence, plus typed confirmation of the name for the highest tier |

Undo beats confirmation whenever it is technically possible: it does not interrupt the confident user and it still protects the mistaken one. Never place a destructive action adjacent to a frequent one without visual and spatial separation.

## Async feedback rules

- Under ~100ms: no indicator. An indicator that flashes is worse than none.
- 100ms to ~1s: subtle inline indicator on the control that was activated.
- Over ~1s: skeleton or progress, and the control stays visibly busy and non-repeatable.
- Over ~10s: progress with an estimate if possible, a cancel option, and a promise about what happens if they leave.
- Announce meaningful changes to assistive technology through a live region, and keep focus predictable.
- After an action, the confirmation appears where the user is looking — near the control, not in a corner they are not watching.

## State specification format

For handoff, specify each state as a row rather than a separate mockup:

```
Component: OrderRow
State           Trigger                 Visual                     Copy                          Announce
default         —                       surface, border            —                             —
hover           pointer over            surface-hover              —                             —
focus-visible   keyboard focus          2px focus ring, offset 2   —                             —
loading         action pending          button spinner, disabled   "Cancelling…"                 polite
error           request failed          border-danger, inline msg  "Could not cancel. Try again"  assertive
empty           no orders               illustration + CTA         "No orders yet" + "Create one" —
```

This table is worth more to a developer than five polished screens, and it is what makes the implementation match the design.
