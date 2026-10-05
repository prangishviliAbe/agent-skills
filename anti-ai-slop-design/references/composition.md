# Composition: hierarchy, layout recipes, and rhythm

Read when deciding how a page or screen is organized. Start from what the content needs people to notice first; then pick a structure that serves that order. Numbers here are starting points.

## Decide the order before the layout

1. Name the one thing that must be seen first, the two or three that come next, and what can wait.
2. Give the lead element scale, space, or contrast the rest lack. When everything is emphasized nothing is.
3. The first viewport states who or what this is, why it matters to this audience, and the next step, using the real subject, not a stock illustration and a slogan.

## Layout recipes by content

| Content | Structure | Why it works |
| --- | --- | --- |
| A product with one decisive visual | Text and media in a 5/7 split, media bleeding to the edge | Unequal halves create a focal side |
| A claim backed by one strong number or proof | Large figure beside a short explanation, evidence directly below | The proof is the hierarchy |
| A catalog or portfolio | Grid with a featured item spanning two columns or rows, consistent metadata rows | Scan order without everything shouting |
| Comparison between options | Table first, narrative second | People compare attributes side by side |
| Long-form story or documentation | Single readable column with a sticky aside for navigation or context | Measure stays comfortable, orientation stays visible |
| Operational dashboard | Dense grid, critical items first, calm surfaces, status through shape and text as well as color | Scanning speed and trust |
| Event, program, schedule | Strong identity block plus calm, high-contrast rows for the schedule | Expression on top, utility underneath |

```css
.split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(1.5rem, 4vw, 4rem); align-items: center; }
.catalog { display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: 1.25rem; }
.catalog > .featured { grid-column: span 2; grid-row: span 2; }
.prose-with-aside { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 18rem); gap: 3rem; }
.prose-with-aside > aside { position: sticky; top: 1.5rem; align-self: start; }

@media (max-width: 48rem) {
  .split, .prose-with-aside { grid-template-columns: minmax(0, 1fr); }
  .catalog > .featured { grid-column: auto; grid-row: auto; }
}
```

`minmax(0, 1fr)` lets grid children shrink instead of overflowing. Check that visual reordering does not break reading and focus order.

## Rhythm and density

- Vary section structure when the content changes. Five identical blocks (icon, heading, two lines) in a row read as filler even if each is tidy.
- Use a spacing scale and let it vary on purpose: tighter inside related groups, looser between ideas. Uniform generous padding everywhere signals no grouping.
- Match density to the task: reading wants air, scanning data wants tightness. Do not push data apart for the sake of a hero.
- Pace the page: a dense proof section after a spacious opening, a pause before the call to action.

## Cards, containers, and surfaces

Use equal cards for comparable items (plans, products). When priorities differ, make the hierarchy visible instead (a featured item, a list with a lead). Do not wrap everything in a bordered box: proximity, alignment, and type already group things, and nested containers add noise. Keep borders, shadows, and fills where they separate independent objects or carry elevation meaning.

## Alternatives to the default hero

A centered headline, two buttons, and a product shot can be right when the claim and action are sharp. Alternatives when it feels interchangeable: the product in real use, a live or interactive element, the key data as the hero, a plain statement with immediate proof, a task-first layout that starts the work (a search box, a configurator).

## Responsive composition

Design the small layout as its own composition, not a squashed desktop: decide what leads, what collapses, and what moves into disclosure. Test around breakpoint changes and with the longest real strings. Keep tap targets, reading measure (roughly 45 to 75 characters for Latin prose; verify for the actual script), and focus order intact.
