import { motion } from 'framer-motion';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import type { Word } from '../data/vocabulary';
import { typeColors, typeLabels } from '../data/vocabulary';
import type { CardState } from '../lib/srs';
import { getStatus, statusMeta } from '../lib/srs';

interface WordPopupProps {
  word: Word;
  state: CardState | undefined;
  isPinned: boolean;
  onPin: () => void;
  onUnpin: () => void;
  onClose: () => void;
}

export default function WordPopup({ word, state, isPinned, onPin, onUnpin, onClose }: WordPopupProps) {
  const status = getStatus(state);
  const { color: statusColor, label: statusLabel } = statusMeta[status];
  const typeColor = typeColors[word.type];
  const typeLabel = typeLabels[word.type];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-2xl mx-auto px-6 pt-3 pb-10">
          {/* Handle */}
          <div className="flex justify-center mb-5">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>

          {/* Word + badges */}
          <div className="flex items-start justify-between mb-2">
            <span className="jp text-5xl font-bold text-white leading-tight">{word.kanji}</span>
            <div className="flex items-center gap-2 mt-2 flex-wrap justify-end">
              <span
                className="text-[10px] px-2 py-1 rounded-full font-mono"
                style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30` }}
              >
                {typeLabel}
              </span>
              <span
                className="text-[10px] px-2 py-1 rounded-full font-mono"
                style={{ background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30` }}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Kana + romaji */}
          <p className="jp text-xl mb-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{word.kana}</p>
          <p className="text-sm font-mono mb-4" style={{ color: 'var(--muted)' }}>{word.romaji}</p>

          {/* Meaning */}
          <p className="text-lg text-white mb-5">{word.meaning}</p>

          {/* Example sentence */}
          {word.example && (
            <div
              className="mb-6 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'var(--faint)', borderLeft: '2px solid rgba(255,255,255,0.08)' }}
            >
              <p className="jp text-white mb-1">{word.example.jp}</p>
              <p style={{ color: 'var(--muted)' }}>{word.example.en}</p>
            </div>
          )}

          {/* Pin button */}
          <button
            onClick={isPinned ? onUnpin : onPin}
            className="w-full py-3.5 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={{
              background: isPinned ? 'rgba(16,185,129,0.12)' : 'rgba(230,57,70,0.12)',
              color: isPinned ? '#10b981' : 'var(--accent)',
              border: `1px solid ${isPinned ? 'rgba(16,185,129,0.3)' : 'rgba(230,57,70,0.3)'}`,
            }}
          >
            {isPinned ? <BookmarkCheck size={15} /> : <BookmarkPlus size={15} />}
            {isPinned ? 'Saved for vocabulary study' : 'Save for vocabulary study'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
