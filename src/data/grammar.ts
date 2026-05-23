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
  // ── Core copula & verb forms ──────────────────────────────────────────────────
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
    relatedPatterns: ['masu'],
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
    relatedPatterns: ['masu'],
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
    relatedPatterns: ['ga-hoshii'],
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
      { jp: '時間がほしい。', en: 'I want (more) time.' },
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
      'Expresses the speaker\'s opinion or assumption. The clause before と is in plain form. For an ongoing thought about someone else\'s state, use 〜と思っている.',
    examples: [
      { jp: '明日は晴れると思います。', en: 'I think it will be sunny tomorrow.' },
      { jp: 'これは難しいと思います。', en: 'I think this is difficult.' },
      { jp: '彼は正しいと思わない。', en: 'I don\'t think he is right.' },
    ],
    relatedPatterns: ['desho'],
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
    relatedPatterns: ['to-omou', 'kamoshirenai'],
  },

  // ── Time & sequence ───────────────────────────────────────────────────────────
  {
    id: 'kara-reason',
    pattern: '〜から',
    romaji: '~kara',
    meaning: 'because, so (direct reason)',
    level: 'N5',
    structure: '[Plain form / Noun+だ / な-adj+だ] + から',
    explanation:
      'States a cause or reason. More direct and subjective than ので. Common in both spoken and written Japanese. Can also mean "from" (time/place) as a particle.',
    examples: [
      { jp: '眠いから、早く帰ります。', en: 'I\'m sleepy, so I\'m going home early.' },
      { jp: 'お金がないから、行けません。', en: 'Because I have no money, I can\'t go.' },
      { jp: '学生だから、割引があります。', en: 'Because I\'m a student, there is a discount.' },
    ],
    notes: 'から sounds more direct/personal than ので. Use ので in polite or formal situations.',
    relatedPatterns: ['node'],
  },
  {
    id: 'mae-ni',
    pattern: '〜前に',
    romaji: '~mae ni',
    meaning: 'before doing ~',
    level: 'N5',
    structure: 'Verb (dictionary form) + 前に | Noun + の前に',
    explanation:
      'Indicates something happens before another action or time. The verb before 前に is always in dictionary (plain non-past) form, even when the main clause is past tense.',
    examples: [
      { jp: '寝る前に歯を磨きます。', en: 'I brush my teeth before sleeping.' },
      { jp: '食事の前に手を洗ってください。', en: 'Please wash your hands before the meal.' },
      { jp: '日本に来る前に、日本語を勉強しました。', en: 'Before coming to Japan, I studied Japanese.' },
    ],
    relatedPatterns: ['ato-de', 'te-kara'],
  },
  {
    id: 'ato-de',
    pattern: '〜後で / 〜た後で',
    romaji: '~ato de / ~ta ato de',
    meaning: 'after doing ~',
    level: 'N5',
    structure: 'Verb (た-form) + 後で | Noun + の後で',
    explanation:
      'Indicates something happens after another action. The verb before 後で is usually in the past (た) form. Compare with 〜てから, which emphasizes that the first action must be fully completed before the second.',
    examples: [
      { jp: '宿題をした後で、ゲームをしました。', en: 'After doing my homework, I played games.' },
      { jp: '授業の後で、図書館に行きます。', en: 'After class, I\'ll go to the library.' },
    ],
    relatedPatterns: ['te-kara', 'mae-ni'],
  },
  {
    id: 'te-kara',
    pattern: '〜てから',
    romaji: '~te kara',
    meaning: 'after doing ~ (then ...)',
    level: 'N5',
    structure: 'Verb て-form + から',
    explanation:
      'Indicates a strict sequence: the first action must be fully completed before the second begins. Implies the second action depends on or follows directly from the first. Stronger sense of order than 〜後で.',
    examples: [
      { jp: '手を洗ってから、食べてください。', en: 'After washing your hands, please eat.' },
      { jp: '大学を卒業してから、就職しました。', en: 'After graduating from university, I got a job.' },
      { jp: 'シャワーを浴びてから、寝ます。', en: 'I\'ll sleep after taking a shower.' },
    ],
    relatedPatterns: ['ato-de', 'te-form'],
  },
  {
    id: 'toki',
    pattern: '〜とき',
    romaji: '~toki',
    meaning: 'when, at the time of',
    level: 'N5',
    structure: 'Verb (plain form) / Noun + の / い-adj + とき',
    explanation:
      'Expresses the time when something occurs. If the main-clause action happens while the とき clause is ongoing, use the dictionary form (子どもの→今も). If it happens after completion, use た-form before とき.',
    examples: [
      { jp: '困ったとき、彼に電話します。', en: 'When I\'m in trouble, I call him.' },
      { jp: '子どものとき、よく川で遊びました。', en: 'When I was a child, I often played in the river.' },
      { jp: '東京に行くとき、お土産を買ってきてください。', en: 'When you go to Tokyo, please bring back a souvenir.' },
    ],
    relatedPatterns: ['mae-ni', 'ato-de'],
  },

  // ── Experience & attempt ──────────────────────────────────────────────────────
  {
    id: 'ta-koto-ga-aru',
    pattern: '〜たことがある',
    romaji: '~ta koto ga aru',
    meaning: 'have done ~ before (experience)',
    level: 'N5',
    structure: 'Verb (た-form) + ことがある',
    explanation:
      'Expresses that you have had the experience of doing something at least once. The negative 〜たことがない means you have never done it.',
    examples: [
      { jp: '富士山に登ったことがあります。', en: 'I have climbed Mt. Fuji before.' },
      { jp: '刺身を食べたことがありますか？', en: 'Have you ever eaten sashimi?' },
      { jp: '日本に行ったことがない。', en: 'I\'ve never been to Japan.' },
    ],
    relatedPatterns: ['te-miru'],
  },
  {
    id: 'te-miru',
    pattern: '〜てみる',
    romaji: '~te miru',
    meaning: 'try doing ~, do ~ and see',
    level: 'N5',
    structure: 'Verb て-form + みる',
    explanation:
      'Expresses attempting an action to see what happens. みる comes from 見る (to see), implying "let\'s see what happens." Often used when trying something for the first time or experimentally.',
    examples: [
      { jp: 'この料理を食べてみてください。', en: 'Please try eating this dish.' },
      { jp: '日本語で話してみました。', en: 'I tried speaking in Japanese.' },
      { jp: '一度やってみます。', en: 'I\'ll give it a try.' },
    ],
    relatedPatterns: ['ta-koto-ga-aru', 'te-oku'],
  },
  {
    id: 'te-oku',
    pattern: '〜ておく',
    romaji: '~te oku',
    meaning: 'do ~ in advance, leave ~ done',
    level: 'N5',
    structure: 'Verb て-form + おく',
    explanation:
      'Indicates doing something as preparation for a future situation, or leaving something in a state for later. Often contracted to 〜とく in casual speech.',
    examples: [
      { jp: '旅行の前に、ホテルを予約しておきます。', en: 'Before the trip, I\'ll book a hotel in advance.' },
      { jp: '冷蔵庫に入れておいてください。', en: 'Please put it in the fridge (for later).' },
      { jp: '連絡先を書いとく。', en: 'I\'ll write down the contact info (for later). (casual)' },
    ],
    notes: 'Casual contraction: 〜ておく → 〜とく (食べておく → 食べとく).',
    relatedPatterns: ['te-miru', 'te-shimau'],
  },
  {
    id: 'te-shimau',
    pattern: '〜てしまう',
    romaji: '~te shimau',
    meaning: 'end up doing ~, do ~ completely',
    level: 'N5',
    structure: 'Verb て-form + しまう',
    explanation:
      'Two main uses: (1) completing an action fully and definitively, or (2) expressing regret or surprise about an unintended outcome. Casual forms: 〜ちゃう (て + しまう) and 〜じゃう (で + しまう).',
    examples: [
      { jp: '宿題をしてしまいました。', en: 'I finished all my homework (completely).' },
      { jp: '財布を忘れてしまった！', en: 'I ended up forgetting my wallet!' },
      { jp: 'ケーキを全部食べちゃった。', en: 'I ate up all the cake. (casual, regretful)' },
    ],
    notes: 'Casual: してしまう → しちゃう, 食べてしまう → 食べちゃう.',
    relatedPatterns: ['te-oku'],
  },

  // ── Change & ability ──────────────────────────────────────────────────────────
  {
    id: 'ni-naru',
    pattern: '〜になる / 〜くなる',
    romaji: '~ni naru / ~ku naru',
    meaning: 'to become ~',
    level: 'N5',
    structure: 'Noun / な-adj + になる | い-adj (く-form) + なる',
    explanation:
      'Expresses a change into a new state. Use になる with nouns and な-adjectives. Use くなる with い-adjectives (replace い with く). To express making something become X, use 〜にする / 〜くする.',
    examples: [
      { jp: '医者になりたいです。', en: 'I want to become a doctor.' },
      { jp: '暖かくなってきました。', en: 'It has gotten warmer.' },
      { jp: '上手になりましたね。', en: 'You\'ve gotten better, haven\'t you?' },
    ],
    relatedPatterns: ['sugiru'],
  },
  {
    id: 'potential',
    pattern: '〜(ら)れる',
    romaji: '~(ra)reru',
    meaning: 'can, be able to (potential form)',
    level: 'N5',
    structure: 'Group 1: u→e+る | Group 2: drop る+られる | Irregular: できる / こられる',
    explanation:
      'The potential form expresses ability. Group 1 verbs: change final u-row to e-row + る (書く→書ける). Group 2: drop る + られる, though casual speech often uses られる→れる (食べれる). Irregular: する→できる, くる→こられる.',
    examples: [
      { jp: '日本語が話せますか？', en: 'Can you speak Japanese?' },
      { jp: '明日、来られますか？', en: 'Can you come tomorrow?' },
      { jp: '辛い物が食べられません。', en: 'I can\'t eat spicy food.' },
    ],
    notes: 'In casual speech られる is often shortened to れる: 食べられる → 食べれる.',
    relatedPatterns: ['koto-ga-dekiru'],
  },

  // ── Degree & restriction ──────────────────────────────────────────────────────
  {
    id: 'nagara',
    pattern: '〜ながら',
    romaji: '~nagara',
    meaning: 'while doing ~ (simultaneous actions)',
    level: 'N5',
    structure: 'Verb stem + ながら',
    explanation:
      'Indicates two actions happening simultaneously by the same subject. The main (more important) action goes in the main clause. Cannot be used when subjects are different.',
    examples: [
      { jp: '音楽を聞きながら、勉強します。', en: 'I study while listening to music.' },
      { jp: '歩きながら電話しないでください。', en: 'Please don\'t talk on the phone while walking.' },
      { jp: 'コーヒーを飲みながら話しましょう。', en: 'Let\'s talk over coffee.' },
    ],
    relatedPatterns: ['te-iru'],
  },
  {
    id: 'dake',
    pattern: '〜だけ',
    romaji: '~dake',
    meaning: 'only, just, merely',
    level: 'N5',
    structure: 'Noun / Verb (plain form) + だけ',
    explanation:
      'Limits or restricts to a specific amount or action. More neutral in tone than しか, which always pairs with a negative and carries a nuance of insufficiency.',
    examples: [
      { jp: '一つだけください。', en: 'Just one, please.' },
      { jp: '少しだけ食べました。', en: 'I ate just a little.' },
      { jp: 'できるだけ早く来てください。', en: 'Please come as soon as possible.' },
    ],
    notes: 'できるだけ (as much as possible) is a very common fixed expression.',
    relatedPatterns: ['shika-nai'],
  },
  {
    id: 'shika-nai',
    pattern: '〜しか〜ない',
    romaji: '~shika ~nai',
    meaning: 'only, nothing but (limited amount)',
    level: 'N5',
    structure: 'Noun / Verb dictionary form + しか + negative verb',
    explanation:
      'Expresses that something is limited to only X, always used with a negative verb. Carries a nuance that the amount or option is insufficient or less than expected.',
    examples: [
      { jp: '百円しかない。', en: 'I only have 100 yen. (and it\'s not enough)' },
      { jp: '日本語しか話せません。', en: 'I can only speak Japanese.' },
      { jp: 'これしか残っていない。', en: 'This is all that\'s left.' },
    ],
    relatedPatterns: ['dake'],
  },
  {
    id: 'sugiru',
    pattern: '〜すぎる',
    romaji: '~sugiru',
    meaning: 'too much, excessively',
    level: 'N5',
    structure: 'Verb stem / い-adj (drop い) / な-adj + すぎる',
    explanation:
      'Indicates excess. すぎる itself conjugates as a Group 2 verb (すぎます, すぎて, etc.). Used for both physical quantities (ate too much) and qualities (too difficult).',
    examples: [
      { jp: '食べすぎました。', en: 'I ate too much.' },
      { jp: 'この問題は難しすぎます。', en: 'This problem is too difficult.' },
      { jp: '彼は真面目すぎる。', en: 'He is overly serious.' },
    ],
    relatedPatterns: ['ni-naru'],
  },

  // ── Advice & conjecture ───────────────────────────────────────────────────────
  {
    id: 'hou-ga-ii',
    pattern: '〜ほうがいい',
    romaji: '~hou ga ii',
    meaning: 'it\'s better to ~, you should ~',
    level: 'N5',
    structure: 'Verb (た-form for positive advice; ない-form for negative) + ほうがいい',
    explanation:
      'Gives advice or recommendation. For positive advice, use the た-form (you should do). For negative advice (you\'d better not), use the ない-form.',
    examples: [
      { jp: '早く寝たほうがいいですよ。', en: 'You should go to sleep early.' },
      { jp: '薬を飲んだほうがいい。', en: 'You\'d better take medicine.' },
      { jp: '無理しないほうがいいです。', en: 'You\'d better not push yourself too hard.' },
    ],
    relatedPatterns: ['nakereba-naranai', 'kamoshirenai'],
  },
  {
    id: 'kamoshirenai',
    pattern: '〜かもしれない',
    romaji: '~kamoshirenai',
    meaning: 'might, may, perhaps',
    level: 'N5',
    structure: 'Verb/い-adj (plain) / Noun / な-adj (plain) + かもしれない',
    explanation:
      'Expresses possibility or uncertainty. Less certain than でしょう. Polite form: かもしれません.',
    examples: [
      { jp: '明日は雨かもしれません。', en: 'It might rain tomorrow.' },
      { jp: '彼は来ないかもしれない。', en: 'He might not come.' },
      { jp: '私が間違っているかもしれません。', en: 'I might be wrong.' },
    ],
    relatedPatterns: ['desho', 'to-omou'],
  },

  // ── Doing for others ──────────────────────────────────────────────────────────
  {
    id: 'te-ageru',
    pattern: '〜てあげる / てもらう / てくれる',
    romaji: '~te ageru / te morau / te kureru',
    meaning: 'do for someone / have someone do / someone does for me',
    level: 'N5',
    structure: 'Verb て-form + あげる / もらう / くれる',
    explanation:
      'These three forms express doing favors or receiving them. あげる: I (or someone) does for another. もらう: I receive the action (have someone do it). くれる: someone does for me, emphasizing their kindness.',
    examples: [
      { jp: '友達に本を貸してあげました。', en: 'I lent a book to my friend (as a favor).' },
      { jp: '先生に説明してもらいました。', en: 'I had the teacher explain it to me.' },
      { jp: '母が料理を作ってくれました。', en: 'My mother made food for me (I appreciate it).' },
    ],
    notes: 'くれる is always directed toward the speaker or their in-group.',
    relatedPatterns: ['te-iru'],
  },

  // ── Useful structures ─────────────────────────────────────────────────────────
  {
    id: 'kata',
    pattern: '〜方',
    romaji: '~kata',
    meaning: 'way of doing ~, how to ~',
    level: 'N5',
    structure: 'Verb stem + 方',
    explanation:
      'Forms a noun meaning "the way of doing X" or "how to do X." Used to ask or explain methods.',
    examples: [
      { jp: 'この漢字の読み方は何ですか？', en: 'How do you read this kanji?' },
      { jp: '日本語の書き方を教えてください。', en: 'Please teach me how to write in Japanese.' },
      { jp: '使い方が分かりません。', en: 'I don\'t understand how to use it.' },
    ],
    relatedPatterns: ['koto-ga-dekiru'],
  },
  {
    id: 'shi',
    pattern: '〜し',
    romaji: '~shi',
    meaning: 'and also, besides (listing reasons)',
    level: 'N5',
    structure: 'Plain form + し (can stack multiple)',
    explanation:
      'Lists multiple parallel reasons or qualities. Implies there are also other reasons beyond what\'s listed. Often stacked: 〜し、〜し、〜。',
    examples: [
      { jp: '彼女は頭がいいし、優しいし、面白い。', en: 'She\'s smart, kind, and interesting (among other things).' },
      { jp: '疲れたし、お腹も空いたし、帰ります。', en: 'I\'m tired, I\'m hungry too, so I\'m going home.' },
      { jp: '雨だし、寒いし、出かけたくない。', en: 'It\'s raining, it\'s cold too, so I don\'t want to go out.' },
    ],
    relatedPatterns: ['kara-reason', 'node'],
  },
];
