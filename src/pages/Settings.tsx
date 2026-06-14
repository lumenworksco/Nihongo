import { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Flame, Bell, BellOff, BellRing, LogOut, User, Sparkles, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadSettings, saveSettings, resetDeck } from '../lib/storage';
import { pushSettings, deleteDeckFromSupabase } from '../lib/sync';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getNotificationStatus,
  subscribeToPush,
  unsubscribeFromPush,
  type NotificationStatus,
} from '../lib/notifications';

const DECKS = [
  { id: 'vocabulary', label: 'Vocabulary',   jp: '語彙', color: '#4ade80' },
  { id: 'grammar',    label: 'Grammar',      jp: '文法', color: '#60a5fa' },
  { id: 'particles',  label: 'Particles',    jp: '助詞', color: 'var(--accent)' },
  { id: 'kana',       label: 'Kana',         jp: 'かな', color: '#a78bfa' },
  { id: 'kanji',      label: 'Kanji',        jp: '漢字', color: '#f59e0b' },
  { id: 'clt',        label: 'CLT Japanese', jp: 'CLT',  color: '#f472b6' },
];

function sliderTrack(value: number, min: number, max: number, color: string): React.CSSProperties {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    appearance: 'none' as const,
    width: '100%',
    height: '5px',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
    background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--faint) ${pct}%, var(--faint) 100%)`,
  };
}

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--accent)' }}>
      {label}
    </p>
  );
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings]       = useState(loadSettings);
  const [saved, setSaved]             = useState(false);
  const [resetDone, setResetDone]     = useState<string | null>(null);
  const [notifStatus, setNotifStatus] = useState<NotificationStatus>('default');
  const [notifBusy, setNotifBusy]     = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getNotificationStatus().then(setNotifStatus);
  }, []);

  // Auto-save settings 600ms after last slider change
  const handleSettingChange = useCallback((updated: typeof settings) => {
    setSettings(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveSettings(updated);
      if (user) pushSettings(user.id, updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 600);
  }, [user]);

  const handleReset = (deckId: string, label: string) => {
    if (!confirm(`Reset all SRS progress for ${label}? This cannot be undone.`)) return;
    resetDeck(deckId);
    if (user) deleteDeckFromSupabase(user.id, deckId);
    setResetDone(deckId);
    setTimeout(() => setResetDone(null), 2000);
  };

  const handleResetAll = () => {
    if (!confirm('Reset ALL SRS progress across every deck? This cannot be undone.')) return;
    DECKS.forEach(d => {
      resetDeck(d.id);
      if (user) deleteDeckFromSupabase(user.id, d.id);
    });
    setResetDone('all');
    setTimeout(() => setResetDone(null), 2500);
  };

  const handleEnableNotifications = async () => {
    if (!user) return;
    setNotifBusy(true);
    const ok = await subscribeToPush(user.id);
    setNotifStatus(ok ? 'subscribed' : await getNotificationStatus());
    setNotifBusy(false);
  };

  const handleDisableNotifications = async () => {
    if (!user) return;
    setNotifBusy(true);
    await unsubscribeFromPush(user.id);
    setNotifStatus('default');
    setNotifBusy(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto px-5 pt-12 pb-28 md:py-12">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-semibold text-white mb-1">Settings</h1>
        <p className="jp text-sm mb-8" style={{ color: 'var(--muted)' }}>設定</p>
      </motion.div>

      {/* ── Study preferences ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.06 }}
        className="rounded-2xl p-5 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <SectionHeader label="Study" />

        {/* New cards */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-white mb-0.5">New cards per session</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Unseen cards introduced each time you study.
              </p>
            </div>
            <span
              className="text-2xl font-bold font-mono tabular-nums ml-4 mt-0.5"
              style={{ color: 'var(--accent)', minWidth: '2.5rem', textAlign: 'right' }}
            >
              {settings.maxNewCards}
            </span>
          </div>
          <input
            type="range" min={3} max={30} step={1}
            value={settings.maxNewCards}
            onChange={e => handleSettingChange({ ...settings, maxNewCards: Number(e.target.value) })}
            style={sliderTrack(settings.maxNewCards, 3, 30, 'var(--accent)')}
          />
          <div className="flex justify-between mt-1.5 text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <span>3 min</span><span>30 max</span>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1.5rem' }} />

        {/* Daily goal */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-white mb-0.5">Daily goal</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Cards reviewed per day to keep your streak alive.
              </p>
            </div>
            <div className="flex items-center gap-1.5 ml-4 mt-0.5">
              <Flame size={16} style={{ color: '#fb923c' }} />
              <span className="text-2xl font-bold font-mono tabular-nums" style={{ color: '#fb923c' }}>
                {settings.dailyGoal}
              </span>
            </div>
          </div>
          <input
            type="range" min={5} max={50} step={5}
            value={settings.dailyGoal}
            onChange={e => handleSettingChange({ ...settings, dailyGoal: Number(e.target.value) })}
            style={sliderTrack(settings.dailyGoal, 5, 50, '#fb923c')}
          />
          <div className="flex justify-between mt-1.5 text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <span>5 min</span><span>50 max</span>
          </div>
        </div>

        {/* Auto-save indicator */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="mt-5 flex items-center gap-2 text-xs"
              style={{ color: '#4ade80' }}
            >
              <Sparkles size={13} />
              Settings saved
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-2xl p-5 mb-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <SectionHeader label="Notifications" />

          {notifStatus === 'unsupported' && (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Push notifications aren't supported in this browser.
            </p>
          )}

          {notifStatus === 'denied' && (
            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <BellOff size={16} className="mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Notifications blocked</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  Allow notifications for this site in your browser's site settings, then reload.
                </p>
              </div>
            </div>
          )}

          {(notifStatus === 'default' || notifStatus === 'subscribed') && (
            <div className="flex items-center gap-4">
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{
                  background: notifStatus === 'subscribed' ? 'rgba(251,146,60,0.12)' : 'var(--faint)',
                  border: `1px solid ${notifStatus === 'subscribed' ? 'rgba(251,146,60,0.25)' : 'var(--border)'}`,
                }}
              >
                {notifStatus === 'subscribed'
                  ? <BellRing size={18} style={{ color: '#fb923c' }} />
                  : <Bell size={18} style={{ color: 'var(--muted)' }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  {notifStatus === 'subscribed' ? 'Daily reminders on' : 'Daily reminders'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {notifStatus === 'subscribed'
                    ? "You'll get a nudge at your usual study hour if you haven't studied yet."
                    : 'Get a nudge at your usual study hour when your streak is at risk.'}
                </p>
              </div>
              {notifStatus === 'subscribed' ? (
                <button
                  onClick={handleDisableNotifications}
                  disabled={notifBusy}
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-opacity disabled:opacity-50"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {notifBusy ? '…' : 'Turn off'}
                </button>
              ) : (
                <button
                  onClick={handleEnableNotifications}
                  disabled={notifBusy}
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-opacity disabled:opacity-50"
                  style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)' }}
                >
                  {notifBusy ? '…' : 'Enable'}
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Account ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.14 }}
        className="rounded-2xl p-5 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <SectionHeader label="Account" />

        {user ? (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
              <User size={18} style={{ color: 'var(--muted)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Progress synced to cloud</p>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--faint)', color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
              <User size={18} style={{ color: 'var(--muted)' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Not signed in</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Progress is stored locally only</p>
            </div>
            <a
              href="/auth"
              className="shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,0.25)' }}
            >
              Sign in
            </a>
          </div>
        )}
      </motion.div>

      {/* ── Reset progress ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 }}
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert size={13} style={{ color: '#ef4444' }} />
          <SectionHeader label="Reset progress" />
        </div>
        <p className="text-xs mb-5 -mt-4" style={{ color: 'var(--muted)' }}>
          Permanently deletes SRS data for a deck. Streak and session history are kept.
        </p>

        <div className="flex flex-col gap-2">
          {DECKS.map(({ id, label, jp, color }) => (
            <div
              key={id}
              className="flex items-center justify-between py-3 px-4 rounded-xl"
              style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-sm text-white">{label}</span>
                <span className="jp text-xs" style={{ color: 'var(--muted)' }}>{jp}</span>
              </div>
              <button
                onClick={() => handleReset(id, label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: resetDone === id ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.07)',
                  color: resetDone === id ? '#4ade80' : '#ef4444',
                  border: `1px solid ${resetDone === id ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.18)'}`,
                }}
              >
                <RotateCcw size={11} />
                {resetDone === id ? 'Done' : 'Reset'}
              </button>
            </div>
          ))}

          <button
            onClick={handleResetAll}
            className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: resetDone === 'all' ? 'rgba(74,222,128,0.08)' : 'transparent',
              color: resetDone === 'all' ? '#4ade80' : '#ef4444',
              border: `1px solid ${resetDone === 'all' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            <RotateCcw size={13} />
            {resetDone === 'all' ? 'All decks reset' : 'Reset all decks'}
          </button>
        </div>
      </motion.div>

    </div>
  );
}
