import { KanaCard } from './hiragana';

export const KATAKANA: KanaCard[] = [
  // Vowels
  { id: 'k_a', kana: 'ア', romaji: 'a', group: 'vowels', region: 'katakana', mnemonic: 'Like the top part of the hiragana あ' },
  { id: 'k_i', kana: 'イ', romaji: 'i', group: 'vowels', region: 'katakana', mnemonic: 'Like two strokes for the letter "I"' },
  { id: 'k_u', kana: 'ウ', romaji: 'u', group: 'vowels', region: 'katakana' },
  { id: 'k_e', kana: 'エ', romaji: 'e', group: 'vowels', region: 'katakana', mnemonic: 'Like the letter "I" with horizontal lines' },
  { id: 'k_o', kana: 'オ', romaji: 'o', group: 'vowels', region: 'katakana' },

  // K row
  { id: 'k_ka', kana: 'カ', romaji: 'ka', group: 'k-row', region: 'katakana', mnemonic: 'Like a "ka"-rate chop' },
  { id: 'k_ki', kana: 'キ', romaji: 'ki', group: 'k-row', region: 'katakana' },
  { id: 'k_ku', kana: 'ク', romaji: 'ku', group: 'k-row', region: 'katakana', mnemonic: 'Like a bird beak — "coo"' },
  { id: 'k_ke', kana: 'ケ', romaji: 'ke', group: 'k-row', region: 'katakana' },
  { id: 'k_ko', kana: 'コ', romaji: 'ko', group: 'k-row', region: 'katakana', mnemonic: 'Like a squared "ko"rner' },

  // S row
  { id: 'k_sa', kana: 'サ', romaji: 'sa', group: 's-row', region: 'katakana' },
  { id: 'k_shi', kana: 'シ', romaji: 'shi', group: 's-row', region: 'katakana', mnemonic: 'Three strokes — looks like "she" smiling' },
  { id: 'k_su', kana: 'ス', romaji: 'su', group: 's-row', region: 'katakana', mnemonic: 'Like a "su"per hero swooping down' },
  { id: 'k_se', kana: 'セ', romaji: 'se', group: 's-row', region: 'katakana' },
  { id: 'k_so', kana: 'ソ', romaji: 'so', group: 's-row', region: 'katakana' },

  // T row
  { id: 'k_ta', kana: 'タ', romaji: 'ta', group: 't-row', region: 'katakana' },
  { id: 'k_chi', kana: 'チ', romaji: 'chi', group: 't-row', region: 'katakana' },
  { id: 'k_tsu', kana: 'ツ', romaji: 'tsu', group: 't-row', region: 'katakana', mnemonic: 'Three drops like a "tsu"nami spray' },
  { id: 'k_te', kana: 'テ', romaji: 'te', group: 't-row', region: 'katakana', mnemonic: 'Like a TV antenna — "tele"vision' },
  { id: 'k_to', kana: 'ト', romaji: 'to', group: 't-row', region: 'katakana', mnemonic: 'Like a "to"tem pole' },

  // N row
  { id: 'k_na', kana: 'ナ', romaji: 'na', group: 'n-row', region: 'katakana', mnemonic: 'Like a cross — "na"il' },
  { id: 'k_ni', kana: 'ニ', romaji: 'ni', group: 'n-row', region: 'katakana', mnemonic: 'Like the number "ni"ne (2 strokes)' },
  { id: 'k_nu', kana: 'ヌ', romaji: 'nu', group: 'n-row', region: 'katakana' },
  { id: 'k_ne', kana: 'ネ', romaji: 'ne', group: 'n-row', region: 'katakana' },
  { id: 'k_no', kana: 'ノ', romaji: 'no', group: 'n-row', region: 'katakana', mnemonic: 'A single slash — just say "no"' },

  // H row
  { id: 'k_ha', kana: 'ハ', romaji: 'ha', group: 'h-row', region: 'katakana', mnemonic: 'Two strokes laughing "ha-ha"' },
  { id: 'k_hi', kana: 'ヒ', romaji: 'hi', group: 'h-row', region: 'katakana' },
  { id: 'k_fu', kana: 'フ', romaji: 'fu', group: 'h-row', region: 'katakana', mnemonic: 'Like Mount "Fu"ji' },
  { id: 'k_he', kana: 'ヘ', romaji: 'he', group: 'h-row', region: 'katakana', mnemonic: 'Same as hiragana へ — mountain peak' },
  { id: 'k_ho', kana: 'ホ', romaji: 'ho', group: 'h-row', region: 'katakana', mnemonic: 'Like a cross — "ho"ly cross' },

  // M row
  { id: 'k_ma', kana: 'マ', romaji: 'ma', group: 'm-row', region: 'katakana' },
  { id: 'k_mi', kana: 'ミ', romaji: 'mi', group: 'm-row', region: 'katakana', mnemonic: 'Three lines like "me, me, me"' },
  { id: 'k_mu', kana: 'ム', romaji: 'mu', group: 'm-row', region: 'katakana', mnemonic: 'Like a "moo"ing cow silhouette' },
  { id: 'k_me', kana: 'メ', romaji: 'me', group: 'm-row', region: 'katakana', mnemonic: 'Like a crossing — "me"tro cross' },
  { id: 'k_mo', kana: 'モ', romaji: 'mo', group: 'm-row', region: 'katakana' },

  // Y row
  { id: 'k_ya', kana: 'ヤ', romaji: 'ya', group: 'y-row', region: 'katakana' },
  { id: 'k_yu', kana: 'ユ', romaji: 'yu', group: 'y-row', region: 'katakana' },
  { id: 'k_yo', kana: 'ヨ', romaji: 'yo', group: 'y-row', region: 'katakana', mnemonic: 'Like a fork — "yo"' },

  // R row
  { id: 'k_ra', kana: 'ラ', romaji: 'ra', group: 'r-row', region: 'katakana' },
  { id: 'k_ri', kana: 'リ', romaji: 'ri', group: 'r-row', region: 'katakana', mnemonic: 'Two vertical strokes — "ri"ce chopsticks' },
  { id: 'k_ru', kana: 'ル', romaji: 'ru', group: 'r-row', region: 'katakana' },
  { id: 'k_re', kana: 'レ', romaji: 're', group: 'r-row', region: 'katakana', mnemonic: 'Like the letter L — "re"' },
  { id: 'k_ro', kana: 'ロ', romaji: 'ro', group: 'r-row', region: 'katakana', mnemonic: 'Like a square — "ro"bot box' },

  // W row + N
  { id: 'k_wa', kana: 'ワ', romaji: 'wa', group: 'w-row', region: 'katakana' },
  { id: 'k_wo', kana: 'ヲ', romaji: 'wo', group: 'w-row', region: 'katakana' },
  { id: 'k_n', kana: 'ン', romaji: 'n', group: 'n-standalone', region: 'katakana' },

  // Dakuten (voiced)
  { id: 'k_ga', kana: 'ガ', romaji: 'ga', group: 'voiced-k', region: 'katakana' },
  { id: 'k_gi', kana: 'ギ', romaji: 'gi', group: 'voiced-k', region: 'katakana' },
  { id: 'k_gu', kana: 'グ', romaji: 'gu', group: 'voiced-k', region: 'katakana' },
  { id: 'k_ge', kana: 'ゲ', romaji: 'ge', group: 'voiced-k', region: 'katakana' },
  { id: 'k_go', kana: 'ゴ', romaji: 'go', group: 'voiced-k', region: 'katakana' },
  { id: 'k_za', kana: 'ザ', romaji: 'za', group: 'voiced-s', region: 'katakana' },
  { id: 'k_ji', kana: 'ジ', romaji: 'ji', group: 'voiced-s', region: 'katakana' },
  { id: 'k_zu', kana: 'ズ', romaji: 'zu', group: 'voiced-s', region: 'katakana' },
  { id: 'k_ze', kana: 'ゼ', romaji: 'ze', group: 'voiced-s', region: 'katakana' },
  { id: 'k_zo', kana: 'ゾ', romaji: 'zo', group: 'voiced-s', region: 'katakana' },
  { id: 'k_da', kana: 'ダ', romaji: 'da', group: 'voiced-t', region: 'katakana' },
  { id: 'k_de', kana: 'デ', romaji: 'de', group: 'voiced-t', region: 'katakana' },
  { id: 'k_do', kana: 'ド', romaji: 'do', group: 'voiced-t', region: 'katakana' },
  { id: 'k_ba', kana: 'バ', romaji: 'ba', group: 'voiced-h', region: 'katakana' },
  { id: 'k_bi', kana: 'ビ', romaji: 'bi', group: 'voiced-h', region: 'katakana' },
  { id: 'k_bu', kana: 'ブ', romaji: 'bu', group: 'voiced-h', region: 'katakana' },
  { id: 'k_be', kana: 'ベ', romaji: 'be', group: 'voiced-h', region: 'katakana' },
  { id: 'k_bo', kana: 'ボ', romaji: 'bo', group: 'voiced-h', region: 'katakana' },
  { id: 'k_pa', kana: 'パ', romaji: 'pa', group: 'semi-voiced', region: 'katakana' },
  { id: 'k_pi', kana: 'ピ', romaji: 'pi', group: 'semi-voiced', region: 'katakana' },
  { id: 'k_pu', kana: 'プ', romaji: 'pu', group: 'semi-voiced', region: 'katakana' },
  { id: 'k_pe', kana: 'ペ', romaji: 'pe', group: 'semi-voiced', region: 'katakana' },
  { id: 'k_po', kana: 'ポ', romaji: 'po', group: 'semi-voiced', region: 'katakana' },
];
