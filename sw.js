/* Service worker Personal Planner.
   Menyimpan berkas aplikasi di cache supaya bisa dibuka tanpa internet.
   Saat mengubah berkas aplikasi, naikkan VERSION agar cache lama diganti. */
const VERSION = 'planner-v2';
const EXTERNAL = 'planner-external';
const SHELL = [
  './',
  './index.html',
  './config.js',
  './cloud.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== EXTERNAL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isExternalAsset(url) {
  return url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com' ||
         (url.hostname === 'www.gstatic.com' && url.pathname.indexOf('/firebasejs/') === 0);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Berkas aplikasi sendiri: jaringan dulu (pembaruan cepat sampai), cache bila offline.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            const key = req.mode === 'navigate' ? './index.html' : req;
            caches.open(VERSION).then((c) => c.put(key, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
        )
    );
    return;
  }

  // Font dan SDK Firebase: pakai cache, perbarui di latar belakang.
  if (isExternalAsset(url)) {
    event.respondWith(
      caches.open(EXTERNAL).then((cache) =>
        cache.match(req).then((hit) => {
          const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => hit);
          return hit || net;
        })
      )
    );
  }
  // Selain itu (API Firebase, login Google) langsung ke jaringan.
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) =>
      list.length ? list[0].focus() : self.clients.openWindow('./')
    )
  );
});
