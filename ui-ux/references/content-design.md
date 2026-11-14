# Content design and microcopy

Read when: Writing or reviewing labels, buttons, headings, hints, errors, empty states, confirmations, notifications, or localized interface text.

Words are the interface. Most usability problems are wording problems: a label that needs interpreting, a button that does not say what it does, an error that does not say what to do.

## Principles

| Principle | Means |
| --- | --- |
| Use the user's words | Name things as the audience does, not as the code or the organization does |
| Say what happens | A control's label predicts the result of using it |
| One term per concept | If it is "shipment" in one place it is "shipment" everywhere |
| Lead with what matters | Put the key word first; people read the first two words of a line |
| Be brief, then complete | Cut filler, but never the fact needed to act |
| Plain and neutral | No jargon, no cuteness in errors, no blame, no exclamation marks |
| Specific over generic | A sentence that could appear in any product is not doing work |

Remove on sight: "simply", "just", "please note that", "in order to", "successfully", "oops", "uh-oh", and marketing words such as "seamless", "powerful", "unlock", "supercharge", and "effortless".

## Patterns

| Element | Pattern | Example | Avoid |
| --- | --- | --- | --- |
| Button | Verb plus object | "Create shipment", "Download invoice" | "Submit", "OK", "Continue" when the consequence is unclear |
| Destructive button | The action and object | "Delete address" | "Yes", "Confirm" |
| Link | Describes the destination | "See all tariffs" | "Click here", "Learn more" |
| Page title | The object or task | "Shipments", "New shipment" | "Dashboard" for everything |
| Field label | Short noun phrase | "Recipient phone" | A question, or a sentence ending in a colon |
| Hint | Format, source, or why it is asked | "We text delivery updates to this number." | Repeating the label |
| Placeholder | An example value, or nothing | "GE10482KA7" | Instructions that vanish on typing |
| Validation error | How to fix it | "Enter a phone number with country code, for example +995 555 12 34 56." | "Invalid phone" |
| System error | What happened, whether work is safe, what to do | "We could not load tariffs. Try again." | "Something went wrong" |
| Empty state | What this is and how to start | "No saved addresses. Add one to speed up your next shipment." | "Nothing here yet!" |
| Confirmation dialog | Question naming object and consequence | "Delete 3 shipments? This cannot be undone." | "Are you sure?" |
| Success message | What changed | "Address saved" | "Success!" |
| Loading text | What is happening, if the wait is long | "Checking customs status…" | "Loading…" for ten seconds |
| Tooltip | Names an icon or adds a non-essential detail | "Copy tracking code" | Essential instructions |
| Notification | Who or what, the event, the action | "GE-10482 arrived in Tbilisi. Schedule delivery" | "You have a new update" |

## Tone by situation

| Situation | Tone |
| --- | --- |
| Routine action | Invisible: short and factual |
| First use | Helpful: one sentence of orientation |
| Error caused by input | Neutral and specific; no blame |
| System failure | Take responsibility; say what to do; no jokes |
| Destructive action | Serious and exact |
| Completion of something significant | Warm but brief |

## Numbers, dates, and units

- Format with the locale (`Intl.NumberFormat`, `Intl.DateTimeFormat`), not by hand.
- Always show units and currency; decide one currency format and keep it.
- Relative time ("5 minutes ago") for recent events, absolute date and time for anything scheduled or older than about a week; make the exact time available.
- State the time zone when users are in more than one.
- Handle plurals properly ("1 shipment", "2 shipments") with the platform's plural rules; never "shipment(s)".
- Zero, unknown, and not applicable are different: "0", "—", "Not available yet".

## Writing for localization

- Write full sentences as single strings. Do not build sentences by joining fragments; word order differs between languages.
- Use named placeholders with context for translators: "{count} shipments in {city}".
- Leave room: translations are often 30% longer or more, and some languages have long single words. Controls size to content.
- Avoid idioms, puns, and culture-specific references.
- Do not rely on capitalization for hierarchy; some scripts, including Georgian in everyday use, have no case.
- Dates, numbers, names, and addresses follow the locale's order and format.
- Set `lang` on the document and on runs in another language.

## Georgian

- Write Georgian as Georgian, not as translated English. Calques such as „გახსენით პოტენციალი“ or „აიყვანეთ ახალ დონეზე“ read as machine text; say the concrete thing instead.
- Choose formal თქვენ or informal შენ from the brand voice and keep it everywhere.
- Choose one pattern for action labels and keep it: verbal noun („ამანათის მოძებნა“) or imperative („მოძებნეთ ამანათი“).
- Use Georgian quotation marks „ “ and consistent number, currency (₾), and date formats.
- Confirm the font covers Georgian in every weight used, start with zero letter-spacing, and do not depend on uppercase transforms.
- Test the longest real Georgian labels in buttons, tabs, and table headers at the narrowest width.

## Content-fit fixture

Use these to find breakage; then test the product's real strings.

```text
Short action:      Save
Long action:       Save delivery instructions
Georgian action:   მიწოდების ინსტრუქციის შენახვა
Long name:         Abe Prangishvili / აბე პრანგიშვილი
Long identifier:   GE-2026-000104829-TBS-KA
Large number:      ₾1,284,650.75
Empty result:      No shipments match these filters.
Pending:           Saving delivery instructions…
Error:             We could not save these instructions. Your text is still here.
```

## Checks

| Check | Pass |
| --- | --- |
| Predictable | Every control's label tells what will happen |
| Consistent | One term per concept; one capitalization and punctuation style |
| Actionable | Every error and empty state says what to do next |
| Truthful | No invented claims, counts, or progress |
| Localizable | Whole-sentence strings, placeholders, plural rules, room to grow |
| Fits | Longest strings in every language fit without clipping |
