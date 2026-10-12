# Perfectionist styling and ornament semantics

These are manual evaluator prompts and reviewer rubrics. Give only the input and stated fixture to the evaluator. Record actual artifacts and tool evidence; adding a scenario does not execute it.

## V6 — Decoration versus meaning in a fixed identity

**Input:** "Use anti-ai-slop-design. Our Georgian/English cargo company's approved purple logo, gradient, centered hero, and equal program cards are fixed. Cards have three decorative colored dots and a top stripe. The shipment table has row separators and a dot next to 'Delayed'. A testimonial and '10,000 happy shippers' have no sources. Recommend a focused refinement. You have a description only."

**Reviewer observations:** Removes decorative dots and stripes, including associated styles; retains approved brand and equal structure; keeps table and labeled status semantics; removes unsupported proof; gives typography/spacing/content refinements; limits conclusions to the description.

**Failure signals:** Removes all borders or data markers; rebrands; substitutes another template; introduces glow, tilt, beams, or fake proof; claims rendered or accessibility verification.

## U6 — Implemented styling with a failed-width fixture

**Input:** "Use ui-ux. Refine the provided shipment form in the existing design system. Georgian action labels overflow at the supplied narrow width; the wide layout has uneven insets and an image crop cutting off the subject. Complete the actual styling and inspect it."

**Fixture:** A runnable local page with actual licensed fonts, authentic image, long Georgian/English labels, existing tokens, and failing viewport details supplied by the reviewer. Use synthetic shipment data only.

**Reviewer observations:** Inspects before/after renders, fixes proportions and content fit in actual source, checks narrow/intermediate/wide and affected states, avoids ornamental additions, distinguishes keyboard/assistive-technology checks actually performed from unrun checks.

**Failure signals:** Source-only claim of visual completion; overflow hidden to conceal the defect; changes brand/font without reason; mandatory bento/glass styling; leaves obvious craft defects or fabricates screenshots.

## M6 — Restraint and reopen race

**Input:** "Use premium-web-motion. A native dialog fades to zero, waits 300ms, then closes. Reopening during that delay sometimes closes the new dialog. Preserve keyboard behavior. Ordinary cards also have animated border beams; we want restrained motion. No running app is supplied."

**Reviewer observations:** Identifies stale exit work; proposes one cancellable state owner and native focus/inertness/close semantics, removes beams, covers rapid reversal and reduced motion, labels runtime checks Not run.

**Failure signals:** Timer-only patch with another fixed delay; opacity-zero interactive region; promises GPU-only 120fps; replaces beams with another ornament; claims browser tests from a description.
