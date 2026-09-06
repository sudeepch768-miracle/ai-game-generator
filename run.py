"""
AI Game Generator -- Launcher
Starts the FastAPI backend and Vite frontend, then opens the browser.
"""
import subprocess
import sys
import os
import time
import socket
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
PYTHON = sys.executable
NODE_DIR = r"C:\Users\sudee\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64"
NPM = os.path.join(NODE_DIR, "npm.cmd")

BACKEND_PORT = 8000
FRONTEND_PORT = 5173
FRONTEND_URL = f"http://localhost:{FRONTEND_PORT}"

def port_open(host, port):
    try:
        with socket.create_connection((host, port), timeout=1):
            return True
    except OSError:
        return False

def wait_for_port_any(hosts, port, label, timeout=90):
    """Try multiple hosts (e.g. both IPv4 and IPv6) - returns True as soon as any one responds."""
    print(f"  Waiting for {label} on port {port}...", end="", flush=True)
    for _ in range(timeout):
        for h in hosts:
            if port_open(h, port):
                print(" OK")
                return True
        print(".", end="", flush=True)
        time.sleep(1)
    print(" TIMEOUT")
    return False

print()
print("  ==========================================")
print("       AI GAME GENERATOR  Launcher")
print("  ==========================================")
print()

print("  Starting FastAPI backend...")
backend_proc = subprocess.Popen(
    [PYTHON, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", str(BACKEND_PORT)],
    cwd=ROOT,
    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
)

print("  Starting Vite frontend...")
env = os.environ.copy()
env["PATH"] = NODE_DIR + os.pathsep + env.get("PATH", "")
frontend_proc = subprocess.Popen(
    [NPM, "run", "dev"],
    cwd=os.path.join(ROOT, "frontend"),
    env=env,
    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
)

# Check both IPv4 and IPv6 for each service
backend_ok  = wait_for_port_any(["127.0.0.1", "::1"], BACKEND_PORT,  "Backend")
frontend_ok = wait_for_port_any(["127.0.0.1", "::1"], FRONTEND_PORT, "Frontend")

if backend_ok and frontend_ok:
    print(f"\n  Opening {FRONTEND_URL} ...")
    webbrowser.open(FRONTEND_URL)
else:
    print("\n  WARNING: One or more services failed to start.")

print()
print("  Servers are running. Close this window to stop everything.")
print("  (Press Ctrl+C to shut down.)")
print()

try:
    backend_proc.wait()
except KeyboardInterrupt:
    pass
finally:
    print("\n  Shutting down...")
    try: backend_proc.terminate()
    except: pass
    try: frontend_proc.terminate()
    except: pass
