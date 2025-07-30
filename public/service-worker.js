const CACHE_NAME = 'optica-oggi-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
  '/public/icons/icon-192x192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache)))
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(error => {
        console.error('Fetch failed:', event.request.url, error);
        // Opción: devuelve una respuesta genérica o personalizada
        return new Response('Offline or not found', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});
