const CACHE = 'lns-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/pacient.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Instal·lació — guarda els fitxers estàtics a la caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activació — elimina cachés antigues
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — xarxa primer (per tenir dades actualitzades), caché com a fallback
self.addEventListener('fetch', e => {
  // No interceptar crides a Supabase ni EmailJS
  if (e.request.url.includes('supabase.co') ||
      e.request.url.includes('emailjs.com') ||
      e.request.url.includes('googleapis.com')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Actualitza la caché amb la resposta fresca
        if (res.ok && e.request.method === 'GET') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
