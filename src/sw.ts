import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

// __WB_MANIFEST is replaced by VitePWA at build time with the precache asset list
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const manifest = (self as any).__WB_MANIFEST as string[];

clientsClaim();
precacheAndRoute(manifest);
cleanupOutdatedCaches();

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), {
    denylist: [/^\/404\.html$/],
  })
);

// Push notifications — sent by the Supabase Edge Function daily
self.addEventListener('push', (event: PushEvent) => {
  const data = (event.data?.json() ?? {}) as { title?: string; body?: string; url?: string };
  const title = data.title ?? '🔥 日本語';
  const body  = data.body  ?? 'Time to study! Keep your streak alive.';

  event.waitUntil(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (self as any).registration.showNotification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-64x64.png',
      tag: 'nihongo-streak',
      renotify: true,
      data: { url: data.url ?? '/' },
    }) as Promise<void>
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string } | null)?.url ?? '/';

  event.waitUntil(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (self as any).clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((list: WindowClient[]) => {
        const existing = list.find((c) => 'focus' in c);
        if (existing) return existing.focus();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (self as any).clients.openWindow(url);
      }) as Promise<void>
  );
});
