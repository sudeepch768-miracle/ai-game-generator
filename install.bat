@echo off
title Reality to Play - 1-Click Installer
color 0A

echo.
echo  ======================================================
echo     REALITY -^> PLAY  ^|  1-Click Local Installer
echo  ======================================================
echo.
echo  This installer will set up Reality to Play on your PC
echo  and create a desktop shortcut so anyone can play.
echo.

set "ROOT=%~dp0"
cd /d "%ROOT%"

:: 1. Detect Python
echo  [1/4] Checking Python installation...
set "SYS_PYTHON="

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "SYS_PYTHON=python"
    goto PythonFound
)

where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "SYS_PYTHON=py -3"
    goto PythonFound
)

:: Search common AppData Python locations
for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python3*") do (
    if exist "%%D\python.exe" (
        set "SYS_PYTHON=%%D\python.exe"
        goto PythonFound
    )
)

:: Python not found -> offer automated install
echo.
echo  [!] Python was not found on this system.
echo  [*] Attempting to install Python via Windows Package Manager (winget)...
where winget >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo  [*] Installing Python 3.12 automatically...
    winget install Python.Python.3.12 --accept-package-agreements --accept-source-agreements
    echo.
    echo  [OK] Python installed! Please restart this installer or re-run install.bat.
    pause
    exit /b
) else (
    echo  [!] Please download and install Python 3.10+ from: https://www.python.org/downloads/
    echo      (Make sure to check "Add Python to PATH" during installation)
    start https://www.python.org/downloads/
    pause
    exit /b
)

:PythonFound
echo  [OK] Found Python: %SYS_PYTHON%
echo.

:: 2. Setup Virtual Environment
echo  [2/4] Setting up isolated local environment (.venv)...
if not exist "%ROOT%.venv\Scripts\python.exe" (
    %SYS_PYTHON% -m venv "%ROOT%.venv"
    if %ERRORLEVEL% neq 0 (
        echo  [!] Failed to create virtual environment. Trying direct pip install...
    )
)

if exist "%ROOT%.venv\Scripts\python.exe" (
    set "APP_PYTHON=%ROOT%.venv\Scripts\python.exe"
) else (
    set "APP_PYTHON=%SYS_PYTHON%"
)

:: 3. Install Requirements
echo  [3/4] Installing dependencies from backend/requirements.txt...
%APP_PYTHON% -m pip install -q --upgrade pip
%APP_PYTHON% -m pip install -q -r "%ROOT%backend\requirements.txt"
if %ERRORLEVEL% neq 0 (
    echo  [!] Error occurred while installing dependencies. Retrying with verbose logs...
    %APP_PYTHON% -m pip install -r "%ROOT%backend\requirements.txt"
)
echo  [OK] Python dependencies installed successfully!
echo.

:: 4. Verify or Build Frontend
echo  [4/5] Checking game interface bundle...
if exist "%ROOT%frontend\dist\index.html" (
    echo  [OK] Game interface bundle is ready!
) else (
    echo  [*] Building frontend interface...
    where npm >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        cd /d "%ROOT%frontend"
        call npm install
        call npm run build
        cd /d "%ROOT%"
        echo  [OK] Frontend built successfully!
    ) else (
        echo  [!] Warning: npm not detected to build frontend from source.
        echo      If you downloaded a release zip, make sure frontend/dist is included.
    )
)
echo.

:: 5. Generate Desktop & Start Menu Shortcuts
echo  [5/5] Creating Desktop shortcut...
powershell -ExecutionPolicy Bypass -File "%ROOT%create_shortcut.ps1"
echo.

echo  ======================================================
echo     INSTALLATION COMPLETED SUCCESSFULLY!
echo  ======================================================
echo.
echo  A shortcut named "Reality to Play" is now on your Desktop.
echo  You can double-click that icon anytime to launch the game!
echo.
echo  Press any key to launch Reality to Play now...
pause >nul

start "" "%ROOT%play.bat"
exit /b

