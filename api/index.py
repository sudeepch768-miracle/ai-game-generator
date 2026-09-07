import sys
from pathlib import Path

# Add project root and backend to python path for Vercel Serverless Function
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))
sys.path.insert(0, str(ROOT_DIR / "backend"))

from backend.app.main import app

# Vercel looks for 'app' as the ASGI application entrypoint
__all__ = ["app"]
