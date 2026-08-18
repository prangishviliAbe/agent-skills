# Accessibility, operationally

Read when designing or reviewing anything interactive. Targets are WCAG 2.2 AA unless the project sets a stricter bar.

## Numbers to design against

| Requirement | Threshold |
| --- | --- |
| Body text contrast | 4.5:1 against its actual background |
| Large text (24px, or 19px bold) | 3:1 |
| UI component boundaries, icons carrying meaning, focus indicators | 3:1 against adjacent colors |
| Touch target | 44×44 CSS px, or 24×24 with adequate spacing where the platform allows |
| Text resize | Usable at 200% zoom, no loss of content or function |
| Reflow | No horizontal scrolling at 320 CSS px width |
| Motion | Honor `prefers-reduced-motion`; no flashing above three times per second |

Placeholder text, disabled controls, and text over images are the usual contrast failures. Check them against the real background, including the image at its darkest region and any gradient overlay.

## Keyboard: the fastest audit

Put the mouse down and traverse the whole flow with `Tab`, `Shift+Tab`, `Enter`, `Space`, arrows, and `Escape`.

- [ ] Every interactive element is reachable and every reachable element is interactive.
- [ ] Focus is always visible, with a 3:1 indicator that is not clipped by an overflow container.
- [ ] Focus order follows the visual reading order.
- [ ] No trap: you can always leave, including from dialogs and embeds.
- [ ] Opening a dialog moves focus into it, `Escape` closes it, and focus returns to the trigger.
- [ ] A skip link reaches the main content.
- [ ] Nothing is reachable while hidden off-screen or behind a closed menu.
- [ ] Custom controls follow their expected key pattern (below).

| Component | Keys |
| --- | --- |
| Button | `Enter` and `Space` |
| Link | `Enter` |
| Checkbox / switch | `Space` |
| Radio group | Arrows move and select; the group is one tab stop |
| Tabs | Arrows move between tabs; `Tab` moves into the panel |
| Menu | `Enter`/`Space`/`Down` opens, arrows move, `Escape` closes and restores focus |
| Combobox | Arrows navigate options, `Enter` selects, `Escape` reverts |
| Dialog | Focus trapped inside, `Escape` closes |
| Slider | Arrows adjust, `Home`/`End` jump to bounds |

## Semantics and names

- Use the native element first. A `<button>` gives you focus, keyboard, role, and platform behavior for free; a `div` with a click handler gives you a bug list.
- One `<h1>` per page, headings in order, and structural landmarks (`header`, `nav`, `main`, `footer`) present.
- Every control has an accessible name that makes sense read alone: "Delete invoice 4211", not "Delete". Never rely on surrounding visual context.
- Every input has a persistent, programmatically associated `<label>`. Placeholder is not a label — it disappears exactly when the user needs it.
- Icon-only controls need a text alternative and a tooltip that is also reachable by keyboard.
- Images: describe the meaning, not the file. Decorative images take an empty alt so they are skipped.
- Errors are associated with their field (`aria-describedby`, `aria-invalid`) and announced.
- Use ARIA only when no native element fits, and follow the pattern completely. A partially implemented ARIA widget is worse than a plain one.

## Announcements

- A live region announces asynchronous changes the user would otherwise miss: search result counts, save confirmations, background failures.
- `polite` for informational updates, `assertive` only for genuinely interrupting errors.
- The live region must exist in the DOM before the content changes, or nothing is announced.
- Do not announce everything. A region that fires on every keystroke is noise the user will disable.

## Never rely on one channel

- Not color alone: pair status color with an icon, a label, or a pattern.
- Not motion alone: an animated state change also needs a static difference.
- Not position alone: "the button on the right" means nothing in a linearized reading order or an RTL layout.
- Not hover alone: everything reachable by hover is reachable by focus and by touch.

## Forms

- Group related fields with a fieldset and a legend; do not fake it with a heading alone.
- Correct `type`, `inputmode`, and `autocomplete` values. This is an accessibility and a conversion feature simultaneously.
- Required fields are marked in text, not only with a colored asterisk.
- On failed submit: focus the first invalid field, keep every value, and show a summary count that is announced.
- Never impose a time limit that cannot be extended, and never auto-submit on the last character of a code without also offering an explicit action.

## Cognitive load

Accessibility is not only sensory. Reduce the number of decisions per screen, keep language plain, keep terminology consistent, break long flows into steps with visible progress, and let people save and return. Do not rely on memory across steps — show what they already entered.

## Verification, in order of cost

1. Keyboard-only traversal of the primary flow.
2. Automated check (axe or equivalent) — catches roughly a third of issues, so it is a floor, not a pass.
3. Contrast check on the real rendered colors, including states and overlays.
4. Zoom to 200% and reflow at 320px.
5. Screen reader pass on the primary flow: does it make sense read aloud, in order, without the visuals?
6. Reduced motion, dark mode, and a translated locale.

Never claim conformance you have not tested. State which checks ran and which did not.
