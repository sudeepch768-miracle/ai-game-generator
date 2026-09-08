// Persistent Map-Specific Scoreboard & Personal Best Tracker

const STORAGE_PREFIX = 'reality_play_pb_';
const REGISTRY_KEY = 'reality_play_all_pbs';

export interface PersonalBestRecord {
  mapTitle: string;
  bestScore: number;
  updatedAt: number;
  difficulty?: string;
}

function normalizeKey(mapTitle: string): string {
  return (mapTitle || 'unknown_sector')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 60);
}

export function getPersonalBest(mapTitle: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const key = STORAGE_PREFIX + normalizeKey(mapTitle);
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function savePersonalBest(
  mapTitle: string,
  score: number,
  difficulty?: string
): { isNewPB: boolean; pb: number; previousPB: number } {
  if (typeof window === 'undefined' || !mapTitle) {
    return { isNewPB: false, pb: score, previousPB: 0 };
  }

  const cleanTitle = mapTitle.trim();
  const prevPB = getPersonalBest(cleanTitle);
  const isNewPB = score > prevPB;
  const bestScore = Math.max(score, prevPB);

  try {
    const key = STORAGE_PREFIX + normalizeKey(cleanTitle);
    localStorage.setItem(key, bestScore.toString());

    // Update global scoreboard registry
    const registryRaw = localStorage.getItem(REGISTRY_KEY);
    const registry: Record<string, PersonalBestRecord> = registryRaw ? JSON.parse(registryRaw) : {};

    registry[cleanTitle] = {
      mapTitle: cleanTitle,
      bestScore,
      updatedAt: Date.now(),
      difficulty: difficulty || 'medium',
    };

    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  } catch (err) {
    console.error('Failed to save personal best:', err);
  }

  return { isNewPB, pb: bestScore, previousPB: prevPB };
}

export function getAllPersonalBests(): PersonalBestRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const registryRaw = localStorage.getItem(REGISTRY_KEY);
    if (!registryRaw) return [];
    const registry: Record<string, PersonalBestRecord> = JSON.parse(registryRaw);
    return Object.values(registry).sort((a, b) => b.bestScore - a.bestScore);
  } catch {
    return [];
  }
}
