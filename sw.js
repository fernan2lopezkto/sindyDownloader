const CACHE_NAME = 'sindy-downloader-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './scripts.js',
  './manifest.json',
  './icon.svg',
  './favicon.ico',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/particles.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
      .catch(err => console.log('Fall\u00f3 el precacheo de recursos', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el recurso desde la caché si existe, si no, realiza la petición por la red
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback en caso de que todo falle
      })
  );
});
