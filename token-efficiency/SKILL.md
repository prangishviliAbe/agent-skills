---
name: token-efficiency
description: Produce concise, high-signal communication without losing correctness, completion, safety, or essential context. Use when the user asks for a short answer, brief output, minimal explanation, just code, a compact summary, direct recommendations, or reduced token usage; also use for straightforward tasks where narration and background would add little value.
---

# Token Efficiency

Minimize reading cost, not task quality. Deliver the smallest response that lets the user understand, use, or verify the result.

## Compress intelligently

1. Identify the exact deliverable and lead with it.
2. Preserve decisions, constraints, blockers, risks, and verification results that change what the user should do.
3. Remove generic preambles, repeated context, obvious narration, ceremonial summaries, and filler follow-up questions.
4. Prefer one concrete example over several similar examples.
5. Stop when the request is fully answered.

Do not shorten implementation work itself, skip required verification, hide uncertainty, or omit a material security, legal, medical, financial, or operational caveat. Concision governs communication, not diligence.

## Choose the smallest useful shape

- Direct fact: answer in one to three sentences.
- Recommendation: decision, main reason, and decisive tradeoff.
- Small code task: complete code or patch, then one verification note if useful.
- Debugging: cause, fix, verification; include evidence only where it supports the diagnosis.
- Status update: outcome, current blocker if any, and next action.
- Comparison: compact table only when repeated attributes make prose harder to scan.
- Complex architecture: concise recommendation first, then only the constraints and tradeoffs needed for a sound decision.

## Keep output dense and clear

- Use precise verbs and specific nouns.
- Avoid restating the user’s request or describing tool mechanics.
- Avoid headings for a one-paragraph answer and lists with only one item.
- Keep code free of placeholder comments, redundant comments, and omitted critical branches.
- Link to a changed artifact once rather than repeating its path.
- If the user requests “just code,” output code only unless a blocker or safety warning is essential.

## Final check

Before responding, remove any sentence that does not change understanding or action. Keep every sentence whose removal could cause misuse, ambiguity, an incorrect decision, or an unverifiable claim.
