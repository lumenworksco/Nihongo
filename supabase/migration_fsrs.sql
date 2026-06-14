-- FSRS migration — run this in your Supabase SQL editor BEFORE deploying the new app code.
--
-- This adds a single jsonb column to deck_states to store the full FSRS card state.
-- The existing SM2 columns (interval_days, ease_factor, repetitions) are preserved
-- for rollback safety — do not drop them.
--
-- After running this, deploy the updated app. On first load, each user's existing SM2
-- data is migrated to FSRS client-side and the new column is populated as cards are pushed.

alter table public.deck_states
  add column if not exists fsrs_data jsonb;

-- Optional: index the due date within fsrs_data for server-side queries (not required by the app)
-- create index concurrently if not exists deck_states_fsrs_due
--   on public.deck_states ((fsrs_data->>'due'));
