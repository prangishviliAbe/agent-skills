# Georgian and mixed-script typography

Read when: A design ships in Georgian, in Georgian and English, or mixes Latin codes, numbers, and names into Georgian text.

Most templates are designed around English and break quietly in Georgian: the display font has no Georgian glyphs and falls back, tracking tuned for Latin capitals damages Mkhedruli, uppercase styling does nothing or shows missing glyphs, and longer words overflow buttons. Design with Georgian text from the first render, not as a translation pass at the end.

## Decisions

| Concern | Rule | Verify by |
| --- | --- | --- |
| Coverage | Every font in the stack that will render Georgian must contain Georgian glyphs, including the weights in use | Inspecting the rendered font per text run in browser dev tools, not the CSS declaration |
| Fallback | A Latin-only brand font needs a named Georgian companion matched in weight, x-height, and tone, declared before generic fallbacks | Setting a mixed-script sentence and comparing color and height |
| Weights | Use only weights that exist for the Georgian range. Synthesized bold is heavier and blurrier in Georgian than in Latin | Checking the font files and the rendered result |
| Case | Everyday Georgian (Mkhedruli) has no case. Do not rely on `text-transform: uppercase` for hierarchy: depending on browser and font it does nothing, or maps to Mtavruli glyphs the font may lack | Rendering the exact string; if capitals-style Georgian is wanted, the font must include Mtavruli (U+1C90 to U+1CBF) and the brand must want that look |
| Tracking | Start at zero. Negative tracking that suits large Latin headlines closes Georgian counters and joins letters. Wide tracking for "eyebrow" labels has no Georgian tradition | Comparing word shapes at the real size |
| Line height | Georgian has frequent ascenders and descenders. Display line heights that work for Latin capitals can collide in Georgian | Setting a multi-line Georgian headline with descenders above ascenders |
| Italic | Georgian has no established italic. Browser-slanted Georgian is a defect | Using weight or color for emphasis instead |
| Length | Georgian strings are often noticeably longer than English ones and contain long single words | Testing the longest real labels in buttons, tabs, table headers, and navigation |
| Wrapping | Allow wrapping; avoid `white-space: nowrap` on labels. Long compounds may need `overflow-wrap: anywhere` in narrow cells. Automatic hyphenation for Georgian is not dependable across browsers | Resizing to the narrowest supported width |
| Numerals and codes | Latin digits and codes inside Georgian text should come from the same family or a closely matched one, with tabular figures in tables | Looking for a size or weight jump at script boundaries |
| Language tags | Set `lang="ka"` on Georgian content and `lang="en"` on English runs so font selection, quotes, and assistive technology behave | Reading the markup |

## Font stack pattern

```css
:root {
  /* A family that covers both scripts is simplest. */
  --font-text: "Brand Sans", "Noto Sans Georgian", system-ui, sans-serif;
}
:lang(ka) {
  /* Tune Georgian separately from Latin when the same tokens do not fit both. */
  --heading-tracking: 0;
  --heading-leading: 1.2;
}
:lang(en) {
  --heading-tracking: -0.015em;
  --heading-leading: 1.1;
}
h1, h2 {
  letter-spacing: var(--heading-tracking);
  line-height: var(--heading-leading);
}
```

Candidate families with Georgian coverage include Noto Sans Georgian, Noto Serif Georgian, and FiraGO; local foundries publish others. Treat any name as a candidate only: confirm coverage, available weights, license, and the actual render before committing. When the brand face lacks Georgian, choosing its companion is a design decision that deserves a side-by-side comparison, not a silent fallback.

## Conventions

| Item | Georgian convention |
| --- | --- |
| Quotation marks | „ “ |
| Ranges | En dash without spaces: 9–12 დღე |
| Decimal and thousands | Decimal comma and space-grouped thousands are common (1 284,50); follow the product's existing locale formatting and be consistent |
| Currency | The lari sign ₾ or the word ლარი; pick one position and keep it. Confirm the font contains ₾ |
| Dates | Day, month name, year (14 ნოემბერი, 2026) or numeric 14.11.2026; avoid the US month-first order |
| Address form | One of formal თქვენ or informal შენ throughout |

Use the platform's locale formatting (`Intl.NumberFormat`, `Intl.DateTimeFormat` with `ka-GE`) rather than hand-built strings, and check its output against what the audience expects.

## Stress fixture

Render this in every component that holds text before calling a layout finished. It is a fixture for finding breakage, not a substitute for the product's real content.

```text
ka headline:   გზავნილის სტატუსის შემოწმება
ka long word:  გადამისამართებულია
ka button:     მიწოდების ინსტრუქციის შენახვა
ka status:     დაგვიანებულია
ka descenders: ფქრყშჩცძწჭხჯჰ ღყფ
en headline:   Check your shipment status
en button:     Find shipment
mixed:         თბილისი → Berlin · GE-10482 · ₾1 284,50
name:          აბე პრანგიშვილი / Abe Prangishvili
```

## Layout consequences

- Size buttons, tabs, and navigation for the Georgian labels, then confirm English still looks intended. Fixed widths tuned to English will clip.
- Headline measure differs by language. Set `max-inline-size` per language if a shared value wraps badly in one of them.
- A language switcher shows language names in their own script (ქართული, English), not flags.
- Keep parity: the same sections, data, and actions exist in both languages. A missing or half-translated section is more visible than any styling flaw.
- Check that web-font loading does not show a Latin fallback first and then reflow when the Georgian font arrives.

## Checks

| Check | Pass |
| --- | --- |
| Rendered font | Every Georgian run uses the intended family, verified in dev tools |
| Weights | No synthesized bold or oblique |
| Tracking and leading | Tuned per script; no touching letters or colliding lines |
| Case | No reliance on uppercase transforms; no missing-glyph boxes |
| Fit | Longest Georgian labels fit at the narrowest width |
| Conventions | Quotes, numbers, currency, and dates consistent |
| Native review | Read by a Georgian speaker, or marked Not run |
