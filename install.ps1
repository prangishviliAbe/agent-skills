<#
Install these skills for an AI agent runtime.

  .\install.ps1                     -> Codex        ($HOME\.codex\skills)
  .\install.ps1 claude              -> Claude Code  ($HOME\.claude\skills)
  .\install.ps1 antigravity         -> Antigravity  ($HOME\.gemini\antigravity\skills)
  .\install.ps1 all                 -> the three above
  .\install.ps1 D:\some\other\dir   -> any custom directory

Each skill folder is replaced in full, so removed files do not linger.
#>

param(
  [string]$Target = 'codex'
)

$ErrorActionPreference = 'Stop'
$src = $PSScriptRoot

$skills = Get-ChildItem -Path $src -Directory |
  Where-Object { Test-Path (Join-Path $_.FullName 'SKILL.md') } |
  Select-Object -ExpandProperty Name

if ($skills.Count -eq 0) {
  Write-Error "No skills found in $src"
}

function Install-Skills {
  param([string]$Destination)

  New-Item -ItemType Directory -Force -Path $Destination | Out-Null

  foreach ($skill in $skills) {
    $dest = Join-Path $Destination $skill
    if (Test-Path -LiteralPath $dest) {
      Remove-Item -Recurse -Force -LiteralPath $dest
    }
    Copy-Item -Recurse -LiteralPath (Join-Path $src $skill) -Destination $dest
    Write-Host "  $skill"
  }

  Write-Host "Installed $($skills.Count) skills to $Destination"
}

$paths = @{
  codex       = Join-Path $HOME '.codex\skills'
  claude      = Join-Path $HOME '.claude\skills'
  antigravity = Join-Path $HOME '.gemini\antigravity\skills'
}

if ($Target -eq 'all') {
  foreach ($path in $paths.Values) { Install-Skills -Destination $path }
} elseif ($paths.ContainsKey($Target)) {
  Install-Skills -Destination $paths[$Target]
} elseif ($Target -match '[\\/]') {
  # anything that looks like a path is used verbatim
  Install-Skills -Destination $Target
} else {
  Write-Error "Unknown target: $Target. Usage: .\install.ps1 [codex|claude|antigravity|all|<path>]"
}

Write-Host 'Start a new session so the updated metadata and triggers load.'
