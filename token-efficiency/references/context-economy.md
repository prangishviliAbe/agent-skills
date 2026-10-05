# Context economy for agent work

Read during multi-step tasks in a repository or terminal, long sessions, and any time output or context is large. The goal is to get the evidence you need with the least text entering the conversation, without skipping anything that could change the conclusion.

## Retrieve narrowly, in this order

1. **Locate** with a search, not a file read: file names, then matching lines.
2. **Read a range** around the match, not the whole file.
3. **Summarize** large output before it enters context, and keep the pointer (path and line) to the source.

```bash
rg -l 'createInvoice'                       # which files mention it
rg -n -C2 'createInvoice' src/billing       # matching lines with two lines of context
sed -n '120,180p' src/billing/invoice.ts    # only the range you need
wc -c package-lock.json                     # size check before opening anything big
git diff --stat                             # shape of a change first
git diff -U1 -- src/billing/invoice.ts      # then a tight diff of one file
git log -n 5 --oneline
npm test 2>&1 | tail -n 40                  # the end of a log holds the failure summary
npm test 2>&1 | grep -n -E 'FAIL|Error' | head -n 20
```

Adapt flags to the tool you have. Quiet and summary modes (`--quiet`, `--silent`, `--reporter=dot`, `--stat`) cut output cheaply.

Do not open lockfiles, minified bundles, generated code, binaries, or build output; search them if you must. Do not print `.env` or credential files. Truncated output is incomplete: if the cut part could hold the cause (the middle of a stack trace, the first error in a log), fetch that part before concluding.

## Do the work once

- **Batch independent calls** (several searches, several reads) in one step. Sequence only calls that depend on earlier results.
- **Reuse established facts.** Keep a short running list (cause found, command that works, file locations). Do not re-derive or re-read what you already know.
- **Trust confirmed edits.** After a successful edit or write, do not reread the file to check it; the tool already reported success. Verify behavior by running the relevant check instead.
- **Rerun only what changed.** Repeating a passing check with no relevant change adds cost and no evidence.
- **Run the narrowest check first** (one test file or one test name), then the broader suite once at the end.

## Know when to stop

Stop exploring when you can state the cause and the change. Stop retrying after a small number of distinct failed attempts and report what you tried and what you learned, rather than looping. Stop adding detail when it no longer changes a decision.

## Delegation

When a sub-agent or side task is available and allowed, hand noisy exploration (searching a large codebase, reading long logs) to it and ask for a short report with `path:line` references and a confidence note. Do not delegate work whose result you cannot judge without the same context, and do not delegate trivial lookups.

## Long sessions

- At milestones write a compact state note: goal, decisions made and why, files touched, commands that work, what is verified, what remains. Keep it in a scratch file or the plan, and update it instead of rewriting history.
- Before context is compacted or a session ends, make sure that note is current, so the work resumes without rediscovery.
- Prune plans as steps finish; do not carry completed detail forward.

## Communication cost

Send a one-line update when something changed (a finding, a blocker, a plan change) and at any cadence the user required, and make the final report as short as the result allows ([output-craft.md](output-craft.md)). Silence is not efficiency when updates were requested.

## When to spend more

Read in full when truncation could hide the cause, when the task touches security, money, or data loss, when instructions contradict each other, or when a first attempt failed for an unclear reason. The target is the lowest cost that still supports a correct, evidenced answer.
