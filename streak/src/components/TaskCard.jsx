import { motion } from 'framer-motion';
import { Check, Repeat } from 'lucide-react';
import clsx from 'clsx';

export default function TaskCard({ task, topic, completed, onToggle, dimTopic = false }) {
  return (
    <motion.div
      layout
      className={clsx(
        'group flex items-center gap-3.5 rounded-[var(--radius-sm)] border px-4 py-3.5 transition-colors duration-200',
        completed
          ? 'border-[var(--color-accent-soft)] bg-[var(--color-accent-dim)]/40'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[#2a3038]'
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-pressed={completed}
        aria-label={completed ? `Mark "${task.name}" as not done` : `Mark "${task.name}" as done`}
        className={clsx(
          'relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200',
          completed
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
            : 'border-[var(--color-border)] group-hover:border-[var(--color-text-faint)]'
        )}
      >
        {completed && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            <Check size={13} strokeWidth={3} className="text-[var(--color-ink)]" />
          </motion.span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={clsx(
            'text-[14px] font-medium truncate transition-colors duration-200',
            completed ? 'text-[var(--color-text-muted)] line-through decoration-[var(--color-text-faint)]' : 'text-[var(--color-text)]'
          )}
        >
          {task.name}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-[var(--color-text-faint)]">
          {!dimTopic && topic && (
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" style={{ background: `var(--color-${topic.color === 'accent' ? 'accent' : topic.color})` }} />
              {topic.name}
            </span>
          )}
          {task.frequency && (
            <span className="inline-flex items-center gap-1">
              <Repeat size={11} />
              {task.frequency}
            </span>
          )}
        </div>
      </div>

      <span
        className={clsx(
          'shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold tabular transition-colors duration-200',
          completed ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'bg-[var(--color-surface-3)] text-[var(--color-text-muted)]'
        )}
      >
        {completed ? '+' : ''}{task.xp} XP
      </span>
    </motion.div>
  );
}
