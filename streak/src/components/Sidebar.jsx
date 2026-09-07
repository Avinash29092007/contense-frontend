import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Activity, LayoutGrid, ListTree, CalendarDays, BarChart3, Settings } from 'lucide-react';

const NAV = [
  { to: '/app', label: 'Today', icon: LayoutGrid, end: true },
  { to: '/app/topics', label: 'Topics', icon: ListTree },
  { to: '/app/history', label: 'History', icon: CalendarDays },
  { to: '/app/statistics', label: 'Statistics', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-[232px] md:flex-col md:border-r md:border-[var(--color-border-soft)] md:bg-[var(--color-surface)] md:shrink-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <Activity size={19} className="text-[var(--color-accent)]" strokeWidth={2.4} />
        <span className="font-display text-[15px] font-semibold">Cadence</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-[var(--radius-xs)] px-3.5 py-2.5 text-[13.5px] font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-dim)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:bg-white/[0.04] hover:text-[var(--color-text)]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={2} className={isActive ? 'text-[var(--color-accent)]' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
          <p className="text-[12px] text-[var(--color-text-faint)]">Frontend preview</p>
          <p className="mt-0.5 text-[12.5px] text-[var(--color-text-muted)]">All data is local mock state.</p>
        </div>
      </div>
    </aside>
  );
}
