@echo off
chcp 65001 >nul
title NoTime - Memento Mori Wallpaper
cd /d "%~dp0"
if not exist node_modules (
    call npm install
)
start http://localhost:3000
npm start
