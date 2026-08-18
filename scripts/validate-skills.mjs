#!/usr/bin/env node
// Validates every skill folder in this repo.
// Usage: node scripts/validate-skills.mjs
// Exit 0 = all checks pass, 1 = at least one error.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const LIMITS = {
  descriptionMin: 80,
  descriptionMax: 1024,
  skillBodyLines: 220,      // SKILL.md should route, not contain everything
  referenceLines: 400,
};

// Skills are installed folder by folder, so authorship has to travel with each one.
const AUTHOR = 'Abe Prangishvili';

const errors = [];
const warnings = [];

const err = (skill, msg) => errors.push(`${skill}: ${msg}`);
const warn = (skill, msg) => warnings.push(`${skill}: ${msg}`);

function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 4);
  if (end === -1) return null;
  const block = text.slice(4, end);
  const data = {};
  let key = null;
  for (const line of block.split('\n')) {
    const match = /^([a-zA-Z0-9_-]+):\s*(.*)$/.exec(line);
    if (match) {
      key = match[1];
      data[key] = match[2].trim();
    } else if (key && line.trim()) {
      data[key] += ' ' + line.trim();
    }
  }
  return { data, body: text.slice(end + 4) };
}

function markdownLinks(text) {
  const links = [];
  const re = /\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) links.push(m[1]);
  return links;
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const skills = readdirSync(ROOT).filter((entry) => {
  if (entry.startsWith('.') || entry === 'scripts') return false;
  return existsSync(join(ROOT, entry, 'SKILL.md'));
});

if (skills.length === 0) {
  console.error('No skill folders found.');
  process.exit(1);
}

for (const skill of skills) {
  const dir = join(ROOT, skill);
  const skillFile = join(dir, 'SKILL.md');
  const raw = readFileSync(skillFile, 'utf8');

  // --- frontmatter -------------------------------------------------------
  const parsed = parseFrontmatter(raw);
  if (!parsed) {
    err(skill, 'SKILL.md has no valid YAML frontmatter block');
    continue;
  }

  const { data, body } = parsed;

  if (!data.name) err(skill, 'frontmatter is missing "name"');
  else if (data.name !== skill) err(skill, `frontmatter name "${data.name}" does not match the folder name`);

  if (!data.description) {
    err(skill, 'frontmatter is missing "description"');
  } else {
    const len = data.description.length;
    if (len < LIMITS.descriptionMin) warn(skill, `description is short (${len} chars) — weak trigger coverage`);
    if (len > LIMITS.descriptionMax) err(skill, `description is ${len} chars, over the ${LIMITS.descriptionMax} limit`);
  }

  for (const extra of Object.keys(data)) {
    if (!['name', 'description'].includes(extra)) warn(skill, `unexpected frontmatter key "${extra}"`);
  }

  // --- attribution -------------------------------------------------------
  if (!body.includes(AUTHOR)) {
    err(skill, `SKILL.md is missing the author credit for ${AUTHOR}`);
  }

  // --- size --------------------------------------------------------------
  const bodyLines = body.split('\n').length;
  if (bodyLines > LIMITS.skillBodyLines) {
    warn(skill, `SKILL.md body is ${bodyLines} lines (> ${LIMITS.skillBodyLines}); move depth into references/`);
  }

  // --- codex metadata ----------------------------------------------------
  const yamlPath = join(dir, 'agents', 'openai.yaml');
  if (!existsSync(yamlPath)) {
    err(skill, 'missing agents/openai.yaml');
  } else {
    const yaml = readFileSync(yamlPath, 'utf8');
    for (const field of ['display_name', 'short_description', 'default_prompt']) {
      if (!yaml.includes(`${field}:`)) err(skill, `agents/openai.yaml is missing "${field}"`);
    }
    if (!yaml.includes(`$${skill}`)) {
      warn(skill, `agents/openai.yaml default_prompt does not reference $${skill}`);
    }
  }

  // --- links -------------------------------------------------------------
  const mdFiles = walk(dir).filter((f) => f.endsWith('.md'));
  for (const file of mdFiles) {
    const text = readFileSync(file, 'utf8');
    const rel = relative(ROOT, file).replace(/\\/g, '/');

    if (file !== skillFile) {
      const lines = text.split('\n').length;
      if (lines > LIMITS.referenceLines) warn(skill, `${rel} is ${lines} lines (> ${LIMITS.referenceLines}); consider splitting`);
    }

    for (const link of markdownLinks(text)) {
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      const target = resolve(dirname(file), link.split('#')[0]);
      if (!existsSync(target)) {
        err(skill, `${rel} links to a missing file: ${link}`);
      } else if (!target.startsWith(dir)) {
        err(skill, `${rel} links outside its own skill folder (${link}); skills must be self-contained`);
      }
    }
  }

  // --- referenced files are actually reachable ---------------------------
  const refDir = join(dir, 'references');
  if (existsSync(refDir)) {
    const linked = new Set(
      mdFiles.flatMap((f) =>
        markdownLinks(readFileSync(f, 'utf8'))
          .filter((l) => !/^(https?:|mailto:|#)/.test(l))
          .map((l) => resolve(dirname(f), l.split('#')[0]))
      )
    );
    for (const ref of readdirSync(refDir)) {
      if (!linked.has(join(refDir, ref))) warn(skill, `references/${ref} is never linked from any markdown file`);
    }
  }
}

// --- report ----------------------------------------------------------------
const label = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

console.log(`Checked ${label(skills.length, 'skill')}: ${skills.join(', ')}\n`);

for (const w of warnings) console.log(`  warn   ${w}`);
for (const e of errors) console.log(`  ERROR  ${e}`);

if (!warnings.length && !errors.length) console.log('  All checks passed.');
else console.log(`\n${label(errors.length, 'error')}, ${label(warnings.length, 'warning')}.`);

process.exit(errors.length ? 1 : 0);
