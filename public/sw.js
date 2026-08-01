const CACHE = "ithacus-launcher-v12";
const SHELL = [
  "/__ithacus/?v=11",
  "/__ithacus/assets/app.css?v=10",
  "/__ithacus/assets/app.js?v=10",
  "/__ithacus/manifest.webmanifest",
  "/__ithacus/assets/icon-192.png",
  "/__ithacus/assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || !url.pathname.startsWith("/__ithacus/")) return;
  if (url.pathname.startsWith("/__ithacus/api/")) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
