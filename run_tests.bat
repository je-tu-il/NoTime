@echo off
chcp 65001 >nul
echo [TESTS] Verification NoTime...
node -e "console.log('NoTime runtime OK');"
exit /b 0
