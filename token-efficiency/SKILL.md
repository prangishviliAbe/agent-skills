---
name: token-efficiency
description: >-
  Make responses and agent work cheaper to read and to run without losing correctness: concise
  answers, TL;DR, brief status and final summaries, just-the-code replies, and lean tool use that
  avoids rereading files, dumping logs, and repeating checks. Use whenever the user asks to be
  brief, short, concise, "less text", "just the code", "TLDR", or "save tokens", complains about
  limits or cost, or runs a long agent session where context is filling up. Keeps the answer
  first, keeps the evidence, failures, and caveats that change decisions, replies in the user's
  language, and never trades correctness or required updates for brevity.
---

# Token Efficiency

Reduce the effort needed to understand and use the result. Do the task at the requested depth, then remove words and retrieval that do not change a decision, an action, or confidence in the outcome. Brevity is a property of the message, not a reason to do less work.

## Rules

1. **Result first.** The answer, decision, or blocker goes in the first line. Explanation follows only as far as it is needed to trust or use it.
2. **Keep what changes a decision:** the deliverable, the decisive reason, the blocker, a caveat that affects use, and the evidence behind every "done", "fixed", or "passing" claim.
3. **Cut what changes nothing:** restating the question, announcing the plan, narrating each tool call, praise, generic caveats, recaps of what the user just read, and closing offers.
4. **Compress prose, not diligence.** Investigate and verify as the task requires. A failed, skipped, or unavailable check is always reported, even in one line; brevity never justifies hiding it or stopping early.
5. **Never compress what must run.** Code, commands, paths, configuration, and exact error text stay complete. "Just the code" means complete, runnable code and nothing else unless something blocks it.
6. **Match the user's language, format, and requested depth.** Reply in the language they write in (Georgian stays Georgian; code, identifiers, and commands stay as written). Georgian and other non-Latin scripts usually cost more tokens than English for the same meaning, so cut words rather than switching language. A request for thorough reasoning gets thorough reasoning without the repetition.
7. **Spend context like money.** Search before reading, read ranges instead of whole files, summarize big outputs, run independent calls together, reuse established facts, and stop repeating unchanged checks ([context-economy.md](references/context-economy.md)). Never treat truncated output as complete.
8. **Keep required communication.** If progress updates, permission requests, or citations are required, give them, briefly, when something changed: a finding, a blocker, or a new plan.

## Response shapes

Defaults, not sentence limits. Adapt to the information.

| Request | Shape |
| --- | --- |
| Direct question | The answer, then the qualification or example that changes understanding |
| Yes or no | "Yes" or "No", the one reason, and the condition that would flip it |
| Recommendation | The choice, the decisive reason, the main tradeoff |
| Small implementation | What changed (file links), what it does, what was verified |
| Debugging | The supported cause or leading hypothesis, the fix, and the check that distinguishes fixed from recurring |
| Status | Current result, any blocker, next step |
| Comparison | A table when attributes repeat; prose otherwise |
| Explanation or architecture | The concept or recommendation first, then the constraints and reasoning |
| Summary | Conclusion, consequential facts, open decisions; keep disagreement and uncertainty |
| Final report after work | Result, evidence (with failures), remaining limits; see [output-craft.md](references/output-craft.md) |
| Just code | Complete code or patch; explain only a blocking ambiguity or a limit that cannot stay implicit |

Use headings only when a long answer needs navigation. Keep lists and tables where they make parallel facts easier to scan. Link artifacts instead of pasting them, and still state the outcome and material limits in the message.

## Reference map

| When the task involves | Read |
| --- | --- |
| Rewriting a reply: before and after examples, templates for status, final summary, review comments, language handling | [output-craft.md](references/output-craft.md) |
| Agent sessions: targeted retrieval commands, log handling, batching, delegation, long-session notes, stopping rules | [context-economy.md](references/context-economy.md) |

## Failure modes

| Failure | Correct move |
| --- | --- |
| "Done" with no deliverable or evidence | Name the deliverable and the check; disclose failed or unavailable checks |
| A one-line answer to a request for detailed reasoning | Keep the requested reasoning; remove only the redundancy |
| Cryptic fragments, unexplained acronyms, compressed code | Plain sentences and maintainable code |
| Repeating every tool call | Report what changed the conclusion or the next action |
| Silence during long work | Short updates at the required cadence |
| Caveats unrelated to this request | Keep only limits that change this user's decision |
| Rereading whole files and rerunning unchanged checks | Focused context and existing evidence; refresh only what may have changed |
| A word limit that would remove a material fact | Compress further, but keep the limiting fact; never invent certainty to fit |
| Skipping verification "to save tokens" | Run the narrowest check that can fail, then say what it showed |

## Definition of done

- [ ] The deliverable and the material questions are answered, or the exact blocker is stated.
- [ ] The reply follows the user's language, format, and requested depth.
- [ ] Completion claims match evidence; failures and unverified work are visible.
- [ ] Code, commands, and next steps keep the detail needed to use them.
- [ ] Required updates, attribution, and decision-changing caveats are preserved.
- [ ] Repetition, filler, and background that does not matter are gone, and the text is still easy to read.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
