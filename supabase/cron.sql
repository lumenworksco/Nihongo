-- Push notification cron job — run this in your Supabase SQL editor
-- (Database → SQL Editor)
--
-- BEFORE running this SQL:
--   1. pg_cron and pg_net must be enabled (Dashboard → Database → Extensions)
--   2. Deploy the Edge Function: supabase functions deploy send-push
--   3. Replace YOUR_SERVICE_ROLE_KEY below with your service role key
--      (Project Settings → API → service_role — never commit this value)
--
-- MIGRATION: add the freeze column if you haven't already
--   alter table public.streaks add column if not exists freezes_available integer not null default 0;

-- Remove the old daily job if it exists (safe no-op if already gone)
do $$
begin
  perform cron.unschedule('daily-streak-reminder');
exception when others then null;
end;
$$;

-- Remove any previous version of the hourly job so this is idempotent
do $$
begin
  perform cron.unschedule('hourly-streak-reminder');
exception when others then null;
end;
$$;

-- Schedule hourly (the Edge Function handles per-user timing —
-- each user is notified at exactly the UTC hour they typically study)
select cron.schedule(
  'hourly-streak-reminder',
  '0 * * * *',
  $$
  select net.http_post(
    url     => 'https://nixuohfgrbvikkrdfmib.supabase.co/functions/v1/send-push',
    headers => jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body    => '{}'::jsonb
  );
  $$
);

-- Verify: select * from cron.job where jobname = 'hourly-streak-reminder';
-- Remove:  do $$ begin perform cron.unschedule('hourly-streak-reminder'); exception when others then null; end; $$;
