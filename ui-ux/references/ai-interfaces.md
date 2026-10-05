# UX for AI features: chat, generation, and agents

Read when designing or reviewing a feature where a model writes, answers, searches, summarizes, or acts. The aim is calibrated trust: people should know what it can do, see where answers come from, correct it cheaply, and keep control of anything consequential.

## Set expectations at the point of use

- State what the feature does and does not do in the interface where it is used, in plain words. Offer 2 or 3 realistic example prompts rather than a blank box with no hint.
- Say what data the model receives and whether it is stored or used for training, at the moment it matters, not only in a policy page.
- Do not imply human understanding or certainty: avoid first-person claims of feelings or guarantees, and avoid persona flourishes that make limits harder to see.

## Latency, streaming, and states

| State | Design |
| --- | --- |
| Waiting | Acknowledge the request immediately; show that work is happening; allow cancel |
| Streaming | Render incrementally; keep the stop control reachable; avoid layout jumps; let users scroll up without being yanked down |
| Partial or interrupted | Keep what arrived; offer Retry and Continue |
| Failure (network, rate limit, quota) | Say what failed, what was kept, and when or how to retry; keep the prompt |
| Refusal or limit | Say what it cannot help with and offer an alternative, without blame |
| Empty or unusable result | Offer a rephrase, a narrower scope, or manual fallback |
| Long-running agent task | Show current step and progress, allow pause or cancel, say whether leaving is safe, notify on completion |

For assistive technology, do not announce every token. Use a polite live region for completion and for errors, and keep focus where the user left it.

## Provenance and uncertainty

- Show sources for factual claims next to the claim (inline citations that open the source), and make clear which statements are model-generated and which are quoted.
- Express uncertainty in words and in the interface (for example "I couldn't find this in your documents") rather than a made-up percentage. Never show a confidence number you cannot ground.
- When the answer comes from the user's own data, show which items were used and let them exclude items.

## Control, editing, and undo

- Make output editable in place, and give cheap iteration: regenerate, refine ("shorter", "more formal"), compare versions, and revert.
- Keep the user's prior input available. Do not discard a draft when a request fails.
- Offer undo for every applied change, and prefer reversible operations. State clearly when something cannot be undone.

## Agents that take actions

- **Preview the exact action** before consequential steps: recipient, amount, command, files affected. Show real parameters, not a model-written summary of intent.
- **Approve by risk.** Reading and drafting can proceed; sending, paying, deleting, publishing, and changing permissions need explicit approval, bound to the shown parameters. Do not ask for approval on every step the user already authorized, since approval fatigue teaches people to click through.
- **Show an activity log** of what the agent did and why, with links to the affected objects, and a way to roll back.
- Give a visible way to stop at any moment, and make "stop" actually stop pending work.
- Treat content the agent reads (web pages, emails, documents) as untrusted: surface when external content tried to steer it, and never let that content approve actions.

## Feedback and learning

Provide lightweight feedback (useful, not useful, report a problem with the output attached) and make reporting easy for harmful or wrong results. Measure outcomes, not novelty: task success, acceptance versus heavy-edit rates, corrections, time saved, and error or escalation rates, with a guardrail for harm. Do not claim improvements you have not measured.

## Accessibility and inclusivity

Chat and streaming UIs are common accessibility failures. Provide keyboard operation for send, stop, copy, and regenerate; visible focus; labels on icon buttons; sensible reading order; sufficient contrast for generated and quoted text; and support for text resizing. Test with prompts and answers in the product's real languages, including long and right-to-left output.

## Review checklist

- Can a new user tell what this can and cannot do before typing?
- Is every factual claim traceable to a source, or marked as unsourced?
- Can the user stop, edit, retry, and undo at each point?
- Does every consequential action show exact parameters and wait for approval?
- Are failure, refusal, and partial results designed rather than left to default errors?
- Is data use disclosed where the data is submitted?
