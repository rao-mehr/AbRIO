// ABRI Service Worker - Stale-While-Revalidate
// Zeigt sofort die gecachte Version, holt im Hintergrund die neue Version
// (falls Internet verfügbar) für den nächsten Start. Offline: läuft mit
// letzter gecachter Version weiter, kein Fehler.

const CACHE_NAME = 'abri-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html'
];

// Beim Installieren: Assets cachen, sofort aktivieren (nicht auf alten SW warten)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Beim Aktivieren: alte Cache-Versionen aufräumen, sofort Kontrolle übernehmen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Bei jedem Request: Cache sofort liefern (schnell!), parallel im Hintergrund
// die Netzwerk-Version holen und den Cache aktualisieren (für nächsten Start).
// Kein Internet? -> fetch schlägt fehl -> gecachte Version bleibt die Antwort.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse); // offline oder Fehler -> Cache-Fallback

        // Sofort Cache liefern falls vorhanden, sonst auf Netzwerk warten
        return cachedResponse || networkFetch;
      })
    )
  );
});
