export interface GrammarPoint {
  id: string;
  pattern: string;
  romaji: string;
  meaning: string;
  level: 'N5' | 'N4';
  structure: string;
  explanation: string;
  examples: { jp: string; en: string }[];
  notes?: string;
  relatedPatterns?: string[];
}

export const grammarPoints: GrammarPoint[] = [
  {
    id: 'desu',
    pattern: '〜です',
    romaji: '~desu',
    meaning: 'to be (polite)',
    level: 'N5',
    structure: '[Noun / な-adjective] + です',
    explanation:
      'The polite copula. Placed at the end of a sentence to assert identity or state. Negative form: ではありません (dewa arimasen). Past form: でした (deshita).',
    examples: [
      { jp: '私は学生です。', en: 'I am a student.' },
      { jp: '今日は月曜日です。', en: 'Today is Monday.' },
      { jp: 'これは私の本ではありません。', en: 'This is not my book.' },
    ],
    relatedPatterns: ['da', 'masu'],
  },
  {
    id: 'masu',
    pattern: '〜ます',
    romaji: '~masu',
    meaning: 'polite verb ending',
    level: 'N5',
    structure: 'Verb stem + ます',
    explanation:
      'The polite present/future verb form. Negative: ません. Past: ました. Past negative: ませんでした.',
    examples: [
      { jp: '毎日勉強します。', en: 'I study every day.' },
      { jp: '明日、東京に行きます。', en: 'I will go to Tokyo tomorrow.' },
      { jp: '昨日は学校に行きませんでした。', en: 'I didn\'t go to school yesterday.' },
    ],
    notes: 'ます form is always safe and polite — use it with people you don\'t know well.',
    relatedPatterns: ['desu', 'te-form'],
  },
  {
    id: 'te-form',
    pattern: '〜て / 〜で',
    romaji: '~te / ~de',
    meaning: 'connecting form (and, then, please)',
    level: 'N5',
    structure: 'Verb て-form',
    explanation:
      'The て-form has many uses: connecting sequential actions, making requests (〜てください), describing ongoing states (〜ている), and more. The form is 〜で for voiced-consonant verbs (verbs ending in ぐ・ぬ・ぶ・む).',
    examples: [
      { jp: '手を洗って、ご飯を食べます。', en: 'I wash my hands and then eat.' },
      { jp: '窓を開けてください。', en: 'Please open the window.' },
      { jp: '本を読んでいます。', en: 'I am reading a book.' },
    ],
    relatedPatterns: ['te-iru', 'te-kudasai'],
  },
  {
    id: 'te-iru',
    pattern: '〜ている',
    romaji: '~te iru',
    meaning: 'ongoing action / resultant state',
    level: 'N5',
    structure: 'Verb て-form + いる',
    explanation:
      'Two main uses: (1) an action in progress right now (like English "-ing"), or (2) a state that results from a completed action.',
    examples: [
      { jp: '今、音楽を聞いています。', en: 'I am listening to music right now.' },
      { jp: '結婚しています。', en: 'I am married. (= I got married and am in that state)' },
      { jp: '彼はコンビニで働いています。', en: 'He works at a convenience store.' },
    ],
    notes: 'In casual speech, いる contracts to る: 食べてる (tabeteru).',
    relatedPatterns: ['te-form'],
  },
  {
    id: 'nai-form',
    pattern: '〜ない',
    romaji: '~nai',
    meaning: 'plain negative',
    level: 'N5',
    structure: 'Verb plain negative form',
    explanation:
      'The plain (dictionary-style) negative of verbs. Used in casual speech and as a base for other constructions. Group 1 verbs: change the final u-row sound to a-row + ない. Group 2 verbs: drop る + ない. Irregular: しない / こない.',
    examples: [
      { jp: '今日は学校に行かない。', en: 'I\'m not going to school today.' },
      { jp: '肉を食べない人もいます。', en: 'There are also people who don\'t eat meat.' },
      { jp: '分からないことがあります。', en: 'There are things I don\'t understand.' },
    ],
    relatedPatterns: ['masu', 'naide'],
  },
  {
    id: 'tai',
    pattern: '〜たい',
    romaji: '~tai',
    meaning: 'want to do',
    level: 'N5',
    structure: 'Verb stem + たい',
    explanation:
      'Expresses the speaker\'s desire to do something. Conjugates like an い-adjective (たくない, たかった, たくなかった). Only used for the speaker\'s own desires — for others\' desires, use 〜たがっている.',
    examples: [
      { jp: '日本に行きたいです。', en: 'I want to go to Japan.' },
      { jp: '何が食べたいですか？', en: 'What do you want to eat?' },
      { jp: '今日は何もしたくない。', en: 'I don\'t want to do anything today.' },
    ],
    relatedPatterns: ['hoshii'],
  },
  {
    id: 'ga-hoshii',
    pattern: '〜がほしい',
    romaji: '~ga hoshii',
    meaning: 'want (something)',
    level: 'N5',
    structure: '[Noun] + がほしい',
    explanation:
      'Used to express desire for a noun (thing). Unlike たい which applies to verbs, ほしい applies to nouns. For someone else\'s desire, use ほしがっている.',
    examples: [
      { jp: '新しい自転車がほしいです。', en: 'I want a new bicycle.' },
      { jp: '時間がほしい。', en: 'I want time.' },
    ],
    relatedPatterns: ['tai'],
  },
  {
    id: 'koto-ga-dekiru',
    pattern: '〜ことができる',
    romaji: '~koto ga dekiru',
    meaning: 'can, be able to',
    level: 'N5',
    structure: 'Verb (dictionary form) + ことができる',
    explanation:
      'Expresses ability or possibility. The simpler potential form (食べられる, 行ける) is more common in conversation, but ことができる is clearer and frequently used.',
    examples: [
      { jp: '日本語を話すことができます。', en: 'I can speak Japanese.' },
      { jp: 'ここで写真を撮ることができますか？', en: 'Can I take photos here?' },
    ],
    relatedPatterns: ['potential'],
  },
  {
    id: 'node',
    pattern: '〜ので',
    romaji: '~node',
    meaning: 'because, so (soft reason)',
    level: 'N5',
    structure: 'Plain form + ので',
    explanation:
      'Gives a reason or cause. Softer and more objective-sounding than から. Often preferred in formal or polite contexts.',
    examples: [
      { jp: '雨なので、外に出ません。', en: 'Because it\'s raining, I won\'t go outside.' },
      { jp: '疲れたので、もう寝ます。', en: 'I\'m tired, so I\'m going to sleep.' },
    ],
    notes: 'ので sounds more polite and explanatory; から sounds more direct and causal.',
    relatedPatterns: ['kara-reason'],
  },
  {
    id: 'mo-ii',
    pattern: '〜てもいい',
    romaji: '~te mo ii',
    meaning: 'it\'s okay to, may, can',
    level: 'N5',
    structure: 'Verb て-form + もいい',
    explanation:
      'Gives or requests permission. To ask permission: 〜てもいいですか？ To deny permission: 〜てはいけません.',
    examples: [
      { jp: 'ここに座ってもいいですか？', en: 'May I sit here?' },
      { jp: 'はい、座ってもいいです。', en: 'Yes, you may sit.' },
      { jp: 'ここで写真を撮ってはいけません。', en: 'You must not take photos here.' },
    ],
    relatedPatterns: ['nakereba-naranai'],
  },
  {
    id: 'nakereba-naranai',
    pattern: '〜なければならない',
    romaji: '~nakereba naranai',
    meaning: 'must, have to',
    level: 'N5',
    structure: 'Verb ない-form → replace ない with なければならない',
    explanation:
      'Expresses obligation or necessity. In casual speech, often shortened to 〜なきゃ or 〜なければ. Another common form: 〜ないといけない.',
    examples: [
      { jp: '宿題をしなければなりません。', en: 'I have to do my homework.' },
      { jp: '薬を飲まなければならない。', en: 'I must take medicine.' },
      { jp: '早く寝なきゃ。', en: 'I gotta sleep early. (casual)' },
    ],
    relatedPatterns: ['mo-ii'],
  },
  {
    id: 'to-omou',
    pattern: '〜と思う',
    romaji: '~to omou',
    meaning: 'I think that ~',
    level: 'N5',
    structure: '[Plain form clause] + と思う',
    explanation:
      'Expresses the speaker\'s opinion or assumption. The clause before と is in plain form. For an ongoing thought or assumption about someone else, use 〜と思っている.',
    examples: [
      { jp: '明日は晴れると思います。', en: 'I think it will be sunny tomorrow.' },
      { jp: 'これは難しいと思います。', en: 'I think this is difficult.' },
      { jp: '彼は正しいと思わない。', en: 'I don\'t think he is right.' },
    ],
  },
  {
    id: 'desho',
    pattern: '〜でしょう',
    romaji: '~deshou',
    meaning: 'probably, I suppose',
    level: 'N5',
    structure: 'Plain form + でしょう',
    explanation:
      'Expresses conjecture or probability. With rising intonation, it becomes a confirmation-seeking question (like ね but stronger). In casual speech: だろう.',
    examples: [
      { jp: '明日は雨でしょう。', en: 'It will probably rain tomorrow.' },
      { jp: '彼女は来ないでしょう。', en: 'She probably won\'t come.' },
      { jp: 'そうでしょう？', en: 'That\'s right, isn\'t it?' },
    ],
    relatedPatterns: ['to-omou'],
  },
];
