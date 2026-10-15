/* SmartLearn service worker: offline app shell (local-first, no server needed) */
var CACHE = "smartlearn-v1";
var SHELL = [
  "./",
  "./index.html",
  "./about.html",
  "./subjects.html",
  "./lessons.html",
  "./admin.html",
  "./design.html",
  "./styles.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./screenshots/lessons-wide.png",
  "./screenshots/home-mobile.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(SHELL); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function (hit) {
      return hit || fetch(event.request);
    })
  );
});
