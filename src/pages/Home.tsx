import { Link } from 'react-router-dom';
import { BookOpen, Layers, Zap, ArrowRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { vocabulary } from '../data/vocabulary';
import { grammarPoints } from '../data/grammar';
import { particles } from '../data/particles';
import { useSRS } from '../hooks/useSRS';
import { statusMeta } from '../lib/srs';

const sections = [
  {
    to: '/vocabulary',
    icon: BookOpen,
    title: 'Vocabulary',
    jp: '語彙',
    desc: `${vocabulary.length} N5 words across 7 categories.`,
    color: '#4ade80',
  },
  {
    to: '/grammar',
    icon: Layers,
    title: 'Grammar',
    jp: '文法',
    desc: `${grammarPoints.length} essential N5 patterns with examples.`,
    color: '#60a5fa',
  },
  {
    to: '/particles',
    icon: Zap,
    title: 'Particles',
    jp: '助詞',
    desc: `${particles.length} particles with usage rules and examples.`,
    color: 'var(--accent)',
  },
];

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const { stats, studyQueue } = useSRS();
  const dueCount = studyQueue.length;
  const totalStudied = vocabulary.length - stats.new;
  const pct = Math.round((totalStudied / vocabulary.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="jp text-5xl font-bold mb-2" style={{ color: 'var(--accent)' }}>日本語</p>
        <h1 className="text-2xl font-semibold text-white mb-2">Learn Japanese</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>JLPT N5 · Vocabulary, Grammar & Particles</p>
      </motion.div>

      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="rounded-2xl p-5 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white">Vocabulary progress</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {totalStudied} / {vocabulary.length} words studied
            </p>
          </div>
          {dueCount > 0 && (
            <Link
              to="/vocabulary"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,0.25)' }}
            >
              <GraduationCap size={14} />
              Study {dueCount} due
            </Link>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full mb-4" style={{ background: 'var(--faint)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-4 gap-2">
          {(['new', 'learning', 'review', 'known'] as const).map(s => (
            <div key={s} className="flex flex-col items-center gap-1 py-2 rounded-xl" style={{ background: 'var(--faint)' }}>
              <span className="text-lg font-bold" style={{ color: statusMeta[s].color }}>{stats[s]}</span>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{statusMeta[s].label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section links */}
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
        {sections.map(({ to, icon: Icon, title, jp, desc, color }) => (
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
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-white">{title}</span>
                  <span className="jp text-sm" style={{ color }}>{jp}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{desc}</p>
              </div>
              <ArrowRight size={16} className="mt-1 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'var(--muted)' }} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-10 p-5 rounded-2xl"
        style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}
      >
        <p className="jp text-lg mb-1 text-white">日本語の勉強、頑張ってください！</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Good luck with your Japanese studies!</p>
      </motion.div>
    </div>
  );
}
