// Supabase Edge Function — sends streak-reminder push notifications
// Called daily by pg_cron at 18:00 UTC via net.http_post with the service role key.
// Also callable manually for testing.
//
// Secrets required (set via: supabase secrets set KEY=value):
//   VAPID_PUBLIC_KEY   — the VAPID public key (same as VITE_VAPID_PUBLIC_KEY in .env.local)
//   VAPID_PRIVATE_KEY  — the VAPID private key (keep this secret, never in git)

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Require service role key — pg_cron sends it in the Authorization header
  const authHeader = req.headers.get('Authorization') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (authHeader !== `Bearer ${serviceRoleKey}`) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  const vapidPublicKey  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';

  if (!vapidPublicKey || !vapidPrivateKey) {
    return new Response('VAPID secrets not configured', { status: 500, headers: corsHeaders });
  }

  webpush.setVapidDetails('mailto:braunf25@proton.me', vapidPublicKey, vapidPrivateKey);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    serviceRoleKey,
  );

  // Users whose streak is active but who haven't studied today
  const today = new Date().toISOString().slice(0, 10);
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

  let totalSent = 0;

  for (const user of atRisk ?? []) {
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', user.user_id);

    for (const sub of subs ?? []) {
      const payload = JSON.stringify({
        title: `🔥 ${user.current_streak}-day streak at risk!`,
        body: 'Study Japanese now before midnight to keep your streak alive.',
        url: '/',
      });

      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
        totalSent++;
      } catch (err) {
        // 410 Gone = subscription expired; remove it so we stop wasting calls
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
    JSON.stringify({ ok: true, usersAtRisk: atRisk?.length ?? 0, notificationsSent: totalSent }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
