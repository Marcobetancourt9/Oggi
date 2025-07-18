const CACHE_NAME = 'optica-oggi-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(error => console.error('Error al cachear recursos:', error))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, devolverlo
        if (response) return response;
        
        // Si no, hacer fetch y manejar errores
        return fetch(event.request)
          .catch(() => {
            // Puedes devolver una página offline aquí si lo tienes
            return new Response('Estás offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});