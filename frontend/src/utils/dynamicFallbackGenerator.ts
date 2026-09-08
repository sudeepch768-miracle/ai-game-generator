import { GameWorld, VisualPalette, GameObject, Enemy, CustomGameSettings } from '../types/game';
import {
  DEMO_HOSPITAL,
  DEMO_POLICE,
  DEMO_RAILWAY,
  DEMO_KITCHEN,
  DEMO_AIRPORT,
  DEMO_SNOW,
  DEMO_VOLCANO,
  DEMO_DESERT,
  DEMO_OCEAN,
  DEMO_SPACE,
  DEMO_HAUNTED,
  DEMO_BANK,
  DEMO_CYBER,
  DEMO_DUNGEON,
  DEMO_CLASSROOM,
  DEMO_NATURE,
} from '../demoGames';

interface ExtractedColors {
  floorColor: string;
  wallTop: string;
  wallFront: string;
  wallRim: string;
  floorTexture: string;
  isWarm: boolean;
  isGreen: boolean;
  isBlue: boolean;
  isDark: boolean;
}

export async function extractPaletteFromImage(file: File): Promise<ExtractedColors> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(getDefaultColors());
          return;
        }
        ctx.drawImage(img, 0, 0, 32, 32);
        const imgData = ctx.getImageData(0, 0, 32, 32).data;

        let totR = 0, totG = 0, totB = 0;
        let count = 0;
        let maxSat = 0;
        let accent = [0, 242, 254];

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          totR += r;
          totG += g;
          totB += b;
          count++;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;
          if (sat > maxSat && max > 80) {
            maxSat = sat;
            accent = [r, g, b];
          }
        }

        const avgR = Math.round(totR / count);
        const avgG = Math.round(totG / count);
        const avgB = Math.round(totB / count);

        const floorR = Math.max(10, Math.round(avgR * 0.18));
        const floorG = Math.max(12, Math.round(avgG * 0.18));
        const floorB = Math.max(18, Math.round(avgB * 0.18));
        const floorHex = '#' + floorR.toString(16).padStart(2, '0') + floorG.toString(16).padStart(2, '0') + floorB.toString(16).padStart(2, '0');

        const wtR = Math.min(255, Math.round(avgR * 0.45));
        const wtG = Math.min(255, Math.round(avgG * 0.45));
        const wtB = Math.min(255, Math.round(avgB * 0.45));
        const wallTopHex = '#' + wtR.toString(16).padStart(2, '0') + wtG.toString(16).padStart(2, '0') + wtB.toString(16).padStart(2, '0');

        const wfR = Math.max(12, Math.round(avgR * 0.28));
        const wfG = Math.max(14, Math.round(avgG * 0.28));
        const wfB = Math.max(20, Math.round(avgB * 0.28));
        const wallFrontHex = '#' + wfR.toString(16).padStart(2, '0') + wfG.toString(16).padStart(2, '0') + wfB.toString(16).padStart(2, '0');

        const rimHex = '#' + accent[0].toString(16).padStart(2, '0') + accent[1].toString(16).padStart(2, '0') + accent[2].toString(16).padStart(2, '0');

        const isWarm = avgR > avgB + 20;
        const isGreen = avgG > avgR + 15 && avgG > avgB;
        const isBlue = avgB > avgR + 15;
        const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;
        const isDark = brightness < 60;

        let floorTexture = 'grid';
        if (isWarm) floorTexture = 'wood';
        else if (isGreen) floorTexture = 'organic';
        else if (isDark) floorTexture = 'cracks';
        else if (isBlue) floorTexture = 'circuit';

        resolve({
          floorColor: floorHex,
          wallTop: wallTopHex,
          wallFront: wallFrontHex,
          wallRim: rimHex,
          floorTexture,
          isWarm,
          isGreen,
          isBlue,
          isDark,
        });
      };
      img.onerror = () => resolve(getDefaultColors());
      img.src = url;
    } catch {
      resolve(getDefaultColors());
    }
  });
}

function getDefaultColors(): ExtractedColors {
  return {
    floorColor: '#0a0e1c',
    wallTop: '#1e293b',
    wallFront: '#0f172a',
    wallRim: '#00f2fe',
    floorTexture: 'grid',
    isWarm: false,
    isGreen: false,
    isBlue: true,
    isDark: false,
  };
}

interface EnvironmentDefinition {
  title: string;
  theme: string;
  baseGame: GameWorld;
  obstacles: string[];
  obstacleColors: string[];
  guardianName: string;
  chaserName: string;
  description: string;
  defaultRim: string;
}

