import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';
import { useToast } from './ToastContext';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    const snap = await api.getFullSnapshot();
    setUser(snap.user);
    setTopics([...snap.topics].sort((a, b) => a.order - b.order));
    setTasks(snap.tasks);
    setCompletions(snap.completions);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const today = new Date().toISOString().slice(0, 10);

  const toggleTask = useCallback(async (taskId) => {
    const res = await api.toggleCompletion(taskId);
    setCompletions(res.completions);
    setUser(res.user);
    const task = tasks.find((t) => t.id === taskId);
    if (res.completed && task) toast.push({ type: 'xp', message: `+${task.xp} XP \u2014 ${task.name}` });
    return res.completed;
  }, [tasks, toast]);

  const addTopic = useCallback(async (payload) => {
    const t = await api.createTopic(payload);
    setTopics((prev) => [...prev, t]);
    toast.push({ type: 'success', message: `Topic "${t.name}" created` });
    return t;
  }, [toast]);

  const editTopic = useCallback(async (id, patch) => {
    const t = await api.updateTopic(id, patch);
    setTopics((prev) => prev.map((x) => (x.id === id ? t : x)));
    return t;
  }, []);

  const removeTopic = useCallback(async (id) => {
    await api.deleteTopic(id);
    setTopics((prev) => prev.filter((t) => t.id !== id));
    setTasks((prev) => prev.filter((t) => t.topicId !== id));
    toast.push({ type: 'info', message: 'Topic deleted' });
  }, [toast]);

  const reorderTopics = useCallback(async (orderedIds) => {
    setTopics((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      return orderedIds.map((id) => map.get(id));
    });
    await api.reorderTopics(orderedIds);
  }, []);

  const addTask = useCallback(async (payload) => {
    const t = await api.createTask(payload);
    setTasks((prev) => [...prev, t]);
    toast.push({ type: 'success', message: `Task added to topic` });
    return t;
  }, [toast]);

  const editTask = useCallback(async (id, patch) => {
    const t = await api.updateTask(id, patch);
    setTasks((prev) => prev.map((x) => (x.id === id ? t : x)));
    return t;
  }, []);

  const removeTask = useCallback(async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setCompletions((prev) => prev.filter((c) => c.taskId !== id));
    toast.push({ type: 'info', message: 'Task deleted' });
  }, [toast]);

  const streaks = useMemo(() => api.computeStreaks(completions, tasks), [completions, tasks]);

  const todaysCompletedIds = useMemo(
    () => new Set(completions.filter((c) => c.date === today).map((c) => c.taskId)),
    [completions, today]
  );

  const todaysXp = useMemo(() => {
    return tasks
      .filter((t) => todaysCompletedIds.has(t.id))
      .reduce((sum, t) => sum + t.xp, 0);
  }, [tasks, todaysCompletedIds]);

  const activeTasks = useMemo(() => tasks.filter((t) => t.active), [tasks]);
  const todaysCompletionPct = activeTasks.length
    ? Math.round((activeTasks.filter((t) => todaysCompletedIds.has(t.id)).length / activeTasks.length) * 100)
    : 0;

  const value = {
    loading, user, topics, tasks, completions, today,
    streaks, todaysCompletedIds, todaysXp, todaysCompletionPct, activeTasks,
    refresh, toggleTask,
    addTopic, editTopic, removeTopic, reorderTopics,
    addTask, editTask, removeTask,
    setUser: async (patch) => setUser(await api.updateUser(patch)),
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider');
  return ctx;
}
