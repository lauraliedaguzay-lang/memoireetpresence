@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo Mémoire ^& Présence — aperçu en direct (rechargement auto à chaque enregistrement)
echo.

if not exist "images\logo-memoire-presence.png" (
  echo [!] Aucune image dans images\ — le site sera sans logo ni photos.
  echo     Double-cliquez sur restaurer-les-images.cmd puis relancez ce fichier.
  echo.
)

where node >nul 2>nul
if errorlevel 1 (
  echo Erreur : Node.js n'est pas installé.
  echo Téléchargez la version LTS : https://nodejs.org/
  echo.
  pause
  exit /b 1
)
if not exist "node_modules\live-server" (
  echo Première utilisation : installation des outils (une seule fois^)...
  call npm install
  if errorlevel 1 (
    echo Échec de npm install.
    pause
    exit /b 1
  )
)
echo Ouverture du site sur http://127.0.0.1:5500 — laissez cette fenêtre ouverte.
echo Fermez avec Ctrl+C quand vous avez terminé.
echo.
call npm run dev
