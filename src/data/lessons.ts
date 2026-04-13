import { HIRAGANA } from './hiragana';
import { KATAKANA } from './katakana';
import { HIRAGANA_YOON, KATAKANA_YOON } from './combinations';

export type LessonType = 'flashcard' | 'quiz' | 'minigame';
export type RegionId = 'hiragana' | 'katakana' | 'intermediate';

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  region: RegionId;
  group: string;
  type: LessonType;
  cardIds: string[];
  xpReward: number;
  order: number;
}

export interface Region {
  id: RegionId;
  name: string;
  description: string;
  color: string;
  emoji: string;
  lessons: Lesson[];
  unlocked: boolean;
}

const hiraganaGroups = [
  { group: 'vowels',      title: 'Vowels',              subtitle: 'あいうえお' },
  { group: 'k-row',       title: 'K Row',               subtitle: 'かきくけこ' },
  { group: 's-row',       title: 'S Row',               subtitle: 'さしすせそ' },
  { group: 't-row',       title: 'T Row',               subtitle: 'たちつてと' },
  { group: 'n-row',       title: 'N Row',               subtitle: 'なにぬねの' },
  { group: 'h-row',       title: 'H Row',               subtitle: 'はひふへほ' },
  { group: 'm-row',       title: 'M Row',               subtitle: 'まみむめも' },
  { group: 'y-row',       title: 'Y Row',               subtitle: 'やゆよ' },
  { group: 'r-row',       title: 'R Row',               subtitle: 'らりるれろ' },
  { group: 'w-row',       title: 'W Row + N',           subtitle: 'わをん' },
  { group: 'voiced-k',    title: 'Voiced K (が行)',     subtitle: 'がぎぐげご' },
  { group: 'voiced-s',    title: 'Voiced S (ざ行)',     subtitle: 'ざじずぜぞ' },
  { group: 'voiced-t',    title: 'Voiced T (だ行)',     subtitle: 'だぢづでど' },
  { group: 'voiced-h',    title: 'Voiced H (ば行)',     subtitle: 'ばびぶべぼ' },
  { group: 'semi-voiced', title: 'Semi-voiced (ぱ行)',  subtitle: 'ぱぴぷぺぽ' },
];

const katakanaGroups = [
  { group: 'vowels',      title: 'Vowels',              subtitle: 'アイウエオ' },
  { group: 'k-row',       title: 'K Row',               subtitle: 'カキクケコ' },
  { group: 's-row',       title: 'S Row',               subtitle: 'サシスセソ' },
  { group: 't-row',       title: 'T Row',               subtitle: 'タチツテト' },
  { group: 'n-row',       title: 'N Row',               subtitle: 'ナニヌネノ' },
  { group: 'h-row',       title: 'H Row',               subtitle: 'ハヒフヘホ' },
  { group: 'm-row',       title: 'M Row',               subtitle: 'マミムメモ' },
  { group: 'y-row',       title: 'Y Row',               subtitle: 'ヤユヨ' },
  { group: 'r-row',       title: 'R Row',               subtitle: 'ラリルレロ' },
  { group: 'w-row',       title: 'W Row + N',           subtitle: 'ワヲン' },
  { group: 'voiced-k',    title: 'Voiced K (ガ行)',     subtitle: 'ガギグゲゴ' },
  { group: 'voiced-s',    title: 'Voiced S (ザ行)',     subtitle: 'ザジズゼゾ' },
  { group: 'voiced-t',    title: 'Voiced T (ダ行)',     subtitle: 'ダデド' },
  { group: 'voiced-h',    title: 'Voiced H (バ行)',     subtitle: 'バビブベボ' },
  { group: 'semi-voiced', title: 'Semi-voiced (パ行)',  subtitle: 'パピプペポ' },
];

