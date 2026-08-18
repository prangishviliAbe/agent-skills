# Georgian and multilingual interfaces

Read whenever the interface carries a non-Latin script, or any language beyond the one the layout was designed in. Most "it looks off in Georgian" problems are Latin defaults applied to a script that does not behave like Latin.

## Georgian (ქართული)

**The script is unicase.** Mkhedruli has no capital letters. Consequences:

- `text-transform: uppercase` is wrong. Depending on the font and the browser it either does nothing or converts to Mtavruli, a display form that reads as shouting or as an unrelated style. Never apply it to Georgian UI labels, buttons, or navigation.
- Small caps, capitalized headings, and "Title Case" conventions do not exist. Do not port a Latin design's capitalization rules.
- Because there is no case contrast, **hierarchy must come from size, weight, color, and space** — the workload Latin design partly gives to capitalization.

**Vertical metrics.** Georgian has both tall ascenders and deep descenders (ბ, ღ, ყ, ც, ძ, ჭ, ჯ, ტ, ფ). Set body line-height around **1.6–1.75**, not the 1.4–1.5 that works for Latin. Headings need roughly **1.25–1.4**, more than a Latin heading at the same size. Tight leading causes ascenders and descenders from adjacent lines to collide.

**Optical size.** At equal point size, Georgian generally reads smaller than Latin. Body text usually wants **16–18px**, and 14px is often too small for comfortable reading.

**Letter-spacing.** Do not track Georgian. Positive tracking borrowed from Latin label styling breaks the connected rhythm of the script and looks amateurish. Leave it at zero.

**Length.** Georgian text typically runs **10–30% longer** than English, and words are long with few natural break points. Narrow buttons, fixed-width chips, and cramped table headers overflow or wrap into two lines. Design controls to hug their content with generous horizontal padding rather than to a fixed width.

**Fonts.** Most Latin webfonts have no Georgian coverage, so the browser silently falls back and the page ends up with two different typefaces at two different optical sizes. Choose a family with real Georgian support and set the stack explicitly:

```css
:root {
  --font-ka: "Noto Sans Georgian", "FiraGO", "BPG Arial", "Helvetica Neue LT Geo", system-ui, sans-serif;
}
```

Verify that the chosen family ships a real bold weight for Georgian. If it does not, the browser synthesizes one, and faux-bold Georgian looks smeared. Use color, size, or a second family for emphasis instead.

**Numerals and punctuation.** Georgian uses standard Arabic numerals. The Georgian paragraph separator (჻) is archaic and belongs only in deliberately historical typography.

**Checklist for a Georgian interface**

- [ ] No `text-transform: uppercase` anywhere in the Georgian layer
- [ ] Body line-height ≥ 1.6, headings ≥ 1.25
- [ ] Body size ≥ 16px
- [ ] Letter-spacing zero on Georgian text
- [ ] Font family with genuine Georgian coverage, including a real bold
- [ ] Buttons, chips, tabs, and table headers tested with the longest real Georgian string
- [ ] Navigation tested at compact width — Georgian menu labels wrap where English does not
- [ ] Form labels, validation messages, and empty states written in Georgian, not translated placeholders
- [ ] Mixed Georgian and Latin (product names, code, URLs) does not produce a metric mismatch that looks broken

## General multilingual rules

**Expansion.** Plan for text 30–40% longer than English (German, Finnish, Russian, Georgian) and shorter (Chinese, Japanese, Korean). Never size a container to the English string. Test with the longest real translation, not with a repeated placeholder.

**Never build a sentence from fragments.** Concatenating "You have" + count + "items" produces broken grammar in most languages. Use one complete, parameterized string per message with plural rules handled by the platform's formatting API.

**Line breaking differs by script.** Georgian, German, and Finnish have long unbreakable words. Thai and Khmer have no spaces between words. Chinese and Japanese break almost anywhere but have their own prohibited-position rules. Do not force `word-break: break-all` globally to solve one overflow — fix the container.

**Vertical metrics vary widely.** Devanagari, Thai, Arabic, Armenian, and Georgian all need more line-height than Latin at the same size. A single global line-height tuned for Latin will look cramped in half your locales.

**RTL is a layout flip, not a text change.** Arabic and Hebrew mirror the layout, alignment, directional icons, progress direction, and slider direction. Build with logical properties (`margin-inline-start`, `padding-block`, `inset-inline-end`) so the flip costs nothing. Do not mirror icons that represent real-world objects with a fixed orientation.

**Formatting is locale data, not string work.** Dates, times, numbers, currencies, name order, address order, and sort order all come from the platform's internationalization APIs. Hardcoding `MM/DD/YYYY` or a `$` prefix is a bug in most of the world.

**Content, not just strings.** Images with embedded text, screenshots of an English interface, culturally specific metaphors, and examples using local names all need localized versions or a neutral alternative.

**Testing.** Build with pseudo-localization early (expand strings, add accents, wrap in brackets) to expose hardcoded text and fragile containers before real translation exists. Then test the real translations at the smallest supported viewport, where every layout weakness appears first.
