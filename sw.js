/* SmartLearn service worker: offline app shell (local-first, no server needed) */
var CACHE = "smartlearn-v2";
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
  "./screenshots/home-mobile.png",
  "./widget.html"
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

// Refresh the cached shell (used by Background Sync + Periodic Sync)
function refreshShell() {
  return caches.open(CACHE).then(function (cache) {
    return Promise.all(SHELL.map(function (url) {
      return fetch(url).then(function (res) {
        if (res && res.ok) return cache.put(url, res);
      }).catch(function () {});
    }));
  });
}

// Background Sync: fires when connectivity returns after offline edits
self.addEventListener("sync", function (event) {
  if (event.tag === "smartlearn-sync") {
    event.waitUntil(refreshShell());
  }
});

// Periodic Background Sync: daily shell refresh (installed app only)
self.addEventListener("periodicsync", function (event) {
  if (event.tag === "smartlearn-refresh") {
    event.waitUntil(refreshShell());
  }
});

// Push: show a reminder (needs a backend + VAPID keys for remote push — Phase 4)
self.addEventListener("push", function (event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  var options = {
    body: data.body || "Time to revise: watch one lesson, then take its quiz.",
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    tag: "smartlearn-push",
    data: { url: "./index.html" }
  };
  event.waitUntil(self.registration.showNotification(data.title || "SmartLearn reminder", options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "./index.html";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
