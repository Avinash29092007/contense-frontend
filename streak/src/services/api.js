// ─────────────────────────────────────────────────────────────────────────
// SERVICE LAYER
// ─────────────────────────────────────────────────────────────────────────
// Every function here returns a Promise and has a signature shaped like a
// real HTTP call, on purpose. When a backend exists, each function body
// becomes a `fetch(...)` / API-client call instead of a localStorage
// read-write, and nothing above this file (components, pages, hooks) has
// to change. This is the ONLY file that should know mock data exists.
// ─────────────────────────────────────────────────────────────────────────

import { mockUser, mockTopics, mockTasks, mockCompletions } from '../data/mockData';

const STORE_KEY = 'cadence_store_v1';
const LATENCY = 220; // simulated network latency, kept short & consistent

function seedStore() {
  return {
    user: mockUser,
    topics: mockTopics,
    tasks: mockTasks,
    completions: mockCompletions,
    onboarded: true,
  };
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const seeded = seedStore();
      localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return seedStore();
  }
}

function writeStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
  return store;
}

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Auth (mocked — always "succeeds") ──────────────────────────────────
export async function login(_credentials) {
  const store = readStore();
  return delay({ user: store.user, token: 'mock-token' });
}

export async function register(_details) {
  const store = readStore();
  store.onboarded = false;
  writeStore(store);
  return delay({ user: store.user, token: 'mock-token' });
}

export async function requestPasswordReset(_email) {
  return delay({ sent: true });
}

export async function completeOnboarding({ topicName, taskName }) {
  const store = readStore();
  if (topicName) {
    const topic = { id: uid('t'), name: topicName, color: 'accent', order: store.topics.length, createdAt: today() };
    store.topics.push(topic);
    if (taskName) {
      store.tasks.push({ id: uid('k'), topicId: topic.id, name: taskName, xp: 20, frequency: 'Daily', description: '', active: true });
    }
  }
  store.onboarded = true;
  writeStore(store);
  return delay({ ok: true });
}

export async function getOnboardingStatus() {
  const store = readStore();
  return delay(store.onboarded);
}

// ── User ────────────────────────────────────────────────────────────────
export async function getUser() {
  return delay(readStore().user);
}

export async function updateUser(patch) {
  const store = readStore();
  store.user = { ...store.user, ...patch };
  writeStore(store);
  return delay(store.user);
}

// ── Topics ──────────────────────────────────────────────────────────────
export async function getTopics() {
  const store = readStore();
  return delay([...store.topics].sort((a, b) => a.order - b.order));
}

export async function createTopic({ name, color = 'accent' }) {
  const store = readStore();
  const topic = { id: uid('t'), name, color, order: store.topics.length, createdAt: today() };
  store.topics.push(topic);
  writeStore(store);
  return delay(topic);
}

export async function updateTopic(id, patch) {
  const store = readStore();
  store.topics = store.topics.map((t) => (t.id === id ? { ...t, ...patch } : t));
  writeStore(store);
  return delay(store.topics.find((t) => t.id === id));
}

export async function reorderTopics(orderedIds) {
  const store = readStore();
  store.topics = store.topics.map((t) => ({ ...t, order: orderedIds.indexOf(t.id) }));
  writeStore(store);
  return delay(store.topics);
}

export async function deleteTopic(id) {
  const store = readStore();
  store.topics = store.topics.filter((t) => t.id !== id);
  store.tasks = store.tasks.filter((t) => t.topicId !== id);
  writeStore(store);
  return delay({ ok: true });
}

// ── Tasks ───────────────────────────────────────────────────────────────
export async function getTasks() {
  return delay(readStore().tasks);
}

export async function createTask({ topicId, name, xp, frequency, description }) {
  const store = readStore();
  const task = { id: uid('k'), topicId, name, xp: Number(xp) || 10, frequency: frequency || 'Daily', description: description || '', active: true };
  store.tasks.push(task);
  writeStore(store);
  return delay(task);
}

export async function updateTask(id, patch) {
  const store = readStore();
  store.tasks = store.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
  writeStore(store);
  return delay(store.tasks.find((t) => t.id === id));
}

export async function deleteTask(id) {
  const store = readStore();
  store.tasks = store.tasks.filter((t) => t.id !== id);
  store.completions = store.completions.filter((c) => c.taskId !== id);
  writeStore(store);
  return delay({ ok: true });
}

// ── Completions ─────────────────────────────────────────────────────────
export async function getCompletions() {
  return delay(readStore().completions);
}

export async function toggleCompletion(taskId, date = today()) {
  const store = readStore();
  const exists = store.completions.some((c) => c.taskId === taskId && c.date === date);
  let xpDelta = 0;
  const task = store.tasks.find((t) => t.id === taskId);
  if (exists) {
    store.completions = store.completions.filter((c) => !(c.taskId === taskId && c.date === date));
    xpDelta = -(task?.xp || 0);
  } else {
    store.completions.push({ taskId, date });
    xpDelta = task?.xp || 0;
  }
  store.user = { ...store.user, totalXp: Math.max(0, store.user.totalXp + xpDelta) };
  writeStore(store);
  return delay({ completed: !exists, completions: store.completions, user: store.user });
}

// ── Derived / read-model helpers (would likely be server-computed later) ─
export async function getFullSnapshot() {
  const store = readStore();
  return delay(store);
}

export function computeStreaks(completions, tasks) {
  const activeTaskIds = new Set(tasks.filter((t) => t.active).length ? tasks.filter((t) => t.active).map((t) => t.id) : tasks.map((t) => t.id));
  const byDate = {};
  completions.forEach((c) => {
    if (!byDate[c.date]) byDate[c.date] = new Set();
    byDate[c.date].add(c.taskId);
  });
  const daysWithActivity = Object.keys(byDate).filter((d) => byDate[d].size > 0).sort();
  let longest = 0, run = 0, prev = null;
  daysWithActivity.forEach((d) => {
    if (prev) {
      const diff = (new Date(d) - new Date(prev)) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  });
  // current streak: walk back from today
  let current = 0;
  let cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (byDate[key] && byDate[key].size > 0) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (key === today()) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    } else {
      break;
    }
  }
  return { current, longest: Math.max(longest, current) };
}
