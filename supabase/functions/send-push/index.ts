// Supabase Edge Function — sends streak-reminder push notifications
// Called hourly by pg_cron via net.http_post with the service role key.
// Each user is notified once per day at their personal preferred study hour.
//
// Secrets required (set via: supabase secrets set KEY=value):
//   VAPID_PUBLIC_KEY   — same as VITE_VAPID_PUBLIC_KEY in .env.local
//   VAPID_PRIVATE_KEY  — keep secret, never commit

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MILESTONES = [7, 30, 100, 365];
const DEFAULT_NOTIFY_HOUR = 18; // UTC fallback for users with no session history

function dueLabel(dueCards: number): string {
  if (dueCards <= 0) return '';
  return dueCards === 1 ? ' · 1 card due' : ` · ${dueCards} cards due`;
}

function notificationPayload(
  streak: number,
  utcHour: number,
  dueCards: number,
): { title: string; body: string; url: string } {
  const due = dueLabel(dueCards);

  // Milestone-tomorrow: they're one day away from a major milestone
  const nextMilestone = MILESTONES.find(m => streak + 1 === m);
  if (nextMilestone) {
    return {
      title: `🏆 One more day = ${nextMilestone}-day streak!`,
      body: `Study Japanese tonight. You're SO close.${due}`,
      url: '/',
    };
  }

  // Last-chance savage (22:00+)
  if (utcHour >= 22) {
    const options = [
      { title: `⏰ ${streak} days. The clock is ticking.`, body: `Midnight is almost here. Don't let it end like this.${due}` },
      { title: `😤 You still haven't studied. It's nearly midnight.`, body: `${streak}-day streak. Still saveable. Barely.${due}` },
      { title: '🔥 Last warning.', body: `${streak} days of Japanese on the line. Study. Now.${due}` },
    ];
    return { ...options[streak % options.length], url: '/' };
  }

  // Evening urgent (19:00–21:00)
  if (utcHour >= 19) {
    const options = [
      { title: `🔥 ${streak}-day streak at risk!`, body: `Study Japanese tonight before midnight to keep it alive.${due}` },
      { title: `😤 You forgot about us today.`, body: `${streak} days on the line. Don't let tonight be the end.${due}` },
      { title: `🦉 Don't make us send another one.`, body: `${streak} days is worth 5 minutes. Study.${due}` },
    ];
    return { ...options[streak % options.length], url: '/' };
  }

  // Afternoon gentle (15:00–18:00)
  if (utcHour >= 15) {
    const options = [
      { title: '📚 Time to study Japanese!', body: `${streak} days in a row. Keep the chain alive today.${due}` },
      { title: `🌸 Study reminder`, body: `You have a ${streak}-day streak. A few cards keeps it going.${due}` },
      { title: `🎯 ${streak} days and counting`, body: `Quick session today = streak survives. Let's go!${due}` },
    ];
    return { ...options[streak % options.length], url: '/' };
  }

  // Morning / other hours
  return {
    title: '📖 Good morning! Time for Japanese.',
    body: `${streak}-day streak on the line. A few minutes of study keeps it alive.${due}`,
    url: '/',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authHeader  = req.headers.get('Authorization') ?? '';
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (authHeader !== `Bearer ${serviceRole}`) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  const vapidPublic  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
  const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
  if (!vapidPublic || !vapidPrivate) {
    return new Response('VAPID secrets not configured', { status: 500, headers: corsHeaders });
  }

  webpush.setVapidDetails('mailto:braunf25@proton.me', vapidPublic, vapidPrivate);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', serviceRole);
  const now      = new Date();
  const today    = now.toISOString().slice(0, 10);
  const utcHour  = now.getUTCHours();

  // Users with an active streak who haven't studied today
  const { data: atRisk, error } = await supabase
    .from('streaks')
    .select('user_id, current_streak')
    .gt('current_streak', 0)
    .or(`last_study_date.is.null,last_study_date.neq.${today}`);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!atRisk?.length) {
    return new Response(
      JSON.stringify({ ok: true, usersAtRisk: 0, notificationsSent: 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const nowMs = Date.now();

  // Compute each user's preferred study hour from their last 14 days of sessions.
  // We look at when they actually study and notify at that exact UTC hour.
  const fourteenDaysAgo = nowMs - 14 * 24 * 60 * 60 * 1000;
  const userIds = atRisk.map(u => u.user_id);

  const [sessionsRes, dueRes] = await Promise.all([
    supabase
      .from('sessions')
      .select('user_id, created_at')
      .in('user_id', userIds)
      .gt('created_at', fourteenDaysAgo),
    supabase
      .from('deck_states')
      .select('user_id')
      .in('user_id', userIds)
      .lte('due_date', nowMs),
  ]);

  // Rolling average UTC hour per user
  const hourAccum: Record<string, { sum: number; count: number }> = {};
  for (const s of sessionsRes.data ?? []) {
    const h = new Date(s.created_at as number).getUTCHours();
    if (!hourAccum[s.user_id]) hourAccum[s.user_id] = { sum: 0, count: 0 };
    hourAccum[s.user_id].sum   += h;
    hourAccum[s.user_id].count += 1;
  }

  // Due card count per user
  const dueByUser: Record<string, number> = {};
  for (const row of dueRes.data ?? []) {
    dueByUser[row.user_id] = (dueByUser[row.user_id] ?? 0) + 1;
  }

  let totalSent = 0;

  for (const user of atRisk) {
    // Exact-match: only fire for this user if the current UTC hour matches their average.
    // This guarantees one notification per day per user, never more.
    const entry         = hourAccum[user.user_id];
    const preferredHour = entry ? Math.round(entry.sum / entry.count) : DEFAULT_NOTIFY_HOUR;
    if (utcHour !== preferredHour) continue;

    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', user.user_id);

    if (!subs?.length) continue;

    const dueCards = dueByUser[user.user_id] ?? 0;
    const payload = JSON.stringify(notificationPayload(user.current_streak, utcHour, dueCards));

    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
        totalSent++;
      } catch (err) {
        if ((err as { statusCode?: number }).statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.user_id)
            .eq('endpoint', sub.endpoint);
        }
      }
    }
  }

  return new Response(
    JSON.stringify({ ok: true, usersAtRisk: atRisk.length, notificationsSent: totalSent }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
