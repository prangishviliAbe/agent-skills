# Slop catalog

Read when: Auditing a design for generated-looking patterns, or checking that a new design does not contain them.

Every entry is a default: the thing produced when nobody decided. Each has a replacement that requires a decision. Replacing one entry with another entry from this file is not a fix.

## How to audit

1. Inventory what is on screen, including pseudo-elements, SVG strokes, background images, shadows, and hover and focus styles. Ornament often lives outside the markup.
2. For each item, record: what it is, whether it carries information, and the action (keep, fix, remove, replace).
3. Fix in this order: structure, content, type, color, surfaces, motion. Polishing the shadow on a card that should not exist wastes the pass.

```text
Element                         Carries information?            Action
Purple logo                     Approved identity               Keep
Hero "New · AI-powered" pill    No                              Remove
Three icon cards                Yes, but unequal importance     Replace: one lead feature + two-row list
Colored dot on each card        No                              Remove span and ::before
Dot beside "Delayed"            Yes, labeled state              Keep; add icon shape as second cue
"Trusted by 10,000+ teams"      Unsourced                       Remove
Card hover lift                 Cards are not clickable         Remove
Table row rules                 Aids scanning                   Keep, lighten
```

## Page structure

| Tell | Why it reads as generated | Do instead |
| --- | --- | --- |
| Centered hero: pill badge, huge headline, gray subhead, primary and ghost button, logo row | The single most common generated opener | Lead with the thing itself: the product working, the object, the offer, the first task. Pick alignment from the content, and drop any of the five parts that has nothing to say |
| Fixed sequence: hero, logos, features, stats, testimonials, pricing, FAQ, CTA band, four-column footer | A template filled in, not an argument | Outline what a visitor needs to believe or do, in order. Include only sections that have real content. Three strong sections beat nine empty ones |
| Three or four identical cards: icon, bold title, two gray lines | Forces unequal ideas into equal boxes | Rank the ideas. One gets space and evidence; the rest become a compact list, a table, or disappear |
| Zigzag rows: text left and image right, then mirrored, repeated | Rhythm by rote | Vary form with the content: a full-width figure, a two-column comparison, a quoted detail, a dense spec list |
| Bento grid as the default feature layout | Fashion applied without regard to content | Use a mosaic only when tiles differ in kind and importance; otherwise a list or table |
| Everything inside a card; cards inside cards | Boxes substitute for hierarchy | Group with spacing and alignment first. Add a container only when content needs separating from a different background |
| Every section the same width, same padding, centered | No pacing | Set two or three section rhythms (tight, standard, open) and use them to mark importance |
| Stats row: four big numbers with small labels | Usually invented, always interchangeable | Use one true number in a sentence that explains why it matters, or none |
| Gradient CTA band before the footer repeating the hero | Padding | End on the next real step, with the information needed to take it |
| Pricing with three tiers and a glowing "Most popular" middle column | Template | Show the real plans. Emphasize one only if there is a true recommendation, and do it with position and weight |
| FAQ accordion of questions nobody asked | Filler that restates the page | Answer real objections where they arise in the page, or list actual support questions |

## Typography

| Tell | Why | Do instead |
| --- | --- | --- |
| Inter, Geist, Poppins, Roboto, or the system stack chosen without thought | Fine fonts, zero signal | Choose a face for a stated reason (tone, script coverage, numerals, brand). An ordinary face is acceptable when it is a decision and the typesetting is excellent |
| The "tasteful" swap: Playfair or Instrument Serif headline, one word italic | The second most common default | If a serif fits the subject, set whole headlines in it and use italic for meaning, not decoration |
| Space Grotesk, monospace labels, bracketed tags to signal "technical" | Costume | Show technical substance: real commands, real output, real specs |
| Gradient-filled headline text | Instant tell; hurts legibility | Solid color. Emphasis through weight, size, or position |
| Tiny uppercase tracked eyebrow above every heading | Automatic, says nothing | Keep a label only where it orients (a category, a step, a date). Otherwise remove |
| Centered body paragraphs | Ragged both edges; hard to read beyond three lines | Left-align running text (start-align for other scripts) |
| Five or more font sizes with small differences | No scale | A fixed scale with clear steps; neighbors differ by at least about 1.2 times |
| Hierarchy through size alone | Flat | Change two properties between levels: size and weight, or size and color |
| Light gray text on white, or 12 to 13px body | Mistaken for elegance | Body at 16px or more, contrast at least 4.5:1 |
| Tight negative tracking on all text, or loose tracking on lowercase | Applied by recipe | Track large display sizes slightly tighter, small all-caps slightly looser, body not at all. See typography.md |
| Title Case On Every Heading and Button | Reads as machine English | Sentence case, unless the brand's style guide says otherwise |
| Headline wrapping with one word on the last line | Unfinished | Balance wrapping, adjust measure or size, check at every width |
| Straight quotes, hyphens for ranges, three dots | Unfinished | Proper quotation marks for the language, en dash for ranges, ellipsis character |

