# Multilingual & Georgian Typography Craft

Read when: You are designing typography for Georgian (ქართული დამწერლობა) or non-Latin scripts, harmonizing dual-language layouts, or adjusting line-height and x-height.

---

## 1. The Anatomy of Georgian Mkhedruli Script

Georgian Mkhedruli (მხედრული) is a non-cased alphabet with organic, circular letterforms (`ა`, `ბ`, `გ`, `დ`...). Unlike Latin, it does not share standard ascender and descender proportions.

### Critical Typography Rules:
1. **Vertical Space & Line Height:** Georgian circular glyphs demand breathing room. Increase `line-height` by **5%–8%** relative to Latin counterparts (`line-height: 1.6` to `1.75`).
2. **Never Apply Negative Letter-Spacing:** Mkhedruli glyphs feature intricate enclosed counters and curves. Tight tracking causes adjacent letters (`ო`, `თ`, `ფ`, `ყ`) to touch and illegibly merge.
3. **Font Pairing Harmony:** Pair modern Latin typefaces with geometric Georgian fonts of equivalent stroke thickness:
   - *FiraGO* (designed specifically for multilingual consistency with 11+ scripts).
   - *Noto Sans Georgian* (flawless metric compatibility with Noto Sans / Roboto).
   - *BPG Modern Georgian* (high-character editorial headings).

```css
/* Dual language typography foundation */
:lang(ka) {
  font-family: "FiraGO", "Noto Sans Georgian", system-ui, sans-serif;
  line-height: 1.65;
  letter-spacing: 0.01em;
}

/* Mixed Latin + Georgian display headings */
.multilingual-heading {
  font-feature-settings: "kern" 1, "liga" 1;
}
```
