import { KanaCard } from './hiragana';

// Yōon (拗音) — combination kana formed by pairing an i-row kana with small ya/yu/yo
// Hiragana yōon
export const HIRAGANA_YOON: KanaCard[] = [
  // ki + ya/yu/yo
  { id: 'h_kya', kana: 'きゃ', romaji: 'kya', group: 'yoon_k', region: 'hiragana' },
  { id: 'h_kyu', kana: 'きゅ', romaji: 'kyu', group: 'yoon_k', region: 'hiragana' },
  { id: 'h_kyo', kana: 'きょ', romaji: 'kyo', group: 'yoon_k', region: 'hiragana' },
  // shi + ya/yu/yo
  { id: 'h_sha', kana: 'しゃ', romaji: 'sha', group: 'yoon_s', region: 'hiragana' },
  { id: 'h_shu', kana: 'しゅ', romaji: 'shu', group: 'yoon_s', region: 'hiragana' },
  { id: 'h_sho', kana: 'しょ', romaji: 'sho', group: 'yoon_s', region: 'hiragana' },
  // chi + ya/yu/yo
  { id: 'h_cha', kana: 'ちゃ', romaji: 'cha', group: 'yoon_t', region: 'hiragana' },
  { id: 'h_chu', kana: 'ちゅ', romaji: 'chu', group: 'yoon_t', region: 'hiragana' },
  { id: 'h_cho', kana: 'ちょ', romaji: 'cho', group: 'yoon_t', region: 'hiragana' },
  // ni + ya/yu/yo
  { id: 'h_nya', kana: 'にゃ', romaji: 'nya', group: 'yoon_n', region: 'hiragana' },
  { id: 'h_nyu', kana: 'にゅ', romaji: 'nyu', group: 'yoon_n', region: 'hiragana' },
  { id: 'h_nyo', kana: 'にょ', romaji: 'nyo', group: 'yoon_n', region: 'hiragana' },
  // hi + ya/yu/yo
  { id: 'h_hya', kana: 'ひゃ', romaji: 'hya', group: 'yoon_h', region: 'hiragana' },
  { id: 'h_hyu', kana: 'ひゅ', romaji: 'hyu', group: 'yoon_h', region: 'hiragana' },
  { id: 'h_hyo', kana: 'ひょ', romaji: 'hyo', group: 'yoon_h', region: 'hiragana' },
  // mi + ya/yu/yo
  { id: 'h_mya', kana: 'みゃ', romaji: 'mya', group: 'yoon_m', region: 'hiragana' },
  { id: 'h_myu', kana: 'みゅ', romaji: 'myu', group: 'yoon_m', region: 'hiragana' },
  { id: 'h_myo', kana: 'みょ', romaji: 'myo', group: 'yoon_m', region: 'hiragana' },
  // ri + ya/yu/yo
  { id: 'h_rya', kana: 'りゃ', romaji: 'rya', group: 'yoon_r', region: 'hiragana' },
  { id: 'h_ryu', kana: 'りゅ', romaji: 'ryu', group: 'yoon_r', region: 'hiragana' },
  { id: 'h_ryo', kana: 'りょ', romaji: 'ryo', group: 'yoon_r', region: 'hiragana' },
  // gi + ya/yu/yo (voiced)
  { id: 'h_gya', kana: 'ぎゃ', romaji: 'gya', group: 'yoon_g', region: 'hiragana' },
  { id: 'h_gyu', kana: 'ぎゅ', romaji: 'gyu', group: 'yoon_g', region: 'hiragana' },
  { id: 'h_gyo', kana: 'ぎょ', romaji: 'gyo', group: 'yoon_g', region: 'hiragana' },
  // ji + ya/yu/yo
  { id: 'h_ja',  kana: 'じゃ', romaji: 'ja',  group: 'yoon_j', region: 'hiragana' },
  { id: 'h_ju',  kana: 'じゅ', romaji: 'ju',  group: 'yoon_j', region: 'hiragana' },
  { id: 'h_jo',  kana: 'じょ', romaji: 'jo',  group: 'yoon_j', region: 'hiragana' },
  // bi + ya/yu/yo
  { id: 'h_bya', kana: 'びゃ', romaji: 'bya', group: 'yoon_b', region: 'hiragana' },
  { id: 'h_byu', kana: 'びゅ', romaji: 'byu', group: 'yoon_b', region: 'hiragana' },
  { id: 'h_byo', kana: 'びょ', romaji: 'byo', group: 'yoon_b', region: 'hiragana' },
  // pi + ya/yu/yo (semi-voiced)
  { id: 'h_pya', kana: 'ぴゃ', romaji: 'pya', group: 'yoon_p', region: 'hiragana' },
  { id: 'h_pyu', kana: 'ぴゅ', romaji: 'pyu', group: 'yoon_p', region: 'hiragana' },
  { id: 'h_pyo', kana: 'ぴょ', romaji: 'pyo', group: 'yoon_p', region: 'hiragana' },
];

