# AI features in an interface

Read when: Designing generation, chat, streaming output, tool or agent activity, citations, drafts, approvals, or any feature whose output is uncertain.

AI features fail in two ways: they overstate what the system knows or did, and they dress the feature in sparkles, gradients, and pulsing dots instead of designing its states. Treat an AI feature as a slow, fallible collaborator: show its work honestly, keep the user in control, and use the product's ordinary visual language.

## Contract

| Moment | Requirement |
| --- | --- |
| Before | Say what the feature does and what data it uses, at the point of use. A good input beats a blank box: offer real starting points based on the user's context, not generic prompt chips |
| Submit | Immediate acknowledgment; the input stays visible and editable for a follow-up |
| Waiting | Honest status in words ("Reading 3 documents…"). Show steps when they are real. Always offer Stop |
| Streaming | Text appears stably without reflowing what was already read; auto-scroll only while the user is at the bottom, and stop following when they scroll up; provide a "jump to latest" control |
| Complete | Mark the result as finished; offer the actions that fit: copy, edit, insert, regenerate, give feedback |
| Partial or stopped | Keep what was produced, mark it incomplete, allow continue or retry |
| Failure or refusal | Say what could not be done and what the user can try; never present a failure as a result |
| Long tasks | Let the user leave and return; notify on completion; keep a history of results |

## Trust

| Concern | Design |
| --- | --- |
| Generated versus source | Visually and textually distinguish generated text from quoted source material and from the user's own content |
| Sources | Cite next to the claim, linking to the exact passage; never show citations that were not actually used |
| Uncertainty | State it in words where it matters ("Based on the contract only; no payment records were available"). Do not invent confidence percentages |
| Errors in output | Make verification easy: show the source beside the summary, show a diff for edits, show the data behind a number |
| Actions with side effects | Draft first. Show exactly what will be sent, changed, or bought, and require an explicit confirmation unless the user has granted standing permission for that exact action |
| Unknown outcome of an action | Check the authoritative state before reporting or retrying |
| Reversibility | Changes made by AI are undoable, with history; overwriting user work silently is never acceptable |
| Memory and data | Say what is remembered and let the user see and remove it |

## Showing agent or tool activity

- Show a short, user-facing summary of what is happening and what it means for them, with details available on demand. Raw parameters and logs stay out of the main flow unless the user is a developer.
- Use the tense that is true: "Searching…" while it is happening, "Searched 12 files" when done, "Could not reach the calendar" on failure.
- Do not fabricate reasoning or display hidden chain-of-thought as a feature. Show actions taken and evidence used.
- Ask for approval at the right granularity: once per meaningful decision, not for every trivial step, and never bundled so that a risky action hides among safe ones.
- Queue, don't block: the user can keep working or add instructions while a task runs.

## Visual language

Use the product's normal typography, color, and components. Do not add: sparkle or wand icons as the feature's identity; purple or rainbow gradients to mark "AI"; glowing borders around inputs; pulsing dots as fake activity; typing effects that slow down already-available text; shimmer on text; decorative "thinking" animations. A plain label, a stop control, and accurate status are enough. If the feature needs a mark, name it in words.

Streaming is real progress and may be shown as it arrives. Artificially animating text that is already complete is decoration and delays reading.

## Input design

- The input states what can be asked and shows a few specific examples drawn from the user's own context.
- Multi-line input grows with content up to a limit; Enter and Shift+Enter behavior is stated or conventional; the send control is disabled only while empty or submitting.
- Attachments, selected context, and scope ("this document", "all shipments this month") are visible and removable before sending.
- Editing and resubmitting a previous request is possible without retyping.

## Accessibility

- Announce start and completion through a polite status region; do not announce every token.
- The stop control is reachable by keyboard immediately after submit.
- Focus does not jump while content streams.
- Generated content uses real headings, lists, and tables so it can be navigated.
- Respect reduced motion: no animated cursors or streaming flourishes beyond the text itself.

## Example: contract summary with an email draft

```text
Input:     User selects a contract and chooses "Summarize".
Status:    "Reading the contract (14 pages)…" with Stop.
Output:    Summary streams in; each point links to its clause; marked "Generated summary".
Complete:  Copy, Edit, Regenerate. Note: "Covers this contract only."
Stopped:   Partial summary kept and labeled "Incomplete: stopped at section 6". [Continue]
Failure:   "We could not read pages 9 to 11 (scanned images)." Summary of the rest remains.
Next:      "Draft an email to the client" produces an editable draft with recipient and
           subject shown. Nothing is sent until the user selects "Send email".
Unknown:   If sending times out: "We have not confirmed this email was sent." [Check status]
Announce:  "Summary ready" on completion; no per-token announcements.
```

## Checks

| Check | Pass |
| --- | --- |
| Honesty | Status, sources, and outcomes reflect what actually happened |
| Control | Stop, edit, undo, and regenerate available where they apply |
| Side effects | Nothing external happens without a preview and an explicit action |
| Failure | Partial results kept; failures and refusals explained |
| Visual restraint | No AI-specific ornament; ordinary product styling |
| Scroll and focus | Streaming does not move the reader or the focus |
