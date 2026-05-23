import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import Particles from './pages/Particles';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/grammar"    element={<Grammar />} />
            <Route path="/particles"  element={<Particles />} />
            <Route path="/settings"   element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
