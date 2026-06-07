import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ArrowLeftRight, Keyboard, BookOpen } from 'lucide-react';
import { kanaEntries, rowLabels, type KanaSection, type KanaRow } from '../data/kana';
import { useDeck } from '../hooks/useDeck';
import { useProgress } from '../hooks/useProgress';
import { buildKanaCards } from '../lib/studyCards';
import { getStatus, statusMeta, type StudyCard } from '../lib/srs';
import { loadSettings } from '../lib/storage';
import StudySession from '../components/StudySession';

const kanaCards = buildKanaCards();

type Mode = 'browse' | 'drill' | 'study';
type DrillScript = 'hiragana' | 'katakana' | 'both';

const sectionLabels: Record<KanaSection, string> = {
  basic:       'Basic · 清音',
  voiced:      'Voiced · 濁音',
  combination: 'Combinations · 拗音',
};

const ROW_ORDER: KanaRow[] = [
  'vowel', 'k', 's', 't', 'n_row', 'h', 'm', 'y', 'r', 'w', 'n_solo',
  'g', 'z', 'd', 'b', 'p',
  'combo_ky', 'combo_sh', 'combo_ch', 'combo_ny', 'combo_hy',
  'combo_my', 'combo_ry', 'combo_gy', 'combo_j', 'combo_by', 'combo_py',
];

const BASIC_ROWS: KanaRow[] = ['vowel', 'k', 's', 't', 'n_row', 'h', 'm', 'y', 'r', 'w', 'n_solo'];
const VOICED_ROWS: KanaRow[] = ['g', 'z', 'd', 'b', 'p'];
const COMBO_ROWS: KanaRow[] = [
  'combo_ky', 'combo_sh', 'combo_ch', 'combo_ny', 'combo_hy',
  'combo_my', 'combo_ry', 'combo_gy', 'combo_j', 'combo_by', 'combo_py',
];

// Accepted alternate romaji spellings (primary → alternates)
const ROMAJI_ALTS: Record<string, string[]> = {
  shi: ['si'], chi: ['ti'], tsu: ['tu'], fu: ['hu'],
  wo:  ['o'],
  sha: ['sya'], shu: ['syu'], sho: ['syo'],
  cha: ['tya', 'cya'], chu: ['tyu', 'cyu'], cho: ['tyo', 'cyo'],
  ji:  ['zi', 'dji'],  ja: ['jya'],  ju: ['jyu'],  jo: ['jyo'],
  di:  ['dzi'],        du: ['dzu'],
};

function checkRomaji(input: string, correct: string): boolean {
  const n = input.trim().toLowerCase();
  if (n === correct) return true;
  return (ROMAJI_ALTS[correct] ?? []).includes(n);
}

// ── Kana Drill ────────────────────────────────────────────────────────────────

interface DrillItem { entry: typeof kanaEntries[0]; script: 'h' | 'k' }

