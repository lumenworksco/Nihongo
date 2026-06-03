import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, ChevronLeft, ChevronRight, BookOpen, Grid, GraduationCap, ArrowLeftRight, ChevronDown, EyeOff, Eye } from 'lucide-react';
import { cltCards, cltCategories, type CLTCard, type CLTCategory } from '../data/clt';
import { useDeck } from '../hooks/useDeck';
import { useProgress } from '../hooks/useProgress';
import { buildCLTCards } from '../lib/studyCards';
import { getStatus, statusMeta, formatDue, formatInterval, type CardStatus, type CardState } from '../lib/srs';
import { loadSettings } from '../lib/storage';
import StudySession from '../components/StudySession';

const cltStudyCards = buildCLTCards();

const catColors: Record<CLTCategory, string> = {
  frequency: '#a78bfa',
  past:      '#60a5fa',
  shop:      '#4ade80',
  intro:     '#f472b6',
  grammar:   '#f59e0b',
};

const catLabels: Record<CLTCategory, string> = {
  frequency: '頻度',
  past:      '過去',
  shop:      '店で',
  intro:     '紹介',
  grammar:   '文法',
};

// ── Browse card ───────────────────────────────────────────────────────────────

function CLTBrowseCard({ card, state, isSuspended, onToggleSuspend }: {
  card: CLTCard;
  state: CardState | undefined;
  isSuspended: boolean;
  onToggleSuspend: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const status = getStatus(state);
  const { color } = statusMeta[status];
  const catColor = catColors[card.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-xl flex flex-col gap-2"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isSuspended ? 'rgba(255,255,255,0.04)' : 'var(--border)'}`,
        opacity: isSuspended ? 0.5 : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}80` }} />
          <p className="jp text-xl font-bold text-white leading-tight truncate">{card.jp}</p>
        </div>
        <div className="flex items-center gap-1 mt-0.5 shrink-0">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}30` }}
          >
            {catLabels[card.category]}
          </span>
          <button
            onClick={() => setShowDetails(d => !d)}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Romaji */}
      <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{card.romaji}</p>

      {/* Meaning */}
      <p className="text-sm text-white">{card.meaning}</p>

      {/* Note badge */}
      {card.note && (
        <span
          className="self-start text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          {card.note}
        </span>
      )}

      {/* Example sentence */}
      {card.example && (
        <div className="mt-1 p-2.5 rounded-lg text-xs" style={{ background: 'var(--faint)', borderLeft: '2px solid var(--accent)' }}>
          <p className="jp text-white mb-0.5">{card.example.jp}</p>
          <p style={{ color: 'var(--muted)' }}>{card.example.en}</p>
        </div>
      )}

      {/* SRS details */}
      <AnimatePresence initial={false}>
        {showDetails && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pt-2 mt-1 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span className="text-[11px]" style={{ color }}>{statusMeta[status].label}</span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>interval: {formatInterval(state)}</span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>due: {formatDue(state)}</span>
                {state && <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>ease: {state.easeFactor.toFixed(2)}</span>}
              </div>
              <button
                onClick={e => { e.stopPropagation(); onToggleSuspend(); }}
                className="self-start flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors"
                style={{
                  background: isSuspended ? 'rgba(96,165,250,0.1)' : 'rgba(255,255,255,0.04)',
                  color: isSuspended ? '#60a5fa' : 'var(--muted)',
                  border: `1px solid ${isSuspended ? 'rgba(96,165,250,0.2)' : 'var(--border)'}`,
                }}
              >
                {isSuspended ? <Eye size={11} /> : <EyeOff size={11} />}
                {isSuspended ? 'Unsuspend' : 'Suspend card'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Flip card (flashcard browse mode) ────────────────────────────────────────

function CLTFlipCard({ card, onNext, onPrev, index, total }: {
  card: CLTCard; onNext: () => void; onPrev: () => void; index: number; total: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const catColor = catColors[card.category];

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{index + 1} / {total}</p>

      <div className="w-full max-w-sm cursor-pointer" style={{ perspective: '1000px' }} onClick={() => setFlipped(f => !f)}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', height: '220px' }}
        >
          {/* Front — Japanese */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', backfaceVisibility: 'hidden' }}
          >
            <span
              className="text-[10px] px-2 py-0.5 rounded-full mb-1"
              style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}30` }}
            >
              {catLabels[card.category]}
            </span>
            <p className="jp text-4xl font-bold text-white text-center">{card.jp}</p>
            <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>{card.romaji}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>tap to reveal</p>
          </div>

          {/* Back — English */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 gap-2"
            style={{ background: 'var(--surface)', border: `1px solid ${catColor}60`, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-xl font-semibold text-white text-center">{card.meaning}</p>
            {card.note && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                {card.note}
              </span>
            )}
            {card.example && (
              <div className="mt-3 text-center">
                <p className="jp text-sm text-white">{card.example.jp}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{card.example.en}</p>
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

// ── Main page ─────────────────────────────────────────────────────────────────

type Mode = 'browse' | 'flashcard' | 'study';

export default function CLT() {
  const maxNew = useMemo(() => loadSettings().maxNewCards, []);
  const [bidirectional, setBidirectional] = useState(false);
  const { states, rate, undoCard, studyQueue, stats, suspended, toggleSuspend } =
    useDeck('clt', cltStudyCards, bidirectional, maxNew);
  const { recordSession } = useProgress();

  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState<CLTCategory | 'all'>('all');
  const [mode, setMode]                 = useState<Mode>('browse');
  const [flashIndex, setFlashIndex]     = useState(0);
  const [statusFilter, setStatusFilter] = useState<CardStatus | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cltCards.filter(c => {
      const matchCat    = category === 'all' || c.category === category;
      const matchStatus = statusFilter === 'all' || getStatus(states[`clt:${c.id}:j`]) === statusFilter;
      const matchSearch = !q
        || c.jp.includes(q)
        || c.romaji.toLowerCase().includes(q)
        || c.meaning.toLowerCase().includes(q)
        || (c.note?.toLowerCase().includes(q) ?? false);
      return matchCat && matchStatus && matchSearch;
    });
  }, [search, category, statusFilter, states]);

  const flashCard = filtered[Math.min(flashIndex, Math.max(0, filtered.length - 1))];
  const dueCount  = studyQueue.length;

  const modeButtons: { id: Mode; icon: typeof Grid; label: string; badge?: number }[] = [
    { id: 'browse',    icon: Grid,          label: 'Browse' },
    { id: 'flashcard', icon: BookOpen,      label: 'Flashcard' },
    { id: 'study',     icon: GraduationCap, label: 'Study', badge: dueCount },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-24 md:pb-10">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">CLT Japanese</h1>
          <p className="jp text-sm" style={{ color: 'var(--muted)' }}>A1.1 Plus · {cltCards.length} cards</p>
        </div>
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {modeButtons.map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5"
              style={{
                background: mode === id ? 'var(--accent-dim)' : 'transparent',
                color:      mode === id ? 'var(--accent)'     : 'var(--muted)',
              }}
            >
              <Icon size={12} />
              {label}
              {badge != null && badge > 0 && (
                <span className="min-w-[1rem] h-4 px-1 rounded-full text-[9px] flex items-center justify-center font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── STUDY MODE ── */}
      {mode === 'study' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setBidirectional(b => !b)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                background: bidirectional ? 'var(--accent-dim)' : 'var(--faint)',
                color:      bidirectional ? 'var(--accent)'     : 'var(--muted)',
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
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Come back later or browse cards.</p>
              <button onClick={() => setMode('browse')} className="mt-2 text-sm underline" style={{ color: 'var(--muted)' }}>
                Browse cards
              </button>
            </div>
          ) : (
            <StudySession
              queue={studyQueue}
              onRate={rate}
              onUndo={undoCard}
              onComplete={(reviewed, ratings, durationMs) =>
                recordSession('clt', reviewed, ratings, durationMs)
              }
              onBack={() => setMode('browse')}
            />
          )}
        </>
      )}

      {/* ── BROWSE / FLASHCARD MODES ── */}
      {mode !== 'study' && (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder="Search Japanese, romaji, meaning…"
              value={search}
              onChange={e => { setSearch(e.target.value); setFlashIndex(0); }}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-white outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            {cltCategories.map(cat => {
              const isActive = category === cat.id;
              const col = cat.id !== 'all' ? catColors[cat.id as CLTCategory] : undefined;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.id as CLTCategory | 'all'); setFlashIndex(0); }}
                  className="px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1.5"
                  style={{
                    background: isActive ? (col ? `${col}18` : 'rgba(255,255,255,0.08)') : 'var(--faint)',
                    color:      isActive ? (col ?? 'white')                               : 'var(--muted)',
                    border: `1px solid ${isActive ? (col ? `${col}35` : 'rgba(255,255,255,0.2)') : 'var(--border)'}`,
                  }}
                >
                  {cat.exam && <span>⭐</span>}
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Status filters */}
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
                    color:      statusFilter === s ? (meta?.color ?? 'white')                               : 'var(--muted)',
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

          {/* Content */}
          {filtered.length === 0 ? (
            <p className="text-center py-12" style={{ color: 'var(--muted)' }}>No cards found.</p>
          ) : mode === 'flashcard' ? (
            flashCard && (
              <CLTFlipCard
                key={flashCard.id}
                card={flashCard}
                index={Math.min(flashIndex, filtered.length - 1)}
                total={filtered.length}
                onNext={() => setFlashIndex(i => (i + 1) % filtered.length)}
                onPrev={() => setFlashIndex(i => (i - 1 + filtered.length) % filtered.length)}
              />
            )
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map(card => (
                  <CLTBrowseCard
                    key={card.id}
                    card={card}
                    state={states[`clt:${card.id}:j`]}
                    isSuspended={suspended.has(`clt:${card.id}:j`)}
                    onToggleSuspend={() => {
                      toggleSuspend(`clt:${card.id}:j`);
                      toggleSuspend(`clt:${card.id}:e`);
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