## Color

| Tell | Why | Do instead |
| --- | --- | --- |
| Purple, violet, or indigo primary; blue-to-purple or purple-to-pink gradient | The signature generated palette | Derive the accent from the subject (see color.md). If the brand truly is purple, use it flat and sparingly |
| Framework default palette shipped unchanged (indigo-600, slate-900, zinc) | Says "starter kit" | Define the project's own neutrals and accent as tokens |
| Near-black page with neon cyan, green, or magenta | "Developer tool" costume | Dark themes need tinted dark neutrals, restrained chroma, and one accent |
| Cream background, terracotta or forest accent, serif | The anti-slop template | Same rule: derive from the subject, or it is the same mistake in a nicer coat |
| Pure untinted grays next to a saturated accent | Lifeless, disconnected | Tint neutrals slightly toward the brand hue |
| A different pastel tint for each card or category | Decoration posing as coding | One accent. Categories differ by label and position unless color truly encodes data |
| Gradient on buttons, cards, icons, and backgrounds | Gradient as default fill | Flat fills. A gradient needs a physical or brand reason and appears once |
| Colored glow or colored drop shadow | Neon effect | Neutral shadow from one light direction, or none |
| Gray text on a colored background | Muddy, fails contrast | Use a tint or shade of the background hue, or white or near-black with checked contrast |
| Meaning carried by red and green only | Fails for many users | Add an icon, label, or position |

## Surfaces and effects

| Tell | Why | Do instead |
| --- | --- | --- |
| Glassmorphism: translucent panels with backdrop blur | Effect without function; expensive; hurts contrast | Opaque surfaces. Blur is acceptable only behind a bar that scrolls over content, kept subtle |
| Gradient border, animated border beam, conic outline | Ornament | A single quiet border, or none |
| Colored stripe on the top or left edge of a card or callout | Classic generated callout | Distinguish by background tone, icon plus label, or placement |
| Short accent line under a heading | Flourish | Remove; let spacing do the work |
| Blurred color blobs, aurora, mesh gradient, radial spotlight behind the hero | Atmosphere in place of content | A plain surface, a real image, or a graphic that depicts the subject |
| Dot grid, graph paper, or grain overlay on the page | Texture as filler | Remove, unless it is the brand's established material |
| Orbit rings, particles, floating shapes, beams | Decoration | Remove |
| `rounded-2xl shadow-lg border` on every box | One recipe everywhere | Choose a radius family and one depth logic. See surfaces.md |
| Border and shadow together on resting cards | Double containment | Pick one. Borders for flat systems, shadow for things that truly float |
| Large soft shadow under everything | No elevation meaning | Shadow only on elements above the page: menus, dialogs, dragged items |
| Inner glow, top highlight streak, bevel | Skeuomorphic garnish | Remove unless the whole system is deliberately material |
| Wavy or slanted SVG section dividers | Template | A change of background tone or simply space |

## Components

| Tell | Why | Do instead |
| --- | --- | --- |
| Icon in a tinted rounded square above each card title | Filler in a costume | Drop the icon, or use one only where it speeds recognition, at text size, inline with the label |
| Pill badge above the hero: "New", "Introducing", "AI-powered" with an arrow | Automatic | Remove. If there is real news, state it in a sentence with a date |
| Decorative colored dot, pulsing "live" dot, three traffic-light circles | Fake signal | Remove. Real status gets a label and a second cue |
| Fake browser window or device frame around a screenshot | Costume | Show the screenshot cleanly cropped to the relevant region, with a caption |
| Fabricated dashboard hero: sidebar, four KPI cards, gradient area chart | Not the product | A true capture of the real product, or a diagram honestly labeled as one |
| Avatar stack with "+2k", five stars and "4.9/5", "Loved by developers" | Invented proof | Named, real, sourced evidence, or none |
| Logo row of companies that are not customers | False | Only logos with permission |
| Testimonial cards with stock names and titles | Invented | A real quote with name, role, and company, or cut the section |
| Two buttons everywhere: filled "Get started" and ghost "Learn more" | Reflex | One primary action named for what happens. A second only when it is a real alternative, styled as a link |
| Gradient pill button with glow and trailing arrow | Overdressed | A solid button with a specific label; arrow only for navigation |
| Sparkle, wand, or robot icon for anything AI | Cliché | Name the capability in words |
| Emoji as bullets, icons, or heading decoration | Chat-output habit | Text, or the project's icon set |
| Green check bullet lists of adjectives | Feature soup | Fewer, concrete statements in a plain list |
| Monthly/yearly toggle with "Save 20%" chip | Template | Show real pricing structure |
| "Welcome back, name" with waving hand | Filler header | Start with what changed since the last visit |
| KPI card row: icon, number, green "+12%" | Template dashboard | Show the few measures that drive decisions, with comparison and period stated. See product-ui.md |
| Cartoon illustration for every empty state | Decoration | One sentence and the action that fills the state |
| Modal for everything, toast for everything | Reflex | Inline first; dialog only for a focused interruption |

