# AI interfaces and trustworthy state

Read when: Designing generation, streaming, tool activity, citations, drafts, approval, or partial results.

| State or concern | Contract |
| --- | --- |
| Start | Explain the capability and relevant data use at the point of action |
| Streaming | Keep useful text readable; preserve scroll intent; offer stop |
| Completion | Mark the actual finished result; keep edit/regenerate/copy available as appropriate |
| Partial failure | Preserve useful output and disclose incompleteness; offer a safe retry |
| Refusal | Explain the actionable limitation without inventing a successful result |
| Sources | Place supporting sources beside claims; distinguish supplied text from generated inference |
| Uncertainty | Say what is uncertain; do not invent confidence percentages |
| Tool action | Show meaningful status and user-facing consequence; inspectable details are optional |
| External send | Preview exact recipients and content; require authorization if not already granted for that exact action |
| Revision | Keep a usable recovery/history path when changes can overwrite work |

Use ordinary typography and layout. Do not add pulsing colored dots, faux execution LEDs, decorative tool pills, or streaming sparkles. A concise "Generating…" label and stop control often suffice.

Show a brief user-facing explanation or progress summary when useful. Do not fabricate or expose hidden chain-of-thought as a design feature. Keep internal tool parameters out of the main flow unless they help the user decide.

## Example: contract summary and email draft

```text
Input: User-selected contract.
Output: Streamed draft summary with references to contract sections.
Actions: Stop, edit, regenerate, copy.
Failure: Keep partial summary and mark it incomplete.
Email: Draft only, with editable recipient/content and explicit Send action.
Unknown send result: Check authoritative delivery state before offering retry.
Announcements: Discrete progress/completion messages, not each token.
```

Native disclosure can reveal source excerpts or execution details. Preserve keyboard semantics and avoid status badges that imply a result before it is known.
