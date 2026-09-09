import { GameWorld, GameObject, Wall, Collectible } from '../types/game';

const THEME_TERMINAL_NAMES: Record<string, string> = {
  castle: 'Royal Sovereign Altar',
  hospital: 'Trauma ICU Central Workstation',
  living_room: 'Smart Home Automation Hub',
  gym: 'Titan Athletic Biometric Hub',
  bank: 'Federal Vault Core Terminal',
  police: 'Precinct Central Dispatch Console',
  railway: 'Rail Interlocking Dispatch Board',
  snow: 'Sub-Zero Cryo Command Terminal',
  volcano: 'Geothermal Core Stabilizer',
  cyberpunk: 'Quantum Firewall Terminal',
  cyber: 'Quantum Firewall Terminal',
  kitchen: 'Executive Culinary Console',
  airport: 'International Flight Control Board',
  nature: 'Sacred Grove Altar',
  desert: 'Ancient Pyramidal Relic Terminal',
  classroom: 'Academy Mainframe Console',
};

function getTerminalTitle(theme?: string): string {
  if (!theme) return 'Central Command Terminal';
  const clean = theme.toLowerCase().trim();
  for (const [key, title] of Object.entries(THEME_TERMINAL_NAMES)) {
    if (clean.includes(key)) return title;
  }
  return 'Central Command Terminal';
}

function isTileInWall(walls: Wall[], x: number, y: number): boolean {
  for (const w of walls) {
    if (x >= w.x && x < w.x + w.width && y >= w.y && y < w.y + w.height) {
      return true;
    }
  }
  return false;
}

