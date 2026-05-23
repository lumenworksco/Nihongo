import { useState, useCallback, useMemo } from 'react';
import { scheduleCard, isDue, getStatus, type Rating, type CardState, type StudyCard, type CardStatus } from '../lib/srs';
import { loadDeckStates, persistDeckStates, loadSuspended, persistSuspended } from '../lib/storage';
import { pushCardState, pushUndoCardState, pushSuspendedSet } from '../lib/sync';
import { useAuth } from '../contexts/AuthContext';

export type DeckStats = Record<CardStatus, number>;

export function useDeck(
  deckId: string,
  allCards: StudyCard[],
  bidirectional: boolean,
  maxNew: number = 10,
) {
  const { user } = useAuth();

  const [states, setStates]       = useState<Record<string, CardState>>(() => loadDeckStates(deckId));
  const [suspended, setSuspended] = useState<Set<string>>(() => loadSuspended());

  const activeCards = useMemo(
    () =>
      (bidirectional ? allCards : allCards.filter(c => c.direction === 'jp-en'))
        .filter(c => !suspended.has(c.cardKey)),
    [allCards, bidirectional, suspended],
  );

  const studyQueue = useMemo(() => {
    const due   = activeCards.filter(c => { const s = states[c.cardKey]; return s && isDue(s); });
    const fresh = activeCards.filter(c => !states[c.cardKey]).slice(0, maxNew);
    return [...due, ...fresh];
  }, [activeCards, states, maxNew]);

  const stats = useMemo<DeckStats>(() => {
    const counts: DeckStats = { new: 0, learning: 0, review: 0, known: 0 };
    activeCards.forEach(c => counts[getStatus(states[c.cardKey])]++);
    return counts;
  }, [activeCards, states]);

  const rate = useCallback((cardKey: string, rating: Rating): CardState | null => {
    const prev = states[cardKey] ?? null;
    const next = scheduleCard(prev, rating, cardKey);
    setStates(s => {
      const updated = { ...s, [cardKey]: next };
      persistDeckStates(deckId, updated);
      if (user) pushCardState(user.id, deckId, next);
      return updated;
    });
    return prev;
  }, [deckId, states, user]);

  const undoCard = useCallback((cardKey: string, prevState: CardState | null) => {
    setStates(s => {
      const updated = { ...s };
      if (prevState === null) delete updated[cardKey];
      else updated[cardKey] = prevState;
      persistDeckStates(deckId, updated);
      if (user) pushUndoCardState(user.id, cardKey, prevState);
      return updated;
    });
  }, [deckId, user]);

  const toggleSuspend = useCallback((cardKey: string) => {
    setSuspended(prev => {
      const next = new Set(prev);
      if (next.has(cardKey)) next.delete(cardKey);
      else next.add(cardKey);
      persistSuspended(next);
      if (user) pushSuspendedSet(user.id, next);
      return next;
    });
  }, [user]);

  return { states, rate, undoCard, studyQueue, stats, activeCards, suspended, toggleSuspend };
}
