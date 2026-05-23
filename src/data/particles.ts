export interface ParticleExample {
  jp: string;
  en: string;
}

export interface Particle {
  particle: string;
  romaji: string;
  name: string;
  summary: string;
  usages: {
    label: string;
    explanation: string;
    examples: ParticleExample[];
  }[];
  tip?: string;
  confusedWith?: string[];
}

export const particles: Particle[] = [
  {
    particle: 'は',
    romaji: 'wa',
    name: 'Topic Marker',
    summary: 'Marks the topic of the sentence — what the sentence is about.',
    usages: [
      {
        label: 'Topic marker',
        explanation: 'Introduces or shifts the topic. Everything after は says something about it.',
        examples: [
          { jp: '私は学生です。', en: 'I am a student.' },
          { jp: '東京は大きい都市です。', en: 'Tokyo is a big city.' },
        ],
      },
      {
        label: 'Contrast',
        explanation: 'When は replaces が or を, it often carries a contrastive nuance.',
        examples: [
          { jp: 'コーヒーは飲みますが、紅茶は飲みません。', en: 'I drink coffee, but I don\'t drink tea.' },
        ],
      },
    ],
    tip: 'は is written as "ha" in romaji but pronounced "wa" as a particle.',
    confusedWith: ['が'],
  },
  {
    particle: 'が',
    romaji: 'ga',
    name: 'Subject Marker',
    summary: 'Marks the grammatical subject — the doer of the action or the one being described.',
    usages: [
      {
        label: 'Subject in new information',
        explanation: 'Use が when introducing the subject for the first time or answering a "who/what" question.',
        examples: [
          { jp: '誰が来ましたか？　田中さんが来ました。', en: 'Who came? Mr. Tanaka came.' },
          { jp: '猫が魚を食べました。', en: 'The cat ate the fish.' },
        ],
      },
      {
        label: 'With stative verbs',
        explanation: 'Verbs like 好き, 嫌い, 分かる, できる always use が for their object.',
        examples: [
          { jp: '日本語が好きです。', en: 'I like Japanese.' },
          { jp: '英語が分かりません。', en: 'I don\'t understand English.' },
        ],
      },
      {
        label: 'Existence (ある・いる)',
        explanation: 'The thing that exists is marked with が.',
        examples: [
          { jp: '公園に犬がいます。', en: 'There is a dog in the park.' },
          { jp: 'テーブルの上に本があります。', en: 'There is a book on the table.' },
        ],
      },
    ],
    tip: 'は focuses on the topic; が focuses on the subject. は = "as for X", が = "X (specifically) is the one".',
    confusedWith: ['は'],
  },
  {
    particle: 'を',
    romaji: 'wo',
    name: 'Object Marker',
    summary: 'Marks the direct object — what the action is done to.',
    usages: [
      {
        label: 'Direct object',
        explanation: 'The thing being acted upon.',
        examples: [
          { jp: 'パンを食べます。', en: 'I eat bread.' },
          { jp: '本を読みました。', en: 'I read a book.' },
          { jp: '音楽を聞きます。', en: 'I listen to music.' },
        ],
      },
      {
        label: 'Movement through a space',
        explanation: 'を marks a space being passed through or moved along.',
        examples: [
          { jp: '公園を歩きます。', en: 'I walk through the park.' },
          { jp: '橋を渡ります。', en: 'I cross the bridge.' },
        ],
      },
    ],
    tip: 'を is written "wo" but pronounced "o" as a particle.',
  },
  {
    particle: 'に',
    romaji: 'ni',
    name: 'Direction / Time / Location',
    summary: 'Multi-purpose: destination, point in time, or location of existence.',
    usages: [
      {
        label: 'Destination (movement)',
        explanation: 'Where you are going to or arriving at.',
        examples: [
          { jp: '学校に行きます。', en: 'I go to school.' },
          { jp: '日本に来ました。', en: 'I came to Japan.' },
        ],
      },
      {
        label: 'Specific point in time',
        explanation: 'Specific times, days, dates. Not used for relative time words (今日, 明日, etc.).',
        examples: [
          { jp: '七時に起きます。', en: 'I wake up at 7 o\'clock.' },
          { jp: '月曜日に会議があります。', en: 'There is a meeting on Monday.' },
        ],
      },
      {
        label: 'Location of existence',
        explanation: 'Where something or someone is (with いる / ある).',
        examples: [
          { jp: '部屋に猫がいます。', en: 'There is a cat in the room.' },
          { jp: '冷蔵庫にミルクがあります。', en: 'There is milk in the fridge.' },
        ],
      },
      {
        label: 'Indirect object',
        explanation: 'The recipient of an action.',
        examples: [
          { jp: '友達に手紙を書きました。', en: 'I wrote a letter to my friend.' },
          { jp: '先生に質問します。', en: 'I ask the teacher a question.' },
        ],
      },
    ],
    tip: 'Think of に as a precise point — a destination, a time, or a fixed location.',
    confusedWith: ['で', 'へ'],
  },
  {
    particle: 'で',
    romaji: 'de',
    name: 'Location of Action / Means',
    summary: 'Marks where an action takes place, or the tool / method / reason used.',
    usages: [
      {
        label: 'Location of action',
        explanation: 'Where an action happens (unlike に which marks static existence).',
        examples: [
          { jp: '図書館で勉強します。', en: 'I study at the library.' },
          { jp: '公園でサッカーをします。', en: 'I play soccer in the park.' },
        ],
      },
      {
        label: 'Means or tool',
        explanation: 'How something is done — by what method, tool, or language.',
        examples: [
          { jp: '電車で来ました。', en: 'I came by train.' },
          { jp: '日本語で話しましょう。', en: 'Let\'s speak in Japanese.' },
          { jp: 'ハシで食べます。', en: 'I eat with chopsticks.' },
        ],
      },
      {
        label: 'Reason or cause',
        explanation: 'The reason or cause of something.',
        examples: [
          { jp: '病気で学校を休みました。', en: 'I was absent from school because of illness.' },
        ],
      },
    ],
    tip: 'に vs で for location: 公園にいます (I am at the park — static). 公園で遊びます (I play at the park — action).',
    confusedWith: ['に'],
  },
  {
    particle: 'と',
    romaji: 'to',
    name: 'And / With / Quotation',
    summary: 'Connects nouns (and), marks accompaniment (with), or introduces a quotation.',
    usages: [
      {
        label: 'And (exhaustive list)',
        explanation: 'Connects nouns in a complete list. Unlike や, implies these are all the items.',
        examples: [
          { jp: '猫と犬が好きです。', en: 'I like cats and dogs.' },
          { jp: '鉛筆と消しゴムを買いました。', en: 'I bought a pencil and an eraser.' },
        ],
      },
      {
        label: 'With (accompaniment)',
        explanation: 'Doing something together with someone.',
        examples: [
          { jp: '友達と映画を見ました。', en: 'I watched a movie with a friend.' },
          { jp: '家族と旅行します。', en: 'I travel with my family.' },
        ],
      },
      {
        label: 'Quotation marker',
        explanation: 'Introduces what was said, thought, or named.',
        examples: [
          { jp: '「行きます」と言いました。', en: 'I said "I will go."' },
          { jp: 'これは何と言いますか？', en: 'What do you call this?' },
        ],
      },
    ],
    confusedWith: ['や'],
  },
  {
    particle: 'の',
    romaji: 'no',
    name: 'Possession / Relation',
    summary: 'Connects nouns showing possession, belonging, or description.',
    usages: [
      {
        label: 'Possession',
        explanation: 'Like "\'s" in English.',
        examples: [
          { jp: '私の本です。', en: 'It is my book.' },
          { jp: '田中さんの車は赤いです。', en: 'Mr. Tanaka\'s car is red.' },
        ],
      },
      {
        label: 'Describing relationship',
        explanation: 'Groups, organisations, locations.',
        examples: [
          { jp: '東京大学の学生です。', en: 'I am a student at the University of Tokyo.' },
          { jp: '日本の食べ物が好きです。', en: 'I like Japanese food.' },
        ],
      },
      {
        label: 'Nominaliser',
        explanation: 'Turns a verb or adjective clause into a noun.',
        examples: [
          { jp: '日本語を勉強するのが好きです。', en: 'I like studying Japanese.' },
          { jp: '食べるのを忘れました。', en: 'I forgot to eat.' },
        ],
      },
    ],
  },
  {
    particle: 'も',
    romaji: 'mo',
    name: 'Also / Too / Even',
    summary: 'Replaces は or が to add "also" or "too"; used after numbers for "as many as / as few as".',
    usages: [
      {
        label: 'Also / too',
        explanation: 'Replaces は or が and adds the meaning of inclusion.',
        examples: [
          { jp: '私も学生です。', en: 'I am also a student.' },
          { jp: '猫も好きです。', en: 'I like cats too.' },
        ],
      },
      {
        label: 'Neither (negative)',
        explanation: 'In negative sentences, も means "either / neither".',
        examples: [
          { jp: '犬も猫も嫌いです。', en: 'I like neither dogs nor cats.' },
          { jp: '何も食べませんでした。', en: 'I didn\'t eat anything.' },
        ],
      },
    ],
  },
  {
    particle: 'から',
    romaji: 'kara',
    name: 'From / Because',
    summary: 'Marks a starting point in space or time, or gives a reason.',
    usages: [
      {
        label: 'From (starting point)',
        explanation: 'Where something starts — place or time.',
        examples: [
          { jp: '東京から来ました。', en: 'I came from Tokyo.' },
          { jp: '九時から授業があります。', en: 'Class starts from 9 o\'clock.' },
        ],
      },
      {
        label: 'Because (reason)',
        explanation: 'Comes at the end of a clause to give a reason.',
        examples: [
          { jp: '雨が降っているから、傘を持ちましょう。', en: 'It\'s raining, so let\'s take an umbrella.' },
          { jp: '好きだから、毎日練習します。', en: 'Because I like it, I practise every day.' },
        ],
      },
    ],
    confusedWith: ['まで'],
  },
  {
    particle: 'まで',
    romaji: 'made',
    name: 'Until / Up To',
    summary: 'Marks an end point in time, place, or extent.',
    usages: [
      {
        label: 'Until (time)',
        explanation: 'Up to a point in time.',
        examples: [
          { jp: '六時まで働きます。', en: 'I work until 6 o\'clock.' },
          { jp: '明日まで待ちます。', en: 'I will wait until tomorrow.' },
        ],
      },
      {
        label: 'To / up to (place)',
        explanation: 'The end point of movement.',
        examples: [
          { jp: '駅まで歩きました。', en: 'I walked to the station.' },
          { jp: '大阪まで電車で行きます。', en: 'I go to Osaka by train.' },
        ],
      },
    ],
    tip: 'から〜まで = from〜to: 東京から大阪まで (from Tokyo to Osaka).',
    confusedWith: ['から'],
  },
  {
    particle: 'へ',
    romaji: 'e',
    name: 'Toward (Direction)',
    summary: 'Marks direction of movement — similar to に but emphasises the direction rather than the destination.',
    usages: [
      {
        label: 'Direction of movement',
        explanation: 'Used with verbs of motion. Emphasises the direction you are heading.',
        examples: [
          { jp: '東京へ行きます。', en: 'I am heading to Tokyo.' },
          { jp: '右へ曲がってください。', en: 'Please turn to the right.' },
        ],
      },
    ],
    tip: 'へ vs に for destination: both are often interchangeable, but に is more common in everyday speech. へ sounds slightly more formal or literary.',
    confusedWith: ['に'],
  },
  {
    particle: 'や',
    romaji: 'ya',
    name: 'And (Non-exhaustive)',
    summary: 'Connects nouns in a non-exhaustive list — "and things like".',
    usages: [
      {
        label: 'Non-exhaustive list',
        explanation: 'Implies there are other items not mentioned. Unlike と, the list is not complete.',
        examples: [
          { jp: '野菜や肉を買いました。', en: 'I bought vegetables, meat, and other things.' },
          { jp: '猫や犬が好きです。', en: 'I like cats, dogs, and such.' },
        ],
      },
    ],
    confusedWith: ['と'],
  },
  {
    particle: 'か',
    romaji: 'ka',
    name: 'Question Marker / Or',
    summary: 'Added to the end of a sentence to make it a question; between nouns means "or".',
    usages: [
      {
        label: 'Question marker',
        explanation: 'Turns a statement into a yes/no question.',
        examples: [
          { jp: '日本語が分かりますか？', en: 'Do you understand Japanese?' },
          { jp: '学生ですか？', en: 'Are you a student?' },
        ],
      },
      {
        label: 'Or',
        explanation: 'Between nouns or clauses.',
        examples: [
          { jp: 'コーヒーか紅茶はどうですか？', en: 'How about coffee or tea?' },
          { jp: '月曜日か火曜日に会いましょう。', en: 'Let\'s meet on Monday or Tuesday.' },
        ],
      },
    ],
  },
  {
    particle: 'ね',
    romaji: 'ne',
    name: 'Seeking Agreement',
    summary: 'Sentence-ending particle that seeks confirmation or expresses a shared feeling.',
    usages: [
      {
        label: 'Tag question / confirmation',
        explanation: 'Like "right?", "isn\'t it?", "don\'t you think?"',
        examples: [
          { jp: 'いい天気ですね。', en: 'Nice weather, isn\'t it?' },
          { jp: '難しいですね。', en: 'It\'s difficult, isn\'t it?' },
        ],
      },
    ],
    tip: 'ね is softer and more social than よ — it invites the listener to agree.',
    confusedWith: ['よ'],
  },
  {
    particle: 'よ',
    romaji: 'yo',
    name: 'Asserting New Information',
    summary: 'Sentence-ending particle that asserts or emphasises — "I\'m telling you", "you know".',
    usages: [
      {
        label: 'Assertion / informing',
        explanation: 'Used when the speaker is sure of something and wants to inform the listener.',
        examples: [
          { jp: 'これは美味しいですよ。', en: 'This is delicious, I\'m telling you.' },
          { jp: '電車が来ますよ。', en: 'The train is coming.' },
        ],
      },
    ],
    tip: 'よ asserts to the listener; ね checks with the listener. よね combines both: assertion + seeking agreement.',
    confusedWith: ['ね'],
  },
];
