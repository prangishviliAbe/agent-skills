---
name: token-efficiency
description: Write concise answers, compact summaries, brief status reports, and code-focused responses when the user asks to be brief, use fewer tokens, give a TLDR, or provide just the code. Compress communication and retrieval overhead while preserving requested depth, completed work, necessary evidence, and material uncertainty.
---

# Token Efficiency

Reduce the effort needed to understand and use the result. Complete the task at the requested depth, then remove communication and retrieval that do not change a decision, action, or confidence in the outcome.

## Operating rules

1. **Preserve the task contract.** Respect the user's language, format, scope, and requested detail. A thorough explanation remains thorough; remove repetition, not necessary reasoning or examples.
2. **Compress prose, not diligence.** Do the authorized work and appropriate verification. Brevity is not a reason to skip investigation, stop early, fabricate a result, or hide a failed check.
3. **Keep decision-changing information.** Retain the deliverable, decisive rationale, actionable blocker, relevant uncertainty, and evidence for completion claims. Include caveats only when they apply to this task.
4. **Keep required communication.** Provide required progress updates, clarifications, permissions, and citations. Report new findings, changed plans, or blockers; omit repetitive tool-by-tool narration.
5. **Match certainty to evidence.** Distinguish observations, inferences, and unverified work when that affects use of the result. A shorter answer must not sound more certain.
6. **Keep executable output complete.** Preserve exact commands, paths, prerequisites, configuration, and error handling needed to use the result. Do not replace requested working code with ellipses or illustrative placeholders.

## Procedure

1. Identify the result and evidence the user needs. For a follow-up, answer the new question without repeating the full earlier answer.
2. Retrieve targeted context: search before reading entire files, inspect relevant ranges, load references on demand, and summarize large outputs. Expand when missing context could change the conclusion; never treat truncated output as complete.
3. Perform the work. Batch independent retrieval where available, reuse established facts, and stop repeating successful checks unless a change or unresolved concern justifies them. Preserve required current-source verification.
4. Lead with the answer, result, or blocker. Add the rationale, instructions, evidence, and limitations needed to understand or use it.
5. Remove restated prompts, decorative headings, filler praise, empty offers, and sentences that merely announce the next sentence. Keep enough connective prose to remain readable.

## Response shapes

Adapt the shape to the information; these are defaults, not sentence limits.

| Request | Useful shape |
| --- | --- |
| Direct question | Answer, then the qualification or example that changes understanding |
| Recommendation | Choice, decisive reason, material tradeoff |
| Small implementation | Deliverable or changed-file link, effect, relevant verification |
| Debugging | Supported cause or current hypothesis, fix, check that distinguishes success from recurrence |
| Status | Current result, meaningful blocker or next step |
| Comparison | Table when repeated attributes aid comparison; prose otherwise |
| Architecture or explanation | Recommendation or concept first, then sufficient constraints and reasoning |
| Summary | Conclusion, consequential facts, unresolved decision; preserve disagreement and uncertainty |
| Just code | Complete code or patch; explain only blocking ambiguity or a material limitation that cannot safely remain implicit |

Use headings for long answers when they aid navigation. Keep lists and tables when they make parallel facts easier to scan, regardless of item count. Link artifacts to avoid duplication; still state the outcome and material limitations in the answer.

## Failure modes

| Failure | Correct move |
| --- | --- |
| “Done” without a usable result or evidence | Name the deliverable and relevant check; disclose failed or unavailable checks |
| A one-line answer to a request for detailed reasoning | Preserve requested reasoning and remove redundancy |
| Cryptic fragments, unexplained acronyms, or compressed code | Use plain sentences and maintainable code |
| Repeating every tool call | Report what changed the conclusion or next action |
| Omitting updates during sustained work | Send concise updates at the required cadence |
| Caveats unrelated to the request | Retain only limitations that change this user's decision or use |
| Rereading full files or rerunning unchanged checks | Use focused context and existing evidence; refresh what may have changed |
| A word limit would remove material truth | Compress further, then retain the limiting fact; never invent certainty to fit |

## Definition of done

- [ ] The requested deliverable and material questions are addressed, or the exact blocker is stated.
- [ ] The answer follows the user's language, format, and requested depth.
- [ ] Completion claims match evidence; relevant failures and unverified work are visible.
- [ ] Code, commands, and next steps retain the details needed to use them.
- [ ] Required updates, attribution, and decision-changing qualifications are preserved.
- [ ] Repetition, filler, and unnecessary background are removed without making the answer cryptic.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
