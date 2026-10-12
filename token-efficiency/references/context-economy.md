# Bounded investigation and useful context

Read when: Inspecting large logs/files, managing long work, or preparing a handoff.

## Search before reading

```bash partial
rg -n -i 'error|exception|failed' work/ci.log
rg -n 'suspectedSymbol' src
rg --files src
```

Read bounded context around a relevant match, then trace upstream to the first causal failure. A final CI summary can hide the original exception. Avoid printing secrets or entire logs.

| Input | Efficient move | Preserve |
| --- | --- | --- |
| Large log | Search, inspect bounded ranges, follow first cause | Exact location and surrounding evidence |
| Large repository | Find entrypoint/callers, read the relevant path | Constraints and dependency relationships |
| Repeated progress | Report meaningful state changes only | Blocker or next unresolved decision |
| Long task | Maintain a compact state note | Objective, constraints, edits, evidence, next action |
| Broad comparison | Read only sources that can change the choice | Reasons and material uncertainty |

Do not invent universal claims about token pricing or latency. Caching, context reuse, model behavior, and billing vary by runtime.

## Handoff artifact

```text
Objective:
User constraints and authorization:
Current artifact/revision:
Completed changes:
Verified checks:
Inferred/Assumed:
Not run and why:
Next required action:
```

A good handoff prevents redoing work and preserves why a decision was made. Retain abandoned approaches only when they explain a surviving tradeoff.
