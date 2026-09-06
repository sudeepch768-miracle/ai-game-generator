import { GameWorld } from '../types/game';

export interface ComicDialogue {
  speaker: 'hero' | 'boss' | 'ally' | 'narrator';
  speakerName: string;
  avatar: string;
  text: string;
  tailPosition: 'left' | 'right' | 'center';
  emotion?: 'shocked' | 'determined' | 'angry' | 'smug' | 'worried';
}

export interface ComicPanel {
  panelNumber: number;
  title: string;
  narrationBox: string;
  sceneEmoji: string;
  sceneDescription: string;
  bgGradient: string;
  accentColor: string;
  soundEffect: string;
  sfxColor: string;
  dialogues: ComicDialogue[];
}

export interface ComicStory {
  title: string;
  subtitle: string;
  theme: string;
  panels: ComicPanel[];
}

// Normalize theme string
export function resolveTheme(world: GameWorld): string {
  const combined = `${world.title || ''} ${world.description || ''} ${world.map?.theme || ''}`.toLowerCase();

  if (/railway|train|subway|metro|transit|platform|locomotive|track/i.test(combined)) return 'railway';
  if (/police|precinct|constable|cop|jail|prison|interrogation/i.test(combined)) return 'police';
  if (/hospital|clinic|medical|doctor|nurse|surgery|patient|infirmary/i.test(combined)) return 'hospital';
  if (/kitchen|restaurant|chef|cook|dining|bakery|cafe|pantry/i.test(combined)) return 'kitchen';
  if (/airport|airplane|plane|flight|hangar|runway|tarmac|terminal/i.test(combined)) return 'airport';
  if (/snow|ice|frost|glacier|arctic|winter|blizzard|penguin|yeti/i.test(combined)) return 'snow';
  if (/volcano|lava|magma|molten|inferno|caldera/i.test(combined)) return 'volcano';
  if (/desert|pyramid|tomb|dune|pharaoh|sand|egypt/i.test(combined)) return 'desert';
  if (/ocean|underwater|sea|abyss|aquatic|trench|submersible/i.test(combined)) return 'ocean';
  if (/space|alien|cosmic|galaxy|starship|void|orbit/i.test(combined)) return 'space';
  if (/haunt|ghost|phantom|crypt|specter|spooky|creepy|mansion/i.test(combined)) return 'haunted';
  if (/bank|vault|heist|cash|bullion|gold|safe|robbery/i.test(combined)) return 'bank';
  if (/cyber|tech|server|matrix|neon|hacker|mainframe/i.test(combined)) return 'cyberpunk';
  if (/class|school|lecture|auditorium|campus|university/i.test(combined)) return 'classroom';
  if (/office|cubicle|corporate|workstation|executive/i.test(combined)) return 'office';
  if (/nature|forest|jungle|grove|garden|overgrown/i.test(combined)) return 'nature';
  if (/dungeon|catacomb|castle|gargoyle|relic/i.test(combined)) return 'dungeon';

  return 'bank';
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateComicStory(world: GameWorld): ComicStory {
  const theme = resolveTheme(world);
  const bossName = world.enemies?.[0]?.name || 'SECTOR ENFORCER';
  const worldTitle = world.title || 'THE SECTOR';

  switch (theme) {
    case 'hospital':
      return generateHospitalStory(worldTitle, bossName);
    case 'railway':
      return generateRailwayStory(worldTitle, bossName);
    case 'police':
      return generatePoliceStory(worldTitle, bossName);
    case 'bank':
      return generateBankStory(worldTitle, bossName);
    case 'snow':
      return generateSnowStory(worldTitle, bossName);
    case 'kitchen':
      return generateKitchenStory(worldTitle, bossName);
    case 'airport':
      return generateAirportStory(worldTitle, bossName);
    case 'haunted':
      return generateHauntedStory(worldTitle, bossName);
    case 'cyberpunk':
      return generateCyberpunkStory(worldTitle, bossName);
    case 'volcano':
      return generateVolcanoStory(worldTitle, bossName);
    case 'desert':
      return generateDesertStory(worldTitle, bossName);
    case 'ocean':
      return generateOceanStory(worldTitle, bossName);
    case 'space':
      return generateSpaceStory(worldTitle, bossName);
    case 'classroom':
      return generateClassroomStory(worldTitle, bossName);
    case 'office':
      return generateOfficeStory(worldTitle, bossName);
    case 'nature':
      return generateNatureStory(worldTitle, bossName);
    case 'dungeon':
      return generateDungeonStory(worldTitle, bossName);
    default:
      return generateBankStory(worldTitle, bossName);
  }
}

// 🏥 HOSPITAL STORIES
function generateHospitalStory(title: string, boss: string): ComicStory {
  const variant = pickRandom([1, 2, 3]);

  if (variant === 1) {
    return {
      title: 'THE BIO-WING AUDIT',
      subtitle: `HOW YOU GOT TRAPPED IN ${title.toUpperCase()}`,
      theme: 'hospital',
      panels: [
        {
          panelNumber: 1,
          title: 'THE DISGUISE',
          narrationBox: 'ST. JUDE MEDICAL CENTER • 02:47 AM • RESTRICTED RESEARCH WING',
          sceneEmoji: '🥼 📁 💊',
          sceneDescription: 'Disguised as a nightshift orderly to investigate illegal serum tests...',
          bgGradient: 'linear-gradient(135deg, #0c2340 0%, #001220 100%)',
          accentColor: '#00f2fe',
          soundEffect: '💥 *SHUFFLE!*',
          sfxColor: '#38bdf8',
          dialogues: [
            { speaker: 'hero', speakerName: 'AGENT ZERO', avatar: '🕵️‍♂️', text: "Just need the lab audit records and I'm out the back door...", tailPosition: 'left', emotion: 'determined' },
            { speaker: 'ally', speakerName: 'HQ COMMS', avatar: '📻', text: 'Careful Zero! That wing has state-of-the-art bio-scanners!', tailPosition: 'right' },
          ],
        },
        {
          panelNumber: 2,
          title: 'THE SLIP-UP',
          narrationBox: 'A ROLLING VITALS CART CLATTERS IN THE SILENT CORRIDOR!',
          sceneEmoji: '🛒 💥 🚨',
          sceneDescription: 'You accidentally bump into an automated gurney! Alarms screech!',
          bgGradient: 'linear-gradient(135deg, #450a0a 0%, #1a0505 100%)',
          accentColor: '#ef4444',
          soundEffect: '🚨 *WEE-WOO-WEE-WOO!*',
          sfxColor: '#ff0055',
          dialogues: [
            { speaker: 'hero', speakerName: 'AGENT ZERO', avatar: '😱', text: 'Who puts a mobile MRI cart right behind the curtain?!', tailPosition: 'left', emotion: 'shocked' },
            { speaker: 'boss', speakerName: boss, avatar: '👨‍⚕️', text: 'UNAUTHORIZED PERSONNEL IN TRAUMA WARD! LOCK DOWN SECTOR 4!', tailPosition: 'right', emotion: 'angry' },
          ],
        },
        {
          panelNumber: 3,
          title: 'THE TRAP',
          narrationBox: 'HYDRAULIC QUARANTINE DOORS SLAM SHUT WITH DEAFENING FORCE!',
          sceneEmoji: '🔒 💉 ⚡',
          sceneDescription: 'All magnetic exit seals engage! Heavy orderlies mobilize!',
          bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #090a1a 100%)',
          accentColor: '#38bdf8',
          soundEffect: '⚡ *CLAAAANG!*',
          sfxColor: '#00f2fe',
          dialogues: [
            { speaker: 'ally', speakerName: 'HQ COMMS', avatar: '📻', text: 'Doors are sealed! You must grab the emergency medkits to bypass the main quarantine!', tailPosition: 'right', emotion: 'worried' },
            { speaker: 'hero', speakerName: 'AGENT ZERO', avatar: '😎', text: "Looks like I'm taking the emergency exit the hard way!", tailPosition: 'left', emotion: 'determined' },
          ],
        },
      ],
    };
  }

  // Variant 2: The Antidote Swap
  return {
    title: 'THE MIDNIGHT VACCINE HEIST',
    subtitle: `HOW YOU GOT TRAPPED IN ${title.toUpperCase()}`,
    theme: 'hospital',
    panels: [
      {
        panelNumber: 1,
        title: 'ROOFTOP DROP',
        narrationBox: 'MEMORIAL CLINIC SKYLIGHT • 01:15 AM • RAIN POURING DOWN',
        sceneEmoji: '🌧️ 🪂 🏥',
        sceneDescription: 'Rappelling down through the skylight directly into the intensive ward...',
        bgGradient: 'linear-gradient(135deg, #07263b 0%, #03131e 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💨 *WHOOSH!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'INFILTRATOR', avatar: '🥷', text: 'Rope secured. Vaulted inside without making a single squeak.', tailPosition: 'left', emotion: 'smug' },
          { speaker: 'narrator', speakerName: 'DISPATCH', avatar: '📟', text: 'Watch the infrared tripwires across the triage hallway!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'CAUGHT ON SENSOR',
        narrationBox: 'THE BIO-DEFENSE SYSTEM DETECTS AN UNREGISTERED HEARTBEAT!',
        sceneEmoji: '📊 🔴 🩺',
        sceneDescription: 'A laser scanner sweep catches your silhouette!',
        bgGradient: 'linear-gradient(135deg, #581c87 0%, #1e053a 100%)',
        accentColor: '#ec4899',
        soundEffect: '⚡ *BZZZZRKT!*',
        sfxColor: '#f43f5e',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👨‍⚕️', text: 'Code Crimson! Sanitation patrols, deploy tranquilizer droids!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'INFILTRATOR', avatar: '😬', text: 'My heart was beating too fast! Time for a tactical dash!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'NO WAY OUT BUT FORWARD',
        narrationBox: 'THE ONLY PASSAGE LEADS DEEP THROUGH PATIENT OBSERVATION BAYS!',
        sceneEmoji: '🏃‍♂️ 💨 🚪',
        sceneDescription: 'Gather supplies and unlock the ambulance bay doors to escape!',
        bgGradient: 'linear-gradient(135deg, #111827 0%, #030712 100%)',
        accentColor: '#10b981',
        soundEffect: '💥 *POW!*',
        sfxColor: '#10b981',
        dialogues: [
          { speaker: 'hero', speakerName: 'INFILTRATOR', avatar: '👊', text: "They won't keep me in this ward for long!", tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '💉', text: 'Catch them before they reach the decontamination airlock!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🚆 RAILWAY STORIES
function generateRailwayStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE WRONG MIDNIGHT TRAIN',
    subtitle: `HOW YOU GOT STRANDED ON ${title.toUpperCase()}`,
    theme: 'railway',
    panels: [
      {
        panelNumber: 1,
        title: 'THE PLATFORM SPRINT',
        narrationBox: 'CENTRAL TRANSIT TERMINAL • 11:58 PM • LAST CALL FOR TRACK 9',
        sceneEmoji: '🏃‍♂️ 🎫 🚆',
        sceneDescription: 'Chased by street syndicate enforcers, you dive through the closing subway doors!',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        accentColor: '#f59e0b',
        soundEffect: '💨 *SKRRRR!*',
        sfxColor: '#fbbf24',
        dialogues: [
          { speaker: 'hero', speakerName: 'TRACK RUNNER', avatar: '🏃', text: 'Whew! Barely made it inside before those thugs caught up!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'narrator', speakerName: 'P.A. SYSTEM', avatar: '📢', text: 'WARNING: This express service has been redirected to restricted depot.', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'EMERGENCY BRAKES ENGAGED',
        narrationBox: 'SPARKS FLY AS THE LOCOMOTIVE SCREECHES TO A SUDDEN HALT!',
        sceneEmoji: '⚡ 🛑 💥',
        sceneDescription: 'The train enters an abandoned rail yard and slams to a stop!',
        bgGradient: 'linear-gradient(135deg, #451a03 0%, #1c0a00 100%)',
        accentColor: '#f97316',
        soundEffect: '💥 *CRUUUNCH!*',
        sfxColor: '#ea580c',
        dialogues: [
          { speaker: 'hero', speakerName: 'TRACK RUNNER', avatar: '😵', text: 'Ouch! That was definitely not a standard scheduled station stop!', tailPosition: 'left', emotion: 'shocked' },
          { speaker: 'boss', speakerName: boss, avatar: '👮‍♂️', text: 'ALL TRANSIT ENFORCERS! Stagger the electrified rails! Find the stowaway!', tailPosition: 'right', emotion: 'angry' },
        ],
      },
      {
        panelNumber: 3,
        title: 'SURVIVAL ON THE RAILS',
        narrationBox: 'TURNSTILES LOCKED! HIGH VOLTAGE RAILS HUM WITH DEADLY CURRENT!',
        sceneEmoji: '⚡ 🚇 🔓',
        sceneDescription: 'Dodge transit droids, recover rail passes, and sprint to the maintenance shaft!',
        bgGradient: 'linear-gradient(135deg, #091e3a 0%, #020a14 100%)',
        accentColor: '#38bdf8',
        soundEffect: '⚡ *ZZZZAP!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'HACKER PIXEL', avatar: '💻', text: 'Track power is live! Grab the override tokens to open the blast gate!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'TRACK RUNNER', avatar: '⚡', text: 'Clear the tracks! Full speed ahead!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 🚨 POLICE STORIES
function generatePoliceStory(title: string, boss: string): ComicStory {
  return {
    title: 'FRAMED AT PRECINCT 9',
    subtitle: `HOW YOU WERE THROWN INTO ${title.toUpperCase()}`,
    theme: 'police',
    panels: [
      {
        panelNumber: 1,
        title: 'THE SETUP',
        narrationBox: 'PRECINCT HOLDING CELLS • 03:00 AM • THE WRONGFUL ARREST',
        sceneEmoji: '⛓️ 📄 🚨',
        sceneDescription: 'Framed by a corrupt syndicate and cuffed in the interrogation ward...',
        bgGradient: 'linear-gradient(135deg, #172554 0%, #0b1120 100%)',
        accentColor: '#3b82f6',
        soundEffect: '🔒 *CLIIIICK!*',
        sfxColor: '#60a5fa',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👮‍♂️', text: 'You are going away for a very long time, infiltrator.', tailPosition: 'right', emotion: 'smug' },
          { speaker: 'hero', speakerName: 'AGENT X', avatar: '😏', text: 'Nice handcuffs. Too bad you bought them from the discount rack.', tailPosition: 'left', emotion: 'smug' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE PAPERCLIP TRICK',
        narrationBox: 'A CONCEALED LOCKPICK WIRE SPRINGS THE CELL LOCK IN SECONDS!',
        sceneEmoji: '📎 💥 🔓',
        sceneDescription: 'The holding cell door swings open right as the shift change siren screams!',
        bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #200505 100%)',
        accentColor: '#ef4444',
        soundEffect: '🚨 *WEE-WOO-WEE-WOO!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🤬', text: 'THE PRISONER ESCAPED! LOCK DOWN ALL CORRIDORS AND EVIDENCE ROOMS!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'AGENT X', avatar: '🏃‍♂️', text: "Time to recover the stolen evidence file and clear my name!", tailPosition: 'left', emotion: 'determined' },
        ],
      },
      {
        panelNumber: 3,
        title: 'RUN THE GAUNTLET',
        narrationBox: 'PRECINCT PATROL GUARDS DEPLOY FLASHING SHOULDER BEACONS!',
        sceneEmoji: '🔦 👮 🏃',
        sceneDescription: 'Navigate the maze of booking desks and jail bars to reach the exit cruiser!',
        bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #08071e 100%)',
        accentColor: '#38bdf8',
        soundEffect: '💥 *BAM!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'INSIDE INFORMANT', avatar: '🕵️', text: 'Take the evidence dossiers from the desks! They unlock the precinct armory door!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'AGENT X', avatar: '👊', text: 'Nobody locks me up twice in one night!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 🏦 BANK STORIES
function generateBankStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE VENTILATION DROP',
    subtitle: `HOW YOU GOT INTO ${title.toUpperCase()}`,
    theme: 'bank',
    panels: [
      {
        panelNumber: 1,
        title: 'THE CEILING HATCH',
        narrationBox: 'NATIONAL RESERVE VAULT • 02:15 AM • 4 FLOORS BELOW GROUND',
        sceneEmoji: '🪂 🏦 🕳️',
        sceneDescription: 'Cutting through the rooftop air duct with a high-powered laser torch...',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #090d16 100%)',
        accentColor: '#ffd700',
        soundEffect: '⚡ *SZZZZT!*',
        sfxColor: '#facc15',
        dialogues: [
          { speaker: 'hero', speakerName: 'MASTER THIEF', avatar: '🐱‍👤', text: 'Air vent grate removed. Clean drop straight into the safety deposit wing.', tailPosition: 'left', emotion: 'smug' },
          { speaker: 'ally', speakerName: 'SAFECRACKER RADIO', avatar: '📻', text: 'Remember, the vault laser tripwires arm precisely at 02:16!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE SNAP OF THE CABLE',
        narrationBox: 'A FAULTY MOUNTING BOLT SNAPS! YOU FREE-FALL DIRECTLY ONTO THE FLOOR!',
        sceneEmoji: '💥 🧗‍♂️ 🚨',
        sceneDescription: 'You crash land right between two armed security patrol sentries!',
        bgGradient: 'linear-gradient(135deg, #5b1d06 0%, #1e0900 100%)',
        accentColor: '#f97316',
        soundEffect: '💥 *THUUUUUMP!*',
        sfxColor: '#ea580c',
        dialogues: [
          { speaker: 'hero', speakerName: 'MASTER THIEF', avatar: '😵', text: 'I really need to get my climbing gear from a better supplier...', tailPosition: 'left', emotion: 'shocked' },
          { speaker: 'boss', speakerName: boss, avatar: '👮', text: 'MOTION SENSORS TRIPPED! SEAL THE 4-SPOKE BLAST DOOR!', tailPosition: 'right', emotion: 'angry' },
        ],
      },
      {
        panelNumber: 3,
        title: 'CLEAN OUT THE VAULT',
        narrationBox: 'TITANIUM VAULT GATES DESCEND! LASER GRIDS HUM TO LIFE!',
        sceneEmoji: '💰 💎 🏃‍♂️',
        sceneDescription: 'Collect the gold bullion, dodge armed guards, and crack the main vault door!',
        bgGradient: 'linear-gradient(135deg, #14281e 0%, #05130b 100%)',
        accentColor: '#10b981',
        soundEffect: '🔓 *KERRR-CHUNK!*',
        sfxColor: '#ffd700',
        dialogues: [
          { speaker: 'hero', speakerName: 'MASTER THIEF', avatar: '💰', text: "Since I'm down here anyway... might as well take all the gold!", tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🚨', text: 'Deploy the chaser drones! Nobody walks out with those bullions!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// ❄️ SNOW / GLACIER STORIES
function generateSnowStory(title: string, boss: string): ComicStory {
  return {
    title: 'CRASH-LANDING ON THE GLACIER',
    subtitle: `HOW YOU GOT STRANDED IN ${title.toUpperCase()}`,
    theme: 'snow',
    panels: [
      {
        panelNumber: 1,
        title: 'ENGINE STALL OVER THE PEAKS',
        narrationBox: 'FROST SUMMIT AIRSPACE • MINUS 35°C • BLINDING WHITE BLIZZARD',
        sceneEmoji: '✈️ ❄️ 🔥',
        sceneDescription: 'Twin propeller engines freeze solid over the treacherous ice fields!',
        bgGradient: 'linear-gradient(135deg, #0c1c2e 0%, #03080f 100%)',
        accentColor: '#38bdf8',
        soundEffect: '💥 *KABOOOOOM!*',
        sfxColor: '#7dd3fc',
        dialogues: [
          { speaker: 'hero', speakerName: 'SURVIVOR', avatar: '🥶', text: 'Both engines are frozen! Parachuting onto the glacier ridge!', tailPosition: 'left', emotion: 'worried' },
          { speaker: 'narrator', speakerName: 'MAYDAY RADIO', avatar: '📻', text: 'Rescue helicopter cannot enter blizzard conditions! Find the distress flare!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'WAKING THE TITAN',
        narrationBox: 'THE CRASH SHATTERS THE GLACIAL CRUST! A DEEP ROAR SHAKES THE ICE!',
        sceneEmoji: '🏔️ 🐾 ❄️',
        sceneDescription: 'A colossal yeti awakens from hibernation beneath the frozen crevasse!',
        bgGradient: 'linear-gradient(135deg, #1e3a5f 0%, #0a1728 100%)',
        accentColor: '#bae6fd',
        soundEffect: '❄️ *ROOOOOAAAAR!*',
        sfxColor: '#e0f2fe',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🦍', text: 'WHO TRESPASSES UPON THE FROZEN SPIRES?!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'SURVIVOR', avatar: '😱', text: 'That is definitely NOT a friendly polar bear!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'THE RUN TO THE BEACON',
        narrationBox: 'FRIENDLY PENGUINS GUIDE YOU TOWARD THE RESCUE EVACUATION PORTAL!',
        sceneEmoji: '🐧 🏃‍♂️ 🚁',
        sceneDescription: 'Gather fuel caches, dodge frost wolves, and signal the rescue chopper!',
        bgGradient: 'linear-gradient(135deg, #07192c 0%, #010811 100%)',
        accentColor: '#38bdf8',
        soundEffect: '💨 *SWOOOOOSH!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'SURVIVOR', avatar: '🏃', text: 'Hang on, little penguins, follow me to the chopper pad!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'ally', speakerName: 'PENGUIN SCOUT', avatar: '🐧', text: '*Waddle waddle squeak!* (Translation: Watch out for the ice spikes!)', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🍳 KITCHEN STORIES
function generateKitchenStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE RECIPE INFILTRATION',
    subtitle: `HOW YOU GOT LOCKED IN ${title.toUpperCase()}`,
    theme: 'kitchen',
    panels: [
      {
        panelNumber: 1,
        title: 'THE SECRET SAUCE MISSION',
        narrationBox: 'LE CHÂTEAU RESTAURANT KITCHEN • 11:30 PM • SHIFT SHUTDOWN',
        sceneEmoji: '👨‍🍳 📜 🍳',
        sceneDescription: 'Posing as a culinary inspector to retrieve the billionaire chef secret spice mix...',
        bgGradient: 'linear-gradient(135deg, #3f1505 0%, #180601 100%)',
        accentColor: '#f97316',
        soundEffect: '🤫 *TIP-TOE!*',
        sfxColor: '#fb923c',
        dialogues: [
          { speaker: 'hero', speakerName: 'FOOD CRITIC SPY', avatar: '🕵️‍♀️', text: 'The golden recipe parchment is somewhere behind these industrial ranges...', tailPosition: 'left', emotion: 'smug' },
          { speaker: 'narrator', speakerName: 'KITCHEN COMMS', avatar: '📟', text: 'Hurry! The Head Chef never leaves the prep table unguarded!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE SIZZLING SLIP',
        narrationBox: 'A SLICK PATCH OF OLIVE OIL SENDS YOU CRASHING INTO STAINLESS PANS!',
        sceneEmoji: '🥘 💥 🥞',
        sceneDescription: 'Dozens of copper skillets tumble with a deafening metallic clatter!',
        bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #290c03 100%)',
        accentColor: '#ea580c',
        soundEffect: '💥 *CLANG-CLATTER!*',
        sfxColor: '#f97316',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👨‍🍳', text: 'SACRÉ BLEU! WHO RUINED MY BOUILLABAISSE STOCK?!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'FOOD CRITIC SPY', avatar: '😬', text: 'Uh... compliments to the chef?!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'DODGE THE FLAMES',
        narrationBox: 'LINE COOKS MOBILIZE SPATULAS! WALK-IN FREEZER SHUTTERS DOWN!',
        sceneEmoji: '🔥 🏃‍♀️ 🚪',
        sceneDescription: 'Snatch the secret recipes and sprint through the pantry loading bay!',
        bgGradient: 'linear-gradient(135deg, #2c1208 0%, #0a0301 100%)',
        accentColor: '#f59e0b',
        soundEffect: '🔥 *WHOOOSH!*',
        sfxColor: '#fbbf24',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🔪', text: 'DO NOT LET THEM ESCAPE WITH MY SECRET SEASONING!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'FOOD CRITIC SPY', avatar: '🏃‍♀️', text: "Too late Chef, I'm taking the five-star takeout route!", tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// ✈️ AIRPORT STORIES
function generateAirportStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE WRONG BRIEFCASE',
    subtitle: `HOW YOU GOT CORNERED IN ${title.toUpperCase()}`,
    theme: 'airport',
    panels: [
      {
        panelNumber: 1,
        title: 'BAGGAGE CLAIM MIX-UP',
        narrationBox: 'TERMINAL 4 CONCOURSE • 05:40 AM • CAROUSEL 3 ROTATING',
        sceneEmoji: '🧳 ✈️ 🕶️',
        sceneDescription: 'You accidentally pick up an identical silver briefcase packed with top-secret documents!',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        accentColor: '#00f2fe',
        soundEffect: '🔄 *WHIIIR!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'PASSENGER 77', avatar: '🏃', text: 'Wait... this case feels way too heavy. This isn’t my duty-free chocolate...', tailPosition: 'left', emotion: 'shocked' },
          { speaker: 'boss', speakerName: boss, avatar: '🤖', text: 'RED ALERT: SUSPECT HAS SEIZED THE DIPLOMATIC CARRIER CASE!', tailPosition: 'right', emotion: 'angry' },
        ],
      },
      {
        panelNumber: 2,
        title: 'SECURITY PERIMETER SEALED',
        narrationBox: 'TSA SCANNER TOWERS FLASH RED! JETWAY DOORS LOCK AUTOMATICALLY!',
        sceneEmoji: '🚨 🛡️ 🤖',
        sceneDescription: 'Surveillance sentries deploy laser shields across all boarding concourses!',
        bgGradient: 'linear-gradient(135deg, #450a0a 0%, #150202 100%)',
        accentColor: '#ef4444',
        soundEffect: '🚨 *BEEP-BEEP-BEEP!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🤖', text: 'ALL BOARDING PASSENGERS EVACUATE. DEPLOYING TSA INTERCEPTOR DRONES.', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'PASSENGER 77', avatar: '😱', text: 'My flight boards in five minutes! I gotta run!', tailPosition: 'left', emotion: 'worried' },
        ],
      },
      {
        panelNumber: 3,
        title: 'GATE 22 RUNWAY DASH',
        narrationBox: 'COLLECT YOUR BOARDING PASS TO UNLOCK THE SKYBRIDGE ESCAPE TUBE!',
        sceneEmoji: '✈️ 🏃 💨',
        sceneDescription: 'Dodge airport patrols and board the private transport before it takes off!',
        bgGradient: 'linear-gradient(135deg, #0c1a2e 0%, #020710 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💨 *ZOOM!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'PILOT ON RADIO', avatar: '👨‍✈️', text: 'Engines are spooled up! Reach Gate 22 before the tower revokes clearance!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'PASSENGER 77', avatar: '😎', text: 'Tell the co-pilot to leave the door unlocked, I’m on my way!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 👻 HAUNTED STORIES
function generateHauntedStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE MIDNIGHT THUNDERSTORM',
    subtitle: `HOW YOU WERE TRAPPED IN ${title.toUpperCase()}`,
    theme: 'haunted',
    panels: [
      {
        panelNumber: 1,
        title: 'SHELTER FROM THE STORM',
        narrationBox: 'FORGOTTEN CEMETERY • 00:00 MIDNIGHT • LIGHTNING TEARS THE SKY',
        sceneEmoji: '⚡ 🌧️ 🪦',
        sceneDescription: 'Soaked to the bone, you push open the ancient iron mausoleum gates...',
        bgGradient: 'linear-gradient(135deg, #2e1065 0%, #0f0525 100%)',
        accentColor: '#a855f7',
        soundEffect: '⚡ *CRRAAACK!*',
        sfxColor: '#c084fc',
        dialogues: [
          { speaker: 'hero', speakerName: 'TRAVELER', avatar: '🧥', text: 'Just need to wait out this torrential downpour till dawn...', tailPosition: 'left', emotion: 'worried' },
          { speaker: 'narrator', speakerName: 'WHISPERING WIND', avatar: '🌬️', text: 'You should never have stepped past the guardian gargoyles...', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE SLAMMING PORTCULLIS',
        narrationBox: 'A GALE FORCE GUST SLAMS THE MASSIVE SPIKED IRON GATE SHUT!',
        sceneEmoji: '🚪 💥 👻',
        sceneDescription: 'Spectral lights ignite along ancient candelabras as glowing phantoms rise!',
        bgGradient: 'linear-gradient(135deg, #4c0519 0%, #150106 100%)',
        accentColor: '#fb7185',
        soundEffect: '💥 *SLAAAM!*',
        sfxColor: '#f43f5e',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👻', text: 'ANOTHER MORTAL SOUL JOINS OUR TIMELESS HAUNT...', tailPosition: 'right', emotion: 'smug' },
          { speaker: 'hero', speakerName: 'TRAVELER', avatar: '😱', text: 'The gate is locked! And those gargoyles are actually moving!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'FIND THE SILVER KEYS',
        narrationBox: 'UNSEAL THE ANCIENT RUNESTONES TO BANISH THE SPECTERS!',
        sceneEmoji: '🗝️ 🕯️ 🏃',
        sceneDescription: 'Evade floating wraiths, snatch the tomb relics, and escape into daylight!',
        bgGradient: 'linear-gradient(135deg, #1e112a 0%, #06020c 100%)',
        accentColor: '#a855f7',
        soundEffect: '✨ *GLOOOOOW!*',
        sfxColor: '#d8b4fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'ANCIENT SPIRIT', avatar: '🔮', text: 'Gather the silver talisman seals! Only their radiant aura can break the curse!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'TRAVELER', avatar: '🏃', text: 'Not today ghosts, I’m getting out of here alive!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 💻 CYBERPUNK STORIES
function generateCyberpunkStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE NEURAL JACK-IN',
    subtitle: `HOW YOU GOT CAUGHT IN ${title.toUpperCase()}`,
    theme: 'cyberpunk',
    panels: [
      {
        panelNumber: 1,
        title: 'MEGACORP MAINFRAME INTRUSION',
        narrationBox: 'NEO-SHINJUKU SUBNET • LEVEL 99 • ICE FIREWALL ENGAGED',
        sceneEmoji: '🕶️ 💾 ⚡',
        sceneDescription: 'Neural deck plugged directly into the corporate server core...',
        bgGradient: 'linear-gradient(135deg, #051923 0%, #00080d 100%)',
        accentColor: '#00f2fe',
        soundEffect: '⚡ *BZZZZT!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'hero', speakerName: 'NETRUNNER DEX', avatar: '👾', text: "Almost bypassed their black-ICE protocols... extracting corporate ledger...", tailPosition: 'left', emotion: 'determined' },
          { speaker: 'ally', speakerName: 'DECK RIGGER', avatar: '🎧', text: 'Dex! Their intrusion detection pinged our MAC address!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'LETHAL ICE TRIGGERED',
        narrationBox: 'A SHOCKWAVE OF RED COUNTERMEASURE CODE RIPS THROUGH THE FIBER!',
        sceneEmoji: '💥 🔴 🤖',
        sceneDescription: 'Autonomous Hunter Drones decouple from server racks with glowing targeting lasers!',
        bgGradient: 'linear-gradient(135deg, #450a0a 0%, #170202 100%)',
        accentColor: '#ff0055',
        soundEffect: '🚨 *DECK-OVERHEAT!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🤖', text: 'UNAUTHORIZED INTRUSION DETECTED. PURGING CONSTRUCT IMMEDIATELY.', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'NETRUNNER DEX', avatar: '⚡', text: 'My neural link is jammed! If I don’t manual jack out, my brain is fried!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'OVERCLOCK AND PURGE',
        narrationBox: 'HACK THE TERMINALS TO OPEN THE PHYSICAL SUBNET AIRLOCK!',
        sceneEmoji: '🏃‍♂️ 💾 🚪',
        sceneDescription: 'Collect the encrypted memory nodes and reach the optical cable extraction portal!',
        bgGradient: 'linear-gradient(135deg, #180928 0%, #05010b 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💥 *POW-ZAP!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'DECK RIGGER', avatar: '🎧', text: 'I opened the emergency port! Hack the sub-terminals on your way out!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'NETRUNNER DEX', avatar: '😎', text: 'Watch me burn through their firewalls like tissue paper!', tailPosition: 'left', emotion: 'smug' },
        ],
      },
    ],
  };
}

// 🌋 VOLCANO STORIES
function generateVolcanoStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE CRUMBLING CALDERA',
    subtitle: `HOW YOU GOT STRANDED IN ${title.toUpperCase()}`,
    theme: 'volcano',
    panels: [
      {
        panelNumber: 1,
        title: 'OBSIDIAN TREASURE DIVE',
        narrationBox: 'ACTIVE MAGMA CHAMBER • 950°C • SULFURIC STEAM RISING',
        sceneEmoji: '🌋 ⛏️ 💎',
        sceneDescription: 'Scouting the glowing volcanic cavern for legendary magma crystals...',
        bgGradient: 'linear-gradient(135deg, #431407 0%, #190501 100%)',
        accentColor: '#f97316',
        soundEffect: '🔥 *CRACKLE!*',
        sfxColor: '#ea580c',
        dialogues: [
          { speaker: 'hero', speakerName: 'VOLCANOLOGIST', avatar: '🤠', text: 'These obsidian crystals are radiant! Just one more sample...', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'narrator', speakerName: 'GEOLOGIC SCANNER', avatar: '📟', text: 'WARNING: Seismic pressure spiking exponentially!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE RETREAT BRIDGE COLLAPSE',
        narrationBox: 'A MAGMA GEYSER ERUPTS! THE STONE RETREAT ARCHWAY CRUMBLES!',
        sceneEmoji: '💥 🌋 🌊',
        sceneDescription: 'Rivers of glowing lava swallow the entry path! A magma colossus rises!',
        bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #2b0606 100%)',
        accentColor: '#ef4444',
        soundEffect: '💥 *KABOOOOOM!*',
        sfxColor: '#f97316',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🔥', text: 'THE CORE BELONGS TO THE INFERNO! NONE SHALL ESCAPE!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'VOLCANOLOGIST', avatar: '😱', text: 'The bridge just fell into the lava! Time for a tactical detour!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'RACE AGAINST THE HEAT',
        narrationBox: 'CROSS BASALT PILLARS BEFORE THE CRATER OVERFLOWS!',
        sceneEmoji: '🏃‍♂️ 💨 🚪',
        sceneDescription: 'Snatch the cooling vents, leap over embers, and reach the extraction tunnel!',
        bgGradient: 'linear-gradient(135deg, #381207 0%, #0d0401 100%)',
        accentColor: '#f59e0b',
        soundEffect: '🔥 *FSSSHHH!*',
        sfxColor: '#fbbf24',
        dialogues: [
          { speaker: 'hero', speakerName: 'VOLCANOLOGIST', avatar: '🏃', text: 'My boots are smoking! Sprinting for the vent shaft!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🔥', text: 'BURN IN THE OBSIDIAN FURNACE!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🏺 DESERT / PYRAMID STORIES
function generateDesertStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE TOMB SAND-TRAP',
    subtitle: `HOW YOU WERE TRAPPED IN ${title.toUpperCase()}`,
    theme: 'desert',
    panels: [
      {
        panelNumber: 1,
        title: 'THE SECRET CHAMBER',
        narrationBox: 'VALLEY OF KINGS • 01:00 PM • ANCIENT BURIAL VAULT',
        sceneEmoji: '🏺 🔦 📜',
        sceneDescription: 'Deciphering hieroglyphs on the massive golden sarcophagus wall...',
        bgGradient: 'linear-gradient(135deg, #451a03 0%, #1a0a01 100%)',
        accentColor: '#f59e0b',
        soundEffect: '✨ *GLOW!*',
        sfxColor: '#ffd700',
        dialogues: [
          { speaker: 'hero', speakerName: 'ARCHAEOLOGIST', avatar: '🤠', text: 'If my translation is right, pressing this scarab opens the exit...', tailPosition: 'left', emotion: 'smug' },
          { speaker: 'narrator', speakerName: 'HIEROGLYPHS', avatar: '📜', text: 'HE WHO TOUCHES THE SCARAB AWAKENS THE DUNE WARDEN...', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'TONS OF SAND DROP',
        narrationBox: 'A WEIGHT-TRIGGER SLIDES! THE ENTRANCE CEILING CAVES IN!',
        sceneEmoji: '💥 ⏳ 🦂',
        sceneDescription: 'Tons of desert sand seal off the daylight behind you! Tomb scorpions skitter out!',
        bgGradient: 'linear-gradient(135deg, #78350f 0%, #2e1104 100%)',
        accentColor: '#d97706',
        soundEffect: '💥 *RUUUUMBLE!*',
        sfxColor: '#f59e0b',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👺', text: 'THOU SHALT SLEEP IN DUST FOR TEN THOUSAND YEARS!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'ARCHAEOLOGIST', avatar: '😬', text: 'Note to self: Never trust a scarab button.', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'FIND THE GOLDEN ANKH',
        narrationBox: 'SEEK THE PHARAOH RELICS TO UNSEAL THE SACRED EXIT SHAFT!',
        sceneEmoji: '✨ 🏃 🚪',
        sceneDescription: 'Navigate the stone maze, avoid scorpion stingers, and claim freedom!',
        bgGradient: 'linear-gradient(135deg, #2d1807 0%, #0c0601 100%)',
        accentColor: '#fbbf24',
        soundEffect: '🔓 *CLIIIICK!*',
        sfxColor: '#ffd700',
        dialogues: [
          { speaker: 'hero', speakerName: 'ARCHAEOLOGIST', avatar: '🏃', text: 'I am taking that winged scarab and heading for the sunlight!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '👺', text: 'THE TOMB SENTRY TURRETS AWAKEN!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🌊 OCEAN STORIES
function generateOceanStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE HULL BREACH AT 4,000 FATHOMS',
    subtitle: `HOW YOU GOT STRANDED IN ${title.toUpperCase()}`,
    theme: 'ocean',
    panels: [
      {
        panelNumber: 1,
        title: 'DEEP SEA LAB EXPEDITION',
        narrationBox: 'MARIANA RESEARCH FACILITY • DEPTH 11,000M • PITCH BLACK TRENCH',
        sceneEmoji: '🌊 🤿 💡',
        sceneDescription: 'Exploring the abyssal trench laboratory in search of deep energy crystals...',
        bgGradient: 'linear-gradient(135deg, #082f49 0%, #02111c 100%)',
        accentColor: '#38bdf8',
        soundEffect: '🫧 *GLUG-GLUG!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'hero', speakerName: 'AQUANAUT', avatar: '🤿', text: 'Atmospheric pressure holding. Oxygen tanks at 98%.', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'ally', speakerName: 'SURFACE COMMS', avatar: '📻', text: 'Watch sonar radar! Something massive is circling your quadrant!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE LEVIATHAN IMPACT',
        narrationBox: 'A TITANIC ABYSSAL CREATURE RAMS THE SUBMERSIBLE MOORING!',
        sceneEmoji: '💥 🐙 🚨',
        sceneDescription: 'Emergency bulkheads crash down as water cascades into outer chambers!',
        bgGradient: 'linear-gradient(135deg, #0369a1 0%, #041f33 100%)',
        accentColor: '#0284c7',
        soundEffect: '💥 *KRRRR-CRACK!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🦑', text: 'THE ABYSS SHALL CLAIM THY FLESH AND VESSEL...', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'AQUANAUT', avatar: '😱', text: 'The docking collar tore clean off! I need to reach the escape pod!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'ASCENT TO FREEDOM',
        narrationBox: 'COLLECT HYDROTHERMAL POWER CELLS TO LAUNCH THE ESCAPE CAPSULE!',
        sceneEmoji: '🏃 🫧 🚀',
        sceneDescription: 'Evade trench stalkers, snatch emergency oxygen, and trigger the ballast rockets!',
        bgGradient: 'linear-gradient(135deg, #07263b 0%, #010c14 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💨 *WHOOSH!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'hero', speakerName: 'AQUANAUT', avatar: '🏊', text: 'Oxygen reserves ready! Punching the throttle straight to the surface!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'ally', speakerName: 'SURFACE COMMS', avatar: '📻', text: 'We have your beacon! Hurry before the trench stalkers swarm!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🚀 SPACE STORIES
function generateSpaceStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE VOID OUTPOST CONTAINMENT BREACH',
    subtitle: `HOW YOU GOT STRANDED ON ${title.toUpperCase()}`,
    theme: 'space',
    panels: [
      {
        panelNumber: 1,
        title: 'ORBITAL MAINTENANCE RUN',
        narrationBox: 'OUTER KUIPER STATION • ZERO GRAVITY • DEEP COSMIC NIGHT',
        sceneEmoji: '🚀 👨‍🚀 ✨',
        sceneDescription: 'Repairing the orbital gravity relay outside the space station hub...',
        bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #050414 100%)',
        accentColor: '#a855f7',
        soundEffect: '✨ *BEEP-BOOP!*',
        sfxColor: '#c084fc',
        dialogues: [
          { speaker: 'hero', speakerName: 'COSMONAUT', avatar: '👨‍🚀', text: 'Relay calibrated. Heading back through the primary airlock...', tailPosition: 'left', emotion: 'smug' },
          { speaker: 'narrator', speakerName: 'AI MOTHER', avatar: '🖥️', text: 'BIO-ANOMALY DETECTED IN SECTOR ZERO. QUARANTINE PROTOCOL 7 INITIATED.', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE SHADOW IN THE AIRLOCK',
        narrationBox: 'A VOID ALIEN PARASITE CRUSHES THE HATCH CONTROLLER!',
        sceneEmoji: '💥 👽 🚨',
        sceneDescription: 'The outer airlock depressurizes as extraterrestrial shadows swarm the station!',
        bgGradient: 'linear-gradient(135deg, #3b0764 0%, #10021c 100%)',
        accentColor: '#c084fc',
        soundEffect: '💥 *SHREEEEEEK!*',
        sfxColor: '#f43f5e',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👾', text: 'YOUR TIN CAN VESSEL IS NOW OUR HIVE...', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'COSMONAUT', avatar: '😱', text: 'The main shuttle hatch is melted shut! I need to find the auxiliary thruster pod!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'WARP TO EVACUATION',
        narrationBox: 'RECOVER PLASMA CELLS AND BLAST OFF BEFORE HULL COLLAPSE!',
        sceneEmoji: '🏃 🚀 🌌',
        sceneDescription: 'Dodge xenomorph stalkers, collect energy nodes, and launch the warp shuttle!',
        bgGradient: 'linear-gradient(135deg, #140d2e 0%, #04020a 100%)',
        accentColor: '#a855f7',
        soundEffect: '⚡ *HYPERSPACE!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'COSMONAUT', avatar: '🔥', text: 'Thrusters primed! Time to blow this orbital popsicle stand!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '👾', text: 'SEAL ALL BULKHEADS! DO NOT LET THE HUMAN REACH THE ENGINES!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🎓 CLASSROOM / AUDITORIUM STORIES
function generateClassroomStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE MIDNIGHT EXAM LOCKDOWN',
    subtitle: `HOW YOU GOT LOCKED IN ${title.toUpperCase()}`,
    theme: 'classroom',
    panels: [
      {
        panelNumber: 1,
        title: 'FELL ASLEEP STUDYING',
        narrationBox: 'MAIN UNIVERSITY AUDITORIUM • 11:45 PM • FINALS WEEK',
        sceneEmoji: '📚 😴 🎓',
        sceneDescription: 'Cramming for the quantum physics exam until your eyelids gave out...',
        bgGradient: 'linear-gradient(135deg, #451a03 0%, #190901 100%)',
        accentColor: '#f59e0b',
        soundEffect: '💤 *SNOOOORE!*',
        sfxColor: '#fbbf24',
        dialogues: [
          { speaker: 'hero', speakerName: 'TIRED STUDENT', avatar: '🥱', text: 'Just resting my eyes for five minutes... zzz...', tailPosition: 'left', emotion: 'worried' },
          { speaker: 'narrator', speakerName: 'CAMPUS CLOCK', avatar: '🕰️', text: '*BONG! BONG!* The midnight curfew chimes across the deserted quad.', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'LOCKED IN THE HALL',
        narrationBox: 'YOU WAKE UP IN PITCH BLACKNESS TO THE SOUND OF HEAVY CHAINPADLOCKS!',
        sceneEmoji: '🔒 🚨 🔦',
        sceneDescription: 'Campus security has locked all gates! Surveillance drones sweep the desk rows!',
        bgGradient: 'linear-gradient(135deg, #78350f 0%, #220d03 100%)',
        accentColor: '#ea580c',
        soundEffect: '🔒 *KA-CHUNNNK!*',
        sfxColor: '#f97316',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👮', text: 'ALL DOORS BOLTED FOR CURFEW! NO TRESPASSERS ON CAMPUS PROPERTY!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'TIRED STUDENT', avatar: '😱', text: 'My test is tomorrow at 8 AM! I can’t spend the night in the maze of desks!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'DODGE THE PROCTORS',
        narrationBox: 'COLLECT YOUR SCATTERED STUDY NOTES AND SNEAK OUT THE FIRE DOOR!',
        sceneEmoji: '🏃 📝 🚪',
        sceneDescription: 'Bypass campus guards, find the professor hall pass, and hit the exit!',
        bgGradient: 'linear-gradient(135deg, #2b1206 0%, #0b0401 100%)',
        accentColor: '#f59e0b',
        soundEffect: '💨 *TIP-TOE!*',
        sfxColor: '#ffd700',
        dialogues: [
          { speaker: 'hero', speakerName: 'TIRED STUDENT', avatar: '🏃', text: 'If I ace this stealth escape, I definitely deserve an A+!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '👮', text: 'CHECK UNDER EVERY LECTURE SEAT!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🏢 OFFICE STORIES
function generateOfficeStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE OVERTIME WHISTLEBLOWER',
    subtitle: `HOW YOU WERE BARRICADED IN ${title.toUpperCase()}`,
    theme: 'office',
    panels: [
      {
        panelNumber: 1,
        title: 'PRINTING THE EVIDENCE',
        narrationBox: 'CUBICLE 42-B • 01:20 AM • EXECUTIVE 50TH FLOOR',
        sceneEmoji: '🖨️ 📄 💼',
        sceneDescription: 'Printing the whistleblower corporate embezzlement records after everyone went home...',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #080c14 100%)',
        accentColor: '#38bdf8',
        soundEffect: '🖨️ *WHIRR-PRINT!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'hero', speakerName: 'OFFICE HERO', avatar: '💼', text: 'The corrupt merger files are printed. Time to slip out the stairwell.', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'ally', speakerName: 'PHONE LEAK', avatar: '📱', text: 'CEO discovered the leak! Rogue security bots just seized the elevators!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE EXECUTIVE LOCKOUT',
        narrationBox: 'ALL ELEVATOR SHAFTS POWER DOWN! OPTICAL TURRETS ACTIVATE!',
        sceneEmoji: '🚨 🤖 🏢',
        sceneDescription: 'Building security chief deploys automated patrol units through the cubicle maze!',
        bgGradient: 'linear-gradient(135deg, #450a0a 0%, #140202 100%)',
        accentColor: '#ef4444',
        soundEffect: '🚨 *WEE-WOO-WEE-WOO!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👔', text: 'CONFISCATE ALL USB DRIVES AND DOSSIERS! NO EMPLOYEE LEAVES THIS TOWER!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'OFFICE HERO', avatar: '😬', text: 'And HR told me working late showed great initiative...', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'ROOFTOP HELIPAD EVAC',
        narrationBox: 'GRAB THE EXECUTIVE PASSKEYS TO UNLOCK THE SKYWALK DOOR!',
        sceneEmoji: '🏃 💼 🚁',
        sceneDescription: 'Dash through water coolers and partition dividers to reach freedom!',
        bgGradient: 'linear-gradient(135deg, #0e1e38 0%, #030812 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💥 *CRASH!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'OFFICE HERO', avatar: '🏃', text: 'I am taking the files directly to the press!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🤖', text: 'PATROLS, INTERCEPT AT THE ROOFTOP PORTAL!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🌿 NATURE / GROVE STORIES
function generateNatureStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE FORBIDDEN ENCHANTED GROVE',
    subtitle: `HOW YOU TRESPASSED INTO ${title.toUpperCase()}`,
    theme: 'nature',
    panels: [
      {
        panelNumber: 1,
        title: 'FOLLOWING THE OVERGROWN TRAIL',
        narrationBox: 'ANCIENT PRIMAL WOODS • DUSK • THICK GLOWING MOSS',
        sceneEmoji: '🌲 🧭 🍄',
        sceneDescription: 'Chasing an uncharted botanical trail deep into the misty heart of the canopy...',
        bgGradient: 'linear-gradient(135deg, #14532d 0%, #052010 100%)',
        accentColor: '#4ade80',
        soundEffect: '🍃 *RUSTLE!*',
        sfxColor: '#86efac',
        dialogues: [
          { speaker: 'hero', speakerName: 'EXPLORER', avatar: '🧗', text: 'The ancient map ends here... this grove hasn’t seen human footprints in centuries.', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'narrator', speakerName: 'WHISPERING SPORES', avatar: '🌿', text: 'The roots stir beneath your feet as slumbering beasts awaken...', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE GUARDIAN ROARS',
        narrationBox: 'A MASSIVE ANCIENT GROVE BEAST EMERGES FROM THE OVERGROWN ROOTS!',
        sceneEmoji: '💥 🐺 🐾',
        sceneDescription: 'Thorny briars instantly entangle the entry path behind you!',
        bgGradient: 'linear-gradient(135deg, #1e3a1e 0%, #061206 100%)',
        accentColor: '#22c55e',
        soundEffect: '🌲 *ROOOOAR!*',
        sfxColor: '#4ade80',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🐻', text: 'THE SANCTUARY OF THE WOODS SHALL NOT BE DESECRATED!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'EXPLORER', avatar: '😱', text: 'Those vines just walled off the trail! I have to find another way through!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'SEEK THE SUNSTONE ALTAR',
        narrationBox: 'COLLECT THE BOTANICAL SEEDS TO DISPEL THE THORNY WALLS!',
        sceneEmoji: '🏃 🌸 ☀️',
        sceneDescription: 'Dart around shadow vipers, claim enchanted flora, and reach the sunlit clearing!',
        bgGradient: 'linear-gradient(135deg, #0f2d18 0%, #031006 100%)',
        accentColor: '#86efac',
        soundEffect: '✨ *SHINE!*',
        sfxColor: '#4ade80',
        dialogues: [
          { speaker: 'hero', speakerName: 'EXPLORER', avatar: '🏃', text: 'Just need the Sunstone seed to pacify the path!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🐺', text: 'SPORE STALKERS, SURROUND THE TRESPASSER!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🏰 DUNGEON STORIES
function generateDungeonStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE TRAPDOOR CRUMBLE',
    subtitle: `HOW YOU PLUMMETED INTO ${title.toUpperCase()}`,
    theme: 'dungeon',
    panels: [
      {
        panelNumber: 1,
        title: 'THE CASTLE RUINS',
        narrationBox: 'ABANDONED CITADEL • TWILIGHT • CRACKED MOSAIC FLOOR',
        sceneEmoji: '🏰 ⚔️ 🕯️',
        sceneDescription: 'Investigating rumors of a forgotten royal armory buried below...',
        bgGradient: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
        accentColor: '#f59e0b',
        soundEffect: '👣 *STEP... STEP!*',
        sfxColor: '#fbbf24',
        dialogues: [
          { speaker: 'hero', speakerName: 'DUNGEON CRAWLER', avatar: '🗡️', text: 'The legends said the king hid the crown jewels down here...', tailPosition: 'left', emotion: 'smug' },
          { speaker: 'narrator', speakerName: 'HOLLOW ECHO', avatar: '🕳️', text: 'The floor flagstones creak under your boots...', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE FIFTY FOOT DROP',
        narrationBox: 'THE ROTTED FLOOR COLLAPSES! YOU PLUNGE INTO DARK SUBTERRANEAN CATACOMBS!',
        sceneEmoji: '💥 🕳️ 💀',
        sceneDescription: 'You land amidst piles of ancient rubble while skeletal sentries stir to life!',
        bgGradient: 'linear-gradient(135deg, #475569 0%, #111827 100%)',
        accentColor: '#ef4444',
        soundEffect: '💥 *CRASH-BAM!*',
        sfxColor: '#f87171',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🗿', text: 'WHO DISTURBS THE STONE GARGOYLE TOMB?!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'DUNGEON CRAWLER', avatar: '😵', text: 'Ugh... that was a long way down! And the ceiling hole is completely out of reach!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'ESCAPE THE CATACOMBS',
        narrationBox: 'GATHER THE EMBLEM KEYS TO UNLOCK THE IRON PORTCULLIS!',
        sceneEmoji: '🗝️ 🏃 🚪',
        sceneDescription: 'Navigate the stone maze, dodge bone stalkers, and break through to the surface!',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #080d16 100%)',
        accentColor: '#f59e0b',
        soundEffect: '⚔️ *CLANG!*',
        sfxColor: '#ffd700',
        dialogues: [
          { speaker: 'hero', speakerName: 'DUNGEON CRAWLER', avatar: '⚔️', text: 'No skeleton army is keeping me down here!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🗿', text: 'GARGOYLES, CRUSH THE INTRUDER!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

