import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, readdirSync, existsSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bash = process.env.BASH_PATH || (process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash');
const pwsh = process.env.PWSH_PATH || 'pwsh';
const shellPath = path => process.platform === 'win32' ? path.replaceAll('\\', '/').replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`) : path;
const shells = [
  { name: 'PowerShell', bin: pwsh, script: 'install.ps1', available: () => spawnSync(pwsh, ['-NoProfile', '-Command', 'exit 0']).status === 0 },
  { name: 'Bash', bin: bash, script: 'install.sh', available: () => spawnSync(bash, ['--version']).status === 0 },
];
function fixture(t, shell) {
  const root = mkdtempSync(join(tmpdir(), 'agent-skills-installer-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const source = join(root, 'source with spaces'), dest = join(root, 'runtime with spaces', 'skills');
  const write = (path, text) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, text); };
  for (const name of ['alpha', 'beta']) {
    write(join(source, name, 'SKILL.md'), `---\nname: ${name}\ndescription: Example\n---\nNew ${name}\n`);
    write(join(source, name, 'agents', 'openai.yaml'), 'interface: {}\n');
    write(join(source, name, '.hidden'), 'hidden resource');
    write(join(dest, name, 'SKILL.md'), `Old ${name}`);
    write(join(dest, name, 'stale.txt'), 'old extra file');
  }
  write(join(dest, 'unrelated', 'SKILL.md'), 'Keep unrelated skill');
  write(join(dest, '.system', 'keep.txt'), 'Keep system skill');
  copyFileSync(join(repo, shell.script), join(source, shell.script));
  function run(target = dest, { dryRun = false, fault, env = {}, rawTarget = false } = {}) {
    const script = join(source, shell.script);
    let args, extraEnv = {};
    if (shell.name === 'PowerShell') {
      if (fault) {
        const harness = join(root, 'fault.ps1');
        write(harness, `param([string]$Installer, [string]$Destination)\n$global:taskInjected = $false\nfunction ${fault === 'copy' ? 'Copy-Item' : 'Move-Item'} {\n param([string]$LiteralPath, [string]$Destination, [switch]$Recurse, [switch]$Force)\n if (-not $global:taskInjected -and ${fault === 'copy' ? "$LiteralPath.EndsWith('beta')" : "($LiteralPath -match 'agent-skills-stage-' -and $LiteralPath.EndsWith('beta'))"}) { $global:taskInjected = $true; throw 'Injected failure' }\n Microsoft.PowerShell.Management\\${fault === 'copy' ? 'Copy-Item' : 'Move-Item'} @PSBoundParameters\n}\n& $Installer $Destination\n`);
        args = ['-NoProfile', '-File', harness, script, target];
      } else args = ['-NoProfile', '-File', script, target, ...(dryRun ? ['-DryRun'] : [])];
    } else {
      args = [shellPath(script), rawTarget ? target : target.startsWith(root) ? shellPath(target) : target, ...(dryRun ? ['--dry-run'] : [])];
      if (fault) {
        const harness = join(root, 'fault.sh'), command = fault === 'copy' ? 'cp' : 'mv';
        write(harness, `${command}() {\n if [[ "$*" == *${fault === 'copy' ? '/beta' : '.agent-skills-stage-'}* ]] && [[ "$*" == */beta* ]] && [ ! -f "$FAULT_MARKER" ]; then\n  touch "$FAULT_MARKER"; echo 'Injected failure' >&2; return 19\n fi\n command ${command} "$@"\n}\n`);
        extraEnv = { BASH_ENV: shellPath(harness), FAULT_MARKER: shellPath(join(root, 'fault-fired')) };
      }
    }
    return spawnSync(shell.bin, args, { encoding: 'utf8', env: { ...process.env, ...env, ...extraEnv }, timeout: 30000 });
  }
  function backups() {
    const path = join(dirname(dest), '.agent-skills-backups');
    return existsSync(path) ? readdirSync(path).map(name => join(path, name)) : [];
  }
  function unchanged() {
    for (const name of ['alpha', 'beta']) {
      assert.equal(readFileSync(join(dest, name, 'SKILL.md'), 'utf8'), `Old ${name}`);
      assert.ok(existsSync(join(dest, name, 'stale.txt')));
    }
  }
  function noDebris() {
    assert.equal(existsSync(join(dest, '.agent-skills-install.lock')), false);
    assert.equal(readdirSync(dirname(dest)).some(name => name.startsWith('.agent-skills-stage-')), false);
  }
  return { root, source, dest, write, run, backups, unchanged, noDebris };
}
for (const shell of shells) {
  const available = shell.available();
  const spec = (name, fn) => test(`${shell.name}: ${name}`, { skip: !available && `${shell.bin} unavailable` }, t => fn(fixture(t, shell), t));
  spec('full replacement removes stale files, preserves unrelated skills and retains backups', f => {
    const result = f.run(); assert.equal(result.status, 0, result.stdout + result.stderr);
    for (const name of ['alpha', 'beta']) {
      assert.equal(readFileSync(join(f.dest, name, 'SKILL.md'), 'utf8'), readFileSync(join(f.source, name, 'SKILL.md'), 'utf8'));
      assert.equal(existsSync(join(f.dest, name, 'stale.txt')), false);
      assert.equal(readFileSync(join(f.dest, name, '.hidden'), 'utf8'), 'hidden resource');
      assert.equal(readFileSync(join(f.backups()[0], name, 'SKILL.md'), 'utf8'), `Old ${name}`);
    }
    assert.ok(existsSync(join(f.dest, '.system', 'keep.txt'))); assert.ok(existsSync(join(f.dest, 'unrelated', 'SKILL.md')));
    f.noDebris();
    const second = f.run(); assert.equal(second.status, 0, second.stdout + second.stderr); assert.equal(f.backups().length, 2); f.noDebris();
  });
  spec('dry run leaves the destination and backups unchanged', f => {
    const result = f.run(f.dest, { dryRun: true }); assert.equal(result.status, 0, result.stdout + result.stderr);
    f.unchanged(); assert.equal(f.backups().length, 0); f.noDebris();
  });
  spec('CODEX_HOME selects the Codex destination', f => {
    const custom = join(f.root, 'custom codex');
    const result = f.run('codex', { env: { CODEX_HOME: shell.name === 'Bash' ? shellPath(custom) : custom } });
    assert.equal(result.status, 0, result.stdout + result.stderr); assert.ok(existsSync(join(custom, 'skills', 'alpha', 'SKILL.md'))); f.unchanged();
  });
  spec('source overlap is rejected before replacement', f => {
    const result = f.run(f.source); assert.notEqual(result.status, 0); assert.match(result.stdout + result.stderr, /overlap/);
    assert.ok(readFileSync(join(f.source, 'alpha', 'SKILL.md'), 'utf8').includes('New alpha'));
  });
  spec('source overlap through a linked ancestor is rejected before replacement', (f, t) => {
    const alias = join(f.root, 'source-alias');
    try { symlinkSync(f.source, alias, process.platform === 'win32' ? 'junction' : 'dir'); }
    catch (e) { if (e.code === 'EPERM') { t.skip('symlink privilege unavailable'); return; } throw e; }
    const result = f.run(join(alias, 'nested', 'skills'));
    assert.notEqual(result.status, 0); assert.match(result.stdout + result.stderr, /overlap/);
    assert.equal(existsSync(join(f.source, 'nested', 'skills', 'alpha', 'SKILL.md')), false);
  });
  spec('parent traversal is rejected before replacement', f => {
    const separator = process.platform === 'win32' ? '\\' : '/';
    const result = f.run(`${f.dest}${separator}..${separator}outside`);
    assert.notEqual(result.status, 0); assert.match(result.stdout + result.stderr, /Parent traversal/);
    f.unchanged();
  });
  spec('a destination file is rejected without loss', f => {
    rmSync(join(f.dest, 'beta'), { recursive: true }); f.write(join(f.dest, 'beta'), 'not a directory');
    const result = f.run(); assert.notEqual(result.status, 0); assert.equal(readFileSync(join(f.dest, 'beta'), 'utf8'), 'not a directory');
    assert.equal(readFileSync(join(f.dest, 'alpha', 'SKILL.md'), 'utf8'), 'Old alpha');
  });
  spec('an existing lock blocks a second installer', f => {
    f.write(join(f.dest, '.agent-skills-install.lock'), 'another install');
    const result = f.run(); assert.notEqual(result.status, 0); f.unchanged(); assert.equal(f.backups().length, 0);
  });
  spec('a staged copy failure leaves every old skill intact', f => {
    const result = f.run(f.dest, { fault: 'copy' }); assert.notEqual(result.status, 0, 'fault must fire');
    assert.match(result.stdout + result.stderr, /Injected failure/); f.unchanged(); f.noDebris();
  });
  spec('a mid-install failure restores every prior skill', f => {
    const result = f.run(f.dest, { fault: 'move' }); assert.notEqual(result.status, 0, 'fault must fire');
    assert.match(result.stdout + result.stderr, /Injected failure/); f.unchanged(); f.noDebris();
  });
  spec('linked destination is rejected and its target stays intact', (f, t) => {
    const outside = join(f.root, 'outside'); f.write(join(outside, 'precious.txt'), 'keep');
    rmSync(join(f.dest, 'alpha'), { recursive: true });
    try { symlinkSync(outside, join(f.dest, 'alpha'), 'junction'); }
    catch (e) { if (e.code === 'EPERM') { t.skip('symlink privilege unavailable'); return; } throw e; }
    const result = f.run(); assert.notEqual(result.status, 0); assert.equal(readFileSync(join(outside, 'precious.txt'), 'utf8'), 'keep');
  });
  if (shell.name === 'Bash' && process.platform === 'win32') {
    spec('accepts a native Windows custom destination', f => {
      const result = f.run(f.dest, { rawTarget: true });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(readFileSync(join(f.dest, 'alpha', 'SKILL.md'), 'utf8'), readFileSync(join(f.source, 'alpha', 'SKILL.md'), 'utf8'));
    });
    spec('refuses a drive root in dry run', f => {
      const driveRoot = `${process.env.SystemDrive || 'C:'}\\`;
      const result = f.run(driveRoot, { dryRun: true, rawTarget: true });
      assert.notEqual(result.status, 0); assert.match(result.stdout + result.stderr, /filesystem root/);
      f.unchanged();
    });
  }
}
