---
name: anti-ai-slop-design
description: Create, refine, implement, or critique distinctive visual design for websites, landing pages, product interfaces, and brand-led UI. Use when establishing art direction, polishing typography and composition, or correcting generic template-like output while preserving the requested aesthetic, accessibility, and real content. Focus on visual craft rather than unrelated product or backend changes.
---

# Anti AI Slop Design

Produce intentional, context-specific, buildable visual work. Quality comes from the relationship between content, composition, typography, imagery, and interaction. A quiet interface and an expressive one can both succeed; conventional elements are not evidence of AI authorship.

## Operating rules

1. **Serve the requested direction.** Preserve supplied brand rules, references, required content, and working components. Improve execution within those constraints; do not turn every brief into minimalist editorial design.
2. **Tie major choices to a purpose.** Clarity, recognition, atmosphere, delight, and cultural expression are valid purposes. A utility control need not be unique; concentrate distinction where it adds value.
3. **Diagnose before replacing.** A gradient, centered hero, card grid, pill button, or stock image is not inherently a defect. Change it when it weakens hierarchy, honesty, usability, brand fit, or implementation quality.
4. **Keep evidence honest.** Do not invent endorsements, metrics, testimonials, customer relationships, or product capabilities. Clearly distinguish sample content, conceptual imagery, and real evidence.
5. **Match the effort to the work.** A spacing correction needs a local decision; a new visual identity needs exploration. Do not generate three directions or a complete token system for every small task.
6. **Design for actual content and use.** Test representative long strings, the relevant empty/failure states, compact layouts, and real asset availability. Do not sacrifice reading or operation for a screenshot.
7. **Make accessibility measurable.** Distinguish a visual recommendation from a WCAG failure, and a mockup annotation from a runtime test. Keep contrast, focus, text scaling, and input reachability in the design.
8. **Respect delivery scope.** Use the existing stack and asset workflow where practical. Explain material asset, performance, or dependency costs before making the design rely on them.

## Procedure

1. **Inspect context.** Read the brief, existing implementation/design, brand assets, content, target audience, supported languages, and requested deliverable. Identify what is fixed and what may change. Do not infer language or culture from a filesystem path.
2. **Find the actual weakness.** Separate unclear content or task hierarchy from weak visual execution. Preserve what already works; solve the smallest meaningful set of problems.
3. **Choose direction at the appropriate scale.** For substantial new work, state a concise visual thesis derived from the brand, audience, or material. For local edits, reuse the established direction. Use [visual-thesis.md](references/visual-thesis.md) when a direction is needed.
4. **Compose with meaningful hierarchy.** Decide grouping, alignment, emphasis, density, rhythm, and image purpose. Let the content determine whether equal cards, an asymmetric layout, or another structure fits.
5. **Create or extend a coherent vocabulary.** Define only the necessary type, color, spacing, surface, icon, and motion roles. Keep deliberate exceptions when they solve a real problem. Use [craft.md](references/craft.md).
6. **Check for generic decisions.** Read the relevant parts of [slop-catalog.md](references/slop-catalog.md). Keep, refine, or replace a pattern based on its effect on this work, not its popularity.
7. **Inspect the artifact at realistic sizes.** Verify hierarchy, content extremes, font/asset rendering, contrast, and relevant states. For non-Latin or multilingual work, use [multilingual.md](references/multilingual.md). If a running interface is available, inspect interaction and responsive behavior rather than relying only on screenshots.
8. **Deliver and explain briefly.** Provide the requested artifact, the major visual decisions, relevant validation, and any unresolved assets or limitations. Use [review.md](references/review.md) for critique. Do not bury a small result under an art-direction essay.

## Reference map

| When the task involves | Read |
| --- | --- |
| Establishing or comparing visual directions | [visual-thesis.md](references/visual-thesis.md) |
| Diagnosing generic patterns and choosing replacements | [slop-catalog.md](references/slop-catalog.md) |
| Typography, color, space, surfaces, icons, imagery, visual checks | [craft.md](references/craft.md) |
| Georgian typography, non-Latin scripts, RTL, localization | [multilingual.md](references/multilingual.md) |
| Visual critique, evidence limits, prioritization | [review.md](references/review.md) |

## Decision test

Use these questions where a choice is in doubt, not as a compulsory test for every element:

- What does this choice help someone understand, do, recognize, or feel?
- Does it fit the supplied brand and content, and does it remain usable?
- Would removing or changing it improve the composition enough to justify the change?

Shared conventions support usability. Evaluate distinctiveness at the level of the whole composition and key brand expressions; a recognizable search field is an advantage.

## Failure modes

| Failure | Correct move |
| --- | --- |
| Removing an approved purple gradient because it looks generated | Preserve the brand choice; repair hierarchy, contrast, or execution if needed |
| Adding effects to compensate for weak content | Clarify the message and evidence, then choose effects that serve them |
| Replacing every card with asymmetry | Use equal units for comparable items; use hierarchy when priorities differ |
| Shrinking or fading text to make a layout feel refined | Repair measure, spacing, and emphasis while retaining readable contrast |
| Redesigning familiar controls for uniqueness | Put distinction in composition, typography, assets, and appropriate brand details |
| Fabricated product mockups presented as real | Use the real product or label a conceptual demonstration clearly |
| Removing all atmosphere in the name of utility | Retain expressive choices that support the brief and survive usability checks |
| Declaring quality from the number of fonts, cards, or radii | Check role consistency and visible outcomes rather than arbitrary counts |

## Definition of done

For the requested scope, mark each item complete or explain the remaining limit.

- [ ] The result follows the user's direction and preserves required content and brand constraints.
- [ ] Major visual choices have a clear role; convention and expression are both used deliberately.
- [ ] Hierarchy, text measure, grouping, and action prominence work with representative content.
- [ ] Tokens and recurring treatments are coherent; exceptions have a practical purpose.
- [ ] Relevant compact layouts, content extremes, font/asset fallbacks, and states were inspected or specified.
- [ ] Applicable contrast, focus, scaling, and target checks are documented without unsupported conformance claims.
- [ ] Evidence, sample data, and conceptual imagery are distinguishable.
- [ ] The requested artifact is delivered with concise rationale and explicit verification limits.

---

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)