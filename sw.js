const CACHE = "pwa-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./flaticon-633600.png",
  "./271687.jpg",
  "./279799.jpg",
  "./280843.jpg",
  "./285624.jpg",
  "./COPYING.txt"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Stratégie "stale-while-revalidate" simple
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkRes) => {
          const clone = networkRes.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
