export interface Word {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  type: 'noun' | 'verb' | 'adjective-i' | 'adjective-na' | 'adverb' | 'expression';
  category: 'people' | 'time' | 'place' | 'food' | 'body' | 'nature' | 'numbers' | 'daily' | 'verbs' | 'adjectives';
  example?: { jp: string; en: string };
}

export const vocabulary: Word[] = [
  // People
  { id: 1, kanji: '人', kana: 'ひと', romaji: 'hito', meaning: 'person, people', type: 'noun', category: 'people', example: { jp: 'あの人は先生です。', en: 'That person is a teacher.' } },
  { id: 2, kanji: '男', kana: 'おとこ', romaji: 'otoko', meaning: 'man, male', type: 'noun', category: 'people' },
  { id: 3, kanji: '女', kana: 'おんな', romaji: 'onna', meaning: 'woman, female', type: 'noun', category: 'people' },
  { id: 4, kanji: '子供', kana: 'こども', romaji: 'kodomo', meaning: 'child', type: 'noun', category: 'people', example: { jp: '子供が公園にいます。', en: 'Children are in the park.' } },
  { id: 5, kanji: '友達', kana: 'ともだち', romaji: 'tomodachi', meaning: 'friend', type: 'noun', category: 'people', example: { jp: '友達と映画を見ました。', en: 'I watched a movie with a friend.' } },
  { id: 6, kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'teacher', type: 'noun', category: 'people' },
  { id: 7, kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'student', type: 'noun', category: 'people' },
  { id: 8, kanji: '家族', kana: 'かぞく', romaji: 'kazoku', meaning: 'family', type: 'noun', category: 'people' },

  // Time
  { id: 9, kanji: '今日', kana: 'きょう', romaji: 'kyou', meaning: 'today', type: 'noun', category: 'time', example: { jp: '今日は月曜日です。', en: 'Today is Monday.' } },
  { id: 10, kanji: '明日', kana: 'あした', romaji: 'ashita', meaning: 'tomorrow', type: 'noun', category: 'time' },
  { id: 11, kanji: '昨日', kana: 'きのう', romaji: 'kinou', meaning: 'yesterday', type: 'noun', category: 'time' },
  { id: 12, kanji: '今', kana: 'いま', romaji: 'ima', meaning: 'now', type: 'noun', category: 'time', example: { jp: '今、何時ですか？', en: 'What time is it now?' } },
  { id: 13, kanji: '朝', kana: 'あさ', romaji: 'asa', meaning: 'morning', type: 'noun', category: 'time' },
  { id: 14, kanji: '夜', kana: 'よる', romaji: 'yoru', meaning: 'night, evening', type: 'noun', category: 'time' },
  { id: 15, kanji: '週', kana: 'しゅう', romaji: 'shuu', meaning: 'week', type: 'noun', category: 'time' },
  { id: 16, kanji: '年', kana: 'とし', romaji: 'toshi', meaning: 'year', type: 'noun', category: 'time' },

  // Places
  { id: 17, kanji: '学校', kana: 'がっこう', romaji: 'gakkou', meaning: 'school', type: 'noun', category: 'place', example: { jp: '学校は近いです。', en: 'The school is close.' } },
  { id: 18, kanji: '家', kana: 'いえ', romaji: 'ie', meaning: 'house, home', type: 'noun', category: 'place', example: { jp: '家に帰ります。', en: 'I will return home.' } },
  { id: 19, kanji: '駅', kana: 'えき', romaji: 'eki', meaning: 'station', type: 'noun', category: 'place' },
  { id: 20, kanji: '公園', kana: 'こうえん', romaji: 'kouen', meaning: 'park', type: 'noun', category: 'place' },
  { id: 21, kanji: '病院', kana: 'びょういん', romaji: 'byouin', meaning: 'hospital', type: 'noun', category: 'place' },
  { id: 22, kanji: '図書館', kana: 'としょかん', romaji: 'toshokan', meaning: 'library', type: 'noun', category: 'place' },
  { id: 23, kanji: '店', kana: 'みせ', romaji: 'mise', meaning: 'shop, store', type: 'noun', category: 'place' },
  { id: 24, kanji: '部屋', kana: 'へや', romaji: 'heya', meaning: 'room', type: 'noun', category: 'place' },

  // Food
  { id: 25, kanji: '水', kana: 'みず', romaji: 'mizu', meaning: 'water', type: 'noun', category: 'food', example: { jp: '水を飲みます。', en: 'I drink water.' } },
  { id: 26, kanji: 'ご飯', kana: 'ごはん', romaji: 'gohan', meaning: 'rice, meal', type: 'noun', category: 'food' },
  { id: 27, kanji: 'パン', kana: 'ぱん', romaji: 'pan', meaning: 'bread', type: 'noun', category: 'food' },
  { id: 28, kanji: '肉', kana: 'にく', romaji: 'niku', meaning: 'meat', type: 'noun', category: 'food' },
  { id: 29, kanji: '魚', kana: 'さかな', romaji: 'sakana', meaning: 'fish', type: 'noun', category: 'food' },
  { id: 30, kanji: '野菜', kana: 'やさい', romaji: 'yasai', meaning: 'vegetable', type: 'noun', category: 'food' },

  // Daily life
  { id: 31, kanji: '本', kana: 'ほん', romaji: 'hon', meaning: 'book', type: 'noun', category: 'daily', example: { jp: '本を読みます。', en: 'I read a book.' } },
  { id: 32, kanji: '車', kana: 'くるま', romaji: 'kuruma', meaning: 'car', type: 'noun', category: 'daily' },
  { id: 33, kanji: '電話', kana: 'でんわ', romaji: 'denwa', meaning: 'telephone', type: 'noun', category: 'daily' },
  { id: 34, kanji: 'お金', kana: 'おかね', romaji: 'okane', meaning: 'money', type: 'noun', category: 'daily' },
  { id: 35, kanji: '時間', kana: 'じかん', romaji: 'jikan', meaning: 'time', type: 'noun', category: 'daily', example: { jp: '時間がありません。', en: 'I don\'t have time.' } },
  { id: 36, kanji: '言葉', kana: 'ことば', romaji: 'kotoba', meaning: 'word, language', type: 'noun', category: 'daily' },

  // Verbs
  { id: 37, kanji: '食べる', kana: 'たべる', romaji: 'taberu', meaning: 'to eat', type: 'verb', category: 'verbs', example: { jp: '何を食べますか？', en: 'What will you eat?' } },
  { id: 38, kanji: '飲む', kana: 'のむ', romaji: 'nomu', meaning: 'to drink', type: 'verb', category: 'verbs' },
  { id: 39, kanji: '見る', kana: 'みる', romaji: 'miru', meaning: 'to see, to look', type: 'verb', category: 'verbs', example: { jp: 'テレビを見ます。', en: 'I watch TV.' } },
  { id: 40, kanji: '聞く', kana: 'きく', romaji: 'kiku', meaning: 'to listen, to ask', type: 'verb', category: 'verbs' },
  { id: 41, kanji: '話す', kana: 'はなす', romaji: 'hanasu', meaning: 'to speak, to talk', type: 'verb', category: 'verbs' },
  { id: 42, kanji: '書く', kana: 'かく', romaji: 'kaku', meaning: 'to write', type: 'verb', category: 'verbs', example: { jp: '日本語を書きます。', en: 'I write Japanese.' } },
  { id: 43, kanji: '読む', kana: 'よむ', romaji: 'yomu', meaning: 'to read', type: 'verb', category: 'verbs' },
  { id: 44, kanji: '行く', kana: 'いく', romaji: 'iku', meaning: 'to go', type: 'verb', category: 'verbs', example: { jp: '学校に行きます。', en: 'I go to school.' } },
  { id: 45, kanji: '来る', kana: 'くる', romaji: 'kuru', meaning: 'to come', type: 'verb', category: 'verbs' },
  { id: 46, kanji: '帰る', kana: 'かえる', romaji: 'kaeru', meaning: 'to return, to go home', type: 'verb', category: 'verbs' },
  { id: 47, kanji: '買う', kana: 'かう', romaji: 'kau', meaning: 'to buy', type: 'verb', category: 'verbs' },
  { id: 48, kanji: '使う', kana: 'つかう', romaji: 'tsukau', meaning: 'to use', type: 'verb', category: 'verbs' },
  { id: 49, kanji: '起きる', kana: 'おきる', romaji: 'okiru', meaning: 'to wake up, to get up', type: 'verb', category: 'verbs', example: { jp: '毎朝六時に起きます。', en: 'I wake up at 6 every morning.' } },
  { id: 50, kanji: '寝る', kana: 'ねる', romaji: 'neru', meaning: 'to sleep, to go to bed', type: 'verb', category: 'verbs' },
  { id: 51, kanji: 'する', kana: 'する', romaji: 'suru', meaning: 'to do', type: 'verb', category: 'verbs' },
  { id: 52, kanji: 'ある', kana: 'ある', romaji: 'aru', meaning: 'to exist (inanimate)', type: 'verb', category: 'verbs', example: { jp: '机の上に本があります。', en: 'There is a book on the desk.' } },
  { id: 53, kanji: 'いる', kana: 'いる', romaji: 'iru', meaning: 'to exist (animate)', type: 'verb', category: 'verbs', example: { jp: '部屋に猫がいます。', en: 'There is a cat in the room.' } },
  { id: 54, kanji: '分かる', kana: 'わかる', romaji: 'wakaru', meaning: 'to understand', type: 'verb', category: 'verbs' },

  // Adjectives
  { id: 55, kanji: '大きい', kana: 'おおきい', romaji: 'ookii', meaning: 'big, large', type: 'adjective-i', category: 'adjectives', example: { jp: '大きい犬です。', en: 'It is a big dog.' } },
  { id: 56, kanji: '小さい', kana: 'ちいさい', romaji: 'chiisai', meaning: 'small, little', type: 'adjective-i', category: 'adjectives' },
  { id: 57, kanji: '新しい', kana: 'あたらしい', romaji: 'atarashii', meaning: 'new', type: 'adjective-i', category: 'adjectives' },
  { id: 58, kanji: '古い', kana: 'ふるい', romaji: 'furui', meaning: 'old (objects)', type: 'adjective-i', category: 'adjectives' },
  { id: 59, kanji: '高い', kana: 'たかい', romaji: 'takai', meaning: 'expensive, tall, high', type: 'adjective-i', category: 'adjectives' },
  { id: 60, kanji: '安い', kana: 'やすい', romaji: 'yasui', meaning: 'cheap, inexpensive', type: 'adjective-i', category: 'adjectives' },
  { id: 61, kanji: '良い', kana: 'いい', romaji: 'ii', meaning: 'good', type: 'adjective-i', category: 'adjectives', example: { jp: 'いい天気ですね。', en: 'Nice weather, isn\'t it?' } },
  { id: 62, kanji: '悪い', kana: 'わるい', romaji: 'warui', meaning: 'bad', type: 'adjective-i', category: 'adjectives' },
  { id: 63, kanji: '暑い', kana: 'あつい', romaji: 'atsui', meaning: 'hot (weather)', type: 'adjective-i', category: 'adjectives' },
  { id: 64, kanji: '寒い', kana: 'さむい', romaji: 'samui', meaning: 'cold (weather)', type: 'adjective-i', category: 'adjectives' },
  { id: 65, kanji: '好き', kana: 'すき', romaji: 'suki', meaning: 'liked, favourite', type: 'adjective-na', category: 'adjectives', example: { jp: '日本語が好きです。', en: 'I like Japanese.' } },
  { id: 66, kanji: '嫌い', kana: 'きらい', romaji: 'kirai', meaning: 'disliked', type: 'adjective-na', category: 'adjectives' },
  { id: 67, kanji: '元気', kana: 'げんき', romaji: 'genki', meaning: 'healthy, energetic, fine', type: 'adjective-na', category: 'adjectives', example: { jp: 'お元気ですか？', en: 'How are you?' } },
  { id: 68, kanji: '静か', kana: 'しずか', romaji: 'shizuka', meaning: 'quiet', type: 'adjective-na', category: 'adjectives' },
  { id: 69, kanji: '賑やか', kana: 'にぎやか', romaji: 'nigiyaka', meaning: 'lively, bustling', type: 'adjective-na', category: 'adjectives' },
  { id: 70, kanji: '便利', kana: 'べんり', romaji: 'benri', meaning: 'convenient, useful', type: 'adjective-na', category: 'adjectives' },
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'people', label: 'People' },
  { id: 'time', label: 'Time' },
  { id: 'place', label: 'Places' },
  { id: 'food', label: 'Food' },
  { id: 'daily', label: 'Daily Life' },
  { id: 'verbs', label: 'Verbs' },
  { id: 'adjectives', label: 'Adjectives' },
];
