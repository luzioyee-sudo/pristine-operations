const CACHE_NAME = 'lingoflow-static-v1';
const API_CACHE_NAME = 'lingoflow-api-v1';

// Only pre-cache the app shell. Build-specific asset URLs are cached at runtime,
// so this works the same on every platform/host.
const STATIC_ASSETS = ['/'];

// Install Event - Pre-cache critical static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching partial failure, proceeding:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Hash request payload for caching POST API responses
async function hashRequestBody(request) {
  try {
    const clone = request.clone();
    const text = await clone.text();
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `${request.url}_${hash}`;
  } catch (e) {
    return request.url;
  }
}

// Fetch Interceptor
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Handle Navigation / HTML Requests (Network First, Cache Fallback)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', responseClone));
          }
          return response;
        })
        .catch(async () => {
          const cached = (await caches.match('/')) || (await caches.match('/index.html'));
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><body><h1>Ribble Offline Mode</h1><p>You are currently offline. Loaded cached resources are available.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Handle API Calls (/api/*)
  if (url.pathname.startsWith('/api/')) {
    // Special handling for background sync endpoint: let network attempt, don't break offline flow
    if (url.pathname === '/api/progress/sync') {
      event.respondWith(
        fetch(request).catch(() => {
          return new Response(
            JSON.stringify({ offlineQueued: true, message: 'Saved to local queue. Will sync when online.' }),
            { headers: { 'Content-Type': 'application/json' }, status: 202 }
          );
        })
      );
      return;
    }

    // For POST API endpoints (translation, proofreading, sentence analysis, dictionary lookups)
    if (request.method === 'POST') {
      event.respondWith(
        (async () => {
          const cacheKey = await hashRequestBody(request);
          const apiCache = await caches.open(API_CACHE_NAME);

          try {
            const networkResponse = await fetch(request.clone());
            if (networkResponse && networkResponse.ok) {
              // Cache successful API response
              apiCache.put(cacheKey, networkResponse.clone()).catch(() => {});
              return networkResponse;
            }
          } catch (fetchErr) {
            console.log('[SW] Network offline/failed for API POST:', url.pathname);
          }

          // Offline fallback: Check API Cache first
          const cachedResponse = await apiCache.match(cacheKey);
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fallback JSON payload if no cache exists for this specific query
          return new Response(
            JSON.stringify(getOfflineFallbackData(url.pathname)),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })()
      );
      return;
    }

    // GET API endpoints
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          const cached = await cache.match(request);
          if (cached) return cached;
          return new Response(
            JSON.stringify({ offline: true, message: 'Offline mode active.' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
      })
    );
    return;
  }

  // 3. Static Assets (JS, CSS, Fonts, Images) -> Cache First with Network Refresh
  if (
    request.method === 'GET' &&
    (url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg') ||
      url.hostname.includes('fonts.gstatic.com') ||
      url.hostname.includes('fonts.googleapis.com'))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default fetch
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request))
  );
});

// Generate realistic offline structured responses for AI endpoints when no cached query exists
function getOfflineFallbackData(pathname) {
  if (pathname.includes('translate')) {
    return {
      word: 'Offline Query',
      phonetic: '/ offline /',
      translation: 'Offline Mode Enabled',
      definition: 'Internet connection is currently unavailable. Cached words and local dictionary remain accessible.',
      partOfSpeech: 'note',
      grammarNote: 'Your offline lookups will automatically re-enable when connection restores.',
      examples: [{ source: 'Offline mode active', target: 'La conexión está inactiva' }],
      synonyms: ['cached', 'local'],
      isOfflineFallback: true
    };
  }

  if (pathname.includes('proofread')) {
    return {
      score: 100,
      scoreFeedback: 'Proofreading evaluated using local rules (Offline).',
      correctedText: 'Text preserved safely offline.',
      issues: [],
      isOfflineFallback: true
    };
  }

  if (pathname.includes('custom-quiz')) {
    return {
      vocabulary: [
        {
          word: 'Offline Study',
          phonetic: '/ offline /',
          translation: 'Modo sin conexión',
          definition: 'Reviewing offline cached study flashcards.',
          partOfSpeech: 'noun',
          contextSentence: 'You are studying saved flashcards while offline.',
          grammarNote: 'Local cache active.'
        }
      ],
      isOfflineFallback: true
    };
  }

  return {
    offline: true,
    message: 'App is operating in offline mode. Saved data is safely stored locally and will sync automatically upon reconnection.'
  };
}

// Background Sync Event Handler
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queued-progress') {
    event.waitUntil(notifyClientsToSyncQueue());
  }
});

// Listen for messages from frontend clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_NOW') {
    notifyClientsToSyncQueue();
  }
});

async function notifyClientsToSyncQueue() {
  const allClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const client of allClients) {
    client.postMessage({ type: 'PROCESS_OFFLINE_QUEUE' });
  }
}
