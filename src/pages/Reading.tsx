import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpenText, ChevronLeft, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { passages, TYPE_LABELS, type ReadingPassage } from '../data/reading';

const ACCENT = '#10b981';
const STORAGE_KEY = 'nihongo_reading_progress';

type PassageScore = { score: number; total: number };
type Progress = Record<number, PassageScore>;

function loadProgress(): Progress {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
}
function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

const TYPE_COLORS: Record<ReadingPassage['type'], string> = {
  notice:  '#f59e0b',
  email:   '#60a5fa',
  diary:   '#a78bfa',
  menu:    '#f97316',
  story:   '#10b981',
  info:    '#e63946',
  letter:  '#06b6d4',
  weather: '#4ade80',
};

function PassageCard({ passage, score, onClick }: {
  passage: ReadingPassage;
  score: PassageScore | undefined;
  onClick: () => void;
}) {
  const color = TYPE_COLORS[passage.type];
  const done = !!score;
  const pct = done ? Math.round((score.score / score.total) * 100) : 0;

  return (
    <motion.button
      layout
      onClick={onClick}
      className="w-full text-left rounded-2xl p-5 transition-colors"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
        >
          {passage.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="jp font-semibold text-white">{passage.title}</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-mono"
              style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
            >
              {TYPE_LABELS[passage.type]}
            </span>
            {done && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-mono ml-auto"
                style={{
                  background: pct >= 70 ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.12)',
                  color: pct >= 70 ? '#4ade80' : '#ef4444',
                }}
              >
                {score.score}/{score.total}
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{passage.titleEn} · {passage.questions.length} questions</p>
        </div>
      </div>
    </motion.button>
  );
}

function PassageView({ passage, onBack }: { passage: ReadingPassage; onBack: (score: PassageScore) => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(passage.questions.length).fill(null),
  );
  const [revealed, setRevealed] = useState<boolean[]>(
    Array(passage.questions.length).fill(false),
  );
  const [showResults, setShowResults] = useState(false);

  const color = TYPE_COLORS[passage.type];

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (revealed[qIdx]) return;
    setAnswers(a => { const n = [...a]; n[qIdx] = optIdx; return n; });
    setRevealed(r => { const n = [...r]; n[qIdx] = true; return n; });
  };

  const allAnswered = answers.every(a => a !== null);
  const score = answers.filter((a, i) => a === passage.questions[i].correct).length;

  const handleFinish = () => {
    setShowResults(true);
  };

  const handleRedo = () => {
    setAnswers(Array(passage.questions.length).fill(null));
    setRevealed(Array(passage.questions.length).fill(false));
    setShowResults(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onBack({ score, total: passage.questions.length })}
          className="flex items-center gap-1.5 text-sm transition-colors hover:text-white"
          style={{ color: 'var(--muted)' }}
        >
          <ChevronLeft size={16} />
          All passages
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span
          className="text-[10px] px-2 py-1 rounded-full font-mono uppercase tracking-widest"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
        >
          {TYPE_LABELS[passage.type]}
        </span>
        <h1 className="jp text-xl font-semibold text-white">{passage.title}</h1>
      </div>

      {/* Passage text */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: 'var(--surface)', border: `1px solid ${color}30` }}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color }}>
          本文
        </p>
        <p className="jp text-base leading-loose whitespace-pre-line text-white">
          {passage.text}
        </p>
      </div>

      {/* Results banner */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 mb-6 flex items-center justify-between"
            style={{
              background: score === passage.questions.length
                ? 'rgba(74,222,128,0.1)'
                : score >= Math.ceil(passage.questions.length * 0.7)
                ? 'rgba(251,191,36,0.1)'
                : 'rgba(239,68,68,0.1)',
              border: `1px solid ${
                score === passage.questions.length ? 'rgba(74,222,128,0.3)'
                : score >= Math.ceil(passage.questions.length * 0.7) ? 'rgba(251,191,36,0.3)'
                : 'rgba(239,68,68,0.3)'
              }`,
            }}
          >
            <div>
              <p className="font-semibold text-white">
                {score}/{passage.questions.length} correct
                {' · '}
                {Math.round((score / passage.questions.length) * 100)}%
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {score === passage.questions.length ? 'Perfect! 完璧です！' : score >= Math.ceil(passage.questions.length * 0.7) ? 'Good work! よくできました！' : 'Keep practising. もう一度やってみましょう。'}
              </p>
            </div>
            <button
              onClick={handleRedo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <RotateCcw size={11} />
              Redo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {passage.questions.map((q, qi) => {
          const userAnswer = answers[qi];
          const isRevealed = revealed[qi];
          return (
            <motion.div
              key={q.id}
              layout
              className="rounded-2xl p-5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
                問題 {qi + 1}
              </p>
              <p className="jp font-medium text-white mb-4">{q.question}</p>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  let bg = 'var(--faint)';
                  let border = 'var(--border)';
                  let textColor = 'var(--muted)';

                  if (isRevealed) {
                    if (oi === q.correct) {
                      bg = 'rgba(74,222,128,0.12)';
                      border = 'rgba(74,222,128,0.4)';
                      textColor = '#4ade80';
                    } else if (oi === userAnswer && oi !== q.correct) {
                      bg = 'rgba(239,68,68,0.12)';
                      border = 'rgba(239,68,68,0.4)';
                      textColor = '#ef4444';
                    }
                  }

                  return (
                    <button
                      key={oi}
                      disabled={isRevealed}
                      onClick={() => handleAnswer(qi, oi)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-colors disabled:cursor-default"
                      style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
                    >
                      {isRevealed && oi === q.correct && <CheckCircle2 size={14} className="shrink-0" style={{ color: '#4ade80' }} />}
                      {isRevealed && oi === userAnswer && oi !== q.correct && <XCircle size={14} className="shrink-0" style={{ color: '#ef4444' }} />}
                      {(!isRevealed || (oi !== q.correct && oi !== userAnswer)) && (
                        <span
                          className="shrink-0 w-5 h-5 rounded-full border text-[10px] flex items-center justify-center font-mono"
                          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                        >
                          {String.fromCharCode(65 + oi)}
                        </span>
                      )}
                      <span className="jp">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 text-xs jp"
                  style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}
                >
                  {q.explanation}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Finish button */}
      {allAnswered && !showResults && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <button
            onClick={handleFinish}
            className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
          >
            See results
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function Reading() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [active, setActive] = useState<ReadingPassage | null>(null);

  useEffect(() => {
    if (active) window.scrollTo(0, 0);
  }, [active]);

  const handleBack = (score: PassageScore) => {
    if (!active) return;
    const updated = { ...progress, [active.id]: score };
    setProgress(updated);
    saveProgress(updated);
    setActive(null);
  };

  const done = Object.keys(progress).length;
  const totalCorrect = Object.values(progress).reduce((s, p) => s + p.score, 0);
  const totalQ = Object.values(progress).reduce((s, p) => s + p.total, 0);

  if (active) {
    return <PassageView passage={active} onBack={handleBack} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Reading</h1>
          <p className="jp text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            読解 · {passages.length} N5 passages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BookOpenText size={18} style={{ color: ACCENT }} />
        </div>
      </div>

      {/* Stats */}
      {done > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 mb-6 flex items-center gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="text-2xl font-bold" style={{ color: ACCENT }}>{done}/{passages.length}</p>
            <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--muted)' }}>completed</p>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
            <p className="text-2xl font-bold text-white">
              {totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0}%
            </p>
            <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--muted)' }}>accuracy</p>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
            <p className="text-2xl font-bold text-white">{totalCorrect}/{totalQ}</p>
            <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--muted)' }}>correct</p>
          </div>
        </motion.div>
      )}

      {/* Passage list */}
      <div className="flex flex-col gap-3">
        {passages.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <PassageCard passage={p} score={progress[p.id]} onClick={() => setActive(p)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
