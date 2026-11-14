# Accessibility

Read when: Building or reviewing semantics, keyboard behavior, focus, contrast, target sizes, or dynamic announcements, or before making any accessibility claim.

Target WCAG 2.2 level AA. Accessibility is part of the design, not a pass at the end: most failures come from structure and component choice, and are expensive to retrofit.

## Baselines

| Concern | Requirement | Verify by |
| --- | --- | --- |
| Text contrast | 4.5:1; 3:1 for large text (about 24px regular or 18.66px bold and up) | Measuring rendered foreground and background, including on tints, images, hover, and placeholder text people must read |
| Non-text contrast | 3:1 for control boundaries, state indicators, and graphics needed to understand content | Checking against adjacent colors |
| Color independence | Meaning never by color alone | Viewing in grayscale: errors, required fields, status, chart series, links in text |
| Keyboard | Everything operable; logical order; no trap | Completing the whole task with Tab, Shift+Tab, Enter, Space, arrows, Escape |
| Focus visible | Clear indicator on every interactive element, not hidden by sticky bars or clipped | Tabbing through with overlays and sticky headers present |
| Target size | At least 24 by 24 CSS px or sufficient spacing (AA); aim for 44 by 44 on touch-first controls | Measuring the hit area, not the icon |
| Names and roles | Each control has an accessible name matching its visible label; correct role and state | Inspecting the accessibility tree; screen reader spot check |
| Structure | One `h1`, headings in order, landmarks for header, nav, main, footer; lists and tables marked as such | Listing headings and landmarks |
| Reflow and zoom | No loss of content or function at 320 CSS px wide and at 200% zoom; text spacing overrides do not clip | Resizing and zooming |
| Motion | Reduced-motion preference respected; anything moving for more than 5 seconds can be paused | Emulating the preference |
| Forms | Labels, instructions, errors identified in text and associated with fields; autocomplete tokens | Reading the markup; submitting with errors |
| Time limits | Warn and allow extension; do not log out with unsaved work silently | Exercising the timeout |
| Language | `lang` on the page and on passages in another language | Reading the markup |

Sources: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Check the current text of a criterion before asserting conformance.

## Semantics first

Use the native element that already does the job. It brings role, keyboard behavior, focus, and form participation for free.

| Need | Use | Not |
| --- | --- | --- |
| An action | `button` | A clickable `div` or `span` |
| Navigation to a URL | `a href` | A button that changes location |
| Text input | `input`, `textarea` with `label` | Contenteditable without a role and name |
| A choice | `select`, radio, checkbox | Custom widget unless requirements exceed native |
| Modal | `dialog` with `showModal()`, or a tested primitive | Positioned `div` with a hand-written focus loop |
| Disclosure | `details` and `summary`, or a button with `aria-expanded` | Hover-only reveal |
| Data grid | `table` with `th` and `scope` | Nested `div` rows |

ARIA changes what assistive technology hears; it adds no behavior. Use it to expose state (`aria-expanded`, `aria-selected`, `aria-current`, `aria-invalid`, `aria-busy`) and relationships (`aria-describedby`, `aria-controls`), and follow the [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) keyboard patterns when a custom widget is unavoidable. Wrong ARIA is worse than none.

## Keyboard and focus

| Component | Expected keys |
| --- | --- |
| Button | Enter and Space activate |
| Link | Enter activates |
| Tabs | Arrow keys move between tabs; Tab moves into the panel |
| Menu, listbox, combobox | Arrows move; Enter selects; Escape closes; typing jumps to a match |
| Dialog | Focus moves in on open, stays inside, Escape closes, focus returns to the trigger |
| Disclosure | Enter or Space toggles |
| Radio group | Arrows change selection; Tab leaves the group |

- Tab order follows visual and reading order. Do not use positive `tabindex`.
- Focus is never lost: after closing an overlay, deleting an item, or changing a view, move focus to a sensible place.
- Provide a "Skip to content" link as the first focusable element on pages with long navigation.
- Hidden content (closed menus, off-screen panels, exiting dialogs) is not focusable: use `hidden`, `inert`, or `display: none`.
- Focus is not obscured by sticky headers or cookie bars; use `scroll-padding` and check with real overlays.

```css
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
.icon-button {
  display: inline-grid;
  place-items: center;
  min-inline-size: 2.75rem;
  min-block-size: 2.75rem;
}
@media (forced-colors: active) {
  :focus-visible { outline-color: Highlight; }
}
```

Never write `outline: none` without an equally visible replacement. A box-shadow ring disappears in forced-colors mode; an outline does not.

## Names, images, and icons

- The accessible name contains the visible label text, so voice control users can say what they see.
- Icon-only buttons get a name (`aria-label` or visually hidden text) and a tooltip. Decorative icons get `aria-hidden="true"`.
- Images that convey information have `alt` text describing what matters in context; decorative images have `alt=""`. Complex charts have a text summary or data table.
- Links say where they go. "Read more" repeated ten times is ten identical links to a screen reader; include the subject or use `aria-describedby`.

## Dynamic content

| Event | Announce with |
| --- | --- |
| Result of an action ("Saved", "3 results") | `role="status"` (polite) region that already exists in the DOM, updated with the message |
| Urgent problem needing attention now | `role="alert"`, used sparingly |
| Validation error on blur | Field's `aria-invalid` plus associated message; no global alert per keystroke |
| Loading a region | `aria-busy="true"` on the region; a polite message when a long load completes |
| Streaming text | Announce start and completion, not every token |
| Route change in a single-page app | Move focus to the new page heading or main region and update the document title |

Toasts that disappear on a timer must not carry information that is unavailable elsewhere, and must stay long enough to read or be dismissible.

## Testing in layers

Each layer finds different problems; none replaces the others.

1. **Automated scan** (axe, Lighthouse, or the project's tool): catches roughly a third of issues, such as missing names and some contrast failures.
2. **Keyboard pass**: complete every task without a pointer. Finds focus order, traps, missing focus styles, and inoperable widgets.
3. **Zoom and reflow**: 200% and 400% zoom, 320px width, text spacing increased.
4. **Screen reader spot check** (NVDA or JAWS on Windows, VoiceOver on macOS and iOS, TalkBack on Android): headings, landmarks, names, states, announcements for the main flow.
5. **Preferences**: reduced motion, dark and forced-colors modes.

Report what was run and on what. "Automated scan clean; keyboard pass completed on the checkout flow; screen reader Not run" is a useful statement. "Accessible" is not, and "WCAG compliant" is a claim that needs a full evaluation against every applicable criterion.

## Common failures

| Failure | Fix |
| --- | --- |
| Placeholder used as label | Visible `label` element |
| Gray text at 3:1 | Darker neutral token |
| Custom dropdown that ignores the keyboard | Native `select` or a tested combobox primitive |
| Focus ring removed for looks | Restyle it; do not remove it |
| Dialog that leaves focus on the page behind | Native dialog or tested primitive; return focus on close |
| Error shown only by a red border | Add text and an icon; associate with the field |
| Icon buttons with no name | `aria-label` matching the tooltip |
| Hover-only actions in table rows | Also visible on focus and on touch |
| Content hidden with `opacity: 0` but still focusable | `hidden` or `inert` |
| Disabled button with no explanation | Explain the prerequisite in text nearby |
