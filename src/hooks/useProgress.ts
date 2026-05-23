import { useState, useCallback } from 'react';
import { loadStreak, touchStreak, loadHistory, saveSession, type StreakData, type SessionRecord } from '../lib/storage';

export function useProgress() {
  const [streak, setStreak] = useState<StreakData>(loadStreak);
  const [history, setHistory] = useState<SessionRecord[]>(loadHistory);

  const recordSession = useCallback((
    deck: string,
    reviewed: number,
    ratings: SessionRecord['ratings'],
    durationMs: number,
  ) => {
    saveSession({ deck, reviewed, ratings, durationMs });
    setStreak(touchStreak());
    setHistory(loadHistory());
  }, []);

  return { streak, history, recordSession };
}
