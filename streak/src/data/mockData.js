// Mock data models. Shapes here are the contract the future backend must satisfy.
// Nothing about "Study", "Workout" etc is hardcoded into the UI — these are just
// example values a demo user happened to create for themselves.

export const mockUser = {
  id: 'user_1',
  name: 'Luna',
  email: 'luna@example.com',
  avatarInitial: 'L',
  joinedAt: '2026-04-02',
  totalXp: 4260,
  currentStreak: 12,
  longestStreak: 31,
};

// Topics are user-created containers. Order matters (user can reorder).
export const mockTopics = [
  { id: 't1', name: 'Deep Work', color: 'accent', order: 0, createdAt: '2026-04-02' },
  { id: 't2', name: 'Body', color: 'cyan', order: 1, createdAt: '2026-04-03' },
  { id: 't3', name: 'Craft Practice', color: 'good', order: 2, createdAt: '2026-05-11' },
];

// Tasks belong to a topic. `frequency` is a simple recurrence description.
export const mockTasks = [
  { id: 'k1', topicId: 't1', name: 'Two hours, one problem, no tabs', xp: 40, frequency: 'Daily', description: 'Single-threaded focus block, phone in another room.', active: true },
  { id: 'k2', topicId: 't1', name: 'Inbox to zero before noon', xp: 15, frequency: 'Weekdays', description: '', active: true },
  { id: 'k3', topicId: 't2', name: '20 minutes, doesn\u2019t matter what', xp: 20, frequency: 'Daily', description: 'Walk, lift, stretch — anything that moves.', active: true },
  { id: 'k4', topicId: 't2', name: 'Lights out by 11:30', xp: 15, frequency: 'Daily', description: '', active: true },
  { id: 'k5', topicId: 't3', name: 'One page, badly if needed', xp: 25, frequency: 'Daily', description: 'Quantity first. Editing is a different day\u2019s job.', active: true },
  { id: 'k6', topicId: 't3', name: 'Read one piece by someone better', xp: 10, frequency: '3x / week', description: '', active: false },
];

// Completions: one row per (date, taskId) that was marked done.
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const mockCompletions = [
  { date: daysAgo(0), taskId: 'k1' },
  { date: daysAgo(0), taskId: 'k3' },
  { date: daysAgo(1), taskId: 'k1' },
  { date: daysAgo(1), taskId: 'k2' },
  { date: daysAgo(1), taskId: 'k3' },
  { date: daysAgo(1), taskId: 'k4' },
  { date: daysAgo(1), taskId: 'k5' },
  { date: daysAgo(2), taskId: 'k1' },
  { date: daysAgo(2), taskId: 'k3' },
  { date: daysAgo(2), taskId: 'k4' },
  { date: daysAgo(3), taskId: 'k1' },
  { date: daysAgo(3), taskId: 'k2' },
  { date: daysAgo(3), taskId: 'k5' },
  { date: daysAgo(4), taskId: 'k3' },
  { date: daysAgo(4), taskId: 'k4' },
  { date: daysAgo(5), taskId: 'k1' },
  { date: daysAgo(5), taskId: 'k2' },
  { date: daysAgo(5), taskId: 'k3' },
  { date: daysAgo(5), taskId: 'k4' },
  { date: daysAgo(5), taskId: 'k5' },
  { date: daysAgo(6), taskId: 'k1' },
  { date: daysAgo(7), taskId: 'k1' },
  { date: daysAgo(7), taskId: 'k3' },
  { date: daysAgo(8), taskId: 'k1' },
  { date: daysAgo(8), taskId: 'k2' },
  { date: daysAgo(8), taskId: 'k4' },
  { date: daysAgo(9), taskId: 'k5' },
  { date: daysAgo(10), taskId: 'k1' },
  { date: daysAgo(10), taskId: 'k3' },
  { date: daysAgo(10), taskId: 'k4' },
  { date: daysAgo(11), taskId: 'k1' },
  { date: daysAgo(11), taskId: 'k2' },
  { date: daysAgo(11), taskId: 'k3' },
  { date: daysAgo(12), taskId: 'k1' },
  { date: daysAgo(14), taskId: 'k3' },
  { date: daysAgo(15), taskId: 'k1' },
  { date: daysAgo(15), taskId: 'k4' },
  { date: daysAgo(18), taskId: 'k1' },
  { date: daysAgo(18), taskId: 'k2' },
  { date: daysAgo(20), taskId: 'k3' },
  { date: daysAgo(22), taskId: 'k1' },
  { date: daysAgo(22), taskId: 'k4' },
  { date: daysAgo(25), taskId: 'k1' },
];

export const colorTokenMap = {
  accent: { fg: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]', dim: 'bg-[var(--color-accent-dim)]', border: 'border-[var(--color-accent-soft)]' },
  cyan: { fg: 'text-[var(--color-cyan)]', bg: 'bg-[var(--color-cyan)]', dim: 'bg-[#0d2b2d]', border: 'border-[#1d4b4f]' },
  good: { fg: 'text-[var(--color-good)]', bg: 'bg-[var(--color-good)]', dim: 'bg-[#122a1a]', border: 'border-[#1f4a2d]' },
};
