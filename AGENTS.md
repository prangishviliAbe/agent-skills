# Repository conventions

This repository contains portable agent skills. A skill must be useful in any runtime that can read Markdown: Codex, Claude Code, Antigravity, editor rules, or a custom harness.

## Layout and portability

```text
<skill-name>/
├── SKILL.md            # required entrypoint and routing
├── agents/openai.yaml  # required Codex UI metadata; other runtimes ignore it
└── references/         # optional conditional depth
```

- Keep each skill folder self-contained. Installation is folder-by-folder, so do not link to another skill or to repository-level files from `SKILL.md` or its references.
- The folder name and frontmatter `name` must match. Use lowercase hyphenated names of at most 64 characters.
- Use only `name` and `description` in `SKILL.md` frontmatter. Write the description after the skill exists; it should identify the real requests and artifacts that should trigger it.
- End every `SKILL.md` with this exact attribution, after its content:

  ```markdown
  Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
  ```

## Write for decisions, not ceremony

- State non-obvious outcomes, constraints, and decision criteria. Do not explain capabilities an agent already has.
- Preserve the user's product, authorization, scope, and existing stack. Do not turn a focused request into a redesign, audit, migration, or deployment.
- Match specificity to risk. Use firm rules for real invariants; leave implementation choices open where several approaches are sound.
- Put conditional or format-specific detail in a routed reference. Keep an entrypoint under 220 body lines because it must be useful before the agent knows which branch applies.
- Use examples only when they clarify a decision or a failure mode. Label examples and starting ranges as examples; do not misrepresent them as universal standards.
- Quantify a requirement only when the number changes a decision, and cite or contextualize version-sensitive thresholds.
- State what evidence supports completion. Let agents mark irrelevant checks as not applicable and unavailable checks as unverified; do not require fabricated testing or boilerplate reports.
- Keep a completed skill readable: direct prose, tables for genuinely repeated decisions, and no ritual headings or duplicate checklists.

## Content standard

- Write instructions as positive, imperative decisions with the reason in a short clause. Put corrections of common mistakes in "belief, reality" or "failure, correct move" tables instead of long hedged paragraphs.
- Every reference opens with a "Read when" line and contains at least one concrete artifact: code, a command, a template, or a decision table. Prefer a worked example to a description.
- Check code before committing it. Run the snippets that can run, and syntax-check the rest. Fence every block with a language; add `partial` after the language (for example `bash partial`) for an illustrative fragment with placeholders. The validator parses JSON and YAML blocks that are not `partial`.
- Write `description` as a folded scalar (`description: >-`): a plain scalar breaks on `: `. Include the real requests that should trigger the skill, including near-miss phrasing, within 1024 characters and without angle brackets.
- Time-sensitive facts (versions, browser support, defaults) say how to verify them against the installed version or current documentation.
- Keep the evidence vocabulary consistent: Verified, Inferred, Assumed, Not run.

## References and metadata

- Link every reference from the entrypoint or another reachable reference. Keep references task-specific and maintained.
- `agents/openai.yaml` needs nonempty `interface.display_name`, `interface.short_description`, and `interface.default_prompt`. The default prompt must invoke the matching `$skill-name`.
- Preserve existing metadata or policy fields unless the change requires them. Do not disable implicit invocation unless the user explicitly asks for an explicit-only skill.

## Validation and evaluation

Run this before committing:

```bash
npm run check
```

It runs structural validation plus unit tests for the validator and both installers. The structural validator checks YAML, metadata, reachable local resources, self-containment, portability hazards, and attribution; it does not prove an agent follows a skill well.

For substantial instruction changes, use the manual scenarios in `tests/evals/` with an independent evaluator. Give the evaluator the skill, its task input, and only the necessary fixture. Keep the rubric until after the response; record what actually ran. Do not call a scenario an executed test merely because it was added to the repository.

## Installation changes

Validate the matching skill folder before changing installation behavior. Both installers stage and content-check every source folder before replacing any matching destination folder, retain prior versions in `.agent-skills-backups`, and restore the destination after an error. Keep that behavior covered by tests on Bash and PowerShell.
