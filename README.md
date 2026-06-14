# Nihongo — Japanese Learning PWA

A full-featured, offline-first Japanese learning app built as a Progressive Web App. Covers the JLPT N5 curriculum with spaced-repetition flashcards, grammar reference, kana charts, kanji, reading practice, and mock exams.

## Features

- **Spaced Repetition (SRS)** — FSRS algorithm (via `ts-fsrs`) across Vocabulary (720 words), Grammar (39 points), Particles, Kana (104 characters), and Kanji (83 characters); existing SM2 progress auto-migrates on first load
- **Streak system** — Duolingo-style daily streaks with freeze shields (earned every 7 days, max 3), milestone celebrations, and animated modals
- **Push notifications** — Personalized timing based on each user's historical study hour; escalating copy; milestone-tomorrow detection
- **Progress analytics** — Activity heatmap, 14-day review forecast, per-deck accuracy, and card status breakdown
- **Mock exams** — Timed JLPT N5-style exam generator
- **Reading practice** — Graded reading passages
- **Offline-first** — All study data lives in `localStorage`; full SRS works with no connection
- **Cloud sync** — Supabase auth + PostgreSQL backs up streaks and session history; anonymous progress migrates on sign-in
- **PWA** — Installable, service-worker cached, Web Push subscriptions

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite + VitePWA (injectManifest) |
| Service worker | Workbox (precache + navigation route) |
| Styling | Tailwind CSS |
| SRS | ts-fsrs (FSRS algorithm) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Routing | React Router v7 |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Push | Web Push API / VAPID via `web-push` on Deno |
| Scheduling | pg_cron + pg_net (hourly, per-user timing) |

## Project Structure

```
src/
  components/       # Sidebar, StreakModal, StudySession
  contexts/         # AuthContext (Supabase session)
  data/             # Static JLPT N5 content (vocab, grammar, kana, kanji, ...)
  hooks/            # useProgress (SRS + streak integration)
  lib/
    srs.ts          # SM2 scheduler
    storage.ts      # localStorage read/write, streak logic, reconcileStreak
    streakEvents.ts # Cross-component streak event bus
    sync.ts         # Supabase push/pull for streaks and sessions
    notifications.ts# Web Push subscription management
    studyCards.ts   # Builds study queues from deck data + SRS state
  pages/            # Home, Vocabulary, Grammar, Kana, Kanji, Particles,
                    #   CLT, Reading, Exam, Stats, Settings, Auth
  sw.ts             # Custom Workbox service worker (push + notificationclick)
  App.tsx           # Route shell, auth effect, reconcileStreak on load
supabase/
  schema.sql        # streaks, sessions, push_subscriptions tables + RLS
  cron.sql          # Hourly pg_cron job setup
  functions/
    send-push/      # Deno Edge Function — personalized push dispatch
```

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase + VAPID keys
npm run dev
```

### Environment variables (`.env.local`)

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_VAPID_PUBLIC_KEY=<vapid-public-key>
```

### Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built PWA locally
```

### Type check

```bash
npx tsc -b
```

## Supabase Setup

1. Enable **pg_cron** and **pg_net** extensions (Dashboard → Database → Extensions).
2. Run `supabase/schema.sql` to create tables and RLS policies.
3. Run `supabase/migration_fsrs.sql` to add the `fsrs_data` column (needed before deploying the FSRS upgrade).
4. Run `supabase/cron.sql` (replace `YOUR_SERVICE_ROLE_KEY`) to schedule the hourly push job.
4. Set Edge Function secrets:
   ```bash
   supabase secrets set VAPID_PUBLIC_KEY=<key> VAPID_PRIVATE_KEY=<key>
   ```
5. Deploy the Edge Function:
   ```bash
   supabase functions deploy send-push
   ```

## Push Notifications

The Edge Function runs hourly. For each user with an active streak who hasn't studied today, it computes their preferred study hour from the last 14 days of sessions and sends a notification only at that exact UTC hour — one notification per user per day. Copy escalates from gentle morning reminders to progressively more urgent late-night warnings. Stale (410 Gone) subscriptions are auto-pruned.

> **iOS note:** Web Push on iOS requires the user to add the app to their home screen and iOS 16.4+.

## License

MIT — see [LICENSE](LICENSE).
