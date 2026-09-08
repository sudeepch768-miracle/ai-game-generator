export type GameGenre = 'escape' | 'treasure_hunt' | 'adventure' | 'survival' | 'mystery';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'nightmare';

export interface CustomGameSettings {
  difficulty: Difficulty;
  mapSize: 'compact' | 'standard' | 'large';
  hazardLevel: 'none' | 'moderate' | 'extreme';
  timeScale: 'relaxed' | 'standard' | 'tight';
  genre?: GameGenre;
  theme?: string;
  customPrompt?: string;
}

export interface MapConfig {
  width: number;       // Logical tile columns, e.g. 25
  height: number;      // Logical tile rows, e.g. 18
  tileSize: number;    // Pixels per tile, e.g. 36
  theme?: string;      // 'classroom' | 'cyberpunk' | 'dungeon' | 'nature' | 'office' | 'default'
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameObject {
  id: string;
  type: 'obstacle' | 'interactive' | 'terminal_barrier';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  description?: string;
  icon?: string;       // e.g. 'desk', 'chair', 'bookshelf', 'computer', 'crate', 'plant'
}

export interface Collectible {
  id: string;
  type: 'key' | 'gem' | 'coin' | 'document' | 'tool' | 'star' | 'cash' | 'gold' | 'badge' | 'pass' | 'medkit' | 'recipe' | 'token' | 'tag' | 'evidence' | string;
  name: string;
  x: number;
  y: number;
  value: number;
  collected?: boolean;
}

export interface ExitPoint {
  x: number;
  y: number;
  name?: string;
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  dialogue: string;
  avatar?: string;
}

export interface VisualPalette {
  floorColor?: string;
  floorTexture?: 'snow' | 'sand' | 'cracks' | 'cobblestone' | 'circuit' | 'organic' | 'water' | 'grid' | string;
  wallTop?: string;
  wallFront?: string;
  wallRim?: string;
  weather?: 'snow' | 'embers' | 'bubbles' | 'fog' | 'sand' | 'sparks' | string;
  ambientLight?: string;
}

export interface Enemy {
  id: string;
  name: string;
  type?: 'patrol' | 'chaser' | 'exit_guardian';
  x: number;
  y: number;
  patrolRange: number;
  speed: number;
  startX?: number;
  startY?: number;
  direction?: number;
  detectionRadius?: number;
  isAlert?: boolean;
  spriteTheme?: 'ghost' | 'guard' | 'laser' | 'drone' | 'monster' | string;
  bodyShape?: 'golem_titan' | 'quadruped_beast' | 'floating_spirit' | 'humanoid_guard' | 'mechanical_turret' | 'winged_drone' | string;
  primaryColor?: string;
  secondaryColor?: string;
  eyeColor?: string;
  accessory?: string;
  isStunned?: boolean;
  stunTime?: number;
  aggroTimer?: number;
  lastKnownX?: number;
  lastKnownY?: number;
  patrolAxis?: 'x' | 'y';
  burstTimer?: number;
}

export interface Objective {
  type: 'collect_then_exit' | 'collect_all' | 'reach_exit';
  requiredItems?: string[];
  requiredScore?: number; // Minimum points required before exit unseals!
  requiredTerminals?: string[]; // Terminals that must be hacked
  description: string;
}

export interface GameWorld {
  title: string;
  genre: GameGenre;
  description: string;
  difficulty: Difficulty;
  timeLimit: number;   // In seconds
  levelNumber?: number; // 1, 2, or 3
  maxLevels?: number;   // 3
  levels?: GameWorld[]; // Full 3-level campaign
  palette?: VisualPalette;
  map: MapConfig;
  player: {
    x: number;
    y: number;
  };
  walls: Wall[];
  objects: GameObject[];
  collectibles: Collectible[];
  exit: ExitPoint;
  npcs?: NPC[];
  enemies?: Enemy[];
  objective: Objective;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  vy: number;
  lifetime: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface StunProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  lifetime: number;
}

export interface EngineState {
  player: {
    x: number;        // Pixel coordinates
    y: number;
    width: number;
    height: number;
    speed: number;
    facing: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
    walkFrame: number;
    invincibleTime?: number;
    dashCooldown: number; // 0 when ready, up to 1.2s
    isDashing: boolean;
  };
  score: number;
  levelScore: number;
  comboCount: number;
  comboTimer: number;
  hackedTerminals: Record<string, boolean>;
  health: number;
  maxHealth: number;
  timeLeft: number;
  currentLevel: number;
  maxLevels: number;
  isWon: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  collectedItems: Record<string, number>; // id -> count
  nearbyInteractable: {
    type: 'npc' | 'object' | 'terminal' | 'exit' | 'sneak_takedown';
    entity: any;
    prompt: string;
  } | null;
  activeDialogue: {
    title: string;
    text: string;
  } | null;
  screenShake: number;
  // Stealth & Stun mechanics
  isStealth: boolean;
  stunAmmo: number;
  maxStunAmmo: number;
  stunCooldown: number;
  equippedSkinId: string;
  canSneakTakedown?: Enemy | null;
}
