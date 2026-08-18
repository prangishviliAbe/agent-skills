---
name: anti-ai-slop-design
description: Create, implement, or critique refined, human-quality digital product design while preventing generic AI-looking output. Use for websites, landing pages, SaaS products, dashboards, mobile apps, UI components, design systems, wireframes, Figma work, frontend styling, visual direction, brand-led interfaces, and image or illustration direction where hierarchy, brand specificity, restraint, accessibility, responsive behavior, and implementation realism matter. Trigger on requests to design, redesign, polish, modernize, beautify, review, or implement an interface, especially when the result risks template-like SaaS layouts, decorative excess, fake-premium styling, stock-feeling imagery, or generic generated visuals.
---

# Anti AI Slop Design

Produce intentional, brand-specific, buildable design whose quality comes from structure, typography, content, and interaction — not from accumulated effects.

"Slop" is not a visual style. It is **decoration substituting for decisions.** A restrained minimal page can be slop; a loud maximalist page can be excellent. The test is whether each choice is traceable to this product, this content, and this audience.

## Operating rules

1. **Every visual choice must be defensible.** If the only answer to "why is this here?" is "it looks nice", remove it or replace it with something that carries meaning.
2. **Structure first, always.** Content order, hierarchy, and grouping are settled before color, type, or effects. Decoration cannot repair a weak structure — it only hides it from you.
3. **Do not flatten an expressive brief.** Playful, maximalist, brutalist, glassy, futuristic, and editorial directions are all legitimate. Execute the requested direction with discipline. Only push back when a choice genuinely harms usability or accessibility, and say which.
4. **Specificity over defaults.** A design that could be swapped onto a different company's product without anyone noticing has failed, regardless of how polished it is.
5. **Real content, real length.** Design against the longest name, the empty state, the missing image, the 300-word bio, and the translated string.
6. **Do not simulate evidence.** No invented metrics, fake testimonials, fictional logo walls, or plausible-looking dashboards that show nothing real. Use honest placeholders and say they are placeholders.
7. **Accessibility is part of the craft.** AA contrast, visible focus, and adequate targets are baseline, not a compromise applied afterwards.
8. **Buildable or it is not a design.** No fragile pixel choreography, no dependency added for one effect, no layout that collapses under real data.

## Procedure

1. **Read the brief for constraints and character:** product, audience, device priority, primary action, brand traits, existing system, technical stack, and required content.
2. **Solve the structure.** Section order, content groups, hierarchy, and the one primary action per view. Delete sections that exist only because "landing pages have them".
3. **Form a visual thesis** — one sentence stating why this product looks the way it does, drawn from its content, environment, materials, history, or audience. See [visual-thesis.md](references/visual-thesis.md).
4. **Set a small system**: type roles, color roles, spacing scale, radius, border and elevation logic, icon style, imagery treatment, motion character. Keep the number of variables small enough to feel authored.
5. **Design the real states and the real breakpoints**, not one hero composition.
6. **Run the slop pass** against [slop-catalog.md](references/slop-catalog.md). Replace, do not merely dim.
7. **Run the craft pass** on typography, color, spacing, and detail. See [craft.md](references/craft.md).
8. **Verify** with the final gate below and state the thesis in the delivery.

## Reference map

| When the task involves | Read |
| --- | --- |
| Finding a specific direction instead of a default one | [visual-thesis.md](references/visual-thesis.md) |
| Identifying and replacing generic AI patterns | [slop-catalog.md](references/slop-catalog.md) |
| Typography, color, spacing, surfaces, icons, imagery | [craft.md](references/craft.md) |
| Georgian, non-Latin scripts, and multilingual layout | [multilingual.md](references/multilingual.md) |
| Reviewing or critiquing existing visual work | [review.md](references/review.md) |

Pair with `ui-ux` for flows and product logic, `premium-web-motion` for the motion layer, and `web-development` for implementation.

## The three-question test

Apply to every element on the page. Anything that fails twice is removed.

1. **What does this communicate** that would be lost without it?
2. **Why this form** and not the obvious default?
3. **Would a competitor's page look wrong** with this element on it? (If not, it is not specific to you.)

## Fastest tells of AI-generated design

If three or more are present, the design is generic regardless of polish:

- Purple-to-blue gradient anywhere near the hero
- A centered hero with an oversized claim, a subtitle, two buttons, and a floating "dashboard" mockup
- Three or six equal cards, each with an icon on top, a bold heading, and two lines of copy
- Glass panels, soft glow, blurred blobs, and floating particles used as generic "premium"
- Every section separated by the same vertical padding, in the same centered rhythm
- Icons beside every heading, badges on every card, gradient text on every emphasis
- Invented statistics ("10,000+ happy customers"), fake logo walls, and stock smiling faces
- Everything fades in on scroll, at the same distance and the same duration
- Text sized for a poster, in a container narrow enough to break every heading awkwardly

## Failure modes and the correct move

| Failure mode | Correct move |
| --- | --- |
| Adding a gradient to make a flat section "interesting" | Fix the hierarchy: the section is boring because the content is undifferentiated |
| Wrapping everything in cards | Use a card only when the boundary helps compare, scan, select, or act |
| Reaching for a shadow to separate elements | Use spacing, a tonal surface, or a single hairline first |
| Six font weights across a page | Two or three roles with real contrast between them |
| A hero image chosen because the slot is empty | Cut the slot, or find an image that carries evidence or atmosphere |
| Uniform 96px padding between all sections | Vary rhythm to signal relationship and hierarchy |
| "Modern and clean" as the direction | State the thesis in one concrete sentence |
| Reducing opacity to fix a garish effect | Delete the effect; a faint mistake is still a mistake |

## Final gate

- [ ] The visual thesis can be stated in one sentence, and the page visibly follows it.
- [ ] Hierarchy reads before any decoration is noticed.
- [ ] Every section and element survives the three-question test.
- [ ] Type, color, spacing, radius, border, icon, and elevation all come from one small system.
- [ ] The design holds with real content, long strings, empty states, and translated text.
- [ ] AA contrast, visible focus, and adequate touch targets verified on the real rendered colors.
- [ ] Compact layout designed, not derived by shrinking.
- [ ] Nothing decorative is compensating for a structural weakness.
- [ ] The result would look wrong on a competitor's site.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
