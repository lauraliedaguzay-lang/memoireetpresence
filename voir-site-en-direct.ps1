#Requires -Version 5.1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Mémoire & Présence — aperçu en direct (rechargement auto à chaque enregistrement)" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Erreur : Node.js n'est pas installé." -ForegroundColor Red
    Write-Host "Téléchargez la version LTS : https://nodejs.org/"
    exit 1
}

if (-not (Test-Path "node_modules\live-server")) {
    Write-Host "Première utilisation : installation des outils (une seule fois)..."
    npm install
}

Write-Host "Ouverture sur http://127.0.0.1:5500 — laissez cette fenêtre ouverte. Ctrl+C pour arrêter." -ForegroundColor Green
Write-Host ""
npm run dev
