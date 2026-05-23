import type { CardState } from './srs';

const DECK_KEY = (id: string) => `nihongo_srs_${id}_v2`;
const STREAK_KEY = 'nihongo_streak_v1';
const HISTORY_KEY = 'nihongo_history_v1';

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
}

function todayStr(): string { return new Date().toISOString().slice(0, 10); }
function yesterdayStr(): string {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const defaultStreak: StreakData = { current: 0, longest: 0, lastStudyDate: null, totalDays: 0 };

export function loadStreak(): StreakData {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) ?? 'null') ?? defaultStreak; }
  catch { return defaultStreak; }
}

export function touchStreak(): StreakData {
  const s = loadStreak();
  const t = todayStr();
  if (s.lastStudyDate === t) return s;
  const continued = s.lastStudyDate === yesterdayStr();
  const next: StreakData = {
    current: continued ? s.current + 1 : 1,
    longest: Math.max(s.longest, continued ? s.current + 1 : 1),
    lastStudyDate: t,
    totalDays: s.totalDays + 1,
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
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
