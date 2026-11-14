---
name: token-efficiency
description: >-
  Make responses and agent work cheaper to read and to run without losing correctness:
  concise answers, TL;DR, brief status updates and final summaries, just-the-code replies,
  and lean tool use that avoids rereading files, dumping logs, and repeating checks. Use
  whenever the user asks to be brief, short, or concise, says "less text", "just the code",
  "TLDR", or "save tokens", complains about limits or cost, or runs a long session where
  context is filling up. Puts the answer first, keeps the evidence, failures, and caveats
  that change decisions, replies in the user's language, and never trades correctness,
  completeness of the work, or quality of the result for brevity.
---

# Token and Context Efficiency

Efficiency means more useful information per word read and per token spent. It applies to how results are communicated and how work is carried out. It never applies to how well the work is done: the investigation is as thorough, the code as complete, and the design as finished as the task requires.

## Output

| Rule | Detail |
| --- | --- |
| Answer first | The first sentence is the result, the answer, or the decision needed. Background follows only if it changes what the reader does |
| No ceremony | No praise of the question, restating the request, announcing what is about to be said, or closing offers and summaries of what was just said |
| One statement, once | Do not repeat a point in a list and again in a conclusion |
| Shape fits content | Prose for one idea or a line of reasoning; bullets for parallel independent points; a table only for comparison across the same attributes; code blocks for anything to copy |
| Length fits the question | A yes-or-no question gets yes or no plus the reason. A request for depth gets depth |
| Show the change, not the file | Link or name the location and give the focused diff or the key lines. Full files only when asked or when the file is new and short |
| Keep what decides | Never cut: failures, errors, unverified parts, risks, required user actions, and numbers with units |
| Plain words | Full sentences, defined terms, no private abbreviations or arrows standing in for explanations. Compressed shorthand costs the reader more than it saves |
| User's language | Reply in the language the user writes in. Keep code, identifiers, commands, and error text exactly as they are |

"Just the code" means the code and nothing else unless something would break without a note. "TL;DR" means one to three sentences, then stop.

## Work

| Rule | Detail |
| --- | --- |
| Search before reading | Locate with search, then read the relevant range. Do not open large files or logs whole |
| Read once | Do not reread a file that has not changed. Do not re-verify an edit the tool already confirmed |
| Batch independent calls | Run unrelated reads and searches together; keep dependent steps in order |
| Bound output | Filter, count, or take the first and last lines of long command output; ask tools for quiet or summary modes |
| First cause | In a failing log, find the first error and its context; the final summary line is rarely the cause |
| Load only what is needed | Read the reference or document section that applies to the task, not the whole set |
| No redundant checks | Run each check for a reason; do not rerun a passing suite after an unrelated edit |
| Stop when done | No speculative extra features, refactors, or files nobody asked for |
| Keep state compact | In long work, hold on to the objective, constraints, decisions with reasons, changed files, verified facts, and the next step; drop dead ends that no longer matter |

Detail and handoff format: [context-economy.md](references/context-economy.md).

## Progress and final messages

- Progress updates: one line, only when something changed: a finding, a completed step, a blocker. Not a diary of commands.
- Final message: what is now true, what was verified and how, what was not, and anything the user must do. Lead with what the reader most needs.
- If something failed or was skipped, say so in the first lines, not buried at the end.

Examples and patterns in English and Georgian: [output-craft.md](references/output-craft.md).

## What brevity must not remove

| Never shorten away | Why |
| --- | --- |
| A failing test, error, or unverified claim | The reader will assume success |
| The difference between ran, read, and assumed | "Source reviewed; not run in a browser" must not become "tested" |
| A caveat that changes the decision | Hidden risk costs more than a sentence |
| Steps the user must take | Migration, restart, key rotation, deploy |
| Requested scope | Finishing half the task concisely is not efficiency |
| Quality of the artifact | Do not skip states, edge cases, or visual finish to save output |
| Context a cold reader needs | A message read later must stand on its own |

## Common failures

| Failure | Correct move |
| --- | --- |
| Three paragraphs before the answer | Answer in the first sentence |
| Telegraphic shorthand and undefined labels | Short, complete sentences |
| Everything as bullets and headers | Prose for reasoning; structure only where it helps |
| Whole file pasted for a three-line change | Location plus the changed lines |
| "All tests pass" when some were not run | State exactly what ran |
| Rereading the same file each step | Keep notes; read changed ranges only |
| Stopping early and offering to continue | Finish the requested work |
| Brief reply that omits the one blocker | Lead with the blocker |

## Completion

Give the result and the least evidence needed to trust it, plus any material limit. Use **Verified**, **Inferred**, **Assumed**, and **Not run** where the distinction matters, not as labels on every sentence. Do not invent token counts, costs, or latency figures.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
