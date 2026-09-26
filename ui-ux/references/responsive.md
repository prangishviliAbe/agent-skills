# Responsive behavior, input methods, and localization

Read when layout, content, input, zoom, or language changes across environments.

## Choose coverage from the product

Start where the primary task is hardest, whether a small form or a dense desktop workspace. Use existing breakpoints when they work; add a breakpoint where actual content or interaction breaks.

Test the minimum supported width, representative compact and wide layouts, and immediately around meaningful breakpoint changes. For web reflow, include 320 CSS px or equivalent 400% zoom; do not test a long fixed list of device sizes without a reason.

## Adapt without losing the task

| Concern | Decision |
| --- | --- |
| Priority | What must remain visible or readily reachable, and what can move below or into disclosure? |
| Order | Does visual rearrangement preserve a meaningful DOM/reading and focus sequence? |
| Navigation | Which destinations need persistent visibility; how does overflow remain discoverable? |
| Table | Do users compare columns? Choose contained scroll, optional columns, or stacked rows without losing relationships |
| Toolbar | Which actions stay exposed, and can overflow controls be reached by keyboard and touch? |
| Chart | Which detail can simplify while retaining the comparison and an accessible data alternative? |
| Modal/panel | Does the content need a sheet, full page, or dialog; what happens to focus and dismissal? |
| Media | How do crop, focal point, caption, and text contrast survive resizing? |
| Text | Does the font, script, measure, and wrapping support reading at the actual width? |

Do not hide essential data or action merely to avoid scrolling. Two-dimensional data can legitimately use a contained scroller under the reflow exception; the rest of the page should adapt. See [accessibility.md](accessibility.md).

## Implementation choices

Prefer intrinsic layout where it fits: wrapping flex rows, grids with sensible minimums, bounded fluid sizes, and container queries for components adapting to their own space. Confirm support in the project's target environments.

Avoid fixed heights around dynamic text. Bound fluid typography so it stays readable under zoom; viewport units alone can frustrate text enlargement. A line-length target is a starting point for a chosen font and script, not a universal limit.

## Input is independent of width

A wide viewport can be touch operated and a narrow one keyboard operated.

- Keep essential controls usable without hover; add hover enhancements based on input capability.
- Design comfortable target areas; use 44×44 CSS px as a touch aim when suitable. WCAG 2.2 AA uses a 24×24 minimum with specific exceptions, not a universal 44px rule.
- Check sticky controls against viewport changes, safe areas, on-screen keyboards, and browser chrome.
- Use dynamic viewport units where supported and helpful, with fallback behavior appropriate to the target environment.
- Test focus visibility and scroll position when controls open or keyboard input changes the viewport.

Density should follow task and audience. Offer compact mode only when there is a real need, retaining accessible targets and necessary actions.

## Localization

- Test actual representative translations; pseudolocalization can expose fragile layout but cannot validate a real script or translation.
- Do not assume a fixed expansion percentage. Short labels, long compounds, and scripts vary differently.
- Verify font coverage and real weight support, fallback metrics, wrapping, and clipping with the actual script. There is no universal extra line-height for all non-Latin text.
- Keep messages as complete localizable units with plural/select rules, rather than concatenated sentence fragments.
- Use logical layout properties and appropriate language/direction attributes. RTL does not mean blindly mirroring numbers, logos, charts, or media controls; resolve each by meaning and convention.
- Format dates, numbers, and currencies with locale-aware tools while preserving explicit product timezone/currency requirements. Do not infer a user's country or desired currency from language alone.
- Allow people to choose or correct language and locale when relevant.

## Verification record

For affected layouts, record the actual checks: width/zoom, content variant, theme/locale, input method, result, and unresolved limitation.

Check overflow, clipping, reachable actions, data relationships, focus, and readable content. A static layout can specify these behaviors; it cannot establish that a browser and assistive technology actually perform them correctly.