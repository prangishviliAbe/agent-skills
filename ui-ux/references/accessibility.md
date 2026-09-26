# Accessibility: requirements, patterns, and verification

Read for interactive web design or review. Use the project's conformance target; absent one, design toward WCAG 2.2 AA. This is a practical subset, not a complete conformance audit. For native apps, apply the platform's accessibility semantics and units rather than treating CSS pixels as native points.

## Requirements versus recommendations

| Concern | WCAG requirement or distinction | Practical check |
| --- | --- | --- |
| Text contrast, 1.4.3 AA | 4.5:1 for ordinary text; 3:1 for large text, at least 18pt (24 CSS px) or 14pt bold (about 18.67 CSS px). Defined exceptions include logos and inactive controls | Measure intended foreground/background colors including opacity and worst-case image/gradient regions; do not round a failing value up |
| Non-text contrast, 1.4.11 AA | 3:1 for visual information needed to identify controls/states and meaningful graphics, against adjacent colors, with stated exceptions | A decorative card boundary need not meet 3:1; the line identifying an otherwise invisible input usually does |
| Focus, 2.4.7 AA and 2.4.11 AA | Keyboard focus must be visible and not entirely hidden by author-created content | Inspect sticky headers, cookie banners, dialogs, and scroll containers; aim to keep the whole indicator visible |
| Focus Appearance, 2.4.13 AAA | Additional indicator area and change-of-contrast requirements; not an AA minimum | A robust ring is good practice, but do not label every thin ring an AA failure. Custom focus indicators also need applicable non-text contrast |
| Target size, 2.5.8 AA | At least 24×24 CSS px, or a specified exception | For undersized targets using the spacing exception, centered 24px-diameter circles must not intersect another target or another undersized target's circle. Check inline, equivalent, user-agent, and essential exceptions |
| Larger targets | 44×44 CSS px belongs to 2.5.5 AAA with exceptions, and is a useful touch design aim | Use generous touch areas when possible; do not report every 32px control as an AA failure |
| Resize text, 1.4.4 AA | Text can resize to 200% without loss, subject to criterion exceptions | Inspect text, controls, clipped labels, and available actions; include text-only enlargement where supported |
| Reflow, 1.4.10 AA | Vertically scrolling content works at 320 CSS px width without two-dimensional scrolling, except content needing a two-dimensional layout | Test a 1280px viewport at 400% zoom or an equivalent 320 CSS px viewport. A necessary data-table scroller may be an exception; surrounding controls still reflow |
| Text spacing, 1.4.12 AA | No loss when users apply specified spacing overrides | Test line-height 1.5×, paragraph spacing 2×, letter spacing 0.12×, and word spacing 0.16× font size where applicable to the language; these are overrides to tolerate, not mandatory default styling |

Sources: [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html), [target minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).

Inactive controls have contrast exceptions; keep their purpose and unavailable state understandable. Placeholder text is not generally exempt. Do not infer exact contrast from antialiased screenshot pixels when the actual colors are unavailable.

## Semantics and names

- Prefer native buttons, links, inputs, and tables. Use links for navigation and buttons for actions.
- Give each control an accessible name reflecting its purpose. Include visible label text in the accessible name; add context to ambiguous repeated actions without gratuitously replacing visible labels.
- Use persistent, associated labels for inputs; explain required formats before submission. Use fieldsets and legends for related control groups when appropriate.
- Use meaningful headings and landmarks. One main page heading is a useful convention, not a standalone WCAG rule; review the actual structure and relationships.
- Keep decorative images out of the accessibility tree; give informative images a useful alternative. Complex charts need the relevant values or takeaway in an accessible equivalent.
- Ensure names, roles, values, and states are exposed. ARIA does not supply keyboard behavior and must not contradict native semantics.
- Hidden or inert content must not leave actionable descendants in the tab sequence. Static content may legitimately receive programmatic focus to announce a heading or error summary.

## Keyboard and focus

