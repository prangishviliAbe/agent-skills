---
name: anti-ai-slop-design
description: >-
  Create, refine, implement, or critique distinctive visual design for websites, landing pages,
  product interfaces, dashboards, and brand-led UI so the result looks specific to its subject
  instead of like a template: art direction, typography, color, layout composition, imagery, copy,
  and polish. Use whenever the user wants a design to look better, less generic or "AI-looking",
  more premium or on-brand, a page or component designed from scratch, or an existing UI judged
  on how it looks, including Georgian and multilingual layouts. Works from the real brief,
  content, and brand, keeps approved brand choices and accessibility, and delivers rendered,
  inspected results instead of descriptions.
---

# Anti AI Slop Design

Produce intentional, specific, buildable visual work. "Slop" is what you get when every decision is the most probable one: the same fonts, gradients, card grids, and hero. Convention is not the flaw; unconsidered convention is. A quiet interface and an expressive one can both be excellent.

## Why generic output happens, and what works against it

Defaults come from habit, not from the brief. Banning a list of patterns fails, because the escape routes become defaults too (warm cream with terracotta, an italic serif accent word in every headline, tiny uppercase eyebrow labels, hairline-ruled "editorial" columns). What works is **specificity before aesthetics**: derive each major choice from the subject, audience, content, and brand, and make the choice survive a test.

## How to work

1. **Start from the subject.** Gather the audience, the real content, the brand rules, the constraints, and the languages. Preserve supplied brand identity, approved references, and working components; they outrank any taste of yours.
2. **Write a thesis and signature decisions.** One or two sentences linking audience and content to visible qualities, then 3 to 5 decisions that carry it (type, color logic, layout structure, image treatment, one memorable detail). For a local edit reuse the existing direction ([visual-thesis.md](references/visual-thesis.md)).
3. **Run a default audit.** List what you would produce on autopilot: font, palette, hero, section pattern, icons, motion, copy tone. Keep each item only with a reason tied to this project; replace the rest ([slop-catalog.md](references/slop-catalog.md)).
4. **Apply the swap test.** If the name and logo were replaced by a competitor's and the page still worked, identity is not doing any work. Fix it through composition, type, imagery, and copy, not by decorating.
5. **Let content set the hierarchy.** Decide what matters most, then compose around it. Equal cards suit comparable items, not unequal priorities ([composition.md](references/composition.md)).
6. **Write the words as design.** Specific claims, real evidence, no invented proof ([copy.md](references/copy.md)).
7. **Build the system, then the details:** type roles, color roles, spacing, surfaces, states ([craft.md](references/craft.md), [css-craft.md](references/css-craft.md), [imagery-and-assets.md](references/imagery-and-assets.md)).
8. **Render and look.** Build it, view it at phone, tablet, and desktop widths with real long content, critique what you see, fix, and look again once. A description of a design is not a design; screenshots plus measured contrast and keyboard checks are evidence.
9. **Keep evidence honest.** No fabricated testimonials, logos, metrics, customers, or product screenshots. Label sample data and conceptual imagery.

## Procedure

1. Inspect the brief, existing implementation or design, assets, content, audience, and languages. Name what is fixed and what may change. Do not infer language or culture from a file path.
2. Find the real weakness: unclear content or hierarchy, or weak execution. Preserve what works.
3. Choose direction at the right scale (thesis for new work, reuse for edits).
4. Compose by hierarchy, define the vocabulary, run the default audit and swap test.
5. Implement in the project's stack and asset workflow. Explain material cost before a design depends on heavy assets or dependencies.
6. Render, inspect, and test content extremes, themes, and languages ([multilingual.md](references/multilingual.md) for Georgian and non-Latin).
7. Review with [review.md](references/review.md), fix, and report briefly: the decisions, the checks that ran, and the limits.

## Reference map

| When the task involves | Read |
| --- | --- |
| Establishing or comparing directions | [visual-thesis.md](references/visual-thesis.md) |
| Diagnosing generic patterns and choosing replacements | [slop-catalog.md](references/slop-catalog.md) |
| Typography, color, space, surfaces, icons, accessibility of visual choices | [craft.md](references/craft.md) |
| Layout recipes, hierarchy, rhythm, hero alternatives | [composition.md](references/composition.md) |
| Headlines, CTAs, claims, proof, bilingual copy | [copy.md](references/copy.md) |
| Imagery, illustration, icons, generated assets, data as imagery | [imagery-and-assets.md](references/imagery-and-assets.md) |
| CSS for tokens, fluid type, color, contrast measurement | [css-craft.md](references/css-craft.md) |
| Georgian, non-Latin scripts, RTL, localization | [multilingual.md](references/multilingual.md) |
| Visual critique, evidence limits, prioritization | [review.md](references/review.md) |

## Decision test

For any choice in doubt ask: what does it help someone understand, do, recognize, or feel? Does it fit the supplied brand and content and stay usable? Would changing it improve the composition enough to justify the change? Shared conventions support usability; judge distinctiveness across the whole composition, not per control.

## Failure modes

| Failure | Correct move |
| --- | --- |
| Removing an approved purple gradient because it looks generated | Keep the brand choice; fix hierarchy, contrast, or execution |
| Replacing every default with the current "anti-default" look (cream, serif italic, mono labels) | Derive from the subject; the swap test applies to your replacements too |
| Adding effects to compensate for weak content | Sharpen the message and evidence first |
| Replacing every card grid with asymmetry | Equal units for comparable items, hierarchy where priorities differ |
| Shrinking or fading text to feel refined | Fix measure, spacing, and emphasis at readable contrast |
| Redesigning familiar controls to be unique | Put distinction in composition, type, imagery, and copy |
| Invented testimonials, logos, metrics, product shots | Use real material or label a concept clearly |
| Judging quality by counts of fonts or radii | Check consistent roles and visible outcomes |
| Describing a design without rendering it | Build, screenshot at three widths, critique, fix |

## Definition of done

- [ ] The result follows the user's direction and keeps required content and brand constraints.
- [ ] Major choices have a stated role; convention and expression are used on purpose, and the swap test passes.
- [ ] Hierarchy, measure, grouping, and action prominence work with realistic content.
- [ ] Tokens and recurring treatments are coherent; exceptions have a reason.
- [ ] Compact layouts, content extremes, fonts and asset fallbacks, and relevant states were rendered and inspected or specified.
- [ ] Contrast, focus, scaling, and target size are measured or specified without unsupported conformance claims.
- [ ] Evidence, sample data, and conceptual imagery are distinguishable.
- [ ] The artifact is delivered with a concise rationale and explicit verification limits.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
