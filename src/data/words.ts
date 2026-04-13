export interface KanaWord {
  id: string;
  kana: string;       // kana spelling
  romaji: string;     // full romaji reading
  meaning: string;    // English meaning
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const KANA_WORDS: KanaWord[] = [
  // ── Beginner (2 kana) ────────────────────────────────────────────────────
  { id: 'w_inu',    kana: 'いぬ',     romaji: 'inu',     meaning: 'dog',       difficulty: 'beginner' },
  { id: 'w_neko',   kana: 'ねこ',     romaji: 'neko',    meaning: 'cat',       difficulty: 'beginner' },
  { id: 'w_kani',   kana: 'かに',     romaji: 'kani',    meaning: 'crab',      difficulty: 'beginner' },
  { id: 'w_hana',   kana: 'はな',     romaji: 'hana',    meaning: 'flower',    difficulty: 'beginner' },
  { id: 'w_mimi',   kana: 'みみ',     romaji: 'mimi',    meaning: 'ear',       difficulty: 'beginner' },
  { id: 'w_me',     kana: 'め',       romaji: 'me',      meaning: 'eye',       difficulty: 'beginner' },
  { id: 'w_ki',     kana: 'き',       romaji: 'ki',      meaning: 'tree',      difficulty: 'beginner' },
  { id: 'w_hi',     kana: 'ひ',       romaji: 'hi',      meaning: 'fire',      difficulty: 'beginner' },
  { id: 'w_te',     kana: 'て',       romaji: 'te',      meaning: 'hand',      difficulty: 'beginner' },
  { id: 'w_ha',     kana: 'は',       romaji: 'ha',      meaning: 'leaf',      difficulty: 'beginner' },
  { id: 'w_ao',     kana: 'あお',     romaji: 'ao',      meaning: 'blue',      difficulty: 'beginner' },
  { id: 'w_aka',    kana: 'あか',     romaji: 'aka',     meaning: 'red',       difficulty: 'beginner' },
  { id: 'w_uma',    kana: 'うま',     romaji: 'uma',     meaning: 'horse',     difficulty: 'beginner' },
  { id: 'w_umi',    kana: 'うみ',     romaji: 'umi',     meaning: 'sea',       difficulty: 'beginner' },
  { id: 'w_yama',   kana: 'やま',     romaji: 'yama',    meaning: 'mountain',  difficulty: 'beginner' },
  { id: 'w_kawa',   kana: 'かわ',     romaji: 'kawa',    meaning: 'river',     difficulty: 'beginner' },
  { id: 'w_sora',   kana: 'そら',     romaji: 'sora',    meaning: 'sky',       difficulty: 'beginner' },
  { id: 'w_tori',   kana: 'とり',     romaji: 'tori',    meaning: 'bird',      difficulty: 'beginner' },
  { id: 'w_mori',   kana: 'もり',     romaji: 'mori',    meaning: 'forest',    difficulty: 'beginner' },
  { id: 'w_hoshi',  kana: 'ほし',     romaji: 'hoshi',   meaning: 'star',      difficulty: 'beginner' },

  // ── Intermediate (3–4 kana) ───────────────────────────────────────────────
  { id: 'w_sakura',  kana: 'さくら',   romaji: 'sakura',  meaning: 'cherry blossom', difficulty: 'intermediate' },
  { id: 'w_tokei',   kana: 'とけい',   romaji: 'tokei',   meaning: 'clock',     difficulty: 'intermediate' },
  { id: 'w_kuruma',  kana: 'くるま',   romaji: 'kuruma',  meaning: 'car',       difficulty: 'intermediate' },
  { id: 'w_taberu',  kana: 'たべる',   romaji: 'taberu',  meaning: 'to eat',    difficulty: 'intermediate' },
  { id: 'w_nomu',    kana: 'のむ',     romaji: 'nomu',    meaning: 'to drink',  difficulty: 'intermediate' },
  { id: 'w_miru',    kana: 'みる',     romaji: 'miru',    meaning: 'to see',    difficulty: 'intermediate' },
  { id: 'w_kiku',    kana: 'きく',     romaji: 'kiku',    meaning: 'to listen', difficulty: 'intermediate' },
  { id: 'w_hanasu',  kana: 'はなす',   romaji: 'hanasu',  meaning: 'to speak',  difficulty: 'intermediate' },
  { id: 'w_aruku',   kana: 'あるく',   romaji: 'aruku',   meaning: 'to walk',   difficulty: 'intermediate' },
  { id: 'w_hashiru', kana: 'はしる',   romaji: 'hashiru', meaning: 'to run',    difficulty: 'intermediate' },
  { id: 'w_nemuru',  kana: 'ねむる',   romaji: 'nemuru',  meaning: 'to sleep',  difficulty: 'intermediate' },
  { id: 'w_yomu',    kana: 'よむ',     romaji: 'yomu',    meaning: 'to read',   difficulty: 'intermediate' },
  { id: 'w_kaku',    kana: 'かく',     romaji: 'kaku',    meaning: 'to write',  difficulty: 'intermediate' },
  { id: 'w_matsu',   kana: 'まつ',     romaji: 'matsu',   meaning: 'to wait',   difficulty: 'intermediate' },
  { id: 'w_kuru',    kana: 'くる',     romaji: 'kuru',    meaning: 'to come',   difficulty: 'intermediate' },
  { id: 'w_iku',     kana: 'いく',     romaji: 'iku',     meaning: 'to go',     difficulty: 'intermediate' },
  { id: 'w_tsuki',   kana: 'つき',     romaji: 'tsuki',   meaning: 'moon',      difficulty: 'intermediate' },
  { id: 'w_kaze',    kana: 'かぜ',     romaji: 'kaze',    meaning: 'wind',      difficulty: 'intermediate' },
  { id: 'w_yuki',    kana: 'ゆき',     romaji: 'yuki',    meaning: 'snow',      difficulty: 'intermediate' },
  { id: 'w_ame',     kana: 'あめ',     romaji: 'ame',     meaning: 'rain',      difficulty: 'intermediate' },

  // ── Advanced (4+ kana) ────────────────────────────────────────────────────
  { id: 'w_hikoki',    kana: 'ひこうき',   romaji: 'hikouki',   meaning: 'airplane',     difficulty: 'advanced' },
  { id: 'w_densha',    kana: 'でんしゃ',   romaji: 'densha',    meaning: 'train',        difficulty: 'advanced' },
  { id: 'w_toshokan',  kana: 'としょかん', romaji: 'toshokan',  meaning: 'library',      difficulty: 'advanced' },
  { id: 'w_byouin',    kana: 'びょういん', romaji: 'byouin',    meaning: 'hospital',     difficulty: 'advanced' },
  { id: 'w_gakkou',    kana: 'がっこう',   romaji: 'gakkou',    meaning: 'school',       difficulty: 'advanced' },
  { id: 'w_resutoran', kana: 'レストラン', romaji: 'resutoran', meaning: 'restaurant',   difficulty: 'advanced' },
  { id: 'w_terebi',    kana: 'テレビ',     romaji: 'terebi',    meaning: 'television',   difficulty: 'advanced' },
  { id: 'w_suupaa',    kana: 'スーパー',   romaji: 'suupaa',    meaning: 'supermarket',  difficulty: 'advanced' },
  { id: 'w_konpyuta',  kana: 'コンピュータ', romaji: 'konpyuuta', meaning: 'computer',  difficulty: 'advanced' },
  { id: 'w_kamera',    kana: 'カメラ',     romaji: 'kamera',    meaning: 'camera',       difficulty: 'advanced' },
  { id: 'w_chokoreto', kana: 'チョコレート', romaji: 'chokoreeto', meaning: 'chocolate', difficulty: 'advanced' },
  { id: 'w_rajio',     kana: 'ラジオ',     romaji: 'rajio',     meaning: 'radio',        difficulty: 'advanced' },
  { id: 'w_basuketo',  kana: 'バスケット', romaji: 'basuketto', meaning: 'basketball',   difficulty: 'advanced' },
  { id: 'w_piano',     kana: 'ピアノ',     romaji: 'piano',     meaning: 'piano',        difficulty: 'advanced' },
  { id: 'w_gitaa',     kana: 'ギター',     romaji: 'gitaa',     meaning: 'guitar',       difficulty: 'advanced' },
];

export const BEGINNER_WORDS  = KANA_WORDS.filter(w => w.difficulty === 'beginner');
export const INTERMEDIATE_WORDS = KANA_WORDS.filter(w => w.difficulty === 'intermediate');
export const ADVANCED_WORDS  = KANA_WORDS.filter(w => w.difficulty === 'advanced');
