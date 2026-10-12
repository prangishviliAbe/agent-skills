# Multilingual and Georgian typography

Read when: Fitting Georgian, English, or mixed-script content into a shared visual system.

## Decisions

| Concern | Inspect | Correct move |
| --- | --- | --- |
| Coverage | Actual font file and rendered glyphs | Choose a licensed font covering the required script; verify fallback |
| Weight | Supplied weights, glyph darkness, Latin/Georgian balance | Use real weights; avoid synthetic styling |
| Leading | Tall/deep glyphs in actual headlines and controls | Adjust by observed clipping/readability, not a universal percentage |
| Tracking | Word shapes, counters, adjacent letters | Start with normal spacing; tune per font and script after inspection |
| Casing | Language policy and font support | Keep supplied casing; do not impose Latin uppercase styling blindly |
| Wrapping | Real translation, width, punctuation, long names | Allow reflow; tune measure; avoid blanket nowrap and decorative hard breaks |
| Mixed content | Currency, digits, IDs, Latin names beside Georgian | Check baseline and numeral behavior in the actual font |
| Loading | Slow font load and fallback metrics | Reserve appropriate space and inspect after fonts finish loading |

Mkhedruli and Mtavruli behavior depends on the intended casing and font. Do not declare Georgian universally uncased or assume an exact 5–8% line-height increase. Candidate fonts such as FiraGO and Noto Sans Georgian require coverage, licensing, and actual-render checks.

## Localized content fixture

```text
ka title: გზავნილის სტატუსის შემოწმება
ka action: გზავნილის მოძებნა
ka status: დაგვიანებულია
en title: Check your shipment status
en action: Find shipment
mixed value: თბილისი → Berlin · GE-10482
long recipient: აბე პრანგიშვილი / Abe Prangishvili
```

Set the correct lang attribute for each language region. Inspect real supported text, not only this fixture. Keep essential information available when a translation is longer. A static text fixture cannot establish font rendering or accessibility behavior.
