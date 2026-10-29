@echo off
title CarePulse EHR - Electronic Health Record System
echo ========================================================
echo   Starting CarePulse EHR Platform (v2.0)
echo ========================================================
echo.
echo Opening CarePulse EHR at http://localhost:5000 in your browser...
cd /d "%~dp0\server"
start http://localhost:5000
npm start
pause
