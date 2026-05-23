import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, ChevronLeft, ChevronRight, BookOpen, Grid, GraduationCap, ArrowLeftRight } from 'lucide-react';
import { vocabulary, categories, type Word } from '../data/vocabulary';
import { useDeck } from '../hooks/useDeck';
import { useProgress } from '../hooks/useProgress';
import { buildVocabCards } from '../lib/studyCards';
import { getStatus, statusMeta, type CardStatus } from '../lib/srs';
import StudySession from '../components/StudySession';

const vocabCards = buildVocabCards();

const typeColors: Record<Word['type'], string> = {
  noun: '#60a5fa', verb: '#4ade80',
  'adjective-i': '#f59e0b', 'adjective-na': '#f59e0b',
  adverb: '#a78bfa', expression: '#f472b6',
};
const typeLabels: Record<Word['type'], string> = {
  noun: 'n', verb: 'v', 'adjective-i': 'い-adj',
  'adjective-na': 'な-adj', adverb: 'adv', expression: 'expr',
};

function StatusDot({ status }: { status: CardStatus }) {
  const { color } = statusMeta[status];
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ background: color, boxShadow: `0 0 4px ${color}80` }}
    />
  );
}

function WordCard({ word, status }: { word: Word; status: CardStatus }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-xl flex flex-col gap-2"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusDot status={status} />
          <p className="jp text-2xl font-bold text-white leading-tight">{word.kanji}</p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full shrink-0 mt-1"
          style={{
            background: `${typeColors[word.type]}18`,
            color: typeColors[word.type],
            border: `1px solid ${typeColors[word.type]}30`,
          }}
        >
          {typeLabels[word.type]}
        </span>
      </div>
      <div>
        <p className="jp text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{word.kana}</p>
        <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{word.romaji}</p>
      </div>
      <p className="text-sm text-white">{word.meaning}</p>
      {word.example && (
        <div
          className="mt-1 p-2.5 rounded-lg text-xs"
          style={{ background: 'var(--faint)', borderLeft: '2px solid var(--accent)' }}
        >
          <p className="jp text-white mb-0.5">{word.example.jp}</p>
          <p style={{ color: 'var(--muted)' }}>{word.example.en}</p>
        </div>
      )}
    </motion.div>
  );
}

function FlashCard({ word, onNext, onPrev, index, total }: {
  word: Word; onNext: () => void; onPrev: () => void; index: number; total: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{index + 1} / {total}</p>

      <div className="w-full max-w-sm cursor-pointer" style={{ perspective: '1000px' }} onClick={() => setFlipped(f => !f)}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', height: '220px' }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', backfaceVisibility: 'hidden' }}
          >
            <p className="jp text-5xl font-bold text-white">{word.kanji}</p>
            <p className="jp text-lg" style={{ color: 'var(--muted)' }}>{word.kana}</p>
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>tap to reveal</p>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 gap-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--accent)', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-xl font-semibold text-white text-center">{word.meaning}</p>
            <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>{word.romaji}</p>
            {word.example && (
              <div className="mt-3 text-center">
                <p className="jp text-sm text-white">{word.example.jp}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{word.example.en}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => { setFlipped(false); onPrev(); }} className="p-2.5 rounded-xl transition-colors hover:text-white" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setFlipped(f => !f)} className="px-4 py-2 rounded-xl text-sm transition-colors hover:opacity-80" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,0.2)' }}>
          <RotateCcw size={14} className="inline mr-1.5" />Flip
        </button>
        <button onClick={() => { setFlipped(false); onNext(); }} className="p-2.5 rounded-xl transition-colors hover:text-white" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

type Mode = 'browse' | 'flashcard' | 'study';

