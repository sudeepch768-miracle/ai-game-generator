import { GameWorld } from '../types/game';

export interface ComicDialogue {
  speaker: 'hero' | 'boss' | 'ally' | 'narrator';
  speakerName: string;
  avatar: string;
  text: string;
  tailPosition: 'left' | 'right' | 'center';
  emotion?: 'shocked' | 'determined' | 'angry' | 'smug' | 'worried';
  soundChirp?: string;
}

export interface ComicPanel {
  panelNumber: number;
  title: string;
  narrationBox: string;
  thoughtMonologue?: string;    // Spider-Verse yellow notebook thought square
  freezeFrameBadge?: string;   // e.g. "CODENAME: AGENT ZERO • EARTH-808"
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
  universeTag: string;
  heroCodename: string;
  panels: ComicPanel[];
}

const KNOWN_THEMES = new Set([
  'hospital', 'railway', 'police', 'bank', 'snow', 'kitchen', 'airport',
  'cyberpunk', 'haunted', 'volcano', 'desert', 'ocean', 'space',
  'classroom', 'office', 'nature', 'dungeon'
]);

// Normalize theme string
export function resolveTheme(world: GameWorld): string {
  // 1. Authoritative: world.map.theme if already set to a valid known theme
  const rawMapTheme = (world.map?.theme || '').toLowerCase().trim();
  if (KNOWN_THEMES.has(rawMapTheme)) {
    return rawMapTheme;
  }

  // Check if map theme maps to one of known themes (e.g. haspital -> hospital)
  if (/h[oa]spital|clinic|medical|doctor|nurse|surgery|patient|infirmary|ambulance|stretcher|ward|trauma|triage|icu|emergency/i.test(rawMapTheme)) return 'hospital';
  if (/police|precinct|constable|cop|jail|prison|interrogation|sheriff/i.test(rawMapTheme)) return 'police';
  if (/\brailway\b|\btrain\b|\bsubway\b|\bmetro\b|\btransit\b|\blocomotive\b|\bplatform\b|\bdepot\b/i.test(rawMapTheme) ||
    (/\bstation\b/i.test(rawMapTheme) && !/police|nurse|aid|space|fire/i.test(rawMapTheme))) return 'railway';
  if (/kitchen|restaurant|chef|cook|dining|bakery|cafe|pantry/i.test(rawMapTheme)) return 'kitchen';
  if (/airport|airplane|plane|flight|hangar|runway|tarmac|terminal/i.test(rawMapTheme)) return 'airport';
  if (/snow|ice|frost|glacier|arctic|winter|blizzard|penguin|yeti/i.test(rawMapTheme)) return 'snow';
  if (/volcano|lava|magma|molten|inferno|caldera/i.test(rawMapTheme)) return 'volcano';
  if (/desert|pyramid|tomb|dune|pharaoh|sand|egypt/i.test(rawMapTheme)) return 'desert';
  if (/ocean|underwater|sea|abyss|aquatic|trench|submersible/i.test(rawMapTheme)) return 'ocean';
  if (/space|alien|cosmic|galaxy|starship|void|orbit/i.test(rawMapTheme)) return 'space';
  if (/haunt|ghost|phantom|crypt|specter|spooky|creepy|mansion|horror/i.test(rawMapTheme)) return 'haunted';
  if (/bank|vault|heist|cash|bullion|gold|safe|robbery|teller/i.test(rawMapTheme)) return 'bank';
  if (/cyber|tech|server|matrix|neon|hacker|mainframe/i.test(rawMapTheme)) return 'cyberpunk';
  if (/class|school|lecture|auditorium|campus|university/i.test(rawMapTheme)) return 'classroom';
  if (/office|cubicle|corporate|workstation|executive/i.test(rawMapTheme)) return 'office';
  if (/nature|forest|jungle|grove|garden|overgrown/i.test(rawMapTheme)) return 'nature';
  if (/dungeon|catacomb|castle|gargoyle|relic/i.test(rawMapTheme)) return 'dungeon';

  // 2. Check palette floorTexture
  const floorTexture = (world.palette?.floorTexture || '').toLowerCase().trim();
  if (KNOWN_THEMES.has(floorTexture)) {
    return floorTexture;
  }

  // 3. Fallback: inspect title, description, and enemy name
  const combined = `${world.title || ''} ${world.description || ''} ${world.enemies?.[0]?.name || ''}`.toLowerCase();

  // Hospital takes strict precedence over railway to eliminate nurse station / tracking overlap
  if (/h[oa]spital|clinic|medical|doctor|nurse|surgery|patient|infirmary|ambulance|stretcher|ward|health|trauma|triage|icu|emergency/i.test(combined)) return 'hospital';
  if (/police|precinct|constable|cop|jail|prison|interrogation|sheriff/i.test(combined)) return 'police';
  if (/\brailway\b|\btrain\b|\bsubway\b|\bmetro\b|\btransit\b|\blocomotive\b|\bplatform\b|\bdepot\b/i.test(combined) ||
    (/\bstation\b/i.test(combined) && !/police|nurse|aid|space|fire/i.test(combined))) return 'railway';
  if (/kitchen|restaurant|chef|cook|dining|bakery|cafe|pantry/i.test(combined)) return 'kitchen';
  if (/airport|airplane|plane|flight|hangar|runway|tarmac|terminal/i.test(combined)) return 'airport';
  if (/snow|ice|frost|glacier|arctic|winter|blizzard|penguin|yeti/i.test(combined)) return 'snow';
  if (/volcano|lava|magma|molten|inferno|caldera/i.test(combined)) return 'volcano';
  if (/desert|pyramid|tomb|dune|pharaoh|sand|egypt/i.test(combined)) return 'desert';
  if (/ocean|underwater|sea|abyss|aquatic|trench|submersible/i.test(combined)) return 'ocean';
  if (/space|alien|cosmic|galaxy|starship|void|orbit/i.test(combined)) return 'space';
  if (/haunt|ghost|phantom|crypt|specter|spooky|creepy|mansion|horror/i.test(combined)) return 'haunted';
  if (/bank|vault|heist|cash|bullion|gold|safe|robbery|teller/i.test(combined)) return 'bank';
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

// 🏥 HOSPITAL SPIDER-VERSE STORY
function generateHospitalStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE BIO-WING AUDIT',
    subtitle: `HOW YOU GOT TRAPPED IN ${title.toUpperCase()}`,
    theme: 'hospital',
    universeTag: 'EARTH-MED-404',
    heroCodename: 'AGENT ZERO',
    panels: [
      {
        panelNumber: 1,
        title: 'THE ROUTINE AUDIT',
        narrationBox: 'ST. JUDE MEDICAL CENTER • 02:47 AM • RESTRICTED TRIAGE LAB',
        thoughtMonologue: "Alright, let's do this one last time. My name is Agent Zero. For the last two hours, I thought this was just an undercover paperwork audit. Boy, was I wrong.",
        freezeFrameBadge: 'AGENT ZERO • UNDERCOVER OPERATIVE',
        sceneEmoji: '🥼 📁 💊',
        sceneDescription: 'Slipping past the bio-containment checkpoint disguised in doctor scrubs...',
        bgGradient: 'linear-gradient(135deg, #031b2e 0%, #010a12 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💨 *THWIIIIP!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'hero', speakerName: 'AGENT ZERO', avatar: '🕵️‍♂️', text: "Just grab the serum ledger and walk out. Clean, simple, no drama.", tailPosition: 'left', emotion: 'smug' },
          { speaker: 'ally', speakerName: 'HQ COMMS', avatar: '📻', text: 'Zero, their motion grid is cycling every 4 seconds! Step softly!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE CRASH & ALARM',
        narrationBox: 'A ROLLING VITALS CART TURNS INTO A MULTI-VEHICLE COLLISION!',
        thoughtMonologue: "You know that feeling when you're 99% sure you're a stealth genius, and then gravity reminds you who's boss?",
        freezeFrameBadge: 'THREAT DETECTED • RED ALERT',
        sceneEmoji: '🛒 💥 🚨',
        sceneDescription: 'An automated robotic gurney catches your heel! Copper IV poles topple everywhere!',
        bgGradient: 'linear-gradient(135deg, #450a0a 0%, #170202 100%)',
        accentColor: '#ff0055',
        soundEffect: '🚨 *WEE-WOO-WEE-WOO!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'hero', speakerName: 'AGENT ZERO', avatar: '😱', text: 'Who leaves a titanium defibrillator in the middle of a dark hallway?!', tailPosition: 'left', emotion: 'shocked' },
          { speaker: 'boss', speakerName: boss, avatar: '👨‍⚕️', text: 'SECURITY DRONES! BIO-QUARANTINE LOCKDOWN ON CORRIDOR B!', tailPosition: 'right', emotion: 'angry' },
        ],
      },
      {
        panelNumber: 3,
        title: 'LEAP OF FAITH',
        narrationBox: 'HYDRAULIC BLAST SHUTTERS SEAL! THE ONLY WAY OUT IS FORWARD!',
        thoughtMonologue: "No extraction team. Comms are frying. Just me, my tactical dash, and whatever medkits I can snatch off the walls. Time for a leap of faith.",
        freezeFrameBadge: 'MISSION OBJECTIVE: BREAK QUARANTINE',
        sceneEmoji: '🔒 💉 ⚡',
        sceneDescription: 'Hydraulic doors slam shut! Robotic sanitizers arm their stun emitters!',
        bgGradient: 'linear-gradient(135deg, #180928 0%, #05010b 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💥 *KRAAA-KTOOM!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'HQ COMMS', avatar: '📻', text: 'Zero! Hack the sub-terminals and make for the ambulance bay NOW!', tailPosition: 'right', emotion: 'worried' },
          { speaker: 'hero', speakerName: 'AGENT ZERO', avatar: '😎', text: 'Tell the pilot to keep the engine warm. I’m taking the express route!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 🚆 RAILWAY SPIDER-VERSE STORY
function generateRailwayStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE WRONG MIDNIGHT TRAIN',
    subtitle: `HOW YOU GOT STRANDED ON ${title.toUpperCase()}`,
    theme: 'railway',
    universeTag: 'EARTH-SUBWAY-9',
    heroCodename: 'TRACK RUNNER',
    panels: [
      {
        panelNumber: 1,
        title: 'LAST CALL ON PLATFORM 9',
        narrationBox: 'CENTRAL TRANSIT TERMINAL • 11:59 PM • SUBTERRANEAN RUN',
        thoughtMonologue: "My name is Track Runner. I've dodged cyber-gangs, jumped turnstiles, and survived stale station coffee. Tonight was supposed to be my day off.",
        freezeFrameBadge: 'TRACK RUNNER • METRO REBEL',
        sceneEmoji: '🏃‍♂️ 🎫 🚆',
        sceneDescription: 'Sprinting down the escalators as syndicate goons snap at your heels...',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #090d16 100%)',
        accentColor: '#f59e0b',
        soundEffect: '💨 *SKRRRRR!*',
        sfxColor: '#fbbf24',
        dialogues: [
          { speaker: 'hero', speakerName: 'TRACK RUNNER', avatar: '🏃', text: 'Closing doors! Slide in sideways like a comic hero!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'narrator', speakerName: 'P.A. SYSTEM', avatar: '📢', text: 'ATTENTION: You have boarded the restricted Phantom Freight.', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'EMERGENCY BRAKE SNAP',
        narrationBox: 'HIGH VOLTAGE SPARKS SHOWER AS THE DERAILER LOCKS THE TRACKS!',
        thoughtMonologue: "And that's when the train conductor turned out to be an 8-foot automated law enforcer who definitely did not accept monthly metro cards.",
        freezeFrameBadge: 'SECURITY GRID ACTIVATED',
        sceneEmoji: '⚡ 🛑 💥',
        sceneDescription: 'The train enters an abandoned junction and screeches to a violent halt!',
        bgGradient: 'linear-gradient(135deg, #451a03 0%, #170700 100%)',
        accentColor: '#f97316',
        soundEffect: '💥 *CRUUUUUNCH!*',
        sfxColor: '#ea580c',
        dialogues: [
          { speaker: 'hero', speakerName: 'TRACK RUNNER', avatar: '😵', text: 'That was definitely not a soft platform deceleration!', tailPosition: 'left', emotion: 'shocked' },
          { speaker: 'boss', speakerName: boss, avatar: '👮‍♂️', text: 'ALL SECTOR PATROLS! Electrify the third rail! Find the fugitive!', tailPosition: 'right', emotion: 'angry' },
        ],
      },
      {
        panelNumber: 3,
        title: 'LEAP ACROSS THE RAILS',
        narrationBox: 'ELECTRIFIED TRACKS HUM WITH 10,000 VOLTS OF LETHAL CURRENT!',
        thoughtMonologue: "One live wire. Six patrol drones. Zero subway tokens left. Perfect odds.",
        freezeFrameBadge: 'OBJECTIVE: POWER UP THE BLAST GATES',
        sceneEmoji: '⚡ 🚇 🔓',
        sceneDescription: 'Vaulting across steel ties to grab the emergency rail passes!',
        bgGradient: 'linear-gradient(135deg, #091e3a 0%, #020710 100%)',
        accentColor: '#00f2fe',
        soundEffect: '⚡ *ZZZZAP-BOOM!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'HACKER PIXEL', avatar: '💻', text: 'I patched the switchboard! Collect the rail passes and book it!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'TRACK RUNNER', avatar: '⚡', text: 'Watch your step, boss! I’m taking the express line home!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 🚨 POLICE SPIDER-VERSE STORY
function generatePoliceStory(title: string, boss: string): ComicStory {
  return {
    title: 'FRAMED AT PRECINCT 9',
    subtitle: `HOW YOU WERE THROWN INTO ${title.toUpperCase()}`,
    theme: 'police',
    universeTag: 'EARTH-NOIR-77',
    heroCodename: 'AGENT X',
    panels: [
      {
        panelNumber: 1,
        title: 'THE WRONGFUL ARREST',
        narrationBox: 'PRECINCT HOLDING CELLS • 03:00 AM • INTERROGATION WARD',
        thoughtMonologue: "My name is Agent X. They framed me for a heist I didn't pull. Or at least, didn't pull on this Earth.",
        freezeFrameBadge: 'AGENT X • FRAMED SUSPECT',
        sceneEmoji: '⛓️ 📄 🚨',
        sceneDescription: 'Handcuffed to the bench while the commissioner flaunts a fake dossier...',
        bgGradient: 'linear-gradient(135deg, #172554 0%, #060b17 100%)',
        accentColor: '#3b82f6',
        soundEffect: '🔒 *CLIIIICK!*',
        sfxColor: '#60a5fa',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👮‍♂️', text: 'You’ll be looking at concrete walls for the next thirty years, hotshot.', tailPosition: 'right', emotion: 'smug' },
          { speaker: 'hero', speakerName: 'AGENT X', avatar: '😏', text: 'Fun fact: I picked your locks before you even finished reading my rights.', tailPosition: 'left', emotion: 'smug' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE CELL DOOR KICK',
        narrationBox: 'A SPRING WIRE POPS THE CYLINDER PIN! CELL BARS SLAM OPEN!',
        thoughtMonologue: "Rule number one of breaking out of a supermax police precinct: make sure you pick the moment when everyone's coffee is hot.",
        freezeFrameBadge: 'WANTED: ESCAPEE ON THE LOOSE',
        sceneEmoji: '📎 💥 🔓',
        sceneDescription: 'The iron barred gate swings open right as red emergency strobe lights fire!',
        bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #1a0303 100%)',
        accentColor: '#ef4444',
        soundEffect: '🚨 *WEE-WOO-WEE-WOO!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🤬', text: 'CODE RED! THE PRISONER IS OUT! SEAL EVERY CELL BLOCK!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'AGENT X', avatar: '🏃‍♂️', text: 'Thanks for the hospitality! Left you a five-star review on Yelp!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
      {
        panelNumber: 3,
        title: 'THE EVIDENCE RUN',
        narrationBox: 'SEIZE THE STOLEN DOSSIERS TO EXPOSE THE CORRUPT SYNDICATE!',
        thoughtMonologue: "I could slip out quietly... or I could grab all their evidence dossiers and expose the whole conspiracy on my way out. You know which one I'm picking.",
        freezeFrameBadge: 'LEAP OF FAITH • GET THE EVIDENCE',
        sceneEmoji: '🔦 👮 🏃',
        sceneDescription: 'Dodging shoulder strobes and booking desks to reach the precinct cruiser!',
        bgGradient: 'linear-gradient(135deg, #180928 0%, #05010b 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💥 *KRAAAK!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'INSIDE INFORMANT', avatar: '🕵️', text: 'Evidence lockers are glowing! Grab the files to unlock the garage gate!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'AGENT X', avatar: '👊', text: 'Time to turn this precinct upside down!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 🏦 BANK SPIDER-VERSE STORY
function generateBankStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE VENTILATION DROP',
    subtitle: `HOW YOU GOT INTO ${title.toUpperCase()}`,
    theme: 'bank',
    universeTag: 'EARTH-HEIST-11',
    heroCodename: 'MASTER THIEF',
    panels: [
      {
        panelNumber: 1,
        title: 'THE ROOFTOP SHAFT',
        narrationBox: 'FEDERAL GOLD RESERVE • 02:15 AM • 4 STORIES UNDERGROUND',
        thoughtMonologue: "My name is Master Thief. Some people save kittens. I liberate billionaire vaults that forgot to pay their security consultants. Tonight, it's personal.",
        freezeFrameBadge: 'MASTER THIEF • CLASS-A SAFECRACKER',
        sceneEmoji: '🪂 🏦 🕳️',
        sceneDescription: 'Laser-cutting the rooftop ventilation grate with millimeter precision...',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #080c14 100%)',
        accentColor: '#ffd700',
        soundEffect: '⚡ *SZZZZT!*',
        sfxColor: '#facc15',
        dialogues: [
          { speaker: 'hero', speakerName: 'MASTER THIEF', avatar: '🐱‍👤', text: 'Grate cut. Dropping in like a feather. Silent as a shadow.', tailPosition: 'left', emotion: 'smug' },
          { speaker: 'ally', speakerName: 'SAFECRACKER RADIO', avatar: '📻', text: 'You have 60 seconds before the laser tripwires power back up!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE CABLE SNAPS',
        narrationBox: 'A MOUNTING CARABINER SHEARS CLEAN OFF! FREE-FALL INBOUND!',
        thoughtMonologue: "Remember when I said 'silent as a shadow'? Cancel that. I just fell through a false ceiling directly onto a titanium desk.",
        freezeFrameBadge: 'SURPRISE ENCOUNTER • GUARDS ALERTED',
        sceneEmoji: '💥 🧗‍♂️ 🚨',
        sceneDescription: 'Crash landing right into the middle of the heavy armed security patrol!',
        bgGradient: 'linear-gradient(135deg, #5b1d06 0%, #170500 100%)',
        accentColor: '#f97316',
        soundEffect: '💥 *THUUUUUMP-CRASH!*',
        sfxColor: '#ea580c',
        dialogues: [
          { speaker: 'hero', speakerName: 'MASTER THIEF', avatar: '😵', text: 'Tada! ...Anyone order a pizza?!', tailPosition: 'left', emotion: 'shocked' },
          { speaker: 'boss', speakerName: boss, avatar: '👮', text: 'INTRUDER IN THE VAULT WING! SEAL THE 4-SPOKE BLAST DOORS!', tailPosition: 'right', emotion: 'angry' },
        ],
      },
      {
        panelNumber: 3,
        title: 'CLEAN OUT THE VAULT',
        narrationBox: 'HEAVY TITANIUM GRIDS SLAM! LASER BEAMS HUM TO MAXIMUM WATTAGE!',
        thoughtMonologue: "They locked me in with fifty million dollars in gold bullion and an emergency exit across the room. Who's really trapped here?",
        freezeFrameBadge: 'LEAP OF FAITH • CRACK THE VAULT',
        sceneEmoji: '💰 💎 🏃‍♂️',
        sceneDescription: 'Sprinting through laser nets, gathering gold ingots, and cracking the main door!',
        bgGradient: 'linear-gradient(135deg, #0e2a1b 0%, #020e07 100%)',
        accentColor: '#10b981',
        soundEffect: '🔓 *KERRR-CHUNK!*',
        sfxColor: '#ffd700',
        dialogues: [
          { speaker: 'hero', speakerName: 'MASTER THIEF', avatar: '💰', text: 'Tactical dash primed. Time to cash out in style!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🚨', text: 'Deploy the chaser droids! Nobody takes that gold bullion!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// ❄️ SNOW / GLACIER SPIDER-VERSE STORY
function generateSnowStory(title: string, boss: string): ComicStory {
  return {
    title: 'CRASH-LANDING ON THE GLACIER',
    subtitle: `HOW YOU GOT STRANDED IN ${title.toUpperCase()}`,
    theme: 'snow',
    universeTag: 'EARTH-FROST-0',
    heroCodename: 'SURVIVOR',
    panels: [
      {
        panelNumber: 1,
        title: 'TWIN ENGINES FLAME OUT',
        narrationBox: 'FROST MOUNTAIN AIRSPACE • MINUS 40°C • BLINDING BLIZZARD',
        thoughtMonologue: "My name is Survivor. When the co-pilot yelled 'Hold onto something!', I didn't think he meant my parachute cords at 12,000 feet.",
        freezeFrameBadge: 'SURVIVOR • ARCTIC EXPLORER',
        sceneEmoji: '✈️ ❄️ 🔥',
        sceneDescription: 'The supply plane engine freezes solid over jagged glacial crevasses!',
        bgGradient: 'linear-gradient(135deg, #0c1c2e 0%, #020710 100%)',
        accentColor: '#38bdf8',
        soundEffect: '💥 *KABOOOOOM!*',
        sfxColor: '#7dd3fc',
        dialogues: [
          { speaker: 'hero', speakerName: 'SURVIVOR', avatar: '🥶', text: 'Both engines are popsicles! Dropping through the blizzard cloudbank!', tailPosition: 'left', emotion: 'worried' },
          { speaker: 'narrator', speakerName: 'MAYDAY RADIO', avatar: '📻', text: 'EMERGENCY BEACON ACTIVATED. Extractions unavailable in storm.', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'WAKING THE ANCIENT TITAN',
        narrationBox: 'THE CRASH SHATTERS CRYO-ICE! A 12-FOOT YETI EMERGES!',
        thoughtMonologue: "You ever crash-land on a pristine mountain and immediately wake up a gigantic furry colossus who was having a great nap? Yeah.",
        freezeFrameBadge: 'TITAN YETI AWAKENED',
        sceneEmoji: '🏔️ 🐾 ❄️',
        sceneDescription: 'Deep tremors shake the ice shelves as the Frost Titan roars!',
        bgGradient: 'linear-gradient(135deg, #1e3a5f 0%, #071220 100%)',
        accentColor: '#bae6fd',
        soundEffect: '❄️ *ROOOOOAAAAR!*',
        sfxColor: '#e0f2fe',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🦍', text: 'WHO SHATTERS THE SANCTUARY OF THE FROZEN SPIRES?!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'SURVIVOR', avatar: '😱', text: 'I am so, so sorry about your ceiling!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'RACE TO THE BEACON',
        narrationBox: 'FRIENDLY PENGUIN SCOUTS GUIDE THE WAY TO THE RESCUE HELIPAD!',
        thoughtMonologue: "Sub-zero blizzard, territorial yetis, and my only guides are three waddling emperor penguins who look suspiciously confident. Let's do this.",
        freezeFrameBadge: 'LEAP OF FAITH • REACH THE EXTRACTION CHOPPER',
        sceneEmoji: '🐧 🏃‍♂️ 🚁',
        sceneDescription: 'Gather fuel caches, leap over crevasses, and ignite the rescue flare!',
        bgGradient: 'linear-gradient(135deg, #07192c 0%, #01060e 100%)',
        accentColor: '#38bdf8',
        soundEffect: '💨 *SWOOOOOSH!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'SURVIVOR', avatar: '🏃', text: 'Stay behind me little buddies, we’re riding that chopper home!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'ally', speakerName: 'PENGUIN SCOUT', avatar: '🐧', text: '*Waddle-squeak!* (Translation: Jump on my count!)', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🍳 KITCHEN SPIDER-VERSE STORY
function generateKitchenStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE RECIPE INFILTRATION',
    subtitle: `HOW YOU GOT LOCKED IN ${title.toUpperCase()}`,
    theme: 'kitchen',
    universeTag: 'EARTH-CHEF-5',
    heroCodename: 'FOOD CRITIC SPY',
    panels: [
      {
        panelNumber: 1,
        title: 'THE SECRET SAUCE VAULT',
        narrationBox: 'LE GRAND BISTRO • 11:45 PM • 3-STAR MICHELIN LAB',
        thoughtMonologue: "My name is Food Critic Spy. I've stolen state secrets, but tonight's target is the rarest artifact on Earth: Chef Vance's secret truffle demiglace.",
        freezeFrameBadge: 'FOOD CRITIC SPY • UNDERCOVER GASTRONOME',
        sceneEmoji: '👨‍🍳 📜 🍳',
        sceneDescription: 'Sneaking past stainless steel islands with a micro-camera...',
        bgGradient: 'linear-gradient(135deg, #3f1505 0%, #150400 100%)',
        accentColor: '#f97316',
        soundEffect: '🤫 *TIP-TOE!*',
        sfxColor: '#fb923c',
        dialogues: [
          { speaker: 'hero', speakerName: 'FOOD CRITIC SPY', avatar: '🕵️‍♀️', text: 'The parchment recipe is in the spice safe behind the wood-fired range...', tailPosition: 'left', emotion: 'smug' },
          { speaker: 'narrator', speakerName: 'KITCHEN COMMS', avatar: '📟', text: 'Careful, the prep table floor was just mopped with extra virgin oil!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE SIZZLING SLIP',
        narrationBox: 'A SPILLED CARAFE OF OIL TURNS THE FLOOR INTO A BOWLING ALLEY!',
        thoughtMonologue: "You haven't truly lived until you've slid 30 feet across stainless steel and headbutted an eight-tier pyramid of copper saucepans.",
        freezeFrameBadge: 'CULINARY EMERGENCY',
        sceneEmoji: '🥘 💥 🥞',
        sceneDescription: 'Crashing into industrial prep carts! Pots and cleavers rattle to the floor!',
        bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #200600 100%)',
        accentColor: '#ea580c',
        soundEffect: '💥 *CLANG-CLATTER-BAM!*',
        sfxColor: '#f97316',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👨‍🍳', text: 'WHO DROPPED MY 48-HOUR SIMMERING VEAL STOCK?!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'FOOD CRITIC SPY', avatar: '😬', text: 'Uh... compliments to the chef on the floor polish?!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'RUN THE PANTRY GAUNTLET',
        narrationBox: 'LINE COOKS ARM ROLLING PINS! WALK-IN FREEZER SHUTTERS SLAM!',
        thoughtMonologue: "Recipe is in my pocket. Sizzling stovetops ahead. Angry chefs behind. Best dinner rush of my life.",
        freezeFrameBadge: 'LEAP OF FAITH • OUT THE PANTRY DOCK',
        sceneEmoji: '🔥 🏃‍♀️ 🚪',
        sceneDescription: 'Sprinting across searing grill tops to reach the loading dock exit!',
        bgGradient: 'linear-gradient(135deg, #2c1208 0%, #0a0301 100%)',
        accentColor: '#f59e0b',
        soundEffect: '🔥 *WHOOOSH!*',
        sfxColor: '#fbbf24',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🔪', text: 'DO NOT LET THEM WALK OUT WITH MY SECRET INGREDIENTS!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'FOOD CRITIC SPY', avatar: '🏃‍♀️', text: 'Consider this order to-go, Chef! Table for one at the finish line!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// ✈️ AIRPORT SPIDER-VERSE STORY
function generateAirportStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE WRONG BRIEFCASE',
    subtitle: `HOW YOU GOT CORNERED IN ${title.toUpperCase()}`,
    theme: 'airport',
    universeTag: 'EARTH-JET-7',
    heroCodename: 'PASSENGER 77',
    panels: [
      {
        panelNumber: 1,
        title: 'CAROUSEL 3 MIX-UP',
        narrationBox: 'TERMINAL 4 CONCOURSE • 05:40 AM • CAROUSEL 3 ROTATING',
        thoughtMonologue: "My name is Passenger 77. All I wanted was my suitcase with clean socks and my favorite hoodie. What did I pick up? A titanium diplomatic carrier briefcase.",
        freezeFrameBadge: 'PASSENGER 77 • MISTAKEN IDENTITY',
        sceneEmoji: '🧳 ✈️ 🕶️',
        sceneDescription: 'Lifting the heavy briefcase off the conveyor belt as red scanners light up...',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #080c14 100%)',
        accentColor: '#00f2fe',
        soundEffect: '🔄 *WHIIIR!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'PASSENGER 77', avatar: '🏃', text: 'This doesn’t feel like duty-free chocolates. Why does it have a biometric retina lock?', tailPosition: 'left', emotion: 'shocked' },
          { speaker: 'boss', speakerName: boss, avatar: '🤖', text: 'SCANNER CONFIRMED: SUBJECT 77 HAS THE CIPHER CASE.', tailPosition: 'right', emotion: 'angry' },
        ],
      },
      {
        panelNumber: 2,
        title: 'SECURITY PERIMETER SEALED',
        narrationBox: 'TSA RADAR TOWERS FLASH CRIMSON! JETWAY DOORS BOLT DOWN!',
        thoughtMonologue: "Within twelve seconds, thirty robotic TSA drones deployed laser barriers across every duty-free shop. Gate 22 is two miles away.",
        freezeFrameBadge: 'TERMINAL LOCKDOWN',
        sceneEmoji: '🚨 🛡️ 🤖',
        sceneDescription: 'Automated laser barriers drop over the skybridge boarding ramps!',
        bgGradient: 'linear-gradient(135deg, #450a0a 0%, #150202 100%)',
        accentColor: '#ef4444',
        soundEffect: '🚨 *BEEP-BEEP-BEEP!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🤖', text: 'INITIATING PROTOCOL AIRLOCK. SURRENDER THE DIPLOMATIC CARRIER.', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'PASSENGER 77', avatar: '😱', text: 'My flight is in final boarding! I have a window seat!', tailPosition: 'left', emotion: 'worried' },
        ],
      },
      {
        panelNumber: 3,
        title: 'GATE 22 RUNWAY SPRINT',
        narrationBox: 'COLLECT YOUR BOARDING PASS TO UNLOCK THE SKYBRIDGE EVAC!',
        thoughtMonologue: "Luggage scanner drones, conveyor mazes, and a private jet with its engines whining on the tarmac. Time to fly.",
        freezeFrameBadge: 'LEAP OF FAITH • BOARD THE TRANSPORT',
        sceneEmoji: '✈️ 🏃 💨',
        sceneDescription: 'Sliding under baggage scanners and making a break for the runway gate!',
        bgGradient: 'linear-gradient(135deg, #0c1a2e 0%, #020710 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💨 *ZOOM-THWIP!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'PILOT ON RADIO', avatar: '👨‍✈️', text: 'Engines are at 95% throttle! Hit the jetway door or we take off without you!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'PASSENGER 77', avatar: '😎', text: 'Tell the tower to clear the runway, I’m sliding in on first class!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 👻 HAUNTED SPIDER-VERSE STORY
function generateHauntedStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE MIDNIGHT THUNDERSTORM',
    subtitle: `HOW YOU WERE TRAPPED IN ${title.toUpperCase()}`,
    theme: 'haunted',
    universeTag: 'EARTH-CRYPT-13',
    heroCodename: 'TRAVELER',
    panels: [
      {
        panelNumber: 1,
        title: 'SHELTER FROM THE STORM',
        narrationBox: 'FORGOTTEN CEMETERY • 00:00 MIDNIGHT • TORRENTIAL DOWNPOUR',
        thoughtMonologue: "My name is Traveler. When an umbrella snaps in half during a thunderstorm, common sense says find shelter. Ancient stone mausoleums? Maybe skip those next time.",
        freezeFrameBadge: 'TRAVELER • UNLUCKY REFUGEE',
        sceneEmoji: '⚡ 🌧️ 🪦',
        sceneDescription: 'Pushing open heavy gothic iron gates to escape the torrential lightning storm...',
        bgGradient: 'linear-gradient(135deg, #2e1065 0%, #0a0319 100%)',
        accentColor: '#a855f7',
        soundEffect: '⚡ *CRRAAACK!*',
        sfxColor: '#c084fc',
        dialogues: [
          { speaker: 'hero', speakerName: 'TRAVELER', avatar: '🧥', text: 'Just chilling until the storm blows over. Nice spooky gargoyle statues.', tailPosition: 'left', emotion: 'worried' },
          { speaker: 'narrator', speakerName: 'WHISPERING WIND', avatar: '🌬️', text: 'The statues are not statues... and they do not like visitors.', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'THE SLAMMING PORTCULLIS',
        narrationBox: 'A ROARING GALE SLAMS THE IRON GATES! COLD SPECTERS IGNITE!',
        thoughtMonologue: "And that's when the gargoyle turned its head 180 degrees, made eye contact, and the iron gate dropped with enough force to register on seismographs.",
        freezeFrameBadge: 'CRYPT AWAKENED',
        sceneEmoji: '🚪 💥 👻',
        sceneDescription: 'Floating wraiths illuminate candelabras with eerie ethereal fire!',
        bgGradient: 'linear-gradient(135deg, #4c0519 0%, #150106 100%)',
        accentColor: '#fb7185',
        soundEffect: '💥 *SLAAAM-KTOOM!*',
        sfxColor: '#f43f5e',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👻', text: 'MORTAL SOUL... WELCOME TO THY ETERNAL VIGIL...', tailPosition: 'right', emotion: 'smug' },
          { speaker: 'hero', speakerName: 'TRAVELER', avatar: '😱', text: 'The gate is padlocked from the outside! And ghosts don’t respect personal space!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'BREAK THE RUNESTONE CURSE',
        narrationBox: 'GATHER THE SILVER TALISMANS TO BREAK THE GOTHIC CURSE!',
        thoughtMonologue: "Ghosts hate silver. I love not being haunted. Time to turn this crypt into an escape room.",
        freezeFrameBadge: 'LEAP OF FAITH • BREAK INTO THE DAYLIGHT',
        sceneEmoji: '🗝️ 🕯️ 🏃',
        sceneDescription: 'Dashing between tomb crypts, seizing holy relics, and forcing the spiked gate!',
        bgGradient: 'linear-gradient(135deg, #1e112a 0%, #06020c 100%)',
        accentColor: '#a855f7',
        soundEffect: '✨ *GLOOOOOW!*',
        sfxColor: '#d8b4fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'ANCIENT SPIRIT', avatar: '🔮', text: 'The silver seals break the reaper’s grip! Seize them and run!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'TRAVELER', avatar: '🏃', text: 'Not ending up on a cemetery tombstone tonight! Watch me dash!', tailPosition: 'left', emotion: 'determined' },
        ],
      },
    ],
  };
}

// 💻 CYBERPUNK SPIDER-VERSE STORY
function generateCyberpunkStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE NEURAL JACK-IN',
    subtitle: `HOW YOU GOT CAUGHT IN ${title.toUpperCase()}`,
    theme: 'cyberpunk',
    universeTag: 'EARTH-2099-CYBER',
    heroCodename: 'NETRUNNER DEX',
    panels: [
      {
        panelNumber: 1,
        title: 'MEGACORP MAINFRAME INTRUSION',
        narrationBox: 'NEO-SHINJUKU SUBNET • LEVEL 99 • ICE FIREWALL MATRIX',
        thoughtMonologue: "My name is Netrunner Dex. In the year 2099, you don't break into a bank with crowbars. You jack your neural cortex directly into their high-voltage server core.",
        freezeFrameBadge: 'DEX • SUBNET CYBER-GHOST',
        sceneEmoji: '🕶️ 💾 ⚡',
        sceneDescription: 'Siphoning encrypted corporate ledgers through a neural deck link...',
        bgGradient: 'linear-gradient(135deg, #051923 0%, #00080d 100%)',
        accentColor: '#00f2fe',
        soundEffect: '⚡ *BZZZZT!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'hero', speakerName: 'NETRUNNER DEX', avatar: '👾', text: 'Black-ICE protocols decrypted. Just downloading the mainframe core...', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'ally', speakerName: 'DECK RIGGER', avatar: '🎧', text: 'Dex! Their countermeasure AI traced our optical ping!', tailPosition: 'right' },
        ],
      },
      {
        panelNumber: 2,
        title: 'LETHAL ICE TRIGGERED',
        narrationBox: 'A SHOCKWAVE OF CRIMSON COUNTERMEASURE CODE RIPS THROUGH FIBER!',
        thoughtMonologue: "And that's when their Hunter Drones woke up. With targeting lasers. And rotary plasma cannons. Why does every megacorp have rotary plasma cannons?!",
        freezeFrameBadge: 'PURGE PROTOCOL INITIALIZED',
        sceneEmoji: '💥 🔴 🤖',
        sceneDescription: 'Autonomous drones decouple from server racks with blazing neon target locks!',
        bgGradient: 'linear-gradient(135deg, #450a0a 0%, #150202 100%)',
        accentColor: '#ff0055',
        soundEffect: '🚨 *OVERHEAT-GLITCH!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🤖', text: 'UNAUTHORIZED INTRUDER CONFIRMED. PURGING NEURAL LINK IMMEDIATELY.', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'NETRUNNER DEX', avatar: '⚡', text: 'The manual jack-out is locked! If I don’t reach the physical airlock, my brain is toast!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'OVERCLOCK AND PURGE',
        narrationBox: 'HACK THE SERVER TERMINALS TO DISCHARGE THE PHYSICAL AIRLOCK!',
        thoughtMonologue: "No rebooting. No logging off. Just 100% overclocked adrenaline, my tactical dash, and a neon exit door. Let's make some sparks.",
        freezeFrameBadge: 'LEAP OF FAITH • AIRLOCK EXTRACTION',
        sceneEmoji: '🏃‍♂️ 💾 🚪',
        sceneDescription: 'Sprinting through optical cables, overriding server terminals, and punching through!',
        bgGradient: 'linear-gradient(135deg, #180928 0%, #05010b 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💥 *POW-ZAP!*',
        sfxColor: '#00f2fe',
        dialogues: [
          { speaker: 'ally', speakerName: 'DECK RIGGER', avatar: '🎧', text: 'Emergency optical port is open! Hack the sub-terminals on your way out!', tailPosition: 'right' },
          { speaker: 'hero', speakerName: 'NETRUNNER DEX', avatar: '😎', text: 'Watch me burn through their firewalls like tissue paper!', tailPosition: 'left', emotion: 'smug' },
        ],
      },
    ],
  };
}

// 🌋 VOLCANO SPIDER-VERSE STORY
function generateVolcanoStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE CRUMBLING CALDERA',
    subtitle: `HOW YOU GOT STRANDED IN ${title.toUpperCase()}`,
    theme: 'volcano',
    universeTag: 'EARTH-MAGMA-88',
    heroCodename: 'VOLCANOLOGIST',
    panels: [
      {
        panelNumber: 1,
        title: 'OBSIDIAN TREASURE DIVE',
        narrationBox: 'ACTIVE MAGMA CHAMBER • 950°C • SULFURIC STEAM RISING',
        thoughtMonologue: "My name is Volcanologist. When they said 'field research in a tropical climate', I thought they meant beaches with pina coladas, not an active magma volcano crater.",
        freezeFrameBadge: 'VOLCANOLOGIST • FIELD DAREDEVIL',
        sceneEmoji: '🌋 ⛏️ 💎',
        sceneDescription: 'Scouting the glowing volcanic cavern for legendary magma crystals...',
        bgGradient: 'linear-gradient(135deg, #431407 0%, #150300 100%)',
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
        thoughtMonologue: "The stone bridge behind me just vanished into liquid basalt with a sizzling hiss. Did I mention my boots are starting to melt?",
        freezeFrameBadge: 'SEISMIC COLLAPSE',
        sceneEmoji: '💥 🌋 🌊',
        sceneDescription: 'Rivers of glowing lava swallow the entry path! A magma colossus rises!',
        bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #200404 100%)',
        accentColor: '#ef4444',
        soundEffect: '💥 *KABOOOOOM!*',
        sfxColor: '#f97316',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '🔥', text: 'THE CALDERA BELONGS TO THE INFERNO! NONE SHALL ESCAPE!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'VOLCANOLOGIST', avatar: '😱', text: 'The bridge just fell into the lava! Time for a tactical detour!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'RACE ACROSS THE BASALT',
        narrationBox: 'CROSS BASALT PILLARS BEFORE THE CRATER OVERFLOWS!',
        thoughtMonologue: "Lava to the left. Pyro sentries to the right. One working extraction tunnel ahead. Leap of faith time.",
        freezeFrameBadge: 'LEAP OF FAITH • VENT TUNNEL EXTRACTION',
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

// 🏺 DESERT / PYRAMID SPIDER-VERSE STORY
function generateDesertStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE TOMB SAND-TRAP',
    subtitle: `HOW YOU WERE TRAPPED IN ${title.toUpperCase()}`,
    theme: 'desert',
    universeTag: 'EARTH-PHARAOH-3',
    heroCodename: 'ARCHAEOLOGIST',
    panels: [
      {
        panelNumber: 1,
        title: 'THE SECRET CHAMBER',
        narrationBox: 'VALLEY OF KINGS • 01:00 PM • ANCIENT BURIAL VAULT',
        thoughtMonologue: "My name is Archaeologist. When Indiana Jones does this, he gets tenure and a museum wing. When I do this, ancient traps trigger instantly.",
        freezeFrameBadge: 'ARCHAEOLOGIST • RELIC HUNTER',
        sceneEmoji: '🏺 🔦 📜',
        sceneDescription: 'Deciphering hieroglyphs on the massive golden sarcophagus wall...',
        bgGradient: 'linear-gradient(135deg, #451a03 0%, #150600 100%)',
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
        thoughtMonologue: "Fifty tons of desert sand just blocked the sunlight behind me. And a golden Dune Warden just floated out of a sarcophagus.",
        freezeFrameBadge: 'TOMB CURSE ACTIVATED',
        sceneEmoji: '💥 ⏳ 🦂',
        sceneDescription: 'Tons of desert sand seal off the daylight behind you! Tomb scorpions skitter out!',
        bgGradient: 'linear-gradient(135deg, #78350f 0%, #200801 100%)',
        accentColor: '#d97706',
        soundEffect: '💥 *RUUUUMBLE-CRASH!*',
        sfxColor: '#f59e0b',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👺', text: 'THOU SHALT SLEEP IN DUST FOR TEN THOUSAND YEARS!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'ARCHAEOLOGIST', avatar: '😬', text: 'Note to self: Never push the golden beetle button.', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'FIND THE GOLDEN ANKH',
        narrationBox: 'SEEK THE PHARAOH RELICS TO UNSEAL THE SACRED EXIT SHAFT!',
        thoughtMonologue: "Grab the relics, dodge the stingers, punch the exit stone. Easy peasy.",
        freezeFrameBadge: 'LEAP OF FAITH • OUT OF THE PYRAMID',
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

// 🌊 OCEAN SPIDER-VERSE STORY
function generateOceanStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE HULL BREACH AT 4,000 FATHOMS',
    subtitle: `HOW YOU GOT STRANDED IN ${title.toUpperCase()}`,
    theme: 'ocean',
    universeTag: 'EARTH-ABYSS-4',
    heroCodename: 'AQUANAUT',
    panels: [
      {
        panelNumber: 1,
        title: 'DEEP SEA LAB EXPEDITION',
        narrationBox: 'MARIANA RESEARCH FACILITY • DEPTH 11,000M • PITCH BLACK TRENCH',
        thoughtMonologue: "My name is Aquanaut. At 11,000 meters underwater, the ocean pressure is roughly equivalent to having forty elephants standing on your chest.",
        freezeFrameBadge: 'AQUANAUT • DEEP TRENCH DIVER',
        sceneEmoji: '🌊 🤿 💡',
        sceneDescription: 'Exploring the abyssal trench laboratory in search of deep energy crystals...',
        bgGradient: 'linear-gradient(135deg, #082f49 0%, #010c14 100%)',
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
        thoughtMonologue: "And that's when a creature the size of a city block decided our research outpost looked like a crunchy midnight snack.",
        freezeFrameBadge: 'HULL BREACH IN PROGRESS',
        sceneEmoji: '💥 🐙 🚨',
        sceneDescription: 'Emergency bulkheads crash down as water cascades into outer chambers!',
        bgGradient: 'linear-gradient(135deg, #0369a1 0%, #031624 100%)',
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
        thoughtMonologue: "Four thousand fathoms straight up. Ten minutes of oxygen. Ballast rockets locked and loaded.",
        freezeFrameBadge: 'LEAP OF FAITH • SURFACE LAUNCH',
        sceneEmoji: '🏃 🫧 🚀',
        sceneDescription: 'Evade trench stalkers, snatch emergency oxygen, and trigger the ballast rockets!',
        bgGradient: 'linear-gradient(135deg, #07263b 0%, #010910 100%)',
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

// 🚀 SPACE SPIDER-VERSE STORY
function generateSpaceStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE VOID OUTPOST CONTAINMENT BREACH',
    subtitle: `HOW YOU GOT STRANDED ON ${title.toUpperCase()}`,
    theme: 'space',
    universeTag: 'EARTH-COSMIC-99',
    heroCodename: 'COSMONAUT',
    panels: [
      {
        panelNumber: 1,
        title: 'ORBITAL MAINTENANCE RUN',
        narrationBox: 'OUTER KUIPER STATION • ZERO GRAVITY • DEEP COSMIC NIGHT',
        thoughtMonologue: "My name is Cosmonaut. In space, no one can hear you scream. But they can definitely hear you swear when you drop your magnetic wrench into a thruster turbine.",
        freezeFrameBadge: 'COSMONAUT • VOID DRIFTER',
        sceneEmoji: '🚀 👨‍🚀 ✨',
        sceneDescription: 'Repairing the orbital gravity relay outside the space station hub...',
        bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #040310 100%)',
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
        thoughtMonologue: "Did that alien just eat my shuttle hatch? Yes. Yes it did. And now it has glowing purple eyes and a family of twenty cousins behind it.",
        freezeFrameBadge: 'EXTRATERRESTRIAL INTRUSION',
        sceneEmoji: '💥 👽 🚨',
        sceneDescription: 'The outer airlock depressurizes as extraterrestrial shadows swarm the station!',
        bgGradient: 'linear-gradient(135deg, #3b0764 0%, #0d0118 100%)',
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
        thoughtMonologue: "Zero gravity. Overheated thrusters. One chance to jump into hyperspace.",
        freezeFrameBadge: 'LEAP OF FAITH • HYPERSPACE WARP',
        sceneEmoji: '🏃 🚀 🌌',
        sceneDescription: 'Dodge xenomorph stalkers, collect energy nodes, and launch the warp shuttle!',
        bgGradient: 'linear-gradient(135deg, #140d2e 0%, #030108 100%)',
        accentColor: '#a855f7',
        soundEffect: '⚡ *HYPERSPACE-BOOM!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'COSMONAUT', avatar: '🔥', text: 'Thrusters primed! Time to blow this orbital popsicle stand!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '👾', text: 'SEAL ALL BULKHEADS! DO NOT LET THE HUMAN REACH THE ENGINES!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🎓 CLASSROOM SPIDER-VERSE STORY
function generateClassroomStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE MIDNIGHT EXAM LOCKDOWN',
    subtitle: `HOW YOU GOT LOCKED IN ${title.toUpperCase()}`,
    theme: 'classroom',
    universeTag: 'EARTH-ACADEMIA-1',
    heroCodename: 'TIRED STUDENT',
    panels: [
      {
        panelNumber: 1,
        title: 'FELL ASLEEP STUDYING',
        narrationBox: 'MAIN UNIVERSITY AUDITORIUM • 11:45 PM • FINALS WEEK',
        thoughtMonologue: "My name is Tired Student. When you drink four energy drinks and read quantum electrodynamics textbook chapters, time ceases to have meaning.",
        freezeFrameBadge: 'TIRED STUDENT • FINALS SURVIVOR',
        sceneEmoji: '📚 😴 🎓',
        sceneDescription: 'Cramming for the quantum physics exam until your eyelids gave out...',
        bgGradient: 'linear-gradient(135deg, #451a03 0%, #120400 100%)',
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
        thoughtMonologue: "I woke up at 2 AM. The doors are padlocked. And the head proctor just armed the laser surveillance tripwires.",
        freezeFrameBadge: 'ACADEMIC CURFEW LOCKDOWN',
        sceneEmoji: '🔒 🚨 🔦',
        sceneDescription: 'Campus security has locked all gates! Surveillance drones sweep the desk rows!',
        bgGradient: 'linear-gradient(135deg, #78350f 0%, #1c0900 100%)',
        accentColor: '#ea580c',
        soundEffect: '🔒 *KA-CHUNNNK!*',
        sfxColor: '#f97316',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👮', text: 'ALL DOORS BOLTED FOR CURFEW! NO TRESPASSERS ON CAMPUS PROPERTY!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'TIRED STUDENT', avatar: '😱', text: 'My test is in six hours! If I get a zero on this final, my life is over!', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'DODGE THE PROCTORS',
        narrationBox: 'COLLECT YOUR SCATTERED STUDY NOTES AND SNEAK OUT THE FIRE DOOR!',
        thoughtMonologue: "If stealthily dodging laser proctors through a labyrinth of lecture desks doesn't count as extra credit, I don't know what does.",
        freezeFrameBadge: 'LEAP OF FAITH • ACADEMIC ESCAPE',
        sceneEmoji: '🏃 📝 🚪',
        sceneDescription: 'Bypass campus guards, find the professor hall pass, and hit the exit!',
        bgGradient: 'linear-gradient(135deg, #2b1206 0%, #080300 100%)',
        accentColor: '#f59e0b',
        soundEffect: '💨 *TIP-TOE-DASH!*',
        sfxColor: '#ffd700',
        dialogues: [
          { speaker: 'hero', speakerName: 'TIRED STUDENT', avatar: '🏃', text: 'If I ace this stealth escape, I definitely deserve a straight A!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '👮', text: 'CHECK UNDER EVERY LECTURE SEAT!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🏢 OFFICE SPIDER-VERSE STORY
function generateOfficeStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE OVERTIME WHISTLEBLOWER',
    subtitle: `HOW YOU WERE BARRICADED IN ${title.toUpperCase()}`,
    theme: 'office',
    universeTag: 'EARTH-CORP-42',
    heroCodename: 'OFFICE HERO',
    panels: [
      {
        panelNumber: 1,
        title: 'PRINTING THE EVIDENCE',
        narrationBox: 'CUBICLE 42-B • 01:20 AM • EXECUTIVE 50TH FLOOR',
        thoughtMonologue: "My name is Office Hero. They told me staying late showed leadership potential. They didn't tell me the CEO had a private army of autonomous robotic desk sentries.",
        freezeFrameBadge: 'OFFICE HERO • WHISTLEBLOWER',
        sceneEmoji: '🖨️ 📄 💼',
        sceneDescription: 'Printing the whistleblower corporate embezzlement records after everyone went home...',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #060910 100%)',
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
        thoughtMonologue: "Every cubicle divider just turned into cover against laser sentries. My stapler is not going to win this firefight.",
        freezeFrameBadge: 'EXECUTIVE OVERRIDE',
        sceneEmoji: '🚨 🤖 🏢',
        sceneDescription: 'Building security chief deploys automated patrol units through the cubicle maze!',
        bgGradient: 'linear-gradient(135deg, #450a0a 0%, #120202 100%)',
        accentColor: '#ef4444',
        soundEffect: '🚨 *WEE-WOO-WEE-WOO!*',
        sfxColor: '#ff003c',
        dialogues: [
          { speaker: 'boss', speakerName: boss, avatar: '👔', text: 'CONFISCATE ALL USB DRIVES AND DOSSIERS! NO EMPLOYEE LEAVES THIS TOWER!', tailPosition: 'right', emotion: 'angry' },
          { speaker: 'hero', speakerName: 'OFFICE HERO', avatar: '😬', text: 'I should have just worked from home today.', tailPosition: 'left', emotion: 'shocked' },
        ],
      },
      {
        panelNumber: 3,
        title: 'ROOFTOP HELIPAD EVAC',
        narrationBox: 'GRAB THE EXECUTIVE PASSKEYS TO UNLOCK THE SKYWALK DOOR!',
        thoughtMonologue: "Files in briefcase. Helipad on roof. Sixty seconds to jump. Leap of faith time.",
        freezeFrameBadge: 'LEAP OF FAITH • ROOFTOP SKYWALK',
        sceneEmoji: '🏃 💼 🚁',
        sceneDescription: 'Dash through water coolers and partition dividers to reach freedom!',
        bgGradient: 'linear-gradient(135deg, #0e1e38 0%, #02060e 100%)',
        accentColor: '#00f2fe',
        soundEffect: '💥 *CRASH-BAM!*',
        sfxColor: '#38bdf8',
        dialogues: [
          { speaker: 'hero', speakerName: 'OFFICE HERO', avatar: '🏃', text: 'I am taking these files directly to the press!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🤖', text: 'PATROLS, INTERCEPT AT THE ROOFTOP PORTAL!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🌿 NATURE / GROVE SPIDER-VERSE STORY
function generateNatureStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE FORBIDDEN ENCHANTED GROVE',
    subtitle: `HOW YOU TRESPASSED INTO ${title.toUpperCase()}`,
    theme: 'nature',
    universeTag: 'EARTH-PRIMAL-6',
    heroCodename: 'EXPLORER',
    panels: [
      {
        panelNumber: 1,
        title: 'FOLLOWING THE OVERGROWN TRAIL',
        narrationBox: 'ANCIENT PRIMAL WOODS • DUSK • THICK GLOWING MOSS',
        thoughtMonologue: "My name is Explorer. The sign said 'DO NOT ENTER: ANCIENT CURSE'. In my defense, the sign was written in very pretty calligraphy.",
        freezeFrameBadge: 'EXPLORER • WILDERNESS RUNNER',
        sceneEmoji: '🌲 🧭 🍄',
        sceneDescription: 'Chasing an uncharted botanical trail deep into the misty heart of the canopy...',
        bgGradient: 'linear-gradient(135deg, #14532d 0%, #03160a 100%)',
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
        thoughtMonologue: "Vines just knotted together behind me into a 20-foot wall of thorns. And the guardian beast is the size of a city bus.",
        freezeFrameBadge: 'BEAST GUARDIAN AWAKENED',
        sceneEmoji: '💥 🐺 🐾',
        sceneDescription: 'Thorny briars instantly entangle the entry path behind you!',
        bgGradient: 'linear-gradient(135deg, #1e3a1e 0%, #040d04 100%)',
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
        thoughtMonologue: "One Sunstone seed. Fast feet. Let's make this grove remember why humans invented sprinting.",
        freezeFrameBadge: 'LEAP OF FAITH • BREAK THE CANOPY',
        sceneEmoji: '🏃 🌸 ☀️',
        sceneDescription: 'Dart around shadow vipers, claim enchanted flora, and reach the sunlit clearing!',
        bgGradient: 'linear-gradient(135deg, #0f2d18 0%, #020c04 100%)',
        accentColor: '#86efac',
        soundEffect: '✨ *SHINE-BURST!*',
        sfxColor: '#4ade80',
        dialogues: [
          { speaker: 'hero', speakerName: 'EXPLORER', avatar: '🏃', text: 'Just need the Sunstone seed to pacify the path!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🐺', text: 'SPORE STALKERS, SURROUND THE TRESPASSER!', tailPosition: 'right' },
        ],
      },
    ],
  };
}

// 🏰 DUNGEON SPIDER-VERSE STORY
function generateDungeonStory(title: string, boss: string): ComicStory {
  return {
    title: 'THE TRAPDOOR CRUMBLE',
    subtitle: `HOW YOU PLUMMETED INTO ${title.toUpperCase()}`,
    theme: 'dungeon',
    universeTag: 'EARTH-MEDIEVAL-10',
    heroCodename: 'DUNGEON CRAWLER',
    panels: [
      {
        panelNumber: 1,
        title: 'THE CASTLE RUINS',
        narrationBox: 'ABANDONED CITADEL • TWILIGHT • CRACKED MOSAIC FLOOR',
        thoughtMonologue: "My name is Dungeon Crawler. Legend said King Aldous hid his royal armory here. Legend forgot to mention the floor was held together by hopes and dreams.",
        freezeFrameBadge: 'DUNGEON CRAWLER • RELIC SEEKER',
        sceneEmoji: '🏰 ⚔️ 🕯️',
        sceneDescription: 'Investigating rumors of a forgotten royal armory buried below...',
        bgGradient: 'linear-gradient(135deg, #334155 0%, #0a101b 100%)',
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
        thoughtMonologue: "I fell for four seconds. That's long enough to reconsider all your life choices, apologize to your cat, and hit a stone floor with an undignified squawk.",
        freezeFrameBadge: 'TRAPDOOR AMBUSH',
        sceneEmoji: '💥 🕳️ 💀',
        sceneDescription: 'You land amidst piles of ancient rubble while skeletal sentries stir to life!',
        bgGradient: 'linear-gradient(135deg, #475569 0%, #0e141e 100%)',
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
        thoughtMonologue: "Skeletons rattle. Gargoyles wake. Exit portcullis is locked. Best dungeon run ever.",
        freezeFrameBadge: 'LEAP OF FAITH • BREAK THE PORTCULLIS',
        sceneEmoji: '🗝️ 🏃 🚪',
        sceneDescription: 'Navigate the stone maze, dodge bone stalkers, and break through to the surface!',
        bgGradient: 'linear-gradient(135deg, #1e293b 0%, #05080e 100%)',
        accentColor: '#f59e0b',
        soundEffect: '⚔️ *CLANG-WHAM!*',
        sfxColor: '#ffd700',
        dialogues: [
          { speaker: 'hero', speakerName: 'DUNGEON CRAWLER', avatar: '⚔️', text: 'No skeleton army is keeping me down here!', tailPosition: 'left', emotion: 'determined' },
          { speaker: 'boss', speakerName: boss, avatar: '🗿', text: 'GARGOYLES, CRUSH THE INTRUDER!', tailPosition: 'right' },
        ],
      },
    ],
  };
}
