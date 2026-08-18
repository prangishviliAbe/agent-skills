# Flows, navigation, forms, dashboards

Read when designing or reviewing a multi-step experience, a navigation structure, a form, or a data-dense screen.

## Map a flow before drawing a screen

Write it as a list, not a diagram, and it will be honest:

```
Trigger        what makes the user start
Precondition   what must already be true (account, permission, data, payment method)
Steps          1..n, each with: the decision made, the information needed to make it
Branches       what happens for each alternate answer
Failures       per step: what can fail, what the user sees, how they recover
Exit           success state, and what the user does next
Return         what happens if they leave halfway and come back
```

The "Return" line is the one most often missing, and it is where users are actually lost.

## Reduce the flow before improving it

In order:

1. **Remove** steps that serve internal process rather than the user.
2. **Defer** anything not needed to complete the primary task. Ask for it when it matters.
3. **Default** intelligently — most users take the same path; make it the pre-selected one.
4. **Derive** what you can infer instead of asking (locale, currency, timezone, plan).
5. **Only then** design the remaining steps well.

A three-field form is better design than a beautiful eight-field one.

## Navigation

- Structure by user intent, not by department. Users look for "Billing", not "Finance Operations".
- Depth over breadth fails for discovery; breadth over depth fails for scanning. Keep the primary level to a scannable set and put the long tail behind search.
- The current location is always indicated. Every page shows where it sits.
- Provide an escape from every dead end: an empty search, a 404, an expired link, a permission wall.
- Label with the user's words, checked against what they actually search for. Never use an internal codename in the interface.
- Mobile navigation is a decision, not a hamburger by default: the two or three most-used destinations deserve to be visible.

## Onboarding

- Deliver value before demanding setup. Let people see the product working with sample or partial data.
- Never front-load a tour. Teach one thing at the moment it is needed.
- Progress must be visible, resumable, and skippable, with a way back to the skipped parts.
- The first-run empty state is the most important screen in the product: it teaches what this thing is for and creates the first object.

## Forms

- One column. Multi-column forms break the reading order and the tab order.
- Group into short, labeled sections. Long forms get a step indicator with a visible position.
- Labels above fields, persistent. Placeholders only for format examples.
- Ask in the order the user thinks, not the order the database stores.
- Field width signals expected length: a postcode field should not be as wide as an address field.
- Mark optional fields rather than required ones when most are required, and the reverse when most are optional. Be consistent within a form.
- Explain why you need anything sensitive, at the field.
- Save drafts for anything long. Losing a half-finished form is the most avoidable failure in software.
- Submit is a single, clearly labeled action naming the outcome: "Create account", not "Submit".

## Search and filtering

- Show the result count and the active filters as removable chips.
- Preserve the query and filters in the URL so results can be shared, bookmarked, and returned to via the back button.
- "No results" is a distinct state from "nothing exists": offer to clear filters, relax the query, or suggest near matches.
- Sensible defaults beat a wall of empty filter controls. Sort by what most users need first.

## Tables and lists

- Decide what the row *is* and what the primary action on it is before styling anything.
- Column priority: the identifying column first and always visible, then the columns people actually scan. Everything else is secondary and hideable.
- Right-align numbers, use tabular figures, and keep the unit visible.
- Bulk actions need clear selection state, a count, and an undo.
- Long lists need sticky headers, stable pagination or a stable virtual position, and a visible total.
- For compact widths, transform the table rather than shrinking it: a card per row with the identifying field as the title and two or three key fields beneath it.

## Dashboards

Design from the decisions, not the data:

1. What decisions does this person make with this screen?
2. What number or comparison drives each decision?
3. What is the action they take once they decide?

Then: one primary metric with context (versus what — a target, a previous period, a peer), supporting metrics beneath, and the action reachable from the insight. A grid of twelve equal-weight numbers is not a dashboard; it is a data dump that forces the user to do the analysis themselves.

Every metric states its time range and its refresh time. A number without a period is not information.
