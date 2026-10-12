---
name: token-efficiency
description: >-
  Communicate engineering results concisely and preserve useful context during long tasks.
  Use for brief answers, TL;DR, compact status or review reports, focused diffs, large-log
  investigation, or context-budget management. Remove repetition and filler while preserving
  necessary evidence, uncertainty, user constraints, and complete authorized work.
---

# Token and Context Efficiency

Increase useful information per sentence without reducing correctness, care, or task completion. Concise communication does not mean shallow investigation or prematurely stopping work.

## Decisions

- Lead a final response with the result or answer. For ongoing work, give a short action or meaningful finding; omit praise, prompt paraphrases, filler, and repeated plans.
- Use connected plain prose for one idea, bullets for independent points, and tables only when comparison benefits. A table is not inherently more efficient.
- Link the changed artifact or location instead of reprinting entire files. Show a focused diff when it helps review; supply full code when explicitly requested.
- Search before reading large files or logs. Inspect bounded context around the first relevant cause and follow its dependency; do not stop at a misleading final summary.
- Load only references relevant to the task. Batch independent reads, then make dependent decisions sequentially.
- Preserve constraints, accepted decisions, changed files, evidence, blockers, and the next required action during long work. Drop abandoned paths only when they no longer affect the decision.
- Keep progress updates brief and meaningful. State a new finding, completed change, or next uncertainty; avoid narrating every command.
- Preserve material uncertainty and verification limits. Never compress "source reviewed; browser checks not run" into "tested".
- Match the user's language naturally. In Georgian, use clear Georgian prose and retain technical identifiers exactly; do not infer language from a directory name.
- Complete the authorized scope. Do not offer to continue work that was already requested, hide a blocker to stay brief, or sacrifice visual refinement to save output.

## Routed references

| Need | Read |
| --- | --- |
| Large inputs, bounded searches, useful handoffs | [context-economy.md](references/context-economy.md) |
| Result, progress, review, and Georgian examples | [output-craft.md](references/output-craft.md) |

## Completion

Give the result and the smallest evidence needed to assess it, plus a material remaining limit if one exists. Use **Verified**, **Inferred**, **Assumed**, and **Not run** when needed, rather than ritual labels on every sentence. Do not invent token counts, costs, or latency claims.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
