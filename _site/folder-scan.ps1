param(
    [Parameter(Mandatory=$true)]
    [string]$Path,

    [string]$Output = "folder-baseline.md",

    [int]$MaxDepth = 6
)

$ErrorActionPreference = "SilentlyContinue"

$ignoreDirs = @(
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    "dist",
    "build",
    ".next",
    ".jekyll-cache",
    "_site"
)

$root = Resolve-Path $Path
$rootName = Split-Path $root -Leaf
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

function Get-RelativePath {
    param([string]$FullPath)
    return $FullPath.Replace($root.Path, "").TrimStart("\")
}

function Should-Ignore {
    param([string]$FullPath)

    foreach ($dir in $ignoreDirs) {
        if ($FullPath -match "\\$([regex]::Escape($dir))(\\|$)") {
            return $true
        }
    }

    return $false
}

function Get-Depth {
    param([string]$FullPath)

    $relative = Get-RelativePath $FullPath
    if ([string]::IsNullOrWhiteSpace($relative)) {
        return 0
    }

    return ($relative -split "\\").Count
}

$allItems = Get-ChildItem -Path $root -Recurse -Force |
    Where-Object {
        -not (Should-Ignore $_.FullName) -and
        (Get-Depth $_.FullName) -le $MaxDepth
    }

$dirs = $allItems | Where-Object { $_.PSIsContainer }
$files = $allItems | Where-Object { -not $_.PSIsContainer }

$totalSize = ($files | Measure-Object Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)

$extSummary = $files |
    Group-Object Extension |
    Sort-Object Count -Descending |
    ForEach-Object {
        $ext = if ($_.Name) { $_.Name } else { "[no extension]" }
        "| $ext | $($_.Count) |"
    }

$largestFiles = $files |
    Sort-Object Length -Descending |
    Select-Object -First 25 |
    ForEach-Object {
        $rel = Get-RelativePath $_.FullName
        $size = [math]::Round($_.Length / 1KB, 2)
        "| `$rel` | $size KB | $($_.LastWriteTime.ToString("yyyy-MM-dd HH:mm")) |"
    }

$recentFiles = $files |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 30 |
    ForEach-Object {
        $rel = Get-RelativePath $_.FullName
        "| `$rel` | $($_.LastWriteTime.ToString("yyyy-MM-dd HH:mm")) |"
    }

$treeLines = New-Object System.Collections.Generic.List[string]

function Build-Tree {
    param(
        [string]$CurrentPath,
        [int]$Level
    )

    if ($Level -gt $MaxDepth) {
        return
    }

    $items = Get-ChildItem -Path $CurrentPath -Force |
        Where-Object { -not (Should-Ignore $_.FullName) } |
        Sort-Object @{Expression={$_.PSIsContainer};Descending=$true}, Name

    foreach ($item in $items) {
        $indent = "  " * $Level
        if ($item.PSIsContainer) {
            $treeLines.Add("$indent- 📁 $($item.Name)/")
            Build-Tree -CurrentPath $item.FullName -Level ($Level + 1)
        } else {
            $sizeKB = [math]::Round($item.Length / 1KB, 1)
            $treeLines.Add("$indent- 📄 $($item.Name) ($sizeKB KB)")
        }
    }
}

Build-Tree -CurrentPath $root.Path -Level 0

$report = @"
# Folder Baseline Report

Generated: $now  
Root folder: `$($root.Path)`  
Max scan depth: $MaxDepth  

---

## Summary

| Item | Count |
|---|---:|
| Folders | $($dirs.Count) |
| Files | $($files.Count) |
| Total size | $totalSizeMB MB |

---

## File Types

| Extension | Count |
|---|---:|
$($extSummary -join "`n")

---

## Folder Tree

```text
$rootName/
$($treeLines -join "`n")