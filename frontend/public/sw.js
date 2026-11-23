/*
 * Service worker Rabbit Farm.
 * - Pages : réseau d'abord, page hors ligne en secours.
 * - Fichiers statiques Next (/_next/static) et icônes : cache d'abord.
 * - L'API GraphQL n'est pas gérée ici : l'app garde ses données elle-même (IndexedDB).
 * - Sur demande de l'app, les pages du terrain et leurs fichiers sont gardés à l'avance.
 */
const VERSION = 'rabbit-farm-v5';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, '/icons/icon-192.png', '/icons/icon-512.png']))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(
          async () =>
            (await caches.match(request)) ??
            (await caches.match(request, { ignoreSearch: true })) ??
            (await caches.match(OFFLINE_URL)),
        ),
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
  }
});

// Hors ligne : l'app demande de garder les pages du terrain et leurs fichiers.
const ASSET_PATTERN = /\/_next\/static\/[^"'\s)\\]+/g;

async function precachePages(urls) {
  const pages = await caches.open(PAGE_CACHE);
  const assets = await caches.open(STATIC_CACHE);
  for (const url of urls) {
    try {
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok || response.redirected) continue;
      const html = await response.clone().text();
      await pages.put(url, response);
      const files = [...new Set(html.match(ASSET_PATTERN) ?? [])];
      for (const file of files) {
        if (!(await assets.match(file))) await assets.add(file).catch(() => undefined);
      }
    } catch {
      // Réseau coupé en route : on réessaiera au prochain passage.
    }
  }
}

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'precache' && Array.isArray(data.urls)) {
    const urls = data.urls.filter((url) => typeof url === 'string' && url.startsWith('/'));
    event.waitUntil(precachePages(urls));
  }
});

// Rappels du jour (notifications envoyées par le serveur).
self.addEventListener('push', (event) => {
  let data = { title: 'RabbitFarm', body: 'Tu as des tâches aujourd’hui.', url: '/tasks' };
  try {
    data = { ...data, ...event.data.json() };
  } catch {
    // Message sans contenu lisible : texte par défaut.
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url },
      tag: data.tag || 'rabbitfarm-rappel',
      // Un nouveau rappel qui remplace l'ancien sonne et s'affiche quand même.
      renotify: true,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url ?? '/dashboard', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((client) => client.url.startsWith(self.location.origin));
      if (existing) {
        existing.navigate(url);
        return existing.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
