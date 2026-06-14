import type { CardState } from './srs';
import { setPendingStreakEvent } from './streakEvents';

const DECK_KEY         = (id: string) => `nihongo_srs_${id}_v2`;
export const STREAK_KEY    = 'nihongo_streak_v1';
export const HISTORY_KEY   = 'nihongo_history_v1';
export const SUSPENDED_KEY = 'nihongo_suspended_v1';
const SETTINGS_KEY  = 'nihongo_settings_v1';

// ── SRS deck state ─────────────────────────────────────────────────────────────

export function loadDeckStates(deckId: string): Record<string, CardState> {
  try { return JSON.parse(localStorage.getItem(DECK_KEY(deckId)) ?? '{}'); }
  catch { return {}; }
}

export function persistDeckStates(deckId: string, all: Record<string, CardState>) {
  localStorage.setItem(DECK_KEY(deckId), JSON.stringify(all));
}

// ── Streak ─────────────────────────────────────────────────────────────────────

export interface StreakData {
  current: number;
  longest: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  totalDays: number;
  freezesAvailable: number; // earned every 7 days, max 3, auto-consumed on missed days
}

function todayStr(): string { return new Date().toISOString().slice(0, 10); }
function yesterdayStr(): string {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const defaultStreak: StreakData = { current: 0, longest: 0, lastStudyDate: null, totalDays: 0, freezesAvailable: 0 };

export function loadStreak(): StreakData {
  try {
    const stored = JSON.parse(localStorage.getItem(STREAK_KEY) ?? 'null');
    return stored ? { ...defaultStreak, ...stored } : defaultStreak;
  } catch {
    return defaultStreak;
  }
}

export function getDailyCardsReviewed(history: SessionRecord[]): number {
  const today = todayStr();
  return history.filter(s => s.date === today).reduce((sum, s) => sum + s.reviewed, 0);
}

// dailyGoal is the single threshold: streak advances only when today's total hits the goal
export function touchStreak(dailyGoal: number): StreakData {
  const todayTotal = getDailyCardsReviewed(loadHistory());
  if (todayTotal < dailyGoal) return loadStreak();

  const s = loadStreak();
  const t = todayStr();
  if (s.lastStudyDate === t) return s; // already advanced today

  const continued = s.lastStudyDate === yesterdayStr();
  const newCurrent = continued ? s.current + 1 : 1;

  // Award 1 freeze at every 7-day multiple, max 3 banked
  const currentFreezes = s.freezesAvailable ?? 0;
  const earnedFreeze = newCurrent % 7 === 0 && currentFreezes < 3;

  const next: StreakData = {
    current: newCurrent,
    longest: Math.max(s.longest, newCurrent),
    lastStudyDate: t,
    totalDays: s.totalDays + 1,
    freezesAvailable: earnedFreeze ? currentFreezes + 1 : currentFreezes,
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}

// Run on app load: auto-consume a freeze or zero out a stale streak
export function reconcileStreak(): void {
  const s = loadStreak();
  if (s.current === 0 || s.lastStudyDate === null) return;
  const t = todayStr();
  const y = yesterdayStr();
  if (s.lastStudyDate === t || s.lastStudyDate === y) return;

  // Missed at least one day — try to consume a freeze
  const freezes = s.freezesAvailable ?? 0;
  if (freezes > 0) {
    // Freeze consumed: set lastStudyDate = yesterday so streak looks maintained.
    // Next day if they miss again, another freeze is consumed (one per missed day).
    const freezesLeft = freezes - 1;
    localStorage.setItem(STREAK_KEY, JSON.stringify({ ...s, freezesAvailable: freezesLeft, lastStudyDate: y }));
    setPendingStreakEvent({ type: 'streak-frozen', preserved: s.current, freezesLeft });
    return;
  }

  // No freeze available — streak breaks
  setPendingStreakEvent({ type: 'streak-broken', lost: s.current });
  localStorage.setItem(STREAK_KEY, JSON.stringify({ ...s, current: 0, freezesAvailable: 0 }));
}

// ── Session history ────────────────────────────────────────────────────────────

export interface SessionRecord {
  date: string;        // YYYY-MM-DD
  timestamp: number;
  reviewed: number;
  ratings: { again: number; hard: number; good: number; easy: number };
  durationMs: number;
  deck: string;
}

export function loadHistory(): SessionRecord[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]'); }
  catch { return []; }
}

export function saveSession(session: Omit<SessionRecord, 'date' | 'timestamp'>) {
  const history = loadHistory();
  history.push({ ...session, date: todayStr(), timestamp: Date.now() });
  if (history.length > 90) history.splice(0, history.length - 90);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ── Settings ───────────────────────────────────────────────────────────────────

export interface AppSettings {
  maxNewCards: number;
  dailyGoal: number;
}

const DEFAULT_SETTINGS: AppSettings = { maxNewCards: 10, dailyGoal: 10 };

export function loadSettings(): AppSettings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// ── Suspended cards ────────────────────────────────────────────────────────────

export function loadSuspended(): Set<string> {
  try { return new Set<string>(JSON.parse(localStorage.getItem(SUSPENDED_KEY) ?? '[]')); }
  catch { return new Set<string>(); }
}

export function persistSuspended(suspended: Set<string>): void {
  localStorage.setItem(SUSPENDED_KEY, JSON.stringify([...suspended]));
}

// Reset a deck completely
export function resetDeck(deckId: string): void {
  localStorage.removeItem(DECK_KEY(deckId));
}
