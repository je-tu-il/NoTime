@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [TESTS] Verification de la suite de tests NoTime (SVG / PNG / Stats)...
node test_notime.js
if %ERRORLEVEL% EQU 0 (
    echo [OK] Tous les tests NoTime sont valides.
    exit /b 0
) else (
    echo [ERREUR] Echec des tests NoTime.
    exit /b 1
)
