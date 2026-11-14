# Render, inspect, scan, refine

Read when: Verifying implemented design work, or reviewing an existing page or screenshot.

A design is verified by looking at it rendered, at several sizes, with real content. Reading CSS proves that CSS exists. Run this loop until a full pass finds nothing above minor.

## 1. Render

Open the actual page in a browser tool. Before judging anything, confirm:

- Web fonts have loaded (the rendered font is the intended one, not a fallback).
- Images and data have arrived; nothing is still a placeholder.
- The content is real or realistic, including the longest strings and every shipped language.

If no rendering tool is available, finish the source as completely as possible and report visual verification as Not run. Do not describe an imagined render.

## 2. Inspect in passes

Capture full-page screenshots at a narrow, a middle, and a wide size (for example 360, 768 or 1024, and 1440 CSS px; add 320 and a very wide size when the layout is fluid). Then go through the passes in order. Earlier passes invalidate later ones, so do not polish details before structure holds.

| Pass | Look at | Typical defects |
| --- | --- | --- |
| Thumbnail | The whole page shrunk or blurred | No focal point; uniform gray texture; every section the same shape |
| Structure | Section order and forms against the outline | Template sequence; card grids for unlike content; filler sections |
| Hierarchy | Each viewport's first, second, third read | Competing emphasis; primary action lost; headings too close in size |
| Spacing | Gaps inside and between groups | Inner gap larger than outer; off-scale values; uneven insets |
| Alignment | Vertical edges, baselines, icon centering | Stray edges; icons sitting low; ragged card internals |
| Type | Measure, wrapping, leading, tracking, weights | Orphans; long lines; fallback font; synthesized bold |
| Color | Roles, contrast, accent usage | Accent everywhere; low-contrast text; untinted grays; leftover default palette |
| Surfaces | Radius, borders, shadows | Mixed radii; border plus shadow; shadows on resting elements |
| Content | Every sentence, name, number, image | Stock phrases; invented proof; placeholder data; illegible captures |
| States | Hover, focus, pressed, disabled, loading, empty, error | Missing focus ring; layout shift; hover on non-interactive elements |
| Motion | Load, scroll, interaction | Entrance animations hiding content; decorative loops |
| Narrow | The smallest width, with the longest language | Overflow; clipped buttons; collapsed-not-designed layout |

For the detail passes, zoom into regions. A full-page screenshot hides 2px misalignments and bad crops.

## 3. Measure what can be measured

Run this in the page to find overflow and to count how many distinct values are really in use. Many distinct font sizes, radii, or shadows means the system is not being followed.

```javascript
(() => {
  const root = document.documentElement;
  const seen = { fontSize: {}, fontFamily: {}, color: {}, radius: {}, shadow: {} };
  const overflow = [];
  const bump = (bucket, key) => { bucket[key] = (bucket[key] || 0) + 1; };
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      bump(seen.fontSize, style.fontSize);
      bump(seen.fontFamily, style.fontFamily.split(',')[0].trim());
      bump(seen.color, style.color);
    }
    if (style.borderTopLeftRadius !== '0px') bump(seen.radius, style.borderTopLeftRadius);
    if (style.boxShadow !== 'none') bump(seen.shadow, style.boxShadow);
    const rect = el.getBoundingClientRect();
    if (rect.width && rect.right > root.clientWidth + 1) {
      overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
    }
  }
  const sort = bucket => Object.entries(bucket).sort((a, b) => b[1] - a[1]);
  return {
    pageOverflows: root.scrollWidth > root.clientWidth,
    overflowingElements: overflow.slice(0, 20),
    fontSizes: sort(seen.fontSize),
    fontFamilies: sort(seen.fontFamily),
    textColors: sort(seen.color),
    radii: sort(seen.radius),
    shadows: sort(seen.shadow).map(([value, count]) => [value.slice(0, 80), count]),
  };
})();
```

Read the result against the tokens: sizes outside the scale, a family that should not be there, more than a handful of text colors, radii outside the family, and any shadow on resting content are findings. Measurements locate problems; they do not judge beauty.

## 4. Scan the source

```bash
node scripts/slop-scan.mjs src
```

Run it from the skill folder, or give the full path to the script; the argument is the file or directory to check. Add `--json` for machine-readable output and `--strict` to exit with status 1 when warnings exist.

- Each hit names a rule, a file, and a line. Open it and decide: remove, replace, or keep.
- A hit that is functional (a real status pulse, an approved brand gradient) can be acknowledged by putting `slop-ok: reason` in a comment on the same line; the scanner then skips it and lists it as acknowledged.
- The scanner reads text. It cannot see layout, hierarchy, or whether an image is true. A clean scan is necessary and nowhere near sufficient.

## 5. Fix, then look again

Fix in the source, re-render, and re-inspect the affected sizes and states. Corrections interact: a larger headline changes wrapping, which changes spacing, which changes the narrow layout. Keep a short log when several issues are in play.

```text
Width / state        Observed                                   Fix                               Recheck
360, ka              Button label clips at "შენახვა"            Stack actions below 26rem         Verified at 320, 360, 400
1440                 Hero text edge off grid by 8px             Use container padding token       Verified
1440, hover          Feature rows lift on hover, not clickable  Remove transform                  Verified
All                  "Trusted by 10,000+" unsourced             Removed line                      Verified
```

## Severity

| Level | Examples | Action |
| --- | --- | --- |
| Blocker | Unreadable text, unreachable action, broken layout, invented proof, missing focus | Fix before delivery |
| Major | Template structure, hard-banned motif, wrong hierarchy, visible misalignment, bad wrapping or crop, fallback font | Fix and re-inspect |
| Minor | Small optical nudge, slight inconsistency with no effect on reading | Fix within the requested scope |

Work is not complete with a blocker or major defect in the changed scope. If something cannot be fixed (missing asset, no access), say exactly what and why.

## Reviewing a screenshot or description only

When only an image or a description is supplied, limit claims to what it shows. Findings about visual structure, type, color, and content are fair. Interaction, responsiveness, focus, and motion are Not run. Give each finding as: what is observed, why it reads as generated or unfinished, and the buildable fix. Rank by effect on the whole, and lead with the two or three changes that matter most.

## Report

Short and factual, scaled to the task. A one-line fix gets a one-line report.

```text
Direction:  Lookup-first page set like a waybill; brand purple kept for action only.
Removed:    Hero badge, gradient headline, three icon cards, stats row, card hover lift.
Built:      Token set, lookup hero with live example, tariff table, address list.
Verified:   Rendered at 320, 360, 768, 1440; ka and en; hover, focus, error, empty.
            No overflow; one font family rendered; contrast checked on text pairs.
Scanner:    0 warnings; 1 acknowledged (brand gradient on logo lockup).
Not run:    Screen reader pass; native Georgian copy review.
Open:       Warehouse photos needed to replace the two marked sample images.
```

Never write "pixel-perfect", "fully responsive", or "accessible" as a conclusion. State what was checked.
