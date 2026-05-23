export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  wordId: number;
  interval: number;     // days until next review
  easeFactor: number;   // multiplier, starts at 2.5
  repetitions: number;  // consecutive successful reviews
  dueDate: number;      // ms timestamp
  lastReview: number;   // ms timestamp
}

export type CardStatus = 'new' | 'learning' | 'review' | 'known';

const MIN_EASE = 1.3;
const DAY = 86_400_000;

export function scheduleCard(current: CardState | null, rating: Rating, wordId: number): CardState {
  const now = Date.now();

  if (!current) {
    // First time seeing this card
    const interval = rating === 'easy' ? 4 : 1;
    return {
      wordId,
      interval,
      easeFactor: rating === 'easy' ? 2.65 : 2.5,
      repetitions: rating === 'again' ? 0 : 1,
      dueDate: now + interval * DAY,
      lastReview: now,
    };
  }

  let { interval, easeFactor, repetitions } = current;

  switch (rating) {
    case 'again':
      return {
        wordId, lastReview: now,
        interval: 1,
        easeFactor: Math.max(MIN_EASE, easeFactor - 0.2),
        repetitions: 0,
        dueDate: now + DAY,
      };

    case 'hard':
      interval = Math.max(1, Math.round(interval * 1.2));
      easeFactor = Math.max(MIN_EASE, easeFactor - 0.15);
      return { wordId, interval, easeFactor, repetitions, dueDate: now + interval * DAY, lastReview: now };

    case 'good':
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 4;
      else interval = Math.max(interval + 1, Math.round(interval * easeFactor));
      repetitions++;
      return { wordId, interval, easeFactor, repetitions, dueDate: now + interval * DAY, lastReview: now };

    case 'easy':
      if (repetitions === 0) interval = 4;
      else if (repetitions === 1) interval = 7;
      else interval = Math.max(interval + 1, Math.round(interval * easeFactor * 1.3));
      repetitions++;
      easeFactor = Math.min(3.5, easeFactor + 0.15);
      return { wordId, interval, easeFactor, repetitions, dueDate: now + interval * DAY, lastReview: now };
  }
}

export function isDue(state: CardState): boolean {
  return Date.now() >= state.dueDate;
}

export function getStatus(state: CardState | undefined): CardStatus {
  if (!state) return 'new';
  if (state.repetitions === 0) return 'learning';
  if (isDue(state)) return 'review';
  if (state.interval >= 21) return 'known';
  return 'review';
}

export const statusMeta: Record<CardStatus, { label: string; color: string }> = {
  new:      { label: 'New',      color: '#60a5fa' },
  learning: { label: 'Learning', color: '#f59e0b' },
  review:   { label: 'Review',   color: 'var(--accent)' },
  known:    { label: 'Known',    color: '#4ade80' },
};
