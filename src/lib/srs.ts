export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  cardKey: string;
  interval: number;     // days
  easeFactor: number;   // multiplier, min 1.3
  repetitions: number;  // consecutive successful reviews
  dueDate: number;      // ms timestamp
  lastReview: number;   // ms timestamp
}

export interface StudyCard {
  cardKey: string;
  deckId: string;
  direction: 'jp-en' | 'en-jp';
  front: { primary: string; secondary?: string; tag?: string };
  back: { primary: string; secondary?: string; detail?: string; example?: { jp: string; en: string } };
}

export type CardStatus = 'new' | 'learning' | 'review' | 'known';

const MIN_EASE = 1.3;
const DAY = 86_400_000;

export function scheduleCard(current: CardState | null, rating: Rating, cardKey: string): CardState {
  const now = Date.now();
  if (!current) {
    const interval = rating === 'easy' ? 4 : 1;
    return { cardKey, interval, easeFactor: rating === 'easy' ? 2.65 : 2.5, repetitions: rating === 'again' ? 0 : 1, dueDate: now + interval * DAY, lastReview: now };
  }
  let { interval, easeFactor, repetitions } = current;
  switch (rating) {
    case 'again':
      return { cardKey, lastReview: now, interval: 1, easeFactor: Math.max(MIN_EASE, easeFactor - 0.2), repetitions: 0, dueDate: now + DAY };
    case 'hard': {
      const ni = Math.max(1, Math.round(interval * 1.2));
      return { cardKey, interval: ni, easeFactor: Math.max(MIN_EASE, easeFactor - 0.15), repetitions, dueDate: now + ni * DAY, lastReview: now };
    }
    case 'good': {
      const ni = repetitions === 0 ? 1 : repetitions === 1 ? 4 : Math.max(interval + 1, Math.round(interval * easeFactor));
      return { cardKey, interval: ni, easeFactor, repetitions: repetitions + 1, dueDate: now + ni * DAY, lastReview: now };
    }
    case 'easy': {
      const ni = repetitions === 0 ? 4 : repetitions === 1 ? 7 : Math.max(interval + 1, Math.round(interval * easeFactor * 1.3));
      return { cardKey, interval: ni, easeFactor: Math.min(3.5, easeFactor + 0.15), repetitions: repetitions + 1, dueDate: now + ni * DAY, lastReview: now };
    }
  }
}

export function isDue(state: CardState): boolean {
  return Date.now() >= state.dueDate;
}

export function getStatus(state: CardState | undefined): CardStatus {
  if (!state) return 'new';
  if (state.repetitions === 0) return 'learning';
  if (state.interval >= 21) return 'known';
  if (isDue(state)) return 'review';
  return 'known';
}

export const statusMeta: Record<CardStatus, { label: string; color: string }> = {
  new:      { label: 'New',      color: '#60a5fa' },
  learning: { label: 'Learning', color: '#f59e0b' },
  review:   { label: 'Review',   color: 'var(--accent)' },
  known:    { label: 'Known',    color: '#4ade80' },
};
