# Product UI: dashboards, tables, forms, app screens

Read when: The design is a tool people work in, not a page that persuades.

Product UI has its own slop. It is not gradients and blobs; it is the template dashboard: a greeting, four KPI cards with green percentages, a gradient area chart, a donut, a "recent activity" list, and a sidebar ending in an upgrade card. It is produced the same way as marketing slop, by filling a familiar frame instead of asking what the user is here to do.

In tools, the direction is restraint. Controls stay conventional so people can work without learning anything. Character comes from typography, color roles, density, wording, and how well the data is presented.

## Start from the work

```text
Who opens this screen, and how often?
What question are they answering, or what are they trying to finish?
What do they look at first to decide what to do next?
What do they do most? That is the action that must be closest to hand.
What is the exception they must not miss?
```

The answers determine the screen. A dispatcher who opens the page forty times a day needs today's exceptions at the top, not a welcome banner and a chart of last year.

## Dashboard slop and its replacements

| Template element | Problem | Replace with |
| --- | --- | --- |
| "Welcome back, name" hero | Occupies the most valuable area with nothing | What changed since the last visit, or the work queue |
| Four equal KPI cards with icons and "+12%" | Equal weight for unequal measures; change shown without period or baseline | One or two measures that drive decisions, each with period, comparison, and what counts as good |
| Gradient-filled area chart | Fill adds ink without information | A line or bars with labeled axes, units, and period; annotation on the notable point |
| Donut or pie for more than three parts | Hard to compare angles | Sorted horizontal bars with values |
| Chart for a single number | Decoration | The number, in a sentence |
| "Recent activity" feed nobody reads | Filler | Items needing action, sorted by urgency |
| Every widget in a card with a shadow | Grid of boxes, no hierarchy | Sections separated by space and headings; boxes only where content must be separated |
| Rainbow status badges | Color noise | Neutral by default; color only for states that need attention, with a label |
| Sidebar with fifteen icon-and-label items and an upgrade card | Navigation as inventory | Group by task, shorten, put the frequent items first |
| Invented data in round numbers | Looks fake, hides layout problems | Realistic sample data with uneven values and long cases |

## Density and layout

- Tools are compact. Body text at 13 to 15px with tight but legible line height is normal in data-heavy UI; verify readability with the real font. Marketing-page spacing in a tool forces scrolling and hides comparison.
- Use a control scale (for example 28, 32, 40px heights) and keep every input, button, and row on it.
- The layout is stable. Regions do not move or resize when data loads or state changes. Reserve space for loading and empty conditions.
- The main content gets the width. Side panels are narrow, and collapsible when the task needs the space.
- One primary action per screen region, placed consistently across screens.

## Tables

Tables are the core of most tools and deserve the most care.

| Aspect | Finished state |
| --- | --- |
| Alignment | Text start-aligned, numbers end-aligned in tabular figures, same precision per column |
| Header | Quieter than the data, sticky when the table scrolls, sort state visible beyond color |
| Rows | One row height from the control scale; horizontal rules or zebra, not both; hover only when rows act |
| Columns | Ordered by importance; widths fit typical content; identifier column first |
| Long values | Truncated with the full value available; identifiers wrap or copy cleanly |
| States | Loading rows that match real row height, a specific empty state, an inline error with retry |
| Actions | Frequent action visible in the row; rare ones in a labeled menu; bulk actions appear on selection |
| Narrow screens | Priority columns stay; the rest scroll inside the table region or move to a detail view |
| Exceptions | Late, failed, or blocked rows are findable by sorting or filtering, and marked with text plus an icon |

## Forms

- One column, in the order the user thinks about the task. Related short fields may share a row (city and postal code).
- Labels above fields, always visible. Required or optional is marked on the minority case.
- Group with headings and space, not boxes within boxes.
- Validate on blur or submit, not on every keystroke; keep what the user typed; put the message at the field.
- The submit button states the outcome ("Create shipment"), stays in a predictable place, and shows progress without changing width.
- Defaults are filled in where a sensible one exists. Every field that can be removed is removed.

## Data display

- Every number has a unit, and every change has a period and a baseline.
- Dates and times follow the user's locale and state the time zone when it matters.
- Status is text first, with an icon or shape as reinforcement and color as the third cue.
- Empty, zero, unknown, and not-applicable are different and look different: "0", "—", "Not available yet".
- Charts: label series directly where possible, start bars at zero, avoid dual axes, and keep a restrained palette in which one series can be emphasized.

## Where character lives in a tool

| Lever | Example |
| --- | --- |
| Typeface and numerals | A text face with clear figures and a tabular set, chosen for the data |
| Color roles | A calm neutral ground and one accent reserved for the primary action and selection |
| Wording | The domain's own terms; precise, short labels |
| Data design | A status timeline, a route display, or a schedule view made for this domain |
| Feedback speed | Instant response to input; brief, purposeful transitions |
| Finish | Exact alignment, complete states, no layout shift |

None of these requires an ornament. A tool that is fast, legible, and exact has more identity than one with a gradient header.

## Checks

| Check | Pass |
| --- | --- |
| First view | Shows what the user came to see or do, not a greeting or decoration |
| Measures | Each has unit, period, and comparison |
| Tables | Alignment, states, and narrow behavior handled |
| Forms | Labels visible, errors specific, values preserved |
| Stability | No movement when data arrives or state changes |
| Density | Comparable items visible together without scrolling |
| Conventions | Navigation and controls behave as users expect |