export function resolveEnvironmentDefinition(
  prompt: string,
  filename: string,
  sampleId: string,
  colors: ExtractedColors
): EnvironmentDefinition {
  const text = (prompt + ' ' + filename + ' ' + sampleId).toLowerCase();
  const words = new Set(text.match(/[a-z0-9]+/g) || []);

  const rawName = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
  const formattedFileName = rawName && !/^(img|photo|image|screenshot|untitled|asset)/i.test(rawName)
    ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
    : '';

  // Gym / Fitness
  if (['gym', 'fitness', 'workout', 'weights', 'crossfit', 'bench', 'barbell', 'dumbbell', 'treadmill'].some(w => words.has(w))) {
    return {
      title: formattedFileName || (prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : 'Titan Iron Gym Sector'),
      theme: 'gym',
      baseGame: DEMO_BANK,
      obstacles: ['Heavy Olympic Barbell Rack', 'Incline Dumbbell Bench', 'Power Squat Cage', 'Cardio Treadmill Station', 'Kettlebell Pyramids'],
      obstacleColors: ['#e11d48', '#f43f5e', '#fda4af', '#be123c', '#4c0519'],
      guardianName: 'TITAN IRON ENFORCER',
      chaserName: 'CARDIO PATROL BOT',
      description: 'Infiltrate the heavy iron training compound. Evade elite athletic enforcers and unlock the sector portal.',
      defaultRim: '#f43f5e',
    };
  }

  // Cafe / Coffee
  if (['cafe', 'coffee', 'tea', 'espresso', 'latte', 'barista', 'bakery'].some(w => words.has(w))) {
    return {
      title: formattedFileName || (prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : 'Artisan Roast Espresso Lounge'),
      theme: 'kitchen',
      baseGame: DEMO_KITCHEN,
      obstacles: ['Brass Espresso Machine', 'Granite Barista Counter', 'Pastry Display Showcase', 'Hardwood Cafe Table', 'Chalkboard Menu Board'],
      obstacleColors: ['#ea580c', '#d97706', '#f59e0b', '#78350f', '#fbbf24'],
      guardianName: 'ROAST CHIEF WARDEN',
      chaserName: 'LOUNGE PATROL BOT',
      description: 'Infiltrate the artisan coffee reserve. Collect rare roast tokens and bypass security.',
      defaultRim: '#ea580c',
    };
  }

  // Car / Garage / Auto
  if (['car', 'garage', 'vehicle', 'auto', 'mechanic', 'workshop', 'motor', 'engine'].some(w => words.has(w))) {
    return {
      title: formattedFileName || (prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : 'Apex Motors Speed Workshop'),
      theme: 'cyberpunk',
      baseGame: DEMO_CYBER,
      obstacles: ['Hydraulic Car Lift', 'Heavy Rolling Tool Chest', 'High-Performance Engine Block', 'Pneumatic Tire Changer', 'Welding Rig Cart'],
      obstacleColors: ['#3b82f6', '#60a5fa', '#1d4ed8', '#71717a', '#00f2fe'],
      guardianName: 'WORKSHOP FOREMAN TITAN',
      chaserName: 'SPEED PATROL DRONE',
      description: 'Infiltrate the subterranean automotive facility. Hack pneumatic terminals and reach extraction.',
      defaultRim: '#3b82f6',
    };
  }

  // Pet / Animal
  if (['pet', 'dog', 'cat', 'puppy', 'kitten', 'animal', 'canine', 'feline'].some(w => words.has(w))) {
    return {
      title: formattedFileName || (prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : 'Pet Sanctuary Haven'),
      theme: 'living_room',
      baseGame: DEMO_CLASSROOM,
      obstacles: ['Plush Pet Haven Bed', 'Climbing Scratch Tree', 'Ceramic Water Fountain', 'Interactive Play Tunnel', 'Feather Toy Carousel'],
      obstacleColors: ['#f59e0b', '#fbbf24', '#d97706', '#92400e', '#fef08a'],
      guardianName: 'SANCTUARY ALPHA GUARDIAN',
      chaserName: 'CREATURE PATROL SCOUT',
      description: 'Explore the playful pet haven. Collect treats, avoid alert sentries, and complete your rescue mission.',
      defaultRim: '#f59e0b',
    };
  }

  // Living Room / Home / Bedroom
  if (['living', 'couch', 'sofa', 'bedroom', 'home', 'house', 'lounge', 'apartment', 'room', 'dorm', 'bed'].some(w => words.has(w))) {
    return {
      title: formattedFileName || (prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : 'Domestic Hearth Sanctuary'),
      theme: 'living_room',
      baseGame: DEMO_CLASSROOM,
      obstacles: ['Velvet Sectional Sofa', 'Mahogany Coffee Table', 'Hardwood Bookshelf', 'Decorative Area Rug', 'Floor Standing Lamp'],
      obstacleColors: ['#c2410c', '#92400e', '#b45309', '#78350f', '#f59e0b'],
      guardianName: 'RESIDENCE OVERSEER WARDEN',
      chaserName: 'ROOM PATROL ENFORCER',
      description: 'Navigate the warm domestic quarters. Evade patrol enforcers, gather vital artifacts, and access the extraction portal.',
      defaultRim: '#f59e0b',
    };
  }

  // Kitchen / Restaurant
  if (['kitchen', 'restaurant', 'chef', 'cook', 'dining', 'bistro', 'stove', 'pantry', 'culinary'].some(w => words.has(w))) {
    return {
      title: formattedFileName || (prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : 'Executive Culinary Kitchen'),
      theme: 'kitchen',
      baseGame: DEMO_KITCHEN,
      obstacles: ['Commercial Stove Range', 'Stainless Prep Island', 'Industrial Refrigerator', 'Spice Storage Rack', 'Exhaust Hood Array'],
      obstacleColors: ['#f97316', '#ea580c', '#fb923c', '#c2410c', '#7c2d12'],
      guardianName: 'HEAD CHEF ENFORCER',
      chaserName: 'KITCHEN DISPATCH SENTRY',
      description: 'Infiltrate the 5-star culinary facility. Evade the head enforcer and claim the master recipe.',
      defaultRim: '#f97316',
    };
  }

  // Police / Precinct
  if (['police', 'cop', 'precinct', 'constable', 'sheriff', 'jail', 'prison', 'interrogation', 'detective'].some(w => words.has(w))) {
    return {
      title: formattedFileName || 'Metropolitan Police Precinct',
      theme: 'police',
      baseGame: DEMO_POLICE,
      obstacles: ['Holding Cell Bars', 'Precinct Booking Desk', 'Interrogation Table', 'Police Siren Beacon', 'Evidence Locker'],
      obstacleColors: ['#3b82f6', '#1d4ed8', '#60a5fa', '#93c5fd', '#1e3a8a'],
      guardianName: 'POLICE CHIEF COMMISSIONER',
      chaserName: 'PRECINCT PATROL OFFICER',
      description: 'Infiltrate the secure high-containment station. Retrieve evidence files and evade armed patrol officers.',
      defaultRim: '#3b82f6',
    };
  }

  // Airport / Aviation
  if (['airport', 'airplane', 'plane', 'aircraft', 'hangar', 'runway', 'tarmac', 'terminal', 'flight'].some(w => words.has(w))) {
    return {
      title: formattedFileName || 'International Jetway Terminal',
      theme: 'airport',
      baseGame: DEMO_AIRPORT,
      obstacles: ['Commercial Jet Airliner', 'Baggage Claim Carousel', 'Security Metal Detector', 'Gate Waiting Lounge', 'Jetway Boarding Ramp'],
      obstacleColors: ['#00f2fe', '#0284c7', '#38bdf8', '#64748b', '#cbd5e1'],
      guardianName: 'CHIEF FLIGHT CONTROLLER',
      chaserName: 'TERMINAL SECURITY SENTRY',
      description: 'Navigate the secure international transit sector. Hack boarding terminals and evade runway scanners.',
      defaultRim: '#00f2fe',
    };
  }

  // Nature / Forest / Garden / Outdoor
  if (['forest', 'nature', 'garden', 'backyard', 'tree', 'plant', 'outdoor', 'park', 'jungle', 'beach'].some(w => words.has(w))) {
    return {
      title: formattedFileName || 'Verdant Flora Reserve',
      theme: 'nature',
      baseGame: DEMO_NATURE,
      obstacles: ['Dense Foliage Cluster', 'Mossy Boulder', 'Ancient Timber Trunk', 'Fern Canopy', 'Stone Basin'],
      obstacleColors: ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#14532d'],
      guardianName: 'FOREST TITAN COLOSSUS',
      chaserName: 'WILDWOOD STALKER',
      description: 'Explore the overgrown wilderness sanctuary. Collect sacred relics and outmaneuver ancient nature wardens.',
      defaultRim: '#22c55e',
    };
  }

  // Street / Cyberpunk Urban
  if (['street', 'city', 'urban', 'road', 'alley', 'plaza', 'cyber', 'cyberpunk'].some(w => words.has(w))) {
    return {
      title: formattedFileName || 'Neon Urban Matrix',
      theme: 'cyberpunk',
      baseGame: DEMO_CYBER,
      obstacles: ['Neon Billboard Frame', 'Cyber Dumpster Unit', 'Steel Barrier Gate', 'Pneumatic Tube Terminal', 'Street Hydrant Core'],
      obstacleColors: ['#00f2fe', '#ff007f', '#3b82f6', '#71717a', '#e4e4e7'],
      guardianName: 'METRO ENFORCER TITAN',
      chaserName: 'CYBERNETIC STALKER',
      description: 'Infiltrate the glowing neon backstreets. Bypass surveillance lasers and override terminal security.',
      defaultRim: '#00f2fe',
    };
  }

  // Bank / Vault / Heist
  if (['bank', 'vault', 'gold', 'safe', 'cash', 'money', 'heist', 'bullion'].some(w => words.has(w))) {
    return {
      title: formattedFileName || 'Federal Reserve Vault',
      theme: 'bank',
      baseGame: DEMO_BANK,
      obstacles: ['Massive Bank Vault Door', 'Gold Bullion Pallet', 'Cash Reserve Pallet', 'Titanium Security Safe', 'Deposit Box Rack'],
      obstacleColors: ['#ffd700', '#f59e0b', '#d97706', '#b45309', '#fef08a'],
      guardianName: 'CHIEF VAULT OVERSEER',
      chaserName: 'ARMORED SECURITY ENFORCER',
      description: 'Break into the fortified bank vault. Collect gold bullion and reach extraction before lockdown.',
      defaultRim: '#ffd700',
    };
  }

  // Hospital
  if (['hospital', 'clinic', 'medical', 'doctor', 'nurse', 'surgery', 'patient', 'ward', 'health'].some(w => words.has(w))) {
    return {
      title: formattedFileName || 'St. Jude Trauma Center',
      theme: 'hospital',
      baseGame: DEMO_HOSPITAL,
      obstacles: ['Patient Hospital Bed', 'Vitals Heart Monitor', 'Surgical Operating Lamp', 'Medicine Cabinet', 'Mobile MRI Scanner'],
      obstacleColors: ['#38bdf8', '#0284c7', '#bae6fd', '#e0f2fe', '#0369a1'],
      guardianName: 'HEAD OF SURGERY WARDEN',
      chaserName: 'TRIAGE PATROL BOT',
      description: 'Navigate the sterile corridors of the trauma facility. Secure medical vials and extract safely.',
      defaultRim: '#38bdf8',
    };
  }

  // Visual Palette Fallback: Derived directly from image color clustering
  let autoTitle = formattedFileName || 'Custom Sector Infiltration';
  let chosenBase = DEMO_BANK;
  let customObs = ['Architectural Divider', 'Executive Workstation Desk', 'Security Terminal Kiosk', 'Display Pedestal', 'Server Array'];

  if (colors.isWarm) {
    autoTitle = formattedFileName || 'Sunlit Amber Sanctuary';
    chosenBase = DEMO_CLASSROOM;
    customObs = ['Velvet Sectional Sofa', 'Mahogany Coffee Table', 'Hardwood Bookshelf', 'Decorative Area Rug', 'Floor Standing Lamp'];
  } else if (colors.isGreen) {
    autoTitle = formattedFileName || 'Verdant Biosphere Domain';
    chosenBase = DEMO_NATURE;
    customObs = ['Dense Foliage Cluster', 'Mossy Boulder', 'Ancient Timber Trunk', 'Fern Canopy', 'Stone Basin'];
  } else if (colors.isDark) {
    autoTitle = formattedFileName || 'Obsidian Core Facility';
    chosenBase = DEMO_DUNGEON;
    customObs = ['Heavy Steel Barrier', 'Power Transformer', 'Reinforced Pillar', 'Industrial Pressure Tank', 'Scaffold Tower'];
  } else if (colors.isBlue) {
    autoTitle = formattedFileName || 'Cobalt Cyber Complex';
    chosenBase = DEMO_CYBER;
    customObs = ['Server Array', 'Holo Terminal', 'Cooling Core', 'Relay Node', 'Optical Cable Conduit'];
  }

  return {
    title: autoTitle,
    theme: colors.isWarm ? 'living_room' : (colors.isGreen ? 'nature' : (colors.isBlue ? 'cyberpunk' : 'bank')),
    baseGame: chosenBase,
    obstacles: customObs,
    obstacleColors: [colors.wallRim, colors.wallTop, '#3b82f6', '#f59e0b', '#10b981'],
    guardianName: autoTitle.toUpperCase() + ' GUARDIAN',
    chaserName: autoTitle.toUpperCase() + ' PATROL',
    description: 'Infiltrate ' + autoTitle + '. Evade alert sentries, hack security terminals, and reach the extraction portal.',
    defaultRim: colors.wallRim,
  };
}

