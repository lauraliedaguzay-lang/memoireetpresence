# Pousse le site vers GitHub (branche main). Utile si GitHub Pages est relié a cette branche.
# Usage : double-clic sur deploy-github.cmd  (contourne politique d'execution)
#         .\deploy-github.ps1  (si scripts autorises)
#         .\deploy-github.ps1 -Message "Texte du commit"

param(
  [string]$Message = "Mise à jour site"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$Git = if (Test-Path "C:\Program Files\Git\bin\git.exe") {
  "C:\Program Files\Git\bin\git.exe"
} else {
  "git"
}

Write-Host "Dossier : $PSScriptRoot" -ForegroundColor Cyan

& $Git add .

& $Git diff --cached --quiet
$hasStaged = ($LASTEXITCODE -ne 0)

if ($hasStaged) {
  & $Git commit -m $Message
} else {
  Write-Host "Aucun fichier modifie a commiter." -ForegroundColor Yellow
}

& $Git push origin main
Write-Host "Termine." -ForegroundColor Green
