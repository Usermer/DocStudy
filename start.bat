@echo off
echo.
echo ============================================================
echo   🚀 DEMARRAGE DU SYSTEME RAG + ANGULAR
echo ============================================================
echo.

REM Coleurs pour Windows
echo Étape 1: Vérification de l'environnement...
python --version
echo.

echo Étape 2: Lancement de l'API RAG (port 5000)...
REM Ouvrir une nouvelle fenêtre PowerShell pour l'API
start powershell -NoExit -Command "cd 'C:\Users\Pc\Desktop\ILIA 2-sem2\compagnon ia\rag\Comganon-ia'; python src/api.py"

echo.
echo ⏳ Attendre 3 secondes que l'API démarre...
timeout /t 3 /nobreak

echo.
echo Étape 3: Lancement d'Angular (port 4200)...
REM Ouvrir une nouvelle fenêtre PowerShell pour Angular
start powershell -NoExit -Command "cd 'C:\Users\Pc\Desktop\ILIA 2-sem2\compagnon ia\client'; npm start"

echo.
echo ============================================================
echo ✅ SYSTEME LANCE !
echo ============================================================
echo.
echo 🌐 Interface Angular: http://localhost:4200
echo 🤖 API RAG:         http://localhost:5000/api
echo 📚 Docs API:        http://localhost:5000/docs
echo.
echo Pour arrêter, fermez les fenêtres PowerShell
echo.
pause
