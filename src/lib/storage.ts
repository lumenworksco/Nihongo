import type { CardState, SM2CardState } from './srs';
import { convertSM2ToFSRS } from './srs';
import { setPendingStreakEvent } from './streakEvents';

const DECK_KEY_V2 = (id: string) => `nihongo_srs_${id}_v2`;
const DECK_KEY    = (id: string) => `nihongo_srs_${id}_v3`;
export const STREAK_KEY    = 'nihongo_streak_v1';
export const HISTORY_KEY   = 'nihongo_history_v1';
export const SUSPENDED_KEY = 'nihongo_suspended_v1';
const SETTINGS_KEY  = 'nihongo_settings_v1';

// ── SRS deck state ─────────────────────────────────────────────────────────────

// On first load with v3 key, automatically migrate any existing SM2 (v2) data.
export function loadDeckStates(deckId: string): Record<string, CardState> {
  try {
    const v3 = localStorage.getItem(DECK_KEY(deckId));
    if (v3) return JSON.parse(v3);

    // One-time migration: v2 SM2 → v3 FSRS
    const v2 = localStorage.getItem(DECK_KEY_V2(deckId));
    if (!v2) return {};
    const sm2Map: Record<string, SM2CardState> = JSON.parse(v2);
    const migrated: Record<string, CardState> = {};
    for (const [key, sm2] of Object.entries(sm2Map)) {
      migrated[key] = convertSM2ToFSRS(sm2);
    }
    localStorage.setItem(DECK_KEY(deckId), JSON.stringify(migrated));
    localStorage.removeItem(DECK_KEY_V2(deckId));
    return migrated;
  } catch {
    return {};
  }
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

// ── Vocabulary reading pins ────────────────────────────────────────────────────
const VOCAB_PINS_KEY = 'nihongo_vocab_pins';

export function loadVocabPins(): Set<number> {
  try { return new Set<number>(JSON.parse(localStorage.getItem(VOCAB_PINS_KEY) ?? '[]')); }
  catch { return new Set<number>(); }
}

export function pinVocabWord(id: number): void {
  const pins = loadVocabPins();
  pins.add(id);
  localStorage.setItem(VOCAB_PINS_KEY, JSON.stringify([...pins]));
}

export function unpinVocabWord(id: number): void {
  const pins = loadVocabPins();
  pins.delete(id);
  localStorage.setItem(VOCAB_PINS_KEY, JSON.stringify([...pins]));
}

// Reset a deck completely
export function resetDeck(deckId: string): void {
  localStorage.removeItem(DECK_KEY(deckId));
  localStorage.removeItem(DECK_KEY_V2(deckId)); // clean up legacy key if present
}

// Clear all user progress data (called on sign-out). Settings are preserved.
// Only clears nihongo_* keys; Supabase clears its own auth tokens (including
// PKCE code_verifier) via supabase.auth.signOut(). Clearing sb-* keys ourselves
// would wipe any pending code_verifier needed for a concurrent password-reset flow.
export function clearUserData(): void {
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('nihongo_') && k !== SETTINGS_KEY) toRemove.push(k);
  }
  toRemove.forEach(k => localStorage.removeItem(k));
}
