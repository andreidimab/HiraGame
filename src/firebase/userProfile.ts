import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, isFirebaseConfigured } from './config';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  provider: string;
  createdAt?: any;
  lastLoginAt?: any;
  // Game data snapshot (for leaderboard display)
  totalXP: number;
  weeklyXP: number;
  streak: number;
  level: number;
  avatarOutfit: string;
}

export async function syncUserToFirestore(user: User): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);

  const provider = user.providerData[0]?.providerId ?? 'email';

  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName: user.displayName ?? 'Player',
      email: user.email,
      photoURL: user.photoURL,
      provider,
      lastLoginAt: serverTimestamp(),
      // Only set createdAt on first creation
      ...(!existing.exists() && { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
}

export async function updateUserGameStats(
  uid: string,
  stats: {
    totalXP: number;
    weeklyXP: number;
    streak: number;
    level: number;
    avatarOutfit: string;
    username: string;
  }
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  try {
    await setDoc(
      doc(db, 'users', uid),
      { ...stats, lastUpdated: serverTimestamp() },
      { merge: true }
    );

    // Also update weekly leaderboard
    await setDoc(
      doc(db, 'weeklyLeaderboard', uid),
      {
        username: stats.username,
        weeklyXP: stats.weeklyXP,
        avatarOutfit: stats.avatarOutfit,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('Failed to update user game stats', e);
  }
}
