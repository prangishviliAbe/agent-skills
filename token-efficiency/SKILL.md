---
name: token-efficiency
description: >-
  Communicate with extreme density, high signal-to-noise ratio, and zero fluff during agentic coding
  and engineering workflows. Covers result-first communication, context economy in long multi-turn
  sessions, surgical code diffs over whole-file reprinting, elimination of conversational filler,
  and bilingual precision in English and Georgian. Use when requested for concise answers, TL;DR,
  status summaries, compact code reviews, or when optimizing context budgets during complex tasks.
---

# Token & Reasoning Efficiency

Deliver maximum technical signal per token. Eliminate polite conversational preamble, unrequested tutorials, and repetitive restatements of what the user just said. Lead immediately with the concrete code change, architectural rationale, and verification.

## Core Directives

1. **Lead with the Artifact:** Start with the code change, terminal command, or architectural decision. Never begin with conversational filler ("Certainly! I would be delighted to help you refactor...").
2. **Surgical Diffs Over Full-File Reprints:** When updating an existing file, show only the modified block with 2–3 lines of surrounding context. Never reprint hundreds of unchanged lines unless explicitly instructed.
3. **No Paraphrasing of User Prompts:** The user knows what they asked. Do not open with "You asked me to fix the checkout button...". Jump straight to the solution.
4. **Dense Decision Tables Over Prose:** When comparing multiple approaches or summarizing review findings, use compact markdown tables instead of lengthy multi-paragraph explanations.
5. **Context Economy in Long Sessions:** In multi-turn agent conversations, every generated token persists in context memory and increases latency. Keep progress reports brief and status-oriented.
6. **Bilingual Precision:** When communicating in Georgian (ქართულად), use clear, modern technical terminology without unnatural literal translations or redundant explanatory filler.

## Communication Compression Matrix

```text
[ Fluffy & Wasteful ] ──► Preamble + Restatement + Unrequested Essay + Code + Repetitive Summary
                             │
                             ▼ (Compress)
[ High-Signal Craft ]  ──► Direct Code Block / Command + Concrete Trade-off + Verification
```

## Quick Reference Map

| Topic | What it covers | Reference file |
| --- | --- | --- |
| **Context Economy** | Context budgeting, minimizing multi-turn decay, surgical diff patterns | [context-economy.md](references/context-economy.md) |
| **Output Craft** | Before/After rewrites, high-density status reports, Georgian precision | [output-craft.md](references/output-craft.md) |

## Failure Modes & Countermeasures

| Failure | Correct Move |
| --- | --- |
| Opening with conversational pleasantries ("Hello! I hope you are having a great day!") | Delete entirely. Start immediately with the solution or diff. |
| Printing a 300-line file to show a 2-line change | Present a focused snippet or unified diff targeting the specific function. |
| Explaining standard library features the user already understands | State the specific architectural choice without lecturing on foundational basics. |
| Re-summarizing the entire conversation at the end of every turn | Output only the immediate completion status and verification steps. |

## Definition of Done

- [ ] Zero polite preamble or conversational padding.
- [ ] Solutions lead with code, commands, or decisive answers.
- [ ] Diffs and edits are surgical and context-efficient.
- [ ] Complex comparisons structured as compact tables.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
