-- Nihongo SRS — Supabase schema
-- Run this in your Supabase project's SQL editor (Database → SQL Editor)

-- ── Tables ────────────────────────────────────────────────────────────────────

create table public.deck_states (
  user_id    uuid    not null references auth.users(id) on delete cascade,
  card_key   text    not null,
  deck_id    text    not null,
  interval_days  integer not null default 1,
  ease_factor    real    not null default 2.5,
  repetitions    integer not null default 0,
  due_date   bigint  not null,
  last_review bigint not null,
  primary key (user_id, card_key)
);

create table public.streaks (
  user_id         uuid    not null references auth.users(id) on delete cascade primary key,
  current_streak  integer not null default 0,
  longest_streak  integer not null default 0,
  last_study_date text,
  total_days      integer not null default 0
);

create table public.sessions (
  id            uuid    not null default gen_random_uuid() primary key,
  user_id       uuid    not null references auth.users(id) on delete cascade,
  deck          text    not null,
  reviewed      integer not null,
  ratings_again integer not null default 0,
  ratings_hard  integer not null default 0,
  ratings_good  integer not null default 0,
  ratings_easy  integer not null default 0,
  duration_ms   integer not null,
  study_date    text    not null,
  created_at    bigint  not null
);

create table public.user_settings (
  user_id       uuid    not null references auth.users(id) on delete cascade primary key,
  max_new_cards integer not null default 10
);

create table public.suspended_cards (
  user_id  uuid not null references auth.users(id) on delete cascade,
  card_key text not null,
  primary key (user_id, card_key)
);

-- ── Row-level security ────────────────────────────────────────────────────────

alter table public.deck_states     enable row level security;
alter table public.streaks         enable row level security;
alter table public.sessions        enable row level security;
alter table public.user_settings   enable row level security;
alter table public.suspended_cards enable row level security;

create policy "own deck_states"     on public.deck_states     for all using (auth.uid() = user_id);
create policy "own streaks"         on public.streaks          for all using (auth.uid() = user_id);
create policy "own sessions"        on public.sessions         for all using (auth.uid() = user_id);
create policy "own user_settings"   on public.user_settings    for all using (auth.uid() = user_id);
create policy "own suspended_cards" on public.suspended_cards  for all using (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index sessions_user_created on public.sessions(user_id, created_at desc);
create index deck_states_user_deck  on public.deck_states(user_id, deck_id);
