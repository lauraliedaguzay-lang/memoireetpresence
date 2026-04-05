@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "OUT=%~dp0..\memoire-presence-NETLIFY.zip"

echo.
echo Création du ZIP Netlify ^(inclut le dossier images\ — indispensable pour les photos^)
echo Destination : %OUT%
echo.

if not exist "images\logo-memoire-presence.png" (
  echo [!] Attention : images\ semble incomplet. Lancez d'abord restaurer-les-images.cmd
  echo.
)

if exist "%OUT%" del /f /q "%OUT%"

where tar >nul 2>nul
if errorlevel 1 (
  echo Erreur : l'outil « tar » n'est pas disponible. Windows 10/11 le fournit normalement.
  pause
  exit /b 1
)

tar -a -c -f "%OUT%" --exclude=.git --exclude=node_modules --exclude=.github --exclude=.cursor --exclude=*.zip --exclude=*.cmd --exclude=*.ps1 --exclude=*.txt --exclude=*.md --exclude=*.rar *

if errorlevel 1 (
  echo Échec de la compression.
  pause
  exit /b 1
)

echo OK — déposez ce fichier sur https://app.netlify.com/drop
echo.
pause
