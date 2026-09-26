# Flows, navigation, forms, and data work

Read for journeys, information architecture, forms, onboarding, or data-heavy interfaces.

## Map the affected journey

Choose prose, a state diagram, a flow map, or an interactive prototype based on branching complexity. Capture:

- Entry points and deep links, prerequisites, relevant identity and permissions.
- The decision or action at each step, and information needed before making it.
- Success, failure, uncertain outcome, cancellation, and partial completion.
- Back, refresh, interruption, session expiration, and later return.
- Persisted values and selection, completion evidence, and the next useful action.

For consequential transactions, distinguish a client timeout from a server-declared failure. The user may have succeeded despite losing the response. See [states.md](states.md).

## Reduce friction without removing control

| Opportunity | Apply when | Guardrail |
| --- | --- | --- |
| Remove a step | It adds no necessary decision, obligation, or value | Keep review where mistakes are consequential |
| Defer setup | The task can safely provide value first | Do not hide prerequisites until after the user invests effort |
| Preselect a default | It is predictable, reversible, and visible | Do not default consent, paid extras, or a risky scope from guesswork |
| Reuse data | The source is reliable and the user can correct it | Browser locale does not establish country, currency, timezone, or legal address |
| Offer progressive disclosure | Complexity is conditional or infrequent | Keep costs, consequences, and necessary alternatives discoverable |

## Navigation and orientation

Use labels grounded in the audience's vocabulary. Preserve stable location and route behavior. Make current selection visible where it helps orientation, and supply a route out of missing, forbidden, or expired content.

Choose visible navigation, a menu, search, or a combination based on number of destinations, frequency, and available space. A fixed count of menu items is not a usability rule. Test direct entry, browser Back, and return to a list without losing relevant position or filters.

## Forms and onboarding

- Use a clear reading order. A single column is a reliable default; related short fields may share a row when grouping and keyboard order remain clear.
- Keep labels persistent and associated. Above-field placement often helps flexible layouts; preserve a working system when another placement is appropriate.
- Group related questions, explain sensitive requests, and show requirements before submission. Choose field widths that support valid input rather than guessing a universal maximum.
- Label the submission by its outcome. Make optionality consistent and understandable; indicate required fields programmatically too.
- Choose one page versus steps based on task structure, branching, review, and resumability, not an arbitrary field count.
- Save drafts when useful and safe. Specify storage, expiry, cross-device behavior, and privacy limits rather than promising persistence the system cannot provide.
- Introduce help at the point of need. Tours and setup can be appropriate for complex products; let optional parts be skipped or revisited and explain genuinely mandatory steps.
- Distinguish first-use emptiness from no results, no permission, and a correctly empty workload.
- Preserve entered data during validation and navigation where safe; provide an explicit completion state.

## Search and filtering

Show the applied query, relevant active filters, result count when known, and clear/remove controls. Preserve state on return. Store shareable nonsensitive query state in the URL when appropriate; do not put secrets or sensitive personal search content there automatically.

Choose immediate versus explicit application based on cost and complexity. If requests overlap, prevent older responses from replacing newer results. Keep sorting stable, and explain no matches separately from a request failure.

## Tables and lists

Define the row's identity, comparison task, and primary actions first. Use semantic tables for tabular relationships, not a grid role by default; a grid brings additional keyboard responsibilities.

- Align numeric values for comparison; keep units, precision, missing values, and totals interpretable.
- State whether selection applies to visible rows, the current page, or all matching results. Make bulk-action scope visible before execution.
- Preserve selection and position deliberately across filters, pagination, refresh, and deletion.
- Choose pagination, load more, or virtualization from retrieval tasks and scale. Virtualization must retain accessible navigation and a workable route to the relevant item.
- At compact widths, compare stacked rows, optional-column disclosure, and contained horizontal scrolling. Preserve row/column relationships for comparison-heavy data; cards are not always an equivalent replacement.
- Describe partial bulk failures and which records changed. Offer undo only where the system can reliably restore them.

## Dashboards

Begin with decisions: what requires attention, what comparison supports the decision, and what action follows. Different roles may need different emphasis; do not force every dashboard into a single dominant metric.

Show relevant units, denominator, period, timezone, freshness, and definitions. Distinguish zero, unknown, unavailable, and not applicable. Use comparable scales or clearly disclose differences. Supply useful chart summaries or data alternatives.

Do not invent a business metric, trend, target, or dataset to make the composition look complete. Label sample data and specify required data dependencies.

## Handoff example

"After applying a status filter, the result count and active filter update. Returning from an item restores the filter and list position. If refresh fails, previously loaded records remain visible with their freshness stated and a retry action. Bulk selection is limited to the current page and cleared only when the user changes the query."

Adjust this contract to actual system capabilities; do not copy it as a universal rule.