## Copy

| Tell | Why | Do instead |
| --- | --- | --- |
| Unlock, supercharge, elevate, empower, streamline, seamless, effortless, revolutionize, reimagine, unleash, next-generation, cutting-edge, world-class, all-in-one, robust, powerful | Words that fit any product | Say what it does, for whom, with a number or example. See copy.md |
| "Build faster. Ship smarter. Scale further." | Three-fragment cadence | One sentence with a subject, verb, and fact |
| "It's not just X, it's Y", "Where X meets Y", "X, reimagined", "Say goodbye to X" | Stock frames | State the claim directly |
| "Your all-in-one platform for..." | Category filler | Name the job in the user's words |
| "Whether you're a startup or an enterprise..." | Avoids choosing an audience | Address the actual audience |
| "Trusted by 10,000+ teams", "99.9% uptime", "10x faster" without a source | Invented | A sourced figure or nothing |
| John Doe, Jane Smith, Sarah Chen, Acme Corp, lorem ipsum | Placeholder shipped | Real content, or realistic sample data labeled as sample |
| "Get started", "Learn more", "Submit", "Click here" | Says nothing | Verb plus object: "Track a shipment", "See the pricing table" |
| Em dashes in every sentence, rule-of-three lists, exclamation marks | Model cadence | Vary sentence shape; cut the third adjective |
| Headline plus subhead that repeats it in more words | Padding | Subhead adds the specific: how, for whom, by when |

## Motion

| Tell | Why | Do instead |
| --- | --- | --- |
| Every block fades up on scroll, with stagger | Delays reading; identical everywhere | Content visible on load. Animate only a state change that needs explaining |
| Hover scale or lift on every card | Implies interactivity that is not there | Feedback only on real controls: color or border change |
| Bounce, elastic, or overshoot easing on interface elements | Toy-like | Short ease-out; no overshoot for ordinary UI |
| `transition: all 0.3s ease` | Animates layout and everything else, slowly | List properties; 120 to 200ms for feedback |
| Count-up numbers, typewriter headline, text scramble | Withholds information | Show the content |
| Infinite marquee of logos or testimonials | Motion as filler; cannot be read | A static, legible row or list |
| Floating, bobbing, pulsing, shimmering loops | Constant distraction | Motion that ends |
| Parallax layers, cursor followers, magnetic buttons, card tilt, scroll hijacking | Demo effects | Native scroll, stable targets |
| Animated gradient background | Screensaver | Static surface |

## Imagery

| Tell | Why | Do instead |
| --- | --- | --- |
| Glossy 3D blobs, gradient orbs, abstract mesh as hero art | Depicts nothing | Show the product, the place, the object, the people, or the data |
| Flat vector people at desks, isometric scenes | Stock illustration | Photography or drawing made for this subject, or no illustration |
| Stock handshake, laptop-and-coffee, diverse team at a whiteboard | Stock | Real photos of the real thing, even imperfect ones |
| Generated images with wrong hands, melted text, impossible objects | Erodes trust on sight | Do not use; never present generated imagery as documentary |
| Every image the same ratio with the same rounded corners | Grid filler | Crop for the subject; vary scale with importance |
| Gray placeholder boxes or random stock left in delivered work | Unfinished | Supply the real asset or mark the slot clearly as awaiting it |

## Code-level tells

The bundled scanner looks for these. Seeing one is a prompt to check, not proof.

| In the source | Usually means |
| --- | --- |
| `bg-clip-text text-transparent`, `background-clip: text` | Gradient text |
| `from-purple-*`, `to-pink-*`, `#6366f1`, `#8b5cf6`, `#7c3aed` | Default generated palette |
| `backdrop-blur`, `backdrop-filter: blur()` | Glassmorphism |
| `hover:scale-105`, `hover:-translate-y-1` on cards | Decorative hover |
| `transition-all`, `transition: all` | Unconsidered motion |
| `border-l-4`, `border-top: 3px solid` on a card | Accent stripe |
| `animate-pulse`, `animate-ping`, `animate-bounce` | Decorative loop |
| `blur-3xl` on an absolutely positioned colored div | Background blob |
| Many `rounded-2xl` and `shadow-xl` | One recipe on every box |
| `whileInView`, `data-aos`, scroll-reveal classes on most sections | Fade-up everywhere |
| `Sparkles`, `Zap`, `Rocket`, `Wand` icon imports | Filler icons |
| `outline: none` without a `:focus-visible` replacement | Removed focus indicator |
| `100vh` on the hero | Mobile browser chrome cuts content; use `svh` or `dvh` with a fallback |
