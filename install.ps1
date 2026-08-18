<#
Install these skills globally.

  .\install.ps1                 -> Codex        ($HOME\.codex\skills)
  .\install.ps1 claude          -> Claude       ($HOME\.claude\skills)
  .\install.ps1 antigravity     -> Antigravity  ($HOME\.gemini\antigravity\skills)
  .\install.ps1 all             -> every target above

Each skill folder is replaced in full, so removed files do not linger.
#>

param(
  [ValidateSet('codex', 'claude', 'antigravity', 'all')]
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
} else {
  Install-Skills -Destination $paths[$Target]
}

Write-Host 'Start a new session so the updated metadata and triggers load.'
