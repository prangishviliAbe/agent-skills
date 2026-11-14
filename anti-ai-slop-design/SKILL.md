---
name: anti-ai-slop-design
description: >-
  Design, refine, implement, or critique websites, landing pages, dashboards, apps, and
  components so nothing looks AI-generated or templated. Use for "looks AI", "too generic",
  "make it premium", "make it look better", art direction, redesigns, visual polish, a page
  or component designed from scratch, or a review of how a UI looks, including Georgian and
  multilingual layouts. Covers every layer where slop appears: page structure, typography,
  color, spacing, surfaces, icons, imagery, copy, motion, and the code that produces them.
  Replaces default choices with decisions derived from the subject, executes them to a
  perfectionist standard, and proves the result by rendering and inspecting it. Preserves
  approved brand choices and accessibility.
---

# Anti AI Slop Design

Slop is the average. The first layout, palette, font, and sentence that come to mind are the most probable ones, which means they are the ones already on every other generated page. A design reads as AI-made when nothing in it was decided: every choice is the default, so the page could belong to any product.

The job has two halves, and both are required:

1. **Decide.** Replace each default with a choice that follows from this subject, this audience, and this content.
2. **Finish.** Execute every visible detail to the point where nothing on screen is unconsidered.

Removing ornament without deciding anything produces a blank default. Adding character without finishing produces a loud default. Neither is the goal.

## Three layers of slop

| Layer | What it looks like | Where the fix lives |
| --- | --- | --- |
| Structure | The same section sequence and the same card grid regardless of content | [layout.md](references/layout.md) |
| Styling | Default fonts, default palette, default radius and shadow, default effects | [typography.md](references/typography.md), [color.md](references/color.md), [surfaces.md](references/surfaces.md) |
| Content | Stock phrases, invented proof, placeholder names, generic imagery, filler icons | [copy.md](references/copy.md), [imagery-icons.md](references/imagery-icons.md) |

**Second-order slop** is swapping one cliché for its fashionable opposite: purple gradient replaced by cream background, serif headline, and terracotta accent; or by black borders, monospace labels, and hard offset shadows. That is a second template. A direction counts only when it can be traced to the subject.

## Scope: match the request

| Request | Do | Do not |
| --- | --- | --- |
| New page, screen, or component | Full workflow below | Skip the direction step and start from a card grid |
| "Make it better / less AI / premium" | Audit, fix structure and system first, then details | Repaint the same template in new colors |
| Critique only | Findings with evidence, ranked, each with a buildable fix | Rewrite the product or pad with praise |
| Local fix | Fix that relationship and anything it visibly breaks | Rebrand, restructure, or restyle the neighbors |

Approved brand elements (logo, colors, typefaces, fixed layouts, existing design system) are constraints. Improve their execution; do not replace them. If an approved element is itself a slop motif, say so once and keep it. An approved gradient does not authorize new ornaments.

## Workflow

1. **Read the subject.** Open the real artifact, content, assets, and code before forming an opinion. Collect what the product is, who uses it, the one thing a visitor must do or understand, and what is fixed.
2. **Name the default, then refuse it.** Write one line describing the page you would produce on autopilot (for example: "centered hero, badge, gradient headline, three icon cards, logo row"). That line is the list of things that now need a reason to exist.
3. **Set the direction.** Mine the subject's own world for material, then write a short thesis and one signature element. Produce three structurally different options and do not take the first one by default. See [art-direction.md](references/art-direction.md).
4. **Build the system before the screens.** Decide type scale, spacing scale, color roles, radius, border, and elevation as tokens, then compose with them. Start from [foundation.md](references/foundation.md). One-off values are how inconsistency enters.
5. **Compose from the content.** Give each section the form its information has: a table for comparison, a sequence for steps, a figure for evidence, prose for an argument. See [layout.md](references/layout.md).
6. **Write the words.** Real, specific copy is design material. Replace stock phrases and invented proof before styling them. See [copy.md](references/copy.md).
7. **Render and inspect.** Open the result in a browser at narrow, middle, and wide sizes, with real content, loaded fonts, and every affected state. Reading code does not verify a design. See [review-loop.md](references/review-loop.md).
8. **Scan the source.** Run the bundled scanner over changed files and resolve or justify every hit:

   ```bash
   node scripts/slop-scan.mjs path/to/src
   ```

   It finds candidates, not verdicts, and it cannot see composition. A clean scan does not mean a good design.
9. **Detail pass.** Zoom in. Fix alignment, wrapping, crops, states, and edges until a second look finds nothing. Then run the tests below once more.

## Hard bans

Do not introduce any of these. Remove them from the scope being changed unless the user explicitly asked for that exact motif. Full list with replacements: [slop-catalog.md](references/slop-catalog.md).

