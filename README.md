# Agent Skills

**ავტორი: [Abe Prangishvili](https://github.com/prangishviliAbe)**

პორტაბელური, პრაქტიკული სქილების ნაკრებია Codex-ისთვის, Claude Code-ისთვის, Antigravity-ისთვის და ნებისმიერი აგენტისთვის, რომელსაც Markdown ინსტრუქციის წაკითხვა შეუძლია. თითოეული სქილი იწყება მოკლე, გადაწყვეტილებაზე ორიენტირებული წესებით და საჭიროებისას გადადის შესაბამის reference ფაილში.

სქილი არ ცვლის მომხმარებლის არჩევანს. ის ეხმარება აგენტს სწორად შეაფასოს მოცულობა, მტკიცებულება, რისკი და შემდეგი ქმედება — ზედმეტი პროცესის ან დაუმოწმებელი დაპირებების გარეშე.

## სქილები

| სქილი | როდის გამოიყენება | რა აუმჯობესებს |
| --- | --- | --- |
| `web-development` | თანამედროვე ვებ-აპლიკაციების აგება, ოპტიმიზაცია და დიაგნოსტიკა (Next.js 16 App Router, React 19 RSC/Server Actions, Tailwind v4, Drizzle/Prisma) | სერვერული არქიტექტურა, ოპტიმისტური UI, Zod-ვალიდაცია, იდემპოტენტური webhook-ები, sub-1.2s LCP და sub-100ms INP Core Web Vitals |
| `ui-ux` | ვიზუალური გასტილვა, ესთეტიკური პერფექციონიზმი, დიზაინ-სისტემები, კომპონენტების სიღრმე, მდგომარეობები, ხელმისაწვდომობა | ზედაპირების განათება, glassmorphism, OKLCH ფერები, bento grid, 7-მდგომარეობიანი მატრიცა, WCAG 2.2 AA და ქართული ტიპოგრაფია |
| `anti-ai-slop-design` | ბესპოკური ვიზუალური იდენტობა, გენერიკული AI შაბლონების ამოძირკვა, არტ-დირექცია, პრემიუმ ესთეტიკა | ვიზუალური თეზისი, დეფოლტ-აუდიტი, სვოპ-ტესტი, ოსტატური ტიპოგრაფიული წყვილები, ასიმეტრიული კომპოზიცია და სპეკულარული ზედაპირები |
| `premium-web-motion` | ინოვაციური, ეგზოტიკური და დახვეწილი ვებ-მოუშენი, ფიზიკის სპრინგები, 120fps კომპოზიტორი | CSS `linear()` სპრინგები, მაგნიტური ღილაკები, 3D card tilt & specular light, View Transitions API, native scroll-driven ანიმაციები |
| `security` | კოდის აუდიტი, საფრთხეების მოდელირება, AI აგენტებისა და ვებ-აპლიკაციების გამკვრივება | Ripgrep აუდიტ-პლეიბუქი, AI Prompt Injection & SSRF სენდბოქს-დაცვა, BOLA/IDOR, Postgres RLS, Argon2id და AES-256-GCM |
| `token-efficiency` | მაღალი სიმკვრივის საინჟინრო კომუნიკაცია, კონტექსტის ეკონომია, ქირურგიული ცვლილებები | ნულოვანი ზედმეტი პრეამბულა (zero fluff), შედეგი-პირველი პრინციპი, კომპაქტური diff-ები და ორენოვანი ტექნიკური სიზუსტე |

თითოეული სქილი არის მოკლე `SKILL.md` (წესები, რეჟიმები, failure modes, definition of done) და `references/` საქაღალდე, რომელიც მხოლოდ საჭიროებისას იკითხება: ცხრილები, შაბლონები, ბრძანებები და გამოსაცდელი კოდი.

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

### PowerShell 7.2+ (Windows)

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

`npm run check` ამოწმებს სქილების frontmatter-ს, metadata-ს, attribution-ს, reachable local რესურსებს, ბმულების self-containment-სა და symlink-ების საფრთხეს, ასევე იმას, რომ ყველა კოდის ბლოკს აქვს ენა და JSON/YAML ბლოკები იპარსება (ილუსტრაციული ფრაგმენტები აღინიშნება `partial`-ით). ასევე ტესტავს Bash და PowerShell ინსტალატორების staging, rollback, lock, dry-run, source/destination overlap და ძველი ვერსიის შენარჩუნების სცენარებს.

`tests/evals/` შეიცავს ხელით გასაშვებ, რეალისტურ სცენარებს სქილის ქცევის შესაფასებლად. ისინი არ არის ავტომატურად შესრულებული ტესტები; დეტალური ინსტრუქციაა [tests/evals/README.md](tests/evals/README.md).

## სხვა runtime-ები

| Runtime | ინსტალაციის ადგილი | გამოძახება |
| --- | --- | --- |
| Codex | `~/.codex/skills` | ავტომატურად description-ით ან `$skill-name` |
| Claude Code | `~/.claude/skills` | სქილის სახელის მითითებით ან ავტომატურად |
| Antigravity | `~/.gemini/config/skills` | სესიის skill discovery-ით |
| Cursor / Windsurf / Zed | პროექტში, მაგალითად `.ai/skills/` | rule-ში მიუთითე შესაბამისი `SKILL.md` |
| Custom harness | ნებისმიერი ხელმისაწვდომი გზა | წააკითხე `<path>/SKILL.md` დავალებამდე |

სრული ავტორინგისა და ცვლილების წესები იხილე [AGENTS.md](AGENTS.md).
