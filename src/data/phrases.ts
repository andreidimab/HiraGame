export interface TowerPhrase {
  kana: string;
  romaji: string;
  meaning: string;
  tier: 1 | 2 | 3;  // 1=floors 1-33, 2=floors 34-66, 3=floors 67-100
}

export const TOWER_PHRASES: TowerPhrase[] = [
  // ── Tier 1: floors 1–33 (simple 2–4 kana words) ──────────────────────────
  { kana: 'いぬ',       romaji: 'inu',       meaning: 'dog',          tier: 1 },
  { kana: 'ねこ',       romaji: 'neko',      meaning: 'cat',          tier: 1 },
  { kana: 'さかな',     romaji: 'sakana',    meaning: 'fish',         tier: 1 },
  { kana: 'かわ',       romaji: 'kawa',      meaning: 'river',        tier: 1 },
  { kana: 'そら',       romaji: 'sora',      meaning: 'sky',          tier: 1 },
  { kana: 'やま',       romaji: 'yama',      meaning: 'mountain',     tier: 1 },
  { kana: 'うみ',       romaji: 'umi',       meaning: 'sea',          tier: 1 },
  { kana: 'ほし',       romaji: 'hoshi',     meaning: 'star',         tier: 1 },
  { kana: 'つき',       romaji: 'tsuki',     meaning: 'moon',         tier: 1 },
  { kana: 'はな',       romaji: 'hana',      meaning: 'flower',       tier: 1 },
  { kana: 'とり',       romaji: 'tori',      meaning: 'bird',         tier: 1 },
  { kana: 'かぜ',       romaji: 'kaze',      meaning: 'wind',         tier: 1 },
  { kana: 'ゆき',       romaji: 'yuki',      meaning: 'snow',         tier: 1 },
  { kana: 'あめ',       romaji: 'ame',       meaning: 'rain',         tier: 1 },
  { kana: 'くも',       romaji: 'kumo',      meaning: 'cloud',        tier: 1 },
  { kana: 'まち',       romaji: 'machi',     meaning: 'town',         tier: 1 },
  { kana: 'みち',       romaji: 'michi',     meaning: 'road',         tier: 1 },
  { kana: 'いえ',       romaji: 'ie',        meaning: 'house',        tier: 1 },
  { kana: 'にわ',       romaji: 'niwa',      meaning: 'garden',       tier: 1 },
  { kana: 'てがみ',     romaji: 'tegami',    meaning: 'letter',       tier: 1 },
  { kana: 'ともだち',   romaji: 'tomodachi', meaning: 'friend',       tier: 1 },
  { kana: 'せんせい',   romaji: 'sensei',    meaning: 'teacher',      tier: 1 },
  { kana: 'がくせい',   romaji: 'gakusei',   meaning: 'student',      tier: 1 },
  { kana: 'おかあさん', romaji: 'okaasan',   meaning: 'mother',       tier: 1 },
  { kana: 'おとうさん', romaji: 'otousan',   meaning: 'father',       tier: 1 },
  { kana: 'あした',     romaji: 'ashita',    meaning: 'tomorrow',     tier: 1 },
  { kana: 'きょう',     romaji: 'kyou',      meaning: 'today',        tier: 1 },
  { kana: 'きのう',     romaji: 'kinou',     meaning: 'yesterday',    tier: 1 },

  // ── Tier 2: floors 34–66 (4–6 kana phrases) ──────────────────────────────
  { kana: 'さくらがさく',         romaji: 'sakura ga saku',       meaning: 'cherry blossoms bloom',  tier: 2 },
  { kana: 'そらはあおい',         romaji: 'sora wa aoi',          meaning: 'the sky is blue',         tier: 2 },
  { kana: 'いぬがはしる',         romaji: 'inu ga hashiru',        meaning: 'the dog runs',            tier: 2 },
  { kana: 'ほしがひかる',         romaji: 'hoshi ga hikaru',       meaning: 'stars shine',             tier: 2 },
  { kana: 'かぜがふく',           romaji: 'kaze ga fuku',          meaning: 'wind blows',              tier: 2 },
  { kana: 'みずをのむ',           romaji: 'mizu wo nomu',          meaning: 'drink water',             tier: 2 },
  { kana: 'ほんをよむ',           romaji: 'hon wo yomu',           meaning: 'read a book',             tier: 2 },
  { kana: 'うたをうたう',         romaji: 'uta wo utau',           meaning: 'sing a song',             tier: 2 },
  { kana: 'あるいていく',         romaji: 'aruite iku',            meaning: 'go on foot',              tier: 2 },
  { kana: 'でんしゃにのる',       romaji: 'densha ni noru',        meaning: 'ride the train',          tier: 2 },
  { kana: 'がっこうへいく',       romaji: 'gakkou e iku',          meaning: 'go to school',            tier: 2 },
  { kana: 'ごはんをたべる',       romaji: 'gohan wo taberu',       meaning: 'eat rice/meal',           tier: 2 },
  { kana: 'おちゃをのむ',         romaji: 'ocha wo nomu',          meaning: 'drink tea',               tier: 2 },
  { kana: 'ともだちとあそぶ',     romaji: 'tomodachi to asobu',    meaning: 'play with friends',       tier: 2 },
  { kana: 'にほんごをならう',     romaji: 'nihongo wo narau',      meaning: 'learn Japanese',          tier: 2 },
  { kana: 'すしがすきです',       romaji: 'sushi ga suki desu',    meaning: 'I like sushi',            tier: 2 },
  { kana: 'やまがたかい',         romaji: 'yama ga takai',         meaning: 'the mountain is tall',    tier: 2 },
  { kana: 'うみがひろい',         romaji: 'umi ga hiroi',          meaning: 'the sea is wide',         tier: 2 },
  { kana: 'はるになった',         romaji: 'haru ni natta',         meaning: 'spring has come',         tier: 2 },
  { kana: 'ゆきがふっている',     romaji: 'yuki ga futte iru',     meaning: 'it is snowing',           tier: 2 },

  // ── Tier 3: floors 67–100 (longer phrases) ───────────────────────────────
  { kana: 'まいにちにほんごをべんきょうする',   romaji: 'mainichi nihongo wo benkyou suru',    meaning: 'study Japanese every day',      tier: 3 },
  { kana: 'ともだちとえいがをみにいく',         romaji: 'tomodachi to eiga wo mi ni iku',      meaning: 'go see a movie with friends',   tier: 3 },
  { kana: 'あさはやくおきるのがすきです',       romaji: 'asa hayaku okiru no ga suki desu',    meaning: 'I like waking up early',        tier: 3 },
  { kana: 'にほんのたべものはおいしい',         romaji: 'nihon no tabemono wa oishii',         meaning: 'Japanese food is delicious',    tier: 3 },
  { kana: 'そとでおんがくをきく',               romaji: 'soto de ongaku wo kiku',              meaning: 'listen to music outside',       tier: 3 },
  { kana: 'としょかんでほんをかりる',           romaji: 'toshokan de hon wo kariru',           meaning: 'borrow books from the library', tier: 3 },
  { kana: 'はるにさくらをみるのがすき',         romaji: 'haru ni sakura wo miru no ga suki',   meaning: 'like watching cherry blossoms in spring', tier: 3 },
  { kana: 'あのひとはにほんごがじょうず',       romaji: 'ano hito wa nihongo ga jouzu',        meaning: 'that person is good at Japanese', tier: 3 },
  { kana: 'しんかんせんではやくりょこうする',   romaji: 'shinkansen de hayaku ryokou suru',    meaning: 'travel fast on the bullet train', tier: 3 },
  { kana: 'まいばんほしをみてかんがえる',       romaji: 'maiban hoshi wo mite kangaeru',       meaning: 'think while looking at stars every night', tier: 3 },
  { kana: 'むかしむかしおひめさまがいました',   romaji: 'mukashi mukashi ohimesama ga imashita', meaning: 'once upon a time there was a princess', tier: 3 },
  { kana: 'このしろはむかしゆうめいでした',     romaji: 'kono shiro wa mukashi yuumei deshita', meaning: 'this castle was famous long ago', tier: 3 },
  { kana: 'かぜがつよくてそらがくもっている',   romaji: 'kaze ga tsuyokute sora ga kumotte iru', meaning: 'the wind is strong and the sky is cloudy', tier: 3 },
  { kana: 'にほんにいってみたいとおもいます',   romaji: 'nihon ni itte mitai to omoimasu',      meaning: 'I want to try going to Japan',  tier: 3 },
  { kana: 'おんがくをきくとげんきになる',       romaji: 'ongaku wo kiku to genki ni naru',     meaning: 'listening to music cheers me up', tier: 3 },
];

