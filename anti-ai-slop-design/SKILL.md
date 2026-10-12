---
name: anti-ai-slop-design
description: >-
  Remove AI slop and refine distinctive visual design in websites, landing pages, dashboards,
  and apps. Use for "less AI", "too generic", "premium polish", art direction, or decorative
  clutter: colored dots, card accent lines, border beams, icon bubbles, gradient blobs, and
  repetitive feature grids. Establish product-specific composition, typography, imagery,
  and rigorous visual QA while preserving the user's brand and scope.
---

# Anti AI Slop Design

Build an identity from the product, audience, real content, and approved brand. Visual quality comes from composition and exact execution. More effects do not make a design more sophisticated.

## Decoration prohibition

**Do not introduce AI slop elements. Remove these from the requested design unless the user explicitly requires that exact motif:**

- Decorative colored dots, faux status LEDs, traffic-light circles, random dot clusters, and pulsing dots beside headings.
- Card accent rails, colored top or side stripes, ornamental internal lines, specular edge streaks, gradient outlines, border beams, and corner brackets added for decoration.
- Repeated pastel icon bubbles, floating badges, pill-shaped eyebrows, sparkles, and emoji used as filler.
- Gradient blobs, ambient glow clouds, background grids, orbit rings, particles, and noise overlays unrelated to the product.
- Hover spotlights, gratuitous card tilt, magnetic controls, and entrance choreography applied to ordinary information.
- Repetitive "icon / title / two lines" feature cards, fake dashboard previews, invented metrics, customer logos, testimonials, or activity.
- Template copy such as "unlock", "supercharge", "seamlessly", or "next-generation" without a concrete, truthful meaning.

A labeled status marker, map point, chart series, focus ring, selected-state indicator, actual progress bar, necessary table separator, and quiet containment border have functional roles. Keep them when they convey real information; ensure color is not the only cue. A decorative dot does not become functional by calling it "brand texture".

Preserve explicitly approved brand motifs, colors, logos, and fixed structures. Diagnose their execution without silently rebranding. An exception for one approved motif does not authorize other ornaments. New brand decoration needs a specific request, not a generic request for "premium".

## Design decisions

1. **Read the artifact.** Inspect the existing screen, code, content, assets, typography, and constraints. A local correction does not require a new visual identity.
2. **Anchor the direction.** For a new design or broad refinement, state a short visual thesis linking audience, primary task, composition, type, and a product-specific detail. Avoid selecting an aesthetic from a trend menu.
3. **Audit defaults.** Use [slop-catalog.md](references/slop-catalog.md). Inventory visible ornaments and repeated structures; record the actual weakness and the smallest convincing replacement.
4. **Compose from content.** Choose a table, list, editorial block, comparison, image, or card according to the information. Equal items may have equal layout. Give unequal priorities unequal emphasis. Do not replace every grid with a bento grid.
5. **Perfect the fundamentals.** Refine reading order, headline measure, type weight, spacing relationships, image crop, button proportions, and optical alignment before considering decoration.
6. **Keep proof truthful.** Use supplied assets and substantiated claims. Remove unsupported proof. Label conceptual imagery or synthetic demo data clearly; never present it as live activity.
7. **Run the swap test.** Mentally replace the brand name. If the entire page remains interchangeable, improve the product story and composition. Familiar controls may remain familiar; avoid novelty in navigation or data entry.
8. **Inspect the result.** Render implemented changes and inspect representative narrow, intermediate, and wide layouts, relevant states, and actual language content. Fix visible defects and inspect again. Code review alone does not verify visual polish.

## Routed references

Read only what the task requires.

| Decision | Reference |
| --- | --- |
| Establish or refine an art direction | [visual-thesis.md](references/visual-thesis.md) |
| Remove prohibited motifs without losing semantics | [slop-catalog.md](references/slop-catalog.md) |
| Compose sections and control density | [composition.md](references/composition.md) |
| Tune typography, imagery, and optical detail | [craft.md](references/craft.md) |
| Implement restrained, maintainable styling | [css-craft.md](references/css-craft.md) |
| Fit Georgian, English, and mixed-script content | [multilingual.md](references/multilingual.md) |

## Common failures

| Failure | Correct move |
| --- | --- |
| Beige canvas and oversized serif replace a purple template | Derive type and palette from this product; changing clichés is not identity. |
| Deleting every border, chart dot, or alert | Remove ornament; preserve grouping, data, focus, and state semantics. |
| Replacing forbidden stripes with animated outlines | Remove the motif, not just its first implementation. |
| Minimalism makes secondary information unreadable | Preserve text contrast and useful density; simplify hierarchy instead. |
| Claims of "pixel-perfect" from unrendered CSS | Say what was inspected and identify remaining visual checks as Not run. |

## Completion evidence

Finish with no unresolved prohibited decoration in the changed scope, a clear task hierarchy, truthful content, coherent typography and spacing, and no visible clipping or accidental overflow in inspected layouts. Resolve major craft defects; do not settle for "functional" when styling was requested. Preserve approved exceptions explicitly.

Use **Verified** for observed results, **Inferred** for reasoned conclusions, **Assumed** for missing context, and **Not run** for unavailable checks. A static recommendation does not prove responsive, keyboard, or screen-reader behavior.

Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)
