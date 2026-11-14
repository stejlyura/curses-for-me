const CACHE_NAME = 'marketolog-v6';

const PRECACHE_ROUTES = [
  '/',
  '/?source=pwa',
  '/offline-shell/',
  '/manifest.webmanifest',
  '/courses/senior-marketing/',
  '/courses/media-buying/',
  '/courses/affiliate-manager/',
  '/courses/lead-generation/',
];

const PRECACHE_ICONS = [
  '/icon.svg',
  '/icon-maskable.svg',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-48x48.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/screenshots/desktop-1280x720.png',
  '/screenshots/mobile-750x1334.png',
];

function extractStaticUrls(text, baseOrigin) {
  const discovered = new Set();
  if (!text) return discovered;

  const nextStaticMatches = text.match(/\/_next\/static\/[^"'\s)<>\\]+/g) || [];
  for (const rawPath of nextStaticMatches) {
    try {
      const cleaned = rawPath.replace(/\\u0026/g, '&');
      const fullUrl = new URL(cleaned, baseOrigin);
      if (fullUrl.origin === baseOrigin) {
        discovered.add(fullUrl.pathname + fullUrl.search);
      }
    } catch {
      // Ignore malformed path
    }
  }

  return discovered;
}

async function cacheUrlWithStaticDependencies(cache, urlPath, discoveredStaticUrls) {
  try {
    const response = await fetch(urlPath, { credentials: 'same-origin' });
    if (!response || !response.ok) return;

    const contentType = response.headers.get('content-type') || '';
    const responseForCache = response.clone();
    await cache.put(urlPath, responseForCache);

    if (
      discoveredStaticUrls &&
      (contentType.includes('text/html') || contentType.includes('text/css'))
    ) {
      const bodyText = await response.text();
      const found = extractStaticUrls(bodyText, self.location.origin);
      for (const item of found) {
        discoveredStaticUrls.add(item);
      }
    }
  } catch {
    // Skip failed URL so remaining offline assets still install
  }
}

async function precacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const discoveredStaticUrls = new Set();

  await Promise.allSettled([
    ...PRECACHE_ROUTES.map((route) =>
      cacheUrlWithStaticDependencies(cache, route, discoveredStaticUrls)
    ),
    ...PRECACHE_ICONS.map((asset) => cacheUrlWithStaticDependencies(cache, asset, null)),
  ]);

  if (discoveredStaticUrls.size > 0) {
    const cssStaticUrls = new Set();
    await Promise.allSettled(
      Array.from(discoveredStaticUrls).map((assetUrl) =>
        cacheUrlWithStaticDependencies(cache, assetUrl, cssStaticUrls)
      )
    );

    if (cssStaticUrls.size > 0) {
      await Promise.allSettled(
        Array.from(cssStaticUrls).map((assetUrl) =>
          cacheUrlWithStaticDependencies(cache, assetUrl, null)
        )
      );
    }
  }
}

async function cacheAdditionalRoutes(routes) {
  if (!Array.isArray(routes) || routes.length === 0) return;
  if (typeof self.navigator !== 'undefined' && self.navigator.onLine === false) return;

  const cache = await caches.open(CACHE_NAME);
  const discoveredStaticUrls = new Set();
  const uniqueRoutes = Array.from(
    new Set(routes.filter((r) => typeof r === 'string' && r.startsWith('/')))
  );

  // Batch gently so browser connection pool stays responsive
  const BATCH_SIZE = 4;
  for (let i = 0; i < uniqueRoutes.length; i += BATCH_SIZE) {
    const batch = uniqueRoutes.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(
      batch.map((route) => cacheUrlWithStaticDependencies(cache, route, discoveredStaticUrls))
    );
  }

  if (discoveredStaticUrls.size > 0) {
    await Promise.allSettled(
      Array.from(discoveredStaticUrls).map((assetUrl) =>
        cacheUrlWithStaticDependencies(cache, assetUrl, null)
      )
    );
  }
}

async function findBestCachedNavigation(url) {
  const candidates = [
    url.href,
    url.pathname,
    url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`,
  ];

  for (const key of candidates) {
    const match = await caches.match(key);
    if (match) return match;
  }

  if (url.pathname.startsWith('/courses/') || url.pathname.startsWith('/lessons/')) {
    const shell =
      (await caches.match('/offline-shell/')) || (await caches.match('/offline-shell'));
    if (shell) return shell;
  }

  const rootMatch =
    (await caches.match('/')) || (await caches.match('/?source=pwa'));
  if (rootMatch) return rootMatch;

  return new Response('Marketolog Academy: оффлайн-режим (откройте главную страницу).', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

// Install: pre-cache pages, /offline-shell/, icons, and discovered /_next/static/ bundles
self.addEventListener('install', (event) => {
  event.waitUntil(precacheAppShell().then(() => self.skipWaiting()));
});

// Activate: clean up outdated legacy caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data.type === 'CACHE_ROUTES' && Array.isArray(event.data.routes)) {
    event.waitUntil(cacheAdditionalRoutes(event.data.routes));
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;
  if (url.pathname.startsWith('/api/')) return;

  // 1. /_next/static/ bundles -> Network-First with Cache Fallback (prevents stale dev chunk mismatch while working 100% offline)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
            cache.put(url.pathname, networkResponse.clone());
            return networkResponse;
          }
        } catch {
          // Offline: fall through to cache
        }

        const cachedResponse =
          (await cache.match(event.request)) || (await cache.match(url.pathname));
        if (cachedResponse) {
          return cachedResponse;
        }

        return Response.error();
      })
    );
    return;
  }

  // 2. Icons, images, fonts, manifest -> Cache-First
  const isStaticAsset =
    url.pathname === '/manifest.webmanifest' ||
    /\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf)$/i.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse =
          (await cache.match(event.request)) || (await cache.match(url.pathname));
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return Response.error();
        }
      })
    );
    return;
  }

  // 3. Next.js RSC / Flight data requests -> Network-First, else clean Response.error() so Next falls back to hard navigate
  const isRscRequest =
    event.request.headers.get('RSC') === '1' || url.searchParams.has('_rsc');

  if (isRscRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedRsc = await caches.match(event.request);
          if (cachedRsc) return cachedRsc;
          return Response.error();
        })
    );
    return;
  }

  // 4. HTML Navigation requests -> Network-First with Offline Shell Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            const pathCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
              if (url.pathname === '/' || url.pathname.startsWith('/courses/') || url.pathname === '/offline-shell/') {
                cache.put(url.pathname, pathCopy);
              }
            });
          }
          return networkResponse;
        })
        .catch(() => findBestCachedNavigation(url))
    );
    return;
  }

  // 5. All other GET requests -> Network-First with Cache Fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        return Response.error();
      })
  );
});
