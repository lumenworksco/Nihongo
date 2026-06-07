export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ReadingPassage {
  id: number;
  title: string;
  titleEn: string;
  type: 'notice' | 'email' | 'diary' | 'menu' | 'story' | 'info' | 'letter' | 'weather';
  text: string;
  questions: ReadingQuestion[];
}

export const passages: ReadingPassage[] = [
  {
    id: 1,
    title: 'クラスのお知らせ',
    titleEn: 'Class Notice',
    type: 'notice',
    text: `学校からのお知らせです。

来週の木曜日は、学校が休みです。
授業はありません。

図書館はひらいています。
午前9時から午後5時までです。
本を借りることができます。`,
    questions: [
      {
        id: '1-1',
        question: 'いつ学校が休みですか。',
        options: ['来週の火曜日', '来週の水曜日', '来週の木曜日', '来週の金曜日'],
        correct: 2,
        explanation: '「来週の木曜日は、学校が休みです」とあります。',
      },
      {
        id: '1-2',
        question: '図書館は何時に閉まりますか。',
        options: ['午後3時', '午後4時', '午後5時', '午後6時'],
        correct: 2,
        explanation: '「午前9時から午後5時まで」とあります。',
      },
      {
        id: '1-3',
        question: '図書館でできることは何ですか。',
        options: ['映画を見ることができる', '勉強を教えてもらえる', '本を借りることができる', '何もできない'],
        correct: 2,
        explanation: '「本を借りることができます」とあります。',
      },
    ],
  },
  {
    id: 2,
    title: 'さくらからのメール',
    titleEn: 'Email from Sakura',
    type: 'email',
    text: `田中さんへ

こんにちは。さくらです。
あした、いっしょに映画を見ませんか。
映画は午後2時からです。
映画館は駅の前にあります。
映画の後で、夕食を食べましょう。

さくらより`,
    questions: [
      {
        id: '2-1',
        question: 'さくらは田中さんを何に誘っていますか。',
        options: ['図書館に行くこと', '買い物に行くこと', '映画を見ること', '夕食を食べること'],
        correct: 2,
        explanation: '「いっしょに映画を見ませんか」とあります。',
      },
      {
        id: '2-2',
        question: '映画館はどこにありますか。',
        options: ['駅の後ろ', '駅の前', '駅の近くの公園', '駅の中'],
        correct: 1,
        explanation: '「映画館は駅の前にあります」とあります。',
      },
      {
        id: '2-3',
        question: '映画の後で、何をする予定ですか。',
        options: ['買い物をする', '図書館に行く', '夕食を食べる', 'うちに帰る'],
        correct: 2,
        explanation: '「映画の後で、夕食を食べましょう」とあります。',
      },
    ],
  },
  {
    id: 3,
    title: 'きょうの日記',
    titleEn: "Today's Diary",
    type: 'diary',
    text: `今日は学校が休みでした。
午前中は家で勉強しました。
お昼ごはんは母と食べました。
午後は友達と公園で遊びました。
とても楽しい一日でした。`,
    questions: [
      {
        id: '3-1',
        question: '午前中、何をしましたか。',
        options: ['公園で遊んだ', '友達と映画を見た', '家で勉強した', '学校に行った'],
        correct: 2,
        explanation: '「午前中は家で勉強しました」とあります。',
      },
      {
        id: '3-2',
        question: 'お昼ごはんは誰と食べましたか。',
        options: ['友達と', '一人で', '母と', '父と'],
        correct: 2,
        explanation: '「お昼ごはんは母と食べました」とあります。',
      },
      {
        id: '3-3',
        question: '午後はどこで遊びましたか。',
        options: ['学校で', '家で', '図書館で', '公園で'],
        correct: 3,
        explanation: '「午後は友達と公園で遊びました」とあります。',
      },
    ],
  },
  {
    id: 4,
    title: 'カフェ「さくら」のメニュー',
    titleEn: 'Café Sakura Menu',
    type: 'menu',
    text: `カフェ「さくら」

コーヒー　　　　300円
こうちゃ　　　　300円
ジュース　　　　250円
ケーキ　　　　　400円
サンドイッチ　　500円

ランチセット　　700円
（サンドイッチとコーヒー）`,
    questions: [
      {
        id: '4-1',
        question: 'ジュースはいくらですか。',
        options: ['300円', '250円', '400円', '500円'],
        correct: 1,
        explanation: 'メニューに「ジュース 250円」とあります。',
      },
      {
        id: '4-2',
        question: 'ランチセットには何が入っていますか。',
        options: ['ケーキとコーヒー', 'サンドイッチとジュース', 'サンドイッチとコーヒー', 'ケーキとこうちゃ'],
        correct: 2,
        explanation: '「ランチセット（サンドイッチとコーヒー）」とあります。',
      },
      {
        id: '4-3',
        question: 'コーヒーとジュースをそれぞれ一つずつ買うといくらになりますか。',
        options: ['500円', '550円', '600円', '650円'],
        correct: 1,
        explanation: 'コーヒー300円＋ジュース250円＝550円です。',
      },
    ],
  },
  {
    id: 5,
    title: '明日の天気予報',
    titleEn: "Tomorrow's Weather",
    type: 'weather',
    text: `明日の天気予報をお知らせします。

東京：午前は晴れです。午後から雨が降ります。
気温は16度です。

大阪：一日中くもりです。
気温は14度です。

かさを持っていったほうがいいですよ。`,
    questions: [
      {
        id: '5-1',
        question: '東京の午前の天気はどうですか。',
        options: ['雨', 'くもり', '晴れ', '雪'],
        correct: 2,
        explanation: '「東京：午前は晴れです」とあります。',
      },
      {
        id: '5-2',
        question: '東京で雨はいつ降りますか。',
        options: ['午前から', '午後から', '夜から', '雨は降らない'],
        correct: 1,
        explanation: '「午後から雨が降ります」とあります。',
      },
      {
        id: '5-3',
        question: '大阪の天気はどうですか。',
        options: ['晴れ', '雨', '一日中くもり', '午前は晴れで午後から雨'],
        correct: 2,
        explanation: '「大阪：一日中くもりです」とあります。',
      },
    ],
  },
  {
    id: 6,
    title: 'はじめまして',
    titleEn: 'Self-Introduction',
    type: 'letter',
    text: `はじめまして。山田花子といいます。

大阪から来ました。今は東京の大学で英語を勉強しています。
大学を出た後で、英語の先生になりたいです。

趣味は音楽と映画です。
好きな音楽はJ-POPです。

どうぞよろしくお願いします。`,
    questions: [
      {
        id: '6-1',
        question: '山田花子さんはどこから来ましたか。',
        options: ['東京', '大阪', '京都', '名古屋'],
        correct: 1,
        explanation: '「大阪から来ました」とあります。',
      },
      {
        id: '6-2',
        question: '山田さんは今、何を勉強していますか。',
        options: ['日本語', '音楽', '英語', '映画'],
        correct: 2,
        explanation: '「東京の大学で英語を勉強しています」とあります。',
      },
      {
        id: '6-3',
        question: '山田さんの趣味は何ですか。',
        options: ['英語と音楽', '音楽と映画', '映画とスポーツ', 'J-POPと英語'],
        correct: 1,
        explanation: '「趣味は音楽と映画です」とあります。',
      },
    ],
  },
  {
    id: 7,
    title: 'たなかスーパーのご案内',
    titleEn: 'Tanaka Supermarket Info',
    type: 'info',
    text: `「たなかスーパー」のご案内

まいにち　午前9時から午後8時まで　開いています。

地下鉄「南駅」から歩いて5分です。

今週の土曜日は、野菜と果物が安いです。
ぜひ来てください。`,
    questions: [
      {
        id: '7-1',
        question: 'スーパーは何時に閉まりますか。',
        options: ['午後5時', '午後6時', '午後8時', '午後9時'],
        correct: 2,
        explanation: '「午前9時から午後8時まで」とあります。',
      },
      {
        id: '7-2',
        question: 'スーパーへはどうやって行きますか。',
        options: ['バスで5分', '電車で10分', '地下鉄の南駅から歩いて5分', '車で10分'],
        correct: 2,
        explanation: '「地下鉄「南駅」から歩いて5分です」とあります。',
      },
      {
        id: '7-3',
        question: 'いつ野菜と果物が安いですか。',
        options: ['毎日', '今週の土曜日', '今週の日曜日', '来週の土曜日'],
        correct: 1,
        explanation: '「今週の土曜日は、野菜と果物が安いです」とあります。',
      },
    ],
  },
  {
    id: 8,
    title: '母と買い物',
    titleEn: 'Shopping with Mom',
    type: 'story',
    text: `昨日、母はスーパーへ買い物に行きました。
野菜と果物を買いました。
りんごを3こと、バナナを買いました。
ぜんぶで850円でした。
家に帰ってから、母はサラダを作りました。
サラダはとてもおいしかったです。`,
    questions: [
      {
        id: '8-1',
        question: '誰が買い物に行きましたか。',
        options: ['父', '兄', '母', '姉'],
        correct: 2,
        explanation: '「母はスーパーへ買い物に行きました」とあります。',
      },
      {
        id: '8-2',
        question: '買い物で何を買いましたか。',
        options: ['肉と野菜', '野菜と果物', '果物とお菓子', '野菜と魚'],
        correct: 1,
        explanation: '「野菜と果物を買いました」とあります。',
      },
      {
        id: '8-3',
        question: '家に帰ってから、何をしましたか。',
        options: ['夕食を食べた', '勉強した', 'サラダを作った', 'テレビを見た'],
        correct: 2,
        explanation: '「家に帰ってから、母はサラダを作りました」とあります。',
      },
    ],
  },
  {
    id: 9,
    title: '駅のお知らせ',
    titleEn: 'Station Announcement',
    type: 'notice',
    text: `お客様へのお知らせ

あしたの午前10時から午後2時まで、
「北口」が工事のため閉まります。

「南口」は開いています。

ご不便をおかけして、すみません。`,
    questions: [
      {
        id: '9-1',
        question: '工事はいつですか。',
        options: ['今日の午前10時から午後2時まで', '明日の午前10時から午後2時まで', '明日の午後10時から', '今週の土曜日'],
        correct: 1,
        explanation: '「あしたの午前10時から午後2時まで」とあります。',
      },
      {
        id: '9-2',
        question: '工事の間、どの出口が閉まっていますか。',
        options: ['南口', '北口', '東口', '西口'],
        correct: 1,
        explanation: '「「北口」が工事のため閉まります」とあります。',
      },
      {
        id: '9-3',
        question: '工事の間、どの出口が使えますか。',
        options: ['北口', '東口', '南口', 'どの出口も使えない'],
        correct: 2,
        explanation: '「「南口」は開いています」とあります。',
      },
    ],
  },
  {
    id: 10,
    title: '先生からのメッセージ',
    titleEn: "Message from the Teacher",
    type: 'email',
    text: `みなさんへ

来週の月曜日に、テストがあります。
テストは日本語のテストです。
ひらがなと漢字が出ます。

よく勉強してください。
わからないことがあったら、
月曜日の前に質問してください。

先生より`,
    questions: [
      {
        id: '10-1',
        question: 'テストはいつありますか。',
        options: ['今週の月曜日', '来週の月曜日', '来週の金曜日', '今週の金曜日'],
        correct: 1,
        explanation: '「来週の月曜日に、テストがあります」とあります。',
      },
      {
        id: '10-2',
        question: 'テストで何が出ますか。',
        options: ['英語と数学', 'カタカナと漢字', 'ひらがなと漢字', 'ひらがなとカタカナ'],
        correct: 2,
        explanation: '「ひらがなと漢字が出ます」とあります。',
      },
      {
        id: '10-3',
        question: '質問はいつしたらいいですか。',
        options: ['テストの後で', 'テストの日に', '月曜日の前に', '来週の金曜日に'],
        correct: 2,
        explanation: '「月曜日の前に質問してください」とあります。',
      },
    ],
  },
];

export const TYPE_LABELS: Record<ReadingPassage['type'], string> = {
  notice:  'Notice',
  email:   'Email',
  diary:   'Diary',
  menu:    'Menu',
  story:   'Story',
  info:    'Info',
  letter:  'Letter',
  weather: 'Weather',
};
