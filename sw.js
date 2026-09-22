// AbRIO Service Worker – Stale-While-Revalidate
// Liefert sofort die gecachte Version (offline-fest) und aktualisiert den Cache
// im Hintergrund. Die Seite prüft selbst, ob eine neuere Version existiert,
// und bietet dann "Aktualisieren" an.
// Beim Release: CACHE_NAME ändern -> alte Caches werden beim Aktivieren gelöscht.

const CACHE_NAME = 'abrio-cache-2026-09-23-1';
const ASSETS_TO_CACHE = ['./', './index.html'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Versionsprüfung der Seite: immer direkt ans Netz, nie cachen
  if (url.searchParams.has('fresh')) {
    event.respondWith(fetch(req, { cache: 'no-store' }));
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