// Katakana yōon
export const KATAKANA_YOON: KanaCard[] = [
  { id: 'k_kya', kana: 'キャ', romaji: 'kya', group: 'yoon_k', region: 'katakana' },
  { id: 'k_kyu', kana: 'キュ', romaji: 'kyu', group: 'yoon_k', region: 'katakana' },
  { id: 'k_kyo', kana: 'キョ', romaji: 'kyo', group: 'yoon_k', region: 'katakana' },
  { id: 'k_sha', kana: 'シャ', romaji: 'sha', group: 'yoon_s', region: 'katakana' },
  { id: 'k_shu', kana: 'シュ', romaji: 'shu', group: 'yoon_s', region: 'katakana' },
  { id: 'k_sho', kana: 'ショ', romaji: 'sho', group: 'yoon_s', region: 'katakana' },
  { id: 'k_cha', kana: 'チャ', romaji: 'cha', group: 'yoon_t', region: 'katakana' },
  { id: 'k_chu', kana: 'チュ', romaji: 'chu', group: 'yoon_t', region: 'katakana' },
  { id: 'k_cho', kana: 'チョ', romaji: 'cho', group: 'yoon_t', region: 'katakana' },
  { id: 'k_nya', kana: 'ニャ', romaji: 'nya', group: 'yoon_n', region: 'katakana' },
  { id: 'k_nyu', kana: 'ニュ', romaji: 'nyu', group: 'yoon_n', region: 'katakana' },
  { id: 'k_nyo', kana: 'ニョ', romaji: 'nyo', group: 'yoon_n', region: 'katakana' },
  { id: 'k_hya', kana: 'ヒャ', romaji: 'hya', group: 'yoon_h', region: 'katakana' },
  { id: 'k_hyu', kana: 'ヒュ', romaji: 'hyu', group: 'yoon_h', region: 'katakana' },
  { id: 'k_hyo', kana: 'ヒョ', romaji: 'hyo', group: 'yoon_h', region: 'katakana' },
  { id: 'k_mya', kana: 'ミャ', romaji: 'mya', group: 'yoon_m', region: 'katakana' },
  { id: 'k_myu', kana: 'ミュ', romaji: 'myu', group: 'yoon_m', region: 'katakana' },
  { id: 'k_myo', kana: 'ミョ', romaji: 'myo', group: 'yoon_m', region: 'katakana' },
  { id: 'k_rya', kana: 'リャ', romaji: 'rya', group: 'yoon_r', region: 'katakana' },
  { id: 'k_ryu', kana: 'リュ', romaji: 'ryu', group: 'yoon_r', region: 'katakana' },
  { id: 'k_ryo', kana: 'リョ', romaji: 'ryo', group: 'yoon_r', region: 'katakana' },
  { id: 'k_gya', kana: 'ギャ', romaji: 'gya', group: 'yoon_g', region: 'katakana' },
  { id: 'k_gyu', kana: 'ギュ', romaji: 'gyu', group: 'yoon_g', region: 'katakana' },
  { id: 'k_gyo', kana: 'ギョ', romaji: 'gyo', group: 'yoon_g', region: 'katakana' },
  { id: 'k_ja',  kana: 'ジャ', romaji: 'ja',  group: 'yoon_j', region: 'katakana' },
  { id: 'k_ju',  kana: 'ジュ', romaji: 'ju',  group: 'yoon_j', region: 'katakana' },
  { id: 'k_jo',  kana: 'ジョ', romaji: 'jo',  group: 'yoon_j', region: 'katakana' },
  { id: 'k_bya', kana: 'ビャ', romaji: 'bya', group: 'yoon_b', region: 'katakana' },
  { id: 'k_byu', kana: 'ビュ', romaji: 'byu', group: 'yoon_b', region: 'katakana' },
  { id: 'k_byo', kana: 'ビョ', romaji: 'byo', group: 'yoon_b', region: 'katakana' },
  { id: 'k_pya', kana: 'ピャ', romaji: 'pya', group: 'yoon_p', region: 'katakana' },
  { id: 'k_pyu', kana: 'ピュ', romaji: 'pyu', group: 'yoon_p', region: 'katakana' },
  { id: 'k_pyo', kana: 'ピョ', romaji: 'pyo', group: 'yoon_p', region: 'katakana' },
];

export const ALL_COMBINATIONS = [...HIRAGANA_YOON, ...KATAKANA_YOON];
