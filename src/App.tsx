import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { pullUserData, pushAllLocalData } from './lib/sync';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import Particles from './pages/Particles';
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
  const [syncEpoch, setSyncEpoch] = useState(0);
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
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
        setReady(true);
        setSyncEpoch(e => e + 1);
      });
  }, [user?.id, authLoading]);

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
        <main key={syncEpoch} className="flex-1 min-w-0">
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/grammar"    element={<Grammar />} />
            <Route path="/particles"  element={<Particles />} />
            <Route path="/settings"   element={<SettingsPage />} />
            <Route path="/auth"       element={<AuthPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
