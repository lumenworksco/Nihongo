import { useState, useEffect } from 'react';
import { Settings2, RotateCcw, Flame, Bell, BellOff, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadSettings, saveSettings, resetDeck } from '../lib/storage';
import { pushSettings, deleteDeckFromSupabase } from '../lib/sync';
import { useAuth } from '../contexts/AuthContext';
import {
  getNotificationStatus,
  subscribeToPush,
  unsubscribeFromPush,
  type NotificationStatus,
} from '../lib/notifications';

const DECKS = [
  { id: 'vocabulary', label: 'Vocabulary',   jp: '語彙' },
  { id: 'grammar',    label: 'Grammar',      jp: '文法' },
  { id: 'particles',  label: 'Particles',    jp: '助詞' },
  { id: 'kana',       label: 'Kana',         jp: 'かな' },
  { id: 'kanji',      label: 'Kanji',        jp: '漢字' },
  { id: 'clt',        label: 'CLT Japanese', jp: 'CLT' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings]       = useState(loadSettings);
  const [saved, setSaved]             = useState(false);
  const [resetDone, setResetDone]     = useState<string | null>(null);
  const [notifStatus, setNotifStatus] = useState<NotificationStatus>('default');
  const [notifBusy, setNotifBusy]     = useState(false);

  useEffect(() => {
    getNotificationStatus().then(setNotifStatus);
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    if (user) pushSettings(user.id, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = (deckId: string) => {
    if (!confirm(`Reset all progress for ${deckId}? This cannot be undone.`)) return;
    resetDeck(deckId);
    if (user) deleteDeckFromSupabase(user.id, deckId);
    setResetDone(deckId);
    setTimeout(() => setResetDone(null), 2000);
  };

  const handleEnableNotifications = async () => {
    if (!user) return;
    setNotifBusy(true);
    const ok = await subscribeToPush(user.id);
    if (ok) {
      setNotifStatus('subscribed');
    } else {
      const updated = await getNotificationStatus();
      setNotifStatus(updated);
    }
    setNotifBusy(false);
  };

  const handleDisableNotifications = async () => {
    if (!user) return;
    setNotifBusy(true);
    await unsubscribeFromPush(user.id);
    setNotifStatus('default');
    setNotifBusy(false);
  };

  const handleResetAll = () => {
    if (!confirm('Reset ALL progress across every deck? This cannot be undone.')) return;
    DECKS.forEach(d => {
      resetDeck(d.id);
      if (user) deleteDeckFromSupabase(user.id, d.id);
    });
    setResetDone('all');
    setTimeout(() => setResetDone(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 pb-28 md:pb-10">
      <div className="flex items-center gap-3 mb-8">
        <Settings2 size={20} style={{ color: 'var(--muted)' }} />
        <div>
          <h1 className="text-xl font-semibold text-white">Settings</h1>
          <p className="jp text-sm mt-0.5" style={{ color: 'var(--muted)' }}>設定</p>
        </div>
      </div>

      {/* Study settings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--accent)' }}>
          Study
        </p>

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-white">New cards per session</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  How many unseen cards are introduced each study session.
                </p>
              </div>
              <span className="text-lg font-bold font-mono" style={{ color: 'var(--accent)' }}>
                {settings.maxNewCards}
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={settings.maxNewCards}
              onChange={e => setSettings(s => ({ ...s, maxNewCards: Number(e.target.value) }))}
              className="w-full"
              style={{ accentColor: 'var(--accent)' }}
            />
            <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--muted)' }}>
              <span>3</span>
              <span>30</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-white">Daily goal</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Cards to review per day to maintain your streak.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame size={14} style={{ color: '#fb923c' }} />
                <span className="text-lg font-bold font-mono" style={{ color: '#fb923c' }}>
                  {settings.dailyGoal}
                </span>
              </div>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={settings.dailyGoal}
              onChange={e => setSettings(s => ({ ...s, dailyGoal: Number(e.target.value) }))}
              className="w-full"
              style={{ accentColor: '#fb923c' }}
            />
            <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--muted)' }}>
              <span>5</span>
              <span>50</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 px-5 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: saved ? 'rgba(74,222,128,0.12)' : 'var(--accent-dim)',
            color: saved ? '#4ade80' : 'var(--accent)',
            border: `1px solid ${saved ? 'rgba(74,222,128,0.3)' : 'rgba(230,57,70,0.25)'}`,
          }}
        >
          {saved ? 'Saved!' : 'Save settings'}
        </button>
      </motion.div>

      {/* Notifications — only meaningful when signed in */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl p-5 mb-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--accent)' }}>
            Notifications
          </p>

          {notifStatus === 'unsupported' && (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Push notifications aren't supported in this browser.
            </p>
          )}

          {notifStatus === 'denied' && (
            <div className="flex items-start gap-3">
              <BellOff size={18} className="mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
              <div>
                <p className="text-sm font-medium text-white">Notifications blocked</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  You've blocked notifications for this site. To re-enable them, open your browser's
                  site settings and allow notifications for this origin, then come back here.
                </p>
              </div>
            </div>
          )}

          {(notifStatus === 'default' || notifStatus === 'subscribed') && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {notifStatus === 'subscribed'
                  ? <BellRing size={18} className="mt-0.5 shrink-0" style={{ color: '#fb923c' }} />
                  : <Bell size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--muted)' }} />
                }
                <div>
                  <p className="text-sm font-medium text-white">
                    {notifStatus === 'subscribed' ? 'Daily reminders on' : 'Daily reminders'}
                  </p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {notifStatus === 'subscribed'
                      ? "You'll get a nudge each evening if you haven't studied yet."
                      : 'Get a push notification each evening when your streak is at risk.'}
                  </p>
                </div>
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

      {/* Reset progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--accent)' }}>
          Reset progress
        </p>
        <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
          Permanently deletes SRS data for the selected deck. Streak and session history are kept.
        </p>

        <div className="flex flex-col gap-2">
          {DECKS.map(({ id, label, jp }) => (
            <div key={id} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
              <div>
                <span className="text-sm text-white">{label}</span>
                <span className="jp text-xs ml-2" style={{ color: 'var(--muted)' }}>{jp}</span>
              </div>
              <button
                onClick={() => handleReset(id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{
                  background: resetDone === id ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.08)',
                  color: resetDone === id ? '#4ade80' : '#ef4444',
                  border: `1px solid ${resetDone === id ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                <RotateCcw size={11} />
                {resetDone === id ? 'Done' : 'Reset'}
              </button>
            </div>
          ))}

          <button
            onClick={handleResetAll}
            className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm transition-colors"
            style={{
              background: resetDone === 'all' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.06)',
              color: resetDone === 'all' ? '#4ade80' : '#ef4444',
              border: `1px solid ${resetDone === 'all' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.15)'}`,
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
