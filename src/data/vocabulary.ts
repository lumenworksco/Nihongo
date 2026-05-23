export interface Word {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  type: 'noun' | 'verb' | 'adjective-i' | 'adjective-na' | 'adverb' | 'expression';
  category: 'people' | 'time' | 'place' | 'food' | 'body' | 'nature' | 'numbers' | 'daily' | 'verbs' | 'adjectives' | 'expressions';
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

  // Numbers
  { id: 71, kanji: '一', kana: 'いち', romaji: 'ichi', meaning: 'one', type: 'noun', category: 'numbers' },
  { id: 72, kanji: '二', kana: 'に', romaji: 'ni', meaning: 'two', type: 'noun', category: 'numbers' },
  { id: 73, kanji: '三', kana: 'さん', romaji: 'san', meaning: 'three', type: 'noun', category: 'numbers' },
  { id: 74, kanji: '四', kana: 'し・よん', romaji: 'shi / yon', meaning: 'four', type: 'noun', category: 'numbers' },
  { id: 75, kanji: '五', kana: 'ご', romaji: 'go', meaning: 'five', type: 'noun', category: 'numbers' },
  { id: 76, kanji: '六', kana: 'ろく', romaji: 'roku', meaning: 'six', type: 'noun', category: 'numbers' },
  { id: 77, kanji: '七', kana: 'しち・なな', romaji: 'shichi / nana', meaning: 'seven', type: 'noun', category: 'numbers' },
  { id: 78, kanji: '八', kana: 'はち', romaji: 'hachi', meaning: 'eight', type: 'noun', category: 'numbers' },
  { id: 79, kanji: '九', kana: 'く・きゅう', romaji: 'ku / kyuu', meaning: 'nine', type: 'noun', category: 'numbers' },
  { id: 80, kanji: '十', kana: 'じゅう', romaji: 'juu', meaning: 'ten', type: 'noun', category: 'numbers' },
  { id: 81, kanji: '百', kana: 'ひゃく', romaji: 'hyaku', meaning: 'hundred', type: 'noun', category: 'numbers' },
  { id: 82, kanji: '千', kana: 'せん', romaji: 'sen', meaning: 'thousand', type: 'noun', category: 'numbers' },

  // Family (category: people)
  { id: 83, kanji: '父', kana: 'ちち', romaji: 'chichi', meaning: 'father (own)', type: 'noun', category: 'people' },
  { id: 84, kanji: '母', kana: 'はは', romaji: 'haha', meaning: 'mother (own)', type: 'noun', category: 'people' },
  { id: 85, kanji: '兄', kana: 'あに', romaji: 'ani', meaning: 'older brother (own)', type: 'noun', category: 'people' },
  { id: 86, kanji: '姉', kana: 'あね', romaji: 'ane', meaning: 'older sister (own)', type: 'noun', category: 'people' },
  { id: 87, kanji: '弟', kana: 'おとうと', romaji: 'otouto', meaning: 'younger brother', type: 'noun', category: 'people' },
  { id: 88, kanji: '妹', kana: 'いもうと', romaji: 'imouto', meaning: 'younger sister', type: 'noun', category: 'people' },
  { id: 89, kanji: '祖父', kana: 'そふ', romaji: 'sofu', meaning: 'grandfather (own)', type: 'noun', category: 'people' },
  { id: 90, kanji: '祖母', kana: 'そぼ', romaji: 'sobo', meaning: 'grandmother (own)', type: 'noun', category: 'people' },

  // Body
  { id: 91, kanji: '頭', kana: 'あたま', romaji: 'atama', meaning: 'head', type: 'noun', category: 'body', example: { jp: '頭が痛いです。', en: 'I have a headache.' } },
  { id: 92, kanji: '目', kana: 'め', romaji: 'me', meaning: 'eye', type: 'noun', category: 'body' },
  { id: 93, kanji: '耳', kana: 'みみ', romaji: 'mimi', meaning: 'ear', type: 'noun', category: 'body' },
  { id: 94, kanji: '鼻', kana: 'はな', romaji: 'hana', meaning: 'nose', type: 'noun', category: 'body' },
  { id: 95, kanji: '口', kana: 'くち', romaji: 'kuchi', meaning: 'mouth', type: 'noun', category: 'body' },
  { id: 96, kanji: '手', kana: 'て', romaji: 'te', meaning: 'hand', type: 'noun', category: 'body', example: { jp: '手を洗います。', en: 'I wash my hands.' } },
  { id: 97, kanji: '足', kana: 'あし', romaji: 'ashi', meaning: 'leg, foot', type: 'noun', category: 'body' },
  { id: 98, kanji: '背', kana: 'せ', romaji: 'se', meaning: 'height, back', type: 'noun', category: 'body' },

  // Nature & Weather
  { id: 99, kanji: '空', kana: 'そら', romaji: 'sora', meaning: 'sky', type: 'noun', category: 'nature' },
  { id: 100, kanji: '山', kana: 'やま', romaji: 'yama', meaning: 'mountain', type: 'noun', category: 'nature' },
  { id: 101, kanji: '川', kana: 'かわ', romaji: 'kawa', meaning: 'river', type: 'noun', category: 'nature' },
  { id: 102, kanji: '海', kana: 'うみ', romaji: 'umi', meaning: 'sea, ocean', type: 'noun', category: 'nature' },
  { id: 103, kanji: '花', kana: 'はな', romaji: 'hana', meaning: 'flower', type: 'noun', category: 'nature' },
  { id: 104, kanji: '雨', kana: 'あめ', romaji: 'ame', meaning: 'rain', type: 'noun', category: 'nature', example: { jp: '雨が降っています。', en: 'It is raining.' } },
  { id: 105, kanji: '雪', kana: 'ゆき', romaji: 'yuki', meaning: 'snow', type: 'noun', category: 'nature' },
  { id: 106, kanji: '風', kana: 'かぜ', romaji: 'kaze', meaning: 'wind', type: 'noun', category: 'nature' },
  { id: 107, kanji: '天気', kana: 'てんき', romaji: 'tenki', meaning: 'weather', type: 'noun', category: 'nature', example: { jp: '今日の天気はどうですか？', en: 'How is the weather today?' } },
  { id: 108, kanji: '木', kana: 'き', romaji: 'ki', meaning: 'tree', type: 'noun', category: 'nature' },
  // Colors (category: nature)
  { id: 109, kanji: '赤', kana: 'あか', romaji: 'aka', meaning: 'red', type: 'noun', category: 'nature' },
  { id: 110, kanji: '青', kana: 'あお', romaji: 'ao', meaning: 'blue, blue-green', type: 'noun', category: 'nature' },
  { id: 111, kanji: '白', kana: 'しろ', romaji: 'shiro', meaning: 'white', type: 'noun', category: 'nature' },
  { id: 112, kanji: '黒', kana: 'くろ', romaji: 'kuro', meaning: 'black', type: 'noun', category: 'nature' },
  { id: 113, kanji: '黄色', kana: 'きいろ', romaji: 'kiiro', meaning: 'yellow', type: 'noun', category: 'nature' },
  { id: 114, kanji: '緑', kana: 'みどり', romaji: 'midori', meaning: 'green', type: 'noun', category: 'nature' },

  // Transport (category: daily)
  { id: 115, kanji: '電車', kana: 'でんしゃ', romaji: 'densha', meaning: 'train', type: 'noun', category: 'daily', example: { jp: '電車で学校に行きます。', en: 'I go to school by train.' } },
  { id: 116, kanji: 'バス', kana: 'バス', romaji: 'basu', meaning: 'bus', type: 'noun', category: 'daily' },
  { id: 117, kanji: 'タクシー', kana: 'タクシー', romaji: 'takushii', meaning: 'taxi', type: 'noun', category: 'daily' },
  { id: 118, kanji: '飛行機', kana: 'ひこうき', romaji: 'hikouki', meaning: 'airplane', type: 'noun', category: 'daily' },
  { id: 119, kanji: '自転車', kana: 'じてんしゃ', romaji: 'jitensha', meaning: 'bicycle', type: 'noun', category: 'daily' },
  { id: 120, kanji: '船', kana: 'ふね', romaji: 'fune', meaning: 'ship, boat', type: 'noun', category: 'daily' },

  // More places
  { id: 121, kanji: '銀行', kana: 'ぎんこう', romaji: 'ginkou', meaning: 'bank', type: 'noun', category: 'place' },
  { id: 122, kanji: '郵便局', kana: 'ゆうびんきょく', romaji: 'yuubinkyoku', meaning: 'post office', type: 'noun', category: 'place' },
  { id: 123, kanji: 'レストラン', kana: 'レストラン', romaji: 'resutoran', meaning: 'restaurant', type: 'noun', category: 'place' },
  { id: 124, kanji: 'スーパー', kana: 'スーパー', romaji: 'suupaa', meaning: 'supermarket', type: 'noun', category: 'place' },
  { id: 125, kanji: '空港', kana: 'くうこう', romaji: 'kuukou', meaning: 'airport', type: 'noun', category: 'place' },
  { id: 126, kanji: '教室', kana: 'きょうしつ', romaji: 'kyoushitsu', meaning: 'classroom', type: 'noun', category: 'place' },
  { id: 127, kanji: 'トイレ', kana: 'トイレ', romaji: 'toire', meaning: 'toilet, bathroom', type: 'noun', category: 'place' },
  { id: 128, kanji: '会社', kana: 'かいしゃ', romaji: 'kaisha', meaning: 'company, office', type: 'noun', category: 'place' },

  // More daily items
  { id: 129, kanji: '机', kana: 'つくえ', romaji: 'tsukue', meaning: 'desk', type: 'noun', category: 'daily' },
  { id: 130, kanji: '椅子', kana: 'いす', romaji: 'isu', meaning: 'chair', type: 'noun', category: 'daily' },
  { id: 131, kanji: '窓', kana: 'まど', romaji: 'mado', meaning: 'window', type: 'noun', category: 'daily' },
  { id: 132, kanji: 'ドア', kana: 'ドア', romaji: 'doa', meaning: 'door', type: 'noun', category: 'daily' },
  { id: 133, kanji: '新聞', kana: 'しんぶん', romaji: 'shinbun', meaning: 'newspaper', type: 'noun', category: 'daily' },
  { id: 134, kanji: '写真', kana: 'しゃしん', romaji: 'shashin', meaning: 'photograph, photo', type: 'noun', category: 'daily' },
  { id: 135, kanji: '映画', kana: 'えいが', romaji: 'eiga', meaning: 'movie, film', type: 'noun', category: 'daily', example: { jp: '映画を見に行きます。', en: 'I go to see a movie.' } },
  { id: 136, kanji: '音楽', kana: 'おんがく', romaji: 'ongaku', meaning: 'music', type: 'noun', category: 'daily' },
  { id: 137, kanji: '服', kana: 'ふく', romaji: 'fuku', meaning: 'clothes', type: 'noun', category: 'daily' },
  { id: 138, kanji: '靴', kana: 'くつ', romaji: 'kutsu', meaning: 'shoes', type: 'noun', category: 'daily' },
  { id: 139, kanji: '鞄', kana: 'かばん', romaji: 'kaban', meaning: 'bag', type: 'noun', category: 'daily' },

  // Directions & positions (category: daily)
  { id: 140, kanji: '右', kana: 'みぎ', romaji: 'migi', meaning: 'right', type: 'noun', category: 'daily' },
  { id: 141, kanji: '左', kana: 'ひだり', romaji: 'hidari', meaning: 'left', type: 'noun', category: 'daily' },
  { id: 142, kanji: '上', kana: 'うえ', romaji: 'ue', meaning: 'above, top, up', type: 'noun', category: 'daily', example: { jp: '机の上に本があります。', en: 'There is a book on the desk.' } },
  { id: 143, kanji: '下', kana: 'した', romaji: 'shita', meaning: 'below, bottom, down', type: 'noun', category: 'daily' },
  { id: 144, kanji: '前', kana: 'まえ', romaji: 'mae', meaning: 'front, before', type: 'noun', category: 'daily' },
  { id: 145, kanji: '後ろ', kana: 'うしろ', romaji: 'ushiro', meaning: 'behind, back', type: 'noun', category: 'daily' },
  { id: 146, kanji: '中', kana: 'なか', romaji: 'naka', meaning: 'inside, middle', type: 'noun', category: 'daily' },
  { id: 147, kanji: '外', kana: 'そと', romaji: 'soto', meaning: 'outside', type: 'noun', category: 'daily' },
  { id: 148, kanji: '隣', kana: 'となり', romaji: 'tonari', meaning: 'next to, neighbour', type: 'noun', category: 'daily' },
  { id: 149, kanji: '近く', kana: 'ちかく', romaji: 'chikaku', meaning: 'nearby, close', type: 'noun', category: 'daily' },

  // More verbs
  { id: 150, kanji: '出る', kana: 'でる', romaji: 'deru', meaning: 'to leave, to go out', type: 'verb', category: 'verbs' },
  { id: 151, kanji: '入る', kana: 'はいる', romaji: 'hairu', meaning: 'to enter, to go in', type: 'verb', category: 'verbs' },
  { id: 152, kanji: '開ける', kana: 'あける', romaji: 'akeru', meaning: 'to open', type: 'verb', category: 'verbs' },
  { id: 153, kanji: '閉める', kana: 'しめる', romaji: 'shimeru', meaning: 'to close', type: 'verb', category: 'verbs' },
  { id: 154, kanji: '待つ', kana: 'まつ', romaji: 'matsu', meaning: 'to wait', type: 'verb', category: 'verbs', example: { jp: 'ここで待ってください。', en: 'Please wait here.' } },
  { id: 155, kanji: '歩く', kana: 'あるく', romaji: 'aruku', meaning: 'to walk', type: 'verb', category: 'verbs' },
  { id: 156, kanji: '走る', kana: 'はしる', romaji: 'hashiru', meaning: 'to run', type: 'verb', category: 'verbs' },
  { id: 157, kanji: '泳ぐ', kana: 'およぐ', romaji: 'oyogu', meaning: 'to swim', type: 'verb', category: 'verbs' },
  { id: 158, kanji: '遊ぶ', kana: 'あそぶ', romaji: 'asobu', meaning: 'to play', type: 'verb', category: 'verbs' },
  { id: 159, kanji: '会う', kana: 'あう', romaji: 'au', meaning: 'to meet', type: 'verb', category: 'verbs', example: { jp: '友達に会いました。', en: 'I met my friend.' } },
  { id: 160, kanji: '教える', kana: 'おしえる', romaji: 'oshieru', meaning: 'to teach, to tell', type: 'verb', category: 'verbs' },
  { id: 161, kanji: '作る', kana: 'つくる', romaji: 'tsukuru', meaning: 'to make, to create', type: 'verb', category: 'verbs' },
  { id: 162, kanji: '洗う', kana: 'あらう', romaji: 'arau', meaning: 'to wash', type: 'verb', category: 'verbs' },
  { id: 163, kanji: '着る', kana: 'きる', romaji: 'kiru', meaning: 'to wear (upper body)', type: 'verb', category: 'verbs' },
  { id: 164, kanji: '持つ', kana: 'もつ', romaji: 'motsu', meaning: 'to hold, to carry', type: 'verb', category: 'verbs' },
  { id: 165, kanji: '見せる', kana: 'みせる', romaji: 'miseru', meaning: 'to show', type: 'verb', category: 'verbs' },
  { id: 166, kanji: 'あげる', kana: 'あげる', romaji: 'ageru', meaning: 'to give (to someone)', type: 'verb', category: 'verbs' },
  { id: 167, kanji: 'もらう', kana: 'もらう', romaji: 'morau', meaning: 'to receive', type: 'verb', category: 'verbs' },
  { id: 168, kanji: '借りる', kana: 'かりる', romaji: 'kariru', meaning: 'to borrow', type: 'verb', category: 'verbs' },
  { id: 169, kanji: '貸す', kana: 'かす', romaji: 'kasu', meaning: 'to lend', type: 'verb', category: 'verbs' },
  { id: 170, kanji: '思う', kana: 'おもう', romaji: 'omou', meaning: 'to think, to feel', type: 'verb', category: 'verbs', example: { jp: '面白いと思います。', en: 'I think it is interesting.' } },

  // More adjectives
  { id: 171, kanji: '長い', kana: 'ながい', romaji: 'nagai', meaning: 'long', type: 'adjective-i', category: 'adjectives' },
  { id: 172, kanji: '短い', kana: 'みじかい', romaji: 'mijikai', meaning: 'short (length)', type: 'adjective-i', category: 'adjectives' },
  { id: 173, kanji: '重い', kana: 'おもい', romaji: 'omoi', meaning: 'heavy', type: 'adjective-i', category: 'adjectives' },
  { id: 174, kanji: '軽い', kana: 'かるい', romaji: 'karui', meaning: 'light (weight)', type: 'adjective-i', category: 'adjectives' },
  { id: 175, kanji: '早い', kana: 'はやい', romaji: 'hayai', meaning: 'fast, early', type: 'adjective-i', category: 'adjectives' },
  { id: 176, kanji: '遅い', kana: 'おそい', romaji: 'osoi', meaning: 'slow, late', type: 'adjective-i', category: 'adjectives' },
  { id: 177, kanji: '難しい', kana: 'むずかしい', romaji: 'muzukashii', meaning: 'difficult', type: 'adjective-i', category: 'adjectives', example: { jp: '日本語は難しいですか？', en: 'Is Japanese difficult?' } },
  { id: 178, kanji: '易しい', kana: 'やさしい', romaji: 'yasashii', meaning: 'easy (not difficult)', type: 'adjective-i', category: 'adjectives' },
  { id: 179, kanji: '暖かい', kana: 'あたたかい', romaji: 'atatakai', meaning: 'warm', type: 'adjective-i', category: 'adjectives' },
  { id: 180, kanji: '涼しい', kana: 'すずしい', romaji: 'suzushii', meaning: 'cool (pleasantly)', type: 'adjective-i', category: 'adjectives' },
  { id: 181, kanji: '面白い', kana: 'おもしろい', romaji: 'omoshiroi', meaning: 'interesting, funny', type: 'adjective-i', category: 'adjectives' },
  { id: 182, kanji: 'つまらない', kana: 'つまらない', romaji: 'tsumaranai', meaning: 'boring, dull', type: 'adjective-i', category: 'adjectives' },
  { id: 183, kanji: '怖い', kana: 'こわい', romaji: 'kowai', meaning: 'scary, frightening', type: 'adjective-i', category: 'adjectives' },
  { id: 184, kanji: '嬉しい', kana: 'うれしい', romaji: 'ureshii', meaning: 'happy, glad', type: 'adjective-i', category: 'adjectives' },
  { id: 185, kanji: '悲しい', kana: 'かなしい', romaji: 'kanashii', meaning: 'sad', type: 'adjective-i', category: 'adjectives' },
  { id: 186, kanji: '正しい', kana: 'ただしい', romaji: 'tadashii', meaning: 'correct, right', type: 'adjective-i', category: 'adjectives' },
  { id: 187, kanji: '綺麗', kana: 'きれい', romaji: 'kirei', meaning: 'beautiful, clean', type: 'adjective-na', category: 'adjectives', example: { jp: 'きれいな花ですね。', en: 'What a beautiful flower.' } },
  { id: 188, kanji: '大切', kana: 'たいせつ', romaji: 'taisetsu', meaning: 'important, precious', type: 'adjective-na', category: 'adjectives' },
  { id: 189, kanji: '有名', kana: 'ゆうめい', romaji: 'yuumei', meaning: 'famous', type: 'adjective-na', category: 'adjectives' },
  { id: 190, kanji: '親切', kana: 'しんせつ', romaji: 'shinsetsu', meaning: 'kind, friendly', type: 'adjective-na', category: 'adjectives' },

  // Expressions & greetings
  { id: 191, kanji: 'ありがとう', kana: 'ありがとう', romaji: 'arigatou', meaning: 'thank you', type: 'expression', category: 'expressions', example: { jp: 'ありがとうございます。', en: 'Thank you very much.' } },
  { id: 192, kanji: 'すみません', kana: 'すみません', romaji: 'sumimasen', meaning: 'excuse me, I\'m sorry', type: 'expression', category: 'expressions' },
  { id: 193, kanji: 'ごめんなさい', kana: 'ごめんなさい', romaji: 'gomen nasai', meaning: 'I\'m sorry', type: 'expression', category: 'expressions' },
  { id: 194, kanji: 'おはようございます', kana: 'おはようございます', romaji: 'ohayou gozaimasu', meaning: 'good morning', type: 'expression', category: 'expressions' },
  { id: 195, kanji: 'こんにちは', kana: 'こんにちは', romaji: 'konnichiwa', meaning: 'hello, good afternoon', type: 'expression', category: 'expressions' },
  { id: 196, kanji: 'こんばんは', kana: 'こんばんは', romaji: 'konbanwa', meaning: 'good evening', type: 'expression', category: 'expressions' },
  { id: 197, kanji: 'おやすみなさい', kana: 'おやすみなさい', romaji: 'oyasumi nasai', meaning: 'good night', type: 'expression', category: 'expressions' },
  { id: 198, kanji: 'いただきます', kana: 'いただきます', romaji: 'itadakimasu', meaning: 'said before eating', type: 'expression', category: 'expressions' },
  { id: 199, kanji: 'はじめまして', kana: 'はじめまして', romaji: 'hajimemashite', meaning: 'nice to meet you', type: 'expression', category: 'expressions' },
  { id: 200, kanji: 'よろしくお願いします', kana: 'よろしくおねがいします', romaji: 'yoroshiku onegaishimasu', meaning: 'please treat me well', type: 'expression', category: 'expressions' },
];

export const categories = [
  { id: 'all',         label: 'All' },
  { id: 'people',      label: 'People & Family' },
  { id: 'body',        label: 'Body' },
  { id: 'time',        label: 'Time' },
  { id: 'place',       label: 'Places' },
  { id: 'food',        label: 'Food' },
  { id: 'nature',      label: 'Nature & Colors' },
  { id: 'numbers',     label: 'Numbers' },
  { id: 'daily',       label: 'Daily Life' },
  { id: 'verbs',       label: 'Verbs' },
  { id: 'adjectives',  label: 'Adjectives' },
  { id: 'expressions', label: 'Expressions' },
];
