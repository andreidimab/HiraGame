export interface StreakState {
  current: number;
  longest: number;
  lastActivityDate: string | null; // YYYY-MM-DD
  shieldsAvailable: number;
  lastShieldAwardedWeek: string | null; // ISO week string
  shieldUsedToday: boolean;
}

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isoWeekString(): string {
  const d = new Date();
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function createInitialStreak(): StreakState {
  return {
    current: 0,
    longest: 0,
    lastActivityDate: null,
    shieldsAvailable: 1,
    lastShieldAwardedWeek: null,
    shieldUsedToday: false,
  };
}

export function recordActivity(state: StreakState): StreakState {
  const today = todayString();
  const currentWeek = isoWeekString();

  if (state.lastActivityDate === today) {
    // Already logged today — just award weekly shield if needed
    return awardWeeklyShieldIfNeeded(state, currentWeek);
  }

  let newStreak = state.current;

  if (state.lastActivityDate === null) {
    newStreak = 1;
  } else {
    const lastDate = new Date(state.lastActivityDate);
    const todayDate = new Date(today);
    const daysDiff = Math.round((todayDate.getTime() - lastDate.getTime()) / 86400000);

    if (daysDiff === 1) {
      // Consecutive day
      newStreak = state.current + 1;
    } else if (daysDiff === 2 && state.shieldsAvailable > 0) {
      // Missed one day — use shield
      newStreak = state.current + 1;
      return awardWeeklyShieldIfNeeded({
        ...state,
        current: newStreak,
        longest: Math.max(newStreak, state.longest),
        lastActivityDate: today,
        shieldsAvailable: state.shieldsAvailable - 1,
        shieldUsedToday: true,
      }, currentWeek);
    } else {
      // Streak broken
      newStreak = 1;
    }
  }

  const updated: StreakState = {
    ...state,
    current: newStreak,
    longest: Math.max(newStreak, state.longest),
    lastActivityDate: today,
    shieldUsedToday: false,
  };

  return awardWeeklyShieldIfNeeded(updated, currentWeek);
}

function awardWeeklyShieldIfNeeded(state: StreakState, currentWeek: string): StreakState {
  if (state.lastShieldAwardedWeek !== currentWeek) {
    return {
      ...state,
      shieldsAvailable: state.shieldsAvailable + 1,
      lastShieldAwardedWeek: currentWeek,
    };
  }
  return state;
}

export function getStreakMilestone(streak: number): string | null {
  const milestones: Record<number, string> = {
    7: 'Week Warrior — 7-day streak!',
    30: 'Monthly Mastery — 30-day streak!',
    100: 'Century Streak — 100 days!',
  };
  return milestones[streak] ?? null;
}
