# The slop catalog

Read during the slop pass. Each entry: the pattern, why it reads as generated, and what to do instead. The replacement is never "the same thing but subtler" — it is a different kind of decision.

## Layout and composition

| Pattern | Why it fails | Replace with |
| --- | --- | --- |
| Centered hero: huge claim, subtitle, two buttons, floating mockup | It is the default template of a decade of SaaS pages. It says nothing about this product | Lead with the product's actual evidence: the real interface, the real object, the real result, a specific number, or a specific sentence only this company could write |
| Everything centered, top to bottom | Centering removes the alignment edge the eye scans by, so nothing gains emphasis | Use a strong left edge for text-heavy content; reserve centering for short, genuinely symmetric blocks |
| Three or six equal cards, icon on top | Equal weight means no priority. The grid decided the content, not the other way around | Let content sizes differ. One lead item with detail plus smaller supporting items communicates a hierarchy |
| Identical vertical padding between every section | The page reads as a stack of unrelated blocks with no grouping | Vary rhythm: tight between related blocks, generous at real topic changes. Spacing is a grouping signal |
| Card inside card inside card | Nested borders add visual noise and no structure | One boundary per meaningful object. Group internally with spacing and type |
| A section for every noun ("Features", "Benefits", "Why us", "How it works") | Four sections restating one idea | Merge them. Say the thing once, with the strongest evidence |
| Full-width everything, edge to edge | No measure control; text lines become unreadable on wide screens | Constrain measure; use full width deliberately for media or an intentional break |

## Color and surfaces

| Pattern | Why it fails | Replace with |
| --- | --- | --- |
| Purple-to-blue gradient | The single most recognizable generated-design signature | A committed palette derived from the brand, the product's material world, or its content. If a gradient is right, make it specific and directional |
| Glassmorphism as generic "premium" | Costs legibility and contrast, communicates nothing about the product | Solid tonal surfaces with a real hierarchy. Use translucency only when depth is genuinely meaningful — content moving behind a fixed layer |
| Glowing blurred blobs behind sections | Decorative fog with no meaning, and it drags contrast down | Nothing, or a shape derived from the brand mark, the product's geometry, or its data |
| Dark mode as "premium" with #000 and neon accents | Pure black plus saturated accents creates halation and eye strain | A dark canvas near #0e1013–#16181d, desaturated accents, deliberate elevation through tonal steps |
| Six accent colors across one page | No color carries meaning when every color is used | One accent for action, a neutral ramp for everything else, and semantic colors reserved for status |
| Gradient text on every heading | Reduces contrast and legibility to add nothing | Solid text. If emphasis is needed, use size, weight, or position |
| Shadows on everything, at multiple blur values | Visual mud, and it flattens actual hierarchy | Two or three elevation levels, each with a defined meaning |

## Typography

| Pattern | Why it fails | Replace with |
| --- | --- | --- |
| 72px heading in a 480px container | Every heading breaks into ugly two-word lines | Size the type to the measure. Test the longest real heading |
| Six weights and eight sizes | Reads as accumulation, not as a system | Two families at most, three to five roles, real contrast between them |
| Uppercase micro-labels everywhere | Borrowed from Latin editorial design, applied without reason, and hostile to non-Latin scripts | Sentence case at a smaller size with a muted color, or a genuine label style used sparingly |
| Body text at 300 weight in light gray | Fails contrast and disappears on most screens | 400–450 weight, AA contrast against the real background |
| Letter-spacing applied to body text | Hurts reading speed; the spacing was designed by the typeface's designer | Adjust tracking only on large display type and uppercase, and only slightly |
| Prose lines running 120+ characters | The eye loses its place returning to the next line | Constrain to roughly 45–75 characters |

## Imagery and illustration

| Pattern | Why it fails | Replace with |
| --- | --- | --- |
| Stock smiling people in a bright office | Zero information, immediately recognizable as filler | The actual product, the actual work, the actual people, or nothing |
| Generic 3D renders: floating spheres, glossy shapes, abstract crystal | The visual equivalent of "innovative solutions" | Something specific: a real artifact, a diagram that explains a mechanism, a photograph with context |
| Fake dashboards and invented charts | Dishonest, and readers recognize it | The real interface with real (or clearly labeled sample) data, cropped to the part that matters |
| Isometric illustration of tiny people with laptops | The most-used generic illustration style in software marketing | A treatment tied to the brand: a consistent line weight, a limited palette, a recurring metaphor drawn from the product's domain |
| An image in a slot because the slot exists | The layout is driving the content | Cut the slot, or give the image a job: evidence, atmosphere, instruction, or recognition |
| Plastic AI-generated faces and warped hands | Uncanny and untrustworthy | Real photography, abstraction, or type-driven composition |

## Motion

| Pattern | Why it fails | Replace with |
| --- | --- | --- |
| Every element fades up on scroll | The page becomes a slideshow; nothing is emphasized because everything moves | Reveal one focal group. Let the rest simply exist |
| Perpetual floating and pulsing | Continuous motion with no state change is visual noise and drains battery | Motion tied to interaction or state change |
| Parallax on every layer | Costs performance, causes motion discomfort, adds no meaning | One deliberate depth relationship, if any |
| Counting-up statistics on scroll | Draws attention to numbers that are usually invented | Show the number. If it is real, cite it |
| A 1.5s staged intro before content is readable | Delays the user's actual goal | Content first, motion as enhancement |

## Content and copy

| Pattern | Why it fails | Replace with |
| --- | --- | --- |
| "Transform your workflow with our innovative platform" | Says nothing; applies to any product ever made | The specific verb and the specific object: what it does, for whom, instead of what |
| Invented statistics and "trusted by thousands" | Fabricated evidence, and readers assume it | A real number with a source, or no number |
| A logo wall of companies you do not work with | Dishonest and legally risky | Real customers with permission, or a different form of credibility |
| Testimonials with generic names and stock portraits | Recognizable as fake, and it poisons trust in the real content | Real quotes, or none |
| "Get started" on every button | The user cannot tell what happens next | Name the outcome: "Create a free workspace", "See the pricing", "Book a 20-minute call" |
| Feature lists of nouns with no verbs | Nothing is demonstrated | Show the mechanism or the result |

## Detail and finish

| Pattern | Why it fails | Replace with |
| --- | --- | --- |
| Mixed radii: 4px buttons, 24px cards, 9999px chips, arbitrarily | Reads as assembled from different sources | A radius logic tied to element size, stated once |
| Icons from three different sets | Different stroke weights and grids look accidental | One set, one weight, one optical size |
| Borders that are sometimes 1px gray and sometimes 2px black | Inconsistency the eye registers as sloppiness | Two border tokens, each with a stated purpose |
| Emoji as interface icons | Renders differently on every platform and reads as a placeholder | Real icons from the chosen set |
| Off-scale spacing (13px, 27px, 42px) | Accumulated nudging rather than a system | Every gap from the spacing scale |
| A focus style removed because it "looked bad" | Makes the product unusable by keyboard | Design a focus ring that fits the brand and keeps 3:1 contrast |

## How to use this catalog

- Recognizing a pattern is not the same as fixing it. Reducing an effect's opacity keeps the wrong decision at lower volume.
- A pattern here is not banned; it is *unearned by default*. Glass, gradients, and 3D are all fine when the brief calls for them and the execution is specific and controlled.
- After removing something, check that the structure still reads. If the section becomes obviously empty, the decoration was covering a content problem — solve that instead.
