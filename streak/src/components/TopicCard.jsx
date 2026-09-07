import { motion } from 'framer-motion';
import { MoreVertical, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';

export default function TopicCard({ topic, taskCount, completedCount, xpEarned, onEdit, onDelete, dragHandleProps }) {
  const pct = taskCount ? Math.round((completedCount / taskCount) * 100) : 0;
  const colorVar = `var(--color-${topic.color})`;

  return (
    <motion.div
      layout
      className="group relative rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] card-shadow p-5 transition-colors hover:border-[#2a3038]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <span {...dragHandleProps} className="cursor-grab text-[var(--color-text-faint)] opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical size={15} />
            </span>
          )}
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorVar }} />
          <Link to={`/app/topics/${topic.id}`} className="font-display text-[15px] font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">
            {topic.name}
          </Link>
        </div>
        <Dropdown
          trigger={
            <button aria-label={`Options for ${topic.name}`} className="text-[var(--color-text-faint)] hover:text-[var(--color-text)] p-1 rounded-md hover:bg-white/5 transition-colors">
              <MoreVertical size={16} />
            </button>
          }
          items={[
            { label: 'Rename', icon: Pencil, onClick: onEdit },
            { divider: true },
            { label: 'Delete topic', icon: Trash2, danger: true, onClick: onDelete },
          ]}
        />
      </div>

      <p className="mt-4 text-[12.5px] text-[var(--color-text-faint)]">
        {taskCount} task{taskCount !== 1 ? 's' : ''}, {xpEarned} XP earned
      </p>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: colorVar }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="mt-2 text-[11.5px] text-[var(--color-text-faint)]">{pct}% complete today</p>

      <Link
        to={`/app/topics/${topic.id}`}
        className="mt-4 inline-block text-[12.5px] font-medium text-[var(--color-accent)] hover:text-[var(--color-cyan)] transition-colors"
      >
        Manage tasks &rsaquo;
      </Link>
    </motion.div>
  );
}
