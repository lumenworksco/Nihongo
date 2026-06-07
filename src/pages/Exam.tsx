import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, ChevronRight, RotateCcw, CheckCircle2, XCircle, BookOpenText } from 'lucide-react';
import { generateExam, SECTION_META, type ExamQuestion, type QuestionSection } from '../lib/examGenerator';

const ACCENT = '#f97316';

type Phase = 'start' | 'testing' | 'results';

function ScoreBadge({ pct }: { pct: number }) {
  const color = pct >= 70 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#ef4444';
  const label = pct >= 70 ? 'Pass' : 'Not yet';
  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-semibold"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {label}
    </span>
  );
}

function QuestionCard({
  question,
  userAnswer,
  revealed,
  onAnswer,
}: {
  question: ExamQuestion;
  userAnswer: number | null;
  revealed: boolean;
  onAnswer: (idx: number) => void;
}) {
  const meta = SECTION_META[question.section];

  return (
    <div className="flex flex-col gap-5">
      {/* Passage context (reading questions) */}
      {question.passageText && (
        <div
          className="rounded-2xl p-5"
          style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpenText size={12} style={{ color: '#10b981' }} />
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#10b981' }}>
              {question.passageTitle}
            </p>
          </div>
          <p className="jp text-sm leading-loose whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {question.passageText}
          </p>
        </div>
      )}

      {/* Question prompt */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'var(--surface)', border: `1px solid ${meta.color}30` }}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: meta.color }}>
          {meta.jp}
        </p>
        <p className="jp text-3xl font-bold text-white mb-2">{question.prompt}</p>
        {question.promptHint && (
          <p className="jp text-sm" style={{ color: 'var(--muted)' }}>{question.promptHint}</p>
        )}
        {question.question && (
          <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.7)' }}>{question.question}</p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {question.options.map((opt, oi) => {
          let bg = 'var(--faint)';
          let border = 'var(--border)';
          let textColor: string = 'rgba(255,255,255,0.85)';
          let icon: React.ReactNode = (
            <span
              className="shrink-0 w-7 h-7 rounded-full border text-xs flex items-center justify-center font-bold"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              {String.fromCharCode(65 + oi)}
            </span>
          );

          if (revealed) {
            if (oi === question.correct) {
              bg = 'rgba(74,222,128,0.12)';
              border = 'rgba(74,222,128,0.4)';
              textColor = '#4ade80';
              icon = <CheckCircle2 size={18} className="shrink-0" style={{ color: '#4ade80' }} />;
            } else if (oi === userAnswer) {
              bg = 'rgba(239,68,68,0.12)';
              border = 'rgba(239,68,68,0.4)';
              textColor = '#ef4444';
              icon = <XCircle size={18} className="shrink-0" style={{ color: '#ef4444' }} />;
            } else {
              textColor = 'var(--muted)';
            }
          }

          return (
            <button
              key={oi}
              disabled={revealed}
              onClick={() => onAnswer(oi)}
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-left text-sm transition-all disabled:cursor-default"
              style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
            >
              {icon}
              <span className="jp">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {revealed && question.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-5 py-3 text-sm jp"
            style={{ background: 'var(--faint)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            {question.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultsScreen({ questions, answers, onRetake }: {
  questions: ExamQuestion[];
  answers: (number | null)[];
  onRetake: () => void;
}) {
  const [reviewSection, setReviewSection] = useState<QuestionSection | 'wrong' | null>(null);

  const sectionStats = useMemo(() => {
    const sections: QuestionSection[] = ['vocabulary', 'grammar', 'reading'];
    return sections.map(sec => {
      const qs = questions.map((q, i) => ({ q, a: answers[i] })).filter(({ q }) => q.section === sec);
      const correct = qs.filter(({ q, a }) => a === q.correct).length;
      return { section: sec, correct, total: qs.length };
    });
  }, [questions, answers]);

  const totalCorrect = answers.filter((a, i) => a === questions[i].correct).length;
  const totalQ = questions.length;
  const pct = Math.round((totalCorrect / totalQ) * 100);

  const wrongQuestions = questions
    .map((q, i) => ({ q, a: answers[i] }))
    .filter(({ q, a }) => a !== q.correct);

  const reviewItems = reviewSection === 'wrong'
    ? wrongQuestions
    : reviewSection
    ? questions.map((q, i) => ({ q, a: answers[i] })).filter(({ q }) => q.section === reviewSection)
    : [];

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-28 md:pb-10">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardCheck size={20} style={{ color: ACCENT }} />
        <h1 className="text-xl font-semibold text-white">Results</h1>
      </div>

      {/* Overall score */}
      <div
        className="rounded-2xl p-6 mb-4 text-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-7xl font-bold mb-2" style={{ color: pct >= 70 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#ef4444' }}>
          {pct}%
        </p>
        <p className="text-lg text-white mb-1">{totalCorrect} / {totalQ} correct</p>
        <div className="flex justify-center mt-3">
          <ScoreBadge pct={pct} />
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
          JLPT N5 passing threshold is approximately 70% overall with minimum scores per section.
        </p>
      </div>

      {/* Section breakdown */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
          Section breakdown
        </p>
        <div className="flex flex-col gap-4">
          {sectionStats.map(({ section, correct, total }) => {
            const meta = SECTION_META[section];
            const sPct = total > 0 ? Math.round((correct / total) * 100) : 0;
            return (
              <div key={section}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{meta.label}</span>
                    <span className="jp text-xs" style={{ color: meta.color }}>{meta.jp}</span>
                  </div>
                  <span className="text-sm font-mono" style={{ color: meta.color }}>{correct}/{total} · {sPct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--faint)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: meta.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${sPct}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {wrongQuestions.length > 0 && (
          <button
            onClick={() => setReviewSection(v => v === 'wrong' ? null : 'wrong')}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{
              background: reviewSection === 'wrong' ? 'rgba(239,68,68,0.15)' : 'var(--faint)',
              color: reviewSection === 'wrong' ? '#ef4444' : 'var(--muted)',
              border: `1px solid ${reviewSection === 'wrong' ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
            }}
          >
            Review mistakes ({wrongQuestions.length})
          </button>
        )}
        {(['vocabulary', 'grammar', 'reading'] as const).map(sec => (
          <button
            key={sec}
            onClick={() => setReviewSection(v => v === sec ? null : sec)}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{
              background: reviewSection === sec ? `${SECTION_META[sec].color}18` : 'var(--faint)',
              color: reviewSection === sec ? SECTION_META[sec].color : 'var(--muted)',
              border: `1px solid ${reviewSection === sec ? `${SECTION_META[sec].color}40` : 'var(--border)'}`,
            }}
          >
            {SECTION_META[sec].label}
          </button>
        ))}
      </div>

      {/* Review list */}
      <AnimatePresence>
        {reviewSection && reviewItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-3 mb-6"
          >
            {reviewItems.map(({ q, a }, i) => {
              const isCorrect = a === q.correct;
              return (
                <div
                  key={`${q.id}-${i}`}
                  className="rounded-xl p-4"
                  style={{
                    background: isCorrect ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect
                      ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: '#4ade80' }} />
                      : <XCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                    }
                    <div className="flex-1 min-w-0">
                      <p className="jp text-sm font-medium text-white mb-1">{q.prompt}</p>
                      {q.question && <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{q.question}</p>}
                      <div className="flex flex-col gap-0.5">
                        {!isCorrect && a !== null && (
                          <p className="text-xs" style={{ color: '#ef4444' }}>
                            Your answer: <span className="jp">{q.options[a]}</span>
                          </p>
                        )}
                        <p className="text-xs" style={{ color: '#4ade80' }}>
                          Correct: <span className="jp">{q.options[q.correct]}</span>
                        </p>
                        {q.explanation && (
                          <p className="text-xs mt-1 jp" style={{ color: 'var(--muted)' }}>{q.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onRetake}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors"
        style={{ background: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}35` }}
      >
        <RotateCcw size={14} />
        Take new exam
      </button>
    </div>
  );
}

export default function Exam() {
  const [phase, setPhase] = useState<Phase>('start');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [revealed, setRevealed] = useState(false);

  const startExam = () => {
    const qs = generateExam();
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(null));
    setCurrentIdx(0);
    setRevealed(false);
    setPhase('testing');
    window.scrollTo(0, 0);
  };

  const handleAnswer = (optIdx: number) => {
    if (revealed) return;
    setAnswers(a => { const n = [...a]; n[currentIdx] = optIdx; return n; });
    setRevealed(true);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setPhase('results');
      window.scrollTo(0, 0);
    } else {
      setCurrentIdx(i => i + 1);
      setRevealed(false);
      window.scrollTo(0, 0);
    }
  };

  const currentQuestion = questions[currentIdx];
  const sectionChange = currentIdx > 0 && currentQuestion?.section !== questions[currentIdx - 1]?.section;
  const currentMeta = currentQuestion ? SECTION_META[currentQuestion.section] : null;

  if (phase === 'results') {
    return <ResultsScreen questions={questions} answers={answers} onRetake={() => setPhase('start')} />;
  }

  if (phase === 'testing' && currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-10 pb-28 md:pb-10">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {currentMeta && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-widest"
                  style={{ background: `${currentMeta.color}18`, color: currentMeta.color, border: `1px solid ${currentMeta.color}30` }}
                >
                  {currentMeta.label}
                </span>
              )}
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
              {currentIdx + 1} / {questions.length}
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--faint)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: ACCENT }}
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Section change banner */}
        {sectionChange && currentMeta && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2 text-sm"
            style={{ background: `${currentMeta.color}12`, border: `1px solid ${currentMeta.color}30`, color: currentMeta.color }}
          >
            <span className="jp font-medium">{currentMeta.jp}</span>
            <span className="text-xs opacity-70">— {currentMeta.label} section</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <QuestionCard
              question={currentQuestion}
              userAnswer={answers[currentIdx]}
              revealed={revealed}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>

        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ background: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}35` }}
            >
              {currentIdx + 1 >= questions.length ? 'See results' : 'Next question'}
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // Start screen
  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-28 md:pb-10">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardCheck size={20} style={{ color: ACCENT }} />
        <div>
          <h1 className="text-xl font-semibold text-white">Mock Exam</h1>
          <p className="jp text-sm mt-0.5" style={{ color: 'var(--muted)' }}>模擬試験 · JLPT N5</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-lg font-semibold text-white mb-2">JLPT N5 Practice Exam</p>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          A mock exam covering vocabulary, grammar, particles, and reading — styled after the real JLPT N5 format.
          Questions are randomly generated each time.
        </p>

        <div className="flex flex-col gap-3">
          {(
            [
              { section: 'vocabulary' as const, desc: '20 questions — word meaning, reading, kanji' },
              { section: 'grammar'    as const, desc: '20 questions — particle fill-in, grammar structures' },
              { section: 'reading'    as const, desc: '~9 questions — 3 short passages with comprehension' },
            ] as const
          ).map(({ section, desc }) => {
            const meta = SECTION_META[section];
            return (
              <div
                key={section}
                className="flex items-center gap-4 px-4 py-3 rounded-xl"
                style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
                >
                  <span className="text-xs font-bold" style={{ color: meta.color }}>
                    {section === 'vocabulary' ? 'V' : section === 'grammar' ? 'G' : 'R'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{meta.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-5 p-4 rounded-xl text-xs"
          style={{ background: 'var(--faint)', border: '1px solid var(--border)', color: 'var(--muted)' }}
        >
          <strong className="text-white">Note:</strong> This exam tests recognition and reading comprehension. The real JLPT N5 also includes a listening section (not yet available in this app).
          A score of 70%+ overall is a rough indicator of N5 readiness.
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={startExam}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-semibold transition-all"
        style={{ background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <ClipboardCheck size={18} />
        Start exam
      </motion.button>
    </div>
  );
}
