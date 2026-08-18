# Agent Skills

**ავტორი: [Abe Prangishvili](https://github.com/prangishviliAbe)**

Portable, production-grade სქილების ნაკრები **ნებისმიერი AI კოდირების აგენტისთვის** — Codex, Claude Code, Antigravity, Cursor, Windsurf ან საკუთარი harness.

თითოეული სქილი დაწერილია როგორც **სამუშაო პროცედურა** — მკაცრი წესები, გადაწყვეტილების ცხრილები, failure-mode-ების რუკა და დასრულების ბინარული კრიტერიუმები. ეს არ არის ზოგადი რჩევების კრებული: ყოველი წესი ან კონკრეტულ ქმედებას კარნახობს, ან კონკრეტულ შეცდომას კეტავს.

**ფორმატი მოდელისთვისაა და არა runtime-ისთვის.** სქილი უბრალო markdown-ია სტანდარტული YAML frontmatter-ით (`name` + `description`), ამიტომ მუშაობს ყველგან, სადაც აგენტს ფაილის წაკითხვა შეუძლია — მაშინაც კი, თუ runtime-ს საერთოდ არ აქვს „skills" სისტემა.

## სტრუქტურა

```
<skill>/
├── SKILL.md            # პროცედურა: წესები, ნაბიჯები, reference-ების რუკა, definition of done
├── agents/openai.yaml  # Codex-ის UI metadata (სხვა runtime-ები უბრალოდ უგულებელყოფენ)
└── references/         # სიღრმე — იტვირთება მხოლოდ მაშინ, როცა ამოცანა მას ითხოვს
```

**პრინციპი — progressive disclosure.** `SKILL.md` მოკლეა (< 220 ხაზი) და მარშრუტიზაციას აკეთებს; დეტალები `references/`-შია, რომ კონტექსტი მხოლოდ საჭიროებისას დაიხარჯოს.

**თითოეული ფოლდერი თვითკმარია.** სქილებს შორის ბმულები აკრძალულია, რადგან ინსტალაცია ფოლდერობრივად ხდება — `scripts/validate-skills.mjs` ამას ამოწმებს.

## სქილები

| სქილი | დანიშნულება | References |
| --- | --- | --- |
| `web-development` | Production-ის არქიტექტურა და end-to-end delivery: risk tier-ები, verification ladder, diff review, reporting | delivery, frontend, backend, wordpress, debugging, operations |
| `ui-ux` | Flow-ები, IA, სრული state matrix, accessibility, design system, responsive, კრიტიკა | discovery, flows, states, accessibility, design-system, responsive, critique |
| `anti-ai-slop-design` | ბრენდზე მიბმული ვიზუალური ხარისხი generic AI-სტილის გარეშე | visual-thesis, slop-catalog, craft, multilingual, review |
| `premium-web-motion` | მიზნობრივი, შეწყვეტადი და პროფილირებული motion | motion-system, patterns, implementation, performance |
| `security` | Exploitability-first აუდიტი, threat modeling და root-cause hardening | threat-model, access-control, injection, data-protection, wordpress, supply-chain, reporting |
| `token-efficiency` | სრული პასუხი მაქსიმალური signal density-ით | — |

### რას აკეთებს თითოეული კონკრეტულად

- **web-development** — R0–R3 risk tier-ები განსაზღვრავს ვერიფიკაციის სიღრმეს; „არასდროს თქვა რომ შემოწმება გაიარა, თუ არ გაუშვი"; server-side validation/authorization ყოველ mutation-ზე; ცალკე reference WordPress/WooCommerce/Elementor-ისთვის და ცალკე — debugging-ისა და incident-ისთვის.
- **ui-ux** — სრული state matrix (loading, empty, error, partial failure, permission, content extremes); WCAG AA-ს ოპერაციული ზღვრები რიცხვებით; keyboard pattern-ები კომპონენტების მიხედვით; token-ების სამშრიანი არქიტექტურა.
- **anti-ai-slop-design** — slop catalog: ნიმუში → რატომ იკითხება როგორც გენერირებული → რითი ჩაანაცვლო; visual thesis-ის გამოყვანის მეთოდი; ცალკე reference ქართული და მრავალენოვანი ტიპოგრაფიისთვის.
- **premium-web-motion** — motion inventory კოდის წერამდე; duration/easing token-ები; შეწყვეტადობა და reduced-motion როგორც დაპროექტებული გზა და არა გლობალური გამორთვა; frame budget და პროფილირების პროცედურა.
- **security** — ნაპოვნი უნდა იყოს **გზა და არა ნიმუში**: attacker-controlled input + reachable path + სახიფათო sink; priority sweep; AI agent-ებისა და prompt injection-ის თავი; finding-ის და severity-ის შაბლონი.
- **token-efficiency** — რას ჭრი და რას ინარჩუნებ; პასუხის ფორმა მოთხოვნის ტიპის მიხედვით.

## ინსტალაცია

```bash
git clone https://github.com/prangishviliAbe/agent-skills.git
cd agent-skills
```

### macOS / Linux

```bash
./install.sh              # Codex
./install.sh claude       # Claude Code
./install.sh antigravity  # Antigravity
./install.sh all          # სამივე
./install.sh ~/my/dir     # ნებისმიერი სხვა დირექტორია
```

### Windows PowerShell

```powershell
.\install.ps1
.\install.ps1 claude
.\install.ps1 antigravity
.\install.ps1 all
.\install.ps1 D:\my\dir
```

ორივე სკრიპტი ფოლდერს **მთლიანად** ანაცვლებს, ამიტომ წაშლილი ფაილები არ რჩება. ინსტალაციის შემდეგ გახსენი ახალი session, რომ განახლებული metadata და trigger-ები ჩაიტვირთოს.

## Runtime-ები

| Runtime | სად იდება | როგორ გამოიძახება |
| --- | --- | --- |
| **Codex** | `~/.codex/skills` | ავტომატურად `description`-ის მიხედვით, ან `$web-development ...` |
| **Claude Code** | `~/.claude/skills` | ავტომატურად `description`-ის მიხედვით, ან „use the security skill" |
| **Antigravity** | `~/.gemini/antigravity/skills` | ავტომატურად, სესიის დაწყებისას |
| **Cursor / Windsurf / Zed** | პროექტში, მაგ. `.ai/skills/` | rules-ში მიუთითე: „For security work, read and follow `.ai/skills/security/SKILL.md`" |
| **სხვა ნებისმიერი აგენტი** | ნებისმიერი გზა | „Read `<path>/SKILL.md` and follow it for this task" |

ბოლო ორ შემთხვევაში სქილი მაინც სრულად მუშაობს: `SKILL.md` თავადვე ამბობს, რომელი reference ფაილი როდის უნდა წაიკითხოს აგენტმა.

## გამოყენება

```text
$web-development implement this Next.js feature end to end
$ui-ux review this onboarding flow and specify every state
$anti-ai-slop-design remove generic AI styling from this landing page
$premium-web-motion design an accessible, interruptible motion system
$security audit this API authorization boundary
$token-efficiency summarize the result briefly
```

`$` პრეფიქსი Codex-ის სინტაქსია; სხვა runtime-ებში უბრალოდ სქილის სახელი ახსენე.

### კომბინაციები

| ამოცანა | სქილები |
| --- | --- |
| ახალი feature ნულიდან | `ui-ux` → `anti-ai-slop-design` → `web-development` → `security` |
| Landing page-ის რედიზაინი | `anti-ai-slop-design` + `premium-web-motion` |
| WordPress პლაგინის აუდიტი | `security` + `web-development` |
| Production-ის ინციდენტი | `web-development` (debugging.md) → `security` |
| სწრაფი პასუხი | `token-efficiency` |

## ვალიდაცია

```bash
node scripts/validate-skills.mjs
```

ამოწმებს: frontmatter-ის სისწორეს, `name`-ისა და ფოლდერის დამთხვევას, description-ის სიგრძეს, `SKILL.md`-ის მოცულობას, Codex metadata-ს ველებს, ყველა markdown ბმულის არსებობას, ფოლდერს გარეთ გამავალ ბმულებს და მიუბმელ reference ფაილებს. Exit code 1 — შეცდომაზე.

## ავტორინგის კონვენციები

დეტალები — [AGENTS.md](AGENTS.md). მოკლედ:

1. `SKILL.md` არის პროცედურა, არა ესსე. თუ 220 ხაზს გადააჭარბა — სიღრმე `references/`-ში გადადის.
2. ყოველი წესი კონკრეტულია და შესამოწმებელი. „იყავი ფრთხილად" არ არის წესი.
3. Anti-pattern-ს ყოველთვის მიყვება სწორი ქმედება — მარტო აკრძალვა არ მუშაობს.
4. რიცხვები ზედსართავების ნაცვლად: `4.5:1`, `44×44`, `180ms`, `45–75 სიმბოლო`.
5. Cross-skill ბმულები აკრძალულია; საერთო ცოდნა თითოეულ სქილში ცალკე იწერება.
6. ყოველ `SKILL.md`-ს ბოლოში აქვს ავტორის ხაზი — სქილები ფოლდერობრივად კოპირდება, ამიტომ ატრიბუცია თან უნდა მიჰყვეს. ვალიდატორი ამას აიძულებს.
7. Commit-მდე — `node scripts/validate-skills.mjs`.

## ავტორი

**Abe Prangishvili** — [github.com/prangishviliAbe](https://github.com/prangishviliAbe)

ყველა სქილი — `SKILL.md`, `references/` და ინსტრუმენტები — ავტორის შექმნილია. თუ სქილს იყენებ ან ავრცელებ, შეინარჩუნე ატრიბუციის ხაზი `SKILL.md`-ის ბოლოში.
