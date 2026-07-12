# Skills — Codex & Google Antigravity

იგივე SKILL.md ფაილები მუშაობს ორივეში. მხოლოდ ფოლდერის გზა განსხვავდება.

---

## Google Antigravity

### Global (ყველა პროექტი)
```bash
mkdir -p ~/.gemini/antigravity/skills/web-development
mkdir -p ~/.gemini/antigravity/skills/ui-ux
mkdir -p ~/.gemini/antigravity/skills/security
mkdir -p ~/.gemini/antigravity/skills/token-efficiency
mkdir -p ~/.gemini/antigravity/skills/anti-ai-slop-design-system

cp -r codex-skills/*/  ~/.gemini/antigravity/skills/
```

### Workspace (ერთი პროექტი)
```bash
cp -r codex-skills/*/  .agent/skills/
```

### GEMINI.md (დამატებითი)
token-efficiency სკილის შინაარსი `GEMINI.md`-ში ჩასვი პროექტის root-ში — ყოველ session-ში ავტომატურად იმუშავებს სკილების გარეშეც.

---

# Codex Skills — Installation Guide

## სტრუქტურა
```
~/.codex/
  skills/
    web-development/
      SKILL.md
    ui-ux/
      SKILL.md
    security/
      SKILL.md
    token-efficiency/
      SKILL.md
    anti-ai-slop-design-system/
      SKILL.md
```

## დაყენება (macOS / Linux)

```bash
# 1. შექმენი skills ფოლდერები
mkdir -p ~/.codex/skills/web-development
mkdir -p ~/.codex/skills/ui-ux
mkdir -p ~/.codex/skills/security
mkdir -p ~/.codex/skills/token-efficiency
mkdir -p ~/.codex/skills/anti-ai-slop-design-system

# 2. დააკოპირე ფაილები
cp web-development/SKILL.md ~/.codex/skills/web-development/SKILL.md
cp ui-ux/SKILL.md           ~/.codex/skills/ui-ux/SKILL.md
cp security/SKILL.md        ~/.codex/skills/security/SKILL.md
cp token-efficiency/SKILL.md ~/.codex/skills/token-efficiency/SKILL.md
cp anti-ai-slop-design-system/SKILL.md ~/.codex/skills/anti-ai-slop-design-system/SKILL.md
```

## გამოყენება

**Implicit** — Codex თვითონ ირჩევს task-ის მიხედვით
> "fix the XSS vulnerability in this plugin" → security სკილი ავტომატურად

**Explicit** — სახელით გამოძახება
> "$web-development build me a Next.js API route"
> "$security audit this PHP file"
> "$ui-ux review this component layout"
> "$token-efficiency" → მოკლე პასუხების რეჟიმი

## Skills ჩართვა (თუ feature flag სჭირდება)
```bash
codex --enable skills
```

## Codex-ის Restart (თუ სკილი არ გამოჩნდა)
```bash
# Codex-ის გადატვირთვა
# App-ში: Cmd+R ან Quit → Reopen
```
