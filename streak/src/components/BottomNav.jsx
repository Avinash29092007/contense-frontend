import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutGrid, ListTree, CalendarDays, BarChart3, Settings } from 'lucide-react';

const NAV = [
  { to: '/app', label: 'Today', icon: LayoutGrid, end: true },
  { to: '/app/topics', label: 'Topics', icon: ListTree },
  { to: '/app/history', label: 'History', icon: CalendarDays },
  { to: '/app/statistics', label: 'Stats', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-around border-t border-[var(--color-border-soft)] bg-[var(--color-surface)]/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary"
    >
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium transition-colors min-h-[52px] justify-center',
              isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-faint)]'
            )
          }
        >
          <Icon size={19} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
