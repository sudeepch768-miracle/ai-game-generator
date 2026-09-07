@echo off
title AI Game Generator - Launcher
color 0B

set "ROOT=%~dp0"
cd /d "%ROOT%"

set "PYTHON_EXE="

if exist "%ROOT%.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%ROOT%.venv\Scripts\python.exe"
    goto RunApp
)

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PYTHON_EXE=python"
    goto RunApp
)

where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PYTHON_EXE=py -3"
    goto RunApp
)

for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python3*") do (
    if exist "%%D\python.exe" (
        set "PYTHON_EXE=%%D\python.exe"
        goto RunApp
    )
)

:RunApp
if defined PYTHON_EXE (
    "%PYTHON_EXE%" "%ROOT%run.py" %*
) else (
    echo [!] Python not found. Please install Python 3.11+ from https://www.python.org
)

pause
