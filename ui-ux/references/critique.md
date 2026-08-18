# Critique: reviewing a design with evidence

Read when asked to review, critique, audit, or improve an existing interface.

## Rules of a useful critique

1. **Review against the brief**, not against your taste. If the design serves the stated goal, "I would have done it differently" is not a finding.
2. **Separate evidence from preference.** Say which one you are giving. Both are legitimate; conflating them is not.
3. **Name the consequence.** "The label is small" is an observation. "The label is 11px at 3.1:1 contrast, so filter state is unreadable in daylight and users re-run searches" is a finding.
4. **Give the smallest strong correction**, not a redesign. A redesign is a different deliverable.
5. **Rank ruthlessly.** Three blockers ahead of twenty polish notes. A flat list of forty items gets ignored entirely.
6. **Say what works and why.** Not politeness — it tells the designer which decisions to preserve while fixing the rest.

## Severity ladder

| Level | Definition | Example |
| --- | --- | --- |
| **Blocker** | Users cannot complete the task, or a group is excluded | Submit unreachable by keyboard; error message never shown; 2.1:1 contrast on body text |
| **High** | Task completion is significantly harmed | Primary action indistinguishable from secondary; destructive action with no confirmation or undo; empty state with no path forward |
| **Medium** | Friction, confusion, or inconsistency that costs time | Inconsistent terminology across steps; validation only on submit; filters lost on back navigation |
| **Polish** | Refinement with no functional cost | Optical alignment, spacing rhythm, icon weight, transition timing |

## Review passes

Run these in order. Stop and report if a pass finds a blocker — the later passes are wasted on a design that will change.

**1. Five-second pass.** Look, then look away. What is this, who is it for, what can I do, what matters most? If the answer is unclear, the hierarchy problem outranks everything else you would say next.

**2. Task pass.** Attempt the primary task as the user, at realistic speed. Note every place you hesitate, guess, backtrack, or reread. Hesitation is data.

**3. State pass.** Against the state matrix: what happens when it is empty, loading, failing, forbidden, or full of long content? Missing states are the most common finding in an otherwise polished design.

**4. Accessibility pass.** Keyboard traversal, focus visibility, contrast on real backgrounds, target size, and whether meaning survives without color.

**5. Responsive pass.** 320 and 390 wide, plus 200% zoom. Then the widest viewport.

**6. System pass.** Are type, spacing, color, radius, borders, icons, and motion drawn from one vocabulary, or accumulated per screen?

**7. Content pass.** Does the copy use the user's words? Do buttons name their outcome? Are errors actionable? Is anything unlabeled, ambiguous, or written for an internal audience?

## Finding format

```
[Blocker] Filter chips are not keyboard-reachable
Where:    Search results, filter bar
Observed: Chips are div elements with click handlers; Tab skips them entirely
Impact:   Keyboard and screen-reader users cannot remove a filter and are stuck
          with an empty result set
Fix:      Render each chip as a button with an accessible name
          ("Remove filter: Status = Open") and a visible focus ring
Effort:   Small
```

## What not to do in a review

| Anti-pattern | Instead |
| --- | --- |
| A list of forty items, unranked | Three blockers, then the rest grouped |
| "Feels dated" / "not modern" | Name the specific mechanism: hierarchy, contrast, density, or rhythm |
| Redesigning it your way | Correct what fails against the brief |
| Only listing problems | Name what works so it survives the revision |
| Copying a competitor as the fix | Explain the principle that competitor got right |
| Aesthetic notes ahead of a broken flow | Order by user impact, always |
| Reviewing a static image and asserting behavior | Ask about, or clearly flag, the states you could not see |

## Closing a review

End with the shortest possible action list, sequenced:

```
Fix first:  <blockers, with the smallest correction each>
Then:       <high-impact items>
Later:      <polish, batched>
Preserve:   <the decisions that are working and should survive the revision>
Unknown:    <what you could not evaluate from what you were given>
```
