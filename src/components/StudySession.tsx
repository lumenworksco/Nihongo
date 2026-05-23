import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Undo2, ArrowLeftRight } from 'lucide-react';
import type { StudyCard, CardState, Rating } from '../lib/srs';

interface UndoEntry { card: StudyCard; prevState: CardState | null }

interface Props {
  queue: StudyCard[];
  onRate: (cardKey: string, rating: Rating) => CardState | null;
  onUndo: (cardKey: string, prevState: CardState | null) => void;
  onComplete: (reviewed: number, ratings: Record<Rating, number>, durationMs: number) => void;
  onBack: () => void;
}

const ratingButtons: { value: Rating; label: string; color: string; key: string }[] = [
  { value: 'again', label: 'Again', color: '#ef4444', key: '1' },
  { value: 'hard',  label: 'Hard',  color: '#f97316', key: '2' },
  { value: 'good',  label: 'Good',  color: '#4ade80', key: '3' },
  { value: 'easy',  label: 'Easy',  color: '#60a5fa', key: '4' },
];

export default function StudySession({ queue, onRate, onUndo, onComplete, onBack }: Props) {
  const [index, setIndex]         = useState(0);
  const [revealed, setRevealed]   = useState(false);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [ratings, setRatings]     = useState<Record<Rating, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const [done, setDone]           = useState(false);
  const startTime                 = useRef(Date.now());

  const card     = done ? queue[queue.length - 1] : queue[index];
  const canUndo  = undoStack.length > 0;
  const isJpFront = card?.direction === 'jp-en';

  const handleRate = useCallback((rating: Rating) => {
    if (done) return;
    const prev = onRate(card.cardKey, rating);
    const newRatings = { ...ratings, [rating]: ratings[rating] + 1 };
    setUndoStack(s => [...s, { card, prevState: prev }]);
    setRatings(newRatings);
    const next = index + 1;
    if (next >= queue.length) {
      setDone(true);
      onComplete(queue.length, newRatings, Date.now() - startTime.current);
    } else {
      setRevealed(false);
      setIndex(next);
    }
  }, [done, card, index, queue.length, onRate, onComplete, ratings]);

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    const last = undoStack[undoStack.length - 1];
    onUndo(last.card.cardKey, last.prevState);
    setUndoStack(s => s.slice(0, -1));
    if (done) {
      setDone(false);
      setIndex(queue.length - 1);
    } else {
      setIndex(i => Math.max(0, i - 1));
    }
    setRevealed(false);
  }, [canUndo, undoStack, onUndo, done, queue.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!revealed && !done) setRevealed(true);
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
  }, [revealed, done, handleRate, handleUndo]);

  // Done screen
  if (done) {
    const total = queue.length;
    const correct = ratings.good + ratings.easy;
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 py-10 text-center">
        <CheckCircle size={44} style={{ color: '#4ade80' }} />
        <div>
          <p className="text-xl font-semibold text-white mb-1">Session complete</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {total} card{total !== 1 ? 's' : ''} · {Math.round((correct / total) * 100)}% correct
          </p>
        </div>
        <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
          {ratingButtons.map(r => (
            <div key={r.value} className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold" style={{ color: r.color }}>{ratings[r.value]}</span>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{r.label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          {canUndo && (
            <button onClick={handleUndo} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              <Undo2 size={14} /> Undo last
            </button>
          )}
          <button onClick={onBack} className="px-5 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,0.25)' }}>
            Done
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar + undo */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--faint)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'var(--accent)' }} animate={{ width: `${(index / queue.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className="text-xs font-mono shrink-0" style={{ color: 'var(--muted)' }}>{index + 1}/{queue.length}</span>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (U)"
          className="p-1.5 rounded-lg transition-opacity"
          style={{ color: canUndo ? 'var(--muted)' : 'rgba(255,255,255,0.1)', background: 'var(--faint)', cursor: canUndo ? 'pointer' : 'not-allowed' }}
        >
          <Undo2 size={13} />
        </button>
      </div>

      {/* Direction badge */}
      <div className="flex justify-center">
        <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full" style={{ background: 'var(--faint)', color: 'var(--muted)' }}>
          <ArrowLeftRight size={10} />
          {isJpFront ? 'JP → EN' : 'EN → JP'}
        </span>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.cardKey + String(revealed)}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.15 }}
          className="rounded-2xl p-8 flex flex-col items-center text-center min-h-[210px] justify-center"
          style={{ background: 'var(--surface)', border: `1px solid ${revealed ? 'rgba(230,57,70,0.3)' : 'var(--border)'}` }}
        >
          {/* Front */}
          <p className={`text-5xl font-bold text-white leading-tight ${isJpFront ? 'jp' : ''}`}>
            {card.front.primary}
          </p>
          {card.front.secondary && (
            <p className="jp text-base mt-1.5" style={{ color: 'var(--muted)' }}>{card.front.secondary}</p>
          )}
          {card.front.tag && (
            <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--faint)', color: 'var(--muted)' }}>
              {card.front.tag}
            </span>
          )}

          {/* Back */}
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 w-full flex flex-col items-center gap-2">
              <div className="w-12 h-px mb-1" style={{ background: 'var(--border)' }} />
              <p className={`text-2xl font-semibold text-white ${!isJpFront ? 'jp' : ''}`}>
                {card.back.primary}
              </p>
              {card.back.secondary && (
                <p className={`text-sm ${!isJpFront ? 'jp' : 'font-mono'}`} style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {card.back.secondary}
                </p>
              )}
              {card.back.detail && (
                <p className="text-xs mt-1 max-w-xs" style={{ color: 'var(--muted)' }}>{card.back.detail}</p>
              )}
              {card.back.example && (
                <div className="mt-3 px-4 py-3 rounded-xl text-sm w-full max-w-sm text-left" style={{ background: 'var(--faint)', borderLeft: '2px solid var(--accent)' }}>
                  <p className="jp text-white text-sm mb-0.5">{card.back.example.jp}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{card.back.example.en}</p>
                </div>
              )}
            </motion.div>
          )}

          {!revealed && (
            <p className="text-[10px] mt-5" style={{ color: 'rgba(255,255,255,0.12)' }}>space · enter</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action area */}
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="w-full py-3 rounded-xl text-sm font-medium" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          Show answer
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {ratingButtons.map(r => (
            <button key={r.value} onClick={() => handleRate(r.value)} className="flex flex-col items-center gap-0.5 py-3 rounded-xl" style={{ background: `${r.color}12`, border: `1px solid ${r.color}30`, color: r.color }}>
              <span className="text-xs font-semibold">{r.label}</span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{r.key}</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
        1–4 to rate · U to undo
      </p>
    </div>
  );
}