- **Structure:** the hero-badge-headline-two-buttons-logo-row opener; three or four identical "icon, title, two lines" cards; the fixed hero → logos → features → stats → testimonials → pricing → FAQ → gradient CTA sequence used without regard to content; cards nested in cards; bento grids used as a default.
- **Type:** gradient text; one italic serif word in a sans headline; an uppercase letter-spaced eyebrow above every heading; centered paragraphs; Title Case On Every Heading; text too light or too small to read.
- **Color:** purple, indigo, or blue-to-pink gradients; default framework indigo or violet as brand color; neon on near-black; a rainbow of pastel category tints; colored glows and colored shadows.
- **Surfaces:** glassmorphism and backdrop blur as style; gradient borders, border beams, top or side accent stripes; blobs, aurora and mesh backgrounds, dot grids, grain overlays, orbit rings, particles; the same large radius and large shadow on every box; border and shadow stacked on everything.
- **Components:** tinted icon bubbles; pill badges such as "New" or "AI-powered"; decorative dots and fake status LEDs; fake browser chrome and traffic lights; avatar stacks, star ratings, and stat rows with invented numbers; sparkle icons for anything involving AI; emoji as icons.
- **Copy:** unlock, supercharge, seamless, effortless, elevate, empower, revolutionize, next-generation, all-in-one; three-fragment taglines; "Get started" beside "Learn more"; invented testimonials, customers, metrics, and people.
- **Motion:** fade-up on scroll for every block; hover scale or lift on every card; bounce and elastic easing; count-up numbers; typewriter headlines; looping float, pulse, or shimmer; scroll hijacking.
- **Imagery:** 3D blobs and gradient orbs; flat-vector office people; stock handshakes and laptops; generated images passed off as product; a fabricated dashboard as the hero.

**Functional marks stay.** A labeled status indicator, chart series, map point, focus ring, selected state, progress bar, table rule, or quiet container border carries information. Keep it, and make sure color is not its only cue. The test is removal: if deleting the element loses information, grouping, control, or an approved brand expression, it stays; otherwise it goes. Calling filler "brand texture" does not change the result of the test.

## The standard

Hold the finished work to these. Numbers are starting points for Latin text on screens; check them against the real font and script.

| Area | Finished means |
| --- | --- |
| Hierarchy | One focal point per view. Squinting at the page still shows what matters first, second, third. |
| Type | At most two families, a fixed scale, body 16px or larger with 1.5 to 1.65 line height, 45 to 75 characters per line, headings balanced with no orphan word. |
| Spacing | Every gap comes from the scale. Space inside a group is smaller than space between groups, everywhere. |
| Color | Neutrals carry most of the page, one accent has one job, text meets contrast, each color has a named role. |
| Surfaces | One radius family, one elevation logic, one border weight. A box exists only when it groups something. |
| Alignment | Few shared edges, all exact. Icons and text are optically centered, numbers align in columns. |
| Content | Every claim true, every name and number real or clearly labeled as sample, every image chosen and cropped on purpose. |
| States | Hover, focus, pressed, disabled, loading, empty, and error exist where they apply and do not shift layout. |
| Responsive | No overflow, clipping, or cramped text from 320px wide to very wide; the narrow layout is designed, not collapsed. |

## Tests before delivery

| Test | How | Fails when |
| --- | --- | --- |
| Swap | Replace the product name and logo with a competitor's, or with a different industry's | Nothing else would have to change |
| First idea | Compare against the default named in step 2 | The result is that default with nicer colors |
| Removal | Delete each decorative element in turn | Nothing was lost, so it should not exist |
| Squint | Blur or shrink the screenshot to a thumbnail | No clear first read, or everything has equal weight |
| Grayscale | Remove color | Hierarchy and states disappear |
| Reason | Point at any visible choice | The only answer is "it looked nice" or "that is how these pages look" |
| Real content | Insert the longest real title, name, number, and translation | Layout breaks or text is cut |

## Common failures

| Failure | Correct move |
| --- | --- |
| Purple template becomes beige-and-serif template | Derive type, color, and structure from this subject; show the link in one sentence |
| Everything deleted in the name of minimalism | Keep information, grouping, state, and contrast; remove only what fails the removal test |
| A banned stripe returns as an animated outline | Remove the motif, not its first implementation; check pseudo-elements, SVG, backgrounds, and hover styles |
| "Character" added as more effects | Character comes from composition, type, and true content; effects are last and usually unnecessary |
| Ornament removed, defaults left in place | A page with default font, palette, and card grid is still slop after the dots are gone |
| Product UI styled like a marketing page | Tools need density, stable layout, and familiar controls; expression goes into type, color, and data design |
| "Pixel-perfect" claimed from unrendered code | Report what was rendered and inspected; mark the rest Not run |

## Completion evidence

Deliver when the changed scope passes the tests above, has no hard-banned element without an explicit request, uses only tokens, and holds real content at every inspected size. Fix major craft defects rather than listing them.

Report briefly: the direction and why it follows from the subject, what was removed, what was rendered (sizes, states, languages), scanner result, and anything left open. Use **Verified** for observed results, **Inferred** for reasoned conclusions, **Assumed** for missing context, and **Not run** for checks that did not happen. A static recommendation proves nothing about responsive, keyboard, or screen-reader behavior.

## References

| Need | Read |
| --- | --- |
| Find or remove a specific slop pattern, with its replacement | [slop-catalog.md](references/slop-catalog.md) |
| Establish a direction and a signature from the subject | [art-direction.md](references/art-direction.md) |
| Choose and set type; scale, measure, tracking, wrapping | [typography.md](references/typography.md) |
| Build a palette, neutrals, dark theme, contrast | [color.md](references/color.md) |
| Structure a page, section rhythm, grids, density | [layout.md](references/layout.md) |
| Radius, borders, shadows, depth, component finish | [surfaces.md](references/surfaces.md) |
| Photography, illustration, product shots, icons | [imagery-icons.md](references/imagery-icons.md) |
| Headlines, CTAs, proof, microcopy, Georgian copy | [copy.md](references/copy.md) |
| Georgian and mixed-script typography | [multilingual.md](references/multilingual.md) |
| Dashboards, tables, forms, and app screens | [product-ui.md](references/product-ui.md) |
| Token set and base CSS; undoing Tailwind and component-kit defaults | [foundation.md](references/foundation.md) |
| Render, inspect, scan, and report | [review-loop.md](references/review-loop.md) |

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
