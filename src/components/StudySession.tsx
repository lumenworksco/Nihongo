import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Undo2, ArrowLeftRight } from 'lucide-react';
import type { StudyCard, CardState, Rating } from '../lib/srs';

interface UndoEntry { card: StudyCard; prevState: CardState | null; rating: Rating }

interface Props {
  queue: StudyCard[];
  onRate: (cardKey: string, rating: Rating) => CardState | null;
  onUndo: (cardKey: string, prevState: CardState | null) => void;
  onComplete: (reviewed: number, ratings: Record<Rating, number>, durationMs: number) => void;
  onBack: () => void;
  typedMode?: boolean;
}

const RATING_META: { value: Rating; label: string; hint: string; color: string; key: string }[] = [
  { value: 'again', label: 'Again',  hint: 'Forgot',    color: '#ef4444', key: '1' },
  { value: 'hard',  label: 'Hard',   hint: 'Tough',     color: '#f97316', key: '2' },
  { value: 'good',  label: 'Good',   hint: 'Got it',    color: '#4ade80', key: '3' },
  { value: 'easy',  label: 'Easy',   hint: 'Perfect',   color: '#60a5fa', key: '4' },
];

type AnswerResult = 'correct' | 'close' | 'wrong';

function normalizeAnswer(s: string): string {
  return s.toLowerCase().trim().replace(/[.,!?；。、]/g, '');
}

function checkAnswer(typed: string, correct: string): AnswerResult {
  const t = normalizeAnswer(typed);
  if (!t) return 'wrong';
  const alts = correct.split(/[,、]/).map(normalizeAnswer).filter(Boolean);
  const strip = (s: string) => s.startsWith('to ') ? s.slice(3) : s;
  if (alts.some(a => strip(a) === strip(t))) return 'correct';
  if (alts.some(a => a.includes(t) || t.includes(a))) return 'close';
  return 'wrong';
}

