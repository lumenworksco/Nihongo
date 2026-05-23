import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { Word } from '../data/vocabulary';
import type { Rating } from '../lib/srs';

const ratings: { value: Rating; label: string; hint: string; color: string }[] = [
  { value: 'again', label: 'Again',  hint: 'Forgot',         color: '#ef4444' },
  { value: 'hard',  label: 'Hard',   hint: 'Difficult',      color: '#f97316' },
  { value: 'good',  label: 'Good',   hint: 'Remembered',     color: '#4ade80' },
  { value: 'easy',  label: 'Easy',   hint: 'Too easy',       color: '#60a5fa' },
];

interface Props {
  queue: Word[];
  onRate: (wordId: number, rating: Rating) => void;
  onDone: () => void;
}

export default function StudySession({ queue, onRate, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const word = queue[index];
  const progress = index / queue.length;

  function handleRate(rating: Rating) {
    onRate(word.id, rating);
    const next = index + 1;
    if (next >= queue.length) {
      setDone(true);
    } else {
      setRevealed(false);
      setIndex(next);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 py-12 text-center"
      >
        <CheckCircle size={48} style={{ color: '#4ade80' }} />
        <div>
          <p className="text-xl font-semibold text-white mb-1">Session complete</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Reviewed {queue.length} card{queue.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onDone}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,0.25)' }}
        >
          Back to vocabulary
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--faint)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs font-mono shrink-0" style={{ color: 'var(--muted)' }}>
          {index + 1} / {queue.length}
        </span>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={word.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl p-8 flex flex-col items-center text-center gap-3 min-h-[200px] justify-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="jp text-5xl font-bold text-white">{word.kanji}</p>
          <p className="jp text-lg" style={{ color: 'var(--muted)' }}>{word.kana}</p>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex flex-col items-center gap-2 w-full"
              >
                <div className="w-16 h-px mb-2" style={{ background: 'var(--border)' }} />
                <p className="text-xl font-semibold text-white">{word.meaning}</p>
                <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>{word.romaji}</p>
                {word.example && (
                  <div
                    className="mt-3 px-4 py-3 rounded-xl text-sm w-full max-w-sm"
                    style={{ background: 'var(--faint)', borderLeft: '2px solid var(--accent)' }}
                  >
                    <p className="jp text-white mb-0.5">{word.example.jp}</p>
                    <p style={{ color: 'var(--muted)' }}>{word.example.en}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Action area */}
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          Show answer
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {ratings.map(r => (
            <button
              key={r.value}
              onClick={() => handleRate(r.value)}
              className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
              style={{
                background: `${r.color}12`,
                border: `1px solid ${r.color}30`,
                color: r.color,
              }}
            >
              <span className="font-semibold">{r.label}</span>
              <span style={{ color: 'var(--muted)', fontSize: '10px' }}>{r.hint}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
