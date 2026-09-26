# Agent Skills

**ავტორი: [Abe Prangishvili](https://github.com/prangishviliAbe)**

პორტაბელური, პრაქტიკული სქილების ნაკრებია Codex-ისთვის, Claude Code-ისთვის, Antigravity-ისთვის და ნებისმიერი აგენტისთვის, რომელსაც Markdown ინსტრუქციის წაკითხვა შეუძლია. თითოეული სქილი იწყება მოკლე, გადაწყვეტილებაზე ორიენტირებული წესებით და საჭიროებისას გადადის შესაბამის reference ფაილში.

სქილი არ ცვლის მომხმარებლის არჩევანს. ის ეხმარება აგენტს სწორად შეაფასოს მოცულობა, მტკიცებულება, რისკი და შემდეგი ქმედება — ზედმეტი პროცესის ან დაუმოწმებელი დაპირებების გარეშე.

## სქილები

| სქილი | როდის გამოიყენება | რა აუმჯობესებს |
| --- | --- | --- |
| `web-development` | ვებსაიტის, API-ის, ინტეგრაციის, WordPress-ის ან რელიზის შექმნა, შეცდომის გამოსწორება და რევიუ | არსებული კონტრაქტის დაცვა, თანაზომიერი ვერიფიკაცია, idempotency, ავტორიზაცია და რეალური handoff |
| `ui-ux` | UX flow, ფორმა, dashboard, navigation, responsive ან accessibility სამუშაო | მიზნობრივი flow/state specification, recovery, ფოკუსი და რეალურად შემოწმებული მტკიცებულება |
| `anti-ai-slop-design` | ვიზუალური მიმართულება, ინტერფეისის polish, ბრენდზე დაფუძნებული დიზაინი | გამორჩეული, მაგრამ ბრენდისა და კონტენტის შესაბამისი ვიზუალური გადაწყვეტილებები generic „ანტი-პატერნების“ ბრმად აკრძალვის გარეშე |
| `premium-web-motion` | motion, hover, dialog, transition, scroll, gesture ან animation audit | interruption-safe state, motion შემცირების გზა, progressive enhancement და შესრულების სწორი შემოწმება |
| `security` | threat model, code audit, exploitability analysis, incident ან hardening | კონკრეტული trust boundary, მტკიცებულებაზე დაფუძნებული finding, ზუსტი confidence და უსაფრთხო remediation |
| `token-efficiency` | მოკლე პასუხი, TL;DR, concise status, „just code“ | ნაკლები ტექსტი ისე, რომ არ დაიკარგოს შედეგი, მტკიცებულება, საჭირო სიღრმე ან მნიშვნელოვანი გაურკვევლობა |

`SKILL.md`-ში არის როდის გამოიყენო რომელ reference-ი. სხვა სქილთან მიბმულობა არ არსებობს — ერთი საქაღალდის კოპირებაც სრულფასოვან ინსტრუქციას ტოვებს.

## ინსტალაცია

```bash
git clone https://github.com/prangishviliAbe/agent-skills.git
cd agent-skills
```

### macOS / Linux

```bash
./install.sh                 # Codex
./install.sh claude          # Claude Code
./install.sh antigravity     # Antigravity
./install.sh all             # სამივე
./install.sh ./my-skills     # სხვა საქაღალდე
./install.sh all --dry-run   # მხოლოდ გეგმის ნახვა
```

### Windows PowerShell

```powershell
.\install.ps1
.\install.ps1 claude
.\install.ps1 antigravity
.\install.ps1 all
.\install.ps1 D:\my-skills
.\install.ps1 all -DryRun
```

ინსტალატორი ანაცვლებს მხოლოდ ამ რეპოზიტორიის ექვსი სქილის არსებულ ვერსიას. სხვა სქილებს, მათ შორის runtime-ის სისტემურ სქილებს, არ ეხება. ჯერ ყველა ახალი საქაღალდე staging-ში კოპირდება და შიგთავსი მოწმდება; შემდეგ იცვლება არსებული ვერსიები. ძველი ვერსიები ინახება target-ის მშობელ საქაღალდეში `.agent-skills-backups/`-ში. შეცდომისას ინსტალატორი ცდილობს სრულ აღდგენას და backup-ის მდებარეობას აჩვენებს.

Codex განახლებულ სქილებს შემდეგ user turn-ზე იპოვის. სხვა runtime-ში ხელახლა გახსენი სესია, თუ მისი skill list cache-დება.

## გამოყენება

```text
$web-development fix this checkout retry without duplicate charges
$ui-ux specify recovery states for this onboarding flow
$anti-ai-slop-design refine this landing page without changing the brand
$premium-web-motion make this dialog interruption-safe and accessible
$security audit this export authorization boundary
$token-efficiency summarize the completed work briefly
```

`$` Codex-ის გამოძახების სინტაქსია. სხვა runtime-ში ახსენე სქილის სახელი და მიეცი მისი `SKILL.md`.

## ხარისხის შემოწმება

```bash
npm ci --ignore-scripts
npm run check
```

`npm run check` ამოწმებს სქილების frontmatter-ს, metadata-ს, attribution-ს, reachable local რესურსებს, ბმულების self-containment-სა და symlink-ების საფრთხეს. ასევე ტესტავს Bash და PowerShell ინსტალატორების staging, rollback, lock, dry-run, source/destination overlap და ძველი ვერსიის შენარჩუნების სცენარებს.

`tests/evals/` შეიცავს ხელით გასაშვებ, რეალისტურ სცენარებს სქილის ქცევის შესაფასებლად. ისინი არ არის ავტომატურად შესრულებული ტესტები; დეტალური ინსტრუქციაა [tests/evals/README.md](tests/evals/README.md).

## სხვა runtime-ები

| Runtime | ინსტალაციის ადგილი | გამოძახება |
| --- | --- | --- |
| Codex | `~/.codex/skills` | ავტომატურად description-ით ან `$skill-name` |
| Claude Code | `~/.claude/skills` | სქილის სახელის მითითებით ან ავტომატურად |
| Antigravity | `~/.gemini/antigravity/skills` | სესიის skill discovery-ით |
| Cursor / Windsurf / Zed | პროექტში, მაგალითად `.ai/skills/` | rule-ში მიუთითე შესაბამისი `SKILL.md` |
| Custom harness | ნებისმიერი ხელმისაწვდომი გზა | წააკითხე `<path>/SKILL.md` დავალებამდე |

სრული ავტორინგისა და ცვლილების წესები იხილე [AGENTS.md](AGENTS.md).
