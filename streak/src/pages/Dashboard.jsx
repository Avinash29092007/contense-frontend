import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Zap, ListChecks, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import ProgressRing from '../components/ProgressRing';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { useAppData } from '../context/AppDataContext';

function StatPill({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-xs)] ${accent ? 'bg-[var(--color-accent-dim)]' : 'bg-[var(--color-surface-3)]'}`}>
        <Icon size={16} className={accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'} />
      </div>
      <div className="min-w-0">
        <p className="text-[11.5px] text-[var(--color-text-faint)] truncate">{label}</p>
        <p className="font-display tabular text-[17px] font-semibold leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { topics, activeTasks, todaysCompletedIds, todaysXp, todaysCompletionPct, streaks, toggleTask, loading } = useAppData();
  const navigate = useNavigate();
  const [justCompletedId, setJustCompletedId] = useState(null);

  const grouped = useMemo(() => {
    const byTopic = new Map();
    activeTasks.forEach((task) => {
      if (!byTopic.has(task.topicId)) byTopic.set(task.topicId, []);
      byTopic.get(task.topicId).push(task);
    });
    return topics
      .map((topic) => ({ topic, tasks: byTopic.get(topic.id) || [] }))
      .filter((g) => g.tasks.length > 0);
  }, [topics, activeTasks]);

  async function handleToggle(taskId) {
    const completed = await toggleTask(taskId);
    if (completed) {
      setJustCompletedId(taskId);
      setTimeout(() => setJustCompletedId(null), 700);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-[13px] text-[var(--color-text-faint)]">
        Loading your progress...
      </div>
    );
  }

  const remaining = activeTasks.length - todaysCompletedIds.size;

  return (
    <div>
      <AppHeader />
      <main className="px-5 py-6 md:px-8 md:py-8 max-w-4xl mx-auto">
        {/* HERO PROGRESS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:items-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] card-shadow p-6 md:p-7">
          <div className="flex justify-center md:justify-start relative">
            <ProgressRing percent={todaysCompletionPct} size={140} stroke={10}>
              <div className="text-center relative">
                <AnimatePresence>
                  {justCompletedId && (
                    <motion.span
                      initial={{ opacity: 0, y: 6, scale: 0.8 }}
                      animate={{ opacity: 1, y: -34, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute left-1/2 -translate-x-1/2 text-[12px] font-semibold text-[var(--color-cyan)] whitespace-nowrap"
                    >
                      + XP
                    </motion.span>
                  )}
                </AnimatePresence>
                <p className="font-display tabular text-[27px] font-semibold leading-none">{todaysCompletionPct}%</p>
                <p className="mt-1 text-[11px] text-[var(--color-text-faint)]">today</p>
              </div>
            </ProgressRing>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
            <StatPill icon={Flame} label="Current streak" value={`${streaks.current} day${streaks.current !== 1 ? 's' : ''}`} accent />
            <StatPill icon={Zap} label="Today's XP" value={todaysXp} />
            <StatPill icon={ListChecks} label="Remaining" value={remaining} />
            <StatPill icon={Layers} label="Longest streak" value={`${streaks.longest} days`} />
          </div>
        </div>

        {/* TODAY */}
        <div className="mt-9">
          <h2 className="font-display text-[15px] font-semibold text-[var(--color-text)]">Today</h2>

          {grouped.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={Layers}
                title="No topics yet"
                description="Create your first topic to start tracking the things that matter to you."
                action={<Button onClick={() => navigate('/app/topics')}>+ Create your first topic</Button>}
              />
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-7">
              {grouped.map(({ topic, tasks }) => (
                <div key={topic.id}>
                  <div className="mb-2.5 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: `var(--color-${topic.color})` }} />
                    <h3 className="text-[13px] font-medium text-[var(--color-text-muted)]">{topic.name}</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        topic={topic}
                        dimTopic
                        completed={todaysCompletedIds.has(task.id)}
                        onToggle={handleToggle}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
