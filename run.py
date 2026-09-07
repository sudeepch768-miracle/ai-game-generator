"""
REALITY -> PLAY  |  Universal Launcher
Starts the game server and launches the application window on any PC.
"""
import subprocess
import sys
import os
import time
import socket
import webbrowser
import shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
PYTHON = sys.executable
BACKEND_PORT = 8000
FRONTEND_PORT = 5173

def port_open(host: str, port: int) -> bool:
    try:
        with socket.create_connection((host, port), timeout=1):
            return True
    except OSError:
        return False

def wait_for_port(port: int, label: str, timeout: int = 30) -> bool:
    print(f"  [*] Waiting for {label} on port {port}...", end="", flush=True)
    for _ in range(timeout):
        for h in ["127.0.0.1", "::1"]:
            if port_open(h, port):
                print(" OK")
                return True
        print(".", end="", flush=True)
        time.sleep(1)
    print(" TIMEOUT")
    return False

def find_npm() -> str:
    """Dynamically search for npm in PATH and standard locations."""
    which_npm = shutil.which("npm") or shutil.which("npm.cmd")
    if which_npm:
        return which_npm

    # Common Windows install locations
    candidates = [
        os.path.expandvars(r"%ProgramFiles%\nodejs\npm.cmd"),
        os.path.expandvars(r"%ProgramFiles(x86)%\nodejs\npm.cmd"),
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\node\npm.cmd"),
    ]
    winget_dir = os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Packages")
    if os.path.isdir(winget_dir):
        for root, dirs, files in os.walk(winget_dir):
            if "npm.cmd" in files:
                candidates.append(os.path.join(root, "npm.cmd"))
                break

    for p in candidates:
        if os.path.isfile(p):
            return p
    return "npm"

def launch_app_window(url: str):
    """Launch in standalone app mode using Edge or Chrome if available, else default browser."""
    edge_cmd = shutil.which("msedge")
    if edge_cmd:
        try:
            subprocess.Popen([edge_cmd, f"--app={url}"])
            return
        except Exception:
            pass

    chrome_cmd = shutil.which("chrome")
    if chrome_cmd:
        try:
            subprocess.Popen([chrome_cmd, f"--app={url}"])
            return
        except Exception:
            pass

    webbrowser.open(url)

def main():
    is_dev = "--dev" in sys.argv
    dist_dir = os.path.join(ROOT, "frontend", "dist")
    has_dist = os.path.isfile(os.path.join(dist_dir, "index.html"))

    print()
    print("  ======================================================")
    print("     REALITY -> PLAY  |  AI Game Generator")
    print("  ======================================================")
    print()

    # Start FastAPI Backend
    print("  [*] Starting Game Server (FastAPI)...")
    backend_cmd = [
        PYTHON, "-m", "uvicorn", "backend.app.main:app",
        "--host", "127.0.0.1", "--port", str(BACKEND_PORT)
    ]
    creation_flags = getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
    backend_proc = subprocess.Popen(backend_cmd, cwd=ROOT, creationflags=creation_flags)

    frontend_proc = None

    if is_dev or not has_dist:
        # Dev mode with Vite
        npm_path = find_npm()
        print(f"  [*] Starting Vite Dev Server using {npm_path}...")
        frontend_proc = subprocess.Popen(
            [npm_path, "run", "dev"],
            cwd=os.path.join(ROOT, "frontend"),
            creationflags=creation_flags
        )
        target_port = FRONTEND_PORT
        target_url = f"http://localhost:{FRONTEND_PORT}"
        wait_for_port(BACKEND_PORT, "Backend")
        wait_for_port(FRONTEND_PORT, "Frontend")
    else:
        # Production mode: FastAPI serves pre-compiled SPA directly
        print("  [*] Running in Production Mode (Pre-built Single-Page App)")
        target_port = BACKEND_PORT
        target_url = f"http://localhost:{BACKEND_PORT}"
        wait_for_port(BACKEND_PORT, "Game Engine")

    print(f"\n  [OK] Launching Application Window ({target_url})...")
    launch_app_window(target_url)

    print()
    print("  ======================================================")
    print(f"     GAME IS RUNNING AT: {target_url}")
    print("     Press Ctrl+C to shut down.")
    print("  ======================================================")
    print()

    try:
        backend_proc.wait()
    except KeyboardInterrupt:
        pass
    finally:
        print("\n  [*] Shutting down servers...")
        try:
            backend_proc.terminate()
        except Exception:
            pass
        if frontend_proc:
            try:
                frontend_proc.terminate()
            except Exception:
                pass

if __name__ == "__main__":
    main()
