# Content as visual structure

Read when: Writing or fitting labels, actions, hints, errors, empty states, or localized UI copy.

| Situation | Useful copy | Avoid |
| --- | --- | --- |
| Primary action | Verb and object: "Find shipment" | Vague "Continue" where consequence is unclear |
| Field hint | Required format or prerequisite | Repeating the label |
| Validation | "Enter the shipment ID from your receipt." | "Invalid input" |
| No matches | "No shipments match this ID. Check the ID and try again." | An empty decorative illustration alone |
| Unknown result | "We have not confirmed the update yet." | Calling an unresolved request failed |
| Deletion | Name the object and consequence | Generic "Are you sure?" |
| AI draft | "Draft ready. Review before sending." | Claiming the email was sent |

Keep errors near their cause, preserve safe inputs, and offer an actual recovery route. Use truthful progress labels rather than fake live activity.

Fit real Georgian and English text with verified font coverage, weights, line breaks, and button dimensions. Start with natural spacing; adjust leading and tracking by observed behavior. Do not impose a fixed language expansion ratio or blanket uppercase styling.

## Content-fit fixture

```text
Short action: Save
Long action: Save delivery instructions
Georgian action: მიწოდების ინსტრუქციის შენახვა
Long name: Abe Prangishvili / აბე პრანგიშვილი
Empty result: No shipments match these filters.
Pending: Saving delivery instructions…
Error: We could not save these instructions. Your text is still here.
```

Use a fixture to find overflow, then test the real supported content. Labels must remain available beyond placeholders and tooltips.
