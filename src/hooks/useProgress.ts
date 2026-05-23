import { useState, useCallback } from 'react';
import { loadStreak, touchStreak, loadHistory, saveSession, type StreakData, type SessionRecord } from '../lib/storage';
import { pushSession, pushStreak } from '../lib/sync';
import { useAuth } from '../contexts/AuthContext';

export function useProgress() {
  const { user } = useAuth();
  const [streak, setStreak]   = useState<StreakData>(loadStreak);
  const [history, setHistory] = useState<SessionRecord[]>(loadHistory);

  const recordSession = useCallback((
    deck: string,
    reviewed: number,
    ratings: SessionRecord['ratings'],
    durationMs: number,
  ) => {
    const date      = new Date().toISOString().slice(0, 10);
    const timestamp = Date.now();
    saveSession({ deck, reviewed, ratings, durationMs });
    const newStreak  = touchStreak();
    const newHistory = loadHistory();
    setStreak(newStreak);
    setHistory(newHistory);
    if (user) {
      pushSession(user.id, { deck, reviewed, ratings, durationMs }, date, timestamp);
      pushStreak(user.id, newStreak);
    }
  }, [user]);

  return { streak, history, recordSession };
}
