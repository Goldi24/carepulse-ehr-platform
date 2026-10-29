@echo off
title EHRS01 - Electronic Health Record System
echo ========================================================
echo   Starting EHRS01 (Electronic Health Record System)
echo ========================================================
echo.
cd /d "%~dp0\server"
start http://localhost:5000
npm start
pause
