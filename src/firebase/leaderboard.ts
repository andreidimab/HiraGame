import {
  collection, query, orderBy, limit, getDocs, setDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  weeklyXP: number;
  avatarOutfit: string;
  updatedAt?: any;
}

// Mock data for when Firebase is not configured
const MOCK_ENTRIES: LeaderboardEntry[] = [
  { userId: 'user1', username: 'SakuraNinja', weeklyXP: 4200, avatarOutfit: 'ninja' },
  { userId: 'user2', username: 'TokyoDreamer', weeklyXP: 3800, avatarOutfit: 'tokyo_modern' },
  { userId: 'user3', username: 'KanaKing', weeklyXP: 3100, avatarOutfit: 'samurai' },
  { userId: 'user4', username: 'HiraganaHero', weeklyXP: 2750, avatarOutfit: 'school_uniform' },
  { userId: 'user5', username: 'MaikoSan', weeklyXP: 2400, avatarOutfit: 'shrine_maiden' },
  { userId: 'user6', username: 'KatakanaKid', weeklyXP: 2100, avatarOutfit: 'ninja' },
  { userId: 'user7', username: 'OsakaOtaku', weeklyXP: 1900, avatarOutfit: 'samurai' },
  { userId: 'user8', username: 'FujiSan', weeklyXP: 1650, avatarOutfit: 'tokyo_modern' },
  { userId: 'user9', username: 'NihongoNovice', weeklyXP: 1200, avatarOutfit: 'school_uniform' },
  { userId: 'user10', username: 'KaijuKun', weeklyXP: 980, avatarOutfit: 'ninja' },
];

export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!isFirebaseConfigured()) {
    return MOCK_ENTRIES;
  }

  try {
    const q = query(
      collection(db, 'weeklyLeaderboard'),
      orderBy('weeklyXP', 'desc'),
      limit(100)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ userId: d.id, ...d.data() } as LeaderboardEntry));
  } catch (e) {
    console.warn('Failed to fetch leaderboard', e);
    return MOCK_ENTRIES;
  }
}

export async function submitWeeklyXP(
  userId: string,
  username: string,
  weeklyXP: number,
  avatarOutfit: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  try {
    await setDoc(doc(db, 'weeklyLeaderboard', userId), {
      username,
      weeklyXP,
      avatarOutfit,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Failed to submit leaderboard entry', e);
  }
}
