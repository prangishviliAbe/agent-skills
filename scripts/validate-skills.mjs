#!/usr/bin/env node
// Structural validation only; behavioral evaluation lives in tests/evals/.
import { readdirSync, readFileSync, lstatSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import MarkdownIt from 'markdown-it';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const AUTHOR = 'Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)';
const markdown = new MarkdownIt();
const inside = (root, path) => {
  const rel = relative(root, path);
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
};

export function validateRepository(root = ROOT) {
  root = resolve(root);
  const errors = [], warnings = [];
  const error = (where, message) => errors.push(`${where}: ${message}`);
  const warning = (where, message) => warnings.push(`${where}: ${message}`);
  const read = (path) => readFileSync(path, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const yaml = (text, where) => {
    try {
      const doc = parseDocument(text, { uniqueKeys: true });
      if (doc.errors.length) throw new Error(doc.errors.map(e => e.message).join('; '));
      const data = doc.toJS({ maxAliasCount: 20 });
      if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('expected a mapping');
      return data;
    } catch (e) {
      error(where, `invalid YAML: ${e.message}`);
      return null;
    }
  };
  const walk = (path) => {
    const files = [];
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const file = join(path, entry.name);
      if (entry.isSymbolicLink()) error(relative(root, file), 'symbolic links are not portable skill resources');
      else if (entry.isDirectory()) files.push(...walk(file));
      else if (entry.isFile()) files.push(file);
      else error(relative(root, file), 'unsupported resource type');
    }
    return files;
  };
  const skills = readdirSync(root, { withFileTypes: true })
    .filter(e => !e.name.startsWith('.') && existsSync(join(root, e.name, 'SKILL.md')))
    .map(e => e.name).sort();
  if (!skills.length) error('repository', 'no skill folders found');

  for (const skill of skills) {
    const dir = join(root, skill), skillFile = join(dir, 'SKILL.md');
    if (lstatSync(dir).isSymbolicLink() || !lstatSync(dir).isDirectory()) {
      error(skill, 'skill must be an ordinary directory');
      continue;
    }
    const files = walk(dir);
    if (!files.includes(skillFile)) { error(skill, 'SKILL.md must be an ordinary file'); continue; }
    const raw = read(skillFile);
    const match = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(raw);
    if (!match) { error(skill, 'missing YAML frontmatter delimiters'); continue; }
    const data = yaml(match[1], skill), body = raw.slice(match[0].length);
    if (data) {
      if (data.name !== skill) error(skill, 'frontmatter name must match its folder');
      if (typeof data.name !== 'string' || data.name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name)) error(skill, 'invalid skill name');
      if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024 || /[<>]/.test(data.description)) error(skill, 'description must be a nonempty string of at most 1024 characters without angle brackets');
      for (const key of Object.keys(data)) if (!['name', 'description'].includes(key)) error(skill, `unexpected frontmatter key: ${key}`);
    }
    if (!body.trimEnd().endsWith(AUTHOR)) error(skill, 'final line must preserve the author credit');
    if (body.trim().split('\n').length > 220) error(skill, 'SKILL.md body exceeds 220 lines; move conditional depth into references');
    if (/^\s*\[TODO:[^\n]*\]\s*$/m.test(body)) error(skill, 'unfinished scaffold placeholder');

    const metaPath = join(dir, 'agents', 'openai.yaml');
    const meta = files.includes(metaPath) ? yaml(read(metaPath), `${skill}/agents/openai.yaml`) : null;
    if (!files.includes(metaPath)) error(skill, 'missing ordinary agents/openai.yaml file');
    if (meta) {
      const ui = meta.interface;
      for (const field of ['display_name', 'short_description', 'default_prompt']) {
        if (!ui || typeof ui[field] !== 'string' || !ui[field].trim()) error(skill, `interface.${field} must be a nonempty string`);
      }
      if (typeof ui?.short_description === 'string' && (ui.short_description.length < 25 || ui.short_description.length > 64)) error(skill, 'interface.short_description must be 25–64 characters');
      if (typeof ui?.default_prompt === 'string' && !new RegExp(`\\$${skill}(?![a-z0-9-])`).test(ui.default_prompt)) error(skill, `default_prompt must invoke $${skill}`);
      if (meta.policy !== undefined && (!meta.policy || typeof meta.policy !== 'object' || Array.isArray(meta.policy))) error(skill, 'policy must be a mapping');
      if (meta.policy?.allow_implicit_invocation !== undefined && typeof meta.policy.allow_implicit_invocation !== 'boolean') error(skill, 'allow_implicit_invocation must be boolean');
      for (const field of ['icon_small', 'icon_large']) if (ui?.[field]) {
        const target = typeof ui[field] === 'string' ? resolve(dir, ui[field]) : null;
        if (!target || !inside(dir, target) || !files.includes(target)) error(skill, `interface.${field} must point to an existing file within the skill`);
      }
    }

    const graph = new Map();
    for (const file of files.filter(f => f.endsWith('.md'))) {
      const text = read(file), where = relative(root, file).replace(/\\/g, '/');
      if (file !== skillFile && text.split('\n').length > 400) warning(where, 'long reference; consider a contents list or splitting by task');
      const links = [];
      const tokens = markdown.parse(file === skillFile ? body : text, {});
      function visit(items) {
        for (const token of items) {
          if (token.type === 'link_open') links.push(token.attrGet('href'));
          if (token.type === 'image') links.push(token.attrGet('src'));
          if (token.children) visit(token.children);
        }
      }
      visit(tokens);
      const edges = [];
      for (const link of links) {
        if (!link || /^(https?:|mailto:|#)/i.test(link)) continue;
        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(link)) { error(where, `unsupported link scheme: ${link}`); continue; }
        let path;
        try { path = decodeURIComponent(link.split(/[?#]/)[0]); }
        catch { error(where, `invalid URL encoding: ${link}`); continue; }
        const target = resolve(dirname(file), path);
        if (!inside(dir, target)) error(where, `link leaves its skill folder: ${link}`);
        else if (!files.includes(target)) error(where, `link points to a missing or nonportable file: ${link}`);
        else edges.push(target);
      }
      graph.set(file, edges);
    }
    const reachable = new Set(), queue = [skillFile];
    while (queue.length) {
      const file = queue.pop();
      if (reachable.has(file)) continue;
      reachable.add(file);
      queue.push(...(graph.get(file) || []));
    }
    for (const file of files.filter(f => inside(join(dir, 'references'), f))) {
      if (!reachable.has(file)) error(skill, `resource is unreachable from SKILL.md: ${relative(dir, file).replace(/\\/g, '/')}`);
    }
  }
  return { skills, errors, warnings };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--root')) {
    console.error('Usage: node scripts/validate-skills.mjs [--root path]');
    process.exitCode = 1;
  } else {
    try {
      const result = validateRepository(args[1] || ROOT);
      console.log(`Checked ${result.skills.length} skills: ${result.skills.join(', ')}`);
      for (const message of result.warnings) console.log(`WARN ${message}`);
      for (const message of result.errors) console.error(`ERROR ${message}`);
      console.log(`${result.errors.length} errors, ${result.warnings.length} warnings.`);
      process.exitCode = result.errors.length ? 1 : 0;
    } catch (e) { console.error(e.message); process.exitCode = 1; }
  }
}
