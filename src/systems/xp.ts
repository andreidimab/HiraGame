export const XP_TABLE = {
  flashcardCorrect: 10,
  quizCorrect: 10,
  quizCorrectListening: 15,
  quizCorrectSentence: 20,
  miniGameSession: 40,
  dailyChallenge: 150,
  hardDailyChallenge: 250,
  perfectQuiz: 50,
  streak7Days: 500,
  lessonFirstComplete: 100,
  towerFloorWin: (floor: number) => 50 + floor * 5,
};

const MAX_LEVEL = 50;

// Quadratic XP curve: level n requires 100 * n * (n+1) / 2 total XP
export function xpForLevel(level: number): number {
  return Math.floor(100 * level * (level + 1) / 2);
}

export function levelFromXP(totalXP: number): number {
  let level = 1;
  while (level < MAX_LEVEL && xpForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

export function xpToNextLevel(totalXP: number): { current: number; required: number; level: number } {
  const level = levelFromXP(totalXP);
  if (level >= MAX_LEVEL) {
    return { current: 0, required: 0, level: MAX_LEVEL };
  }
  const levelStart = xpForLevel(level);
  const levelEnd = xpForLevel(level + 1);
  return {
    current: totalXP - levelStart,
    required: levelEnd - levelStart,
    level,
  };
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    // Beginner tier (1–5)
    1:  'Beginner',
    2:  'Hiragana Student',
    3:  'Kana Learner',
    4:  'Word Seeker',
    5:  'Kana Adept',
    // Intermediate tier (6–10)
    6:  'Script Reader',
    7:  'Vocabulary Builder',
    8:  'Phrase Crafter',
    9:  'Sentence Maker',
    10: 'N5 Scholar',
    // Advanced tier (11–20)
    11: 'Kanji Initiate',
    12: 'Grammar Student',
    13: 'Conversation Starter',
    14: 'Text Reader',
    15: 'N4 Scholar',
    16: 'Advanced Learner',
    17: 'Fluency Seeker',
    18: 'Near-Fluent',
    19: 'N3 Scholar',
    20: 'Kana Master',
    // Expert tier (21–30)
    21: 'Expert Learner',
    22: 'Tower Climber',
    23: 'Kanji Warrior',
    24: 'Grammar Adept',
    25: 'N2 Challenger',
    26: 'Fluency Forger',
    27: 'Keigo Student',
    28: 'Script Expert',
    29: 'Near-N2',
    30: 'N2 Scholar',
    // Sensei tier (31–40)
    31: 'Rising Sensei',
    32: 'Dojo Master',
    33: 'Language Veteran',
    34: 'Tower Warrior',
    35: 'N1 Challenger',
    36: 'Fluent Speaker',
    37: 'Literature Reader',
    38: 'Culture Scholar',
    39: 'Near-N1',
    40: 'N1 Scholar',
    // Grand Master tier (41–50)
    41: 'Grand Adept',
    42: 'Tower Legend',
    43: 'Kana Shogun',
    44: 'Script Sovereign',
    45: 'Language Artisan',
    46: 'Elite Scholar',
    47: 'Supreme Learner',
    48: 'Near-Grand Master',
    49: 'Language Master',
    50: 'Grand Master',
  };
  return titles[level] ?? 'Scholar';
}

export function getLevelColor(level: number): string {
  if (level <= 5)  return '#78909C';   // Gray    — Beginner
  if (level <= 10) return '#4FC3F7';   // Blue    — Intermediate
  if (level <= 20) return '#81C784';   // Green   — Advanced
  if (level <= 30) return '#FFB74D';   // Orange  — Expert
  if (level <= 40) return '#CE93D8';   // Purple  — Sensei
  if (level <= 49) return '#EF5350';   // Red     — Grand Adept
  return '#FFD700';                     // Gold    — Grand Master
}
