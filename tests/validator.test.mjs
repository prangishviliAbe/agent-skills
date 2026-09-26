import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateRepository } from '../scripts/validate-skills.mjs';

const credit = 'Skill by **Abe Prangishvili** — [github.com/prangishviliAbe/agent-skills](https://github.com/prangishviliAbe/agent-skills)';
const front = '---\nname: example\ndescription: Use this skill to perform the example task.\n---\n';
const metadata = 'interface:\n  display_name: "Example"\n  short_description: "Perform the example task carefully"\n  default_prompt: "Use $example for the task."\n';
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'agent-skills-validator-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, text) => { mkdirSync(join(root, 'example', path, '..'), { recursive: true }); writeFileSync(join(root, 'example', path), text); };
  write('SKILL.md', `${front}# Example\n\n${credit}\n`);
  write('agents/openai.yaml', metadata);
  return { root, write, body: text => write('SKILL.md', `${front}${text}\n\n${credit}\n`), errors: () => validateRepository(root).errors.join('\n') };
}
test('valid skill accepts real YAML, BOM and CRLF', t => {
  const f = fixture(t);
  f.write('SKILL.md', `\uFEFF---\nname: "example"\ndescription: >-\n  A folded description that includes multiple\n  lines and retains a meaningful trigger.\n---\n# Example\n${credit}\n`.replaceAll('\n', '\r\n'));
  assert.equal(f.errors(), '');
});
test('duplicate YAML keys cannot silently override metadata', t => {
  const f = fixture(t); f.write('SKILL.md', `${front.replace('name: example', 'name: wrong\nname: example')}${credit}`);
  assert.match(f.errors(), /invalid YAML/);
});
test('malformed YAML is rejected', t => {
  const f = fixture(t); f.write('SKILL.md', `${front.replace('name: example', 'name: [unclosed')}${credit}`);
  assert.match(f.errors(), /invalid YAML/);
});
test('unexpected frontmatter fields and empty description are errors', t => {
  const f = fixture(t); f.write('SKILL.md', `---\nname: example\ndescription: ""\nsecret: value\n---\n${credit}`);
  assert.match(f.errors(), /description must/); assert.match(f.errors(), /unexpected frontmatter key/);
});
test('description containing YAML types is rejected', t => {
  const f = fixture(t); f.write('SKILL.md', `---\nname: example\ndescription: true\n---\n${credit}`);
  assert.match(f.errors(), /description must/);
});
test('skill name must match the install folder', t => {
  const f = fixture(t); f.write('SKILL.md', `${front.replace('name: example', 'name: other')}${credit}`);
  assert.match(f.errors(), /name must match/);
});
test('author name elsewhere does not substitute for final attribution', t => {
  const f = fixture(t); f.write('SKILL.md', `${front}Abe Prangishvili\n`);
  assert.match(f.errors(), /final line/);
});
test('metadata presence in comments does not satisfy required fields', t => {
  const f = fixture(t); f.write('agents/openai.yaml', '# display_name: short_description: default_prompt: $example\ninterface: {}\n');
  assert.match(f.errors(), /interface.default_prompt/);
});
test('metadata invocation must be exact and policy must be boolean', t => {
  const f = fixture(t); f.write('agents/openai.yaml', metadata.replace('$example', '$example-other') + 'policy:\n  allow_implicit_invocation: "false"\n');
  assert.match(f.errors(), /must invoke/); assert.match(f.errors(), /must be boolean/);
});
test('reference-style links with spaces and nested references are reachable', t => {
  const f = fixture(t); f.body('[Details][ref]\n\n[ref]: <references/first guide.md>');
  f.write('references/first guide.md', '[Next](nested/second.md)'); f.write('references/nested/second.md', '# Second');
  assert.equal(f.errors(), '');
});
test('links in code examples do not become dependencies', t => {
  const f = fixture(t); f.body('```markdown\n[Example](missing.md)\n```\n\n`[Also](absent.md)`'); assert.equal(f.errors(), '');
});
test('missing linked files fail', t => {
  const f = fixture(t); f.body('[Guide](references/missing.md)'); assert.match(f.errors(), /missing or nonportable/);
});
test('sibling with common prefix cannot bypass containment', t => {
  const f = fixture(t); mkdirSync(join(f.root, 'example-sibling')); writeFileSync(join(f.root, 'example-sibling', 'guide.md'), '# Outside');
  f.body('[Outside](../example-sibling/guide.md)'); assert.match(f.errors(), /leaves its skill folder/);
});
test('encoded traversal cannot bypass containment', t => {
  const f = fixture(t); f.body('[Outside](%2e%2e/secret.md)'); assert.match(f.errors(), /leaves its skill folder/);
});
test('mutually linked but unreachable references still fail', t => {
  const f = fixture(t); f.write('references/a.md', '[B](b.md)'); f.write('references/b.md', '[A](a.md)');
  assert.equal(validateRepository(f.root).errors.filter(e => e.includes('unreachable')).length, 2);
});
test('image resources are checked and reached through references', t => {
  const f = fixture(t); f.body('[Guide](references/guide.md)'); f.write('references/guide.md', '![Diagram](diagram.svg)'); f.write('references/diagram.svg', '<svg/>');
  assert.equal(f.errors(), ''); f.body('![Missing](assets/no.png)'); assert.match(f.errors(), /missing or nonportable/);
});
test('links cannot use a symlink to escape the skill', t => {
  const f = fixture(t); const outside = join(f.root, 'outside'); mkdirSync(outside); writeFileSync(join(outside, 'file.md'), '# Outside');
  try { symlinkSync(outside, join(f.root, 'example', 'linked'), 'junction'); }
  catch (e) { if (e.code === 'EPERM') { t.skip('symlink privilege unavailable'); return; } throw e; }
  f.body('[Outside](linked/file.md)'); assert.match(f.errors(), /symbolic links/);
});
test('repository without skills is an error', t => {
  const f = fixture(t); rmSync(join(f.root, 'example'), { recursive: true }); assert.match(f.errors(), /no skill folders/);
});
