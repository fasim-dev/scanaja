const CACHE_NAME = 'scanaja-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/splashscreen.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/style.css', // ganti jika CSS terpisah
  '/script.js', // jika JS kamu terpisah
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://unpkg.com/html5-qrcode',
  'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch cache fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).catch(() =>
        caches.match('/index.html') // fallback saat offline
      )
    )
  );
});
