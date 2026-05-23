import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GraduationCap, ArrowLeftRight } from 'lucide-react';
import { particles, type Particle } from '../data/particles';
import { useDeck } from '../hooks/useDeck';
import { useProgress } from '../hooks/useProgress';
import { buildParticleCards } from '../lib/studyCards';
import StudySession from '../components/StudySession';

const particleCards = buildParticleCards();

function ParticleCard({ p }: { p: Particle }) {
  const [open, setOpen] = useState(false);

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
          className="jp w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl font-bold"
          style={{ background: 'var(--accent-dim)', border: '1px solid rgba(230,57,70,0.2)', color: 'var(--accent)' }}
        >
          {p.particle}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-white">{p.name}</span>
            <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>({p.romaji})</span>
          </div>
          <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{p.summary}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: 'var(--muted)' }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 flex flex-col gap-5" style={{ borderTop: '1px solid var(--border)' }}>
              {p.usages.map((usage, ui) => (
                <div key={ui} className="pt-4">
                  <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
                    {usage.label}
                  </p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {usage.explanation}
                  </p>
                  <div className="flex flex-col gap-2">
                    {usage.examples.map((ex, ei) => (
                      <div
                        key={ei}
                        className="px-4 py-3 rounded-lg"
                        style={{ background: 'var(--faint)', borderLeft: '2px solid var(--accent)' }}
                      >
                        <p className="jp text-white text-sm mb-0.5">{ex.jp}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{ex.en}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {p.tip && (
                <div
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', color: '#fbbf24' }}
                >
                  💡 {p.tip}
                </div>
              )}

              {p.confusedWith && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
                    Often confused with
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {p.confusedWith.map(c => (
                      <span
                        key={c}
                        className="jp px-3 py-1.5 rounded-lg text-lg font-bold"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type Mode = 'browse' | 'study';

export default function Particles() {
  const [mode, setMode]                   = useState<Mode>('browse');
  const [bidirectional, setBidirectional] = useState(false);
  const { rate, undoCard, studyQueue }    = useDeck('particles', particleCards, bidirectional);
  const { recordSession }                 = useProgress();

  const dueCount = studyQueue.length;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Particles</h1>
          <p className="jp text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            助詞 · {particles.length} particles
          </p>
        </div>
        <div className="flex items-center gap-2">
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
              Bidirectional
            </button>
          )}
          <button
            onClick={() => setMode(m => m === 'study' ? 'browse' : 'study')}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{
              background: mode === 'study' ? 'var(--accent-dim)' : 'var(--faint)',
              color: mode === 'study' ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${mode === 'study' ? 'rgba(230,57,70,0.25)' : 'var(--border)'}`,
            }}
          >
            <GraduationCap size={12} />
            Study
            {dueCount > 0 && mode !== 'study' && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {dueCount > 99 ? '99+' : dueCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mode === 'study' ? (
        dueCount === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-4xl">🎉</p>
            <p className="text-lg font-semibold text-white">Nothing due right now</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Come back later or review the particles below.</p>
            <button onClick={() => setMode('browse')} className="mt-2 text-sm underline" style={{ color: 'var(--muted)' }}>
              Browse particles
            </button>
          </div>
        ) : (
          <StudySession
            queue={studyQueue}
            onRate={rate}
            onUndo={undoCard}
            onComplete={(reviewed, ratings, durationMs) =>
              recordSession('particles', reviewed, ratings, durationMs)
            }
            onBack={() => setMode('browse')}
          />
        )
      ) : (
        <>
          {/* Quick reference grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 mb-8">
            {particles.map(p => (
              <button
                key={p.particle}
                onClick={() => {
                  const el = document.getElementById(`particle-${p.particle}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="jp aspect-square rounded-xl text-xl font-bold transition-colors hover:opacity-80"
                style={{ background: 'var(--accent-dim)', border: '1px solid rgba(230,57,70,0.2)', color: 'var(--accent)' }}
              >
                {p.particle}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {particles.map(p => (
              <div key={p.particle} id={`particle-${p.particle}`}>
                <ParticleCard p={p} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
