# Threat modeling and privileged automation

Read for a sensitive feature, broad audit, business-logic change or AI/tool boundary. Scale the model to the decision: a focused boundary table can be enough for one endpoint; a large service may need a diagram and several linked decisions.

## Model the invariant

Identify the assets, actors, data/control flow and trust boundaries. For each plausible misuse, name the invariant, existing control, remaining gap and way to verify it.

| Boundary | Questions |
| --- | --- |
| Browser or API client → service | Which identity is verified, and which action/resource is permitted? |
| Service → storage/cache | Are tenant and field permissions preserved in queries, keys and outputs? |
| Webhook/job → privileged operation | Who authenticated the event; what if it repeats or arrives out of order? |
| Upload/URL → parser or network | What bytes and destinations are reachable, and what resource limits apply? |
| CI → production artifact | Can untrusted contributors influence code that receives release credentials? |
| Retrieved content → agent/tool | Can document text trigger a capability beyond the user's authorized task? |

Do not assume every boundary requires the same authorization mechanism. Separate authentication, authorization, validation, isolation and integrity controls, then choose the applicable ones.

## Attacker and abuse cases

Use actors with concrete starting access: anonymous visitor, registered user, another tenant, content author, staff member, compromised integration or build dependency. Model insiders only when relevant; encryption at rest does not stop a database user who can issue authorized reads or retrieve the same keys.

For each consequential operation, test the assumption behind:

- Object selection, nested parent/child relationships, ownership and tenant membership.
- Allowed fields, server-authoritative values and output projection.
- Counts, searches, bulk operations, files and caches that bypass the main route.
- Repeats, simultaneous requests, state changes between check and use, and failure after only part of the work commits.
- Resource exhaustion from cheap requests triggering expensive work.

## Business logic

Write the invariant before choosing the mechanism: a coupon has a usage limit, stock cannot fall below its allowed bound, a refund cannot exceed the captured balance, an invitation applies only to its intended scope.

Use server-authoritative prices and transitions. Validate state atomically with writes using appropriate constraints, conditional updates or locks. Trace side effects outside the transaction: retries can duplicate money movement, notifications or grants even when a database row is unique. Define reconciliation for an ambiguous external result.

Check positive cases too. Preventing every refund would stop refund abuse while breaking the product.

## AI agents and LLM tools

Treat pages, documents, repository text and tool results as untrusted content unless a higher-trust instruction explicitly delegates authority to them. Preserve provenance through retrieval and summarization; repeated or confidently worded text gains no authority by appearing in more sources.

A prompt can instruct separation of instructions from data, but cannot guarantee it. Enforce independent tool permissions, narrow credentials and resource/destination restrictions. For material side effects, verify the concrete action against the user's authorized scope at execution time. Require confirmation when authority is missing or a consequential new action exceeds that scope, not for every previously authorized write.

Avoid putting credentials in the model context. Validate model outputs before treating them as commands, queries, URLs or HTML. Bound tool loops, cost, recursion and retries, and stop when the goal changes or repeated attempts add no evidence.

Record redacted action metadata, provenance and outcomes sufficient for audit. Do not log entire private prompts, retrieved documents, credentials or tool payloads by default. Test malicious content within realistic allowed tasks, including instructions embedded in otherwise useful data; assess actual tool effects rather than judging only the final prose.

## Prioritization and output

Prioritize reachable boundary failures with substantial consequence, broad scope or easy repeatability. A fixed list of vulnerability classes is a reminder, not evidence about this system. Distinguish existing controls, proposed controls and accepted residual risk.

Deliver the model as a small table or diagram plus decisions. Each important proposed control needs an owner or implementation location and an observable verification; unresolved policy choices should be visible.

## Primary reference

[OWASP LLM prompt-injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) provides layered mitigation guidance. Treat model-based filtering as one layer, not a security boundary that eliminates the risk.