const RESULT_META: Record<AnswerResult, { label: string; color: string; bg: string }> = {
  correct: { label: '✓ Correct',  color: '#4ade80', bg: 'rgba(74,222,128,0.1)'  },
  close:   { label: '~ Almost',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  wrong:   { label: '✗ Wrong',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
};

export default function StudySession({ queue, onRate, onUndo, onComplete, onBack, typedMode = false }: Props) {
  const [localQueue, setLocalQueue] = useState<StudyCard[]>(() => [...queue]);
  const [index, setIndex]           = useState(0);
  const [revealed, setRevealed]     = useState(false);
  const [undoStack, setUndoStack]   = useState<UndoEntry[]>([]);
  const [ratings, setRatings]       = useState<Record<Rating, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const [missedCards, setMissedCards] = useState<StudyCard[]>([]);
  const [done, setDone]             = useState(false);
  const [typedAnswer, setTypedAnswer]       = useState('');
  const [answerResult, setAnswerResult]     = useState<AnswerResult | null>(null);
  const startTime                   = useRef(Date.now());
  const localQueueRef               = useRef(localQueue);
  const inputRef                    = useRef<HTMLInputElement>(null);
  localQueueRef.current = localQueue;

  const card      = localQueue[index];
  const canUndo   = undoStack.length > 0;
  const isJpFront = card?.direction === 'jp-en';
  const progress  = Math.min(index / localQueue.length, 1);
  const useTyped  = typedMode && isJpFront;

  // Auto-focus input when card changes in typed mode
  useEffect(() => {
    if (useTyped && !revealed) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [card?.cardKey, useTyped, revealed]);

  const handleRate = useCallback((rating: Rating) => {
    if (done) return;
    const prev = onRate(card.cardKey, rating);
    const newRatings = { ...ratings, [rating]: ratings[rating] + 1 };
    setUndoStack(s => [...s, { card, prevState: prev, rating }]);
    setRatings(newRatings);
    setTypedAnswer('');
    setAnswerResult(null);

    if (rating === 'again') {
      setMissedCards(m => m.some(c => c.cardKey === card.cardKey) ? m : [...m, card]);
      setLocalQueue(q => [...q, card]);
      setRevealed(false);
      setIndex(i => i + 1);
    } else {
      const next = index + 1;
      if (next >= localQueueRef.current.length) {
        setDone(true);
        const totalRatings = Object.values(newRatings).reduce((a, b) => a + b, 0);
        onComplete(totalRatings, newRatings, Date.now() - startTime.current);
      } else {
        setRevealed(false);
        setIndex(next);
      }
    }
  }, [done, card, index, onRate, onComplete, ratings]);

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    const last = undoStack[undoStack.length - 1];
    onUndo(last.card.cardKey, last.prevState);
    setUndoStack(s => s.slice(0, -1));
    setRatings(r => ({ ...r, [last.rating]: Math.max(0, r[last.rating] - 1) }));
    if (last.rating === 'again') setLocalQueue(q => q.slice(0, -1));
    setDone(false);
    setIndex(i => Math.max(0, i - 1));
    setRevealed(false);
    setTypedAnswer('');
    setAnswerResult(null);
  }, [canUndo, undoStack, onUndo]);

  const handleTypedSubmit = useCallback(() => {
    if (revealed) return;
    const result = typedAnswer.trim()
      ? checkAnswer(typedAnswer, card.back.primary)
      : null; // empty submit = give up, no result shown
    setAnswerResult(result);
    setRevealed(true);
  }, [typedAnswer, revealed, card?.back.primary]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!revealed && !done && !useTyped) setRevealed(true);
      } else if (revealed && !done) {
        if (e.key === '1') handleRate('again');
        else if (e.key === '2') handleRate('hard');
        else if (e.key === '3') handleRate('good');
        else if (e.key === '4') handleRate('easy');
      }
      if (e.key === 'u' || (e.key === 'z' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [revealed, done, useTyped, handleRate, handleUndo]);

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (done) {
    const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0);
    const correct      = ratings.good + ratings.easy;
    const accuracy     = totalRatings > 0 ? Math.round((correct / totalRatings) * 100) : 0;
    const elapsed      = Math.round((Date.now() - startTime.current) / 1000);
    const timeStr      = elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)' }}
        >
          <CheckCircle2 size={40} style={{ color: '#4ade80' }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <p className="text-2xl font-bold text-white mb-1">Session complete</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {queue.length} card{queue.length !== 1 ? 's' : ''} · {timeStr}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xs rounded-2xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Accuracy</span>
            <span
              className="text-2xl font-bold font-mono"
              style={{ color: accuracy >= 80 ? '#4ade80' : accuracy >= 60 ? '#f59e0b' : '#ef4444' }}
            >
              {accuracy}%
            </span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden gap-px">
            {RATING_META.map(r => ratings[r.value] > 0 && (
              <motion.div
                key={r.value}
                style={{ flex: ratings[r.value], background: r.color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                className="origin-left"
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {RATING_META.map(r => (
              <div key={r.value} className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold" style={{ color: r.color }}>{ratings[r.value]}</span>
                <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{r.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Missed-card recap */}
        {missedCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.38 }}
            className="w-full max-w-xs rounded-2xl overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <div
              className="px-4 py-2.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#ef4444' }}>
                Missed
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: '#ef4444' }}>
                {missedCards.length}
              </span>
            </div>
            {missedCards.slice(0, 5).map((c, i) => {
              const jpText = c.direction === 'jp-en' ? c.front.primary : c.back.primary;
              const enText = c.direction === 'jp-en' ? c.back.primary : c.front.primary;
              const hint   = c.direction === 'jp-en' ? c.front.secondary : undefined;
              return (
                <div
                  key={c.cardKey}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                  style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="jp font-bold text-white text-base leading-tight truncate">{jpText}</span>
                    {hint && (
                      <span className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {hint}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-right leading-tight shrink-0 max-w-[140px]" style={{ color: 'var(--muted)' }}>
                    {enText}
                  </span>
                </div>
              );
            })}
            {missedCards.length > 5 && (
              <div
                className="px-4 py-2 text-center text-xs"
                style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                + {missedCards.length - 5} more
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
          className="flex gap-3"
        >
          {canUndo && (
            <button
              onClick={handleUndo}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-80"
              style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <Undo2 size={14} /> Undo last
            </button>
          )}
          <button
            onClick={onBack}
            className="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,0.25)' }}
          >
            Back to deck
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // ── Study view ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* Progress + undo */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--faint)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-mono tabular-nums shrink-0" style={{ color: 'var(--muted)' }}>
          {index + 1} / {localQueue.length}
        </span>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (U)"
          className="p-1.5 rounded-lg transition-opacity"
          style={{
            color: canUndo ? 'var(--muted)' : 'rgba(255,255,255,0.1)',
            background: 'var(--faint)',
            cursor: canUndo ? 'pointer' : 'not-allowed',
          }}
        >
          <Undo2 size={13} />
        </button>
      </div>

      {/* Direction badge */}
      <div className="flex justify-center">
        <span
          className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full"
          style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          <ArrowLeftRight size={10} />
          {isJpFront ? 'JP → EN' : 'EN → JP'}
        </span>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${card.cardKey}:${index}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={() => {
            if (revealed) return;
            if (useTyped) { handleTypedSubmit(); } // click = give up, reveal immediately
            else setRevealed(true);
          }}
          className="rounded-2xl p-8 flex flex-col items-center text-center min-h-[220px] justify-center select-none"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${revealed ? 'rgba(230,57,70,0.25)' : 'var(--border)'}`,
            cursor: revealed ? 'default' : 'pointer',
            transition: 'border-color 0.2s',
          }}
        >
          {/* Front */}
          <p className={`font-bold text-white leading-tight ${isJpFront ? 'jp text-5xl' : 'text-4xl'}`}>
            {card.front.primary}
          </p>
          {card.front.secondary && (
            <p className="jp text-base mt-2" style={{ color: 'var(--muted)' }}>{card.front.secondary}</p>
          )}
          {card.front.tag && (
            <span className="mt-2.5 text-[10px] px-2.5 py-1 rounded-full" style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              {card.front.tag}
            </span>
          )}

          {/* Back — animates in on reveal */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mt-5 w-full flex flex-col items-center gap-2"
              >
                {/* Typed answer result indicator */}
                {answerResult && (
                  <div
                    className="w-full max-w-sm px-3 py-2 rounded-xl text-xs font-medium text-center mb-1"
                    style={{ background: RESULT_META[answerResult].bg, color: RESULT_META[answerResult].color, border: `1px solid ${RESULT_META[answerResult].color}30` }}
                  >
                    {RESULT_META[answerResult].label}
                    {(answerResult === 'wrong' || answerResult === 'close') && typedAnswer.trim() && (
                      <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '0.5rem' }}>
                        · you typed: "{typedAnswer.trim()}"
                      </span>
                    )}
                  </div>
                )}

                <div className="w-10 h-px mb-1" style={{ background: 'var(--border)' }} />
                <p className={`text-2xl font-semibold text-white ${!isJpFront ? 'jp' : ''}`}>
                  {card.back.primary}
                </p>
                {card.back.secondary && (
                  <p
                    className={`text-sm ${!isJpFront ? 'jp' : 'font-mono'}`}
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {card.back.secondary}
                  </p>
                )}
                {card.back.detail && (
                  <p className="text-xs mt-1 max-w-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {card.back.detail}
                  </p>
                )}
                {card.back.example && (
                  <div
                    className="mt-3 px-4 py-3 rounded-xl text-sm w-full max-w-sm text-left"
                    style={{ background: 'var(--faint)', borderLeft: '2px solid var(--accent)' }}
                  >
                    <p className="jp text-white text-sm mb-0.5">{card.back.example.jp}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{card.back.example.en}</p>
                  </div>
                )}

                {/* Kanji breakdown */}
                {card.back.breakdown && (
                  <div className="mt-2 flex flex-wrap gap-2 justify-center">
                    {card.back.breakdown.map(b => (
                      <span
                        key={b.char}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                        style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}
                      >
                        <span className="jp font-bold text-white text-sm">{b.char}</span>
                        <span style={{ color: 'var(--muted)' }}>{b.meanings.join(', ')}</span>
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed && !useTyped && (
            <p className="hidden sm:block text-[10px] mt-6 select-none" style={{ color: 'rgba(255,255,255,0.1)' }}>
              click · space · enter
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action area */}
      <AnimatePresence mode="wait">
        {!revealed ? (
          useTyped ? (
            /* Typed answer input */
            <motion.div
              key="typed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={typedAnswer}
                onChange={e => setTypedAnswer(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleTypedSubmit(); }}
                placeholder="Type the meaning…"
                className="flex-1 px-4 py-3.5 rounded-xl text-sm text-white outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              />
              <button
                onClick={handleTypedSubmit}
                className="cursor-pointer px-5 rounded-xl text-sm font-medium transition-opacity hover:opacity-85"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,0.25)' }}
              >
                Check
              </button>
            </motion.div>
          ) : (
            /* Normal show-answer button */
            <motion.button
              key="show"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              onClick={() => setRevealed(true)}
              className="cursor-pointer w-full py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-85"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              Show answer
            </motion.button>
          )
        ) : (
          <motion.div
            key="rate"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-4 gap-2"
          >
            {RATING_META.map(r => (
              <motion.button
                key={r.value}
                onClick={() => handleRate(r.value)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="cursor-pointer flex flex-col items-center gap-1 py-3.5 rounded-xl"
                style={{
                  background: `${r.color}10`,
                  border: `1px solid ${r.color}28`,
                  color: r.color,
                }}
              >
                <span className="text-xs font-bold">{r.label}</span>
                <span className="text-[9px] font-mono opacity-50">{r.key}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <p className="hidden sm:block text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.1)' }}>
        {revealed ? '1 again · 2 hard · 3 good · 4 easy · U undo' : useTyped ? 'enter to check · click card to skip' : 'space to reveal · U to undo'}
      </p>
    </div>
  );
}
