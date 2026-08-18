# Repository conventions

This repo holds portable agent skills. Read this before adding or editing one.

A skill must work in any runtime that can read a file: Codex, Claude Code, Antigravity, an editor's rules file, or a custom harness. Nothing in `SKILL.md` or `references/` may depend on a runtime-specific feature, tool name, or directory layout. Runtime-specific metadata lives only in `agents/openai.yaml`, which other runtimes ignore.

## Layout

```
<skill-name>/
├── SKILL.md            # required — the procedure
├── agents/openai.yaml  # required — Codex UI metadata
└── references/         # optional — depth, loaded on demand
```

The folder name, the `name` in the frontmatter, and the `$invocation` in `agents/openai.yaml` must all match exactly.

## Hard rules

1. **Self-contained folders.** No links between skills. Installation copies one folder at a time, so a cross-folder link becomes a dead link on the user's machine. Shared knowledge is duplicated deliberately, not linked.
2. **`SKILL.md` routes; `references/` explains.** Keep the body under 220 lines. When it grows past that, the overflow is depth and belongs in a reference file with a row in the reference map table.
3. **Every reference file is linked** from `SKILL.md` or from another reference. An unlinked file is invisible to the model and will rot.
4. **Frontmatter carries only `name` and `description`.** The description is the trigger: it must name the artifacts, verbs, and technologies that should activate the skill, in the words a user would actually type.
5. **Every `SKILL.md` ends with the author credit line.** Skills are installed and copied folder by folder, so a credit that lives only in the README does not travel with them. The validator enforces this.

```markdown
---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
```

## Writing style

Skills are read by a model that will act on them. Write accordingly.

- **Imperative, not descriptive.** "Validate the payload server-side" beats "It is important that payloads are validated."
- **Rules must be checkable.** "Be careful with user input" is not a rule. "Reject unknown fields on write endpoints" is.
- **Numbers instead of adjectives.** `4.5:1`, `44×44 CSS px`, `180ms`, `45–75 characters`, `under 2.5s`.
- **Anti-pattern always paired with the replacement.** A prohibition alone leaves the model with nothing to do instead.
- **Tables for decisions.** When the content is "in situation X, do Y", a table beats a paragraph — it is faster to scan and harder to half-apply.
- **No filler.** Cut sentences that restate a heading, introduce the next sentence, or add emphasis without adding information.
- **A binary `definition of done`** at the end of every `SKILL.md`. Checkboxes, each one verifiable.

## Section shape for a SKILL.md

```
frontmatter (name, description)
# Title
mandate paragraph — the role and what "done" means
## Operating rules      — the non-negotiables, numbered
## Procedure            — ordered steps
## Reference map        — table: when the task involves X, read Y
## Failure modes        — table: failure -> correct move
## Definition of done   — checkbox list
```

Skills may add domain sections (risk tiers, timing tables, priority sweeps) between the procedure and the reference map.

## Adding a skill

1. Create the folder with `SKILL.md` and `agents/openai.yaml`.
2. Write the description last, after the content exists — it is a summary of what the skill actually does, not an aspiration.
3. Run `node scripts/validate-skills.mjs`.
4. Add a row to the README table and to the composition table.

## Before every commit

```bash
node scripts/validate-skills.mjs
```

Errors block the commit. Warnings are judgment calls: a long reference file may be fine, an unlinked one is not.
