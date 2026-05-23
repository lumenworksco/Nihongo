import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Layers, Zap, Home, Settings2, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { to: '/',           label: 'Home',       icon: Home,     exact: true  },
  { to: '/vocabulary', label: 'Vocabulary', icon: BookOpen, exact: false },
  { to: '/grammar',    label: 'Grammar',    icon: Layers,   exact: false },
  { to: '/particles',  label: 'Particles',  icon: Zap,      exact: false },
];

const mobileLinks = [
  ...navLinks,
  { to: '/settings', label: 'Settings', icon: Settings2, exact: false },
];

function NavItem({ to, label, icon: Icon, exact }: { to: string; label: string; icon: typeof Home; exact: boolean }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
          isActive ? 'text-white font-medium' : 'hover:text-white'
        }`
      }
      style={({ isActive }) => ({
        background: isActive ? 'var(--accent-dim)' : 'transparent',
        color: isActive ? 'white' : 'var(--muted)',
        border: isActive ? '1px solid rgba(230,57,70,0.2)' : '1px solid transparent',
      })}
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col gap-1 w-56 shrink-0 py-8 px-4 sticky top-0 h-screen"
        style={{ borderRight: '1px solid var(--border)' }}
      >
        <div className="mb-8 px-3">
          <p className="jp text-2xl font-bold" style={{ color: 'var(--accent)' }}>日本語</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Nihongo · N5</p>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          {navLinks.map(link => <NavItem key={link.to} {...link} />)}
        </div>

        {/* Bottom: settings + auth */}
        <div className="flex flex-col gap-1 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <NavItem to="/settings" label="Settings" icon={Settings2} exact={false} />

          {user ? (
            <div className="px-3 py-2 mt-1">
              <div className="flex items-center gap-2 mb-2">
                <User size={12} style={{ color: 'var(--muted)' }} />
                <span
                  className="text-[11px] truncate flex-1"
                  style={{ color: 'var(--muted)' }}
                  title={user.email}
                >
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-colors hover:text-white"
                style={{ color: 'var(--muted)', background: 'var(--faint)', border: '1px solid var(--border)' }}
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:text-white mt-1"
              style={{ color: 'var(--muted)', border: '1px solid transparent' }}
            >
              <LogIn size={16} />
              Sign in
            </NavLink>
          )}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{
          background: 'rgba(13,13,18,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {mobileLinks.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] transition-colors"
            style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : 'var(--muted)' })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        {/* Auth button for mobile */}
        {user ? (
          <button
            onClick={handleSignOut}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            <LogOut size={18} />
            Sign out
          </button>
        ) : (
          <NavLink
            to="/auth"
            end={false}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] transition-colors"
            style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : 'var(--muted)' })}
          >
            <LogIn size={18} />
            Sign in
          </NavLink>
        )}
      </nav>
    </>
  );
}
