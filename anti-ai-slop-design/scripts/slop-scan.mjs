#!/usr/bin/env node
// Finds candidate AI-slop patterns in front-end source. Zero dependencies.
// Usage: node slop-scan.mjs [--json] [--strict] <file-or-directory> [...]
// Hits are prompts to look, not verdicts. Put "slop-ok: reason" in a comment
// on a line to acknowledge a deliberate, functional use.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const EXTENSIONS = new Set([
  '.html', '.htm', '.css', '.scss', '.sass', '.less', '.js', '.jsx', '.ts', '.tsx', '.mjs',
  '.vue', '.svelte', '.astro', '.php', '.twig', '.liquid', '.erb', '.mdx',
]);
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.svelte-kit', '.astro',
  'vendor', 'coverage', '.cache', '.turbo', '.vercel',
]);
const MAX_BYTES = 1_000_000;
const AI_HUES = '(?:purple|violet|indigo|fuchsia|pink|blue|cyan|sky)';

// level: "warn" = hard-banned motif unless requested; "check" = confirm it was decided.
export const RULES = [
  { id: 'gradient-text', level: 'warn', re: /bg-clip-text|background-clip:\s*text/, note: 'Gradient text. Use a solid color; emphasize with weight, size, or position.' },
  { id: 'ai-gradient', level: 'warn', re: new RegExp(`from-${AI_HUES}-\\d{2,3}\\b.*\\b(?:via|to)-${AI_HUES}-\\d{2,3}`), note: 'Purple/blue/pink gradient. Use a flat color derived from the subject.' },
  { id: 'default-violet', level: 'warn', re: /#(?:6366f1|8b5cf6|7c3aed|a855f7|4f46e5|818cf8|a78bfa|c084fc|9333ea)\b/i, note: 'Framework default indigo/violet hex. Define the project\'s own accent.' },
  { id: 'default-palette', level: 'check', re: /\b(?:bg|text|border|ring|from|to|via)-(?:indigo|violet|purple|fuchsia)-\d{2,3}\b/, note: 'Default Tailwind violet family. Confirm this is the approved brand color, then tokenize it.' },
  { id: 'glass', level: 'warn', re: /backdrop-blur|backdrop-filter:\s*[^;]*blur/, note: 'Backdrop blur. Use an opaque surface unless a bar scrolls over content.' },
  { id: 'glow', level: 'warn', re: new RegExp(`shadow-${AI_HUES}-\\d{2,3}|drop-shadow\\([^)]*(?:#(?:6366f1|8b5cf6|a855f7)|purple|violet)|box-shadow:[^;]*\\b0\\s+0\\s+\\d{2,}px`), note: 'Colored or zero-offset glow shadow. Use a neutral shadow from one light direction, or none.' },
  { id: 'blob', level: 'warn', re: /\bblur-(?:2xl|3xl)\b|blur-\[\d{2,3}px\]|filter:\s*blur\((?:[4-9]\d|\d{3,})px\)/, note: 'Large blur, usually a background blob. Remove atmospheric decoration.' },
  { id: 'accent-stripe', level: 'warn', re: /\bborder-[ltrb]-(?:4|8)\b|border-(?:left|top|inline-start):\s*[3-9]px\s+solid/, note: 'Accent stripe on one edge. Distinguish by tone, label, or placement.' },
  { id: 'hover-scale', level: 'warn', re: /hover:(?:scale-1(?:0[2-9]|[1-9]\d)|-translate-y-[1-9])|:hover\s*\{[^}]*transform:\s*(?:scale\(1\.|translateY\(-)/, note: 'Decorative hover lift or scale. Give real controls a tone change instead.' },
  { id: 'transition-all', level: 'warn', re: /\btransition-all\b|transition:\s*all\b/, note: 'transition: all. Name the properties and keep feedback near 120 to 200ms.' },
  { id: 'loop-animation', level: 'warn', re: /\banimate-(?:pulse|ping|bounce|spin-slow|float|shimmer|gradient)\b|animation:[^;]*\binfinite\b/, note: 'Looping animation. Keep only for real progress or live status.' },
  { id: 'overshoot', level: 'warn', re: /cubic-bezier\(\s*[\d.]+\s*,\s*(?:1\.[1-9]\d*|[2-9])|cubic-bezier\(\s*[\d.]+\s*,\s*-?[\d.]+\s*,\s*[\d.]+\s*,\s*(?:1\.[1-9]\d*|[2-9])|type:\s*['"]spring['"][^}]*bounce:\s*0\.[4-9]/, note: 'Bouncy overshoot easing. Use a short ease-out for interface motion.' },
  { id: 'reveal-on-scroll', level: 'check', re: /\bwhileInView\b|data-aos=|\bscroll-reveal\b|animate-fade-(?:in|up)|fadeInUp/, note: 'Scroll-reveal animation. Content should be visible without it; keep only where a state change needs explaining.' },
  { id: 'gimmick-motion', level: 'warn', re: /react-countup|\bCountUp\b|typewriter|TypeAnimation|typed\.js|tsparticles|particles\.js|\bLenis\b|vanilla-tilt|<marquee|animate-marquee/i, note: 'Count-up, typewriter, particles, tilt, marquee, or scroll hijack. Show the content directly.' },
  { id: 'filler-icon', level: 'check', re: /import\s*\{[^}]*\b(?:Sparkles?|Wand2?|Rocket|Zap|Stars?|Bot)\b[^}]*\}\s*from\s*['"](?:lucide|@heroicons|react-icons|@tabler)/, note: 'Filler icon (sparkle, rocket, bolt, wand). Say the capability in words.' },
  { id: 'emoji', level: 'check', re: /[\u{1F300}-\u{1FAFF}\u{2728}\u{26A1}\u{2B50}\u{2705}\u{1F680}]/u, note: 'Emoji in interface source. Use text or the project icon set.' },
  { id: 'slop-copy', level: 'warn', re: /\b(?:unlock(?:s|ing)? (?:the|your)|unleash|supercharge|seamless(?:ly)?|effortless(?:ly)?|revolutioni[sz]e|next-gen(?:eration)?|cutting-edge|game-chang(?:er|ing)|world-class|best-in-class|all-in-one|elevate your|empower(?:s|ing)? (?:you|your|teams)|to the next level|say goodbye to|reimagined|blazing(?:ly)? fast|in today's fast-paced)\b/i, note: 'Stock marketing phrase. Replace with a specific, true statement.' },
  { id: 'fake-proof', level: 'warn', re: /trusted by\s+(?:over\s+)?[\d,.]+\s*[km+]?|\b\d{1,3}(?:,\d{3})+\+\s+(?:users|customers|teams|developers)|loved by (?:developers|teams|thousands)|\b4\.[89]\s*(?:\/\s*5|stars?)/i, note: 'Proof claim. Keep only if true and sourced.' },
  { id: 'placeholder-content', level: 'warn', re: /\b(?:John|Jane) (?:Doe|Smith)\b|\bAcme(?: Inc| Corp|,)?\b|lorem ipsum|example@example\.com/i, note: 'Placeholder content. Use real or realistic, labeled sample content.' },
  { id: 'generic-cta', level: 'check', re: />\s*(?:Get Started|Learn More|Click Here|Submit)\s*</i, note: 'Generic action label. Use verb plus object naming what happens.' },
  { id: 'default-font', level: 'check', re: /font-family:\s*['"]?(?:Inter|Poppins|Roboto|Montserrat|Space Grotesk|Geist)\b|next\/font\/google['"]/, note: 'Common default typeface. Fine if chosen for a reason; confirm it was.' },
  { id: 'eyebrow', level: 'check', re: /uppercase[^"'`]*tracking-(?:wide|wider|widest)|tracking-(?:wide|wider|widest)[^"'`]*uppercase/, note: 'Uppercase tracked label. Keep only where it orients the reader.' },
  { id: 'focus-removed', level: 'warn', re: /outline:\s*(?:none|0)\b|\boutline-none\b/, skipIf: /focus-visible/, note: 'Focus outline removed. Provide a visible :focus-visible style.' },
  { id: 'viewport-height', level: 'check', re: /\b100vh\b|\b(?:min-)?h-screen\b/, note: '100vh is cut by mobile browser chrome. Use svh or dvh with a fallback.' },
  { id: 'important', level: 'check', re: /!important/, note: '!important. Fix the cascade instead.' },
];

// Whole-file counts: one recipe applied to every box.
export const COUNT_RULES = [
  { id: 'uniform-radius', level: 'check', re: /\brounded-(?:2xl|3xl)\b/g, min: 8, note: 'Large radius used many times in one file. Decide a radius family by element size.' },
  { id: 'uniform-shadow', level: 'check', re: /\bshadow-(?:lg|xl|2xl)\b/g, min: 6, note: 'Large shadow used many times in one file. Reserve shadows for floating elements.' },
];

export function scanText(text, file = '') {
  const hits = [], acknowledged = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.length > 2000) return; // minified or generated
    for (const rule of RULES) {
      if (!rule.re.test(line)) continue;
      if (rule.skipIf && rule.skipIf.test(line)) continue;
      const entry = { rule: rule.id, level: rule.level, file, line: index + 1, note: rule.note, text: line.trim().slice(0, 140) };
      (/slop-ok/i.test(line) ? acknowledged : hits).push(entry);
    }
  });
  for (const rule of COUNT_RULES) {
    const count = (text.match(rule.re) || []).length;
    if (count >= rule.min) hits.push({ rule: rule.id, level: rule.level, file, line: 0, note: rule.note, text: `${count} occurrences` });
  }
  return { hits, acknowledged };
}

export function collectFiles(target, files = []) {
  const stat = statSync(target);
  if (stat.isFile()) {
    if (EXTENSIONS.has(extname(target).toLowerCase()) && stat.size <= MAX_BYTES && !/\.min\./.test(target)) files.push(target);
  } else if (stat.isDirectory()) {
    for (const entry of readdirSync(target, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory() && (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.'))) continue;
      collectFiles(join(target, entry.name), files);
    }
  }
  return files;
}

export function scanPaths(targets, base = process.cwd()) {
  const result = { files: 0, hits: [], acknowledged: [] };
  for (const target of targets) {
    for (const file of collectFiles(resolve(target))) {
      result.files += 1;
      const scanned = scanText(readFileSync(file, 'utf8'), relative(base, file).replace(/\\/g, '/'));
      result.hits.push(...scanned.hits);
      result.acknowledged.push(...scanned.acknowledged);
    }
  }
  return result;
}

function main(argv) {
  const flags = new Set(argv.filter(arg => arg.startsWith('--')));
  const targets = argv.filter(arg => !arg.startsWith('--'));
  const unknown = [...flags].filter(flag => !['--json', '--strict', '--help'].includes(flag));
  if (flags.has('--help') || !targets.length || unknown.length) {
    console.error('Usage: node slop-scan.mjs [--json] [--strict] <file-or-directory> [...]');
    return flags.has('--help') ? 0 : 2;
  }
  let result;
  try { result = scanPaths(targets); }
  catch (error) { console.error(`slop-scan: ${error.message}`); return 2; }
  const warnings = result.hits.filter(hit => hit.level === 'warn');
  const checks = result.hits.filter(hit => hit.level === 'check');
  if (flags.has('--json')) {
    console.log(JSON.stringify({ files: result.files, warnings, checks, acknowledged: result.acknowledged }, null, 2));
  } else {
    const print = (title, list) => {
      if (!list.length) return;
      console.log(`\n${title}`);
      const byRule = new Map();
      for (const hit of list) byRule.set(hit.rule, [...(byRule.get(hit.rule) || []), hit]);
      for (const [rule, group] of byRule) {
        console.log(`\n  ${rule} (${group.length}) - ${group[0].note}`);
        for (const hit of group.slice(0, 12)) console.log(`    ${hit.file}${hit.line ? `:${hit.line}` : ''}  ${hit.text}`);
        if (group.length > 12) console.log(`    ... ${group.length - 12} more`);
      }
    };
    print('WARN: remove or replace unless explicitly requested', warnings);
    print('CHECK: confirm this was a decision', checks);
    console.log(`\nScanned ${result.files} files: ${warnings.length} warnings, ${checks.length} checks, ${result.acknowledged.length} acknowledged.`);
    console.log('A clean scan does not prove a good design. Render and inspect the result.');
  }
  return flags.has('--strict') && warnings.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv.slice(2));
}
