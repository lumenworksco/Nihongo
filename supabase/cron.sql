-- Push notification cron job — run this in your Supabase SQL editor
-- (Database → SQL Editor)
--
-- Prerequisites:
--   1. pg_net extension must be enabled (Extensions → pg_net in the Supabase dashboard)
--   2. pg_cron extension must be enabled (Extensions → pg_cron)
--   3. The send-push Edge Function must be deployed
--   4. Replace YOUR_SERVICE_ROLE_KEY with your actual service role key
--      (Project Settings → API → service_role key — never commit this to git)

-- Enable extensions if not already on
create extension if not exists pg_net  with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- Schedule: every day at 18:00 UTC (8 PM Brussels, 2 PM New York, adjust as needed)
select cron.schedule(
  'daily-streak-reminder',        -- job name (must be unique)
  '0 18 * * *',                   -- cron expression: minute hour dom month dow
  $$
  select extensions.http_post(
    'https://nixuohfgrbvikkrdfmib.supabase.co/functions/v1/send-push',
    '{}',
    'application/json',
    json_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    )::text
  );
  $$
);

-- To remove the job later:
-- select cron.unschedule('daily-streak-reminder');

-- To check scheduled jobs:
-- select * from cron.job;
