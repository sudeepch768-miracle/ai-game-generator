@echo off
title Reality to Play - Game Server & Launcher
color 0B

echo.
echo  ======================================================
echo     REALITY -^> PLAY  ^|  AI Game Generator
echo  ======================================================
echo.

set "ROOT=%~dp0"
cd /d "%ROOT%"

:: 1. Check for Virtual Environment
if exist "%ROOT%.venv\Scripts\python.exe" (
    set "PYTHON_CMD=%ROOT%.venv\Scripts\python.exe"
) else (
    where python >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        set "PYTHON_CMD=python"
    ) else (
        where py >nul 2>&1
        if %ERRORLEVEL% equ 0 (
            set "PYTHON_CMD=py -3"
        ) else (
            echo  [!] Application is not installed yet.
            echo  [*] Launching automatic installer...
            echo.
            call "%ROOT%install.bat"
            exit /b
        )
    )
)

:: 2. Check if server is already running on port 8000
powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', 8000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo  [*] Game server is already active on http://localhost:8000
    goto LaunchBrowser
)

:: 3. Start FastAPI Server
echo  [*] Starting game engine server...
start /b "" %PYTHON_CMD% -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 >nul 2>&1

:: 4. Wait for server to respond (up to 20 seconds)
echo  [*] Waiting for game engine to boot...
set "ATTEMPTS=0"
:WaitLoop
powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', 8000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
if %ERRORLEVEL% equ 0 goto LaunchBrowser
set /a ATTEMPTS+=1
if %ATTEMPTS% geq 20 (
    echo.
    echo  [!] Server startup took longer than expected. Attempting to open anyway...
    goto LaunchBrowser
)
timeout /t 1 /nobreak >nul
goto WaitLoop

:LaunchBrowser
echo  [OK] Game server is ready!
echo  [*] Launching Reality to Play window...
echo.

:: Try opening in native app window mode (Edge or Chrome)
where msedge >nul 2>&1
if %ERRORLEVEL% equ 0 (
    start msedge --app=http://localhost:8000
) else (
    where chrome >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        start chrome --app=http://localhost:8000
    ) else (
        start http://localhost:8000
    )
)

echo  ======================================================
echo     REALITY TO PLAY IS RUNNING!
echo     URL: http://localhost:8000
echo.
echo     Keep this window open while playing.
echo     Press Ctrl+C or close this window to exit.
echo  ======================================================
echo.

:: Keep running until closed
pause >nul

