# Regenerates client.js from client.template.js and the bundled Vazirmatn face.
# Usage: pwsh -File tools/build-client.ps1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$font = Join-Path $root 'assets\Vazirmatn-Variable.woff2'
$template = Join-Path $root 'client.template.js'
$output = Join-Path $root 'client.js'

$bytes = [System.IO.File]::ReadAllBytes($font)
if ($bytes.Length -lt 4 -or [System.Text.Encoding]::ASCII.GetString($bytes, 0, 4) -ne 'wOF2') {
  throw "Not a WOFF2 file: $font"
}

$base64 = [Convert]::ToBase64String($bytes)
$source = [System.IO.File]::ReadAllText($template)
if (-not $source.Contains('__VAZIRMATN_BASE64__')) {
  throw "Template placeholder missing: $template"
}

$result = $source.Replace('__VAZIRMATN_BASE64__', $base64)
$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($output, $result, $utf8)
"Wrote $output ({0} bytes, font {1} bytes)" -f $result.Length, $bytes.Length
