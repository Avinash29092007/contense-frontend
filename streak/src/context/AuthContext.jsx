import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);
const SESSION_KEY = 'cadence_session_v1';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) setSession(JSON.parse(raw));
    setReady(true);
  }, []);

  const signIn = useCallback(async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem(SESSION_KEY, JSON.stringify(res));
    setSession(res);
    return res;
  }, []);

  const signUp = useCallback(async (details) => {
    const res = await api.register(details);
    localStorage.setItem(SESSION_KEY, JSON.stringify(res));
    setSession(res);
    return res;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, ready, isAuthed: !!session, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
