<#
Replace this repository's skills, retaining old versions outside the active skills directory.
Usage: .\install.ps1 [codex|claude|antigravity|all|<path>] [-DryRun]
Codex respects CODEX_HOME. Installation is transactional per destination, not across runtimes.
#>
param([string]$Target = 'codex', [switch]$DryRun)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
if ($PSVersionTable.PSVersion -lt [Version]'7.2') { throw 'PowerShell 7.2 or newer is required for safe symlink and junction handling.' }
$sourceRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$comparison = if ([IO.Path]::DirectorySeparatorChar -eq '\') { [StringComparison]::OrdinalIgnoreCase } else { [StringComparison]::Ordinal }

function Is-Within([string]$Root, [string]$Path) {
    $base = $Root.TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
    return $Path.Equals($base, $comparison) -or $Path.StartsWith($base + [IO.Path]::DirectorySeparatorChar, $comparison)
}
function Assert-NotLink([string]$Path) {
    try { $item = Get-Item -LiteralPath $Path -Force -ErrorAction Stop }
    catch [System.Management.Automation.ItemNotFoundException] { return }
    $nativeItem = if ($item.PSIsContainer) { [IO.DirectoryInfo]::new($Path) } else { [IO.FileInfo]::new($Path) }
    if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -or -not [string]::IsNullOrEmpty($nativeItem.LinkTarget)) {
        throw "Refusing linked path: $Path"
    }
}
function Assert-NoParentTraversal([string]$Path) {
    if ($Path -match '(^|[\\/])\.\.([\\/]|$)') { throw "Parent traversal is not supported: $Path" }
}
function Get-PhysicalPath([string]$Path) {
    Assert-NoParentTraversal $Path
    $absolute = [IO.Path]::GetFullPath($Path)
    $root = [IO.Path]::GetPathRoot($absolute)
    $relative = $absolute.Substring($root.Length)
    $separators = [char[]]@([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
    $segments = @($relative.Split($separators, [StringSplitOptions]::RemoveEmptyEntries))
    $resolved = $root
    for ($index = 0; $index -lt $segments.Count; $index++) {
        $candidate = Join-Path $resolved $segments[$index]
        try { $item = Get-Item -LiteralPath $candidate -Force -ErrorAction Stop }
        catch [System.Management.Automation.ItemNotFoundException] {
            for ($remaining = $index; $remaining -lt $segments.Count; $remaining++) {
                $resolved = Join-Path $resolved $segments[$remaining]
            }
            return [IO.Path]::GetFullPath($resolved)
        }
        $nativeItem = if ($item.PSIsContainer) { [IO.DirectoryInfo]::new($candidate) } else { [IO.FileInfo]::new($candidate) }
        if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -or -not [string]::IsNullOrEmpty($nativeItem.LinkTarget)) {
            $target = $nativeItem.ResolveLinkTarget($true)
            if ($null -eq $target -or -not $target.Exists) { throw "Cannot resolve linked path: $candidate" }
            $resolved = [IO.Path]::GetFullPath($target.FullName)
        } else {
            $resolved = $item.FullName
        }
    }
    return [IO.Path]::GetFullPath($resolved)
}
function Assert-Child([string]$Root, [string]$Path) {
    $absolute = [IO.Path]::GetFullPath($Path)
    if (-not (Is-Within $Root $absolute) -or $absolute.Equals($Root, $comparison)) { throw "Path escapes intended directory: $absolute" }
    Assert-NotLink $absolute
}
Assert-NotLink $sourceRoot
$sourceRoot = Get-PhysicalPath $sourceRoot
$skills = @(Get-ChildItem -LiteralPath $sourceRoot -Directory -Force | Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') } | Sort-Object Name | Select-Object -ExpandProperty Name)
if ($skills.Count -eq 0) { throw "No skills found in $sourceRoot" }
foreach ($skill in $skills) {
    if ($skill -notmatch '^[a-z0-9]+(-[a-z0-9]+)*$') { throw "Invalid skill name: $skill" }
    $folder = Join-Path $sourceRoot $skill
    Assert-NotLink $folder
    foreach ($item in Get-ChildItem -LiteralPath $folder -Recurse -Force) {
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Linked source resource: $($item.FullName)" }
    }
    if (-not (Test-Path -LiteralPath (Join-Path $folder 'agents/openai.yaml') -PathType Leaf)) { throw "Missing metadata: $skill" }
}
function Get-Manifest([string]$Folder) {
    $prefix = $Folder.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    return @(Get-ChildItem -LiteralPath $Folder -Recurse -File -Force | Sort-Object FullName | ForEach-Object {
        $_.FullName.Substring($prefix.Length) + ':' + (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
    })
}
function Install-Skills([string]$Destination) {
    Assert-NoParentTraversal $Destination
    $destinationRoot = [IO.Path]::GetFullPath($ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Destination))
    Assert-NotLink $destinationRoot
    $destinationRoot = Get-PhysicalPath $destinationRoot
    if ((Is-Within $sourceRoot $destinationRoot) -or (Is-Within $destinationRoot $sourceRoot)) { throw 'Source and destination must not overlap.' }
    if ($destinationRoot -eq [IO.Path]::GetPathRoot($destinationRoot)) { throw 'A filesystem root is not a skills directory.' }
    foreach ($skill in $skills) {
        $path = Join-Path $destinationRoot $skill
        Assert-Child $destinationRoot $path
        if ((Test-Path -LiteralPath $path) -and -not (Test-Path -LiteralPath $path -PathType Container)) { throw "Destination skill is not a directory: $path" }
    }
    if ($DryRun) { Write-Output "Would replace $($skills -join ', ') in $destinationRoot"; return }
    New-Item -ItemType Directory -Force -Path $destinationRoot | Out-Null
    $lockPath = Join-Path $destinationRoot '.agent-skills-install.lock'
    $lock = $null
    try { $lock = [IO.File]::Open($lockPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None) }
    catch { throw "Cannot acquire installation lock at $lockPath. If a previous process was interrupted, inspect its backup and confirm it stopped before removing this lock." }
    $id = [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssfffZ') + '-' + [Guid]::NewGuid().ToString('N')
    $parentRoot = [IO.Directory]::GetParent($destinationRoot).FullName
    $stageRoot = Join-Path $parentRoot ('.agent-skills-stage-' + $id)
    $backupParent = Join-Path $parentRoot '.agent-skills-backups'
    $backupRoot = Join-Path $backupParent $id
    $backedUp = [Collections.Generic.List[string]]::new()
    $installed = [Collections.Generic.List[string]]::new()
    try {
        Assert-Child $parentRoot $stageRoot
        Assert-Child $parentRoot $backupRoot
        New-Item -ItemType Directory -Path $stageRoot | Out-Null
        foreach ($skill in $skills) {
            $from = Join-Path $sourceRoot $skill
            $staged = Join-Path $stageRoot $skill
            Copy-Item -LiteralPath $from -Destination $staged -Recurse -Force
            if (Compare-Object @(Get-Manifest $from) @(Get-Manifest $staged)) { throw "Staged copy verification failed: $skill" }
        }
        New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
        foreach ($skill in $skills) {
            $dest = Join-Path $destinationRoot $skill
            Assert-Child $destinationRoot $dest
            if (Test-Path -LiteralPath $dest) {
                Move-Item -LiteralPath $dest -Destination (Join-Path $backupRoot $skill)
                $backedUp.Add($skill)
            }
            Move-Item -LiteralPath (Join-Path $stageRoot $skill) -Destination $dest
            $installed.Add($skill)
        }
        Write-Output "Installed $($skills.Count) skills to $destinationRoot"
        Write-Output "Previous versions: $backupRoot"
    } catch {
        $failure = $_
        $recoveryFailures = @()
        foreach ($skill in $installed) {
            try {
                $dest = Join-Path $destinationRoot $skill
                Assert-Child $destinationRoot $dest
                Remove-Item -LiteralPath $dest -Recurse -Force
            } catch { $recoveryFailures += $_.Exception.Message }
        }
        foreach ($skill in $backedUp) {
            try {
                $saved = Join-Path $backupRoot $skill
                Assert-Child $backupRoot $saved
                $dest = Join-Path $destinationRoot $skill
                Assert-Child $destinationRoot $dest
                if (Test-Path -LiteralPath $dest) { throw "Restore target already exists: $dest" }
                Move-Item -LiteralPath $saved -Destination $dest
            } catch { $recoveryFailures += $_.Exception.Message }
        }
        if ($recoveryFailures.Count) { throw "Installation failed: $($failure.Exception.Message). Recovery incomplete; preserved backup: $backupRoot. $($recoveryFailures -join '; ')" }
        throw $failure
    } finally {
        if (Test-Path -LiteralPath $stageRoot) {
            Assert-Child $parentRoot $stageRoot
            Remove-Item -LiteralPath $stageRoot -Recurse -Force
        }
        $lock.Dispose()
        Remove-Item -LiteralPath $lockPath -Force
    }
}
$codexBase = if ([string]::IsNullOrWhiteSpace($env:CODEX_HOME)) { Join-Path $HOME '.codex' } else { $env:CODEX_HOME }
$paths = [ordered]@{
    codex = Join-Path $codexBase 'skills'
    claude = Join-Path $HOME '.claude/skills'
    antigravity = Join-Path $HOME '.gemini/antigravity/skills'
}
if ($Target -eq 'all') { foreach ($path in $paths.Values) { Install-Skills $path } }
elseif ($paths.Contains($Target)) { Install-Skills $paths[$Target] }
elseif ($Target -match '[\\/]' -or $Target.StartsWith('.')) { Install-Skills $Target }
else { throw "Unknown target: $Target. Use codex, claude, antigravity, all, or a path." }
if (-not $DryRun) { Write-Output 'Codex discovers updated skills on the next turn. Reload other runtimes if their skill list is cached.' }
