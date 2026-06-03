// CLT Japanese A1.1 Plus — course-specific flashcard data
// Covers the 4 oral exam topics: Frequency, Past, Shop, Introduction + Grammar patterns

export type CLTCategory = 'frequency' | 'past' | 'shop' | 'intro' | 'grammar';

export interface CLTCard {
  id: number;
  jp: string;        // Japanese text (kana / katakana / mix)
  romaji: string;
  meaning: string;
  category: CLTCategory;
  note?: string;     // grammatical note shown as a tag, e.g. "な-adj", "needs negative verb"
  example?: { jp: string; en: string };
}

export const cltCards: CLTCard[] = [
  // ── FREQUENCY ──────────────────────────────────────────────────────────────
  { id: 1,  jp: 'まいにち',      romaji: 'mainichi',              meaning: 'every day',                      category: 'frequency' },
  { id: 2,  jp: 'よく',          romaji: 'yoku',                  meaning: 'often',                          category: 'frequency' },
  { id: 3,  jp: 'ときどき',      romaji: 'tokidoki',              meaning: 'sometimes',                      category: 'frequency' },
  { id: 4,  jp: 'あまり〜ない',  romaji: 'amari ~ nai',           meaning: 'not much',                       category: 'frequency', note: 'needs negative verb' },
  { id: 5,  jp: 'ぜんぜん〜ない',romaji: 'zenzen ~ nai',          meaning: 'not at all',                     category: 'frequency', note: 'needs negative verb' },

  // ── PAST — Verbs (present & past forms) ────────────────────────────────────
  { id: 6,  jp: 'します',                    romaji: 'shimasu',               meaning: 'to do',               category: 'past', example: { jp: 'なにをしますか。', en: 'What do you do?' } },
  { id: 7,  jp: 'いきます',                  romaji: 'ikimasu',               meaning: 'to go',               category: 'past', example: { jp: 'どこにいきますか。', en: 'Where do you go?' } },
  { id: 8,  jp: 'きます',                    romaji: 'kimasu',                meaning: 'to come',             category: 'past' },
  { id: 9,  jp: 'はいります',                romaji: 'hairimasu',             meaning: 'to enter',            category: 'past', note: 'movement verb', example: { jp: 'おふろにはいります。', en: 'I take a bath.' } },
  { id: 10, jp: 'たべます',                  romaji: 'tabemasu',              meaning: 'to eat',              category: 'past' },
  { id: 11, jp: 'のみます',                  romaji: 'nomimasu',              meaning: 'to drink',            category: 'past' },
  { id: 12, jp: 'みます',                    romaji: 'mimasu',                meaning: 'to watch / see',      category: 'past', example: { jp: 'えいがをみます。', en: 'I watch a movie.' } },
  { id: 13, jp: 'よみます',                  romaji: 'yomimasu',              meaning: 'to read',             category: 'past' },
  { id: 14, jp: 'ききます',                  romaji: 'kikimasu',              meaning: 'to listen',           category: 'past' },
  { id: 15, jp: 'かきます',                  romaji: 'kakimasu',              meaning: 'to write',            category: 'past' },
  { id: 16, jp: 'かいます',                  romaji: 'kaimasu',               meaning: 'to buy',              category: 'past' },
  { id: 17, jp: 'およぎます',                romaji: 'oyogimasu',             meaning: 'to swim',             category: 'past' },
  { id: 18, jp: 'しました',                  romaji: 'shimashita',            meaning: 'did',                 category: 'past' },
  { id: 19, jp: 'いきました',                romaji: 'ikimashita',            meaning: 'went',                category: 'past' },
  { id: 20, jp: 'たべました',                romaji: 'tabemashita',           meaning: 'ate',                 category: 'past' },
  { id: 21, jp: 'のみました',                romaji: 'nomimashita',           meaning: 'drank',               category: 'past' },
  { id: 22, jp: 'みました',                  romaji: 'mimashita',             meaning: 'watched / saw',       category: 'past' },
  { id: 23, jp: 'しませんでした',            romaji: 'shimasen deshita',      meaning: "didn't do",           category: 'past' },
  { id: 24, jp: 'なにもしませんでした',      romaji: 'nani mo shimasen deshita', meaning: "didn't do anything", category: 'past' },
  { id: 25, jp: 'どこにもいきませんでした',  romaji: 'doko ni mo ikimasen deshita', meaning: "didn't go anywhere", category: 'past' },

  // ── PAST — Activities ────────────────────────────────────────────────────────
  { id: 26, jp: 'えいが',     romaji: 'eiga',     meaning: 'movie',          category: 'past' },
  { id: 27, jp: 'テレビ',     romaji: 'terebi',   meaning: 'television',     category: 'past' },
  { id: 28, jp: 'おんがく',   romaji: 'ongaku',   meaning: 'music',          category: 'past' },
  { id: 29, jp: 'りょうり',   romaji: 'ryouri',   meaning: 'cooking',        category: 'past' },
  { id: 30, jp: 'サッカー',   romaji: 'sakkaa',   meaning: 'soccer',         category: 'past' },
  { id: 31, jp: 'テニス',     romaji: 'tenisu',   meaning: 'tennis',         category: 'past' },
  { id: 32, jp: 'ダンス',     romaji: 'dansu',    meaning: 'dance',          category: 'past' },
  { id: 33, jp: 'ゲーム',     romaji: 'geemu',    meaning: 'game',           category: 'past' },
  { id: 34, jp: 'チェス',     romaji: 'chesu',    meaning: 'chess',          category: 'past' },
  { id: 35, jp: 'カヌー',     romaji: 'kanuu',    meaning: 'canoeing',       category: 'past' },
  { id: 36, jp: 'かいもの',   romaji: 'kaimono',  meaning: 'shopping',       category: 'past' },
  { id: 37, jp: 'せんたく',   romaji: 'sentaku',  meaning: 'laundry',        category: 'past' },
  { id: 38, jp: 'そうじ',     romaji: 'souji',    meaning: 'cleaning',       category: 'past' },
  { id: 39, jp: 'しゅくだい', romaji: 'shukudai', meaning: 'homework',       category: 'past' },
  { id: 40, jp: 'やすみ',     romaji: 'yasumi',   meaning: 'holiday / day off', category: 'past' },
  { id: 41, jp: 'おふろ',     romaji: 'ofuro',    meaning: 'bath',           category: 'past', note: 'おふろにはいります' },

  // ── PAST — Days & Time ───────────────────────────────────────────────────────
  { id: 42, jp: 'げつようび', romaji: 'getsuyoubi', meaning: 'Monday',                  category: 'past' },
  { id: 43, jp: 'かようび',   romaji: 'kayoubi',    meaning: 'Tuesday',                 category: 'past' },
  { id: 44, jp: 'すいようび', romaji: 'suiyoubi',   meaning: 'Wednesday',               category: 'past' },
  { id: 45, jp: 'もくようび', romaji: 'mokuyoubi',  meaning: 'Thursday',                category: 'past' },
  { id: 46, jp: 'きんようび', romaji: "kin'youbi",  meaning: 'Friday',                  category: 'past' },
  { id: 47, jp: 'どようび',   romaji: 'doyoubi',    meaning: 'Saturday',                category: 'past' },
  { id: 48, jp: 'にちようび', romaji: 'nichiyoubi', meaning: 'Sunday',                  category: 'past' },
  { id: 49, jp: 'おととい',   romaji: 'ototoi',     meaning: 'day before yesterday',    category: 'past' },
  { id: 50, jp: 'きのう',     romaji: 'kinou',      meaning: 'yesterday',               category: 'past' },
  { id: 51, jp: 'きょう',     romaji: 'kyou',       meaning: 'today',                   category: 'past' },
  { id: 52, jp: 'あした',     romaji: 'ashita',     meaning: 'tomorrow',                category: 'past' },
  { id: 53, jp: 'あさって',   romaji: 'asatte',     meaning: 'day after tomorrow',      category: 'past' },
  { id: 54, jp: 'ごぜん',     romaji: 'gozen',      meaning: 'a.m. / morning',          category: 'past' },
  { id: 55, jp: 'ごご',       romaji: 'gogo',       meaning: 'p.m. / afternoon',        category: 'past' },
  { id: 56, jp: 'よる',       romaji: 'yoru',       meaning: 'evening / night',         category: 'past' },

  // ── SHOP — Phrases ───────────────────────────────────────────────────────────
  { id: 57, jp: 'すみません',              romaji: 'sumimasen',       meaning: 'excuse me',           category: 'shop' },
  { id: 58, jp: '〜をください',            romaji: '~ wo kudasai',    meaning: 'please give me ~',    category: 'shop' },
  { id: 59, jp: '〜をひとつください',      romaji: '~ wo hitotsu kudasai', meaning: 'one ~ please',  category: 'shop' },
  { id: 60, jp: 'いくらですか',            romaji: 'ikura desu ka',   meaning: 'how much is it?',     category: 'shop' },
  { id: 61, jp: '〜えんです',              romaji: '~ en desu',       meaning: 'it is ~ yen',         category: 'shop' },
  { id: 62, jp: 'これはなんですか',        romaji: 'kore wa nan desu ka', meaning: 'what is this?',   category: 'shop' },
  { id: 63, jp: 'ありがとうございます',    romaji: 'arigatou gozaimasu', meaning: 'thank you',        category: 'shop' },
  { id: 64, jp: 'メニューをください',      romaji: 'menyuu wo kudasai', meaning: 'the menu please',  category: 'shop' },

  // ── SHOP — Places ────────────────────────────────────────────────────────────
  { id: 65, jp: 'みせ',       romaji: 'mise',       meaning: 'shop / store',        category: 'shop' },
  { id: 66, jp: 'コンビニ',   romaji: 'konbini',    meaning: 'convenience store',   category: 'shop' },
  { id: 67, jp: 'ショップ',   romaji: 'shoppu',     meaning: 'shop',                category: 'shop' },
  { id: 68, jp: 'きっさてん', romaji: 'kissaten',   meaning: 'café',                category: 'shop' },
  { id: 69, jp: 'レストラン', romaji: 'resutoran',  meaning: 'restaurant',          category: 'shop' },
  { id: 70, jp: 'いざかや',   romaji: 'izakaya',    meaning: 'Japanese pub / bar',  category: 'shop' },
  { id: 71, jp: 'そばや',     romaji: 'sobaya',     meaning: 'soba restaurant',     category: 'shop' },

  // ── SHOP — Food & Drink ──────────────────────────────────────────────────────
  { id: 72, jp: 'みず',           romaji: 'mizu',          meaning: 'water',           category: 'shop' },
  { id: 73, jp: 'おちゃ',         romaji: 'ocha',          meaning: 'green tea',       category: 'shop' },
  { id: 74, jp: 'コーヒー',       romaji: 'koohii',        meaning: 'coffee',          category: 'shop' },
  { id: 75, jp: 'ジュース',       romaji: 'juusu',         meaning: 'juice',           category: 'shop' },
  { id: 76, jp: 'ワイン',         romaji: 'wain',          meaning: 'wine',            category: 'shop' },
  { id: 77, jp: 'ミルク',         romaji: 'miruku',        meaning: 'milk',            category: 'shop' },
  { id: 78, jp: 'そば',           romaji: 'soba',          meaning: 'soba noodles',    category: 'shop' },
  { id: 79, jp: 'ごはん',         romaji: 'gohan',         meaning: 'rice / meal',     category: 'shop' },
  { id: 80, jp: 'あさごはん',     romaji: 'asagohan',      meaning: 'breakfast',       category: 'shop' },
  { id: 81, jp: 'ひるごはん',     romaji: 'hirugohan',     meaning: 'lunch',           category: 'shop' },
  { id: 82, jp: 'ばんごはん',     romaji: 'bangohan',      meaning: 'dinner',          category: 'shop' },
  { id: 83, jp: 'にほんりょうり', romaji: 'nihon ryouri',  meaning: 'Japanese food',   category: 'shop' },
  { id: 84, jp: 'ベルギーりょうり', romaji: 'berugii ryouri', meaning: 'Belgian food', category: 'shop' },
  { id: 85, jp: 'イタリアりょうり', romaji: 'itaria ryouri', meaning: 'Italian food',  category: 'shop' },
  { id: 86, jp: 'ファーストフード', romaji: 'faasuto fuudo', meaning: 'fast food',     category: 'shop' },
  { id: 87, jp: 'りんご',         romaji: 'ringo',         meaning: 'apple',           category: 'shop' },
  { id: 88, jp: 'バナナ',         romaji: 'banana',        meaning: 'banana',          category: 'shop' },
  { id: 89, jp: 'メロン',         romaji: 'meron',         meaning: 'melon',           category: 'shop' },
  { id: 90, jp: 'オレンジ',       romaji: 'orenji',        meaning: 'orange',          category: 'shop' },
  { id: 91, jp: 'にく',           romaji: 'niku',          meaning: 'meat',            category: 'shop' },
  { id: 92, jp: 'とうふ',         romaji: 'toufu',         meaning: 'tofu',            category: 'shop' },
  { id: 93, jp: 'たまご',         romaji: 'tamago',        meaning: 'egg',             category: 'shop' },

  // ── SHOP — Adjectives (describing items) ─────────────────────────────────────
  { id: 94,  jp: 'おいしい',   romaji: 'oishii',    meaning: 'delicious',        category: 'shop', note: 'い-adj' },
  { id: 95,  jp: 'まずい',     romaji: 'mazui',     meaning: 'not tasty',        category: 'shop', note: 'い-adj' },
  { id: 96,  jp: 'おおきい',   romaji: 'ookii',     meaning: 'big',              category: 'shop', note: 'い-adj' },
  { id: 97,  jp: 'ちいさい',   romaji: 'chiisai',   meaning: 'small',            category: 'shop', note: 'い-adj' },
  { id: 98,  jp: 'ながい',     romaji: 'nagai',     meaning: 'long',             category: 'shop', note: 'い-adj' },
  { id: 99,  jp: 'みじかい',   romaji: 'mijikai',   meaning: 'short',            category: 'shop', note: 'い-adj' },
  { id: 100, jp: 'まるい',     romaji: 'marui',     meaning: 'round',            category: 'shop', note: 'い-adj' },
  { id: 101, jp: 'しかくい',   romaji: 'shikakui',  meaning: 'square',           category: 'shop', note: 'い-adj' },
  { id: 102, jp: 'おもい',     romaji: 'omoi',      meaning: 'heavy',            category: 'shop', note: 'い-adj' },
  { id: 103, jp: 'かるい',     romaji: 'karui',     meaning: 'light',            category: 'shop', note: 'い-adj' },
  { id: 104, jp: 'かたい',     romaji: 'katai',     meaning: 'hard',             category: 'shop', note: 'い-adj' },
  { id: 105, jp: 'やわらかい', romaji: 'yawarakai', meaning: 'soft',             category: 'shop', note: 'い-adj' },
  { id: 106, jp: 'ふとい',     romaji: 'futoi',     meaning: 'thick / fat',      category: 'shop', note: 'い-adj' },
  { id: 107, jp: 'ほそい',     romaji: 'hosoi',     meaning: 'thin / slim',      category: 'shop', note: 'い-adj' },
  { id: 108, jp: 'たかい',     romaji: 'takai',     meaning: 'expensive / tall', category: 'shop', note: 'い-adj' },
  { id: 109, jp: 'やすい',     romaji: 'yasui',     meaning: 'cheap',            category: 'shop', note: 'い-adj' },
  { id: 110, jp: 'ふるい',     romaji: 'furui',     meaning: 'old',              category: 'shop', note: 'い-adj' },
  { id: 111, jp: 'あたらしい', romaji: 'atarashii', meaning: 'new',              category: 'shop', note: 'い-adj' },
  { id: 112, jp: 'あかい',     romaji: 'akai',      meaning: 'red',              category: 'shop', note: 'color い-adj' },
  { id: 113, jp: 'あおい',     romaji: 'aoi',       meaning: 'blue',             category: 'shop', note: 'color い-adj' },
  { id: 114, jp: 'しろい',     romaji: 'shiroi',    meaning: 'white',            category: 'shop', note: 'color い-adj' },
  { id: 115, jp: 'きいろい',   romaji: 'kiiroi',    meaning: 'yellow',           category: 'shop', note: 'color い-adj' },
  { id: 116, jp: 'くろい',     romaji: 'kuroi',     meaning: 'black',            category: 'shop', note: 'color い-adj' },

  // ── INTRODUCTION ─────────────────────────────────────────────────────────────
  { id: 117, jp: 'せいかく',             romaji: 'seikaku',       meaning: 'personality / character', category: 'intro' },
  { id: 118, jp: 'まじめ',               romaji: 'majime',        meaning: 'serious / diligent',      category: 'intro', note: 'な-adj' },
  { id: 119, jp: 'やさしい',             romaji: 'yasashii',      meaning: 'kind / gentle',           category: 'intro', note: 'い-adj' },
  { id: 120, jp: 'げんき',               romaji: 'genki',         meaning: 'energetic / healthy',     category: 'intro', note: 'な-adj' },
  { id: 121, jp: 'おもしろい',           romaji: 'omoshiroi',     meaning: 'funny / interesting',     category: 'intro', note: 'い-adj' },
  { id: 122, jp: 'あかるい',             romaji: 'akarui',        meaning: 'cheerful / bright',       category: 'intro', note: 'い-adj' },
  { id: 123, jp: 'しずか',               romaji: 'shizuka',       meaning: 'quiet',                   category: 'intro', note: 'な-adj' },
  { id: 124, jp: 'ハンサム',             romaji: 'hansamu',       meaning: 'handsome',                category: 'intro', note: 'な-adj' },
  { id: 125, jp: 'とくい',               romaji: 'tokui',         meaning: 'good at',                 category: 'intro', note: 'な-adj' },
  { id: 126, jp: 'へた',                 romaji: 'heta',          meaning: 'bad at',                  category: 'intro', note: 'な-adj' },
  { id: 127, jp: 'すいえい',             romaji: 'suiei',         meaning: 'swimming',                category: 'intro' },
  { id: 128, jp: 'デッサン',             romaji: 'dessan',        meaning: 'drawing',                 category: 'intro' },
  { id: 129, jp: 'けいさん',             romaji: 'keisan',        meaning: 'math / calculation',      category: 'intro' },
  { id: 130, jp: 'げんご',               romaji: 'gengo',         meaning: 'languages',               category: 'intro' },
  { id: 131, jp: '〜がすきです',         romaji: '~ ga suki desu', meaning: 'like ~',                 category: 'intro' },
  { id: 132, jp: '〜がすきじゃないです', romaji: '~ ga suki ja nai desu', meaning: "don't like ~",    category: 'intro' },
  { id: 133, jp: 'なんさいですか',       romaji: 'nansai desu ka', meaning: 'how old are you?',       category: 'intro' },
  { id: 134, jp: '〜さいです',           romaji: '~ sai desu',    meaning: 'I am ~ years old',        category: 'intro' },
  { id: 135, jp: 'ともだち',             romaji: 'tomodachi',     meaning: 'friend',                  category: 'intro' },
  { id: 136, jp: 'ひと',                 romaji: 'hito',          meaning: 'person',                  category: 'intro' },

  // ── GRAMMAR PATTERNS ─────────────────────────────────────────────────────────
  { id: 137, jp: 'まじめで、やさしいです',          romaji: 'majime de, yasashii desu',       meaning: 'serious AND kind',                  category: 'grammar', note: 'な-adj connects with で' },
  { id: 138, jp: 'まじめなひとです',                romaji: 'majime na hito desu',            meaning: 'a serious person',                  category: 'grammar', note: 'な before noun!' },
  { id: 139, jp: 'まじめじゃないです',              romaji: 'majime ja nai desu',             meaning: 'NOT serious',                       category: 'grammar', note: 'な-adj negative' },
  { id: 140, jp: 'おいしくないです',                romaji: 'oishikunai desu',                meaning: 'NOT delicious',                     category: 'grammar', note: 'い-adj negative' },
  { id: 141, jp: 'まるくて、おいしいです',          romaji: 'marukute, oishii desu',          meaning: 'round AND delicious',               category: 'grammar', note: 'い-adj connects with くて' },
  { id: 142, jp: 'たかいですが、おいしくないです',  romaji: 'takai desu ga, oishikunai desu', meaning: 'expensive BUT not delicious',       category: 'grammar', note: 'contrast with が' },
  { id: 143, jp: 'みせにいきます',                  romaji: 'mise ni ikimasu',                meaning: 'go TO the shop',                    category: 'grammar', note: 'に = direction' },
  { id: 144, jp: 'みせでたべます',                  romaji: 'mise de tabemasu',               meaning: 'eat AT the shop',                   category: 'grammar', note: 'で = place of action' },
  { id: 145, jp: 'よくなにをしますか',              romaji: 'yoku nani wo shimasu ka',        meaning: 'what do you often do?',             category: 'grammar' },
  { id: 146, jp: 'やすみになにをしましたか',        romaji: 'yasumi ni nani wo shimashita ka', meaning: 'what did you do on your day off?', category: 'grammar' },
  { id: 147, jp: 'どんなひとですか',                romaji: 'donna hito desu ka',             meaning: 'what kind of person are they?',     category: 'grammar' },
  { id: 148, jp: 'なにいろがすきですか',            romaji: 'nani iro ga suki desu ka',       meaning: 'what colour do you like?',          category: 'grammar' },
  { id: 149, jp: 'どこにもいきません',              romaji: 'doko ni mo ikimasen',            meaning: "don't go anywhere",                 category: 'grammar', note: 'も = not either' },
  { id: 150, jp: 'なにもしません',                  romaji: 'nani mo shimasen',               meaning: "don't do anything",                 category: 'grammar', note: 'も = not either' },
];

export const cltCategories: { id: CLTCategory | 'all'; label: string; jp: string; exam?: boolean }[] = [
  { id: 'all',       label: 'All',           jp: '全部' },
  { id: 'frequency', label: 'Frequency',     jp: '頻度',   exam: true },
  { id: 'past',      label: 'In the Past',   jp: '過去',   exam: true },
  { id: 'shop',      label: 'In the Shop',   jp: '店で',   exam: true },
  { id: 'intro',     label: 'Introduction',  jp: '紹介',   exam: true },
  { id: 'grammar',   label: 'Grammar',       jp: '文法' },
];
