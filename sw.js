const CACHE = 'mujam-cache-v1.0.0';
const DATA = [
  'index.json', 'A.json', 'B.json', 'D.json', 'D2.json', 'DH.json', 'E.json',
  'F.json', 'GH.json', 'H.json', 'H2.json', 'J.json', 'K.json', 'KH.json',
  'L.json', 'M.json', 'N.json', 'Q.json', 'R.json', 'S.json', 'S2.json',
  'SH.json', 'T.json', 'T2.json', 'TH.json', 'W.json', 'Y.json', 'Z.json', 'Z2.json'
];
const CORE = ['./', './index.html'].concat(DATA.map((f) => './data/' + f));
const CDN = [
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@400;600;700;800;900&family=Cairo+Play:wght@400..700&family=IBM+Plex+Sans+Arabic:wght@500;700&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map((u) => cache.add(u).catch(() => {})));
    await Promise.all(CDN.map((u) =>
      fetch(u, { mode: 'no-cors' }).then((r) => { if (r) return cache.put(u, r); }).catch(() => {})
    ));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
    })
  );
});
