#requires -Version 5.1
<#
Pull the latest skills from GitHub and reinstall them into every runtime on this machine.
Each destination replaces only the six repository skills; unrelated skills (for example a
hand-written browser.md) are left alone, and previous versions are kept under
.agent-skills-backups/ next to each target.

Usage:
  .\update-skills.ps1                 # pull + install into every runtime
  .\update-skills.ps1 -DryRun         # show what would change
  .\update-skills.ps1 -SkipPull       # reinstall the current checkout as-is
  .\update-skills.ps1 -Only dsh       # one target only
#>
param(
    [switch]$DryRun,
    [switch]$SkipPull,
    [ValidateSet('all', 'dsh', 'claude', 'codex', 'antigravity')]
    [string]$Only = 'all'
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$installer = Join-Path $repoRoot 'install.ps1'
if (-not (Test-Path -LiteralPath $installer)) { throw "install.ps1 not found in $repoRoot" }

if (-not $SkipPull) {
    if (-not (Test-Path -LiteralPath (Join-Path $repoRoot '.git'))) { throw "$repoRoot is not a git checkout; use -SkipPull with a copied folder." }
    $dirty = @(git -C $repoRoot status --porcelain)
    if ($dirty.Count) {
        Write-Warning "Local changes in $repoRoot are present; git pull may refuse. Commit or stash them first."
    }
    Write-Output 'Pulling latest skills...'
    git -C $repoRoot pull --ff-only
    if ($LASTEXITCODE -ne 0) { throw "git pull failed with exit code $LASTEXITCODE" }
    Write-Output ("HEAD: " + (git -C $repoRoot log --oneline -1))
}

$targets = [ordered]@{
    dsh         = Join-Path $HOME '.dsh/skills'                  # DeepSeek Harness (user-dsh root)
    claude      = Join-Path $HOME '.claude/skills'               # Claude Code
    codex       = Join-Path $HOME '.codex/skills'                # Codex
    antigravity = Join-Path $HOME '.gemini/config/skills'        # Antigravity
}
$selected = if ($Only -eq 'all') { @($targets.Keys) } else { @($Only) }
foreach ($name in $selected) {
    $path = $targets[$name]
    $parent = [IO.Directory]::GetParent($path).FullName
    if ($DryRun) {
        & $installer $path -DryRun
    } elseif (Test-Path -LiteralPath $parent) {
        Write-Output "=== $name -> $path ==="
        & $installer $path
    } else {
        Write-Output "skipped $name (no $parent on this machine)"
    }
}
Write-Output 'Done. DeepSeek Harness and Codex pick up new skill text within the running session; reload other runtimes if their skill list is cached.'