const intermediateGroups = [
  { group: 'yoon_k', title: 'KY Combos',  subtitle: 'きゃ きゅ きょ / キャ キュ キョ' },
  { group: 'yoon_s', title: 'SH Combos',  subtitle: 'しゃ しゅ しょ / シャ シュ ショ' },
  { group: 'yoon_t', title: 'CH Combos',  subtitle: 'ちゃ ちゅ ちょ / チャ チュ チョ' },
  { group: 'yoon_n', title: 'NY Combos',  subtitle: 'にゃ にゅ にょ / ニャ ニュ ニョ' },
  { group: 'yoon_h', title: 'HY Combos',  subtitle: 'ひゃ ひゅ ひょ / ヒャ ヒュ ヒョ' },
  { group: 'yoon_m', title: 'MY Combos',  subtitle: 'みゃ みゅ みょ / ミャ ミュ ミョ' },
  { group: 'yoon_r', title: 'RY Combos',  subtitle: 'りゃ りゅ りょ / リャ リュ リョ' },
  { group: 'yoon_g', title: 'GY Combos',  subtitle: 'ぎゃ ぎゅ ぎょ / ギャ ギュ ギョ' },
  { group: 'yoon_j', title: 'J Combos',   subtitle: 'じゃ じゅ じょ / ジャ ジュ ジョ' },
  { group: 'yoon_b', title: 'BY Combos',  subtitle: 'びゃ びゅ びょ / ビャ ビュ ビョ' },
  { group: 'yoon_p', title: 'PY Combos',  subtitle: 'ぴゃ ぴゅ ぴょ / ピャ ピュ ピョ' },
];

const ALL_COMBINATIONS = [...HIRAGANA_YOON, ...KATAKANA_YOON];

function buildLessons(
  groups: { group: string; title: string; subtitle: string }[],
  allCards: typeof HIRAGANA,
  region: RegionId
): Lesson[] {
  const lessons: Lesson[] = [];
  let order = 0;

  for (const { group, title, subtitle } of groups) {
    const cards = allCards.filter(c => c.group === group);
    if (cards.length === 0) continue;

    lessons.push({
      id: `${region}_${group}_flash`,
      title,
      subtitle,
      region,
      group,
      type: 'flashcard',
      cardIds: cards.map(c => c.id),
      xpReward: 100,
      order: order++,
    });

    lessons.push({
      id: `${region}_${group}_quiz`,
      title: `${title} Quiz`,
      subtitle,
      region,
      group,
      type: 'quiz',
      cardIds: cards.map(c => c.id),
      xpReward: 150,
      order: order++,
    });
  }

  return lessons;
}

export const REGIONS: Region[] = [
  {
    id: 'hiragana',
    name: 'Hiragana Village',
    description: 'Master all 46+ hiragana characters, the foundation of Japanese writing.',
    color: '#4FC3F7',
    emoji: '🌸',
    lessons: buildLessons(hiraganaGroups, HIRAGANA, 'hiragana'),
    unlocked: true,
  },
  {
    id: 'katakana',
    name: 'Katakana Port',
    description: 'Learn katakana — used for loanwords and foreign names.',
    color: '#81C784',
    emoji: '⚓',
    lessons: buildLessons(katakanaGroups, KATAKANA, 'katakana'),
    unlocked: false,
  },
  {
    id: 'intermediate',
    name: 'Combination Dojo',
    description: 'Master yōon — combination sounds like sha, chu, ryo and more.',
    color: '#FF7043',
    emoji: '🥋',
    lessons: buildLessons(intermediateGroups, ALL_COMBINATIONS as typeof HIRAGANA, 'intermediate'),
    unlocked: false,
  },
];

export function getAllCards() {
  return [...HIRAGANA, ...KATAKANA, ...ALL_COMBINATIONS];
}

export function getCardById(id: string) {
  return getAllCards().find(c => c.id === id);
}

export function getLessonById(id: string): Lesson | undefined {
  for (const region of REGIONS) {
    const lesson = region.lessons.find(l => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getRegionById(id: RegionId): Region | undefined {
  return REGIONS.find(r => r.id === id);
}
