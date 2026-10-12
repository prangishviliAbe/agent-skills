# Motion decisions and tokens

Read when: Choosing easing, spring behavior, duration, or choreography.

| Behavior | Mechanism | Tradeoff |
| --- | --- | --- |
| Small discrete state change | Short CSS ease | Predictable duration; often sufficient |
| Direct manipulation or interrupted retargeting | Runtime spring with current position/velocity | Requires state ownership and cleanup |
| Fixed entrance with a spring-like shape | Sampled CSS linear() easing | Fixed duration; does not inherit live gesture velocity |
| Shared spatial change | View transition or measured FLIP | Requires support/fallback and careful focus semantics |
| Essential progress | Accurate labeled state | No decorative looping motion required |

For a physical spring, natural frequency is sqrt(stiffness / mass); damping ratio is damping / (2 * sqrt(stiffness * mass)). Parameters have meaning within an engine, not universal values across libraries. Tune for travel distance, object size, and input behavior; avoid arbitrary bounce on text and data.

## Starting ranges, not standards

| Interaction | Example duration range | Inspect |
| --- | --- | --- |
| Press / small feedback | 100–180ms | Immediate response; no input delay |
| Menu / short reveal | 150–250ms | Readability and reversibility |
| Dialog / spatial transition | 180–350ms | Focus, travel distance, interruption |
| Larger narrative motion | Task-specific | Do not delay access to content |

Use only a few motion roles. Prefer restrained easing to excessive bounce. Do not stagger a list merely to make it seem "alive"; if choreography aids attention, cap the delay so users can act immediately.

```css
:root {
  --motion-feedback: 140ms;
  --motion-reveal: 220ms;
  --ease-reveal: cubic-bezier(0.2, 0.7, 0.2, 1);
}
.action {
  transition: background-color var(--motion-feedback) ease;
}
@media (prefers-reduced-motion: reduce) {
  .action { transition: none; }
}
```

Verify advanced easing support in target browsers. Native easing does not establish compositor execution or frame rate.
