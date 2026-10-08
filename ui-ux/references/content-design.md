# Content Design & Microcopy Craft

Read when: You are writing button labels, empty-state narratives, error descriptions, confirmation dialogues, or designing multilingual interfaces (including Georgian Mkhedruli script).

---

## 1. Actionable Verbs Over Passive Labels

Every call-to-action button must answer the user's mental question: *"What happens the moment I tap this?"*

| Weak / Ambiguous | High-Conversion Actionable Verb |
| --- | --- |
| "Submit" | "Create Project" / "Complete Payment" |
| "OK" | "Confirm Deletion" / "Got It" |
| "Manage" | "Edit Permissions" |
| "Back" | "Cancel without Saving" |
| "Learn More" | "Explore Architecture Guide" |

---

## 2. The 3-Part Error Architecture

Never write "An error occurred". An effective error message delivers three clear pieces of information:
1. **What happened** (without technical jargon).
2. **Why it happened** (the immediate cause).
3. **How to fix it now** (concrete recovery action).

```text
[Weak]:
"Invalid format."

[High-Craft]:
"Password must be at least 8 characters and include at least one number."
```

---

## 3. Empty States that Inspire Action

An empty state is an onboarding opportunity, not a dead end. Include:
1. A refined, low-opacity contextual illustration or icon.
2. A clear title explaining what will live here.
3. A single primary CTA that triggers creation immediately.

```html partial
<div class="empty-state-card">
  <div class="empty-icon-halo">
    <svg class="empty-icon" viewBox="0 0 24 24"><path d="..." /></svg>
  </div>
  <h3 class="empty-title">No API keys generated yet</h3>
  <p class="empty-description">
    Create your first production API key to start querying our streaming models.
  </p>
  <button class="tactile-button primary">
    Generate API Key
  </button>
</div>
```

---

## 4. Georgian Script (Mkhedruli) Typography Craft

Georgian (ქართული დამწერლობა) does not feature classic Latin ascenders/descenders in the same proportions, and Mkhedruli letters have distinct circular baselines.

### Typography Rules for Georgian UI:
1. **Font Matching:** Pair clean Latin geometric sans (Inter, Geist, Satoshi) with modern Georgian fonts that match stroke weight and x-height (e.g. `FiraGO`, `Noto Sans Georgian`, or `BPG`).
2. **Line-Height Compensation:** Georgian text requires approximately `5%–8%` more vertical `line-height` than Latin English to prevent circular diacritics and bowls from feeling compressed.
3. **No Fake Bold or Squashed Glyphs:** Use genuine variable font weights. Avoid synthetic italicization or tight letter-spacing (`letter-spacing < 0`) on Georgian script, as it merges adjacent rounded glyphs (e.g. `ო`, `თ`, `ფ`).

```css
/* Georgian typography optimization */
:lang(ka) {
  font-family: "FiraGO", "Noto Sans Georgian", -apple-system, sans-serif;
  line-height: 1.6;
  letter-spacing: 0.01em;
}
```
