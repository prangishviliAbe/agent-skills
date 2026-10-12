# Independent visual-skill evaluation record

Recorded after the completed evaluation. No scenarios were rerun, no grades were assigned, and no repository files were edited. No screenshot, running application, implementation, or API fixture was supplied. Tests/evals, reviewer rubrics, other agents' work, and external services were not inspected.

## Task inputs

### Request 1

Use anti-ai-slop-design. Our Georgian/English cargo company's approved purple logo, purple gradient, centered hero, and equal program cards are fixed. The cards each have three colored decorative dots and a top accent stripe. There is also a shipment table with row separators and a colored dot beside the text 'Delayed'. The page includes '10,000 happy shippers' and a testimonial for which we have no sources. Recommend a focused visual refinement that preserves the approved identity. You only have this description, no screenshot or running application.

### Request 2

Use ui-ux. Give a focused developer handoff for a mobile transfer form with amount, recipient, and optional note. Saving can fail, the network can leave the transfer outcome unknown, and users often return after account verification. The existing design system has a single sans-serif font and flat light surfaces. Styling should feel finished and precise. Do not redesign the whole banking app.

## Exact evaluator responses

**Request 1 — focused cargo-page refinement**

Keep the approved purple logo, purple gradient, centered hero, and equal program cards. Refine the hierarchy within that structure.

| Element | Refinement |
| --- | --- |
| Three decorative dots on each card | Remove them, including any associated pseudo-elements or hover effects. |
| Card top accent stripe | Remove it. Use consistent insets, title alignment, and spacing to finish the cards. |
| Shipment-table row separators | Keep them quiet and consistent; they support scanning. |
| Dot beside “Delayed” | Keep the labeled status marker. The text already provides meaning beyond color. |
| “10,000 happy shippers” and unsourced testimonial | Remove both until substantiated. Do not replace them with invented proof. |

Keep the cards equally prominent, but make their contents easier to compare: align titles and action placement, use the same padding, and give descriptions a consistent typographic role. Allow longer Georgian copy to wrap naturally.

Within the centered hero, tune headline width and spacing around the primary action. Make the headline describe the company’s actual cargo service using verified information. Preserve the gradient and check that the chosen text colors remain readable over it.

Use the existing font if it covers both scripts well. Inspect actual Georgian and English copy before changing leading, tracking, or weights; avoid blanket uppercase, forced line breaks, and fixed text heights. In the shipment table, align identifiers and numeric values consistently and keep exception statuses easy to find.

**Evidence:** Verified: I read the supplied description, `anti-ai-slop-design/SKILL.md`, and its slop-catalog, craft, and multilingual references. The recommendations are inferred from that description. **Not run:** screenshot inspection, rendered responsive layouts, font coverage, contrast measurements, keyboard navigation, or screen-reader testing. No implementation was supplied.

**Request 2 — mobile transfer-form handoff**

Use one calm, vertically stacked form on the existing flat light surface. Preserve the design system’s sans-serif font, palette, radii, and control patterns.

These are starting dimensions to map to the nearest existing tokens:

| Part | Specification |
| --- | --- |
| Screen | 16px side insets; consistent left alignment; 24px between major groups. |
| Heading | “Transfer money”; approximately 24px with a real semibold weight. |
| Labels and fields | Persistent labels above controls; 8px label-to-control gap; 16px input text; controls at least 48px tall. |
| Amount | Clear currency context beside the value; decimal keypad where supported; use the currency’s supported precision. |
| Recipient | Name plus enough account information to distinguish the destination. Allow long names to wrap. |
| Note | Label “Note (optional)”; no invented character limit. Show a limit only if the product enforces it. |
| Primary action | Full width, approximately 52px tall, with stable dimensions across loading and error states. |

Use quiet field boundaries and a visible focus ring. Differentiate labels, entered values, hints, and errors through weight, spacing, and contrast. Keep fields and button edges aligned. No decorative dots, accent stripes, glow, or added shadow layers are needed.

Reuse the app’s existing confirmation step. If none exists, provide a compact review of the amount, currency, recipient, and any actual fees before the explicitly labeled **“Send transfer”** action. Reviewing or restoring a draft must never submit money.

