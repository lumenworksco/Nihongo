import { supabase } from './supabase';
import {
  persistDeckStates, saveSettings,
  loadDeckStates, loadStreak, loadHistory, loadSettings, loadSuspended,
  STREAK_KEY, HISTORY_KEY, SUSPENDED_KEY,
  type StreakData, type SessionRecord, type AppSettings,
} from './storage';
import type { CardState } from './srs';

// Map card key prefix → deckId
function deckIdOf(cardKey: string): string {
  if (cardKey.startsWith('v:')) return 'vocabulary';
  if (cardKey.startsWith('g:')) return 'grammar';
  if (cardKey.startsWith('p:')) return 'particles';
  return 'unknown';
}

// ── Pull (Supabase → localStorage) ───────────────────────────────────────────

/** Returns true if the user had any cloud data (false = brand-new account). */
export async function pullUserData(userId: string): Promise<boolean> {
  if (!supabase) return false;

  const [statesRes, streakRes, sessionsRes, settingsRes, suspendedRes] = await Promise.all([
    supabase.from('deck_states').select('*').eq('user_id', userId),
    supabase.from('streaks').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('sessions').select('*').eq('user_id', userId).order('created_at', { ascending: true }).limit(90),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('suspended_cards').select('card_key').eq('user_id', userId),
  ]);

  // Deck states → group by deck, write per-deck localStorage
  if (statesRes.data?.length) {
    const byDeck: Record<string, Record<string, CardState>> = {};
    for (const row of statesRes.data) {
      const deckId = row.deck_id as string;
      if (!byDeck[deckId]) byDeck[deckId] = {};
      byDeck[deckId][row.card_key] = {
        cardKey: row.card_key,
        interval: row.interval_days,
        easeFactor: row.ease_factor,
        repetitions: row.repetitions,
        dueDate: row.due_date,
        lastReview: row.last_review,
      };
    }
    for (const [deckId, states] of Object.entries(byDeck)) {
      persistDeckStates(deckId, states);
    }
  }

  // Streak
  if (streakRes.data) {
    const s = streakRes.data;
    const streak: StreakData = {
      current: s.current_streak,
      longest: s.longest_streak,
      lastStudyDate: s.last_study_date,
      totalDays: s.total_days,
    };
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  }

  // Sessions
  if (sessionsRes.data?.length) {
    const history: SessionRecord[] = sessionsRes.data.map(row => ({
      date: row.study_date,
      timestamp: row.created_at,
      reviewed: row.reviewed,
      ratings: {
        again: row.ratings_again,
        hard: row.ratings_hard,
        good: row.ratings_good,
        easy: row.ratings_easy,
      },
      durationMs: row.duration_ms,
      deck: row.deck,
    }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  // Settings
  if (settingsRes.data) {
    saveSettings({ maxNewCards: settingsRes.data.max_new_cards });
  }

  // Suspended cards
  if (suspendedRes.data?.length) {
    const keys = suspendedRes.data.map(r => r.card_key as string);
    localStorage.setItem(SUSPENDED_KEY, JSON.stringify(keys));
  }

  const hadData =
    (statesRes.data?.length ?? 0) > 0 ||
    !!streakRes.data ||
    (sessionsRes.data?.length ?? 0) > 0;
  return hadData;
}

// Push local data to Supabase (used on first sign-up to migrate anonymous progress)
export async function pushAllLocalData(userId: string): Promise<void> {
  if (!supabase) return;

  const decks = ['vocabulary', 'grammar', 'particles'];
  const stateRows = decks.flatMap(deckId => {
    const states = loadDeckStates(deckId);
    return Object.values(states).map(s => ({
      user_id: userId, card_key: s.cardKey, deck_id: deckId,
      interval_days: s.interval, ease_factor: s.easeFactor,
      repetitions: s.repetitions, due_date: s.dueDate, last_review: s.lastReview,
    }));
  });
  if (stateRows.length) {
    await supabase.from('deck_states').upsert(stateRows, { onConflict: 'user_id,card_key' });
  }

  const streak = loadStreak();
  await supabase.from('streaks').upsert({
    user_id: userId,
    current_streak: streak.current,
    longest_streak: streak.longest,
    last_study_date: streak.lastStudyDate,
    total_days: streak.totalDays,
  }, { onConflict: 'user_id' });

  const history = loadHistory();
  if (history.length) {
    const rows = history.map(s => ({
      user_id: userId, deck: s.deck, reviewed: s.reviewed,
      ratings_again: s.ratings.again, ratings_hard: s.ratings.hard,
      ratings_good: s.ratings.good, ratings_easy: s.ratings.easy,
      duration_ms: s.durationMs, study_date: s.date, created_at: s.timestamp,
    }));
    await supabase.from('sessions').upsert(rows, { onConflict: 'id' });
  }

  const settings = loadSettings();
  await supabase.from('user_settings').upsert(
    { user_id: userId, max_new_cards: settings.maxNewCards },
    { onConflict: 'user_id' },
  );

  const suspended = loadSuspended();
  if (suspended.size) {
    const rows = [...suspended].map(card_key => ({ user_id: userId, card_key }));
    await supabase.from('suspended_cards').upsert(rows, { onConflict: 'user_id,card_key' });
  }
}

// ── Individual push functions (called on each mutation) ───────────────────────

export function pushCardState(userId: string, deckId: string, state: CardState): void {
  if (!supabase) return;
  supabase.from('deck_states').upsert({
    user_id: userId, card_key: state.cardKey, deck_id: deckId,
    interval_days: state.interval, ease_factor: state.easeFactor,
    repetitions: state.repetitions, due_date: state.dueDate, last_review: state.lastReview,
  }, { onConflict: 'user_id,card_key' }).then(() => {});
}

export function pushUndoCardState(userId: string, cardKey: string, prevState: CardState | null): void {
  if (!supabase) return;
  if (prevState === null) {
    supabase.from('deck_states').delete().eq('user_id', userId).eq('card_key', cardKey).then(() => {});
  } else {
    pushCardState(userId, deckIdOf(cardKey), prevState);
  }
}

export function pushStreak(userId: string, streak: StreakData): void {
  if (!supabase) return;
  supabase.from('streaks').upsert({
    user_id: userId,
    current_streak: streak.current,
    longest_streak: streak.longest,
    last_study_date: streak.lastStudyDate,
    total_days: streak.totalDays,
  }, { onConflict: 'user_id' }).then(() => {});
}

export function pushSession(userId: string, session: Omit<SessionRecord, 'date' | 'timestamp'>, date: string, timestamp: number): void {
  if (!supabase) return;
  supabase.from('sessions').insert({
    user_id: userId, deck: session.deck, reviewed: session.reviewed,
    ratings_again: session.ratings.again, ratings_hard: session.ratings.hard,
    ratings_good: session.ratings.good, ratings_easy: session.ratings.easy,
    duration_ms: session.durationMs, study_date: date, created_at: timestamp,
  }).then(() => {});
}

export function pushSettings(userId: string, settings: AppSettings): void {
  if (!supabase) return;
  supabase.from('user_settings').upsert(
    { user_id: userId, max_new_cards: settings.maxNewCards },
    { onConflict: 'user_id' },
  ).then(() => {});
}

export function pushSuspendedSet(userId: string, suspended: Set<string>): void {
  if (!supabase) return;
  // Full replace: delete all then insert current set
  supabase.from('suspended_cards').delete().eq('user_id', userId).then(() => {
    if (suspended.size === 0) return;
    const rows = [...suspended].map(card_key => ({ user_id: userId, card_key }));
    supabase!.from('suspended_cards').insert(rows).then(() => {});
  });
}

export function deleteDeckFromSupabase(userId: string, deckId: string): void {
  if (!supabase) return;
  const prefix = deckId === 'vocabulary' ? 'v:' : deckId === 'grammar' ? 'g:' : 'p:';
  supabase.from('deck_states').delete()
    .eq('user_id', userId)
    .like('card_key', `${prefix}%`)
    .then(() => {});
}
