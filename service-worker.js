const CACHE_NAME = 'fir-trener-v62-cache';
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
  './data/boss_questions.js',
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

// Strategia: NETWORK-FIRST dla kodu/danych aplikacji (HTML/JS/JSON i nawigacje) — zawsze świeży kod,
// koniec z serwowaniem starych wersji z cache. CACHE-FIRST tylko dla obrazków/CDN (statyczne, wersjonowane).
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  const sameOrigin = url.origin === self.location.origin;
  const isCode = req.mode === 'navigate' || (sameOrigin && /\.(?:js|json|html)$/i.test(url.pathname));

  if (isCode) {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) { const c = res.clone(); caches.open(CACHE_NAME).then(ca => ca.put(req, c)); }
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
  } else {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res && res.status === 200 && url.protocol.startsWith('http')) { const c = res.clone(); caches.open(CACHE_NAME).then(ca => ca.put(req, c)); }
        return res;
      }))
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => (cacheWhitelist.indexOf(cacheName) === -1) ? caches.delete(cacheName) : null)
    ))
      .then(() => self.clients.claim()) // przejmij otwarte karty
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => {
        // Wymuś PRZEŁADOWANIE karty pod nowym SW (network-first) — gwarantuje świeży kod
        // bez ręcznego podwójnego odświeżania (naprawia „przyklejony" stary cache).
        try { c.navigate(c.url); } catch (e) {}
      }))
  );
});
