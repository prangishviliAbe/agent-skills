# Typography

Read when: Choosing typefaces, setting a type scale, or fixing text that looks generic, cramped, or unfinished.

Type is most of a design. A page with ordinary colors and excellent typesetting looks deliberate; the reverse never does. Numbers here are starting points for Latin text; verify each against the real font, script, and render. For Georgian and mixed scripts, also read [multilingual.md](multilingual.md).

## Choosing a typeface

Choose with reasons, in this order:

| Criterion | Check |
| --- | --- |
| Script coverage | Every language the product ships in, including punctuation, currency signs, and numerals. A fallback font in the middle of a word is a defect |
| Role fit | Text faces need open counters and a generous x-height; display faces can be tighter and more characterful |
| Weights and styles | The real weights you will use exist as files. Never rely on browser-synthesized bold or italic |
| Numerals | Tabular and lining figures for data; check that the feature exists |
| Tone | One sentence linking the face to the subject, for example "a workmanlike grotesque close to freight stencils" |
| License and delivery | Licensed for web use, self-hostable, reasonable file size, variable version if several weights are needed |

Rules that prevent the usual mistakes:

- One family with a good weight range is enough for most products. Add a second only for a clear contrast of role (text versus display, prose versus data).
- Pair by contrast. Two similar sans-serifs side by side look like an error.
- Do not pick from a memorized list of "non-default" fonts; that list becomes the next default. Search by the criteria above and compare three candidates in the real headline and a real paragraph.
- A common face (Inter, system UI) is acceptable when chosen for a stated reason and set carefully. It is a defect only when it is the unexamined default.
- Monospace is for code, identifiers, and aligned data. It is not a way to look technical.

## Scale

Define the scale once as tokens and use nothing else. Example for a marketing page; a dense product UI uses a shorter range (12 to 24).

| Role | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| Display | clamp(2.75rem, 1.6rem + 4.6vw, 5rem) | 1.0 to 1.08 | 600 to 700 | -0.02em |
| H1 | clamp(2.125rem, 1.5rem + 2.6vw, 3.25rem) | 1.1 | 600 | -0.015em |
| H2 | clamp(1.625rem, 1.3rem + 1.3vw, 2.25rem) | 1.15 to 1.2 | 600 | -0.01em |
| H3 | 1.25rem to 1.375rem | 1.3 | 600 | 0 |
| Body large | 1.125rem to 1.25rem | 1.55 | 400 | 0 |
| Body | 1rem to 1.0625rem | 1.5 to 1.65 | 400 | 0 |
| Small | 0.875rem | 1.45 | 400 to 500 | 0 |
| Caption or label | 0.75rem to 0.8125rem | 1.4 | 500 | 0 to 0.02em |

Principles behind the table:

- **Steps must be visible.** Adjacent roles differ by roughly 1.2 times or more. If two sizes are hard to tell apart, delete one.
- **Line height falls as size rises.** Body text needs air; display text set at 1.5 falls apart into separate lines.
- **Tracking follows size.** Large text slightly tighter, small all-caps looser (0.04 to 0.08em), body untouched. Never apply negative tracking to body text or to scripts where it damages word shapes.
- **Two properties per level.** Distinguish neighboring levels by size and weight, or size and color. Size alone is weak; five weights is noise. Three weights is the usual ceiling.
- **Fluid sizes keep a rem floor and ceiling** so user zoom still works. A size in `vw` alone defeats zoom.
- **Contrast of scale creates drama.** A 5rem display next to 1rem body is a decision; 2rem next to 1.5rem is indecision.

## Measure, alignment, and wrapping

```css
h1, h2, h3 { text-wrap: balance; max-inline-size: 22ch; }
p, li      { text-wrap: pretty;  max-inline-size: 65ch; }
```

- Running text: 45 to 75 characters per line. Wider is tiring, narrower is choppy. Set the limit on the text block, not on the page container.
- Headlines: constrain by character count so the break falls well. Check every width for a single word alone on the last line. Fix by measure or size before inserting a manual break, and never with a break that only works at one width.
- Align running text to the start edge. Center only short, self-contained text: a headline of one to three lines, a caption, a button label.
- Do not justify text on the web unless hyphenation is on and the result has been inspected.
- `text-wrap: balance` and `pretty` are progressive enhancements; confirm support for the project's browsers and make sure the fallback is still acceptable.

## Vertical rhythm

- Space above a heading is larger than space below it, so the heading belongs to what follows. A common ratio is two or three to one.
- Paragraph spacing is about one line of body text or slightly less. Do not combine indents and spacing.
- List items sit closer together than paragraphs, and a list sits closer to its introducing sentence than to the next paragraph.
- Use the spacing scale for all of this; do not tune each heading by eye into unique values.

## Details that separate finished from unfinished

| Detail | Do |
| --- | --- |
| Quotation marks | Typographic marks for the language: “ ” in English, „ “ in Georgian and German |
| Apostrophes | The curly form, not the straight key |
| Dashes | En dash for ranges (2024–2026), hyphen only for compounds. Use sentence punctuation instead of scattering em dashes |
| Ellipsis | The single character, and only where text really trails off |
| Numbers in tables | `font-variant-numeric: tabular-nums`, right-aligned, same decimal places |
| Units and short words | Non-breaking space between number and unit, and before a final short word that would otherwise orphan |
| All caps | Short labels only, with added tracking, and real small caps if the font has them |
| Links in prose | Underlined, with `text-decoration-thickness` and `text-underline-offset` tuned so descenders stay readable |
| Emphasis | Italic or weight for meaning within a sentence; never color alone |
| Optical sizing | `font-optical-sizing: auto` when the variable font provides an optical-size axis |
| Long strings | `overflow-wrap: anywhere` on URLs, codes, and emails; deliberate truncation with a way to see the whole value |
| Selection | A `::selection` color that fits the palette and keeps text readable |

## Loading

A design is not finished if it flashes or jumps while fonts load.

```css
@font-face {
  font-family: "Brand Text";
  src: url("/fonts/brand-text.woff2") format("woff2");
  font-weight: 400 700;
  font-display: swap;
}
@font-face {
  font-family: "Brand Text Fallback";
  src: local("Arial");
  size-adjust: 102%;      /* tune until fallback and web font wrap alike */
  ascent-override: 92%;
  descent-override: 24%;
}
:root { --font-text: "Brand Text", "Brand Text Fallback", system-ui, sans-serif; }
```

Self-host WOFF2, subset to the scripts in use, preload only the one or two files needed for the first view, and tune the fallback metrics until the swap causes no visible reflow. The override values above are placeholders; measure them for the real pair.

## Diagnosis

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Page looks flat | Levels differ by size only, and not enough | Fewer levels, bigger steps, add weight or color contrast |
| Looks like a template | Default font, default scale, default tracking | Choose the face with a reason; set the scale and tracking for it |
| Headline feels loose | Line height and tracking left at body values | Tighten both for display sizes |
| Text feels cramped | Long measure with low line height | Shorten the measure first, then raise line height |
| Gray and tired | Text contrast too low, weight too light | Darker text color, regular weight, larger size |
| Busy | Too many sizes, weights, colors, and cases | Remove levels until each has a job |
| Numbers jitter or misalign | Proportional figures | Tabular figures, right alignment |
| Bold looks smeared | Synthesized weight | Load the real weight or use one that exists |
