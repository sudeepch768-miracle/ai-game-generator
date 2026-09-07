export type HatType =
  | 'none'
  | 'fedora'
  | 'knight_helm'
  | 'ninja_headband'
  | 'visor'
  | 'hood'
  | 'space_helmet'
  | 'samurai_kabuto'
  | 'cowboy_hat'
  | 'gas_mask'
  | 'wizard_hat'
  | 'crown';
export type TrailEffect = 'sparkles' | 'fire' | 'electric' | 'ghostly' | 'smoke';

export interface AvatarSkin {
  id: string;
  name: string;
  tagline: string;
  cost: number;
  description: string;
  primaryColor: string;
  accentColor: string;
  hatType: HatType;
  trailEffect: TrailEffect;
  icon: string;
}

export const ALL_AVATAR_SKINS: AvatarSkin[] = [
  {
    id: 'ninja',
    name: 'Cyber Ninja',
    tagline: 'FREE / DEFAULT',
    cost: 0,
    description: 'High-agility operative equipped with an electric synaptic headband and pulse thrusters.',
    primaryColor: '#00f2fe',
    accentColor: '#ff007f',
    hatType: 'ninja_headband',
    trailEffect: 'electric',
    icon: '⚡',
  },
  {
    id: 'ghost_hunter',
    name: 'Paranormal Investigator',
    tagline: 'HAUNTED VAULT SPECIALIST',
    cost: 150,
    description: 'Rugged trenchcoat and wide-brim fedora tuned to detect and dispel restless spectral phantoms.',
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    hatType: 'fedora',
    trailEffect: 'ghostly',
    icon: '👻',
  },
  {
    id: 'space_vanguard',
    name: 'Starfleet Vanguard',
    tagline: 'COSMIC VOYAGER',
    cost: 200,
    description: 'Aeronautical pressurized suit with a curved solar-reflective visor for zero-G orbital breaches.',
    primaryColor: '#0284c7',
    accentColor: '#38bdf8',
    hatType: 'space_helmet',
    trailEffect: 'electric',
    icon: '🚀',
  },
  {
    id: 'agent',
    name: 'Secret Infiltrator',
    tagline: 'STEALTH & HEIST MASTER',
    cost: 300,
    description: 'Tailored midnight tuxedo with thermal reconnaissance shades for breaching fortified bank vaults.',
    primaryColor: '#1e293b',
    accentColor: '#10b981',
    hatType: 'visor',
    trailEffect: 'smoke',
    icon: '🕶️',
  },
  {
    id: 'samurai',
    name: 'Neon Cyber Ronin',
    tagline: 'BLADE MASTER OF NEO-TOKYO',
    cost: 350,
    description: 'Forged crimson kabuto helm with gold crescent horns and a scorching thermal flame trail.',
    primaryColor: '#b91c1c',
    accentColor: '#fbbf24',
    hatType: 'samurai_kabuto',
    trailEffect: 'fire',
    icon: '⚔️',
  },
  {
    id: 'cowboy',
    name: 'Wasteland Gunslinger',
    tagline: 'FRONTIER BOUNTY HUNTER',
    cost: 450,
    description: 'Weathered leather stetson and dust duster. Always strikes first with quickdraw reflexes.',
    primaryColor: '#b45309',
    accentColor: '#f59e0b',
    hatType: 'cowboy_hat',
    trailEffect: 'smoke',
    icon: '🤠',
  },
  {
    id: 'knight',
    name: 'Titan Cyber Knight',
    tagline: 'HEAVY ARMOR GUARDIAN',
    cost: 500,
    description: 'Solid titanium plate armor with a crested knight helmet and blazing magma thrusters.',
    primaryColor: '#f59e0b',
    accentColor: '#ef4444',
    hatType: 'knight_helm',
    trailEffect: 'fire',
    icon: '🛡️',
  },
  {
    id: 'bio_hacker',
    name: 'Plague Bio-Hacker',
    tagline: 'TOXIC HAZARD SPECIALIST',
    cost: 600,
    description: 'Heavy tactical NBC respirator and emerald filtration canisters to breach bio-hazard sectors.',
    primaryColor: '#15803d',
    accentColor: '#4ade80',
    hatType: 'gas_mask',
    trailEffect: 'electric',
    icon: '☣️',
  },
  {
    id: 'phantom',
    name: 'Spectral Wraith',
    tagline: 'ETHEREAL SHADOW WALKER',
    cost: 750,
    description: 'A shadowy cowl woven from pure astral mist. Glides through darkness with ghostly starlight.',
    primaryColor: '#8b5cf6',
    accentColor: '#c084fc',
    hatType: 'hood',
    trailEffect: 'ghostly',
    icon: '🔮',
  },
  {
    id: 'arcanist',
    name: 'Void Sorcerer',
    tagline: 'MASTER OF ARCHIVAL RUNES',
    cost: 850,
    description: 'Pointed midnight starlight wizard hat infused with ancient cyber-sorcery and astral mist.',
    primaryColor: '#7c3aed',
    accentColor: '#c084fc',
    hatType: 'wizard_hat',
    trailEffect: 'ghostly',
    icon: '🧙',
  },
  {
    id: 'retro',
    name: '8-Bit Arcade Legend',
    tagline: 'RETRO PIXEL ROYALTY',
    cost: 1000,
    description: 'The golden age champion draped in pixelated crimson with a rainbow star dust trail.',
    primaryColor: '#ec4899',
    accentColor: '#fbbf24',
    hatType: 'none',
    trailEffect: 'sparkles',
    icon: '👾',
  },
  {
    id: 'monarch',
    name: 'Golden Sovereign',
    tagline: 'SUPREME REALM RULER',
    cost: 1200,
    description: 'Radiant 24-karat crowned regalia encrusted with mystical rubies. Glides with stardust majesty.',
    primaryColor: '#eab308',
    accentColor: '#ffffff',
    hatType: 'crown',
    trailEffect: 'sparkles',
    icon: '👑',
  },
];

