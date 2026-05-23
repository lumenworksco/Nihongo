import { useState, useCallback, useMemo } from 'react';
import { scheduleCard, isDue, getStatus, type Rating, type CardState, type StudyCard, type CardStatus } from '../lib/srs';
import { loadDeckStates, persistDeckStates } from '../lib/storage';

const MAX_NEW = 10;

export type DeckStats = Record<CardStatus, number>;

export function useDeck(deckId: string, allCards: StudyCard[], bidirectional: boolean) {
  const [states, setStates] = useState<Record<string, CardState>>(() => loadDeckStates(deckId));

  const activeCards = useMemo(
    () => bidirectional ? allCards : allCards.filter(c => c.direction === 'jp-en'),
    [allCards, bidirectional],
  );

  const studyQueue = useMemo(() => {
    const due = activeCards.filter(c => { const s = states[c.cardKey]; return s && isDue(s); });
    const fresh = activeCards.filter(c => !states[c.cardKey]).slice(0, MAX_NEW);
    return [...due, ...fresh];
  }, [activeCards, states]);

  const stats = useMemo<DeckStats>(() => {
    const counts: DeckStats = { new: 0, learning: 0, review: 0, known: 0 };
    activeCards.forEach(c => counts[getStatus(states[c.cardKey])]++);
    return counts;
  }, [activeCards, states]);

  // Returns the previous state so the caller can undo if needed
  const rate = useCallback((cardKey: string, rating: Rating): CardState | null => {
    const prev = states[cardKey] ?? null;
    const next = scheduleCard(prev, rating, cardKey);
    setStates(s => {
      const updated = { ...s, [cardKey]: next };
      persistDeckStates(deckId, updated);
      return updated;
    });
    return prev;
  }, [deckId, states]);

  const undoCard = useCallback((cardKey: string, prevState: CardState | null) => {
    setStates(s => {
      const updated = { ...s };
      if (prevState === null) delete updated[cardKey];
      else updated[cardKey] = prevState;
      persistDeckStates(deckId, updated);
      return updated;
    });
  }, [deckId]);

  return { states, rate, undoCard, studyQueue, stats, activeCards };
}
