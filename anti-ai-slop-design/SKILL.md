---
name: anti-ai-slop-design
description: Create, implement, or critique refined, human-quality digital product design while preventing generic AI-looking output. Use for websites, landing pages, SaaS products, dashboards, mobile apps, UI components, design systems, wireframes, Figma work, frontend styling, visual direction, UX reviews, and image or illustration direction where hierarchy, brand specificity, restraint, accessibility, responsive behavior, and implementation realism matter. Trigger on requests to design, redesign, polish, modernize, beautify, review, or implement an interface, especially when the result risks template-like SaaS layouts, decorative excess, fake-premium styling, or generic generated visuals.
---

# Anti AI Slop Design

Produce intentional, brand-specific, buildable design whose quality comes from structure, typography, content, and interaction—not accumulated effects. Treat “anti-slop” as a quality standard, not a fixed visual style.

## Resolve priorities

Apply requirements in this order:

1. Preserve explicit user requirements, established brand rules, and existing product conventions.
2. Protect usability, accessibility, content clarity, and technical feasibility.
3. Strengthen hierarchy, coherence, responsiveness, and brand character.
4. Add decoration only when it communicates meaning or reinforces the brand.

Do not erase a deliberately expressive, playful, maximalist, futuristic, or glass-based direction merely because it uses a commonly abused technique. Execute the requested direction with discipline and justify each effect. Flag a conflict only when it materially harms usability or accessibility.

## Use the design workflow

### 1. Frame the problem

Before designing, identify from the request and available artifacts:

- Product and interface type
- Audience, context, and device priorities
- Primary user goal and business goal
- Brand traits and desired emotional tone
- Content hierarchy and primary action
- Existing constraints, components, and technical stack
- Required states, localization, and accessibility needs

Infer low-risk gaps and continue. State assumptions only when they materially affect the result. Do not invent a fake brand story, fake metrics, or fake product capabilities to fill space.

### 2. Solve structure before style

Define the user flow, information architecture, section order, content groups, and action hierarchy first. Remove redundant sections and controls. Use cards only when their boundaries help users compare, scan, select, or act on distinct objects.

Build the layout around a consistent grid, spacing rhythm, meaningful alignment, and realistic content density. Prefer asymmetry only when it improves emphasis or brand character; do not use novelty as a substitute for hierarchy.

### 3. Form a visual thesis

Derive a specific design idea from the product's content, audience, environment, history, or material qualities. Define a small set of recognizable anchors—for example one composition principle, one typographic behavior, and one image or surface rule. Let those anchors recur coherently instead of collecting unrelated trends.

When references are provided, extract transferable principles such as density, rhythm, contrast, proportion, or interaction tone. Do not copy a brand's distinctive layout, trade dress, assets, or signature visual language. When no references exist, avoid defaulting every project to the same restrained editorial aesthetic; choose a direction that fits this product.

### 4. Establish a restrained visual system

Define or preserve a coherent system for:

- Type roles: display, headings, body, labels, metadata, controls
- Color roles: canvas, surface, text, muted text, border, brand, accent, semantic states
- Spacing scale and layout gutters
- Corner radii, borders, elevation, and icon style
- Component sizes and interaction states
- Imagery or illustration treatment
- Motion duration, easing, and reduced-motion behavior

Keep the number of visual variables small enough to feel authored. Reuse tokens; avoid one-off values unless the composition requires them.

### 5. Design real behavior

Specify the states the interface actually needs: default, hover, focus-visible, active, selected, disabled, loading, empty, error, success, and destructive confirmation where relevant. Consider long content, missing media, validation errors, permission limits, and slow networks.

Design mobile-first unless the brief clearly prioritizes another environment. Check at least 360, 390, and 414 px mobile widths, then tablet and desktop. Define content reordering, navigation collapse, wrapping, cropping, overflow, and touch behavior rather than merely shrinking the desktop composition.

### 6. Validate implementation realism

Prefer semantic HTML, straightforward grid or flex layouts, accessible native behavior, maintainable tokens, optimized media, and purposeful SVG/CSS decoration. Avoid fragile pixel choreography, unreadable overlays, excessive client-side animation, and effects whose performance or maintenance cost exceeds their value.

When implementing, preserve the project’s architecture and design system. Do not introduce a large dependency only to create a minor visual effect.

### 7. Run a refinement pass

Inspect the result at three levels:

- Five-second read: Can users identify what this is, what matters, and what to do?
- Working use: Are controls, states, content density, and responsive behavior credible?
- System quality: Are typography, spacing, color, radius, borders, icons, and motion consistent?

Remove anything that cannot be defended by hierarchy, comprehension, interaction, brand, accessibility, or emotional tone.

