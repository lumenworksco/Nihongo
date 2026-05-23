import { Link } from 'react-router-dom';
import { BookOpen, Layers, Zap, ArrowRight, GraduationCap, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { vocabulary } from '../data/vocabulary';
import { grammarPoints } from '../data/grammar';
import { particles } from '../data/particles';
import { useDeck } from '../hooks/useDeck';
import { useProgress } from '../hooks/useProgress';
import { buildVocabCards, buildGrammarCards, buildParticleCards } from '../lib/studyCards';
import { statusMeta } from '../lib/srs';
import { loadSettings, type SessionRecord } from '../lib/storage';

const vocabCards    = buildVocabCards();
const grammarCards  = buildGrammarCards();
const particleCards = buildParticleCards();

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const DECK_COLORS: Record<string, string> = {
  vocabulary: '#4ade80',
  grammar:    '#60a5fa',
  particles:  'var(--accent)',
};

function formatHistoryDate(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const d = new Date(); d.setDate(d.getDate() - 1);
  const yesterday = d.toISOString().slice(0, 10);
  if (dateStr === today)     return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs > 0 ? `${m}m ${rs}s` : `${m}m`;
}

function SessionRow({ r }: { r: SessionRecord }) {
  const accuracy = Math.round(((r.ratings.good + r.ratings.easy) / r.reviewed) * 100);
  const color = DECK_COLORS[r.deck] ?? 'var(--muted)';
  return (
    <div className="flex items-center gap-3 py-2.5 px-1">
      <span
        className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 capitalize"
        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
      >
        {r.deck}
      </span>
      <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
        {formatHistoryDate(r.date)}
      </span>
      <span className="flex-1" />
      <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
        {r.reviewed} cards
      </span>
      <span className="text-xs font-mono" style={{ color: r.reviewed > 0 && accuracy >= 70 ? '#4ade80' : 'var(--muted)' }}>
        {r.reviewed > 0 ? `${accuracy}%` : '—'}
      </span>
      <span className="text-xs font-mono shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
        {formatDuration(r.durationMs)}
      </span>
    </div>
  );
}

function DeckProgress({ label, jp, studied, total, stats, color }: {
  label: string; jp: string; studied: number; total: number;
  stats: Record<string, number>; color: string;
}) {
  const pct = total > 0 ? Math.round((studied / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="jp text-xs" style={{ color }}>{jp}</span>
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
          {studied}/{total} · {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full mb-2" style={{ background: 'var(--faint)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
      </div>
      <div className="flex gap-2">
        {(['new', 'learning', 'review', 'known'] as const).map(s => (
          <div key={s} className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg" style={{ background: 'var(--faint)' }}>
            <span className="text-sm font-bold" style={{ color: statusMeta[s].color }}>{stats[s]}</span>
            <span className="text-[9px]" style={{ color: 'var(--muted)' }}>{statusMeta[s].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const maxNew = useMemo(() => loadSettings().maxNewCards, []);

  const vocab         = useDeck('vocabulary', vocabCards,    false, maxNew);
  const grammar       = useDeck('grammar',    grammarCards,  false, maxNew);
  const particlesDeck = useDeck('particles',  particleCards, false, maxNew);
  const { streak, history } = useProgress();

  const totalDue = vocab.studyQueue.length + grammar.studyQueue.length + particlesDeck.studyQueue.length;

  const bestStudyLink = useMemo(() => {
    return [
      { to: '/vocabulary', count: vocab.studyQueue.length },
      { to: '/grammar',    count: grammar.studyQueue.length },
      { to: '/particles',  count: particlesDeck.studyQueue.length },
    ].sort((a, b) => b.count - a.count)[0].to;
  }, [vocab.studyQueue.length, grammar.studyQueue.length, particlesDeck.studyQueue.length]);

  const last7 = useMemo(() => {
    const days: { label: string; reviewed: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const reviewed = history.filter(s => s.date === dateStr).reduce((sum, s) => sum + s.reviewed, 0);
      days.push({ label: DAY_LABELS[d.getDay()], reviewed });
    }
    return days;
  }, [history]);

  const maxReviewed = Math.max(...last7.map(d => d.reviewed), 1);

  const recentSessions = useMemo(
    () => [...history].reverse().slice(0, 10),
    [history],
  );

  const sections = [
    { to: '/vocabulary', icon: BookOpen, title: 'Vocabulary', jp: '語彙', desc: `${vocabulary.length} N5 words`, color: '#4ade80', due: vocab.studyQueue.length },
    { to: '/grammar',    icon: Layers,   title: 'Grammar',    jp: '文法', desc: `${grammarPoints.length} patterns`,  color: '#60a5fa', due: grammar.studyQueue.length },
    { to: '/particles',  icon: Zap,      title: 'Particles',  jp: '助詞', desc: `${particles.length} particles`,    color: 'var(--accent)', due: particlesDeck.studyQueue.length },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="jp text-5xl font-bold mb-2" style={{ color: 'var(--accent)' }}>日本語</p>
        <h1 className="text-2xl font-semibold text-white mb-2">Learn Japanese</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>JLPT N5 · Vocabulary, Grammar & Particles</p>
      </motion.div>

      {/* Streak + 7-day history */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}
        className="rounded-2xl p-5 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.2)' }}>
              <Flame size={18} style={{ color: '#fb923c' }} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{streak.current} day streak</p>
              <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                Longest: {streak.longest} · Total: {streak.totalDays} days
              </p>
            </div>
          </div>
          {totalDue > 0 && (
            <Link
              to={bestStudyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,0.25)' }}
            >
              <GraduationCap size={14} />
              {totalDue} due
            </Link>
          )}
        </div>

        {/* 7-day bar chart */}
        <div className="flex items-end gap-1.5" style={{ height: '64px' }}>
          {last7.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: '64px' }}>
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${Math.max((d.reviewed / maxReviewed) * 44, d.reviewed > 0 ? 4 : 2)}px`,
                  background: d.reviewed > 0 ? 'var(--accent)' : 'var(--faint)',
                  opacity: d.reviewed > 0 ? 0.8 : 1,
                }}
              />
              <span className="text-[9px] font-mono shrink-0" style={{ color: 'var(--muted)' }}>{d.label}</span>
            </div>
          ))}
        </div>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
              Recent sessions
            </p>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {recentSessions.map((r, i) => (
                <SessionRow key={i} r={r} />
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Progress cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}
        className="rounded-2xl p-5 mb-4 flex flex-col gap-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <DeckProgress
          label="Vocabulary" jp="語彙"
          studied={vocabulary.length - vocab.stats.new}
          total={vocabulary.length}
          stats={vocab.stats}
          color="#4ade80"
        />
        <div style={{ borderTop: '1px solid var(--border)' }} />
        <DeckProgress
          label="Grammar" jp="文法"
          studied={grammarPoints.length - grammar.stats.new}
          total={grammarPoints.length}
          stats={grammar.stats}
          color="#60a5fa"
        />
        <div style={{ borderTop: '1px solid var(--border)' }} />
        <DeckProgress
          label="Particles" jp="助詞"
          studied={particles.length - particlesDeck.stats.new}
          total={particles.length}
          stats={particlesDeck.stats}
          color="var(--accent)"
        />
      </motion.div>

      {/* Section links */}
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
        {sections.map(({ to, icon: Icon, title, jp, desc, color, due }) => (
          <motion.div key={to} variants={item}>
            <Link
              to={to}
              className="group flex items-start gap-5 p-5 rounded-2xl transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="mt-0.5 p-2.5 rounded-xl shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-white">{title}</span>
                  <span className="jp text-sm" style={{ color }}>{jp}</span>
                  {due > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono ml-auto" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                      {due} due
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{desc}</p>
              </div>
              <ArrowRight size={16} className="mt-1 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'var(--muted)' }} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-10 p-5 rounded-2xl"
        style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}
      >
        <p className="jp text-lg mb-1 text-white">日本語の勉強、頑張ってください！</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Good luck with your Japanese studies!</p>
      </motion.div>
    </div>
  );
}
