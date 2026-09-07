const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow = null;
let backendProcess = null;
const BACKEND_PORT = 8000;
const ROOT_DIR = path.resolve(__dirname, '..', '..');

function checkServerReady(callback, attempts = 0) {
  const req = http.get(`http://127.0.0.1:${BACKEND_PORT}/api/health`, (res) => {
    if (res.statusCode === 200) {
      callback(true);
    } else {
      retry();
    }
  });

  req.on('error', () => {
    retry();
  });

  function retry() {
    if (attempts > 30) {
      callback(false);
    } else {
      setTimeout(() => checkServerReady(callback, attempts + 1), 600);
    }
  }
}

function startBackend() {
  const isWin = process.platform === 'win32';
  const venvPython = path.join(ROOT_DIR, '.venv', isWin ? 'Scripts' : 'bin', isWin ? 'python.exe' : 'python');
  const pythonCmd = require('fs').existsSync(venvPython) ? venvPython : 'python';

  try {
    backendProcess = spawn(
      pythonCmd,
      ['-m', 'uvicorn', 'backend.app.main:app', '--host', '127.0.0.1', '--port', String(BACKEND_PORT)],
      {
        cwd: ROOT_DIR,
        stdio: 'ignore',
        detached: false,
      }
    );

    backendProcess.on('error', (err) => {
      console.warn('[Electron] Backend process error:', err);
    });
  } catch (err) {
    console.warn('[Electron] Could not spawn backend:', err);
  }
}

function createWindow() {
  const iconPath = path.join(__dirname, '..', 'public', 'icon-512.png');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    title: 'Reality to Play - AI Game Generator',
    icon: iconPath,
    backgroundColor: '#070912',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  checkServerReady((ready) => {
    if (ready) {
      mainWindow.loadURL(`http://127.0.0.1:${BACKEND_PORT}`);
    } else {
      // Fallback: load dist directly
      const distIndex = path.join(__dirname, '..', 'dist', 'index.html');
      if (require('fs').existsSync(distIndex)) {
        mainWindow.loadFile(distIndex);
      } else {
        mainWindow.loadURL(`http://127.0.0.1:${BACKEND_PORT}`);
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    try {
      backendProcess.kill();
    } catch { }
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    try {
      backendProcess.kill();
    } catch { }
  }
});

