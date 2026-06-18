import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ArrowLeftRight, Keyboard } from 'lucide-react';
import { kanjiEntries, kanjiGroups, GROUP_ORDER, type KanjiEntry } from '../data/kanji';
import { useDeck } from '../hooks/useDeck';
import { useProgress } from '../hooks/useProgress';
import { buildKanjiCards } from '../lib/studyCards';
import { getStatus, statusMeta, formatInterval, type StudyCard } from '../lib/srs';
import { loadSettings } from '../lib/storage';
import StudySession from '../components/StudySession';

const kanjiCards = buildKanjiCards();

const ACCENT = '#f59e0b'; // amber for kanji

function KanjiCard({ entry, stateJ, stateE }: {
  entry: KanjiEntry;
  stateJ: ReturnType<typeof getStatus>;
  stateE: ReturnType<typeof getStatus>;
}) {
  const [open, setOpen] = useState(false);
  const jColor = statusMeta[stateJ].color;
  const eColor = statusMeta[stateE].color;

  return (
    <motion.div
      layout
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div
          className="jp w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-3xl font-bold"
          style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}30`, color: ACCENT }}
        >
          {entry.kanji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-white">{entry.meanings.join(', ')}</span>
            <div className="flex gap-1 ml-auto">
              <span className="w-2 h-2 rounded-full" title={`Recognition: ${statusMeta[stateJ].label}`} style={{ background: jColor }} />
              <span className="w-2 h-2 rounded-full" title={`Production: ${statusMeta[stateE].label}`} style={{ background: eColor }} />
            </div>
          </div>
          <div className="flex gap-3 mt-1">
            {entry.onyomi.length > 0 && (
              <span className="jp text-sm font-mono" style={{ color: ACCENT }}>
                {entry.onyomi.join('・')}
              </span>
            )}
            {entry.kunyomi.length > 0 && (
              <span className="jp text-sm" style={{ color: 'var(--muted)' }}>
                {entry.kunyomi.join('・')}
              </span>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: ACCENT }}>On&apos;yomi</p>
                  <p className="jp text-lg font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {entry.onyomi.length > 0 ? entry.onyomi.join('・') : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Kun&apos;yomi</p>
                  <p className="jp text-lg font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {entry.kunyomi.length > 0 ? entry.kunyomi.join('・') : '—'}
                  </p>
                </div>
              </div>
              {entry.radicals && entry.radicals.length > 0 && (
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Components</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.radicals.map(r => (
                      <span
                        key={r.char}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                        style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}25` }}
                      >
                        <span className="jp font-bold text-sm" style={{ color: ACCENT }}>{r.char}</span>
                        <span style={{ color: 'var(--muted)' }}>{r.meaning}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                  <span>recognition: {formatInterval(undefined)}</span>
                  <span>production: {formatInterval(undefined)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type Mode = 'browse' | 'study';

export default function Kanji() {
  const maxNew = useMemo(() => loadSettings().maxNewCards, []);
  const [mode, setMode]               = useState<Mode>('browse');
  const [bidirectional, setBidirectional] = useState(false);
  const [typedMode, setTypedMode]     = useState(false);
  const [frozenQueue, setFrozenQueue] = useState<StudyCard[]>([]);
  const [groupFilter, setGroupFilter] = useState<KanjiEntry['group'] | 'all'>('all');

  const { states, rate, undoCard, studyQueue, stats } =
    useDeck('kanji', kanjiCards, bidirectional, maxNew);
  const { recordSession } = useProgress();

  const dueCount = studyQueue.length;

  const handleStudyToggle = () => {
    if (mode === 'study') {
      setFrozenQueue([]);
      setMode('browse');
    } else {
      setFrozenQueue([...studyQueue]);
      setMode('study');
    }
  };

  const filteredEntries = useMemo(
    () => groupFilter === 'all' ? kanjiEntries : kanjiEntries.filter(k => k.group === groupFilter),
    [groupFilter],
  );

  const groupsToShow = useMemo(() => {
    const seen = new Set<KanjiEntry['group']>();
    filteredEntries.forEach(k => seen.add(k.group));
    return GROUP_ORDER.filter(g => seen.has(g));
  }, [filteredEntries]);

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-28 md:pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Kanji</h1>
          <p className="jp text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            漢字 · {kanjiEntries.length} N5 kanji
          </p>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'study' && (
            <>
              <button
                onClick={() => setTypedMode(t => !t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{
                  background: typedMode ? `${ACCENT}20` : 'var(--faint)',
                  color: typedMode ? ACCENT : 'var(--muted)',
                  border: `1px solid ${typedMode ? `${ACCENT}40` : 'var(--border)'}`,
                }}
              >
                <Keyboard size={11} />
                Type
              </button>
              <button
                onClick={() => setBidirectional(b => !b)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{
                  background: bidirectional ? `${ACCENT}20` : 'var(--faint)',
                  color: bidirectional ? ACCENT : 'var(--muted)',
                  border: `1px solid ${bidirectional ? `${ACCENT}40` : 'var(--border)'}`,
                }}
              >
                <ArrowLeftRight size={11} />
                Recall
              </button>
            </>
          )}
          <button
            onClick={handleStudyToggle}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{
              background: mode === 'study' ? `${ACCENT}20` : 'var(--faint)',
              color: mode === 'study' ? ACCENT : 'var(--muted)',
              border: `1px solid ${mode === 'study' ? `${ACCENT}40` : 'var(--border)'}`,
            }}
          >
            <GraduationCap size={12} />
            Study
            {dueCount > 0 && mode !== 'study' && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold" style={{ background: ACCENT, color: '#000' }}>
                {dueCount > 99 ? '99+' : dueCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['new', 'learning', 'review', 'scheduled', 'known'] as const).map(s => (
          <div key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusMeta[s].color }} />
            <span style={{ color: 'var(--muted)' }}>{statusMeta[s].label}</span>
            <span className="font-mono font-bold" style={{ color: statusMeta[s].color }}>{stats[s]}</span>
          </div>
        ))}
      </div>

      {mode === 'study' ? (
        frozenQueue.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-4xl">🎉</p>
            <p className="text-lg font-semibold text-white">Nothing due right now</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Come back later or browse the kanji below.</p>
            <button onClick={() => { setFrozenQueue([]); setMode('browse'); }} className="mt-2 text-sm underline" style={{ color: 'var(--muted)' }}>
              Browse kanji
            </button>
          </div>
        ) : (
          <StudySession
            queue={frozenQueue}
            onRate={rate}
            onUndo={undoCard}
            onComplete={(reviewed, ratings, durationMs) =>
              recordSession('kanji', reviewed, ratings, durationMs)
            }
            onBack={() => { setFrozenQueue([]); setMode('browse'); }}
            typedMode={typedMode}
          />
        )
      ) : (
        <>
          {/* Quick kanji grid */}
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 mb-8">
            {kanjiEntries.map(k => {
              const s = getStatus(states[`kanji:${k.id}:j`]);
              return (
                <button
                  key={k.id}
                  title={k.meanings.join(', ')}
                  onClick={() => {
                    const el = document.getElementById(`kanji-${k.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="jp aspect-square rounded-lg text-xl font-bold transition-opacity hover:opacity-80 relative"
                  style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}25`, color: ACCENT }}
                >
                  {k.kanji}
                  <span
                    className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: statusMeta[s].color }}
                  />
                </button>
              );
            })}
          </div>

          {/* Group filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', ...GROUP_ORDER] as const).map(g => (
              <button
                key={g}
                onClick={() => setGroupFilter(g)}
                className="px-3 py-1 rounded-full text-xs transition-colors"
                style={{
                  background: groupFilter === g ? `${ACCENT}20` : 'var(--faint)',
                  color: groupFilter === g ? ACCENT : 'var(--muted)',
                  border: `1px solid ${groupFilter === g ? `${ACCENT}40` : 'var(--border)'}`,
                }}
              >
                {g === 'all' ? 'All' : kanjiGroups[g].split(' · ')[0]}
              </button>
            ))}
          </div>

          {/* Kanji list by group */}
          <div className="flex flex-col gap-6">
            {groupsToShow.map(group => {
              const entries = filteredEntries.filter(k => k.group === group);
              return (
                <div key={group}>
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                    {kanjiGroups[group]}
                  </p>
                  <div className="flex flex-col gap-2">
                    {entries.map(k => (
                      <div key={k.id} id={`kanji-${k.id}`}>
                        <KanjiCard
                          entry={k}
                          stateJ={getStatus(states[`kanji:${k.id}:j`])}
                          stateE={getStatus(states[`kanji:${k.id}:e`])}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
