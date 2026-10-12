# Components chosen by task

Read when: Choosing between a table, card, drawer, dialog, command palette, segmented control, or disclosure.

| User need | Useful pattern | Constraint |
| --- | --- | --- |
| Compare repeated records | Table or aligned list | Preserve headers, numeric alignment, exceptions, and accessible reading |
| Browse independent objects | Cards when grouping helps | No obligatory icon bubbles, accent rails, or hover lift |
| Complete a focused interruption | Modal dialog | Label, initial focus, Escape policy, inert background, return focus |
| Keep primary context while editing | Side panel or inline form | Nonmodal panels do not automatically trap focus |
| Switch small related views | Tabs or segmented control | Use the semantics of actual behavior; tabs need tab keyboard behavior |
| Search many known actions | Command palette as an additional route | Retain discoverable ordinary navigation |
| Reveal optional detail | Disclosure | Do not hide essential prerequisites or errors |
| Explain a tiny label | Tooltip as supplementary help | Never the only label; support keyboard and pointer behavior |

Bento grids, floating docks, command palettes, and drawers are options, not signs of sophistication. Choose a familiar pattern when the task benefits from predictability.

## Example contract: shipment detail

```text
Trigger: Open shipment GE-10482 from the results list.
Context: Keep result filters and scroll position.
Surface: Inline disclosure on narrow screens or a labeled panel if space permits.
Content: Status, route, last update, and exception details remain accessible.
Close: Return to the originating record; restore focus when applicable.
Failure: Keep record identity and offer a refresh without erasing filters.
Decoration: No status-colored card stripe; use a labeled status and clear exception copy.
```

For clickable cards, provide a clear primary link and separate controls without nesting interactive elements. Style hover only when the component is actually interactive.