export async function buildDynamicGameFromPhoto(
  file: File | null,
  prompt: string,
  settings?: CustomGameSettings,
  sampleId?: string
): Promise<GameWorld> {
  const extractedColors = file ? await extractPaletteFromImage(file) : getDefaultColors();
  const envDef = resolveEnvironmentDefinition(prompt || '', file?.name || '', sampleId || '', extractedColors);

  const diff = settings?.difficulty || 'medium';
  const timeLimits: Record<string, number> = { easy: 130, medium: 100, hard: 75, nightmare: 55 };

  const customPalette: VisualPalette = {
    floorColor: extractedColors.floorColor,
    floorTexture: extractedColors.floorTexture,
    wallTop: extractedColors.wallTop,
    wallFront: extractedColors.wallFront,
    wallRim: extractedColors.wallRim || envDef.defaultRim,
    weather: extractedColors.isGreen ? 'fog' : (extractedColors.isDark ? 'dust' : 'sparks'),
    ambientLight: extractedColors.wallRim || envDef.defaultRim,
  };

  const base = JSON.parse(JSON.stringify(envDef.baseGame)) as GameWorld;

  const customizedObjects: GameObject[] = (base.objects || []).map((obj, idx) => {
    if (obj.id.includes('terminal')) {
      return {
        ...obj,
        name: 'Security Override Terminal',
        color: customPalette.wallRim,
      };
    }
    const propName = envDef.obstacles[idx % envDef.obstacles.length];
    const propColor = envDef.obstacleColors[idx % envDef.obstacleColors.length];
    return {
      ...obj,
      name: propName,
      color: propColor,
      description: 'An authentic ' + propName + '.',
    };
  });

  const customizedEnemies: Enemy[] = (base.enemies || []).map((e, idx) => {
    if (e.type === 'exit_guardian' || idx === 0) {
      return {
        ...e,
        name: 'LEVEL 1 ' + envDef.guardianName,
        primaryColor: customPalette.wallRim,
        eyeColor: customPalette.wallRim,
      };
    }
    return {
      ...e,
      name: envDef.chaserName,
      primaryColor: customPalette.wallTop,
    };
  });

  const level1: GameWorld = {
    ...base,
    title: envDef.title + ' - Sector 1',
    map: { ...base.map, theme: envDef.theme },
    description: envDef.description,
    difficulty: diff,
    timeLimit: timeLimits[diff] || 100,
    levelNumber: 1,
    maxLevels: 3,
    palette: customPalette,
    objects: customizedObjects,
    enemies: customizedEnemies,
    objective: {
      ...base.objective,
      description: 'Level 1: Hack terminals, score ' + (base.objective?.requiredScore || 130) + '+ pts, evade ' + envDef.guardianName + ', and escape!',
    },
  };

  const campaignLevels: GameWorld[] = [1, 2, 3].map((lvlNum) => {
    const lvlObjects = customizedObjects.map((o) => ({
      ...o,
      id: o.id + '_lvl' + lvlNum,
    }));
    const lvlEnemies = customizedEnemies.map((e) => ({
      ...e,
      id: e.id + '_lvl' + lvlNum,
      name: e.type === 'exit_guardian' ? 'LEVEL ' + lvlNum + ' ' + envDef.guardianName : e.name,
      speed: Math.round((e.speed + (lvlNum - 1) * 0.25) * 100) / 100,
    }));

    return {
      ...level1,
      title: envDef.title + ' - Sector ' + lvlNum,
      levelNumber: lvlNum,
      objects: lvlObjects,
      enemies: lvlEnemies,
      timeLimit: Math.max(45, (timeLimits[diff] || 100) - (lvlNum - 1) * 15),
      objective: {
        ...level1.objective,
        description: 'Sector ' + lvlNum + ': Score ' + ((base.objective?.requiredScore || 130) + (lvlNum - 1) * 50) + '+ pts and override sector lock!',
      },
    };
  });

  level1.levels = campaignLevels;
  return level1;
}