function enrichSingleLevel(level: GameWorld, lvlNum: number): void {
  const mw = level.map?.width || 25;
  const mh = level.map?.height || 18;
  const px = level.player?.x ?? 2;
  const py = level.player?.y ?? 2;
  const ex = level.exit?.x ?? (mw - 3);
  const ey = level.exit?.y ?? (mh - 3);
  const theme = level.map?.theme || 'cyber';
  const terminalName = getTerminalTitle(theme);

  if (!level.objects) level.objects = [];
  if (!level.collectibles) level.collectibles = [];
  if (!level.walls) level.walls = [];
  if (!level.objective) {
    level.objective = {
      type: 'collect_then_exit',
      requiredItems: [],
      requiredScore: 80,
      description: '',
    };
  }

  // -------------------------------------------------------------
  // 1. TERMINAL SANCTUM: Fully enclosed by normal walls with 1 locked gate
  // -------------------------------------------------------------
  const existingBarrier = level.objects.find(
    (o) => o.type === 'terminal_barrier' || o.id.includes('terminal_barrier')
  );
  const existingTerm = level.objects.find(
    (o) => o.type === 'interactive' && (o.id.includes('terminal') || o.id.includes('term'))
  );

  let sanctumX = 0;
  let sanctumY = 0;
  const trw = 6;
  const trh = 5;

  if (!existingBarrier || !existingTerm) {
    // Determine the best corner / edge candidate for the sanctum room
    const candidates = [
      // Top-Right
      { x: mw - trw - 2, y: 2, doorSide: 'south' },
      // Bottom-Left
      { x: 2, y: mh - trh - 2, doorSide: 'north' },
      // Bottom-Right
      { x: mw - trw - 2, y: mh - trh - 2, doorSide: 'north' },
      // Center-North
      { x: Math.max(2, Math.min(mw - trw - 2, Math.floor(mw / 2) - 3)), y: 2, doorSide: 'south' },
      // Center-South
      { x: Math.max(2, Math.min(mw - trw - 2, Math.floor(mw / 2) - 3)), y: mh - trh - 2, doorSide: 'north' },
    ];

    // Score candidates by distance from player start and exit
    let bestCandidate = candidates[0];
    let bestMinDist = -1;

    for (const c of candidates) {
      const centerX = c.x + Math.floor(trw / 2);
      const centerY = c.y + Math.floor(trh / 2);
      const distP = Math.hypot(centerX - px, centerY - py);
      const distE = Math.hypot(centerX - ex, centerY - ey);
      const minDist = Math.min(distP, distE);
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestCandidate = c;
      }
    }

    sanctumX = bestCandidate.x;
    sanctumY = bestCandidate.y;

    // Doorway coordinates
    let doorX = sanctumX + Math.floor(trw / 2);
    let doorY = bestCandidate.doorSide === 'south' ? sanctumY + trh - 1 : sanctumY;

    // Clear any existing walls inside or along the doorway
    const filteredWalls: Wall[] = [];
    for (const w of level.walls) {
      // If a wall is a multi-tile segment overlapping the sanctum interior, break it up
      let overlapsInterior = false;
      for (let wy = w.y; wy < w.y + w.height; wy++) {
        for (let wx = w.x; wx < w.x + w.width; wx++) {
          if (
            (wx >= sanctumX && wx < sanctumX + trw && wy >= sanctumY && wy < sanctumY + trh) ||
            (wx === doorX && wy === doorY)
          ) {
            overlapsInterior = true;
            break;
          }
        }
        if (overlapsInterior) break;
      }

      if (!overlapsInterior) {
        filteredWalls.push(w);
      } else {
        // Break 1x1 tiles outside the sanctum
        for (let wy = w.y; wy < w.y + w.height; wy++) {
          for (let wx = w.x; wx < w.x + w.width; wx++) {
            const inSanctum = wx >= sanctumX && wx < sanctumX + trw && wy >= sanctumY && wy < sanctumY + trh;
            const isDoor = wx === doorX && wy === doorY;
            if (!inSanctum && !isDoor) {
              filteredWalls.push({ x: wx, y: wy, width: 1, height: 1 });
            }
          }
        }
      }
    }

    // Clear any existing collectibles or objects inside the sanctum
    level.collectibles = level.collectibles.filter(
      (c) => !(c.x >= sanctumX && c.x < sanctumX + trw && c.y >= sanctumY && c.y < sanctumY + trh)
    );
    level.objects = level.objects.filter(
      (o) => !(o.x >= sanctumX && o.x < sanctumX + trw && o.y >= sanctumY && o.y < sanctumY + trh)
    );

    // Build the solid perimeter walls on all 4 sides EXCEPT at the single doorway
    const perimeterWalls: Wall[] = [];
    for (let x = sanctumX; x < sanctumX + trw; x++) {
      // Top wall
      if (!(x === doorX && sanctumY === doorY)) {
        perimeterWalls.push({ x, y: sanctumY, width: 1, height: 1 });
      }
      // Bottom wall
      if (!(x === doorX && sanctumY + trh - 1 === doorY)) {
        perimeterWalls.push({ x, y: sanctumY + trh - 1, width: 1, height: 1 });
      }
    }
    for (let y = sanctumY + 1; y < sanctumY + trh - 1; y++) {
      // Left wall
      if (!(sanctumX === doorX && y === doorY)) {
        perimeterWalls.push({ x: sanctumX, y, width: 1, height: 1 });
      }
      // Right wall
      if (!(sanctumX + trw - 1 === doorX && y === doorY)) {
        perimeterWalls.push({ x: sanctumX + trw - 1, y, width: 1, height: 1 });
      }
    }

    level.walls = [...filteredWalls, ...perimeterWalls];

    // Ensure the approach tile immediately outside the doorway is clear floor
    const approachY = bestCandidate.doorSide === 'south' ? doorY + 1 : doorY - 1;
    level.walls = level.walls.filter((w) => !(w.x === doorX && w.y === approachY && w.width === 1 && w.height === 1));

    // Place the Terminal Barrier (Locked Gate) directly on the single doorway
    const barrierId = `terminal_barrier_${lvlNum}`;
    level.objects.push({
      id: barrierId,
      type: 'terminal_barrier',
      name: `${terminalName} Security Gate`,
      x: doorX,
      y: doorY,
      width: 1,
      height: 1,
      color: '#ef4444',
      description: `🔒 ${terminalName} Security Gate: Sealed until all keys and required score are achieved.`,
    });

    // Place the Interactive Terminal at the center of the sanctum
    const termX = sanctumX + Math.floor(trw / 2);
    const termY = sanctumY + Math.floor(trh / 2);
    const termId = `terminal_${lvlNum}`;
    level.objects.push({
      id: termId,
      type: 'interactive',
      name: terminalName,
      x: termX,
      y: termY,
      width: 1,
      height: 1,
      color: level.palette?.wallRim || '#00f2fe',
      description: `${terminalName.toUpperCase()}: Press E while nearby to override sector lock!`,
    });

    if (!level.objective.requiredTerminals) {
      level.objective.requiredTerminals = [];
    }
    if (!level.objective.requiredTerminals.includes(termId)) {
      level.objective.requiredTerminals.push(termId);
    }
  }

  // -------------------------------------------------------------
  // 2. HEALTH ITEMS: Spawn exactly 2 Healing Items per level
  // -------------------------------------------------------------
  const existingHeals = level.collectibles.filter(
    (c) => c.type === 'heal' || c.id.includes('heal')
  );

  const neededHeals = Math.max(0, 2 - existingHeals.length);

  if (neededHeals > 0) {
    // Find safe, walkable floor tiles outside the sanctum
    const safeTiles: { x: number; y: number }[] = [];

    for (let y = 2; y < mh - 2; y++) {
      for (let x = 2; x < mw - 2; x++) {
        // Must not be in wall
        if (isTileInWall(level.walls, x, y)) continue;
        // Must not be in sanctum
        if (x >= sanctumX && x < sanctumX + trw && y >= sanctumY && y < sanctumY + trh) continue;
        // Must not be on player or exit
        if (Math.hypot(x - px, y - py) < 3) continue;
        if (Math.hypot(x - ex, y - ey) < 2) continue;
        // Must not already have a collectible
        if (level.collectibles.some((c) => c.x === x && c.y === y)) continue;

        safeTiles.push({ x, y });
      }
    }

    // Pick tiles distributed across the map
    safeTiles.sort((a, b) => {
      const distA = Math.hypot(a.x - px, a.y - py);
      const distB = Math.hypot(b.x - px, b.y - py);
      return distA - distB;
    });

    for (let i = 0; i < neededHeals; i++) {
      let chosen = safeTiles[Math.floor(safeTiles.length * (0.3 + i * 0.4))] || safeTiles[i];
      if (!chosen) {
        chosen = {
          x: Math.max(2, Math.min(mw - 3, px + 4 + i * 3)),
          y: Math.max(2, Math.min(mh - 3, py + 3 + i * 2)),
        };
      }

      level.collectibles.push({
        id: `heal_${lvlNum}_${i + 1}`,
        type: 'heal',
        name: 'Emergency Medkit (+1 Heart)',
        x: chosen.x,
        y: chosen.y,
        value: 15,
      });
    }
  }

  // -------------------------------------------------------------
  // 3. OBJECTIVE DESCRIPTION
  // -------------------------------------------------------------
  const reqScore = level.objective.requiredScore || 80;
  const keyCount = (level.objective.requiredItems || []).length;
  const keyMsg = keyCount > 0 ? `${keyCount} Key${keyCount > 1 ? 's' : ''}` : 'Keys';
  level.objective.description = `Level ${lvlNum}: Collect ${keyMsg} & Score ${reqScore}+ pts to Unlock Gate -> Hack ${terminalName} -> Escape!`;
}

export function enrichGameWorldWithSanctumAndHeals(world: GameWorld): GameWorld {
  if (!world) return world;

  // Deep clone to ensure immutability of source templates
  const enriched: GameWorld = JSON.parse(JSON.stringify(world));

  // Enrich root level (Level 1)
  enrichSingleLevel(enriched, enriched.levelNumber || 1);

  // Enrich campaign sub-levels if present
  if (enriched.levels && enriched.levels.length > 0) {
    enriched.levels = enriched.levels.map((lvl, idx) => {
      const clone = JSON.parse(JSON.stringify(lvl));
      enrichSingleLevel(clone, lvl.levelNumber || idx + 1);
      return clone;
    });
  }

  return enriched;
}
