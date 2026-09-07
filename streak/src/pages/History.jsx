import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarX2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import { useAppData } from '../context/AppDataContext';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function toKey(d) {
  return d.toISOString().slice(0, 10);
}

export default function History() {
  const { tasks, completions, today } = useAppData();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selected, setSelected] = useState(today);

  const activeTaskCount = tasks.filter((t) => t.active).length || tasks.length || 1;

  const byDate = useMemo(() => {
    const map = {};
    completions.forEach((c) => {
      if (!map[c.date]) map[c.date] = [];
      map[c.date].push(c.taskId);
    });
    return map;
  }, [completions]);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [cursor]);

  function intensity(dateKey) {
    const count = byDate[dateKey]?.length || 0;
    if (count === 0) return 0;
    const ratio = count / activeTaskCount;
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.5) return 2;
    return 1;
  }

  const intensityBg = ['bg-[var(--color-surface-2)]', 'bg-[var(--color-accent)]/25', 'bg-[var(--color-accent)]/55', 'bg-[var(--color-accent)]'];

  const selectedTasks = byDate[selected] || [];
  const selectedTaskDetails = selectedTasks.map((id) => tasks.find((t) => t.id === id)).filter(Boolean);
  const missedTasks = tasks.filter((t) => t.active && !selectedTasks.includes(t.id));
  const xpEarned = selectedTaskDetails.reduce((sum, t) => sum + t.xp, 0);
  const pct = activeTaskCount ? Math.round((selectedTaskDetails.length / activeTaskCount) * 100) : 0;

  function shiftMonth(delta) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }

  return (
    <div>
      <AppHeader title="History" />
      <main className="px-5 py-6 md:px-8 md:py-8 max-w-4xl mx-auto grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] card-shadow p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[16px] font-semibold">{monthLabel}</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => shiftMonth(-1)} aria-label="Previous month" className="rounded-full p-1.5 text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)] transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => shiftMonth(1)} aria-label="Next month" className="rounded-full p-1.5 text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)] transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[11px] text-[var(--color-text-faint)]">
            {WEEKDAYS.map((w, i) => <div key={i}>{w}</div>)}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;
              const key = toKey(date);
              const level = intensity(key);
              const isSelected = key === selected;
              const isFuture = date > new Date();
              return (
                <button
                  key={i}
                  disabled={isFuture}
                  onClick={() => setSelected(key)}
                  aria-label={date.toDateString()}
                  aria-pressed={isSelected}
                  className={`relative aspect-square rounded-[8px] text-[11.5px] font-medium tabular transition-all duration-150 disabled:opacity-30 ${intensityBg[level]} ${level >= 2 ? 'text-white' : 'text-[var(--color-text-muted)]'} ${isSelected ? 'ring-2 ring-[var(--color-cyan)] ring-offset-2 ring-offset-[var(--color-surface)]' : ''}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-2 text-[11.5px] text-[var(--color-text-faint)]">
            <span>Less</span>
            {intensityBg.map((c, i) => <span key={i} className={`h-3 w-3 rounded-[4px] ${c}`} />)}
            <span>More</span>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] card-shadow p-5 md:p-6 h-fit">
          <h3 className="font-display text-[15px] font-semibold">
            {new Date(selected).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </h3>

          {selectedTaskDetails.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon={CalendarX2} title="No activity recorded" description="Nothing was completed on this day." />
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] p-3">
                  <p className="text-[11px] text-[var(--color-text-faint)]">Completion</p>
                  <p className="font-display tabular text-[17px] font-semibold">{pct}%</p>
                </div>
                <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] p-3">
                  <p className="text-[11px] text-[var(--color-text-faint)]">XP earned</p>
                  <p className="font-display tabular text-[17px] font-semibold text-[var(--color-accent)]">{xpEarned}</p>
                </div>
              </div>

              <p className="mt-5 text-[12px] font-medium text-[var(--color-text-muted)]">Completed</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {selectedTaskDetails.map((t) => (
                  <li key={t.id} className="flex items-center justify-between text-[13px]">
                    <span className="text-[var(--color-text)]">{t.name}</span>
                    <span className="text-[var(--color-text-faint)] tabular">+{t.xp}</span>
                  </li>
                ))}
              </ul>

              {missedTasks.length > 0 && (
                <>
                  <p className="mt-5 text-[12px] font-medium text-[var(--color-text-muted)]">Missed</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {missedTasks.map((t) => (
                      <li key={t.id} className="text-[13px] text-[var(--color-text-faint)]">{t.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
