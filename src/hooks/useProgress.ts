import { useState, useCallback } from 'react';
import {
  loadStreak, touchStreak, loadHistory, saveSession, loadSettings, getDailyCardsReviewed,
  type StreakData, type SessionRecord,
} from '../lib/storage';
import { pushSession, pushStreak } from '../lib/sync';
import { setPendingStreakEvent } from '../lib/streakEvents';
import { useAuth } from '../contexts/AuthContext';

const MILESTONES = [7, 30, 100, 365];

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
    const { dailyGoal } = loadSettings();
    const dailyBefore = getDailyCardsReviewed(loadHistory());

    const date      = new Date().toISOString().slice(0, 10);
    const timestamp = Date.now();
    saveSession({ deck, reviewed, ratings, durationMs });

    const newStreak  = touchStreak(dailyGoal);
    const newHistory = loadHistory();
    const dailyAfter = getDailyCardsReviewed(newHistory);

    setStreak(newStreak);
    setHistory(newHistory);

    // Fire streak events — milestone takes priority over goal-met
    const milestoneHit = MILESTONES.find(m => newStreak.current === m);
    const goalNewlyMet = dailyBefore < dailyGoal && dailyAfter >= dailyGoal;

    if (milestoneHit) {
      setPendingStreakEvent({ type: 'milestone', streak: milestoneHit });
    } else if (goalNewlyMet) {
      setPendingStreakEvent({ type: 'goal-met', streak: newStreak.current, cardsToday: dailyAfter });
    }

    if (user) {
      pushSession(user.id, { deck, reviewed, ratings, durationMs }, date, timestamp);
      pushStreak(user.id, newStreak);
    }
  }, [user]);

  return { streak, history, recordSession };
}
