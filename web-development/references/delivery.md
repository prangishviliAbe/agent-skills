# Delivery: planning, review, and reporting

Read when scoping work, deciding how much verification is enough, reviewing a diff, or writing the final report.

## Frame the work in four lines

Before any code exists, be able to fill these in:

```
Behavior:   <who> can <do what>, and <what observably changes>
Done when:  <acceptance criteria, testable>
Not doing:  <explicit non-goals that a reader might assume>
Risk tier:  R0 | R1 | R2 | R3  ->  verification: <the checks you will run>
```

If "Behavior" needs more than two sentences, the task is two tasks. Split it and say so.

## Decide alone or ask

Decide and proceed when the answer is recoverable, conventional, or inferable from the codebase: naming, file placement, which existing util to reuse, how to shape an internal type, which of two equivalent libraries already in the manifest to use.

Ask before proceeding only when a wrong guess is expensive and unrecoverable:

- Data loss, irreversible migration, or destructive bulk operation
- A public API or URL contract that other consumers depend on
- Money, permissions, personal data, or legal/compliance surface
- Two readings of the request produce materially different products

Everywhere else: state the assumption in one line, build under it, and keep going. A blocking question with nothing delivered is the expensive choice.

## Survey checklist

- [ ] `AGENTS.md` / `CLAUDE.md` / `CONTRIBUTING.md` / `README` read
- [ ] Package manifest and lockfile checked for what is actually installed and at which major version
- [ ] Framework config read (`next.config`, `vite.config`, `tsconfig`, `wp-config`, build scripts)
- [ ] The full code path read, not only the file named in the request
- [ ] Existing tests around the path read: they document intended behavior
- [ ] `git status` clean or the user's uncommitted work identified and left alone
- [ ] Existing conventions identified: error style, validation library, data-access layer, naming

## Change surface budget

Every change has three surfaces. Keep them separate and name each in the report.

| Surface | Contents | Rule |
| --- | --- | --- |
| Required | Code that must change for the behavior | Do it |
| Enabling | Small refactors without which the required change would be ugly or unsafe | Do it, keep it minimal, call it out |
| Adjacent | Unrelated improvements you noticed | Do not do it. List it |

If enabling changes exceed the required change in size, stop and re-plan. That imbalance usually means the abstraction is wrong or the task is mis-scoped.

## Diff review, as a hostile reviewer

Run this pass over your own diff before reporting. Read the diff, not your memory of what you wrote.

**Correctness**
- Every `async` call awaited or deliberately fire-and-forget with a comment saying why
- Error branches return or throw; nothing falls through to a success response
- Off-by-one, empty array, `null` vs `undefined`, `0` and `""` treated as falsy where they are valid values
- Date, timezone, currency, and locale handling explicit rather than accidental
- Concurrency: two simultaneous requests cannot corrupt state or double-charge

**Security**
- Input validated server-side, at the boundary, before use
- Authorization checked on the object, not just the route
- Queries parameterized, output encoded for its context
- No secrets, tokens, internal hostnames, or stack traces in responses or logs

**Performance**
- No query inside a loop; no fetch inside a render path that could be hoisted
- Bounded result sets: every list endpoint paginates or has a hard limit
- Indexes exist for the columns actually filtered and sorted on
- No unnecessary client bundle growth; no blocking resource added to the critical path

**Maintenance**
- No dead code, commented-out blocks, stray `console.log`, or leftover debug flags
- Names describe intent, not type or implementation
- Comments explain *why*, never restate *what*
- Public behavior changes are reflected in types, tests, and docs

## Reporting template

Lead with the outcome. Keep it scannable.

```
<One sentence: what now works, or what decision was made.>

Changes
- path/to/file.ts:120 — what changed and why
- path/to/other.php — what changed and why

Verification
- `pnpm typecheck` — pass
- `pnpm test src/foo.test.ts` — 12 passed
- Manual: created an order as a non-owner, got 403 as expected

Tradeoffs
- <only the non-obvious ones>

Residual risk / next steps
- <unverified areas, deploy order, follow-ups>
```

Rules for the report:

- Quote real command output. Never paraphrase a result you did not see.
- If a check could not run, write "not run: <reason>" instead of omitting it.
- Do not list every file you read, every idea you rejected, or a narration of the process.
- One line per tradeoff. If a tradeoff needs a paragraph, it needed a decision from the user earlier.

## Definition of done, expanded

A change is done when a competent stranger could:

1. Read the report and know what changed and why.
2. Re-run your verification and get your result.
3. Revert the change cleanly if it misbehaves in production.
4. Extend the code without reverse-engineering an undocumented assumption.
