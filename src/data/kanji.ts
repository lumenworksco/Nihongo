export interface KanjiEntry {
  id: number;
  kanji: string;
  onyomi: string[];
  kunyomi: string[];
  meanings: string[];
  group: 'numbers' | 'time' | 'people' | 'nature' | 'direction' | 'school' | 'language' | 'actions' | 'misc';
  radicals?: { char: string; meaning: string }[];
}

export const kanjiEntries: KanjiEntry[] = [
  // Numbers
  { id:  1, kanji: '一', onyomi: ['イチ'],       kunyomi: ['ひと'],           meanings: ['one'],                    group: 'numbers' },
  { id:  2, kanji: '二', onyomi: ['ニ'],         kunyomi: ['ふた'],           meanings: ['two'],                    group: 'numbers' },
  { id:  3, kanji: '三', onyomi: ['サン'],       kunyomi: ['み', 'みっ'],      meanings: ['three'],                  group: 'numbers' },
  { id:  4, kanji: '四', onyomi: ['シ', 'ヨン'], kunyomi: ['よ', 'よっ'],      meanings: ['four'],                   group: 'numbers' },
  { id:  5, kanji: '五', onyomi: ['ゴ'],         kunyomi: ['いつ'],           meanings: ['five'],                   group: 'numbers' },
  { id:  6, kanji: '六', onyomi: ['ロク'],       kunyomi: ['む', 'むっ'],      meanings: ['six'],                    group: 'numbers',   radicals: [{ char: '亠', meaning: 'lid' }, { char: '八', meaning: 'eight' }] },
  { id:  7, kanji: '七', onyomi: ['シチ'],       kunyomi: ['なな', 'なの'],    meanings: ['seven'],                  group: 'numbers' },
  { id:  8, kanji: '八', onyomi: ['ハチ'],       kunyomi: ['や', 'やっ'],      meanings: ['eight'],                  group: 'numbers' },
  { id:  9, kanji: '九', onyomi: ['キュウ', 'ク'], kunyomi: ['ここの'],        meanings: ['nine'],                   group: 'numbers' },
  { id: 10, kanji: '十', onyomi: ['ジュウ'],     kunyomi: ['とお', 'と'],      meanings: ['ten'],                    group: 'numbers' },
  { id: 11, kanji: '百', onyomi: ['ヒャク'],     kunyomi: ['もも'],           meanings: ['hundred'],                group: 'numbers',   radicals: [{ char: '一', meaning: 'one' }, { char: '白', meaning: 'white' }] },
  { id: 12, kanji: '千', onyomi: ['セン'],       kunyomi: ['ち'],             meanings: ['thousand'],               group: 'numbers' },
  { id: 13, kanji: '万', onyomi: ['マン', 'バン'], kunyomi: ['よろず'],        meanings: ['ten thousand'],           group: 'numbers' },

  // Time
  { id: 14, kanji: '年', onyomi: ['ネン'],       kunyomi: ['とし'],           meanings: ['year'],                   group: 'time' },
  { id: 15, kanji: '月', onyomi: ['ガツ', 'ゲツ'], kunyomi: ['つき'],          meanings: ['month', 'moon'],          group: 'time' },
  { id: 16, kanji: '日', onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ', 'か'],      meanings: ['day', 'sun'],             group: 'time' },
  { id: 17, kanji: '時', onyomi: ['ジ'],         kunyomi: ['とき'],           meanings: ['time', 'hour'],           group: 'time',      radicals: [{ char: '日', meaning: 'sun' }, { char: '寺', meaning: 'temple' }] },
  { id: 18, kanji: '間', onyomi: ['カン', 'ケン'], kunyomi: ['あいだ', 'ま'],   meanings: ['interval', 'between'],    group: 'time',      radicals: [{ char: '門', meaning: 'gate' }, { char: '日', meaning: 'sun' }] },
  { id: 19, kanji: '分', onyomi: ['ブン', 'フン', 'ブ'], kunyomi: ['わかる', 'わける'], meanings: ['minute', 'part', 'understand'], group: 'time', radicals: [{ char: '八', meaning: 'divide' }, { char: '刀', meaning: 'knife' }] },
  { id: 20, kanji: '半', onyomi: ['ハン'],       kunyomi: ['なかば'],         meanings: ['half'],                   group: 'time' },
  { id: 21, kanji: '毎', onyomi: ['マイ'],       kunyomi: [],                 meanings: ['every', 'each'],          group: 'time' },
  { id: 22, kanji: '今', onyomi: ['コン', 'キン'], kunyomi: ['いま'],           meanings: ['now', 'present'],         group: 'time' },
  { id: 23, kanji: '午', onyomi: ['ゴ'],         kunyomi: ['うま'],           meanings: ['noon'],                   group: 'time' },
  { id: 24, kanji: '前', onyomi: ['ゼン'],       kunyomi: ['まえ', 'さき'],    meanings: ['before', 'front'],        group: 'time' },
  { id: 25, kanji: '後', onyomi: ['ゴ', 'コウ'], kunyomi: ['あと', 'うしろ', 'のち'], meanings: ['after', 'behind'],  group: 'time' },

  // People & family
  { id: 26, kanji: '人', onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'],           meanings: ['person', 'people'],       group: 'people' },
  { id: 27, kanji: '父', onyomi: ['フ'],         kunyomi: ['ちち'],           meanings: ['father'],                 group: 'people' },
  { id: 28, kanji: '母', onyomi: ['ボ'],         kunyomi: ['はは'],           meanings: ['mother'],                 group: 'people' },
  { id: 29, kanji: '友', onyomi: ['ユウ'],       kunyomi: ['とも'],           meanings: ['friend'],                 group: 'people' },
  { id: 30, kanji: '女', onyomi: ['ジョ', 'ニョ'], kunyomi: ['おんな'],         meanings: ['woman', 'female'],        group: 'people' },
  { id: 31, kanji: '男', onyomi: ['ダン', 'ナン'], kunyomi: ['おとこ'],         meanings: ['man', 'male'],            group: 'people',    radicals: [{ char: '田', meaning: 'rice field' }, { char: '力', meaning: 'power' }] },
  { id: 32, kanji: '子', onyomi: ['シ', 'ス'],   kunyomi: ['こ'],             meanings: ['child'],                  group: 'people' },
  { id: 33, kanji: '先', onyomi: ['セン'],       kunyomi: ['さき'],           meanings: ['previous', 'ahead', 'first'], group: 'people' },
  { id: 34, kanji: '生', onyomi: ['セイ', 'ショウ'], kunyomi: ['いきる', 'なま', 'うまれる'], meanings: ['life', 'birth', 'raw'], group: 'people' },
  { id: 35, kanji: '名', onyomi: ['メイ', 'ミョウ'], kunyomi: ['な'],            meanings: ['name', 'fame'],           group: 'people',    radicals: [{ char: '夕', meaning: 'evening' }, { char: '口', meaning: 'mouth' }] },

  // Nature & elements
  { id: 36, kanji: '火', onyomi: ['カ'],         kunyomi: ['ひ', 'ほ'],        meanings: ['fire'],                   group: 'nature' },
  { id: 37, kanji: '水', onyomi: ['スイ'],       kunyomi: ['みず'],           meanings: ['water'],                  group: 'nature' },
  { id: 38, kanji: '木', onyomi: ['モク', 'ボク'], kunyomi: ['き'],             meanings: ['tree', 'wood'],           group: 'nature' },
  { id: 39, kanji: '金', onyomi: ['キン', 'コン'], kunyomi: ['かね', 'かな'],    meanings: ['gold', 'metal', 'money'], group: 'nature' },
  { id: 40, kanji: '土', onyomi: ['ド', 'ト'],   kunyomi: ['つち'],           meanings: ['earth', 'soil', 'ground'], group: 'nature' },
  { id: 41, kanji: '山', onyomi: ['サン'],       kunyomi: ['やま'],           meanings: ['mountain'],               group: 'nature' },
  { id: 42, kanji: '川', onyomi: ['セン'],       kunyomi: ['かわ'],           meanings: ['river', 'stream'],        group: 'nature' },
  { id: 43, kanji: '天', onyomi: ['テン'],       kunyomi: ['あめ', 'あま'],    meanings: ['sky', 'heaven'],          group: 'nature',    radicals: [{ char: '一', meaning: 'one' }, { char: '大', meaning: 'great' }] },
  { id: 44, kanji: '気', onyomi: ['キ', 'ケ'],   kunyomi: [],                 meanings: ['spirit', 'mind', 'energy', 'air'], group: 'nature' },
  { id: 45, kanji: '雨', onyomi: ['ウ'],         kunyomi: ['あめ', 'あま'],    meanings: ['rain'],                   group: 'nature' },
  { id: 46, kanji: '花', onyomi: ['カ'],         kunyomi: ['はな'],           meanings: ['flower'],                 group: 'nature',    radicals: [{ char: '艹', meaning: 'grass, plant' }, { char: '化', meaning: 'transform' }] },
  { id: 47, kanji: '白', onyomi: ['ハク', 'ビャク'], kunyomi: ['しろ'],          meanings: ['white'],                  group: 'nature' },
  { id: 48, kanji: '電', onyomi: ['デン'],       kunyomi: [],                 meanings: ['electricity', 'electric'], group: 'nature' },

  // Direction & position
  { id: 49, kanji: '上', onyomi: ['ジョウ', 'ショウ'], kunyomi: ['うえ', 'うわ', 'かみ'], meanings: ['above', 'up', 'top'],  group: 'direction' },
  { id: 50, kanji: '下', onyomi: ['カ', 'ゲ'],   kunyomi: ['した', 'しも'],    meanings: ['below', 'under', 'down'], group: 'direction' },
  { id: 51, kanji: '左', onyomi: ['サ'],         kunyomi: ['ひだり'],         meanings: ['left'],                   group: 'direction' },
  { id: 52, kanji: '右', onyomi: ['ウ', 'ユウ'], kunyomi: ['みぎ'],           meanings: ['right'],                  group: 'direction' },
  { id: 53, kanji: '中', onyomi: ['チュウ', 'ジュウ'], kunyomi: ['なか'],       meanings: ['inside', 'middle'],       group: 'direction' },
  { id: 54, kanji: '外', onyomi: ['ガイ', 'ゲ'], kunyomi: ['そと', 'ほか'],    meanings: ['outside', 'other'],       group: 'direction', radicals: [{ char: '夕', meaning: 'evening' }, { char: '卜', meaning: 'divination' }] },
  { id: 55, kanji: '東', onyomi: ['トウ'],       kunyomi: ['ひがし'],         meanings: ['east'],                   group: 'direction', radicals: [{ char: '木', meaning: 'tree' }, { char: '日', meaning: 'sun' }] },
  { id: 56, kanji: '西', onyomi: ['セイ', 'サイ'], kunyomi: ['にし'],           meanings: ['west'],                   group: 'direction' },
  { id: 57, kanji: '南', onyomi: ['ナン'],       kunyomi: ['みなみ'],         meanings: ['south'],                  group: 'direction' },
  { id: 58, kanji: '北', onyomi: ['ホク'],       kunyomi: ['きた'],           meanings: ['north'],                  group: 'direction' },

  // School & learning
  { id: 59, kanji: '学', onyomi: ['ガク'],       kunyomi: ['まなぶ'],         meanings: ['learn', 'study'],         group: 'school',    radicals: [{ char: '冖', meaning: 'roof' }, { char: '子', meaning: 'child' }] },
  { id: 60, kanji: '校', onyomi: ['コウ'],       kunyomi: [],                 meanings: ['school'],                 group: 'school',    radicals: [{ char: '木', meaning: 'tree' }, { char: '交', meaning: 'interact' }] },
  { id: 61, kanji: '語', onyomi: ['ゴ'],         kunyomi: ['かたる'],         meanings: ['language', 'word'],       group: 'language',  radicals: [{ char: '言', meaning: 'speech' }, { char: '吾', meaning: 'self' }] },
  { id: 62, kanji: '国', onyomi: ['コク'],       kunyomi: ['くに'],           meanings: ['country', 'nation'],      group: 'language',  radicals: [{ char: '囗', meaning: 'boundary' }, { char: '玉', meaning: 'jewel' }] },

  // Common objects & misc
  { id: 63, kanji: '本', onyomi: ['ホン'],       kunyomi: ['もと'],           meanings: ['book', 'origin'],         group: 'misc',      radicals: [{ char: '木', meaning: 'tree' }, { char: '一', meaning: 'root (marked)' }] },
  { id: 64, kanji: '車', onyomi: ['シャ'],       kunyomi: ['くるま'],         meanings: ['car', 'vehicle'],         group: 'misc' },
  { id: 65, kanji: '円', onyomi: ['エン'],       kunyomi: ['まるい'],         meanings: ['yen', 'circle'],          group: 'misc' },
  { id: 66, kanji: '大', onyomi: ['ダイ', 'タイ'], kunyomi: ['おお'],           meanings: ['big', 'great'],           group: 'misc' },
  { id: 67, kanji: '小', onyomi: ['ショウ'],     kunyomi: ['こ', 'ちいさ'],   meanings: ['small', 'little'],        group: 'misc' },
  { id: 68, kanji: '高', onyomi: ['コウ'],       kunyomi: ['たか'],           meanings: ['tall', 'high', 'expensive'], group: 'misc' },
  { id: 69, kanji: '長', onyomi: ['チョウ'],     kunyomi: ['なが'],           meanings: ['long', 'leader'],         group: 'misc' },
  { id: 70, kanji: '休', onyomi: ['キュウ'],     kunyomi: ['やす'],           meanings: ['rest', 'vacation'],       group: 'misc',      radicals: [{ char: '人', meaning: 'person' }, { char: '木', meaning: 'tree' }] },

  // Actions (verb kanji)
  { id: 71, kanji: '行', onyomi: ['コウ', 'ギョウ'], kunyomi: ['いく', 'ゆく'],  meanings: ['go', 'carry out'],        group: 'actions' },
  { id: 72, kanji: '来', onyomi: ['ライ'],       kunyomi: ['くる', 'きたる'],  meanings: ['come'],                   group: 'actions' },
  { id: 73, kanji: '見', onyomi: ['ケン'],       kunyomi: ['みる', 'みえる'],  meanings: ['see', 'show'],            group: 'actions',   radicals: [{ char: '目', meaning: 'eye' }, { char: '儿', meaning: 'legs' }] },
  { id: 74, kanji: '食', onyomi: ['ショク', 'ジキ'], kunyomi: ['たべる', 'くう'], meanings: ['eat', 'food'],           group: 'actions' },
  { id: 75, kanji: '飲', onyomi: ['イン'],       kunyomi: ['のむ'],           meanings: ['drink'],                  group: 'actions',   radicals: [{ char: '食', meaning: 'eat' }, { char: '欠', meaning: 'lack, yawn' }] },
  { id: 76, kanji: '聞', onyomi: ['ブン', 'モン'], kunyomi: ['きく'],           meanings: ['hear', 'listen', 'ask'],  group: 'actions',   radicals: [{ char: '門', meaning: 'gate' }, { char: '耳', meaning: 'ear' }] },
  { id: 77, kanji: '話', onyomi: ['ワ'],         kunyomi: ['はなし', 'はなす'], meanings: ['talk', 'story', 'speak'], group: 'actions',   radicals: [{ char: '言', meaning: 'speech' }, { char: '舌', meaning: 'tongue' }] },
  { id: 78, kanji: '読', onyomi: ['ドク', 'トウ'], kunyomi: ['よむ'],           meanings: ['read'],                   group: 'actions',   radicals: [{ char: '言', meaning: 'speech' }, { char: '売', meaning: 'sell' }] },
  { id: 79, kanji: '書', onyomi: ['ショ'],       kunyomi: ['かく'],           meanings: ['write', 'document'],      group: 'actions',   radicals: [{ char: '聿', meaning: 'brush' }, { char: '日', meaning: 'sun' }] },
  { id: 80, kanji: '出', onyomi: ['シュツ'],     kunyomi: ['でる', 'だす'],    meanings: ['exit', 'go out', 'put out'], group: 'actions' },
  { id: 81, kanji: '入', onyomi: ['ニュウ'],     kunyomi: ['いれる', 'はいる'], meanings: ['enter', 'insert'],        group: 'actions' },
  { id: 82, kanji: '会', onyomi: ['カイ', 'エ'], kunyomi: ['あう'],           meanings: ['meet', 'assembly', 'society'], group: 'actions' },
  { id: 83, kanji: '何', onyomi: ['カ'],         kunyomi: ['なに', 'なん'],    meanings: ['what', 'how many'],       group: 'misc',      radicals: [{ char: '人', meaning: 'person' }, { char: '可', meaning: 'can, possible' }] },
];

export const kanjiGroups: Record<KanjiEntry['group'], string> = {
  numbers:   'Numbers · 数字',
  time:      'Time · 時間',
  people:    'People · 人',
  nature:    'Nature · 自然',
  direction: 'Direction · 方向',
  school:    'School · 学校',
  language:  'Language · 言語',
  actions:   'Actions · 動作',
  misc:      'Other · その他',
};

export const GROUP_ORDER: KanjiEntry['group'][] = [
  'numbers', 'time', 'people', 'nature', 'direction', 'school', 'language', 'actions', 'misc',
];
