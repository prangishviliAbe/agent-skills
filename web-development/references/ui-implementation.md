# Implementing UI to a finished standard

Read when: A change adds or alters anything visible: a page, component, form, table, email, or admin screen.

Developers ship most of the generic-looking interfaces on the web, usually by accepting framework and component-kit defaults and stopping when the feature works. This reference is the minimum craft that separates working from finished. It applies inside the project's existing design system; it does not authorize a redesign.

## Before writing markup

1. Find the project's tokens and components (theme file, CSS variables, Tailwind config, component directory). Use them. If a needed token does not exist, add it to the system; do not hard-code a value in the component.
2. Find the nearest existing screen that solves a similar problem and match its structure, spacing, and wording.
3. List the states this UI can be in: loading, empty, error, partial, success, disabled, long content, no permission. Build the ones that apply.
4. Get real content: actual labels, the longest realistic values, every shipped language.

## Rules

| Area | Rule |
| --- | --- |
| Semantics | `button` for actions, `a` for navigation, `label` for every input, headings in order, `table` for tabular data, lists for lists |
| Spacing | Only values from the spacing scale. Gap inside a group is smaller than the gap between groups. Parents set spacing with `gap`; children do not carry outer margins |
| Type | Only sizes and weights from the type scale. Running text 45 to 75 characters per line. Headings do not end on a single orphaned word. Numbers in tables use tabular figures and end alignment |
| Color | Only role tokens (`text`, `muted`, `surface`, `border`, `accent`, `danger`). Text contrast at least 4.5:1. One accent, used for the primary action and current selection. Never signal by color alone |
| Surfaces | The system's radius and border. Shadows only on things that float (menus, dialogs). No box inside box inside box |
| Controls | Buttons and inputs share a height. One primary button per view, labeled with verb and object. Hit targets at least 24 by 24 CSS px, 44 on touch-first layouts |
| States | Hover, focus-visible, pressed, disabled, and loading on every interactive element. State changes never change an element's size or move its neighbors |
| Focus | Visible on every interactive element. Never `outline: none` without a replacement |
| Images | Explicit `width` and `height` or `aspect-ratio`; meaningful `alt`; `object-fit` with a chosen focal point |
| Responsive | Works from 320px upward with no horizontal page scroll. `min-width: 0` on flex and grid children that hold text. Long strings wrap or truncate deliberately |
| Motion | Only for state changes; named properties, 120 to 250ms, ease-out; reduced-motion fallback. No `transition: all` |

## Do not ship generated-looking UI

Remove from the code you touch, and never add unless explicitly requested:

```text
Styling:   gradient text; purple, indigo, or blue-to-pink gradients; colored glows and
           shadows; glassmorphism and backdrop blur; gradient or animated borders; accent
           stripes on card edges; blurred color blobs; dot-grid and grain backgrounds
Structure: tinted icon bubble above every card title; pill badges as decoration;
           decorative dots and fake status lights; identical icon-title-text card grids
           for unlike content; fake browser chrome; four KPI cards with invented deltas
Motion:    hover scale or lift on non-interactive cards; fade-up on scroll for every
           block; bounce easing; count-up numbers; pulsing or floating loops
Content:   "seamless", "supercharge", "unlock", "effortless", "next-generation";
           invented testimonials, logos, ratings, and metrics; John Doe and Acme;
           lorem ipsum; emoji as icons; sparkle icons for AI features
Defaults:  untouched framework palette (default indigo, slate), default radius and
           shadow on every box, default icon choices
```

Functional marks stay: labeled status indicators, chart series, focus rings, selected states, progress bars, necessary rules and borders.

When a component kit (shadcn/ui, MUI, Bootstrap, and similar) is in use, apply the project's theme through the kit's variables; a kit left on its default theme is the most common source of the generic look. Keep the kit's keyboard and focus behavior intact.

## State handling in code

```tsx partial
function ShipmentList({ query }: { query: string }) {
  const { data, error, isPending, refetch } = useShipments(query);

  if (isPending) return <ShipmentListSkeleton rows={6} />;          // same row height as real rows
  if (error) {
    return (
      <InlineError
        title="Could not load shipments"
        detail="Your filters are unchanged."
        action={<Button variant="secondary" onClick={() => refetch()}>Try again</Button>}
      />
    );
  }
  if (data.length === 0) {
    return query
      ? <EmptyState title={`No shipments match "${query}"`} action={<ClearSearchButton />} />
      : <EmptyState title="No shipments yet" action={<CreateShipmentButton />} />;
  }
  return <ShipmentTable rows={data} />;
}
```

The four branches are different screens and each deserves its own design. A spinner in an empty page, or "No data" for every case, is unfinished work.

Submission rules: disable repeat activation while pending without changing the button's width; keep every field's value on failure; put the message at the field and summarize at the top of a long form; never show success before the server confirms; treat a timeout on a non-repeatable action as unknown, not failed.

## Verify by rendering

Reading JSX and CSS does not verify a UI. Before reporting a visible change as done:

1. Run the app and open the changed screen.
2. Check a narrow width (about 360px, and 320px for overflow), a middle width, and a wide one.
3. Trigger each state you built. Throttle the network to see loading; force an error; use an empty data set.
4. Tab through the screen. Every control reachable, focus always visible, order logical.
5. Paste the longest realistic content and each shipped language.
6. Look for: overflow, clipped or orphaned text, misaligned edges, uneven spacing, elements that jump on state change, console errors.
7. Fix and look again.

Quick overflow check in the browser console:

```javascript
[...document.querySelectorAll('body *')]
  .filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
  .map(el => el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
```

If the app cannot be run, say so and mark visual verification Not run. Do not describe the result as polished.

## Handing off

Report what was rendered (sizes, states, languages), what was not, and any design decision that needs the owner's input (missing asset, unclear copy, a token that had to be added).
