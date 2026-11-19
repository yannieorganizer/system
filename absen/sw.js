// Service worker: cache tampilan aplikasi supaya cepat dibuka & bisa di-install.
const C = "absen-yannie-v2", SHELL = ["/absen/", "/absen/index.html", "/absen/logo.png", "/absen/icon-192.png", "/absen/icon-512.png", "/absen/manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(K => Promise.all(K.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // model wajah & library dari CDN: cache setelah unduhan pertama
  if (u.hostname === "cdn.jsdelivr.net") { e.respondWith(caches.open(C).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; })))); return; }
  if (u.origin === location.origin && u.pathname.startsWith("/absen/")) e.respondWith(fetch(e.request).then(res => { caches.open(C).then(c => c.put(e.request, res.clone())); return res; }).catch(() => caches.match(e.request)));
});
