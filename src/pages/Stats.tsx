import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Calendar, Clock, Target, Zap } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { loadDeckStates } from '../lib/storage';
import type { CardStatus } from '../lib/srs';

const DECK_IDS = ['vocabulary', 'grammar', 'particles', 'kana', 'kanji', 'clt'] as const;

const DECK_META: Record<string, { label: string; jp: string; color: string }> = {
  vocabulary: { label: 'Vocabulary', jp: '語彙', color: '#4ade80' },
  grammar:    { label: 'Grammar',    jp: '文法', color: '#60a5fa' },
  particles:  { label: 'Particles',  jp: '助詞', color: 'var(--accent)' },
  kana:       { label: 'Kana',       jp: 'かな', color: '#a78bfa' },
  kanji:      { label: 'Kanji',      jp: '漢字', color: '#f59e0b' },
  clt:        { label: 'CLT',        jp: 'CLT',  color: '#f472b6' },
};

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function formatMinutes(total: number): string {
  if (total < 60) return `${total}m`;
  return `${Math.floor(total / 60)}h ${total % 60}m`;
}

function SummaryCard({ icon: Icon, label, value, sub }: {
  icon: typeof BarChart2; label: string; value: string; sub?: string;
}) {
  return (
    <div className="flex-1 p-4 rounded-2xl flex flex-col gap-1.5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={13} style={{ color: 'var(--muted)' }} />
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{label}</span>
      </div>
      <p className="text-xl font-bold text-white leading-none">{value}</p>
      {sub && <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{sub}</p>}
    </div>
  );
}

