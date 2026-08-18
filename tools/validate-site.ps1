param(
  [switch]$FailOnPotentialContacts
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$htmlFiles = @(Get-ChildItem -LiteralPath $projectRoot -Filter '*.html' -File -Recurse)
$dataFiles = @(
  $htmlFiles
  Get-ChildItem -LiteralPath $projectRoot -Filter '*_channel_data.js' -File -Recurse
)

$issues = New-Object System.Collections.Generic.List[string]
$linkCount = 0

foreach ($file in $htmlFiles) {
  $content = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8

  if (-not [regex]::IsMatch($content, '<title\b[^>]*>\s*.+?\s*</title>', 'IgnoreCase,Singleline')) {
    $issues.Add("$($file.Name): missing page title")
  }

  if (-not [regex]::IsMatch($content, '<h1\b[^>]*>\s*.+?\s*</h1>', 'IgnoreCase,Singleline')) {
    $issues.Add("$($file.Name): missing H1")
  }

  $references = [regex]::Matches(
    $content,
    '(?:href|src)\s*=\s*["'']([^"'']+)["'']',
    'IgnoreCase'
  )

  foreach ($match in $references) {
    $reference = $match.Groups[1].Value.Trim()
    if (
      [string]::IsNullOrWhiteSpace($reference) -or
      $reference.Contains('${') -or
      $reference -match '^(?:https?:|mailto:|tel:|javascript:|data:|#|//)'
    ) {
      continue
    }

    $relativePath = ($reference -split '[?#]')[0]
    if ([string]::IsNullOrWhiteSpace($relativePath)) {
      continue
    }

    $linkCount++
    $decodedPath = [uri]::UnescapeDataString($relativePath).Replace('/', [IO.Path]::DirectorySeparatorChar)
    $targetPath = Join-Path -Path $file.DirectoryName -ChildPath $decodedPath
    if (-not (Test-Path -LiteralPath $targetPath)) {
      $issues.Add("$($file.Name): missing local target '$reference'")
    }
  }
}

$contactFiles = New-Object System.Collections.Generic.List[string]
$emailPattern = '(?i)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}'
foreach ($file in $dataFiles) {
  $content = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  $emailCount = @(
    [regex]::Matches($content, $emailPattern) |
      ForEach-Object { $_.Value.ToLowerInvariant() } |
      Sort-Object -Unique
  ).Count
  if ($emailCount -gt 0) {
    $contactFiles.Add("$($file.Name) ($emailCount unique email-like values)")
  }
}

Write-Host "Checked $($htmlFiles.Count) HTML pages and $linkCount local references."

if ($contactFiles.Count -gt 0) {
  Write-Warning "Potential contact data needs a public/private review:"
  $contactFiles | ForEach-Object { Write-Warning "  $_" }
  if ($FailOnPotentialContacts) {
    $issues.Add('Potential contact data found while strict privacy checking is enabled.')
  }
}

if ($issues.Count -gt 0) {
  Write-Error ("Website validation failed:`n- " + ($issues -join "`n- "))
  exit 1
}

Write-Host 'Website validation passed.'
