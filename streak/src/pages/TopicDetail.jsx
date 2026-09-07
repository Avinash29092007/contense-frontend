import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Pencil, Trash2, ListChecks } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';
import EmptyState from '../components/EmptyState';
import { useAppData } from '../context/AppDataContext';

const FREQUENCIES = ['Daily', 'Weekdays', 'Weekly', '3x / week', 'Custom'];

const emptyForm = { name: '', xp: 20, frequency: 'Daily', description: '' };

export default function TopicDetail() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topics, tasks, completions, addTask, editTask, removeTask } = useAppData();
  const topic = topics.find((t) => t.id === topicId);
  const topicTasks = useMemo(() => tasks.filter((t) => t.topicId === topicId), [tasks, topicId]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  function xpFor(task) {
    return completions.filter((c) => c.taskId === task.id).length * task.xp;
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEdit(task) {
    setForm({ name: task.name, xp: task.xp, frequency: task.frequency, description: task.description || '' });
    setEditingTask(task);
    setFormOpen(true);
  }

  async function submitForm(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setBusy(true);
    if (editingTask) {
      await editTask(editingTask.id, { ...form, xp: Number(form.xp) || 0 });
    } else {
      await addTask({ topicId, ...form });
    }
    setBusy(false);
    setFormOpen(false);
  }

  async function confirmDelete() {
    if (!deletingTask) return;
    setBusy(true);
    await removeTask(deletingTask.id);
    setBusy(false);
    setDeletingTask(null);
  }

  async function toggleActive(task) {
    await editTask(task.id, { active: !task.active });
  }

  if (!topic) {
    return (
      <div>
        <AppHeader title="Topic not found" />
        <main className="px-5 py-10 max-w-3xl mx-auto">
          <EmptyState title="This topic no longer exists" description="It may have been deleted." action={<Button onClick={() => navigate('/app/topics')}>Back to topics</Button>} />
        </main>
      </div>
    );
  }

  return (
    <div>
      <AppHeader title={topic.name} />
      <main className="px-5 py-6 md:px-8 md:py-8 max-w-3xl mx-auto">
        <button onClick={() => navigate('/app/topics')} className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
          <ArrowLeft size={14} /> All topics
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(--color-${topic.color})` }} />
            <p className="text-[13.5px] text-[var(--color-text-muted)]">{topicTasks.length} task{topicTasks.length !== 1 ? 's' : ''} in this topic</p>
          </div>
          <Button icon={Plus} size="sm" onClick={openCreate}>Add task</Button>
        </div>

        {topicTasks.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={ListChecks} title="No tasks here yet" description="Break this topic into a recurring action you can complete daily." action={<Button icon={Plus} onClick={openCreate}>+ Add task</Button>} />
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-2.5">
            {topicTasks.map((task) => (
              <div key={task.id} className={`flex items-center gap-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 ${!task.active ? 'opacity-50' : ''}`}>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-[var(--color-text)] truncate">{task.name}</p>
                  {task.description && <p className="mt-0.5 text-[12.5px] text-[var(--color-text-faint)] truncate">{task.description}</p>}
                  <div className="mt-1.5 flex items-center gap-2 text-[11.5px] text-[var(--color-text-faint)]">
                    <span className="rounded-full bg-[var(--color-surface-3)] px-2 py-0.5">{task.frequency}</span>
                    <span>{xpFor(task)} XP earned total</span>
                    {!task.active && <span className="text-[var(--color-warn)]">Inactive</span>}
                  </div>
                </div>
                <span className="shrink-0 text-[13px] font-semibold tabular text-[var(--color-accent)]">{task.xp} XP</span>
                <Dropdown
                  trigger={
                    <button aria-label={`Options for ${task.name}`} className="text-[var(--color-text-faint)] hover:text-[var(--color-text)] p-1 rounded-md hover:bg-white/5 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  }
                  items={[
                    { label: 'Edit', icon: Pencil, onClick: () => openEdit(task) },
                    { label: task.active ? 'Deactivate' : 'Activate', icon: ListChecks, onClick: () => toggleActive(task) },
                    { divider: true },
                    { label: 'Delete task', icon: Trash2, danger: true, onClick: () => setDeletingTask(task) },
                  ]}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingTask ? 'Edit task' : 'Add task'}>
        <form onSubmit={submitForm} className="flex flex-col gap-4">
          <Input label="Task name" placeholder="e.g. Write for 20 minutes" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoFocus />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Points / XP" type="number" min={0} value={form.xp} onChange={(e) => setForm((f) => ({ ...f, xp: e.target.value }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[var(--color-text-muted)]">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
                className="w-full rounded-[var(--radius-xs)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3.5 py-2.5 text-[14px] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
              >
                {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <Input label="Description (optional)" placeholder="A short note to remind yourself" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="mt-2 flex justify-end gap-2.5">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!form.name.trim() || busy}>{busy ? 'Saving...' : editingTask ? 'Save changes' : 'Add task'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingTask(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} disabled={busy}>{busy ? 'Deleting...' : 'Delete task'}</Button>
          </>
        }
      >
        <p className="text-[14px] text-[var(--color-text-muted)]">
          This permanently deletes "{deletingTask?.name}" and its completion history. This can't be undone.
        </p>
      </Modal>
    </div>
  );
}
