export type StreakEvent =
  | { type: 'goal-met'; streak: number; cardsToday: number }
  | { type: 'milestone'; streak: number }
  | { type: 'streak-broken'; lost: number };

const KEY = 'nihongo_streak_event_v1';
export const WIN_EVENT = 'nihongo-streak-event';

export function setPendingStreakEvent(event: StreakEvent): void {
  localStorage.setItem(KEY, JSON.stringify(event));
  window.dispatchEvent(new Event(WIN_EVENT));
}

export function consumePendingStreakEvent(): StreakEvent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    return JSON.parse(raw) as StreakEvent;
  } catch {
    return null;
  }
}
