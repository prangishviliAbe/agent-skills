# States, transitions, and recovery

Read for inputs, asynchronous work, transactions, permissions, and failure handling. Select relevant states; the table is a discovery aid, not a demand to draw every combination.

## State inventory

| Concern | Candidates to consider |
| --- | --- |
| Interaction | Default, hover where supported, focus-visible, pressed, selected/expanded, disabled, read-only |
| Data lifecycle | Initial loading, loaded, refreshing, stale, optimistic update, timeout, canceled request |
| Emptiness | First use, no matches, no remaining work, empty after deletion |
| Failure | Field/form validation, offline, request failure, partial failure, denied access, not found, conflict, rate limit |
| Outcome | Confirmed success, confirmed failure, pending external processing, unknown result |
| Access | Signed out, expired session, changed permission, quota exceeded |
| Content | Long/missing text, missing image, zero/one/many items, large/negative/unknown values |
| Environment | Relevant widths, keyboard/touch, zoom, reduced motion, supported themes/locales, slow network |

Model mutually exclusive states and allowed transitions. Independent flags such as "saving" and "has unsaved changes" may coexist; avoid impossible combinations such as confirmed success and confirmed failure for the same attempt.

## A state needs a contract

For each meaningful transition, specify:

| Field | Question |
| --- | --- |
| Trigger / condition | What event enters the state? Which response is authoritative? |
| Visible result | What changes, and what remains available? |
| Data | What is retained, committed, discarded, or potentially stale? |
| Controls | Which actions remain possible? What prevents accidental repeats? |
| Focus / announcement | Where does focus remain or move? What status is announced? |
| Recovery / exit | What can the user do next, including leaving or returning? |

For a component, a small table often suffices. For branching transactions, use a state diagram or written transition list with acceptance criteria.

## Loading and asynchronous behavior

- Give immediate acknowledgement of activation without flashing a distracting spinner for every fast response. Choose indicator timing from measured latency and context; timing heuristics are not accessibility standards.
- Use skeletons when layout is predictable and they aid orientation; use concise status or progress when they better explain the work.
- Preserve useful previous data during refresh where safe, with stale status when freshness matters. Do not make outdated transactional data appear current.
- Show determinate progress only when the quantity is known. Do not fabricate a percent or completion estimate.
- Distinguish canceling a request, dismissing the view, and undoing a completed operation. A closed dialog does not necessarily cancel server work.
- For long jobs, state whether the user may leave and how they find the result. Offer cancellation only if supported and describe any partial effects.
- Prevent duplicate submission at the interface, but treat server idempotency or authoritative result reconciliation as an implementation dependency for consequential writes.
- Preserve focus on a busy action when possible. Disabling or replacing a focused control can disrupt navigation; test the actual implementation.

## Failure and uncertain outcome

| Situation | Response |
| --- | --- |
| Known validation failure | Identify the correction, associate messages with fields, preserve valid input |
| Known request rejection | State what did not change and the available retry or alternative |
| Timeout after payment/save/send | Say the outcome is being checked or remains unknown; reconcile using an operation identifier/status before prompting a duplicate attempt |
| Background refresh failure | Keep useful loaded data with appropriate stale/error feedback; retry refresh without blanking the page |
| Partial bulk success | Identify succeeded and failed items, preserve actionable selection, retry only eligible failed work |
| Concurrent edit conflict | Explain newer data and offer a supported comparison, merge, reload, or copy path; do not overwrite silently |
| Expired session | Protect unsaved work where safe, authenticate, then return to the intended task |
| Rate limit | Explain when or how to retry using actual server information; preserve work |

Do not claim that data was preserved, an operation was canceled, or nothing was charged unless the system can establish it. Error copy should state the known condition and actionable next step without blaming the user or exposing sensitive internals.

## Sensitive drafts and consequential transactions

For money movement, identity changes, legal submissions, or similarly consequential flows, specify these related boundaries together when drafts or retries exist:

- The stable operation identifier and authoritative status lookup used to reconcile an unknown outcome.
- The server-side idempotency or state-transition guarantee that makes a repeat safe; a disabled submit control is only interface protection.
- Which data is a client draft versus an accepted operation, where the draft may be stored, who can access it, and when it expires or is cleared.
- What happens after session expiry, reauthentication, return from verification, process restart, or a second device.

Do not place sensitive drafts in a URL or promise persistence, cancellation, or retry safety without a corresponding system capability. Preserve a draft only where its privacy and lifecycle are designed, then require an explicit user action before a consequential operation resumes.

## Empty and unavailable states

Give the reason and useful next action when one exists. "No alerts" may be a successful resting state and need no creation CTA. "No results" needs query/filter recovery. "No access" needs permission guidance, not onboarding copy. A tiny component may need a clear label rather than a full illustration and explanation.

## Validation timing

| Moment | Decision |
| --- | --- |
| First input | Avoid premature errors while an answer is incomplete; immediate assistance such as a character limit may be useful |
| Blur | Validate complete values when the rule is clear and the feedback helps; avoid unnecessarily validating untouched fields |
| After an error | Clear or update feedback as the value becomes valid; avoid announcing every keystroke |
| Submit | Validate the complete request, preserve data, and guide focus to an error summary or relevant field |
| Async validation | Mark pending where necessary; ignore stale responses and avoid exposing account existence or other sensitive information |

Use product rules actually supplied. An example password length is not authorization to change the password policy.

## Consequential actions

Choose protection according to reversibility, scope, user expectation, and harm, not a fixed confirmation recipe.

- Low-risk reversible actions often suit immediate execution with accessible undo.
- Irreversible or broad actions need clear scope and consequences before commitment; show the affected count and object identity.
- High-impact reversible actions may still warrant review because restoration can be costly or incomplete.
- Use typed confirmation only where it adds meaningful protection; never make it a ritual for every deletion.
- Keep undo available long enough for the actual task and accessible without chasing a disappearing toast. A durable recovery path may be more suitable.
- Do not use a disabled control as the sole explanation of a prerequisite.

## Example acceptance criteria

For an invoice update:

- A confirmed validation failure retains edits and identifies the fields that need correction.
- A network timeout shows "We could not confirm the save" and checks the operation status before inviting another write.
- When the record changed elsewhere, the user can preserve their draft while reviewing the newer version.
- A confirmed save communicates success and leaves focus in a useful location.
- Refreshing or navigating back behaves according to the explicitly specified draft/persistence policy.

These are scenarios to adapt and test, not evidence that an implementation already supports them.
