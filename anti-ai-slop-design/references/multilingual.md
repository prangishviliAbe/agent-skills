# Georgian and multilingual visual design

Read when a requested interface uses Georgian, a non-Latin script, multiple languages, or RTL content. Use the user's actual language/brand requirements; do not infer a locale from a name or directory.

## Georgian (ქართული): casing without myths

Modern Georgian body text generally uses Mkhedruli. Unicode defines uppercase mappings to Mtavruli; Georgian titlecasing is not the same as Latin word/sentence capitalization. Do not call Georgian wholly caseless or claim that uppercase is technically invalid.

Mtavruli can be a deliberate heading or brand choice. Preserve approved usage and check font coverage, tone, size, and readability. Avoid applying a global Latin uppercase/title-case rule blindly to Georgian controls or rewriting the underlying content merely for styling.

Source: [Unicode's Georgian script description](https://www.unicode.org/versions/Unicode12.1.0/ch07.pdf) documents Mkhedruli/Mtavruli case mapping and the titlecase distinction; [Georgian Extended character names](https://www.unicode.org/charts/nameslist/n_1C90.html) identifies the uppercase block.

## Georgian typography in practice

- Inspect glyphs, ascenders/descenders, weight, and line boxes in the actual chosen font. Choose size and leading through rendered samples; there is no mandatory Georgian line-height or universal minimum font size.
- Verify Mkhedruli coverage and Mtavruli when used, plus punctuation, numerals, Latin product names, and relevant symbols.
- Verify that the delivered font files contain the needed glyphs and real weights. A family name in CSS does not prove coverage, and fallback can produce a different optical size.
- Start with natural letter spacing. Evaluate any display tracking with a fluent reviewer when possible; do not force a zero-tracking rule onto every brand treatment.
- Use real long labels, validation messages, navigation items, and table headers. Georgian expansion relative to English is content-dependent, not a fixed percentage.
- Allow flexible control width and wrapping where needed; do not cut essential labels to preserve a Latin-sized mockup.
- Test reading and clipping at compact widths, zoom, and user text-spacing overrides. Verify mixed-script alignment without demanding identical glyph dimensions.

If exploring fonts, evaluate candidates such as Noto Sans Georgian or FiraGO only after checking availability, file coverage, license, weight support, and fit. These examples are not mandatory dependencies or assurance of the installed font version.

## Language-aware content and layout

| Concern | Practical decision |
| --- | --- |
| Font fallback | Supply a deliberate stack and inspect actual fallback rendering; avoid a list of uninstalled fonts that hides missing coverage |
| Expansion | Use real translations plus pseudolocalization; test short controls as well as long prose |
| Message grammar | Localize whole messages with plural/select rules; do not concatenate English-shaped fragments |
| Line breaking | Use language metadata and appropriate wrapping/hyphenation; avoid global `word-break: break-all` as an overflow repair |
| Text metrics | Test the specific font/script combination; do not assume every non-Latin script requires more leading |
| Embedded content | Localize screenshots, images containing text, examples, and essential image alternatives when required |
| Formatting | Apply locale-aware number/date formatting while preserving explicit currency, timezone, and product rules |
| User identity | Support real name/address structures without assuming given-name/family-name order or a single country's fields |

Pseudolocalization exposes clipping and hardcoded strings; it cannot prove translation quality, typography, shaping, or cultural appropriateness. For public-facing copy, distinguish a draft translation from one reviewed by a fluent speaker.

## RTL and mixed-direction content

Set language and direction appropriately; language alone does not establish layout direction. Use logical layout properties where they express intent.

Mirror meaning, not every pixel. Navigation sequence and directional arrows may adapt; numbers, code, logos, media controls, and charts need their own semantic decision. An RTL locale does not mean reversing a time series automatically.

Isolate inserted opposite-direction or unknown-direction strings, for example with `bdi` or an appropriate `dir` value. Test names, email addresses, amounts, punctuation, and mixed-script labels in context. Follow [W3C inline bidi guidance](https://www.w3.org/International/articles/inline-bidi-markup/) and [internationalization quick tips](https://www.w3.org/International/quicktips/).

## Focused verification

For the supported locales and affected feature:

- [ ] Required glyphs and weights render from the expected font files; fallback remains usable.
- [ ] Casing and tone follow the language and approved brand treatment.
- [ ] Real long strings fit without clipping or losing essential meaning.
- [ ] Reading order, focus order, direction, and control relationships remain understandable.
- [ ] Numbers, dates, plurals, and mixed-script content are correct for the stated requirements.
- [ ] Font metrics, text enlargement, and spacing overrides do not hide content or controls.
- [ ] Draft translation or typography limits are reported honestly.