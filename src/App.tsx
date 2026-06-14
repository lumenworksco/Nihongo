import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { pullUserData, pushAllLocalData } from './lib/sync';
import { reconcileStreak } from './lib/storage';
import { consumePendingStreakEvent, WIN_EVENT, type StreakEvent } from './lib/streakEvents';
import Sidebar from './components/Sidebar';
import StreakModal from './components/StreakModal';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import Particles from './pages/Particles';
import CLT from './pages/CLT';
import Kana from './pages/Kana';
import Kanji from './pages/Kanji';
import Reading from './pages/Reading';
import Exam from './pages/Exam';
import SettingsPage from './pages/Settings';
import AuthPage from './pages/Auth';

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

function AppInner() {
  const { user, loading: authLoading } = useAuth();

  // syncEpoch forces all page components to remount after cloud data is written
  // to localStorage, so their useState hooks re-read the fresh values.
  const [syncEpoch, setSyncEpoch]       = useState(0);
  const [ready, setReady]               = useState(false);
  const [streakEvent, setStreakEvent]   = useState<StreakEvent | null>(null);

  // Run reconcile + consume any pending event (call after localStorage is settled)
  const checkStreakEvent = useCallback(() => {
    reconcileStreak();
    const ev = consumePendingStreakEvent();
    if (ev) setStreakEvent(ev);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      checkStreakEvent();
      setReady(true);
      return;
    }

    setReady(false);
    pullUserData(user.id)
      .then(hadData => {
        if (!hadData) {
          // Brand-new account — migrate anonymous local progress to the cloud
          return pushAllLocalData(user.id);
        }
      })
      .catch(console.error)
      .finally(() => {
        checkStreakEvent(); // reconcile AFTER cloud data is written
        setReady(true);
        setSyncEpoch(e => e + 1);
      });
  }, [user?.id, authLoading, checkStreakEvent]);

  // Listen for events fired from study sessions on any page
  useEffect(() => {
    const handler = () => {
      const ev = consumePendingStreakEvent();
      if (ev) setStreakEvent(ev);
    };
    window.addEventListener(WIN_EVENT, handler);
    return () => window.removeEventListener(WIN_EVENT, handler);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <p className="jp text-4xl font-bold" style={{ color: 'var(--accent)' }}>日本語</p>
          <Loader2 size={22} className="animate-spin" style={{ color: 'var(--muted)' }} />
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main key={syncEpoch} className="flex-1 min-w-0 pb-[calc(env(safe-area-inset-bottom,0px)+4rem)] md:pb-0">
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/grammar"    element={<Grammar />} />
            <Route path="/particles"  element={<Particles />} />
            <Route path="/clt"        element={<CLT />} />
            <Route path="/kana"       element={<Kana />} />
            <Route path="/kanji"      element={<Kanji />} />
            <Route path="/reading"    element={<Reading />} />
            <Route path="/exam"       element={<Exam />} />
            <Route path="/settings"   element={<SettingsPage />} />
            <Route path="/auth"       element={<AuthPage />} />
          </Routes>
        </main>
      </div>
      {streakEvent && (
        <StreakModal event={streakEvent} onClose={() => setStreakEvent(null)} />
      )}
    </BrowserRouter>
  );
}
