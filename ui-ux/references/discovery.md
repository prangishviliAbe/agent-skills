# Discovery: framing, evidence, and success

Read at the start of any product design task, and whenever a request arrives as a solution rather than a problem.

## Translate a solution request into a problem

Users often ask for a component when they have a problem: "add a dropdown to the header", "we need a dashboard", "make an onboarding wizard".

Ask, or infer and state:

- What is the user trying to accomplish that they currently cannot?
- What are they doing today instead, and where does it break?
- How often does this happen, and to how many people?
- What happens if we do nothing?

Then design for the problem. Deliver the requested shape when it genuinely fits, and say briefly when a smaller or different solution fits better — but do not substitute your redesign for the request without saying so.

## The frame

Fill this in before designing. One line each.

```
User        who, and what they already know
Context     where, on what device, under what pressure, how often
Job         what they are trying to get done
Trigger     what makes them start
Success     what has to be true afterwards, from their side
Business    what the organization needs from this
Constraints platform, data, permissions, legal, technical, timeline
Evidence    what we actually know, and from where
Assumptions what we are guessing, and what would change the design if wrong
```

The last two lines are the ones that keep a design honest. Never present an assumption as a finding.

## Evidence versus assumption

| Evidence | Not evidence |
| --- | --- |
| Observed behavior in a session or in analytics | "Users want…" with no source |
| Support tickets and their frequency | A persona invented to justify a decision |
| A/B or funnel data with a stated period | A competitor's design |
| A direct quote from a real interview | A statistic with no citation |

If there is no evidence, say so and choose the low-risk default: the convention the user already knows, the smaller scope, the reversible decision. Then name what would resolve the uncertainty cheaply.

## Success signals

Define how you would know the design worked, before building it:

- **Task success rate** — can people finish?
- **Time or steps to completion** — for repeated tasks
- **Error and recovery rate** — how often do they go wrong, and do they recover?
- **Drop-off point** — where exactly do they leave?
- **Return behavior** — do they come back to it?
- **Support volume** on the related topic

Pick one primary signal. A design optimized for six metrics is optimized for none. Also name the guardrail metric you must not damage — usually error rate, support volume, or a downstream conversion.

## Lightweight research, when it is warranted

Five people surface most usability problems in a flow. That is usually enough to justify doing it.

- **Usability test:** give a real task, watch silently, ask "what are you trying to do?" when they pause. Never explain the interface — the moment you explain it, the test is over.
- **Interview:** ask about what they actually did last time, not what they would do. Past behavior is data; predicted behavior is fiction.
- **Survey:** good for prevalence, bad for causes and for anything that requires memory.
- **Analytics:** good for *where* and *how many*, useless for *why*.

Never write findings you did not collect. If no research exists, design from convention and label the risky assumptions for later validation.

## Synthesis

Turn observations into decisions in three steps:

1. **Observation** — what happened, verbatim, with no interpretation.
2. **Pattern** — the same friction across several people.
3. **Implication** — what the design must do differently.

Rank by frequency times severity. A blocker one person hit is worth more than a mild annoyance five people mentioned. Distinguish "this confused them" from "this stopped them".

## Scope discipline

A design brief expands silently. Guard it by writing the non-goals down:

```
In scope:      the checkout step where payment fails
Out of scope:  the cart, the account system, the email receipts
Later:         saved payment methods (needs a data model decision)
```

When a new idea arrives mid-task, put it in "Later" and keep going. Finish the frame you agreed to.
