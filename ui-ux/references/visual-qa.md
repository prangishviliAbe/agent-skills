# Render, operate, inspect, report

Read when: Verifying implemented UI, deciding whether work is ready to deliver, or reviewing an existing screen.

Verification means looking at the rendered result and using it. Code that compiles proves only that it compiles. Run this loop until a complete pass finds nothing above minor.

## 1. Set up

- Open the real artifact with the available browser or preview tool. Wait for fonts, images, and data.
- Confirm the rendered font is the intended one, not a fallback.
- Use real or realistic content, including the longest strings and every shipped language. Note anything synthetic.
- Clear console errors that affect rendering before judging the design.

If no rendering tool is available, complete the source or specification and report visual and interaction checks as Not run. Never describe a render that was not seen.

## 2. Operate

Use the interface before inspecting pixels; behavior defects outrank visual ones.

| Do | Looking for |
| --- | --- |
| Complete the main task end to end | Dead ends, missing feedback, unclear next step |
| Repeat with the keyboard only | Unreachable controls, lost or invisible focus, wrong order, traps |
| Trigger each applicable state: loading, empty, error, success, disabled, long content | Missing states, layout shift, lost input |
| Submit twice quickly; go back; refresh mid-task | Duplicate actions, lost work |
| Open and close every overlay | Focus entry and return, Escape, scroll lock, background interaction |
| Resize from wide to 320px | Overflow, clipped text, collapsed-not-designed layouts |
| Zoom to 200% | Clipping, overlapping, lost controls |
| Emulate reduced motion and dark or forced-colors modes if supported | Missing fallbacks, invisible elements |

## 3. Inspect

Capture screenshots at a narrow, a middle, and a wide size, and of each important state. Inspect in this order; earlier passes invalidate later ones.

| Pass | Question | Typical defects |
| --- | --- | --- |
| Thumbnail | Is there one clear focal point and reading order? | Equal weight everywhere; no primary action |
| Structure | Does the layout match the task and content? | Wrong pattern; template sections; boxes within boxes |
| Spacing | Are inner gaps smaller than outer gaps, all on the scale? | Off-scale values; uneven insets; crowded edges |
| Alignment | Do edges, baselines, and icons line up exactly? | Near-miss edges; icons sitting low; ragged card internals |
| Type | Scale, weights, measure, wrapping, numerals? | Orphans; long lines; too many sizes; fallback font |
| Color | Roles, contrast, accent discipline? | Low-contrast text; accent overuse; color-only meaning |
| Surfaces | One radius family, border weight, elevation logic? | Mixed radii; shadows on resting elements; double containment |
| Content | Is every label specific and every claim true? | Generic labels; placeholder data; invented proof |
| States | Do all states exist and hold layout? | Missing focus ring; hover on non-interactive items; jumping buttons |
| Ornament | Is anything decorative left? | Dots, stripes, glows, gradient text, badges, blobs |

Zoom into regions for the detail passes. A full-page screenshot hides small misalignments and bad crops.

## 4. Measure

Use measurements to locate problems, not to judge quality.

```javascript
(() => {
  const root = document.documentElement;
  const tally = { fontSizes: {}, textColors: {}, radii: {}, gaps: {} };
  const smallTargets = [], overflowing = [];
  const add = (bucket, key) => { bucket[key] = (bucket[key] || 0) + 1; };
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    if ([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) {
      add(tally.fontSizes, style.fontSize);
      add(tally.textColors, style.color);
    }
    if (style.borderTopLeftRadius !== '0px') add(tally.radii, style.borderTopLeftRadius);
    if (style.display.includes('flex') || style.display.includes('grid')) {
      if (style.rowGap !== 'normal') add(tally.gaps, style.rowGap);
    }
    if (el.matches('a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])')
        && (rect.width < 24 || rect.height < 24)) {
      smallTargets.push(`${el.tagName.toLowerCase()} ${Math.round(rect.width)}x${Math.round(rect.height)}`);
    }
    if (rect.right > root.clientWidth + 1) overflowing.push(el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
  }
  const sorted = bucket => Object.entries(bucket).sort((a, b) => b[1] - a[1]);
  return {
    pageOverflows: root.scrollWidth > root.clientWidth,
    overflowing: overflowing.slice(0, 20),
    smallTargets: smallTargets.slice(0, 20),
    fontSizes: sorted(tally.fontSizes),
    textColors: sorted(tally.textColors),
    radii: sorted(tally.radii),
    gaps: sorted(tally.gaps),
  };
})();
```

Compare against the tokens: sizes, colors, radii, and gaps outside the system are findings; so are targets under 24px (inline text links are exempt) and any page overflow. Run an automated accessibility scan as well when a tool is available, and treat it as one layer of evidence.

## 5. Fix and re-inspect

Fix in the source, re-render, and recheck the affected sizes and states. Changes interact: a larger heading changes wrapping, which changes spacing, which changes the narrow layout. Keep a short log when several issues are open.

```text
Where / state            Observed                               Fix                          Result
360, Georgian            Primary button label clips             Stack actions under 26rem    Verified 320 to 400
1280, table              Amount column start-aligned            End-align, tabular figures   Verified
Dialog, keyboard         Focus stays on page behind             Use native dialog            Verified: enter, Escape, return
Form, submit with error  Values cleared                         Preserve state on failure    Verified
```

## Severity

| Level | Examples | Action |
| --- | --- | --- |
| Blocker | Task cannot be completed; data lost; unreadable text; keyboard trap; missing focus; invented proof | Fix before delivery |
| Major | Wrong hierarchy or pattern; missing applicable state; visible misalignment; overflow; bad wrapping; decorative slop; fallback font | Fix and re-inspect |
| Minor | Small optical adjustment; slight inconsistency without effect on use | Fix within the requested scope |

Do not deliver implemented work with a blocker or major defect in the changed scope. If something cannot be fixed (missing asset, no access, out of scope), state exactly what and why.

## Reviewing without a running artifact

From a screenshot: visual structure, hierarchy, spacing, type, color, and content findings are fair; behavior, focus, responsiveness, and motion are Not run. From a description: reason about structure and states, label conclusions Inferred, and list what needs to be seen.

Give each finding as: what is observed, why it hurts the task or reads as unfinished, and a buildable fix. Rank by impact and lead with the few that matter most. Do not give numeric scores; "8/10" carries no information.

## Report

Scale to the task. A one-line fix gets a one-line report.

```text
Built:     Shipment form rebuilt in one column with existing tokens; added error,
           pending, and unknown-outcome states.
Verified:  Rendered at 320, 375, 768, 1280. Georgian and English. Keyboard-only
           completion of create and edit. Error, pending, success states triggered.
           No overflow; all targets 24px or larger; text contrast checked on 6 pairs.
Not run:   Screen reader; real device touch test.
Open:      Tariff API returns no currency; amount shown without symbol until fixed.
```

Never write "pixel-perfect", "fully responsive", or "accessible" as a conclusion. State what was checked.
