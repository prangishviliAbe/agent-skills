# Content design: the words in the interface

Read when writing or reviewing labels, buttons, errors, empty states, confirmations, notifications, onboarding, or any UI text. Good copy removes a decision or an error; it is not decoration.

## Principles

- **Plain and specific.** Use the user's words and the shortest accurate phrase. "Couldn't save your changes" beats "An error occurred."
- **Front-load.** Put the information that matters first in a label, heading, or message.
- **Name the thing and the action.** "Delete invoice", not "Delete". "Add teammate", not "Add".
- **One term per concept** across the product. Pick "workspace" or "project" and stay with it.
- **Sentence case** for UI text unless the brand dictates otherwise. No blame, no jargon, no cleverness where the user is stuck, afraid, or in a hurry.
- **Do not promise what the system cannot establish:** "Saved" only after confirmation, "Nothing was charged" only when known.

## Patterns and templates

| Element | Pattern | Example |
| --- | --- | --- |
| Button | Verb plus object | "Save draft", "Send invoice", "Download report" |
| Field label | Noun, persistent, above or beside the field | "Work email" (the placeholder shows `name@company.com`) |
| Help text | Format or reason, before the error happens | "Use at least 15 characters. A passphrase works well." |
| Validation error | What is wrong, how to fix it | "Enter a date after 1 March 2026." |
| Request failure | What happened, what is safe, what to do | "We couldn't save your changes. Your edits are still here. Try again." |
| Unknown outcome | State that it is unknown, then how it will be resolved | "We couldn't confirm the payment. We're checking now; don't pay again. We'll email you." |
| Success | The result, and the next step if there is one | "Invoice sent to Acme Ltd. View invoice" |
| Empty, first use | Why it is empty, the value of acting, one action | "No invoices yet. Create one to start getting paid. Create invoice" |
| Empty, no results | The query or filter, and a way out | "No invoices match "Acme" with status Paid. Clear filters" |
| Empty, by design | Say it is fine, no call to action | "No alerts. You're all caught up." |
| No access | What is restricted and how to get access | "You need Admin access to view billing. Ask your workspace owner." |
| Destructive confirmation | Title states action and object; body states the consequence; buttons mirror verbs | Title "Delete invoice INV-1042?"; body "This permanently removes the invoice and its payment history."; buttons "Delete invoice" and "Keep invoice" |
| Loading | What is happening, only if it takes a noticeable time | "Importing 1,240 rows…" |
| Permission or paywall | The benefit, the requirement, the way forward | "Scheduled exports are on the Team plan. Compare plans" |

## Before and after

| Before | After | Why |
| --- | --- | --- |
| "Submit" | "Create account" | Names the outcome |
| "Invalid input" | "Enter an email like name@company.com." | Says how to fix it |
| "Error 500" | "Something went wrong on our side. Try again in a minute." | Honest, actionable, no internals |
| "Are you sure?" | "Delete 3 invoices? This can't be undone." | States object and consequence |
| "Click here" | "Read the refund policy" | Meaningful out of context and for screen readers |
| "You have entered an incorrect password." | "That password doesn't match. Try again or reset it." | No blame, gives the next step |
| "Success!" | "Changes saved." | Says what succeeded |
| "No data" | "No orders in this date range. Try a wider range." | Explains and offers recovery |

## Localization-ready strings

- Write whole sentences as single strings. Do not concatenate fragments ("You have " + n + " items"); use the message format's plural and select rules.
- Avoid idioms, humor that does not translate, and embedded text in images. Leave room: some languages run longer than English, and expansion varies by word.
- Keep variables meaningful (`{count}`, `{projectName}`) so translators can reorder them.
- For Georgian: decide formal ("თქვენ") or informal ("შენ") address once, with the brand, and apply it everywhere. Check casing rules for headings and buttons against the chosen font (Mtavruli capitals exist but are a deliberate styling choice), and review translations with a fluent speaker; a draft translation is not final copy.
- Format dates, numbers, and currency with locale-aware APIs while preserving explicit product rules for currency and time zone.

## Review checklist

- Can each button and link be understood without the surrounding text?
- Does every error say what happened, what is preserved, and what to do next?
- Do empty states differ by cause (first use, no results, no access, correctly empty)?
- Is the same concept always the same word?
- Does any message claim a result the system cannot confirm?
- Is anything essential only in a placeholder, tooltip, or disappearing toast?
