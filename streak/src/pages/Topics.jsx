import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Layers } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import TopicCard from '../components/TopicCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useAppData } from '../context/AppDataContext';

const COLOR_OPTIONS = [
  { key: 'accent', label: 'Electric blue' },
  { key: 'cyan', label: 'Cyan' },
  { key: 'good', label: 'Green' },
];

export default function Topics() {
  const { topics, tasks, completions, today, addTopic, editTopic, removeTopic } = useAppData();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('accent');
  const [busy, setBusy] = useState(false);

  const stats = useMemo(() => {
    const map = {};
    topics.forEach((topic) => {
      const topicTasks = tasks.filter((t) => t.topicId === topic.id && t.active);
      const completedToday = topicTasks.filter((t) => completions.some((c) => c.date === today && c.taskId === t.id));
      const xpEarned = tasks
        .filter((t) => t.topicId === topic.id)
        .reduce((sum, t) => sum + completions.filter((c) => c.taskId === t.id).length * t.xp, 0);
      map[topic.id] = { taskCount: topicTasks.length, completedCount: completedToday.length, xpEarned };
    });
    return map;
  }, [topics, tasks, completions, today]);

  function openCreate() {
    setName('');
    setColor('accent');
    setCreateOpen(true);
  }

  function openEdit(topic) {
    setEditing(topic);
    setName(topic.name);
    setColor(topic.color);
  }

  async function submitCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    await addTopic({ name: name.trim(), color });
    setBusy(false);
    setCreateOpen(false);
  }

  async function submitEdit(e) {
    e.preventDefault();
    if (!name.trim() || !editing) return;
    setBusy(true);
    await editTopic(editing.id, { name: name.trim(), color });
    setBusy(false);
    setEditing(null);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    await removeTopic(deleting.id);
    setBusy(false);
    setDeleting(null);
  }

  return (
    <div>
      <AppHeader title="Topics" />
      <main className="px-5 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <p className="text-[13.5px] text-[var(--color-text-muted)]">The areas you've chosen to stay consistent with.</p>
          <Button icon={Plus} onClick={openCreate} size="sm">New topic</Button>
        </div>

        {topics.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={Layers}
              title="No topics yet"
              description="A topic is any area of your life you want to track — as broad or specific as you like."
              action={<Button icon={Plus} onClick={openCreate}>Create your first topic</Button>}
            />
          </div>
        ) : (
          <motion.div layout className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                taskCount={stats[topic.id]?.taskCount || 0}
                completedCount={stats[topic.id]?.completedCount || 0}
                xpEarned={stats[topic.id]?.xpEarned || 0}
                onEdit={() => openEdit(topic)}
                onDelete={() => setDeleting(topic)}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* Create */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a topic">
        <form onSubmit={submitCreate} className="flex flex-col gap-4">
          <Input label="Topic name" placeholder="e.g. Writing, Finances, French" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <ColorPicker value={color} onChange={setColor} />
          <div className="mt-2 flex justify-end gap-2.5">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!name.trim() || busy}>{busy ? 'Creating...' : 'Create topic'}</Button>
          </div>
        </form>
      </Modal>

      {/* Edit */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Rename topic">
        <form onSubmit={submitEdit} className="flex flex-col gap-4">
          <Input label="Topic name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <ColorPicker value={color} onChange={setColor} />
          <div className="mt-2 flex justify-end gap-2.5">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" disabled={!name.trim() || busy}>{busy ? 'Saving...' : 'Save changes'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete topic"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} disabled={busy}>{busy ? 'Deleting...' : 'Delete topic'}</Button>
          </>
        }
      >
        <p className="text-[14px] text-[var(--color-text-muted)]">
          This permanently deletes "{deleting?.name}" and every task inside it, along with their history. This can't be undone.
        </p>
      </Modal>
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-[var(--color-text-muted)]">Color</p>
      <div className="flex gap-2.5">
        {COLOR_OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt.key}
            aria-label={opt.label}
            aria-pressed={value === opt.key}
            onClick={() => onChange(opt.key)}
            className={`h-8 w-8 rounded-full border-2 transition-transform ${value === opt.key ? 'scale-110 border-[var(--color-text)]' : 'border-transparent'}`}
            style={{ background: `var(--color-${opt.key})` }}
          />
        ))}
      </div>
    </div>
  );
}
