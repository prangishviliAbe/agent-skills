# Choosing the right pattern

Read when deciding which control, container, feedback style, or layout fits a task. Each row gives a default and the reason; override it when the product's existing pattern or the content says otherwise.

## Controls for choices

| Need | Use | Why and boundary |
| --- | --- | --- |
| Pick one of 2 to 5 visible options | Radio group (or segmented control for a view or mode switch) | Options stay visible and comparable |
| Pick one of many | Select; add search (combobox) beyond roughly a dozen items or when users know the name | Saves space; search beats scrolling |
| Pick several | Checkboxes (a multi-select with chips when the list is long) | Independent yes or no choices |
| One setting that takes effect immediately | Toggle switch | A switch implies instant effect; if it needs Save, use a checkbox |
| Agree, or enable something on submit | Checkbox | Deferred, explicit |
| Pick a number | Text input with `inputmode="numeric"` and clear limits; stepper or slider only when the range is small and approximate is fine | Typing is faster than dragging, and sliders are hard to operate precisely |
| Pick a date | Native `date` input or a keyboard-operable picker with typing allowed; use a range picker only for ranges | Typing a known date beats navigating a calendar |
| Search or filter | A search field plus visible active filters with remove buttons and a result count | Shows state and an exit |
| Upload | A button first, drag and drop as an enhancement, plus progress, cancel, and per-file errors | Drag-only excludes keyboard and many touch users |
| Rich text | Only when formatting is essential; otherwise plain text with Markdown or no formatting | Rich editors add accessibility and security cost |

## Containers and layers

| Need | Use | Avoid |
| --- | --- | --- |
| A short, focused decision or confirmation that must interrupt | Modal dialog | Long forms, multi-step flows, or anything users may need to refer back to the page for |
| A secondary task that keeps context (edit a row, filter panel) | Side drawer or sheet | Stacking drawers on drawers |
| Lightweight, anchored, dismissible extra (menu, date picker, definition) | Popover | Putting essential or interactive-heavy content in a tooltip |
| A one-line hint | Inline help text under the field | Tooltip-only instructions |
| A task with its own URL, length, or complexity | A page | Forcing it into a modal to avoid navigation |
| Optional detail in context | Disclosure (accordion, "show more") | Hiding content users need to compare |

## Feedback

| Situation | Use |
| --- | --- |
| Field validation | Inline, next to the field, in text (see [states.md](states.md)) |
| Confirmation of a low-stakes action that completed | Toast or inline status that does not move focus; provide undo where reversible |
| An error the user must act on, or something important | Persistent inline message or banner, never a self-dismissing toast |
| System-wide condition (offline, maintenance, degraded) | Banner at the top of the affected area |
| Irreversible or high-impact decision | Confirmation dialog stating the object and consequence |
| Long-running work | Progress with real values, or a status the user can leave and return to |

Toasts disappear on a timer, so a keyboard or screen-reader user may never reach them: keep results users need in a place they can find again.

## Navigation and structure

| Need | Use |
| --- | --- |
| Peer sections of one object (profile: details, billing, security) | Tabs; each panel is a view of the same thing |
| Top-level destinations, a handful (up to about 5 to 7) | Top bar or bottom bar on phones; add a menu for the rest |
| Many destinations or a deep hierarchy | Sidebar with groups; search for very large products |
| Location in a deep hierarchy | Breadcrumbs |
| A fixed multi-step process with dependencies | A stepper with progress, review, and the ability to go back |
| Collapsing long secondary content | Accordion (one question per panel for FAQs) |

Tabs switch content on one page; links change pages. Do not use tabs as primary site navigation or for steps that must be done in order.

## Showing data

| Need | Use |
| --- | --- |
| Compare values across attributes | A table (semantic `table`; align numbers right; sticky header for long tables) |
| Browse items with images or mixed content | Cards or a list; keep one scan direction |
| A trend or distribution | A chart with labeled axes, units, and a text or table alternative |
| Many rows | Pagination for goal-directed lookup, "load more" for browsing, virtualization for performance with keyboard access kept |
| Few rows with rich detail | A list with row actions in a consistent place |

Bulk actions say whether they apply to the visible rows, this page, or all matching results. Empty and filtered-to-zero states differ from an error ([states.md](states.md)).

## Buttons and actions

- Label with a verb and an object ("Save draft", "Delete invoice"), not "OK", "Submit", or "Yes".
- Order: the safe or common action is easy to reach; destructive actions are visually distinct and not adjacent to the primary one without separation.
- One primary action per decision region, not per page. Secondary and tertiary actions step down in emphasis.
- A button runs an action, a link navigates. Do not style one as the other without matching its semantics.
- Prefer a clear reason or an enabled button that explains on use over a disabled button with no explanation.
