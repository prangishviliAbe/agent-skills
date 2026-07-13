# Codex Skills

პროდუქტზე ორიენტირებული, production-grade პირადი სქილების ნაკრები Codex-ისთვის. თითოეული ფოლდერი შეიცავს `SKILL.md`-ს და Codex-ის UI metadata-ს `agents/openai.yaml`-ში; საჭიროების შემთხვევაში დამატებულია references.

## სქილები

| სქილი | დანიშნულება |
| --- | --- |
| `web-development` | Production web architecture და end-to-end implementation |
| `ui-ux` | Product flows, interaction systems, accessibility და handoff |
| `anti-ai-slop-design` | Brand-specific visual craft generic AI aesthetics-ის გარეშე |
| `premium-web-motion` | Purposeful, accessible და performant interface motion |
| `security` | Evidence-based security audit, threat modeling და hardening |
| `token-efficiency` | სრული პასუხები მაქსიმალური signal density-ით |

## Codex-ში გლობალურად დაყენება

### macOS / Linux

```bash
mkdir -p ~/.codex/skills
for skill in web-development ui-ux anti-ai-slop-design premium-web-motion security token-efficiency; do
  rm -rf "$HOME/.codex/skills/$skill"
  cp -R "$skill" "$HOME/.codex/skills/$skill"
done
```

### Windows PowerShell

```powershell
$skills = @(
  'web-development',
  'ui-ux',
  'anti-ai-slop-design',
  'premium-web-motion',
  'security',
  'token-efficiency'
)

New-Item -ItemType Directory -Force -Path "$HOME\.codex\skills" | Out-Null

foreach ($skill in $skills) {
  $target = "$HOME\.codex\skills\$skill"
  if (Test-Path -LiteralPath $target) {
    Remove-Item -Recurse -Force -LiteralPath $target
  }
  Copy-Item -Recurse -LiteralPath ".\$skill" -Destination $target
}
```

Codex-ის ახალი task გახსენი ან აპი გადატვირთე, რათა განახლებული metadata და trigger-ები ჩაიტვირთოს.

## გამოყენება

Codex შესაბამის სქილს ავტომატურად ირჩევს task-ის მიხედვით. Explicit invocation-ის მაგალითები:

```text
$web-development implement this Next.js feature end to end
$ui-ux review this onboarding flow
$anti-ai-slop-design remove generic AI styling from this landing page
$premium-web-motion design an accessible motion system
$security audit this API authorization boundary
$token-efficiency summarize the result briefly
```

რამდენიმე სქილი შეიძლება ერთად გამოიყენო, მაგალითად `$web-development`, `$ui-ux`, `$security` და `$anti-ai-slop-design` სრული product implementation-ისთვის.

## Google Antigravity

`SKILL.md` ინსტრუქციების გამოყენება შესაძლებელია Antigravity-შიც. დააკოპირე შესაბამისი skill folders:

```bash
mkdir -p ~/.gemini/antigravity/skills
cp -R web-development ui-ux anti-ai-slop-design premium-web-motion security token-efficiency \
  ~/.gemini/antigravity/skills/
```

`agents/openai.yaml` Codex-ის metadata-აა; სხვა runtime-მა შეიძლება უბრალოდ უგულებელყოს.
