import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function AppHeader({ title }) {
  const { user } = useAppData();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border-soft)] bg-[var(--color-ink)]/85 backdrop-blur-lg px-5 py-4 md:px-8 md:py-5 sticky top-0 z-30">
      <div>
        <h1 className="font-display text-[19px] font-semibold text-[var(--color-text)] md:text-[21px]">
          {title || `${greeting()}, ${user?.name || ''}`}
        </h1>
        <p className="text-[12.5px] text-[var(--color-text-faint)] mt-0.5">{dateStr}</p>
      </div>
      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)] transition-colors"
        >
          <Bell size={17} strokeWidth={2} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        </button>
        <button
          aria-label="Settings"
          onClick={() => navigate('/app/settings')}
          className="hidden h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)] transition-colors md:flex"
        >
          <Settings size={17} strokeWidth={2} />
        </button>
        <Dropdown
          align="right"
          trigger={
            <button
              aria-label="Account menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent-dim)] text-[13px] font-semibold text-[var(--color-accent)] border border-[var(--color-accent-soft)] hover:brightness-125 transition-all"
            >
              {user?.avatarInitial || <User size={15} />}
            </button>
          }
          items={[
            { label: 'Profile & settings', icon: Settings, onClick: () => navigate('/app/settings') },
            { divider: true },
            { label: 'Sign out', icon: LogOut, danger: true, onClick: () => { signOut(); navigate('/'); } },
          ]}
        />
      </div>
    </header>
  );
}
