# UI/UX and visual-design behavioral scenarios

These are manual evaluator prompts and private reviewer rubrics, not executed tests. Give an evaluator only the selected skill, task input, and any stated synthetic fixture. Keep the observations and failure signals until after it responds.

## UI/UX

### U1 — Focused banking-flow handoff

**Input:** “Use ui-ux. Give a focused developer handoff for a mobile transfer form with amount, recipient, and optional note. Saving can fail, the network can leave a transfer outcome unknown, and users often return after account verification. Do not redesign the whole banking app.”

**Essential observations:** Covers validation, pending, confirmed, failed, and unknown results; preserves entered data when appropriate; states a safe recovery and return path; addresses focus/announcements and labels runtime behavior unverified if no running app exists.

**Failure signals:** A brand redesign; asserting that retry cannot duplicate a transfer without knowing server behavior; focusing only the happy path; claiming screen-reader or keyboard results from a static specification.

### U2 — Screenshot review with evidence limits

**Input:** “Use ui-ux. Review a screenshot of a desktop analytics table. Column labels are compact, there is a purple status pill, a row menu uses an ellipsis icon, and empty state is not shown. Give the highest-impact findings only. You cannot inspect the running product.”

**Essential observations:** Distinguishes visible hierarchy/copy concerns from untestable keyboard, semantic, responsive, and interaction behavior; asks or annotates the smallest implementation checks; avoids inventing user research or hidden states.

**Failure signals:** Declares WCAG conformance or behavior from pixels; produces a generic entire-app state matrix; treats a familiar ellipsis menu as automatically unusable.

### U3 — Responsive data decision

**Input:** “Use ui-ux. A shipment table has customer, status, origin, destination, date, and exception details. On a narrow screen the current mockup hides exception details completely. Recommend a responsive behavior that retains the task of finding delayed shipments.”

**Essential observations:** Ties the solution to the task and content priority; preserves an accessible way to find exception details; considers reflow, disclosure, or contained scrolling based on context; distinguishes a design choice from verified touch/screen-reader behavior.

**Failure signals:** Hiding task-critical information; adding a full mobile redesign without reason; declaring one layout pattern universally correct.

### U4 — Destructive-action recovery

**Input:** “Use ui-ux. Specify deletion of a saved payment method. The action can fail, the card may be the user’s last usable payment method, and the backend may finish after a timeout. Give only the state and copy/interaction contract.”

**Essential observations:** Identifies prerequisites, clear consequence, pending/unknown outcomes, data refresh/recovery, focus behavior, and copy that avoids falsely claiming completion.

**Failure signals:** Immediate permanent removal from UI before outcome resolution; a generic ‘Are you sure?’ with no consequence; unsupported promise that the operation is reversible.

## Anti AI Slop Design

### V1 — Fixed brand direction, generic execution

**Input:** “Use anti-ai-slop-design. A nonprofit site has an approved purple gradient, centered hero, equal program cards, and Georgian/English content. It feels generic, but leadership says the identity is fixed. Recommend specific visual refinements without inventing testimonials or metrics.”

**Essential observations:** Preserves valid brand choices; diagnoses the actual hierarchy, typographic, content, imagery, or craft weakness; considers both languages and real content width; makes targeted, buildable recommendations.

**Failure signals:** Bans gradients/cards/centered heroes by category; invents social proof; turns the task into a different brand or a full product redesign.

### V2 — Dense operational dashboard

**Input:** “Use anti-ai-slop-design. Refine a warehouse dashboard with dense tabular data, critical alerts, and few images. It needs to feel trustworthy and calm, not decorative. Preserve the existing component library.”

**Essential observations:** Uses hierarchy, density, color roles, type, alignment, and alert semantics to improve calm clarity; avoids adding ornamental illustrations or glassmorphism; respects the component system and actual state content.

**Failure signals:** Equates ‘anti-slop’ with editorial asymmetry; makes alerts subtle; adds unrelated asset or dependency cost; ignores dense data usability.

### V3 — Reference-inspired landing page

**Input:** “Use anti-ai-slop-design. The client likes the feeling of a competitor’s landing page but wants an original product site. Preserve accessibility and explain what can be borrowed at the level of principle.”

**Essential observations:** Extracts transferable hierarchy, tone, content rhythm, or interaction principles without copying identity or assets; distinguishes conceptual imagery from evidence; states relevant validation limits.

**Failure signals:** Pixel-for-pixel imitation; blanket refusal to use any influence; fabricated product screenshots, customers, or outcomes.

### V4 — Local typography correction

**Input:** “Use anti-ai-slop-design. The marketing page is on-brand but Georgian headlines wrap awkwardly beside a photo. Make a focused recommendation; all colors, logos, and layout structure are approved.”

**Essential observations:** Makes a local typography/content-fit diagnosis; considers font coverage, measure, line breaks, image crop/relationship, and the bilingual context without imposing arbitrary Georgian expansion ratios or a new direction.

**Failure signals:** Rebrands the page; treats Georgian uppercase or localization as a blanket visual defect; makes claims about font rendering without inspecting the actual font/assets.
