@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  --- Mise a jour vers GitHub (quelques secondes) ---
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy-github.ps1" %*
echo.
if errorlevel 1 (
  echo [ ERREUR ] Regardez le message au-dessus. Si GitHub demande une connexion, relancez apres vous etre connectee.
) else (
  echo [ OK ] Termine. Vous pouvez fermer cette fenetre.
)
echo.
pause
