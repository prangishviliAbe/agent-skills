# Flows, information architecture, and navigation

Read when: Designing or reviewing a multi-step task, a site or app structure, navigation, onboarding, or settings.

## Map the flow before the screens

Write the flow as steps a person takes, with the system's response to each. Include where they come from, the unhappy branches, and how they come back later.

```text
Flow: Send a parcel abroad (returning customer, phone)
Entry:    Home → "Send a parcel"            (also: deep link from SMS reminder)
1. Destination country and weight           → price and delivery time shown at once
2. Recipient                                → saved recipients first; new one inline
3. Pickup or drop-off                       → nearest drop-off preselected from last time
4. Review                                   → total, date, what is prohibited; edit links
5. Pay                                      → saved card default; failure keeps everything
Done:     Tracking code, label download, "what happens next"
Branches: Prohibited item → explain and stop, with alternatives
          Payment unknown outcome → "We are confirming your payment" + status check
          Abandoned at step 3 → draft kept; resume from home
```

Then challenge every step:

| Question | Typical result |
| --- | --- |
| Can the system already know this? | Prefill from account, history, location, or the previous step |
| Can this be decided later or never? | Move optional choices after the main task, or to settings |
| Can two steps become one screen without crowding? | Merge when the inputs are related and few |
| Does one step hide a hard decision? | Give it its own screen with the information needed to decide |
| What does the user fear here? | Show price, commitment, and reversibility before they ask |
| Where can they leave and return? | Save progress automatically and say so |

Count the required inputs and decisions before and after. A redesign that keeps the same count has only changed the paint.

## Principles for steps

- **Show the outcome early.** Price, time, and eligibility appear as soon as they can be computed, not at the end.
- **One decision per moment.** A screen may hold several fields, but only one thing to think about.
- **Progress is honest.** Show steps when there are three or more and the count is fixed. Do not show a progress bar that lies or resets.
- **Back never destroys.** Going back keeps what was entered. Browser back works.
- **The exit is always visible.** Cancel or close is present and says what will happen to the work.
- **Review before commitment.** Anything that costs money, sends something, or deletes something gets a summary with edit links.
- **End with what happens next.** A success screen states the result, the reference, and the next step, not just "Success".

## Information architecture

Structure follows the user's mental model, not the organization chart or the database schema.

1. List the things users look for and do, in their words (from support questions, search logs, or the brief; otherwise mark as Assumed).
2. Group by task or object as users would, and name the groups with their words. If a label needs explaining, it is the wrong label.
3. Keep top-level navigation short: roughly five to seven items; the most used first. Everything else goes one level down, into search, or away.
4. Each item lives in one place. Cross-link instead of duplicating.
5. Test the structure by picking five real tasks and tracing the clicks. If a common task takes more than about three steps or a guess, restructure.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Users rely on search for everything | Labels do not match their words | Rename using their vocabulary |
| "Settings" or "More" is enormous | Structure avoided decisions | Group by task; move frequent items into context |
| Same item in three menus | No clear home | Choose one home and link to it |
| Deep nesting | Categories too fine | Flatten; use filters instead of levels |

## Navigation

| Situation | Pattern | Notes |
| --- | --- | --- |
| Up to about five top-level destinations on a phone | Bottom tab bar | Labels always visible; current tab marked by more than color |
| Many sections on desktop | Side navigation | Grouped, collapsible, current item marked; do not hide behind a hamburger on wide screens |
| Few sections, content-led site | Top navigation | Keep to one row; overflow goes into a labeled "More" |
| Hierarchy deeper than two levels | Breadcrumbs plus page title | Breadcrumb reflects structure, not history |
| Many known commands for expert users | Command palette | An addition to visible navigation, never a replacement |
| Switching views of the same data | Tabs or a segmented control | Tabs do not navigate away or submit |

Every screen answers three questions without effort: where am I, what can I do here, and how do I get back. The page title matches the link that led to it.

## Onboarding and first use

- Let people reach value first. Ask for sign-up, permissions, and preferences at the moment each becomes necessary, with the reason stated.
- Do not teach with tours and tooltips what the interface should make obvious. A tour is evidence of a discoverability problem.
- The first-run empty state is the onboarding: it says what this area is for and offers the one action that starts it, ideally with a real example or sample data that can be removed.
- Ask only for what is needed to begin. Every extra question at sign-up loses people.
- Permission prompts (notifications, location, camera) come after an explanation in the product's own UI, triggered by a user action that needs it.

## Settings

- Organize by what the user wants to change, in their words; search if there are many.
- Show the current value in the list so the page answers questions without drilling in.
- Apply simple toggles immediately with clear feedback; use an explicit save only for forms where changes are related, and then warn about unsaved changes on leaving.
- Destructive and irreversible settings sit apart, at the end, with a confirmation that names the consequence.
- Good defaults matter more than many options. Each setting is a decision pushed onto the user.

## Checks

| Check | Pass |
| --- | --- |
| Contract | Each step maps to something the user or the system truly needs |
| Reduction | Inputs and decisions were counted and reduced |
| Branches | Failure, unknown outcome, abandonment, and return are designed |
| Orientation | Location, available actions, and the way back are evident on every screen |
| Labels | Navigation uses the audience's words; no item needs explanation |
| First use | Value is reachable before sign-up friction where the product allows |
