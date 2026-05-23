import { NavLink } from 'react-router-dom';
import { BookOpen, Layers, Zap, Home, Settings2 } from 'lucide-react';

const links = [
  { to: '/',          label: 'Home',       icon: Home,     exact: true  },
  { to: '/vocabulary',label: 'Vocabulary', icon: BookOpen, exact: false },
  { to: '/grammar',   label: 'Grammar',    icon: Layers,   exact: false },
  { to: '/particles', label: 'Particles',  icon: Zap,      exact: false },
  { to: '/settings',  label: 'Settings',   icon: Settings2,exact: false },
];

export default function Sidebar() {
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
          {links.slice(0, 4).map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
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
          ))}
        </div>

        {/* Settings pinned to bottom */}
        <NavLink
          to="/settings"
          end={false}
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
          <Settings2 size={16} />
          Settings
        </NavLink>
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
        {links.map(({ to, label, icon: Icon, exact }) => (
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
      </nav>
    </>
  );
}