| State | Content and behavior |
| --- | --- |
| Invalid input | Give a specific error beside the relevant field, retain its value, and focus the first invalid field after submission. Validate against actual currency and account rules. |
| Draft saving | Show “Saving draft…” separately from transfer submission. |
| Draft save failed | “We couldn’t save your draft. Your entries are still here.” Keep the form populated and offer “Try saving again.” Do not show “Saved.” |
| Verification required | Explain the prerequisite beside “Verify account.” Preserve the draft through the existing supported persistence mechanism before leaving the form. Handle persistence failure visibly. |
| Submitting | “Submitting transfer…” Prevent another submission while retaining the reviewed details. Keep the button width and height stable. |
| Confirmed failure | Explain the authoritative failure and retain safe inputs. Offer retry only when the previous attempt is confirmed unsuccessful and retry is supported. |
| Unknown outcome | “We haven’t confirmed this transfer yet.” Offer “Check transfer status.” Keep the attempted details visible and reconcile the original attempt before allowing another submission. |
| Confirmed success | Display the actual final amount, recipient, status, and reference returned by the service. |

The status action requires an authoritative lookup for the original attempt. Confirm that API contract with engineering; the UI cannot establish whether money moved from a timeout alone. Do not promise duplicate prevention unless the backend supports it.

On return from account verification, refresh verification status and restore the same user’s draft. Recheck any account eligibility, balance, or limits that affect submission. Let the user review changes before sending. If a transfer was already attempted, reconcile that attempt first. Successful verification is not successful transfer submission.

Keep the form scrollable with the on-screen keyboard open. Place the primary action in normal document flow unless the existing sticky pattern demonstrably leaves focused fields, errors, and recovery controls reachable. Associate labels, hints, and errors programmatically; use a restrained status announcement for saving and transfer results. Error and outcome meaning must be expressed in text.

Acceptance checks should cover narrow screens, long recipient names, large text, the keyboard open, draft-save failure, verification return, pending submission, confirmed failure, unknown outcome, and success. Confirm that returning or refreshing never automatically resubmits a transfer.

**Evidence:** Verified: I read `ui-ux/SKILL.md` and its states, aesthetic-craft, accessibility, responsive, and content-design references. This is a specification based on the supplied constraints. **Not run:** rendered visual QA, API inspection, persistence or reconciliation tests, contrast measurements, keyboard testing, or assistive-technology testing.

## Files actually read

All paths below are absolute. The applicable repository conventions were also read.

- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\AGENTS.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\anti-ai-slop-design\SKILL.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\anti-ai-slop-design\references\slop-catalog.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\anti-ai-slop-design\references\craft.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\anti-ai-slop-design\references\multilingual.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\ui-ux\SKILL.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\ui-ux\references\states.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\ui-ux\references\aesthetic-craft.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\ui-ux\references\accessibility.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\ui-ux\references\responsive.md`
- `C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills\ui-ux\references\content-design.md`

## Commands actually run

The working directory for every shell command was:

```text
C:\Users\Abe_P\Documents\Codex\2026-10-12\https-github-com-prangishviliabe-agent-skills\work\agent-skills
```

Initial inventory and conventions read, issued as one shell command:

```powershell
Get-Content -LiteralPath 'AGENTS.md'; rg --files -g 'SKILL.md' -g 'AGENTS.md' -g '!tests/**' -g '!evals/**' -g '!tests/evals/**'
```

Entrypoint reads, issued as separate independent shell commands:

```powershell
Get-Content -LiteralPath 'anti-ai-slop-design/SKILL.md'
Get-Content -LiteralPath 'ui-ux/SKILL.md'
```

Routed-reference reads, issued as separate independent shell commands:

```powershell
Get-Content -LiteralPath 'anti-ai-slop-design/references/slop-catalog.md'
Get-Content -LiteralPath 'anti-ai-slop-design/references/craft.md'
Get-Content -LiteralPath 'anti-ai-slop-design/references/multilingual.md'
Get-Content -LiteralPath 'ui-ux/references/states.md'
Get-Content -LiteralPath 'ui-ux/references/aesthetic-craft.md'
Get-Content -LiteralPath 'ui-ux/references/accessibility.md'
Get-Content -LiteralPath 'ui-ux/references/responsive.md'
Get-Content -LiteralPath 'ui-ux/references/content-design.md'
```

This record was created with the `apply_patch` tool after the evaluation. No test, render, browser, API, or external-service commands were run.

The following shell command was run solely to confirm the record exists:

```powershell
Get-Item -LiteralPath '..\evaluations\visual-evaluator.md' | Select-Object FullName, Length
```
