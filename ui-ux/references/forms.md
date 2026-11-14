# Forms and input

Read when: Designing, building, or reviewing a form, a field, validation, or a multi-step input flow.

A form is a conversation in which the system asks for only what it needs, in the order a person thinks, and never makes them repeat themselves.

## Reduce first

Go through every field and ask: is it required to complete this task now? Can the system derive it (country from phone prefix, city from postal code, name from the account)? Can it be asked later, at the moment it becomes useful? Remove, derive, or defer before designing anything. Mark the few optional fields as "optional"; do not mark every required field with an asterisk when nearly all are required.

## Layout

| Rule | Reason |
| --- | --- |
| One column | A single scan line; multi-column forms cause skipped fields |
| Short related fields may share a row (city and postal code, expiry and CVC) | They are read as one item |
| Labels above fields, always visible | Fastest to scan, works when zoomed and translated; a placeholder is not a label |
| Field width suggests the answer's length | A postal code field is not as wide as an address field |
| Group with a heading and space | Not boxes inside boxes |
| Order follows the user's thinking | Start with easy, known answers |
| Primary button at the end of the form, start-aligned with the fields | Predictable position; secondary action is quieter and beside it |
| Controls share one height and radius | Fields and buttons align in a row |

## Field anatomy

```html
<div class="field">
  <label for="code">Shipment code</label>
  <p id="code-hint" class="hint">10 characters, printed on your receipt.</p>
  <input id="code" name="code" type="text" inputmode="text" autocomplete="off"
         autocapitalize="characters" spellcheck="false" required
         aria-describedby="code-hint code-error" aria-invalid="true">
  <p id="code-error" class="error">Enter all 10 characters, for example GE10482KA7.</p>
</div>
```

- The hint sits between label and field so it is read before typing and stays visible. Use it for format or source, not to repeat the label.
- The error replaces or follows the hint under the field, tied with `aria-describedby`; set `aria-invalid` only while the field is invalid.
- Reserve vertical space for the error line when a jumping layout would be disruptive.

## Make typing easy

| Input | Attributes and behavior |
| --- | --- |
| Email | `type="email"`, `autocomplete="email"`, no forced lowercase surprises |
| Phone | `type="tel"`, `autocomplete="tel"`; accept spaces, dashes, and a leading plus |
| Name | `autocomplete="name"` or given and family names; one field unless the system truly needs two; accept any script and length |
| Address | Proper `autocomplete` tokens; do not split into more fields than the delivery needs |
| One-time code | `inputmode="numeric"`, `autocomplete="one-time-code"`; one field that accepts a paste |
| Card | Correct `autocomplete` tokens; format with spaces as typed without blocking paste |
| Amount | `inputmode="decimal"`; accept both comma and point where the locale uses either; show currency outside the field |
| Password | Show and hide control; allow paste and password managers; state the rules before typing, and show which are met |
| Search | `type="search"`, a visible label or accessible name, clear button, submit on Enter |

General rules: never disable paste; never clear a field on error; accept input leniently and normalize it (trim spaces, ignore case, strip separators) instead of rejecting it; keep the field's value when the user navigates back; save drafts of long forms automatically and say so.

## Validation

| When | Do |
| --- | --- |
| While typing | Nothing negative. Positive confirmation is fine for rules being met (password strength, username available) |
| On leaving a field (blur) | Validate that field if it has content; show the error then |
| After an error is shown | Re-validate as the user types so the error clears the moment it is fixed |
| On submit | Validate everything; keep all values; focus the first invalid field; show a summary at the top of a long form linking to each problem |
| Server-side errors | Map them to the field when possible; otherwise show at the form level with what to do |

Messages say how to fix the problem in plain words and give an example when the format is not obvious. One message per field at a time. Do not disable the submit button to signal invalid input: people cannot tell why it is disabled. Leave it enabled and explain on submit. Disable it only while a submission is in progress.

## Choices

- Fewer than about five options: show them all (radios or checkboxes). Hiding three options in a dropdown costs two extra interactions.
- Preselect the most common choice when there is one and it is safe to assume; never preselect consent or paid add-ons.
- Long lists get search. Country lists accept typing the name in the user's language.
- Dependent fields appear in place when their condition is met, without moving what is above them.

## Multi-step forms

Use steps when the form is long, the sections are distinct, or later questions depend on earlier answers. Otherwise a single page with headed sections is faster.

- Show step names and position; allow going back without loss.
- Validate each step before moving on.
- Save progress automatically; let users resume on another device when the product supports accounts.
- End with a review that shows every answer with an edit link, then a clearly labeled commit button.

## Submission

```text
Idle:      [Create shipment]
Pending:   [Creating…] spinner in place, same width, further clicks ignored
Success:   Go to the result, or show a confirmation with the reference and next step
Failure:   Message at the top and at the fields; everything still filled in; focus on the message
Unknown:   "We are still confirming. Check status" before any retry of a non-repeatable action
```

The button label names the outcome ("Create shipment", "Save address", "Pay ₾48.00"), not "Submit".

## Checks

| Check | Pass |
| --- | --- |
| Reduction | Every field justified; derivable and deferrable ones removed |
| Labels | Visible, associated, in the user's words |
| Keyboard | Logical tab order; Enter submits; correct mobile keyboards and autofill |
| Errors | Specific, at the field, announced, values preserved, first invalid field focused |
| Lenient input | Paste works; spaces, case, and separators tolerated |
| Submission | No double submit; pending, success, failure, and unknown handled |
| Narrow and zoomed | Usable at 320px and 200% zoom with the on-screen keyboard open |
