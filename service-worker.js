const CACHE_NAME = 'fir-trener-v48-cache';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/anim.js',
  './js/fsrs.js',
  './js/store.js',
  './js/gamify.js',
  './js/dashboard.js',
  './js/learn.js',
  './js/problems_ui.js',
  './js/reader.js',
  './js/flashcards.js',
  './js/quiz.js',
  './js/commission.js',
  './js/analytics.js',
  './js/formulas.js',
  './js/search.js',
  './js/settings.js',
  './js/ui_select.js',
  './js/match.js',
  './js/boss.js',
  './js/learn_modes.js',
  './js/gemini.js',
  './js/study.js',
  './js/app.js',
  './data/content.json',
  './data/content.js',
  './data/lessons.json',
  './data/lessons.js',
  './data/problems.js',
  './data/exam.js',
  './assets/avatars/audytor.png',
  './assets/avatars/kinezjolog.png',
  './assets/avatars/strateg.png',
  './assets/avatars/boss_golem.png',
  './assets/avatars/item_kalkulator.png',
  './assets/avatars/item_hantel.png',
  './assets/avatars/item_notatnik.png',
  './assets/avatars/item_garnitur.png',
  './assets/avatars/item_pas.png',
  './assets/avatars/bonfire.png',
  './assets/avatars/bloodstain.png',
  'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // nowy SW przejmuje od razu (koniec z zawieszonym starym cache)
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // Odporna instalacja: cache po jednym URL. addAll jest ATOMOWE — jeden brakujacy plik (404)
      // wywalalby cala instalacje SW. allSettled + catch sprawia, ze pojedynczy brak nic nie psuje.
      Promise.allSettled(urlsToCache.map(u => cache.add(u).catch(e => console.warn('SW: pominieto', u))))
    )
  );
});

// Cache-first strategy for offline support
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone and cache new requests dynamically
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Only cache our own domain or CDNs we trust (simplification)
                if (event.request.url.startsWith('http')) {
                    cache.put(event.request, responseToCache);
                }
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      })
    )).then(() => self.clients.claim()) // od razu przejmij otwarte karty (szybsza aktualizacja)
  );
});
