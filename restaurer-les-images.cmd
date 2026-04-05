@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "SRC=%USERPROFILE%\Downloads"
set "ERR=0"

echo.
echo Mémoire ^& Présence — restauration des images dans le dossier images\
echo.

if not exist "%SRC%\F3572B5F-F7A0-4ED1-9047-ABE22D4CB54A-removebg-preview.png" (
  echo [Erreur] Fichier introuvable dans Téléchargements :
  echo   F3572B5F-F7A0-4ED1-9047-ABE22D4CB54A-removebg-preview.png
  set ERR=1
)
if not exist "%SRC%\124AC199-1A1D-4631-A2AC-90A8132BD277.png" (
  echo [Erreur] Manque la photo plaque : 124AC199-1A1D-4631-A2AC-90A8132BD277.png
  set ERR=1
)
if not exist "%SRC%\unnamed.png" (
  echo [Erreur] Manque le fond sable : unnamed.png
  set ERR=1
)
if not exist "%SRC%\DFA52B72-EB05-410A-90C4-A6FCB82C3A70.png" (
  echo [Erreur] Manque le formulaire : DFA52B72-EB05-410A-90C4-A6FCB82C3A70.png
  set ERR=1
)

if %ERR%==1 (
  echo.
  echo Mettez ces fichiers dans Téléchargements ^(ou copiez-les ^à la main dans images\^).
  echo.
  pause
  exit /b 1
)

if not exist "images" mkdir "images"
if not exist "images\realisations" mkdir "images\realisations"

copy /Y "%SRC%\F3572B5F-F7A0-4ED1-9047-ABE22D4CB54A-removebg-preview.png" "images\logo-memoire-presence.png"
copy /Y "%SRC%\124AC199-1A1D-4631-A2AC-90A8132BD277.png" "images\plaque-exemple.png"
copy /Y "%SRC%\unnamed.png" "images\bg-sable.png"
copy /Y "%SRC%\DFA52B72-EB05-410A-90C4-A6FCB82C3A70.png" "images\formulaire-accompagnement-reference.png"

copy /Y "images\plaque-exemple.png" "images\realisations\realisation-01.png"
copy /Y "images\plaque-exemple.png" "images\realisations\realisation-02.png"
copy /Y "images\plaque-exemple.png" "images\realisations\realisation-03.png"
copy /Y "images\plaque-exemple.png" "images\realisations\realisation-04.png"

if not exist "hommage\famille-martin" mkdir "hommage\famille-martin"
copy /Y "images\plaque-exemple.png" "hommage\famille-martin\portrait.png"

echo.
echo Terminé. Fichiers mis à jour :
echo ^(Les fichiers .svg logo-marque.svg et photo-manquante.svg restent dans images\ — gardez-les dans le ZIP Netlify.^)
dir /b images\*.png
dir /b images\*.svg
dir /b images\realisations\*.png
echo.
pause
