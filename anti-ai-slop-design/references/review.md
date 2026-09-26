# Visual review without taste disguised as fact

Read for critique of a page, screen, component, or generated visual. Judge it against the brief and intended audience.

## Define the evidence boundary

State what was available: screenshot, design file, source, rendered interface, or a set of assets. Review only observable properties as facts.

A screenshot may suggest weak contrast but cannot always establish exact color values, hit areas, semantics, focus behavior, or responsive rules. A design file supplies intended values, not proof of production behavior. Note the missing evidence and the smallest useful check.

## Useful review passes

Adapt these to the size of the task rather than requiring a full audit for every edit:

1. **Communication:** What is this, what matters, and what can the user do? Reduced-scale or squint inspection can reveal emphasis, but it is a heuristic rather than a user study.
2. **Brief and identity:** Does the work express the requested character and preserve approved brand constraints? Familiar components are allowed.
3. **Content and trust:** Are the claims specific and supported? Are samples and conceptual images visibly distinguished from evidence?
4. **Composition:** Do grouping, alignment, rhythm, measure, and relative emphasis fit the actual content?
5. **System:** Are equivalent roles consistent? Multiple radii, colors, or fonts can be intentional; identify a conflicting use rather than counting values.
6. **Reality:** Inspect relevant content extremes, missing assets, compact layouts, and themes/locales actually supported.
7. **Accessibility and operation:** Measure applicable properties and operate affected controls where possible; use [craft.md](craft.md) for requirements and distinctions.
8. **Finish:** Correct optical alignment, awkward wrapping, crop, icon weight, and other details that remain visible in the delivered artifact.

Continue independent useful checks even when a serious issue appears; defer polish likely to be invalidated by its correction.

## Prioritize by consequence

| Type | Evidence to seek |
| --- | --- |
| Blocker | Important content or an essential action is demonstrably unavailable/unreadable |
| High | A major task, trust signal, or supplied brand requirement is materially harmed |
| Medium | Meaningful confusion, inconsistency, or reading effort |
| Polish | Local refinement with limited task impact |
| Preference | Another defensible aesthetic with no demonstrated defect |

Severity and certainty are separate. Describe confidence as observed, inferred, or unverified. Do not invent affected-user counts, conversion effects, or research findings.

## Finding format

Use as much of this structure as the finding needs:

```text
Issue:    Event date loses emphasis against the hero artwork
Where:    Main event header, compact layout
Observed: In the supplied frame, the date sits within a visually busy image region
Impact:   Attendees may miss information needed before booking; this is a readability hypothesis
Fix:      Move the date to a stable text area or adjust the image treatment locally
Verify:   Inspect actual contrast and hierarchy at the compact rendered size
Preserve:  Approved artwork, palette, and expressive title treatment
```

For measured claims, state the actual value, method, and applicable requirement. Do not invent measurements to make a critique appear objective.

## Common false positives

| Claim | Better assessment |
| --- | --- |
| "Three cards and a gradient prove AI slop" | Evaluate the cards' comparison role, palette fit, content, and execution |
| "The CTA below the fold is a failure" | Check whether useful context precedes it and the action is discoverable |
| "Every control must be 44px for AA" | Check the 24px AA minimum and exceptions; distinguish a larger touch recommendation |
| "The design would work for a competitor" | Determine whether identity is adequate for this product; standard utility patterns are beneficial |
| "All expressive effects should go" | Preserve the requested style and correct only demonstrated harm |
| "A one-word heading line is wrong" | Evaluate intentional composition and actual readability |
| "This looks old" | Identify a specific hierarchy, readability, brand, or interaction problem |

## Generated visual review

Inspect text, logos, people, object geometry, reflections, repeated elements, and consistency at final display size. Check whether the visual communicates a real capability, a clearly labeled concept, or atmosphere.

A generated image is not inherently a defect. The problem is an artifact, mismatch, or misleading factual implication. Prefer the smallest effective correction or a more suitable source asset.

## Deliver the review

Lead with the highest-impact corrections and preserve effective choices. Include optional alternatives only when they help the user decide. End with material verification limits rather than a blanket quality score or a promise of conversion gains.

Do not redesign the work unless that is requested. For an implementation task, make the authorized corrections and verify them instead of stopping at a critique.