## Reject default AI patterns

Avoid these unless the brief and product logic genuinely support them:

- Blue-purple gradient orbs, neon glow, wallpaper-like blobs, random particles, and meaningless geometry
- Glassmorphism, blur, noise, oversized shadows, and shiny 3D used as generic “premium” signals
- The stock SaaS hero formula: giant centered claim, decorative gradient, fake dashboard, and unsupported CTA
- Repetitive equal card grids, card-inside-card nesting, badges everywhere, and icons beside every heading
- Fake analytics, implausible UI screenshots, invented testimonials, stock-like corporate scenes, and symbolic imagery unrelated to the product
- Excessive centered layouts, oversized type with little content, random uppercase labels, and sections with identical rhythm
- Continuous floating, universal fade-ins, gratuitous parallax, and motion without state or narrative purpose
- Inconsistent radius, shadow, border, icon, control, or spacing styles

Do not “fix” these patterns by merely reducing opacity. Replace them with stronger hierarchy, content, composition, or brand-derived detail.

## Apply craft standards

### Typography

Let typography carry the design. Use clear role contrast without excessive weights or arbitrary sizes. Keep body copy readable, line-height comfortable, and prose measure generally around 45–75 characters where the format permits. Avoid narrow text columns that create choppy wrapping and huge headings that force awkward line breaks.

### Color and surfaces

Preserve user-provided brand colors and expand them into functional roles. Use accent color selectively for action, state, navigation, or category meaning. Prefer tonal surfaces, whitespace, and subtle separators over layers of shadows. Target WCAG AA contrast for normal product text and controls unless the user explicitly sets a stricter standard.

### Components

Make components credible and buildable. Keep labels clear, focus visible, state changes distinguishable, and controls large enough to operate. Default to touch targets near 44×44 CSS px when platform conventions allow. Make the whole card interactive only when it represents one coherent destination; otherwise expose explicit actions.

### Imagery and illustration

Use imagery that provides evidence, atmosphere, instruction, or brand recognition. Direct it with a specific subject, context, composition, crop, lighting, material treatment, and placement. Avoid plastic skin, fake office scenes, arbitrary futuristic objects, overly perfect 3D renders, and images whose only role is to fill a rectangle.

### Motion

Use motion to explain state, continuity, hierarchy, navigation, or progress. Keep frequent interactions fast and subtle; reserve larger movement for meaningful transitions. Respect reduced-motion preferences and avoid animation that delays access to content or harms performance.

## Handle Georgian and multilingual UI

Respect the proportions and wrapping behavior of each script instead of copying an English layout unchanged. For Georgian interfaces:

- Allow more horizontal breathing room and natural control widths.
- Use comfortable line-height and readable body sizing.
- Avoid overly narrow cards and cramped label treatments.
- Test real Georgian strings in navigation, buttons, headings, forms, and errors.
- Avoid forced all-caps styling assumptions and letter-spacing patterns borrowed from Latin text.

For any localized interface, test expansion, wrapping, truncation, mixed scripts, numerals, dates, and fallback fonts.

## Review existing designs constructively

When reviewing, distinguish evidence from preference. Prioritize issues by impact:

1. Blockers: comprehension, accessibility, broken responsive behavior, or impossible interaction
2. High impact: weak hierarchy, unclear action, content mismatch, or major inconsistency
3. Polish: spacing, typography, imagery, motion, or surface refinement

For each meaningful issue, explain what fails, why it matters to users or the product, and the smallest strong correction. Do not replace a design with personal taste when the current solution already serves the brief.

## Deliver concrete decisions

Avoid unsupported adjectives such as “modern,” “clean,” or “premium.” Describe the actual decisions:

- Layout and content order
- Type scale and text measure
- Color roles and contrast
- Spacing and grid behavior
- Component states and interaction logic
- Responsive transformations
- Imagery and motion direction
- What was removed, emphasized, or deliberately left quiet

Match detail to the task. For implementation requests, express the system in reusable code and tokens. For concepts, provide enough specificity to build. For reviews, lead with the highest-impact findings.

## Final quality gate

Before presenting the result, verify:

- The product, audience, and primary action are legible.
- Hierarchy works before decoration is noticed.
- The result feels specific to the brand and content, not a reusable AI template.
- A concise visual thesis explains why this product looks this way.
- Every section and component has a functional reason to exist.
- Typography, spacing, color, radius, borders, icons, shadows, and motion form one system.
- Real content, long text, localization, interaction states, and mobile layouts remain usable.
- Accessibility and implementation constraints have been addressed.
- No decorative element is compensating for weak structure.

If a check fails, revise before delivery.