Traverse the actual primary flow with keyboard input. A logical order must preserve meaning and operation; it need not match every visual coordinate. Do not add positive tab indices to compensate for a broken DOM sequence.

| Pattern | What to verify |
| --- | --- |
| Button / link | Button activates with Enter and Space; link with Enter; browser navigation behavior remains available |
| Radio group | Group navigation and selection follow the native or chosen pattern; check toolbar variants separately |
| Tabs | Arrow keys navigate tabs; automatic activation only when switching is effectively immediate, otherwise Enter/Space activates; Tab reaches panel content |
| Disclosure / site navigation | Use ordinary buttons and links where appropriate; do not impose application-menu semantics on normal site navigation |
| Menu | Implement the selected menu pattern completely, including opening, arrow movement, dismissal, and return focus |
| Combobox | Specify editable or select-only variant, popup behavior, option navigation, selection, dismissal, and retained input; Escape does not universally revert every edit |
| Modal dialog | Move focus meaningfully inside; keep modal interaction inside while open; support dismissal according to the pattern and return focus to the trigger or another logical target if it no longer exists |
| Slider or reorder control | Expose value and keyboard operation; dragging also needs a single-pointer non-drag alternative unless an exception applies |

Follow the relevant [ARIA Authoring Practices patterns](https://www.w3.org/WAI/ARIA/apg/patterns/), especially [tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), [comboboxes](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), and [dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). APG is implementation guidance; validate the chosen pattern in the target browser/assistive-technology combination.

Do not trap focus in nonmodal panels. Provide a working way to leave modal interaction; a focus loop while an open modal is active is intentional, not the forbidden trap itself.

## Forms, errors, and status

- Match input type, autocomplete, and input mode to the data without rejecting valid international input.
- Describe errors in text and associate field messages programmatically. Preserve valid input where safe.
- After failed submission, choose a linked error summary or the first invalid field based on form size and context. Specify focus and announcement once; avoid duplicate alert storms.
- Expose asynchronous status without unnecessary focus movement. Use polite announcements for routine updates; reserve interrupting alerts for genuinely urgent changes. Test live-region timing, including repeated messages.
- Allow password managers and paste. Do not make memorization or transcription the only authentication path when the criterion requires an alternative or assistance.
- Reuse information already supplied within the same process or make it selectable, subject to the redundant-entry exceptions. Do not ask users to retype an address simply because the next step has a new form.
- Keep recurring help in a consistent relative location. Describe timed-session warnings, extension, and safe recovery where applicable; do not invent a blanket ban on time limits.

Sources: [accessible authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html), [redundant entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html), [dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

## More than color and sight

Pair color with text, shape, pattern, or another meaningful indicator. Keep hover content available on focus where applicable; additional hover/focus content must satisfy its dismissible, hoverable, and persistent requirements. Touch users need a usable route too.

For media and motion, check applicable captions, descriptions, audio controls, pause/stop behavior, and flashing criteria. Respect reduced-motion preferences as a design practice; this alone does not satisfy every WCAG motion requirement. Avoid flashing; the exact flash criteria include threshold and area conditions, not simply a universal animation-frequency rule.

## Verification and reporting

Choose checks proportional to the affected feature:

1. Inspect semantic structure, names, roles, and relevant state announcements.
2. Operate the whole affected journey using keyboard alone, including errors and dismissal.
3. Measure contrast and hit areas in the actual rendered state.
4. Check text enlargement, reflow, spacing overrides, and focus visibility under sticky layers.
5. Use an automated accessibility checker to find machine-detectable issues, then inspect its results. There is no fixed percentage of all issues such a tool proves absent.
6. Test a relevant browser/screen-reader combination for substantial interaction changes. Record the environment and scenario.
7. Verify supported themes, reduced motion, and locale/input variants when affected.

Report **passed**, **failed**, **not applicable**, or **not tested**, with evidence. A screenshot, heuristic review, or clean automated scan does not establish whole-site WCAG conformance. Use the [complete WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/) for a formal audit.