import { fsrs as createFSRS, createEmptyCard, Rating as FsrsRating, State } from 'ts-fsrs';
import type { Card, Grade } from 'ts-fsrs';

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  cardKey: string;
  due: number;            // ms timestamp
  stability: number;      // FSRS stability (expected days to retain)
  difficulty: number;     // FSRS difficulty (1–10)
  scheduled_days: number; // days until next review
  learning_steps: number; // current learning step index
  reps: number;           // total successful reviews
  lapses: number;         // number of times card was forgotten
  state: 0 | 1 | 2 | 3;  // New | Learning | Review | Relearning
  lastReview: number;     // ms timestamp (0 = never reviewed)
}

// SM2 state shape from v2 storage — used only for one-time migration
export interface SM2CardState {
  cardKey: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  dueDate: number;
  lastReview: number;
}

export interface StudyCard {
  cardKey: string;
  deckId: string;
  direction: 'jp-en' | 'en-jp';
  jpFront?: boolean;
  front: { primary: string; secondary?: string; tag?: string };
  back: { primary: string; secondary?: string; detail?: string; example?: { jp: string; en: string }; breakdown?: { char: string; meanings: string[] }[] };
}

export type CardStatus = 'new' | 'learning' | 'review' | 'scheduled' | 'known';

const f = createFSRS({ enable_fuzz: false });

function ratingToFsrs(r: Rating): Grade {
  switch (r) {
    case 'again': return FsrsRating.Again;
    case 'hard':  return FsrsRating.Hard;
    case 'good':  return FsrsRating.Good;
    case 'easy':  return FsrsRating.Easy;
  }
}

function fsrsToState(card: Card, cardKey: string, reviewedAt: number): CardState {
  return {
    cardKey,
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as 0 | 1 | 2 | 3,
    lastReview: reviewedAt,
  };
}

export function scheduleCard(current: CardState | null, rating: Rating, cardKey: string): CardState {
  const now = new Date();
  const grade = ratingToFsrs(rating);

  const card: Card = current
    ? {
        due: new Date(current.due),
        stability: current.stability,
        difficulty: current.difficulty,
        elapsed_days: 0,
        scheduled_days: current.scheduled_days,
        learning_steps: current.learning_steps,
        reps: current.reps,
        lapses: current.lapses,
        state: current.state as State,
        last_review: current.lastReview ? new Date(current.lastReview) : undefined,
      }
    : createEmptyCard(now);

  const { card: next } = f.next(card, now, grade);
  return fsrsToState(next, cardKey, now.getTime());
}

// One-time migration: convert SM2 CardState (v2) → FSRS CardState (v3).
// Preserves due date so cards don't all flood back at once.
// Stability ≈ SM2 interval; difficulty inverted from ease factor.
export function convertSM2ToFSRS(sm2: SM2CardState): CardState {
  const difficulty = Math.max(1, Math.min(10, 5 - (sm2.easeFactor - 2.5) * 2));
  return {
    cardKey: sm2.cardKey,
    due: sm2.dueDate,
    stability: Math.max(0.5, sm2.interval),
    difficulty,
    scheduled_days: Math.max(1, sm2.interval),
    learning_steps: 0,
    reps: sm2.repetitions,
    lapses: 0,
    state: sm2.repetitions === 0 ? 0 : 2, // New or Review
    lastReview: sm2.lastReview,
  };
}

export function isDue(state: CardState): boolean {
  return Date.now() >= state.due;
}

export function getStatus(state: CardState | undefined): CardStatus {
  if (!state || state.state === 0) return 'new';
  if (state.state === 1 || state.state === 3) return 'learning'; // Learning or Relearning
  // State.Review (2): check interval for 'known', due date for 'review' vs 'scheduled'
  if (state.scheduled_days >= 21) return 'known';
  if (isDue(state)) return 'review';
  return 'scheduled';
}

export const statusMeta: Record<CardStatus, { label: string; color: string }> = {
  new:       { label: 'New',       color: '#60a5fa' },
  learning:  { label: 'Learning',  color: '#f59e0b' },
  review:    { label: 'Review',    color: 'var(--accent)' },
  scheduled: { label: 'Scheduled', color: '#a78bfa' },
  known:     { label: 'Known',     color: '#4ade80' },
};

export function formatDue(state: CardState | undefined): string {
  if (!state || state.state === 0) return 'New';
  const diff = state.due - Date.now();
  if (diff <= 0) return 'Due now';
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs < 24) return `in ${hrs}h`;
  const days = Math.round(diff / 86_400_000);
  return days === 1 ? 'tomorrow' : `in ${days} days`;
}

export function formatInterval(state: CardState | undefined): string {
  if (!state || state.scheduled_days <= 0) return '—';
  return state.scheduled_days === 1 ? '1 day' : `${state.scheduled_days} days`;
}
