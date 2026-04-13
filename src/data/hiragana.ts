export interface KanaCard {
  id: string;
  kana: string;
  romaji: string;
  group: string;
  region: 'hiragana' | 'katakana';
  mnemonic?: string;
}

export const HIRAGANA: KanaCard[] = [
  // Vowels
  { id: 'h_a', kana: 'あ', romaji: 'a', group: 'vowels', region: 'hiragana', mnemonic: 'Looks like an "a" written in cursive' },
  { id: 'h_i', kana: 'い', romaji: 'i', group: 'vowels', region: 'hiragana', mnemonic: 'Two vertical strokes like the letter "i"' },
  { id: 'h_u', kana: 'う', romaji: 'u', group: 'vowels', region: 'hiragana', mnemonic: 'Looks like a bent "u"' },
  { id: 'h_e', kana: 'え', romaji: 'e', group: 'vowels', region: 'hiragana', mnemonic: 'Like a person waving "e"xcitedly' },
  { id: 'h_o', kana: 'お', romaji: 'o', group: 'vowels', region: 'hiragana', mnemonic: 'An "o" shape with extra strokes' },

  // K row
  { id: 'h_ka', kana: 'か', romaji: 'ka', group: 'k-row', region: 'hiragana' },
  { id: 'h_ki', kana: 'き', romaji: 'ki', group: 'k-row', region: 'hiragana' },
  { id: 'h_ku', kana: 'く', romaji: 'ku', group: 'k-row', region: 'hiragana', mnemonic: 'Like a beak going "coo"' },
  { id: 'h_ke', kana: 'け', romaji: 'ke', group: 'k-row', region: 'hiragana' },
  { id: 'h_ko', kana: 'こ', romaji: 'ko', group: 'k-row', region: 'hiragana', mnemonic: 'Two lines like a "co"rner' },

  // S row
  { id: 'h_sa', kana: 'さ', romaji: 'sa', group: 's-row', region: 'hiragana' },
  { id: 'h_shi', kana: 'し', romaji: 'shi', group: 's-row', region: 'hiragana', mnemonic: 'Like a fishing hook — she goes fishing' },
  { id: 'h_su', kana: 'す', romaji: 'su', group: 's-row', region: 'hiragana' },
  { id: 'h_se', kana: 'せ', romaji: 'se', group: 's-row', region: 'hiragana' },
  { id: 'h_so', kana: 'そ', romaji: 'so', group: 's-row', region: 'hiragana', mnemonic: 'Looks like a "so"wing needle' },

  // T row
  { id: 'h_ta', kana: 'た', romaji: 'ta', group: 't-row', region: 'hiragana' },
  { id: 'h_chi', kana: 'ち', romaji: 'chi', group: 't-row', region: 'hiragana', mnemonic: 'Like a "chi"ld running' },
  { id: 'h_tsu', kana: 'つ', romaji: 'tsu', group: 't-row', region: 'hiragana', mnemonic: 'Like a crashing "tsu"nami wave' },
  { id: 'h_te', kana: 'て', romaji: 'te', group: 't-row', region: 'hiragana' },
  { id: 'h_to', kana: 'と', romaji: 'to', group: 't-row', region: 'hiragana', mnemonic: 'Like a "to"e with a nail' },

  // N row
  { id: 'h_na', kana: 'な', romaji: 'na', group: 'n-row', region: 'hiragana' },
  { id: 'h_ni', kana: 'に', romaji: 'ni', group: 'n-row', region: 'hiragana' },
  { id: 'h_nu', kana: 'ぬ', romaji: 'nu', group: 'n-row', region: 'hiragana', mnemonic: 'Looks like a bowl of "noo"dles' },
  { id: 'h_ne', kana: 'ね', romaji: 'ne', group: 'n-row', region: 'hiragana' },
  { id: 'h_no', kana: 'の', romaji: 'no', group: 'n-row', region: 'hiragana', mnemonic: 'A "no" sign — a circle with a line' },

  // H row
  { id: 'h_ha', kana: 'は', romaji: 'ha', group: 'h-row', region: 'hiragana' },
  { id: 'h_hi', kana: 'ひ', romaji: 'hi', group: 'h-row', region: 'hiragana' },
  { id: 'h_fu', kana: 'ふ', romaji: 'fu', group: 'h-row', region: 'hiragana', mnemonic: 'Like Mount "Fu"ji' },
  { id: 'h_he', kana: 'へ', romaji: 'he', group: 'h-row', region: 'hiragana', mnemonic: 'Like a mountain peak' },
  { id: 'h_ho', kana: 'ほ', romaji: 'ho', group: 'h-row', region: 'hiragana' },

  // M row
  { id: 'h_ma', kana: 'ま', romaji: 'ma', group: 'm-row', region: 'hiragana' },
  { id: 'h_mi', kana: 'み', romaji: 'mi', group: 'm-row', region: 'hiragana' },
  { id: 'h_mu', kana: 'む', romaji: 'mu', group: 'm-row', region: 'hiragana', mnemonic: 'Like a "moo"ing cow face' },
  { id: 'h_me', kana: 'め', romaji: 'me', group: 'm-row', region: 'hiragana' },
  { id: 'h_mo', kana: 'も', romaji: 'mo', group: 'm-row', region: 'hiragana' },

  // Y row
  { id: 'h_ya', kana: 'や', romaji: 'ya', group: 'y-row', region: 'hiragana' },
  { id: 'h_yu', kana: 'ゆ', romaji: 'yu', group: 'y-row', region: 'hiragana' },
  { id: 'h_yo', kana: 'よ', romaji: 'yo', group: 'y-row', region: 'hiragana', mnemonic: 'Like the "yo"ga pose' },

  // R row
  { id: 'h_ra', kana: 'ら', romaji: 'ra', group: 'r-row', region: 'hiragana' },
  { id: 'h_ri', kana: 'り', romaji: 'ri', group: 'r-row', region: 'hiragana' },
  { id: 'h_ru', kana: 'る', romaji: 'ru', group: 'r-row', region: 'hiragana', mnemonic: 'Like a loop — "roo"p' },
  { id: 'h_re', kana: 'れ', romaji: 're', group: 'r-row', region: 'hiragana' },
  { id: 'h_ro', kana: 'ろ', romaji: 'ro', group: 'r-row', region: 'hiragana' },

  // W row + N
  { id: 'h_wa', kana: 'わ', romaji: 'wa', group: 'w-row', region: 'hiragana' },
  { id: 'h_wo', kana: 'を', romaji: 'wo', group: 'w-row', region: 'hiragana' },
  { id: 'h_n', kana: 'ん', romaji: 'n', group: 'n-standalone', region: 'hiragana', mnemonic: 'Looks like an "n" or a person bowing' },

  // Dakuten (voiced)
  { id: 'h_ga', kana: 'が', romaji: 'ga', group: 'voiced-k', region: 'hiragana' },
  { id: 'h_gi', kana: 'ぎ', romaji: 'gi', group: 'voiced-k', region: 'hiragana' },
  { id: 'h_gu', kana: 'ぐ', romaji: 'gu', group: 'voiced-k', region: 'hiragana' },
  { id: 'h_ge', kana: 'げ', romaji: 'ge', group: 'voiced-k', region: 'hiragana' },
  { id: 'h_go', kana: 'ご', romaji: 'go', group: 'voiced-k', region: 'hiragana' },
  { id: 'h_za', kana: 'ざ', romaji: 'za', group: 'voiced-s', region: 'hiragana' },
  { id: 'h_ji', kana: 'じ', romaji: 'ji', group: 'voiced-s', region: 'hiragana' },
  { id: 'h_zu', kana: 'ず', romaji: 'zu', group: 'voiced-s', region: 'hiragana' },
  { id: 'h_ze', kana: 'ぜ', romaji: 'ze', group: 'voiced-s', region: 'hiragana' },
  { id: 'h_zo', kana: 'ぞ', romaji: 'zo', group: 'voiced-s', region: 'hiragana' },
  { id: 'h_da', kana: 'だ', romaji: 'da', group: 'voiced-t', region: 'hiragana' },
  { id: 'h_di', kana: 'ぢ', romaji: 'di', group: 'voiced-t', region: 'hiragana' },
  { id: 'h_du', kana: 'づ', romaji: 'du', group: 'voiced-t', region: 'hiragana' },
  { id: 'h_de', kana: 'で', romaji: 'de', group: 'voiced-t', region: 'hiragana' },
  { id: 'h_do', kana: 'ど', romaji: 'do', group: 'voiced-t', region: 'hiragana' },
  { id: 'h_ba', kana: 'ば', romaji: 'ba', group: 'voiced-h', region: 'hiragana' },
  { id: 'h_bi', kana: 'び', romaji: 'bi', group: 'voiced-h', region: 'hiragana' },
  { id: 'h_bu', kana: 'ぶ', romaji: 'bu', group: 'voiced-h', region: 'hiragana' },
  { id: 'h_be', kana: 'べ', romaji: 'be', group: 'voiced-h', region: 'hiragana' },
  { id: 'h_bo', kana: 'ぼ', romaji: 'bo', group: 'voiced-h', region: 'hiragana' },
  { id: 'h_pa', kana: 'ぱ', romaji: 'pa', group: 'semi-voiced', region: 'hiragana' },
  { id: 'h_pi', kana: 'ぴ', romaji: 'pi', group: 'semi-voiced', region: 'hiragana' },
  { id: 'h_pu', kana: 'ぷ', romaji: 'pu', group: 'semi-voiced', region: 'hiragana' },
  { id: 'h_pe', kana: 'ぺ', romaji: 'pe', group: 'semi-voiced', region: 'hiragana' },
  { id: 'h_po', kana: 'ぽ', romaji: 'po', group: 'semi-voiced', region: 'hiragana' },
];