export default function Vocabulary() {
  const [bidirectional, setBidirectional] = useState(false);
  const { states, rate, undoCard, studyQueue, stats } = useDeck('vocabulary', vocabCards, bidirectional);
  const { recordSession } = useProgress();

  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('all');
  const [mode, setMode]               = useState<Mode>('browse');
  const [flashIndex, setFlashIndex]   = useState(0);
  const [statusFilter, setStatusFilter] = useState<CardStatus | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vocabulary.filter(w => {
      const matchCat    = category === 'all' || w.category === category;
      const matchStatus = statusFilter === 'all' || getStatus(states[`v:${w.id}:j`]) === statusFilter;
      const matchSearch = !q || w.kanji.includes(q) || w.kana.includes(q) || w.romaji.includes(q) || w.meaning.toLowerCase().includes(q);
      return matchCat && matchStatus && matchSearch;
    });
  }, [search, category, statusFilter, states]);

  const flashWord = filtered[Math.min(flashIndex, filtered.length - 1)];
  const dueCount  = studyQueue.length;

  const modeButtons: { id: Mode; icon: typeof Grid; label: string; badge?: number }[] = [
    { id: 'browse',    icon: Grid,          label: 'Browse' },
    { id: 'flashcard', icon: BookOpen,      label: 'Flashcard' },
    { id: 'study',     icon: GraduationCap, label: 'Study', badge: dueCount },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Vocabulary</h1>
          <p className="jp text-sm" style={{ color: 'var(--muted)' }}>語彙 · {vocabulary.length} words</p>
        </div>
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {modeButtons.map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5 relative"
              style={{
                background: mode === id ? 'var(--accent-dim)' : 'transparent',
                color: mode === id ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              <Icon size={12} />
              {label}
              {badge != null && badge > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Study mode */}
      {mode === 'study' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setBidirectional(b => !b)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                background: bidirectional ? 'var(--accent-dim)' : 'var(--faint)',
                color: bidirectional ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${bidirectional ? 'rgba(230,57,70,0.25)' : 'var(--border)'}`,
              }}
            >
              <ArrowLeftRight size={11} />
              Bidirectional
            </button>
          </div>

          {dueCount === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-4xl">🎉</p>
              <p className="text-lg font-semibold text-white">Nothing due right now</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Come back later or browse new words.</p>
              <button onClick={() => setMode('browse')} className="mt-2 text-sm underline" style={{ color: 'var(--muted)' }}>
                Browse vocabulary
              </button>
            </div>
          ) : (
            <StudySession
              queue={studyQueue}
              onRate={rate}
              onUndo={undoCard}
              onComplete={(reviewed, ratings, durationMs) =>
                recordSession('vocabulary', reviewed, ratings, durationMs)
              }
              onBack={() => setMode('browse')}
            />
          )}
        </>
      )}

      {/* Browse / Flashcard modes */}
      {mode !== 'study' && (
        <>
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder="Search kanji, kana, romaji, meaning…"
              value={search}
              onChange={e => { setSearch(e.target.value); setFlashIndex(0); }}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-white outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); setFlashIndex(0); }}
                className="px-3 py-1 rounded-full text-xs transition-colors"
                style={{
                  background: category === cat.id ? 'var(--accent-dim)' : 'var(--faint)',
                  color: category === cat.id ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${category === cat.id ? 'rgba(230,57,70,0.25)' : 'var(--border)'}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'new', 'learning', 'review', 'known'] as const).map(s => {
              const meta = s === 'all' ? null : statusMeta[s];
              return (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setFlashIndex(0); }}
                  className="px-3 py-1 rounded-full text-xs flex items-center gap-1.5 transition-colors"
                  style={{
                    background: statusFilter === s ? (meta ? `${meta.color}18` : 'rgba(255,255,255,0.08)') : 'var(--faint)',
                    color: statusFilter === s ? (meta?.color ?? 'white') : 'var(--muted)',
                    border: `1px solid ${statusFilter === s ? (meta ? `${meta.color}35` : 'rgba(255,255,255,0.15)') : 'var(--border)'}`,
                  }}
                >
                  {meta && <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />}
                  {s === 'all' ? 'All' : meta!.label}
                  {s !== 'all' && (
                    <span className="font-mono" style={{ color: 'var(--muted)' }}>{stats[s]}</span>
                  )}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-12" style={{ color: 'var(--muted)' }}>No words found.</p>
          ) : mode === 'flashcard' ? (
            <FlashCard
              word={flashWord}
              index={Math.min(flashIndex, filtered.length - 1)}
              total={filtered.length}
              onNext={() => setFlashIndex(i => (i + 1) % filtered.length)}
              onPrev={() => setFlashIndex(i => (i - 1 + filtered.length) % filtered.length)}
            />
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map(word => (
                  <WordCard key={word.id} word={word} status={getStatus(states[`v:${word.id}:j`])} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
