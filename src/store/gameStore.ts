import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SRSCard, createSRSCard, updateSRSCard, SRSRating } from '../systems/srs';
import { levelFromXP } from '../systems/xp';
import { StreakState, createInitialStreak, recordActivity } from '../systems/streak';
import { REGIONS } from '../data/lessons';
import { getAllCards } from '../data/lessons';

export type AvatarOutfit = 'samurai' | 'shrine_maiden' | 'tokyo_modern' | 'ninja' | 'school_uniform';

// Level thresholds for outfit unlocks
export const OUTFIT_UNLOCK_LEVELS: Record<AvatarOutfit, number> = {
  samurai:        1,
  shrine_maiden:  5,
  tokyo_modern:   10,
  ninja:          20,
  school_uniform: 30,
};

export interface Achievement {
  id: string;
  unlockedAt: number | null;
}

export interface GameState {
  // Profile
  username: string;
  avatarOutfit: AvatarOutfit;
  totalXP: number;
  level: number;
  sakuraCoins: number;

  // Progress
  completedLessons: string[];
  unlockedRegions: string[];

  // Tower
  towerHighestFloor: number;
  isTowerUnlocked: boolean;
  isHardModeUnlocked: boolean;

  // SRS
  srsCards: Record<string, SRSCard>;

  // Streak
  streak: StreakState;

  // Daily challenge
  lastDailyChallengeDate: string | null;
  dailyChallengeStreak: number;

  // Achievements
  achievements: Achievement[];

  // Weekly XP (reset each Monday)
  weeklyXP: number;
  weeklyXPResetDate: string | null;

