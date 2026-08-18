# Reviewing visual work

Read when critiquing a design, a page, a component, or generated visual output.

## Order of the passes

Do not comment on spacing before you know whether the page communicates. Each pass gates the next.

**1. Squint pass.** Blur your eyes, or scale the page to 25%. What is still visible is the real hierarchy. If the biggest visual weight is a decorative gradient rather than the message and the primary action, stop here — nothing else matters yet.

**2. Five-second pass.** Look, then look away. What is this? Who is it for? What can I do? What matters most? Every unanswered question is a hierarchy finding, not a styling finding.

**3. Specificity pass.** Could this design be lifted onto a competitor's product with only a logo swap? If yes, the direction is generic. Name the missing thesis, not the individual elements.

**4. Content pass.** Is the copy specific or interchangeable? Is any evidence fabricated? Do buttons name their outcome? Would a domain expert recognize their own world here?

**5. System pass.** Type roles, color roles, spacing scale, radius, borders, icons, elevation — one vocabulary or an accumulation? List the drift concretely: "three radii in use: 6, 12, 9999".

**6. Reality pass.** Longest string, empty state, missing image, 320px width, 200% zoom, dark mode, translated locale. This is where polished-looking work usually breaks.

**7. Accessibility pass.** Measured contrast on real backgrounds, visible focus, target sizes, meaning that survives without color.

**8. Detail pass.** Optical alignment, rhythm, orphans, icon weight, hairline consistency, transition timing. Only now.

## Finding format

```
[Blocker | High | Medium | Polish] Short statement of what fails
Where:    the specific element or section
Observed: the concrete, measurable fact (a value, a ratio, a behavior)
Why:      what it costs the user or the product
Fix:      the smallest strong correction
```

"Observed" must be a fact, not an adjective. `body text #9aa0a6 on #ffffff = 2.9:1` is a finding. "The gray feels light" is a preference.

## Separating evidence from preference

Both belong in a review; label which is which.

| Evidence | Preference |
| --- | --- |
| Contrast ratio below AA | "I would use a warmer neutral" |
| Target smaller than 44px on touch | "The buttons could be rounder" |
| Heading breaks into a one-word orphan at 390px | "I would size the heading down a step" |
| Primary action below the fold on a phone | "The hero could be shorter" |
| Three different radii with no rule | "I prefer sharper corners" |

Lead with the evidence. Offer the preferences at the end, marked as such, and drop them if the current solution already serves the brief.

## Reviewing generated images and illustration

- Check hands, eyes, text, logos, reflections, jewellery, and repeated background elements — the usual failure points.
- Check whether the image does a job (evidence, atmosphere, instruction, recognition) or merely fills a slot.
- Check consistency across the set: one light direction, one grade, one crop family, one level of stylization.
- Check honesty: does it depict a product capability, a person, or a result that does not exist?
- Check that essential information is not carried only by the image.

## Anti-patterns in reviewing

| Anti-pattern | Instead |
| --- | --- |
| "Feels dated" | Name the mechanism: contrast, density, type roles, or rhythm |
| Rewriting the design in your own taste | Correct what fails against the brief |
| Forty unranked notes | Three blockers first, the rest grouped |
| Aesthetic notes ahead of a broken flow | Always order by user impact |
| Flattening an expressive direction into a safe one | Execute the direction better, not smaller |
| Reviewing a static frame and asserting behavior | Flag the states you could not see |

## Closing the review

```
Fix first:  <blockers, each with the smallest correction>
Then:       <high-impact items>
Later:      <polish, batched>
Preserve:   <what is working and should survive the revision>
Thesis:     <the direction as you read it — if you cannot state it, that is the top finding>
```

The "Thesis" line is the most useful part of the review. If neither you nor the designer can state in one sentence why the product looks this way, the design has no direction yet, and every other note is premature.
