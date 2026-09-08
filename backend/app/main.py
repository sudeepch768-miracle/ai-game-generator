import os
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .schemas import GameWorld
from .ai_generator import analyze_and_generate_world
from .demo_data import ALL_DEMO_WORLDS, DEMO_CLASSROOM

load_dotenv()

app = FastAPI(
    title="REALITY → PLAY API",
    description="Multimodal AI Generative 2D Game World Synthesis Backend",
    version="1.0.0"
)

# CORS setup for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def vercel_route_middleware(request: Request, call_next):
    # Support Vercel serverless function path preservation
    param_path = request.query_params.get("__path__")
    if param_path:
        request.scope["path"] = param_path.split("?")[0]
    else:
        matched = (
            request.headers.get("x-vercel-matched-path")
            or request.headers.get("x-matched-path")
            or request.headers.get("x-forwarded-uri")
        )
        if matched:
            clean_path = matched.split("?")[0]
            if clean_path.startswith("/api") and clean_path not in ("/api", "/api/"):
                request.scope["path"] = clean_path
        elif request.scope.get("path", "").endswith("/index.py"):
            request.scope["path"] = "/api"

    return await call_next(request)

@app.get("/api")
@app.get("/api/")
def api_root():
    return {
        "status": "ok",
        "service": "REALITY → PLAY Engine",
        "version": "1.0.0"
    }

@app.get("/api/health")
@app.get("/health")
def health():
    has_env_key = bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
    return {
        "status": "ok",
        "service": "REALITY → PLAY Engine",
        "gemini_configured": has_env_key
    }

@app.get("/api/demo-games")
@app.get("/demo-games")
def get_demo_games():
    return list(ALL_DEMO_WORLDS.values())

@app.post("/api/generate-game", response_model=GameWorld)
@app.post("/generate-game", response_model=GameWorld)
async def generate_game(
    image: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    difficulty: Optional[str] = Form("medium"),
    map_size: Optional[str] = Form("standard"),
    hazard_level: Optional[str] = Form("moderate"),
    theme: Optional[str] = Form(None),
    custom_prompt: Optional[str] = Form(None),
    x_gemini_api_key: Optional[str] = Header(None)
):
    """
    Analyzes uploaded environment image, synthesizes a 2D game world JSON,
    validates BFS reachability, and returns guaranteed playable game data.
    """
    image_bytes = None
    image_filename = None
    if image:
        image_bytes = await image.read()
        image_filename = image.filename

    world = analyze_and_generate_world(
        image_bytes=image_bytes,
        image_filename=image_filename,
        sample_id=sample_id,
        api_key=x_gemini_api_key,
        difficulty=difficulty or "medium",
        map_size=map_size or "standard",
        hazard_level=hazard_level or "moderate",
        theme=theme,
        custom_prompt=custom_prompt
    )

    return world

from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

DIST_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if DIST_DIR.exists():
    assets_dir = DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        target_file = DIST_DIR / full_path
        if target_file.exists() and target_file.is_file():
            return FileResponse(target_file)
        return FileResponse(DIST_DIR / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