  // Actions
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string, xp: number) => void;
  recordSRS: (cardId: string, rating: SRSRating) => void;
  recordDailyChallenge: (xp: number) => void;
  advanceTowerFloor: (floor: number) => void;
  setUsername: (name: string) => void;
  setAvatarOutfit: (outfit: AvatarOutfit) => void;
  unlockRegion: (regionId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const STORAGE_KEY = 'hiragame_state_v1';

const ACHIEVEMENT_DEFS = [
  { id: 'first_steps' },
  { id: 'kana_master' },
  { id: 'week_warrior' },
  { id: 'night_owl' },
  { id: 'speed_reader' },
  { id: 'century_streak' },
  { id: 'tower_climber' },
  { id: 'tower_master' },
];

function initSRSCards(): Record<string, SRSCard> {
  const cards: Record<string, SRSCard> = {};
  for (const card of getAllCards()) {
    cards[card.id] = createSRSCard(card.id);
  }
  return cards;
}

function currentWeekKey(): string {
  const d = new Date();
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function checkUnlocks(
  completedLessons: string[],
  level: number,
  currentUnlockedRegions: string[],
  currentTowerUnlocked: boolean,
  currentHardMode: boolean,
) {
  let unlockedRegions = [...currentUnlockedRegions];
  let isTowerUnlocked = currentTowerUnlocked;
  let isHardModeUnlocked = currentHardMode;

  const hiraganaLessons = REGIONS.find(r => r.id === 'hiragana')?.lessons ?? [];
  const katakanaLessons = REGIONS.find(r => r.id === 'katakana')?.lessons ?? [];
  const intermediateLessons = REGIONS.find(r => r.id === 'intermediate')?.lessons ?? [];

  const completedH = hiraganaLessons.filter(l => completedLessons.includes(l.id)).length;
  const completedK = katakanaLessons.filter(l => completedLessons.includes(l.id)).length;
  const completedI = intermediateLessons.filter(l => completedLessons.includes(l.id)).length;

  // Unlock katakana at 70% hiragana
  if (completedH >= Math.floor(hiraganaLessons.length * 0.7) && !unlockedRegions.includes('katakana')) {
    unlockedRegions = [...unlockedRegions, 'katakana'];
  }

  // Unlock intermediate at 70% katakana
  if (completedK >= Math.floor(katakanaLessons.length * 0.7) && !unlockedRegions.includes('intermediate')) {
    unlockedRegions = [...unlockedRegions, 'intermediate'];
  }

  // Unlock Hard Mode + Tower at 70% intermediate
  if (completedI >= Math.floor(intermediateLessons.length * 0.7)) {
    isTowerUnlocked = true;
    isHardModeUnlocked = true;
  }

  return { unlockedRegions, isTowerUnlocked, isHardModeUnlocked };
}

export const useGameStore = create<GameState>((set, get) => ({
  username: 'Player',
  avatarOutfit: 'samurai',
  totalXP: 0,
  level: 1,
  sakuraCoins: 0,
  completedLessons: [],
  unlockedRegions: ['hiragana'],
  towerHighestFloor: 0,
  isTowerUnlocked: false,
  isHardModeUnlocked: false,
  srsCards: initSRSCards(),
  streak: createInitialStreak(),
  lastDailyChallengeDate: null,
  dailyChallengeStreak: 0,
  achievements: ACHIEVEMENT_DEFS.map(a => ({ id: a.id, unlockedAt: null })),
  weeklyXP: 0,
  weeklyXPResetDate: currentWeekKey(),

  addXP: (amount) => {
    const state = get();
    const newTotal = state.totalXP + amount;
    const newLevel = levelFromXP(newTotal);
    const thisWeek = currentWeekKey();
    const weeklyXP = state.weeklyXPResetDate !== thisWeek ? amount : state.weeklyXP + amount;
    set({ totalXP: newTotal, level: newLevel, weeklyXP, weeklyXPResetDate: thisWeek });
    get().persist();
  },

  completeLesson: (lessonId, xp) => {
    const state = get();
    const alreadyDone = state.completedLessons.includes(lessonId);
    const newCompleted = alreadyDone ? state.completedLessons : [...state.completedLessons, lessonId];
    const newStreak = recordActivity(state.streak);
    const bonusXP = alreadyDone ? 0 : xp;
    const newTotal = state.totalXP + bonusXP;
    const newLevel = levelFromXP(newTotal);
    const thisWeek = currentWeekKey();
    const weeklyXP = state.weeklyXPResetDate !== thisWeek ? bonusXP : state.weeklyXP + bonusXP;

    const { unlockedRegions, isTowerUnlocked, isHardModeUnlocked } = checkUnlocks(
      newCompleted, newLevel,
      state.unlockedRegions, state.isTowerUnlocked, state.isHardModeUnlocked,
    );

    // Achievement: first lesson
    const achievements = state.achievements.map(a => {
      if (a.id === 'first_steps' && a.unlockedAt === null && newCompleted.length === 1)
        return { ...a, unlockedAt: Date.now() };
      return a;
    });

    set({
      completedLessons: newCompleted,
      unlockedRegions,
      isTowerUnlocked,
      isHardModeUnlocked,
      totalXP: newTotal,
      level: newLevel,
      streak: newStreak,
      weeklyXP,
      weeklyXPResetDate: thisWeek,
      achievements,
    });
    get().persist();
  },

  recordSRS: (cardId, rating) => {
    const state = get();
    const existing = state.srsCards[cardId] ?? createSRSCard(cardId);
    const updated = updateSRSCard(existing, rating);
    set({ srsCards: { ...state.srsCards, [cardId]: updated } });
    get().persist();
  },

  recordDailyChallenge: (xp) => {
    const today = new Date().toISOString().split('T')[0];
    const state = get();
    const newStreak = recordActivity(state.streak);
    if (state.lastDailyChallengeDate === today) return;
    const newTotal = state.totalXP + xp;
    set({
      totalXP: newTotal,
      level: levelFromXP(newTotal),
      lastDailyChallengeDate: today,
      dailyChallengeStreak: state.dailyChallengeStreak + 1,
      streak: newStreak,
    });
    get().persist();
  },

  advanceTowerFloor: (floor) => {
    const state = get();
    if (floor > state.towerHighestFloor) {
      const achievements = state.achievements.map(a => {
        if (a.id === 'tower_climber' && a.unlockedAt === null && floor >= 10)
          return { ...a, unlockedAt: Date.now() };
        if (a.id === 'tower_master' && a.unlockedAt === null && floor >= 50)
          return { ...a, unlockedAt: Date.now() };
        return a;
      });
      set({ towerHighestFloor: floor, achievements });
      get().persist();
    }
  },

  setUsername: (name) => { set({ username: name }); get().persist(); },

  setAvatarOutfit: (outfit) => { set({ avatarOutfit: outfit }); get().persist(); },

  unlockRegion: (regionId) => {
    const state = get();
    if (!state.unlockedRegions.includes(regionId)) {
      set({ unlockedRegions: [...state.unlockedRegions, regionId] });
      get().persist();
    }
  },

  unlockAchievement: (achievementId) => {
    const state = get();
    const achievements = state.achievements.map(a =>
      a.id === achievementId && a.unlockedAt === null ? { ...a, unlockedAt: Date.now() } : a
    );
    set({ achievements });
    get().persist();
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const mergedSRS = { ...initSRSCards(), ...saved.srsCards };
        set({ ...saved, srsCards: mergedSRS });
      }
    } catch (e) {
      console.warn('Failed to hydrate game state', e);
    }
  },

  persist: async () => {
    try {
      const state = get();
      const { hydrate, persist, ...saveable } = state as any;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saveable));
    } catch (e) {
      console.warn('Failed to persist game state', e);
    }
  },
}));
