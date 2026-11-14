# Patterns chosen by task

Read when: Choosing between a table, list, cards, dialog, drawer, page, tabs, menu, or other component, or designing a table or dashboard.

Pick the pattern from what the user is doing. A pattern chosen because it looks current (bento grid, floating dock, command palette, drawer) is decoration.

## Layout patterns

| User is | Use | Because | Avoid |
| --- | --- | --- | --- |
| Comparing many items on shared attributes | Table | Columns make comparison a glance | Cards, which hide the comparison |
| Scanning a list to pick one | List with one or two lines per row | Fast vertical scan | Large cards that show three per screen |
| Browsing visual or unlike objects | Card grid | Each item needs its own image or structure | Cards for plain text records |
| Working on one item with reference to the list | List and detail, side by side on wide screens | Keeps context | Full navigation away and back |
| Reading or editing one thing in depth | Its own page | Room, a URL, back button works | A dialog stuffed with a page |
| Monitoring status | Dashboard built from the decisions it supports | Shows what needs attention | Generic KPI cards and charts |
| Following a process | Stepper or single long form with sections | Shows position and remaining work | Wizard for three fields |

## Surface for a secondary task

| Need | Use | Contract |
| --- | --- | --- |
| A quick edit to one field | Inline edit | Enter saves, Escape cancels, no layout shift |
| A short, focused task that must finish or cancel | Modal dialog | Title names the task; focus moves in and is contained; Escape and a visible close; focus returns to the trigger |
| A task needing the page as reference | Side panel (drawer) | Non-modal unless it blocks; page stays usable; closes without losing work |
| A few options related to one control | Popover or menu | Opens from the trigger, closes on outside click and Escape, keyboard navigable |
| A destructive confirmation | Dialog, or better, undo | Names the object and consequence; the destructive button says the action |
| A larger sub-task | New page | Has a URL; back returns to the same scroll position and filters |
| Brief, non-critical feedback | Inline message near the cause, or a toast | Toasts are never the only place for errors or for anything the user must act on |

Do not stack modals. Do not open a dialog from a dialog; restructure as steps or a page. Never use a dialog for content that should be linkable.

## Selection and input controls

| Choosing | Use |
| --- | --- |
| One of two to five visible options | Radio group, or a segmented control for view switching |
| One of many | Select; a searchable combobox beyond about fifteen |
| Several of a few | Checkboxes |
| Several of many | Multi-select combobox with visible chosen items |
| On or off, applied immediately | Switch |
| On or off, submitted with a form | Checkbox |
| A number in a small range | Stepper or direct input; a slider only when precision does not matter |
| A date | Text input with format hint plus a picker; plain fields for a birth date |
| A known format (phone, card, code) | Single field that accepts pasted input and formats leniently |

## Tables

| Aspect | Rule |
| --- | --- |
| Columns | Identifier first, then by importance; remove columns nobody uses; let users hide the rest when there are many |
| Alignment | Text start-aligned; numbers end-aligned with tabular figures and equal decimals; headers align with their data |
| Header | Quieter than data; sticky when the table scrolls; sortable columns show direction with an icon and `aria-sort` |
| Density | Row height from the control scale; offer compact and comfortable only if users differ |
| Rules | Horizontal hairlines or zebra, not both; no vertical rules unless the data is a true grid |
| Row action | The whole row may open the item if there is one obvious target; other actions are explicit buttons, with rare ones in a labeled menu |
| Selection | Checkbox column; bulk action bar appears on selection and states the count |
| Long content | Truncate with the full value reachable; never truncate identifiers people need to copy |
| Filters and search | Above the table; active filters visible as removable chips; result count shown; state kept in the URL |
| Pagination | Pages for reference data people return to; "load more" for feeds; state the total |
| States | Skeleton rows of the real height; a specific empty state; "no results" with the active filters and a clear-all; inline error with retry |
| Narrow screens | Keep the key columns and scroll the rest inside the table container, or restructure each row as labeled pairs |

## Dashboards

Build from decisions, not from widgets.

1. List the questions the user answers on arrival and the action each leads to.
2. Put what needs attention first: exceptions, items waiting on the user, changes since last visit.
3. Give each measure its unit, period, and comparison, and say what is good or bad.
4. Choose the plainest display: a number in a sentence, a sorted bar list, a line over time. Use a chart only when shape or trend matters.
5. Make every figure lead somewhere: to the list of items behind it.

Avoid the template: greeting banner, four equal KPI cards with icons and green percentages, gradient area chart, donut, activity feed. It answers no particular question.

| Chart need | Use | Not |
| --- | --- | --- |
| Change over time | Line; bars for discrete periods | Area with gradient fill |
| Compare categories | Horizontal bars, sorted | Pie or donut beyond three parts |
| Part of a whole, two or three parts | Single stacked bar or a sentence | Donut with a number in the hole |
| Distribution | Histogram or dot plot | Average alone |
| One value against a target | Number plus a short bar | Gauge or radial dial |

Label directly on the chart where possible, start bars at zero, avoid dual axes, and provide the data as a table for assistive technology.

## Cards

A card is right when each item is a self-contained object with mixed content (image, title, a couple of facts, an action). Rules: one primary target per card; internal elements align across sibling cards; no hover effect unless the card is clickable; no icon bubble, accent stripe, or badge added for decoration; nested interactive elements are separate, real controls and never wrapped inside one large link.

## Example contract: shipment detail

```text
Trigger:   Select shipment GE-10482 in the results table.
Surface:   Side panel on wide screens; full page on narrow ones. Both have a URL.
Keeps:     Table filters, sort, and scroll position.
Content:   Status with timestamp, route timeline, exception details, next action.
Close:     Escape or close button; focus returns to the originating row.
Failure:   Record identity stays visible; "Could not load details. Retry."
Not used:  Status-colored stripe on the panel; a labeled status with icon instead.
```
