import { useState, useCallback, useMemo } from 'react';
import { vocabulary } from '../data/vocabulary';
import { scheduleCard, isDue, getStatus, type CardState, type Rating, type CardStatus } from '../lib/srs';

const STORAGE_KEY = 'nihongo_srs_v1';
const MAX_NEW_PER_SESSION = 10;

function load(): Record<number, CardState> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function persist(states: Record<number, CardState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

export function useSRS() {
  const [states, setStates] = useState<Record<number, CardState>>(load);

  const rate = useCallback((wordId: number, rating: Rating) => {
    setStates(prev => {
      const next = { ...prev, [wordId]: scheduleCard(prev[wordId] ?? null, rating, wordId) };
      persist(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStates({});
  }, []);

  const stats = useMemo(() => {
    const counts: Record<CardStatus, number> = { new: 0, learning: 0, review: 0, known: 0 };
    vocabulary.forEach(w => counts[getStatus(states[w.id])]++);
    return counts;
  }, [states]);

  // Cards due for study: due reviews first, then new cards (capped)
  const studyQueue = useMemo(() => {
    const reviews = vocabulary.filter(w => {
      const s = states[w.id];
      return s && s.repetitions > 0 && isDue(s);
    });
    const newCards = vocabulary
      .filter(w => !states[w.id])
      .slice(0, MAX_NEW_PER_SESSION);
    const relearning = vocabulary.filter(w => {
      const s = states[w.id];
      return s && s.repetitions === 0 && isDue(s);
    });
    return [...reviews, ...relearning, ...newCards];
  }, [states]);

  return { states, rate, resetAll, stats, studyQueue };
}
