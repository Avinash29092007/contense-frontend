import { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Flame, Trophy, Zap, ListChecks, XCircle, Target } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { useAppData } from '../context/AppDataContext';

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
        <Icon size={14} className={tint} />
        <span className="text-[12px]">{label}</span>
      </div>
      <p className="mt-2 font-display tabular text-[24px] font-semibold">{value}</p>
    </Card>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12px] card-shadow">
      <p className="text-[var(--color-text-faint)]">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-medium text-[var(--color-text)]">{p.value} {p.name}</p>
      ))}
    </div>
  );
}

export default function Statistics() {
  const { tasks, completions, streaks, user, topics } = useAppData();

  const last14 = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = completions.filter((c) => c.date === key).length;
      days.push({ label: d.toLocaleDateString(undefined, { weekday: 'narrow' }), date: key, tasks: count });
    }
    return days;
  }, [completions]);

  const weekly = useMemo(() => {
    const weeks = [];
    for (let w = 5; w >= 0; w--) {
      let xp = 0;
      for (let d = 0; d < 7; d++) {
        const day = new Date();
        day.setDate(day.getDate() - (w * 7 + d));
        const key = day.toISOString().slice(0, 10);
        completions.filter((c) => c.date === key).forEach((c) => {
          const t = tasks.find((tt) => tt.id === c.taskId);
          if (t) xp += t.xp;
        });
      }
      weeks.push({ label: `W${6 - w}`, xp });
    }
    return weeks;
  }, [completions, tasks]);

  const totalTasksCompleted = completions.length;
  const activeTaskCount = tasks.filter((t) => t.active).length || 1;
  const daysTracked = new Set(completions.map((c) => c.date)).size || 1;
  const possibleCompletions = daysTracked * activeTaskCount;
  const completionRate = Math.min(100, Math.round((totalTasksCompleted / possibleCompletions) * 100));
  const missed = Math.max(0, possibleCompletions - totalTasksCompleted);

  const topicProgress = topics.map((topic) => {
    const topicTasks = tasks.filter((t) => t.topicId === topic.id);
    const xp = topicTasks.reduce((sum, t) => sum + completions.filter((c) => c.taskId === t.id).length * t.xp, 0);
    return { ...topic, xp };
  }).sort((a, b) => b.xp - a.xp);
  const maxTopicXp = Math.max(1, ...topicProgress.map((t) => t.xp));

  return (
    <div>
      <AppHeader title="Statistics" />
      <main className="px-5 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
          <StatCard icon={Flame} label="Current streak" value={`${streaks.current}d`} tint="text-[var(--color-warn)]" />
          <StatCard icon={Trophy} label="Longest streak" value={`${streaks.longest}d`} tint="text-[var(--color-accent)]" />
          <StatCard icon={Zap} label="Total XP" value={user?.totalXp ?? 0} tint="text-[var(--color-cyan)]" />
          <StatCard icon={ListChecks} label="Tasks completed" value={totalTasksCompleted} tint="text-[var(--color-good)]" />
          <StatCard icon={XCircle} label="Tasks missed" value={missed} tint="text-[var(--color-bad)]" />
          <StatCard icon={Target} label="Completion rate" value={`${completionRate}%`} tint="text-[var(--color-accent)]" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card className="p-5 md:p-6">
            <h3 className="font-display text-[14px] font-semibold">Daily completions, last 14 days</h3>
            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last14} margin={{ left: -20, right: 4, top: 4 }}>
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border-soft)" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--color-text-faint)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-faint)" fontSize={11} tickLine={false} axisLine={false} width={24} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--color-border)' }} />
                  <Area type="monotone" dataKey="tasks" name="tasks" stroke="var(--color-accent)" strokeWidth={2} fill="url(#areaFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <h3 className="font-display text-[14px] font-semibold">Weekly XP</h3>
            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly} margin={{ left: -20, right: 4, top: 4 }}>
                  <CartesianGrid stroke="var(--color-border-soft)" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--color-text-faint)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-faint)" fontSize={11} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-surface-3)' }} />
                  <Bar dataKey="xp" name="XP" fill="var(--color-cyan)" radius={[5, 5, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="mt-5 p-5 md:p-6">
          <h3 className="font-display text-[14px] font-semibold">Topic progress</h3>
          <div className="mt-4 flex flex-col gap-4">
            {topicProgress.map((t) => (
              <div key={t.id}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="h-2 w-2 rounded-full" style={{ background: `var(--color-${t.color})` }} />
                    {t.name}
                  </span>
                  <span className="tabular text-[var(--color-text-faint)]">{t.xp} XP</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                  <div className="h-full rounded-full" style={{ width: `${(t.xp / maxTopicXp) * 100}%`, background: `var(--color-${t.color})` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