export default function Stats() {
  const { streak, history } = useProgress();

  // All card states across every deck — for forecast
  const allCardStates = useMemo(
    () => DECK_IDS.flatMap(id => Object.values(loadDeckStates(id))),
    [],
  );

  // ── Summary stats ─────────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const totalReviewed = history.reduce((s, r) => s + r.reviewed, 0);
    const totalMs       = history.reduce((s, r) => s + r.durationMs, 0);
    const daysStudied   = new Set(history.map(r => r.date)).size;
    const totalRatings  = history.reduce(
      (s, r) => s + r.ratings.again + r.ratings.hard + r.ratings.good + r.ratings.easy, 0,
    );
    const totalCorrect  = history.reduce((s, r) => s + r.ratings.good + r.ratings.easy, 0);
    const accuracy      = totalRatings > 0 ? Math.round((totalCorrect / totalRatings) * 100) : 0;
    return { totalReviewed, totalMinutes: Math.round(totalMs / 60_000), daysStudied, accuracy };
  }, [history]);

  // ── 35-day heatmap (5 weeks × 7 cols, Mon–Sun) ───────────────────────────────
  const heatmap = useMemo(() => {
    const byDate: Record<string, number> = {};
    for (const r of history) byDate[r.date] = (byDate[r.date] ?? 0) + r.reviewed;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Monday of this week (Mon=0 in our scheme)
    const todayDow = (new Date().getDay() + 6) % 7; // Mon=0..Sun=6
    const thisMonday = new Date();
    thisMonday.setDate(new Date().getDate() - todayDow);
    thisMonday.setHours(0, 0, 0, 0);

    // Monday 4 weeks before this Monday
    const start = new Date(thisMonday);
    start.setDate(thisMonday.getDate() - 28);

    // 35 cells: column = i%7 is always the correct weekday (0=Mon,6=Sun)
    const days: { date: string; count: number; isFuture: boolean }[] = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      d.setHours(12, 0, 0, 0);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({ date: dateStr, count: byDate[dateStr] ?? 0, isFuture: d > today });
    }
    const maxCount = Math.max(...days.filter(d => !d.isFuture).map(d => d.count), 1);
    return { days, maxCount };
  }, [history]);

  // ── 14-day review forecast ────────────────────────────────────────────────────
  const forecast = useMemo(() => {
    const now = Date.now();
    const buckets: { label: string; count: number }[] = [];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      const start = d.getTime();
      d.setHours(23, 59, 59, 999);
      const end = d.getTime();

      const label = i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

      // Count cards due in this day window (excludes brand-new unreviewed cards)
      const count = allCardStates.filter(s => s.reps > 0 && s.due >= start && s.due <= end).length;
      // Also count overdue cards in "Today"
      if (i === 0) {
        const overdue = allCardStates.filter(s => s.reps > 0 && s.due < now).length;
        buckets.push({ label, count: count + overdue });
      } else {
        buckets.push({ label, count });
      }
    }
    return buckets;
  }, [allCardStates]);

  const forecastMax = Math.max(...forecast.map(f => f.count), 1);

  // ── Per-deck accuracy ─────────────────────────────────────────────────────────
  const deckAccuracy = useMemo(() => {
    const agg: Record<string, { correct: number; total: number }> = {};
    for (const r of history) {
      if (!agg[r.deck]) agg[r.deck] = { correct: 0, total: 0 };
      agg[r.deck].correct += r.ratings.good + r.ratings.easy;
      agg[r.deck].total   += r.ratings.again + r.ratings.hard + r.ratings.good + r.ratings.easy;
    }
    return DECK_IDS
      .filter(id => agg[id]?.total > 0)
      .map(id => ({
        id,
        ...DECK_META[id],
        accuracy: Math.round((agg[id].correct / agg[id].total) * 100),
        total: agg[id].total,
      }));
  }, [history]);

  // ── Deck status breakdown ─────────────────────────────────────────────────────
  const deckCounts = useMemo(() => {
    return DECK_IDS.map(id => {
      const states = Object.values(loadDeckStates(id));
      const counts: Record<CardStatus, number> = { new: 0, learning: 0, review: 0, scheduled: 0, known: 0 };
      // We import getStatus lazily here to avoid circular deps — use state.state field directly
      for (const s of states) {
        if (s.state === 0) counts.new++;
        else if (s.state === 1 || s.state === 3) counts.learning++;
        else if (s.scheduled_days >= 21) counts.known++;
        else if (Date.now() >= s.due) counts.review++;
        else counts.scheduled++;
      }
      return { id, ...DECK_META[id], counts, total: states.length };
    });
  }, []);

  const heatCellColor = (count: number, max: number): string => {
    if (count === 0) return 'var(--faint)';
    const t = Math.min(count / max, 1);
    if (t < 0.25) return 'rgba(230,57,70,0.2)';
    if (t < 0.5)  return 'rgba(230,57,70,0.4)';
    if (t < 0.75) return 'rgba(230,57,70,0.65)';
    return 'var(--accent)';
  };

  return (
    <div className="max-w-2xl mx-auto px-5 pt-12 pb-28 md:py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 size={20} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-semibold text-white">Progress</h1>
        </div>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          All-time stats · {streak.totalDays} {streak.totalDays === 1 ? 'day' : 'days'} studied
        </p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.06 }}
        className="flex gap-3 mb-4 flex-wrap"
      >
        <SummaryCard icon={Target}  label="Cards reviewed" value={summary.totalReviewed.toLocaleString()} />
        <SummaryCard icon={Zap}     label="Accuracy"       value={history.length > 0 ? `${summary.accuracy}%` : '—'} sub="good + easy" />
        <SummaryCard icon={Calendar} label="Days studied"  value={summary.daysStudied.toString()} sub={`best: ${streak.longest} ${streak.longest === 1 ? 'day' : 'days'}`} />
        <SummaryCard icon={Clock}   label="Time studied"   value={summary.totalMinutes > 0 ? formatMinutes(summary.totalMinutes) : '—'} />
      </motion.div>

      {/* Activity heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
        className="rounded-2xl p-5 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
          Activity · last 35 days
        </p>
        {/* Day-of-week labels */}
        <div className="flex gap-1 mb-1 ml-0">
          {DAY_LABELS.map(d => (
            <div key={d} className="flex-1 text-center text-[8px] font-mono" style={{ color: 'var(--muted)' }}>{d}</div>
          ))}
        </div>
        {/* 5-row × 7-col grid: each row = one week */}
        <div className="flex flex-col gap-1">
          {Array.from({ length: 5 }).map((_, week) => (
            <div key={week} className="flex gap-1">
              {Array.from({ length: 7 }).map((_, dow) => {
                const cell = heatmap.days[week * 7 + dow];
                if (!cell) return <div key={dow} className="flex-1 h-5 rounded-sm" style={{ background: 'transparent' }} />;
                return (
                  <div
                    key={dow}
                    className="flex-1 h-5 rounded-sm"
                    title={cell.isFuture ? undefined : `${cell.date}: ${cell.count} cards`}
                    style={{ background: cell.isFuture ? 'transparent' : heatCellColor(cell.count, heatmap.maxCount) }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-2 justify-end">
          <span className="text-[9px]" style={{ color: 'var(--muted)' }}>fewer</span>
          {['var(--faint)', 'rgba(230,57,70,0.2)', 'rgba(230,57,70,0.4)', 'rgba(230,57,70,0.65)', 'var(--accent)'].map(bg => (
            <div key={bg} className="w-3 h-3 rounded-sm" style={{ background: bg }} />
          ))}
          <span className="text-[9px]" style={{ color: 'var(--muted)' }}>more</span>
        </div>
      </motion.div>

      {/* Review forecast */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.14 }}
        className="rounded-2xl p-5 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
          Review forecast · next 14 days
        </p>
        {forecast.every(f => f.count === 0) ? (
          <p className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>No cards scheduled yet — start studying!</p>
        ) : (
          <div className="flex items-end gap-1" style={{ height: '72px' }}>
            {forecast.map((f, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: '72px' }}>
                <div
                  className="w-full rounded-sm"
                  title={`${f.label}: ${f.count} cards`}
                  style={{
                    height: `${Math.max((f.count / forecastMax) * 48, f.count > 0 ? 4 : 2)}px`,
                    background: i === 0 ? 'var(--accent)' : f.count > 0 ? 'rgba(230,57,70,0.45)' : 'var(--faint)',
                  }}
                />
                <span
                  className="text-[8px] font-mono leading-none text-center"
                  style={{ color: i === 0 ? 'var(--accent)' : 'var(--muted)', fontSize: '7px' }}
                >
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Per-deck accuracy */}
      {deckAccuracy.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 }}
          className="rounded-2xl p-5 mb-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
            Accuracy by deck · good + easy
          </p>
          <div className="flex flex-col gap-4">
            {deckAccuracy.map(d => (
              <div key={d.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-medium text-white">{d.label}</span>
                    <span className="jp text-xs" style={{ color: d.color }}>{d.jp}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                      {d.total.toLocaleString()} ratings
                    </span>
                    <span className="text-sm font-bold font-mono" style={{ color: d.accuracy >= 80 ? '#4ade80' : d.accuracy >= 60 ? '#f59e0b' : 'var(--accent)' }}>
                      {d.accuracy}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--faint)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: d.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.accuracy}%` }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Deck status breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }}
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
          Card status by deck
        </p>
        <div className="flex flex-col gap-4">
          {deckCounts.filter(d => d.total > 0).map(d => (
            <div key={d.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-medium text-white">{d.label}</span>
                  <span className="jp text-xs" style={{ color: d.color }}>{d.jp}</span>
                </div>
                <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                  {d.counts.known + d.counts.scheduled + d.counts.review + d.counts.learning} / {d.total} studied
                </span>
              </div>
              {/* Stacked status bar */}
              <div className="flex h-2 rounded-full overflow-hidden gap-px" style={{ background: 'var(--faint)' }}>
                {d.total > 0 && (
                  <>
                    {d.counts.known > 0 && <div style={{ flex: d.counts.known, background: '#4ade80' }} />}
                    {d.counts.scheduled > 0 && <div style={{ flex: d.counts.scheduled, background: '#a78bfa' }} />}
                    {d.counts.learning > 0 && <div style={{ flex: d.counts.learning, background: '#f59e0b' }} />}
                    {d.counts.review > 0 && <div style={{ flex: d.counts.review, background: 'var(--accent)' }} />}
                    {d.counts.new > 0 && <div style={{ flex: d.counts.new, background: 'var(--faint)' }} />}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Status legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          {([
            ['Known', '#4ade80'], ['Scheduled', '#a78bfa'], ['Learning', '#f59e0b'],
            ['Review', 'var(--accent)'], ['New', '#60a5fa'],
          ] as [string, string][]).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