export function getPhrasesForFloor(floor: number): TowerPhrase[] {
  if (floor <= 33) return TOWER_PHRASES.filter(p => p.tier === 1);
  if (floor <= 66) return TOWER_PHRASES.filter(p => p.tier <= 2);
  return TOWER_PHRASES;
}

export const TOWER_BOSSES = [
  { name: 'Stone Oni',      kana: 'オニ',         emoji: '👹', floorRange: [1, 10]   },
  { name: 'River Kappa',    kana: 'カッパ',       emoji: '🐢', floorRange: [11, 20]  },
  { name: 'Wind Tengu',     kana: 'テング',       emoji: '👺', floorRange: [21, 30]  },
  { name: 'Sea Ryuu',       kana: 'りゅう',       emoji: '🐉', floorRange: [31, 40]  },
  { name: 'Moon Kitsune',   kana: 'キツネ',       emoji: '🦊', floorRange: [41, 50]  },
  { name: 'Thunder Raijin', kana: 'ライジン',     emoji: '⚡', floorRange: [51, 60]  },
  { name: 'Fire Fūjin',     kana: 'フウジン',     emoji: '🔥', floorRange: [61, 70]  },
  { name: 'Shadow Tanuki',  kana: 'タヌキ',       emoji: '🦝', floorRange: [71, 80]  },
  { name: 'Ice Yuki-onna',  kana: 'ゆきおんな',   emoji: '❄️', floorRange: [81, 90]  },
  { name: 'Void Shogun',    kana: 'ショウグン',   emoji: '⚔️', floorRange: [91, 100] },
];

export function getBossForFloor(floor: number) {
  return TOWER_BOSSES.find(b => floor >= b.floorRange[0] && floor <= b.floorRange[1])
    ?? TOWER_BOSSES[TOWER_BOSSES.length - 1];
}
