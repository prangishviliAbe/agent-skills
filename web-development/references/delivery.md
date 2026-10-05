# Delivery: orient, scope, review, hand off

Read when planning nontrivial work, reviewing code, choosing between designs, adding a dependency, or writing the final handoff. A one-file local edit needs two sentences of acceptance and one focused check, not a planning document.

## Orient in five minutes

```bash
git status --short            # uncommitted work you must preserve
git log --oneline -8          # recent direction and commit style
git branch --show-current
```

Then read whatever exists from this table. The files tell you the real commands; do not guess them.

| Signal | What it tells you |
| --- | --- |
| `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock` | The package manager. Use only that one |
| `package.json` `scripts`, `engines`, `packageManager` | Real check, build, and test commands; runtime version |
| `tsconfig.json` (`strict`, `paths`) | Type contract and import aliases |
| `next.config.*`, `vite.config.*`, `astro.config.*` | Framework mode and feature flags (for example `cacheComponents`) |
| `.github/workflows/*`, `Makefile`, `justfile` | What CI enforces; run the same commands locally |
| `.env.example`, `docker-compose.yml` | Required services and variable names. Read names, not values |
| `pyproject.toml`, `uv.lock`, `poetry.lock` | Python toolchain and pinned versions |
| `composer.json`, `phpcs.xml`, plugin header `Requires PHP` | PHP dependencies, coding standard, support floor |
| `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, `CONTRIBUTING.md` | Project rules that override your defaults |

Find the closest existing feature (route, component, query, test) and mirror its naming, folder placement, error handling, validation library, and test style. Matching the house pattern is part of correctness.

## Establish the contract

Identify who can do what, the visible result, and which existing behavior must survive. Recover constraints from the request, tests, callers, schema, and project instructions. Do not read a confusing implementation as intended policy.

| Situation | Action |
| --- | --- |
| Recoverable implementation detail | Follow the existing convention and proceed |
| Ambiguity changes product behavior or a public contract | Present the concrete alternatives, get the missing decision, keep doing independent work |
| Action already authorized in this session | Carry it through within that target and scope |
| Consequential live mutation without authorization | Prepare the diff, target, verification, and recovery procedure before asking |
| Environment cannot run a needed check | Finish what can be done, record the limit, give the exact remaining check |

Preserve uncommitted work: do not reset, stash, reformat, or regenerate unrelated files to get a clean tree. Read generated-file and lockfile diffs as carefully as source.

## Scope the blast radius

For a shared change, list the consumers before editing:

- Callers of the function, route, or component (`rg -n "symbolName"`; also search string keys, route paths, and generated types).
- Schema readers and writers, serialized formats, cache keys, queue payloads, webhook payloads.
- Deployed versions that coexist during rollout (old client with new server and the reverse).
- Error and retry behavior that consumers depend on.
- Whether data needs migration, backfill, or a compatibility period.

Keep necessary enabling refactors in the diff. Mention unrelated improvements only when they change a decision; do not bury the handoff in a backlog.

## Add a dependency only when it pays

1. Does the platform, the framework, or an existing dependency already do this?
2. Is it maintained (recent release, responsive issues), license-compatible, typed, and sized sensibly for where it ships (client bundles cost users)?
3. Does it replace non-trivial code? Do not add a package for a three-line helper.
4. Does it run install scripts or pull a large transitive tree? Inspect before installing.

```bash partial
npm view <package> version license time.modified dist.unpackedSize scripts
npm ls <package>      # is it already in the tree?
```

Use vetted libraries for crypto, auth, parsing, sanitizing, dates, and money; do not hand-roll them. Install with the project's package manager so the lockfile updates consistently.

## Choose evidence for the failure mechanism

| Concern | Useful evidence |
| --- | --- |
| Layout or interaction | Render at relevant widths; keyboard and focus check for changed controls |
| Pure logic | Boundary cases and one meaningful invariant |
| API contract | Request and response including invalid input, plus affected callers |
| Authorization | Allowed actor succeeds; forbidden actor cannot read or change the object |
| Cache | Write then read freshness, key isolation across users, invalidation |
| External write | Duplicate delivery, timeout ambiguity, reconciliation, supported idempotency |
| Migration | Old and new code against old and new schema, resumability, lock and runtime estimate, recovery |
| Performance | Same workload and tool before and after; label lab versus field data |

A check that cannot observe the changed behavior is not evidence for it. Synthetic fixtures are valid when they exercise the real contract.

**Prove a regression test is real.** Run the new test against the old behavior in a throwaway worktree, without touching the user's working tree:

```bash
git worktree add ../_old HEAD
cp path/to/new.test.ts ../_old/path/to/new.test.ts
(cd ../_old && npm ci && npm test -- path/to/new.test.ts)    # expect it to fail
git worktree remove --force ../_old
```

Small copy and style changes do not need a test that only restates the new wording or CSS value.

## Review checklist

Use it on your own diff before handing off, and on someone else's code when asked to review. Start with the riskiest files: auth, data access, migrations, payments, then everything else.

| Area | Look for |
| --- | --- |
| Correctness | Error branches falling through to success; unawaited promises; valid falsy values (`0`, `""`, `false`) treated as missing; off-by-one in pagination; date-only values and time zones; currency rounding |
| Security | Missing authorization on the specific resource; client-supplied identity or price; string-built SQL; unescaped output sinks; secrets in code, logs, or the client bundle; open redirects; SSRF on user-supplied URLs |
| Data | Unbounded queries; N+1 loops; missing unique constraint behind a "check then insert"; migration that locks a hot table; destructive step with no backup path |
| Concurrency | Read-modify-write without a transaction or conditional update; double submit; webhook replay; queue consumer not replay-safe |
| Compatibility | Public response shape, enum values, error codes, cache keys, or serialized formats changed without a transition plan |
| Operations | New required env var undocumented; log lines with personal data; no timeout on an outbound call; retry multiplication across layers |
| Tests | Do they fail without the fix? Do they assert behavior rather than implementation? Is the negative case covered? |
| UX | Loading, empty, error, and permission states; focus after submit or dialog close; keyboard operation; reduced motion |

Report findings ranked, each with a location, the consequence, and a concrete fix:

```text
[Blocking] src/data/invoices.ts:42 — query filters by id only.
Why: any signed-in user can read another tenant's invoice by changing the id in the URL.
Fix: add `and tenant_id = $2` using session.tenantId, and return 404 on no match.
[Should fix] src/app/api/export/route.ts:18 — export loads all rows into memory.
Fix: stream in batches of 1,000 ordered by id.
[Nit] src/lib/format.ts:7 — duplicates `formatMoney` in src/lib/money.ts.
```

Labels: **Blocking** (wrong, unsafe, or loses data), **Should fix** (fragile or untested), **Nit** (taste), **Question** (you could not tell intent). A review does not edit files unless asked. Say what you checked and what you did not.

## Decision record

For "which approach" questions, answer with a decision, not a survey.

```markdown
**Decision:** <short title>
**Context:** <only the constraints that decide it: scale, team, deadline, existing stack>
**Options:** A) …  B) …  C) …
**Compared on:** correctness risk, complexity, cost, reversibility, fit with the existing stack
**Recommendation:** <one option> because <the decisive reason>
**Accepted tradeoffs:** …
**What would change this:** <a measurable trigger>
**Smallest reversible first step:** …
```

## Handoff

Lead with the result, then the evidence. One paragraph is enough for a small edit.

```markdown
**Result:** Invoice export now streams; a 200k-row export no longer exhausts memory.
**Changed:** `src/app/api/export/route.ts` (batched cursor), `src/data/invoices.ts` (keyset query).
**Verified:** `npm test -- export` passed (new test fails on the old code); manual export of the 50k-row fixture completed in 4 s, peak memory flat.
**Not run:** production-size data; the S3 upload path (no credentials here).
**Risks:** none known; revert is a single commit.
```

Use exact labels: `passed`, `failed`, `not run`, `inferred from code`, `verified locally`, `deployed and checked`. Summarize long output instead of pasting it, and give enough command and environment detail for a teammate to repeat the important checks. Never imply that a local build proves a live release.

## Git and pull-request hygiene

- Commit or push only when asked or already authorized. Follow the repository's commit style (read `git log`).
- One logical change per commit; the message says why. Put large generated diffs in their own commit.
- Review `git diff --staged` before committing. Never commit `.env` files, keys, dumps, or build output.
- Never bypass hooks (`--no-verify`) or signing, and never force-push a shared branch. If a hook fails, fix its cause.
- A pull request description states what and why, how it was verified, the risk and rollback, and screenshots for UI changes.
