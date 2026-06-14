-- Push notification cron job — run this in your Supabase SQL editor
-- (Database → SQL Editor)
--
-- BEFORE running this SQL:
--   1. Go to Supabase Dashboard → Database → Extensions
--   2. Search "pg_cron" → click Enable
--   3. Search "pg_net"  → click Enable
--      (these must be toggled on in the UI — CREATE EXTENSION won't work for them)
--   4. Deploy the send-push Edge Function (supabase functions deploy send-push)
--   5. Replace YOUR_SERVICE_ROLE_KEY below with your service role key
--      (Project Settings → API → service_role — never commit this value)

-- Schedule: every day at 18:00 UTC (~8 PM Brussels in summer, adjust as needed)
select cron.schedule(
  'daily-streak-reminder',
  '0 18 * * *',
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

-- To inspect scheduled jobs:  select * from cron.job;
-- To remove this job:         select cron.unschedule('daily-streak-reminder');
