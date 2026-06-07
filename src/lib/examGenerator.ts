import { vocabulary } from '../data/vocabulary';
import { kanjiEntries } from '../data/kanji';
import { passages } from '../data/reading';

export type QuestionSection = 'vocabulary' | 'grammar' | 'reading';

export interface ExamQuestion {
  id: string;
  section: QuestionSection;
  prompt: string;
  promptHint?: string;
  passageText?: string;
  passageTitle?: string;
  question?: string;
  options: string[];
  correct: number;
  explanation?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function makeOptions(correct: string, pool: string[], totalOptions = 4): { options: string[]; correct: number } {
  const distractors = pick(pool.filter(x => x !== correct), totalOptions - 1);
  const options = shuffle([correct, ...distractors]);
  return { options, correct: options.indexOf(correct) };
}

// ── Vocabulary: meaning questions ───────────────────────────────────────────
function generateMeaningQuestions(n: number): ExamQuestion[] {
  const pool = vocabulary.filter(w => w.kanji.length > 0);
  const selected = pick(pool, n);
  const allMeanings = vocabulary.map(w => w.meaning.split(',')[0].trim());

  return selected.map((word, i) => {
    const correct = word.meaning.split(',')[0].trim();
    const { options, correct: correctIdx } = makeOptions(correct, allMeanings);
    return {
      id: `vocab-meaning-${i}`,
      section: 'vocabulary' as const,
      prompt: word.kanji,
      promptHint: word.kana !== word.kanji ? word.kana : undefined,
      question: 'What does this word mean?',
      options,
      correct: correctIdx,
      explanation: `${word.kanji}（${word.kana}）means "${word.meaning}".`,
    };
  });
}

// ── Vocabulary: reading (kanji → kana) ──────────────────────────────────────
function generateReadingQuestions(n: number): ExamQuestion[] {
  const pool = vocabulary.filter(w => w.kanji !== w.kana && /[一-龯]/.test(w.kanji));
  const selected = pick(pool, n);
  const allKana = vocabulary.filter(w => w.kanji !== w.kana).map(w => w.kana);

  return selected.map((word, i) => {
    const { options, correct } = makeOptions(word.kana, allKana);
    return {
      id: `vocab-reading-${i}`,
      section: 'vocabulary' as const,
      prompt: word.kanji,
      question: 'How do you read this word?',
      options,
      correct,
      explanation: `${word.kanji} is read as "${word.kana}" (${word.meaning}).`,
    };
  });
}

// ── Kanji: meaning questions ─────────────────────────────────────────────────
function generateKanjiQuestions(n: number): ExamQuestion[] {
  const selected = pick(kanjiEntries, n);
  const allMeanings = kanjiEntries.map(k => k.meanings[0]);

  return selected.map((k, i) => {
    const correct = k.meanings[0];
    const { options, correct: correctIdx } = makeOptions(correct, allMeanings);
    return {
      id: `kanji-${i}`,
      section: 'vocabulary' as const,
      prompt: k.kanji,
      question: 'What does this kanji mean?',
      options,
      correct: correctIdx,
      explanation: `${k.kanji} means "${k.meanings.join(', ')}". On: ${k.onyomi.join('・') || '—'} / Kun: ${k.kunyomi.join('・') || '—'}`,
    };
  });
}

// ── Static grammar + particle questions ──────────────────────────────────────
const STATIC_GRAMMAR: Omit<ExamQuestion, 'id'>[] = [
  // Particles
  {
    section: 'grammar',
    prompt: '毎朝コーヒー＿飲みます。',
    question: 'Which particle fills the blank?',
    options: ['を', 'が', 'に', 'は'],
    correct: 0,
    explanation: '「を」marks the direct object of the verb.',
  },
  {
    section: 'grammar',
    prompt: '部屋＿猫がいます。',
    question: 'Which particle fills the blank?',
    options: ['に', 'で', 'を', 'が'],
    correct: 0,
    explanation: '「に」marks the location of existence (ある/いる).',
  },
  {
    section: 'grammar',
    prompt: '電車＿学校に行きます。',
    question: 'Which particle fills the blank?',
    options: ['で', 'に', 'を', 'が'],
    correct: 0,
    explanation: '「で」marks the means of transport.',
  },
  {
    section: 'grammar',
    prompt: '友達＿映画を見ました。',
    question: 'Which particle fills the blank?',
    options: ['と', 'が', 'に', 'を'],
    correct: 0,
    explanation: '「と」marks doing something together with someone.',
  },
  {
    section: 'grammar',
    prompt: '本は机の上＿あります。',
    question: 'Which particle fills the blank?',
    options: ['に', 'で', 'を', 'が'],
    correct: 0,
    explanation: '「に」marks the location of an existing object.',
  },
  {
    section: 'grammar',
    prompt: '東京＿大阪まで新幹線で行きます。',
    question: 'Which particle fills the blank?',
    options: ['から', 'まで', 'に', 'で'],
    correct: 0,
    explanation: '「から」marks the starting point of movement.',
  },
  {
    section: 'grammar',
    prompt: '先生＿日本語を習っています。',
    question: 'Which particle fills the blank?',
    options: ['に', 'で', 'を', 'が'],
    correct: 0,
    explanation: '「に」is used with 習う to mean "learn from".',
  },
  {
    section: 'grammar',
    prompt: 'あの人は田中さん＿お兄さんです。',
    question: 'Which particle fills the blank?',
    options: ['の', 'が', 'を', 'に'],
    correct: 0,
    explanation: '「の」shows possession or relationship.',
  },
  {
    section: 'grammar',
    prompt: '図書館＿本を読みました。',
    question: 'Which particle fills the blank?',
    options: ['で', 'に', 'を', 'が'],
    correct: 0,
    explanation: '「で」marks the location where an action takes place.',
  },
  {
    section: 'grammar',
    prompt: '日本語＿話せますか？',
    question: 'Which particle fills the blank?',
    options: ['が', 'を', 'に', 'は'],
    correct: 0,
    explanation: '「が」is used with potential verbs to mark the object of ability.',
  },
  // Grammar structures
  {
    section: 'grammar',
    prompt: '寝る＿に、歯を磨きます。',
    question: 'Which word fills the blank?',
    options: ['前', '後', 'から', 'まで'],
    correct: 0,
    explanation: '「〜前に」means "before doing ~".',
  },
  {
    section: 'grammar',
    prompt: '音楽を聞き＿、勉強します。',
    question: 'Which word fills the blank?',
    options: ['ながら', 'てから', 'ので', 'ために'],
    correct: 0,
    explanation: '「〜ながら」means doing two things simultaneously.',
  },
  {
    section: 'grammar',
    prompt: '疲れた＿、早く帰ります。',
    question: 'Which word fills the blank?',
    options: ['ので', 'でも', 'ながら', 'まで'],
    correct: 0,
    explanation: '「〜ので」gives a reason (softer/polite version of から).',
  },
  {
    section: 'grammar',
    prompt: '日本語を話す＿ができます。',
    question: 'Which word fills the blank?',
    options: ['こと', 'もの', 'の', 'ところ'],
    correct: 0,
    explanation: '「〜ことができる」expresses ability or possibility.',
  },
  {
    section: 'grammar',
    prompt: '早く寝た＿がいいですよ。',
    question: 'Which word fills the blank?',
    options: ['ほう', 'まで', 'しか', 'だけ'],
    correct: 0,
    explanation: '「〜たほうがいい」gives advice ("you should ~").',
  },
  {
    section: 'grammar',
    prompt: '宿題をして＿、ゲームをします。',
    question: 'Which word fills the blank?',
    options: ['から', 'ので', 'ながら', 'でも'],
    correct: 0,
    explanation: '「〜てから」means "after doing ~ (then …)".',
  },
  {
    section: 'grammar',
    prompt: '富士山に登った＿があります。',
    question: 'Which word fills the blank?',
    options: ['こと', 'もの', 'の', 'ところ'],
    correct: 0,
    explanation: '「〜たことがある」expresses past experience.',
  },
  {
    section: 'grammar',
    prompt: '食べ＿ました。お腹が痛いです。',
    question: 'Which word fills the blank?',
    options: ['すぎ', 'すぎて', 'すぎる', 'すぎた'],
    correct: 0,
    explanation: '「食べすぎました」= ate too much. すぎ attaches to verb stems.',
  },
  {
    section: 'grammar',
    prompt: 'ここで写真を撮っては＿。',
    question: 'Which word fills the blank?',
    options: ['いけません', 'ありません', 'なりません', 'できません'],
    correct: 0,
    explanation: '「〜てはいけない」expresses prohibition.',
  },
  {
    section: 'grammar',
    prompt: '一緒に昼ご飯を食べ＿。（誘う場合）',
    question: 'Which ending is most natural when making an invitation?',
    options: ['ましょう', 'ません', 'ますか', 'てください'],
    correct: 0,
    explanation: '「〜ましょう」proposes doing something together.',
  },
  {
    section: 'grammar',
    prompt: '雨な＿、外に出ません。',
    question: 'Which word fills the blank?',
    options: ['ので', 'から', 'のに', 'でも'],
    correct: 0,
    explanation: '「〜なので」gives a reason. Use なの after nouns/な-adjectives.',
  },
  {
    section: 'grammar',
    prompt: '明日は晴れる＿しれません。',
    question: 'Which word fills the blank?',
    options: ['かも', 'でも', 'しか', 'だけ'],
    correct: 0,
    explanation: '「〜かもしれない」expresses possibility ("might, may").',
  },
  {
    section: 'grammar',
    prompt: '日本に来る＿、日本語を勉強しました。',
    question: 'Which phrase fills the blank?',
    options: ['前に', '後で', 'てから', 'ながら'],
    correct: 0,
    explanation: '「〜前に」means "before doing ~". The verb before 前に is always in plain non-past form.',
  },
  {
    section: 'grammar',
    prompt: 'この本を読んで＿。（図書館でお願いする）',
    question: 'Which phrase fills the blank when asking permission?',
    options: ['もいいですか', 'ください', 'あります', 'います'],
    correct: 0,
    explanation: '「〜てもいいですか」asks for permission.',
  },
  {
    section: 'grammar',
    prompt: '心配し＿でください。',
    question: 'Which word fills the blank?',
    options: ['ない', 'ません', 'なく', 'ず'],
    correct: 0,
    explanation: '「〜ないでください」is a polite request not to do something.',
  },
];

// ── Reading comprehension ────────────────────────────────────────────────────
function generateReadingComprehensionQuestions(passageIds: number[]): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  for (const id of passageIds) {
    const passage = passages.find(p => p.id === id);
    if (!passage) continue;
    passage.questions.forEach((q, qi) => {
      questions.push({
        id: `reading-${id}-${qi}`,
        section: 'reading',
        prompt: q.question,
        passageText: passage.text,
        passageTitle: passage.title,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation,
      });
    });
  }
  return questions;
}

// ── Main exam builder ────────────────────────────────────────────────────────
export function generateExam(): ExamQuestion[] {
  const vocabMeaning = generateMeaningQuestions(10);
  const vocabReading = generateReadingQuestions(5);
  const kanjiQ       = generateKanjiQuestions(5);

  const grammarQ = shuffle(STATIC_GRAMMAR)
    .slice(0, 20)
    .map((q, i) => ({ ...q, id: `grammar-${i}` }));

  const pickedPassages = pick(passages, 3).map(p => p.id);
  const readingQ = generateReadingComprehensionQuestions(pickedPassages);

  return [
    ...vocabMeaning,
    ...vocabReading,
    ...kanjiQ,
    ...grammarQ,
    ...readingQ,
  ];
}

export const SECTION_META: Record<QuestionSection, { label: string; jp: string; color: string }> = {
  vocabulary: { label: 'Vocabulary',  jp: '語彙・漢字', color: '#4ade80' },
  grammar:    { label: 'Grammar',     jp: '文法・助詞', color: '#60a5fa' },
  reading:    { label: 'Reading',     jp: '読解',       color: '#10b981' },
};
