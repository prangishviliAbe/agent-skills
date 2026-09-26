# Design systems: usable contracts and controlled change

Read when creating, extending, auditing, or documenting reusable tokens and components.

## Inspect before inventing

Identify the existing source of truth, consumers, supported platforms/themes, naming, versions, and contribution process. Preserve established contracts unless a demonstrated gap justifies change. A single page does not automatically need a new design system.

Audit usage as well as files. A hardcoded value can be legitimate data visualization or art direction; a component with many props is not automatically defective.

## Tokens

Use layers where they help the system:

| Layer | Role | Example |
| --- | --- | --- |
| Primitive | Reusable raw values | Blue palette step, spacing increment |
| Semantic | Interface intent | Text-muted, surface-overlay, action-background |
| Component | Necessary local contract | Dialog-padding, input-border-invalid |

Prefer semantic roles for theme-dependent interface values. Component tokens are useful when independent theming is needed, but avoid alias chains that add no decision value. Preserve the project's architecture rather than enforcing three layers everywhere.

Define affected roles in every supported theme; do not create an unrequested theme. Check text/background pairs, disabled/selected/focus states, forced-color behavior when applicable, and high-density variants.

## Coherent scales without arbitrary ceilings

- Define type roles with size, line-height, weight, and tracking. Separate semantic heading level from visual style.
- Reuse spacing roles or a scale. Optical adjustments, hairlines, platform conventions, and calculated geometry can legitimately fall between steps.
- Give radius, border, and elevation choices a reason. The number of values alone does not establish drift.
- Include motion roles and a reduced-motion behavior when the component animates.
- Add a token when it describes a reusable decision; avoid creating a named token for every isolated number.

## Component contracts

Define the states and combinations the component supports. Prefer a variant enum when booleans describe mutually exclusive alternatives; keep independent booleans independent.

Use composition when it makes supported structure clear. Too many unconstrained slots can make an API as fragile as too many configuration props.

| Responsibility | Component should provide | Consumer must supply |
| --- | --- | --- |
| Accessibility | Correct semantics, state exposure, keyboard/focus behavior, label association mechanism | Meaningful labels/content and context-specific instructions |
| Behavior | Supported state transitions and event contract | Application data, authorization, persistence, and domain policy |
| Layout | Internal spacing and resilient anatomy | Placement within the page and surrounding relationships |
| Theming | Supported tokens and variants | Valid theme values and contextual contrast checks |
| Extensibility | Documented escape hatches that preserve invariants | Responsible use without overriding required semantics |

Forward framework attributes/events deliberately; do not blindly allow caller props to overwrite required roles, handlers, or ARIA relationships. Accessibility is shared across the component and its use, not solved by the component alone.

## Evidence for reuse

Check representative real usages: long labels, supported translations, optional content, loading/error, keyboard navigation, and constrained containers. Test relevant combinations instead of enumerating every Cartesian product.

For a new abstraction, compare at least its actual intended consumers. Reuse should reduce meaningful duplication without combining different interaction models merely because they look alike.

## Documentation and migration

Include only what a consumer needs:

- Purpose, when to choose another pattern, anatomy, supported variants/states.
- Content rules, examples, accessibility requirements, and responsive behavior.
- A minimal usage example and a consequential edge case.
- Ownership, compatibility, and how to propose an extension.

When changing an existing API, identify affected consumers, deprecation or migration steps, and compatibility tests. Do not rename public tokens just to improve taste.

## Audit method

1. Search affected source for repeated patterns, variants, token usage, and hardcoded values using available code-search tools.
2. Compare findings against the actual system contract and live usages; treat searches as candidates, not proof of bugs.
3. Rank inconsistencies by user harm and maintenance cost.
4. Consolidate genuinely equivalent patterns and document intentional exceptions.
5. Verify representative consumers, supported themes, and changed interactions.

Report system gaps separately from implementation misuse. A missing label in one consumer is not evidence that the base component lacks a labeling mechanism.