const GEMS_STORAGE_KEY = 'reality_to_play_gem_wallet';
const OWNED_SKINS_KEY = 'reality_to_play_owned_skins';
const EQUIPPED_SKIN_KEY = 'reality_to_play_equipped_skin';

export function getGemBalance(): number {
  const val = localStorage.getItem(GEMS_STORAGE_KEY);
  if (!val) {
    // Initial welcome bonus
    localStorage.setItem(GEMS_STORAGE_KEY, '50');
    return 50;
  }
  return parseInt(val, 10) || 0;
}

export function addGems(amount: number): number {
  const current = getGemBalance();
  const next = Math.max(0, current + amount);
  localStorage.setItem(GEMS_STORAGE_KEY, next.toString());
  return next;
}

export function spendGems(amount: number): boolean {
  const current = getGemBalance();
  if (current < amount) return false;
  localStorage.setItem(GEMS_STORAGE_KEY, (current - amount).toString());
  return true;
}

export function getOwnedSkinIds(): string[] {
  const raw = localStorage.getItem(OWNED_SKINS_KEY);
  if (!raw) {
    const defaultOwned = ['ninja'];
    localStorage.setItem(OWNED_SKINS_KEY, JSON.stringify(defaultOwned));
    return defaultOwned;
  }
  try {
    const list = JSON.parse(raw);
    if (!list.includes('ninja')) list.push('ninja');
    return list;
  } catch {
    return ['ninja'];
  }
}

export function buySkin(skinId: string): boolean {
  const skin = ALL_AVATAR_SKINS.find((s) => s.id === skinId);
  if (!skin) return false;

  const owned = getOwnedSkinIds();
  if (owned.includes(skinId)) return true;

  if (spendGems(skin.cost)) {
    owned.push(skinId);
    localStorage.setItem(OWNED_SKINS_KEY, JSON.stringify(owned));
    setEquippedSkin(skinId);
    return true;
  }
  return false;
}

export function getEquippedSkinId(): string {
  return localStorage.getItem(EQUIPPED_SKIN_KEY) || 'ninja';
}

export function getEquippedSkin(): AvatarSkin {
  const id = getEquippedSkinId();
  return ALL_AVATAR_SKINS.find((s) => s.id === id) || ALL_AVATAR_SKINS[0];
}

export function setEquippedSkin(skinId: string): void {
  const owned = getOwnedSkinIds();
  if (owned.includes(skinId)) {
    localStorage.setItem(EQUIPPED_SKIN_KEY, skinId);
  }
}
