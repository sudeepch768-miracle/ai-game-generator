from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class MapConfig(BaseModel):
    width: int = Field(default=25, ge=15, le=60, description="Tile columns")
    height: int = Field(default=18, ge=12, le=45, description="Tile rows")
    tileSize: int = Field(default=38, description="Pixels per tile")
    theme: Optional[str] = Field(default="classroom", description="Visual theme identifier")

class Wall(BaseModel):
    x: int
    y: int
    width: int = 1
    height: int = 1

class GameObject(BaseModel):
    id: str
    type: Literal["obstacle", "interactive"] = "obstacle"
    name: str
    x: int
    y: int
    width: int = 1
    height: int = 1
    color: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None

class Collectible(BaseModel):
    id: str
    type: str = "key"
    name: str
    x: int
    y: int
    value: int = 100

class ExitPoint(BaseModel):
    x: int
    y: int
    name: Optional[str] = "Exit"

class NPC(BaseModel):
    id: str
    name: str
    x: int
    y: int
    dialogue: str
    avatar: Optional[str] = None

class VisualPalette(BaseModel):
    floorColor: Optional[str] = "#0a0e1c"
    floorTexture: Optional[str] = "grid"  # "snow" | "sand" | "cracks" | "cobblestone" | "circuit" | "organic" | "water" | "grid"
    wallTop: Optional[str] = "#1e293b"
    wallFront: Optional[str] = "#0f172a"
    wallRim: Optional[str] = "#00f2fe"
    weather: Optional[str] = None  # "snow" | "embers" | "bubbles" | "fog" | "sand" | "sparks"
    ambientLight: Optional[str] = None

class Enemy(BaseModel):
    id: str
    name: str
    type: Literal["patrol", "chaser", "exit_guardian"] = "patrol"
    x: int
    y: int
    patrolRange: int = 3
    speed: float = 2.0
    detectionRadius: Optional[float] = 5.0
    isAlert: Optional[bool] = False
    spriteTheme: Optional[str] = "drone"  # legacy fallback
    bodyShape: Optional[str] = None       # "golem_titan" | "quadruped_beast" | "floating_spirit" | "humanoid_guard" | "mechanical_turret" | "winged_drone"
    primaryColor: Optional[str] = None    # Hex color for creature body / fur / armor
    secondaryColor: Optional[str] = None  # Hex color for horns / markings / trim
    eyeColor: Optional[str] = None        # Hex color for glowing eyes / beam
    accessory: Optional[str] = None       # "horns" | "frost_aura" | "ice_crown" | "flame_aura" | "tail"

class Objective(BaseModel):
    type: Literal["collect_then_exit", "collect_all", "reach_exit"] = "collect_then_exit"
    requiredItems: Optional[List[str]] = Field(default_factory=lambda: ["key"])
    requiredScore: Optional[int] = Field(default=300, description="Minimum points required to unlock exit")
    requiredTerminals: Optional[List[str]] = Field(default_factory=list, description="Security terminals that must be hacked")
    description: str

class PlayerPosition(BaseModel):
    x: int
    y: int

class GameWorld(BaseModel):
    title: str
    genre: Literal["escape", "treasure_hunt", "adventure", "survival", "mystery"] = "escape"
    description: str
    difficulty: Literal["easy", "medium", "hard", "nightmare"] = "medium"
    timeLimit: int = Field(default=90, ge=20, le=300)
    levelNumber: Optional[int] = 1
    maxLevels: Optional[int] = 3
    levels: Optional[List['GameWorld']] = None
    palette: Optional[VisualPalette] = None
    map: MapConfig
    player: PlayerPosition
    walls: List[Wall] = Field(default_factory=list)
    objects: List[GameObject] = Field(default_factory=list)
    collectibles: List[Collectible] = Field(default_factory=list)
    exit: ExitPoint
    npcs: Optional[List[NPC]] = None
    enemies: Optional[List[Enemy]] = None
    objective: Objective

class SceneAnalysis(BaseModel):
    environment: str
    objects: List[str]
    layout: dict
    suggested_genre: Literal["escape", "treasure_hunt", "adventure", "survival", "mystery"]
    theme: str
