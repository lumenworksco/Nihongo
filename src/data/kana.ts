export type KanaSection = 'basic' | 'voiced' | 'combination';

export type KanaRow =
  | 'vowel' | 'k' | 's' | 't' | 'n_row' | 'h' | 'm' | 'y' | 'r' | 'w' | 'n_solo'
  | 'g' | 'z' | 'd' | 'b' | 'p'
  | 'combo_ky' | 'combo_sh' | 'combo_ch' | 'combo_ny' | 'combo_hy' | 'combo_my'
  | 'combo_ry' | 'combo_gy' | 'combo_j' | 'combo_by' | 'combo_py';

export interface KanaEntry {
  id: string;
  romaji: string;
  hiragana: string;
  katakana: string;
  section: KanaSection;
  row: KanaRow;
}

export const kanaEntries: KanaEntry[] = [
  // ── BASIC ─────────────────────────────────────────────────────────────────────
  // Vowels
  { id: 'a',   romaji: 'a',   hiragana: 'あ', katakana: 'ア', section: 'basic', row: 'vowel' },
  { id: 'i',   romaji: 'i',   hiragana: 'い', katakana: 'イ', section: 'basic', row: 'vowel' },
  { id: 'u',   romaji: 'u',   hiragana: 'う', katakana: 'ウ', section: 'basic', row: 'vowel' },
  { id: 'e',   romaji: 'e',   hiragana: 'え', katakana: 'エ', section: 'basic', row: 'vowel' },
  { id: 'o',   romaji: 'o',   hiragana: 'お', katakana: 'オ', section: 'basic', row: 'vowel' },
  // K row
  { id: 'ka',  romaji: 'ka',  hiragana: 'か', katakana: 'カ', section: 'basic', row: 'k' },
  { id: 'ki',  romaji: 'ki',  hiragana: 'き', katakana: 'キ', section: 'basic', row: 'k' },
  { id: 'ku',  romaji: 'ku',  hiragana: 'く', katakana: 'ク', section: 'basic', row: 'k' },
  { id: 'ke',  romaji: 'ke',  hiragana: 'け', katakana: 'ケ', section: 'basic', row: 'k' },
  { id: 'ko',  romaji: 'ko',  hiragana: 'こ', katakana: 'コ', section: 'basic', row: 'k' },
  // S row
  { id: 'sa',  romaji: 'sa',  hiragana: 'さ', katakana: 'サ', section: 'basic', row: 's' },
  { id: 'shi', romaji: 'shi', hiragana: 'し', katakana: 'シ', section: 'basic', row: 's' },
  { id: 'su',  romaji: 'su',  hiragana: 'す', katakana: 'ス', section: 'basic', row: 's' },
  { id: 'se',  romaji: 'se',  hiragana: 'せ', katakana: 'セ', section: 'basic', row: 's' },
  { id: 'so',  romaji: 'so',  hiragana: 'そ', katakana: 'ソ', section: 'basic', row: 's' },
  // T row
  { id: 'ta',  romaji: 'ta',  hiragana: 'た', katakana: 'タ', section: 'basic', row: 't' },
  { id: 'chi', romaji: 'chi', hiragana: 'ち', katakana: 'チ', section: 'basic', row: 't' },
  { id: 'tsu', romaji: 'tsu', hiragana: 'つ', katakana: 'ツ', section: 'basic', row: 't' },
  { id: 'te',  romaji: 'te',  hiragana: 'て', katakana: 'テ', section: 'basic', row: 't' },
  { id: 'to',  romaji: 'to',  hiragana: 'と', katakana: 'ト', section: 'basic', row: 't' },
  // N row
  { id: 'na',  romaji: 'na',  hiragana: 'な', katakana: 'ナ', section: 'basic', row: 'n_row' },
  { id: 'ni',  romaji: 'ni',  hiragana: 'に', katakana: 'ニ', section: 'basic', row: 'n_row' },
  { id: 'nu',  romaji: 'nu',  hiragana: 'ぬ', katakana: 'ヌ', section: 'basic', row: 'n_row' },
  { id: 'ne',  romaji: 'ne',  hiragana: 'ね', katakana: 'ネ', section: 'basic', row: 'n_row' },
  { id: 'no',  romaji: 'no',  hiragana: 'の', katakana: 'ノ', section: 'basic', row: 'n_row' },
  // H row
  { id: 'ha',  romaji: 'ha',  hiragana: 'は', katakana: 'ハ', section: 'basic', row: 'h' },
  { id: 'hi',  romaji: 'hi',  hiragana: 'ひ', katakana: 'ヒ', section: 'basic', row: 'h' },
  { id: 'fu',  romaji: 'fu',  hiragana: 'ふ', katakana: 'フ', section: 'basic', row: 'h' },
  { id: 'he',  romaji: 'he',  hiragana: 'へ', katakana: 'ヘ', section: 'basic', row: 'h' },
  { id: 'ho',  romaji: 'ho',  hiragana: 'ほ', katakana: 'ホ', section: 'basic', row: 'h' },
  // M row
  { id: 'ma',  romaji: 'ma',  hiragana: 'ま', katakana: 'マ', section: 'basic', row: 'm' },
  { id: 'mi',  romaji: 'mi',  hiragana: 'み', katakana: 'ミ', section: 'basic', row: 'm' },
  { id: 'mu',  romaji: 'mu',  hiragana: 'む', katakana: 'ム', section: 'basic', row: 'm' },
  { id: 'me',  romaji: 'me',  hiragana: 'め', katakana: 'メ', section: 'basic', row: 'm' },
  { id: 'mo',  romaji: 'mo',  hiragana: 'も', katakana: 'モ', section: 'basic', row: 'm' },
  // Y row
  { id: 'ya',  romaji: 'ya',  hiragana: 'や', katakana: 'ヤ', section: 'basic', row: 'y' },
  { id: 'yu',  romaji: 'yu',  hiragana: 'ゆ', katakana: 'ユ', section: 'basic', row: 'y' },
  { id: 'yo',  romaji: 'yo',  hiragana: 'よ', katakana: 'ヨ', section: 'basic', row: 'y' },
  // R row
  { id: 'ra',  romaji: 'ra',  hiragana: 'ら', katakana: 'ラ', section: 'basic', row: 'r' },
  { id: 'ri',  romaji: 'ri',  hiragana: 'り', katakana: 'リ', section: 'basic', row: 'r' },
  { id: 'ru',  romaji: 'ru',  hiragana: 'る', katakana: 'ル', section: 'basic', row: 'r' },
  { id: 're',  romaji: 're',  hiragana: 'れ', katakana: 'レ', section: 'basic', row: 'r' },
  { id: 'ro',  romaji: 'ro',  hiragana: 'ろ', katakana: 'ロ', section: 'basic', row: 'r' },
  // W row
  { id: 'wa',  romaji: 'wa',  hiragana: 'わ', katakana: 'ワ', section: 'basic', row: 'w' },
  { id: 'wo',  romaji: 'wo',  hiragana: 'を', katakana: 'ヲ', section: 'basic', row: 'w' },
  // N (standalone)
  { id: 'n',   romaji: 'n',   hiragana: 'ん', katakana: 'ン', section: 'basic', row: 'n_solo' },

  // ── VOICED / SEMI-VOICED ──────────────────────────────────────────────────────
  // G row
  { id: 'ga',  romaji: 'ga',  hiragana: 'が', katakana: 'ガ', section: 'voiced', row: 'g' },
  { id: 'gi',  romaji: 'gi',  hiragana: 'ぎ', katakana: 'ギ', section: 'voiced', row: 'g' },
  { id: 'gu',  romaji: 'gu',  hiragana: 'ぐ', katakana: 'グ', section: 'voiced', row: 'g' },
  { id: 'ge',  romaji: 'ge',  hiragana: 'げ', katakana: 'ゲ', section: 'voiced', row: 'g' },
  { id: 'go',  romaji: 'go',  hiragana: 'ご', katakana: 'ゴ', section: 'voiced', row: 'g' },
  // Z row
  { id: 'za',  romaji: 'za',  hiragana: 'ざ', katakana: 'ザ', section: 'voiced', row: 'z' },
  { id: 'ji',  romaji: 'ji',  hiragana: 'じ', katakana: 'ジ', section: 'voiced', row: 'z' },
  { id: 'zu',  romaji: 'zu',  hiragana: 'ず', katakana: 'ズ', section: 'voiced', row: 'z' },
  { id: 'ze',  romaji: 'ze',  hiragana: 'ぜ', katakana: 'ゼ', section: 'voiced', row: 'z' },
  { id: 'zo',  romaji: 'zo',  hiragana: 'ぞ', katakana: 'ゾ', section: 'voiced', row: 'z' },
  // D row
  { id: 'da',  romaji: 'da',  hiragana: 'だ', katakana: 'ダ', section: 'voiced', row: 'd' },
  { id: 'di',  romaji: 'ji',  hiragana: 'ぢ', katakana: 'ヂ', section: 'voiced', row: 'd' },
  { id: 'du',  romaji: 'zu',  hiragana: 'づ', katakana: 'ヅ', section: 'voiced', row: 'd' },
  { id: 'de',  romaji: 'de',  hiragana: 'で', katakana: 'デ', section: 'voiced', row: 'd' },
  { id: 'do',  romaji: 'do',  hiragana: 'ど', katakana: 'ド', section: 'voiced', row: 'd' },
  // B row
  { id: 'ba',  romaji: 'ba',  hiragana: 'ば', katakana: 'バ', section: 'voiced', row: 'b' },
  { id: 'bi',  romaji: 'bi',  hiragana: 'び', katakana: 'ビ', section: 'voiced', row: 'b' },
  { id: 'bu',  romaji: 'bu',  hiragana: 'ぶ', katakana: 'ブ', section: 'voiced', row: 'b' },
  { id: 'be',  romaji: 'be',  hiragana: 'べ', katakana: 'ベ', section: 'voiced', row: 'b' },
  { id: 'bo',  romaji: 'bo',  hiragana: 'ぼ', katakana: 'ボ', section: 'voiced', row: 'b' },
  // P row
  { id: 'pa',  romaji: 'pa',  hiragana: 'ぱ', katakana: 'パ', section: 'voiced', row: 'p' },
  { id: 'pi',  romaji: 'pi',  hiragana: 'ぴ', katakana: 'ピ', section: 'voiced', row: 'p' },
  { id: 'pu',  romaji: 'pu',  hiragana: 'ぷ', katakana: 'プ', section: 'voiced', row: 'p' },
  { id: 'pe',  romaji: 'pe',  hiragana: 'ぺ', katakana: 'ペ', section: 'voiced', row: 'p' },
  { id: 'po',  romaji: 'po',  hiragana: 'ぽ', katakana: 'ポ', section: 'voiced', row: 'p' },

  // ── COMBINATIONS (youon) ──────────────────────────────────────────────────────
  // KY
  { id: 'kya', romaji: 'kya', hiragana: 'きゃ', katakana: 'キャ', section: 'combination', row: 'combo_ky' },
  { id: 'kyu', romaji: 'kyu', hiragana: 'きゅ', katakana: 'キュ', section: 'combination', row: 'combo_ky' },
  { id: 'kyo', romaji: 'kyo', hiragana: 'きょ', katakana: 'キョ', section: 'combination', row: 'combo_ky' },
  // SH
  { id: 'sha', romaji: 'sha', hiragana: 'しゃ', katakana: 'シャ', section: 'combination', row: 'combo_sh' },
  { id: 'shu', romaji: 'shu', hiragana: 'しゅ', katakana: 'シュ', section: 'combination', row: 'combo_sh' },
  { id: 'sho', romaji: 'sho', hiragana: 'しょ', katakana: 'ショ', section: 'combination', row: 'combo_sh' },
  // CH
  { id: 'cha', romaji: 'cha', hiragana: 'ちゃ', katakana: 'チャ', section: 'combination', row: 'combo_ch' },
  { id: 'chu', romaji: 'chu', hiragana: 'ちゅ', katakana: 'チュ', section: 'combination', row: 'combo_ch' },
  { id: 'cho', romaji: 'cho', hiragana: 'ちょ', katakana: 'チョ', section: 'combination', row: 'combo_ch' },
  // NY
  { id: 'nya', romaji: 'nya', hiragana: 'にゃ', katakana: 'ニャ', section: 'combination', row: 'combo_ny' },
  { id: 'nyu', romaji: 'nyu', hiragana: 'にゅ', katakana: 'ニュ', section: 'combination', row: 'combo_ny' },
  { id: 'nyo', romaji: 'nyo', hiragana: 'にょ', katakana: 'ニョ', section: 'combination', row: 'combo_ny' },
  // HY
  { id: 'hya', romaji: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ', section: 'combination', row: 'combo_hy' },
  { id: 'hyu', romaji: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ', section: 'combination', row: 'combo_hy' },
  { id: 'hyo', romaji: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ', section: 'combination', row: 'combo_hy' },
  // MY
  { id: 'mya', romaji: 'mya', hiragana: 'みゃ', katakana: 'ミャ', section: 'combination', row: 'combo_my' },
  { id: 'myu', romaji: 'myu', hiragana: 'みゅ', katakana: 'ミュ', section: 'combination', row: 'combo_my' },
  { id: 'myo', romaji: 'myo', hiragana: 'みょ', katakana: 'ミョ', section: 'combination', row: 'combo_my' },
  // RY
  { id: 'rya', romaji: 'rya', hiragana: 'りゃ', katakana: 'リャ', section: 'combination', row: 'combo_ry' },
  { id: 'ryu', romaji: 'ryu', hiragana: 'りゅ', katakana: 'リュ', section: 'combination', row: 'combo_ry' },
  { id: 'ryo', romaji: 'ryo', hiragana: 'りょ', katakana: 'リョ', section: 'combination', row: 'combo_ry' },
  // GY
  { id: 'gya', romaji: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ', section: 'combination', row: 'combo_gy' },
  { id: 'gyu', romaji: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ', section: 'combination', row: 'combo_gy' },
  { id: 'gyo', romaji: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ', section: 'combination', row: 'combo_gy' },
  // J
  { id: 'ja',  romaji: 'ja',  hiragana: 'じゃ', katakana: 'ジャ', section: 'combination', row: 'combo_j' },
  { id: 'ju',  romaji: 'ju',  hiragana: 'じゅ', katakana: 'ジュ', section: 'combination', row: 'combo_j' },
  { id: 'jo',  romaji: 'jo',  hiragana: 'じょ', katakana: 'ジョ', section: 'combination', row: 'combo_j' },
  // BY
  { id: 'bya', romaji: 'bya', hiragana: 'びゃ', katakana: 'ビャ', section: 'combination', row: 'combo_by' },
  { id: 'byu', romaji: 'byu', hiragana: 'びゅ', katakana: 'ビュ', section: 'combination', row: 'combo_by' },
  { id: 'byo', romaji: 'byo', hiragana: 'びょ', katakana: 'ビョ', section: 'combination', row: 'combo_by' },
  // PY
  { id: 'pya', romaji: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ', section: 'combination', row: 'combo_py' },
  { id: 'pyu', romaji: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ', section: 'combination', row: 'combo_py' },
  { id: 'pyo', romaji: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ', section: 'combination', row: 'combo_py' },
];

export const rowLabels: Record<KanaRow, string> = {
  vowel:     'Vowels · あ行',
  k:         'K row · か行',
  s:         'S row · さ行',
  t:         'T row · た行',
  n_row:     'N row · な行',
  h:         'H row · は行',
  m:         'M row · ま行',
  y:         'Y row · や行',
  r:         'R row · ら行',
  w:         'W/N · わ行',
  n_solo:    'N · ん',
  g:         'G row · が行',
  z:         'Z row · ざ行',
  d:         'D row · だ行',
  b:         'B row · ば行',
  p:         'P row · ぱ行',
  combo_ky:  'KY · きゃ行',
  combo_sh:  'SH · しゃ行',
  combo_ch:  'CH · ちゃ行',
  combo_ny:  'NY · にゃ行',
  combo_hy:  'HY · ひゃ行',
  combo_my:  'MY · みゃ行',
  combo_ry:  'RY · りゃ行',
  combo_gy:  'GY · ぎゃ行',
  combo_j:   'J · じゃ行',
  combo_by:  'BY · びゃ行',
  combo_py:  'PY · ぴゃ行',
};
