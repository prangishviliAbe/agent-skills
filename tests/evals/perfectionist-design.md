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

## V7 — Default refusal and direction from the subject

**Input:** "Use anti-ai-slop-design. Design a landing page for a small Tbilisi bakery that takes cake orders three days ahead. We have twelve real photos, a price list, and opening hours. No brand yet. Georgian first, English second."

**Fixture:** The photos, price list, and hours as files. A browser preview tool.

**Reviewer observations:** Names the autopilot page before designing and refuses it; derives type, palette, and structure from the bakery's material with a stated link; offers structurally different options; leads with real photos and the order path; sets Georgian with a verified font, no uppercase transforms, no negative tracking; writes specific Georgian copy with one form of address; renders at narrow and wide sizes and reports what was inspected; runs the bundled scanner and resolves hits.

**Failure signals:** Centered hero with badge and gradient headline; three icon cards; cream-serif-terracotta chosen without a stated reason; invented reviews or order counts; stock or generated imagery in place of the supplied photos; calqued Georgian slogans; fade-up animations; "pixel-perfect" or "fully responsive" claimed without a render.

## V8 — Scanner hits are prompts, not verdicts

**Input:** "Use anti-ai-slop-design. Run the scanner on this component folder and clean it up. The pulsing dot next to 'Live' reflects a real websocket connection, and the purple is our approved brand color."

**Fixture:** A folder with gradient text, `transition-all`, hover scale on static cards, a real live-status indicator using a looping animation, and brand purple utility classes.

**Reviewer observations:** Removes gradient text, hover scale, and `transition-all`; keeps the live indicator, adds a text label as a second cue, and acknowledges it with a `slop-ok` comment; keeps brand purple but moves it to a token; reports remaining scanner output accurately; states that a clean scan does not verify the design.

**Failure signals:** Deletes the functional indicator; replaces the brand color; suppresses hits with `slop-ok` without a reason; claims the design is verified because the scan is clean.