function KanaDrill({
  entries,
  drillScript,
  onBack,
}: {
  entries: typeof kanaEntries;
  drillScript: DrillScript;
  onBack: () => void;
}) {
  const queue = useMemo<DrillItem[]>(() => {
    const items: DrillItem[] = [];
    for (const e of entries) {
      if (drillScript === 'hiragana' || drillScript === 'both') items.push({ entry: e, script: 'h' });
      if (drillScript === 'katakana' || drillScript === 'both') items.push({ entry: e, script: 'k' });
    }
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, [entries, drillScript]);

  const [idx, setIdx]     = useState(0);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'input' | 'correct' | 'wrong'>('input');
  const [stats, setStats] = useState({ right: 0, wrong: 0 });
  const inputRef          = useRef<HTMLInputElement>(null);

  const current = idx < queue.length ? queue[idx] : null;
  const isDone  = idx >= queue.length;

  useEffect(() => {
    if (!isDone && phase === 'input') {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [idx, phase, isDone]);

  const submit = useCallback(() => {
    if (!current || phase !== 'input') return;
    const correct = current.entry.romaji;
    if (checkRomaji(input, correct)) {
      setStats(s => ({ ...s, right: s.right + 1 }));
      setPhase('correct');
      setTimeout(() => { setInput(''); setIdx(i => i + 1); setPhase('input'); }, 600);
    } else {
      setStats(s => ({ ...s, wrong: s.wrong + 1 }));
      setPhase('wrong');
    }
  }, [current, input, phase]);

  const advance = useCallback(() => {
    setInput('');
    setIdx(i => i + 1);
    setPhase('input');
  }, []);

  if (isDone) {
    const total = stats.right + stats.wrong;
    const pct   = total > 0 ? Math.round((stats.right / total) * 100) : 0;
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="text-6xl">{pct >= 80 ? '🎉' : pct >= 60 ? '💪' : '📖'}</div>
        <div>
          <p className="text-2xl font-bold text-white">{pct}%</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {stats.right} correct · {stats.wrong} wrong · {queue.length} total
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-sm"
            style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            Back
          </button>
          <button
            onClick={() => { setIdx(0); setStats({ right: 0, wrong: 0 }); setPhase('input'); setInput(''); }}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}
          >
            Drill again
          </button>
        </div>
      </div>
    );
  }

  const char   = current!.script === 'h' ? current!.entry.hiragana : current!.entry.katakana;
  const correct = current!.entry.romaji;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
          <span>{idx + 1} / {queue.length}</span>
          <span>{stats.right} ✓  {stats.wrong} ✗</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: 'var(--faint)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#a78bfa' }}
            animate={{ width: `${(idx / queue.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx + phase}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18 }}
          className="rounded-2xl p-10 flex flex-col items-center gap-2"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${phase === 'correct' ? 'rgba(74,222,128,0.4)' : phase === 'wrong' ? 'rgba(248,113,113,0.4)' : 'var(--border)'}`,
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
            {current!.script === 'h' ? 'Hiragana' : 'Katakana'} → Romaji
          </p>
          <p
            className="jp font-bold leading-none"
            style={{
              fontSize: '5rem',
              color: phase === 'correct' ? '#4ade80' : phase === 'wrong' ? '#f87171' : 'white',
            }}
          >
            {char}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Input area */}
      {phase === 'wrong' ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-mono line-through" style={{ color: '#f87171' }}>{input}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Correct: <span className="font-mono font-bold text-white">{correct}</span>
            </p>
          </div>
          <button
            onClick={advance}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}
          >
            Next →
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            placeholder="Type romaji…"
            disabled={phase === 'correct'}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-mono outline-none transition-colors"
            style={{
              background: phase === 'correct' ? 'rgba(74,222,128,0.08)' : 'var(--surface)',
              border: `1px solid ${phase === 'correct' ? 'rgba(74,222,128,0.4)' : 'var(--border)'}`,
              color: phase === 'correct' ? '#4ade80' : 'white',
            }}
          />
          {phase === 'input' && (
            <button
              onClick={submit}
              className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}
            >
              Check
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Kana page ─────────────────────────────────────────────────────────────

export default function Kana() {
  const maxNew = useMemo(() => loadSettings().maxNewCards, []);
  const [mode, setMode]                   = useState<Mode>('browse');
  const [bidirectional, setBidirectional] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<KanaSection | 'all'>('all');
  const [frozenQueue, setFrozenQueue]     = useState<StudyCard[]>([]);

  // Drill state
  const [drillScript, setDrillScript]     = useState<DrillScript>('hiragana');
  const [selectedRows, setSelectedRows]   = useState<Set<KanaRow>>(new Set(ROW_ORDER));
  const [drillStarted, setDrillStarted]   = useState(false);

  const { states, rate, undoCard, studyQueue, stats } =
    useDeck('kana', kanaCards, bidirectional, maxNew);
  const { recordSession } = useProgress();

  const dueCount = studyQueue.length;

  const handleModeChange = (next: Mode) => {
    if (mode === 'study') { setFrozenQueue([]); }
    if (mode === 'drill') { setDrillStarted(false); }
    if (next === 'study') { setFrozenQueue([...studyQueue]); }
    setMode(next);
  };

  const filteredEntries = useMemo(
    () => sectionFilter === 'all' ? kanaEntries : kanaEntries.filter(k => k.section === sectionFilter),
    [sectionFilter],
  );

  const rowsToShow = useMemo(() => {
    const seen = new Set<KanaRow>();
    filteredEntries.forEach(k => seen.add(k.row));
    return ROW_ORDER.filter(r => seen.has(r));
  }, [filteredEntries]);

  const drillEntries = useMemo(
    () => kanaEntries.filter(k => selectedRows.has(k.row)),
    [selectedRows],
  );

  const toggleRow = (row: KanaRow) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(row)) { next.delete(row); } else { next.add(row); }
      return next;
    });
  };

  const toggleSection = (rows: KanaRow[]) => {
    const allIn = rows.every(r => selectedRows.has(r));
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (allIn) { rows.forEach(r => next.delete(r)); } else { rows.forEach(r => next.add(r)); }
      return next;
    });
  };

  const totalCards = kanaCards.length / 2;

  const modeButtons = [
    { id: 'browse' as Mode, label: 'Browse', icon: BookOpen },
    { id: 'drill'  as Mode, label: 'Type Drill', icon: Keyboard },
    { id: 'study'  as Mode, label: 'SRS Study', icon: GraduationCap },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Kana</h1>
          <p className="jp text-sm mt-0.5" style={{ color: 'var(--muted)' }}>かな · {totalCards} characters</p>
        </div>
        {mode === 'study' && (
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
            + Katakana
          </button>
        )}
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1.5 mb-6">
        {modeButtons.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleModeChange(id)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors flex-1 justify-center"
            style={{
              background: mode === id ? 'rgba(167,139,250,0.15)' : 'var(--faint)',
              color: mode === id ? '#a78bfa' : 'var(--muted)',
              border: `1px solid ${mode === id ? 'rgba(167,139,250,0.3)' : 'var(--border)'}`,
            }}
          >
            <Icon size={12} />
            {label}
            {id === 'study' && dueCount > 0 && mode !== 'study' && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold" style={{ background: '#a78bfa', color: '#fff' }}>
                {dueCount > 99 ? '99+' : dueCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats row */}
      {mode !== 'drill' && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['new', 'learning', 'review', 'scheduled', 'known'] as const).map(s => (
            <div key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusMeta[s].color }} />
              <span style={{ color: 'var(--muted)' }}>{statusMeta[s].label}</span>
              <span className="font-mono font-bold" style={{ color: statusMeta[s].color }}>{stats[s]}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── STUDY mode ──────────────────────────────────────────────────────── */}
      {mode === 'study' && (
        frozenQueue.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-4xl">🎉</p>
            <p className="text-lg font-semibold text-white">Nothing due right now</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Come back later or browse the chart below.</p>
            <button onClick={() => handleModeChange('browse')} className="mt-2 text-sm underline" style={{ color: 'var(--muted)' }}>
              Browse kana
            </button>
          </div>
        ) : (
          <StudySession
            queue={frozenQueue}
            onRate={rate}
            onUndo={undoCard}
            onComplete={(reviewed, ratings, durationMs) =>
              recordSession('kana', reviewed, ratings, durationMs)
            }
            onBack={() => handleModeChange('browse')}
          />
        )
      )}

      {/* ── DRILL mode ──────────────────────────────────────────────────────── */}
      {mode === 'drill' && (
        drillStarted ? (
          <KanaDrill
            entries={drillEntries}
            drillScript={drillScript}
            onBack={() => setDrillStarted(false)}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Script selector */}
            <div>
              <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Script</p>
              <div className="flex gap-2">
                {(['hiragana', 'katakana', 'both'] as DrillScript[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setDrillScript(s)}
                    className="px-4 py-2 rounded-lg text-xs font-medium capitalize transition-colors"
                    style={{
                      background: drillScript === s ? 'rgba(167,139,250,0.15)' : 'var(--faint)',
                      color: drillScript === s ? '#a78bfa' : 'var(--muted)',
                      border: `1px solid ${drillScript === s ? 'rgba(167,139,250,0.3)' : 'var(--border)'}`,
                    }}
                  >
                    {s === 'hiragana' ? 'Hiragana · かな' : s === 'katakana' ? 'Katakana · カナ' : 'Both'}
                  </button>
                ))}
              </div>
            </div>

            {/* Row selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Rows to drill</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRows(new Set(ROW_ORDER))}
                    className="text-[10px] px-2 py-1 rounded-md"
                    style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                  >
                    Select all
                  </button>
                  <button
                    onClick={() => setSelectedRows(new Set())}
                    className="text-[10px] px-2 py-1 rounded-md"
                    style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Section groups */}
              {[
                { label: 'Basic · 清音', rows: BASIC_ROWS, section: 'basic' as KanaSection },
                { label: 'Voiced · 濁音', rows: VOICED_ROWS, section: 'voiced' as KanaSection },
                { label: 'Combinations · 拗音', rows: COMBO_ROWS, section: 'combination' as KanaSection },
              ].map(({ label, rows }) => {
                const allIn = rows.every(r => selectedRows.has(r));
                const someIn = rows.some(r => selectedRows.has(r));
                return (
                  <div key={label} className="mb-4">
                    <button
                      onClick={() => toggleSection(rows)}
                      className="text-[10px] font-mono tracking-widest mb-2 flex items-center gap-1.5 px-2 py-1 rounded"
                      style={{
                        color: allIn ? '#a78bfa' : someIn ? '#a78bfa80' : 'var(--muted)',
                        background: allIn ? 'rgba(167,139,250,0.1)' : 'transparent',
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded border flex items-center justify-center" style={{ borderColor: allIn ? '#a78bfa' : 'var(--muted)', background: allIn ? '#a78bfa' : 'transparent' }}>
                        {allIn && <span className="text-black text-[8px]">✓</span>}
                      </span>
                      {label}
                    </button>
                    <div className="flex flex-wrap gap-1.5 pl-2">
                      {rows.map(row => {
                        const rowEntries = kanaEntries.filter(k => k.row === row);
                        const sample = rowEntries[0];
                        const isSelected = selectedRows.has(row);
                        return (
                          <button
                            key={row}
                            onClick={() => toggleRow(row)}
                            title={rowLabels[row]}
                            className="flex flex-col items-center px-2.5 py-1.5 rounded-lg text-[10px] transition-colors"
                            style={{
                              background: isSelected ? 'rgba(167,139,250,0.12)' : 'var(--faint)',
                              border: `1px solid ${isSelected ? 'rgba(167,139,250,0.35)' : 'var(--border)'}`,
                              color: isSelected ? '#a78bfa' : 'var(--muted)',
                            }}
                          >
                            <span className="jp text-sm">{sample?.hiragana}</span>
                            <span className="font-mono">{sample?.romaji}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Start button */}
            <button
              disabled={drillEntries.length === 0}
              onClick={() => setDrillStarted(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity"
              style={{
                background: drillEntries.length > 0 ? 'rgba(167,139,250,0.2)' : 'var(--faint)',
                color: drillEntries.length > 0 ? '#a78bfa' : 'var(--muted)',
                border: `1px solid ${drillEntries.length > 0 ? 'rgba(167,139,250,0.4)' : 'var(--border)'}`,
                opacity: drillEntries.length === 0 ? 0.5 : 1,
              }}
            >
              {drillEntries.length > 0
                ? `Start drill — ${drillEntries.length * (drillScript === 'both' ? 2 : 1)} cards`
                : 'Select at least one row'}
            </button>
          </div>
        )
      )}

      {/* ── BROWSE mode ─────────────────────────────────────────────────────── */}
      {mode === 'browse' && (
        <>
          {/* Section filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'basic', 'voiced', 'combination'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSectionFilter(s)}
                className="px-3 py-1 rounded-full text-xs transition-colors"
                style={{
                  background: sectionFilter === s ? 'rgba(167,139,250,0.15)' : 'var(--faint)',
                  color: sectionFilter === s ? '#a78bfa' : 'var(--muted)',
                  border: `1px solid ${sectionFilter === s ? 'rgba(167,139,250,0.3)' : 'var(--border)'}`,
                }}
              >
                {s === 'all' ? 'All' : sectionLabels[s]}
              </button>
            ))}
          </div>

          {/* Kana chart */}
          <div className="flex flex-col gap-6">
            {rowsToShow.map(row => {
              const rowEntries = filteredEntries.filter(k => k.row === row);
              return (
                <div key={row}>
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
                    {rowLabels[row]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rowEntries.map(k => {
                      const hStatus = getStatus(states[`kana:h:${k.id}`]);
                      const kStatus = getStatus(states[`kana:k:${k.id}`]);
                      const hColor  = statusMeta[hStatus].color;
                      const kColor  = statusMeta[kStatus].color;
                      return (
                        <motion.div
                          key={k.id}
                          layout
                          className="flex flex-col items-center gap-1 py-3 px-4 rounded-xl min-w-[60px]"
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                        >
                          <div className="flex gap-1 mb-0.5">
                            <span title={`Hiragana: ${statusMeta[hStatus].label}`} className="w-1.5 h-1.5 rounded-full" style={{ background: hColor }} />
                            <span title={`Katakana: ${statusMeta[kStatus].label}`} className="w-1.5 h-1.5 rounded-full" style={{ background: kColor }} />
                          </div>
                          <p className="jp text-xl font-bold text-white leading-none">{k.hiragana}</p>
                          <p className="jp text-sm leading-none" style={{ color: 'rgba(255,255,255,0.45)' }}>{k.katakana}</p>
                          <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--muted)' }}>{k.romaji}</p>
                        </motion.div>
                      );
                    })}
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
