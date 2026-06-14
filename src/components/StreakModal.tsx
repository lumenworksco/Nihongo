import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, HeartCrack, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { StreakEvent } from '../lib/streakEvents';

const MILESTONE_COPY: Record<number, { jp: string; en: string; emoji: string }> = {
  7:   { jp: '一週間！すごい！',       en: 'One full week of study!',     emoji: '🔥' },
  30:  { jp: '一ヶ月！素晴らしい！',   en: 'One whole month!',            emoji: '⭐' },
  100: { jp: '百日！信じられない！',   en: '100 days. Unbelievable.',     emoji: '🏆' },
  365: { jp: '一年！本当にすごい！',   en: 'One full year of Japanese!',  emoji: '👑' },
};

interface Props {
  event: StreakEvent;
  onClose: () => void;
}

function Overlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    />
  );
}

function GoalMetModal({ event, onClose }: { event: Extract<StreakEvent, { type: 'goal-met' }>; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center gap-5 relative"
        style={{ background: '#0f0f14', border: '1px solid rgba(251,146,60,0.3)', boxShadow: '0 0 60px rgba(251,146,60,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: 'var(--muted)', background: 'var(--faint)' }}>
          <X size={14} />
        </button>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.25)' }}
        >
          <Flame size={44} style={{ color: '#fb923c' }} />
        </motion.div>

        {/* Text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="jp text-base mb-1"
            style={{ color: '#fb923c' }}
          >
            日標達成！
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-2xl font-bold text-white"
          >
            Daily Goal Complete!
          </motion.h2>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full flex gap-4"
        >
          <div className="flex-1 rounded-2xl py-4 flex flex-col items-center gap-1" style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.15)' }}>
            <span className="text-3xl font-bold" style={{ color: '#fb923c' }}>{event.cardsToday}</span>
            <span className="text-[11px]" style={{ color: 'var(--muted)' }}>cards today</span>
          </div>
          {event.streak > 0 && (
            <div className="flex-1 rounded-2xl py-4 flex flex-col items-center gap-1" style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.15)' }}>
              <span className="text-3xl font-bold" style={{ color: '#fb923c' }}>{event.streak}</span>
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>day streak</span>
            </div>
          )}
        </motion.div>

        {/* Motivational line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="text-sm"
          style={{ color: 'var(--muted)' }}
        >
          {event.streak >= 3
            ? `${event.streak} days in a row — you're on a roll! 🔥`
            : 'Great work! Come back tomorrow to start a streak.'}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl text-sm font-bold transition-opacity hover:opacity-90"
          style={{ background: '#fb923c', color: '#000' }}
        >
          続ける · Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function MilestoneModal({ event, onClose }: { event: Extract<StreakEvent, { type: 'milestone' }>; onClose: () => void }) {
  const copy = MILESTONE_COPY[event.streak] ?? { jp: '記録達成！', en: 'Record achieved!', emoji: '🏆' };
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 24 }}
        className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center gap-5 relative"
        style={{ background: '#0f0f14', border: '1px solid rgba(234,179,8,0.35)', boxShadow: '0 0 80px rgba(234,179,8,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: 'var(--muted)', background: 'var(--faint)' }}>
          <X size={14} />
        </button>

        {/* Big emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.05 }}
          className="text-6xl"
        >
          {copy.emoji}
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="jp text-base mb-1"
            style={{ color: '#eab308' }}
          >
            {copy.jp}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-3xl font-bold text-white"
          >
            {event.streak} Day Streak!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="text-sm mt-1"
            style={{ color: 'var(--muted)' }}
          >
            {copy.en}
          </motion.p>
        </div>

        {/* Trophy graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.32 }}
          className="w-full rounded-2xl py-5 flex flex-col items-center gap-2"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}
        >
          <Trophy size={36} style={{ color: '#eab308' }} />
          <p className="text-sm font-medium text-white">Milestone achieved</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{event.streak}日連続学習 · {event.streak} consecutive days</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl text-sm font-bold transition-opacity hover:opacity-90"
          style={{ background: '#eab308', color: '#000' }}
        >
          素晴らしい！ · Amazing!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function StreakBrokenModal({ event, onClose }: { event: Extract<StreakEvent, { type: 'streak-broken' }>; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center gap-5 relative"
        style={{ background: '#0f0f14', border: '1px solid rgba(239,68,68,0.25)', boxShadow: '0 0 60px rgba(239,68,68,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: 'var(--muted)', background: 'var(--faint)' }}>
          <X size={14} />
        </button>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.08 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <HeartCrack size={44} style={{ color: '#ef4444' }} />
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="jp text-base mb-1"
            style={{ color: '#ef4444' }}
          >
            ストリークが終わりました
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-2xl font-bold text-white"
          >
            Streak Lost
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="w-full rounded-2xl py-4 flex flex-col items-center gap-1"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          <span className="text-4xl font-bold" style={{ color: '#ef4444' }}>{event.lost}</span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>day streak lost</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34 }}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Don't give up. Every master was once a beginner. Start today and build an even longer streak.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col gap-2"
        >
          <Link
            to="/vocabulary"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Study now <ArrowRight size={15} />
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-sm transition-opacity hover:opacity-80"
            style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            Maybe later
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function StreakModal({ event, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {event.type === 'goal-met'       && <GoalMetModal       key="goal"      event={event} onClose={onClose} />}
      {event.type === 'milestone'      && <MilestoneModal     key="milestone" event={event} onClose={onClose} />}
      {event.type === 'streak-broken'  && <StreakBrokenModal  key="broken"    event={event} onClose={onClose} />}
    </AnimatePresence>
  );
}
