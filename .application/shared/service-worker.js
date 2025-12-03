/**
 * Service Worker Template
 * Secure, offline-capable PWA service worker
 *
 * SECURITY NOTES:
 * - Served over HTTPS only
 * - Same-origin requests cached by default
 * - Cross-origin requests require explicit handling
 * - Sensitive routes excluded from cache
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

// Files to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Routes that should never be cached (security-sensitive)
const NO_CACHE_ROUTES = [
  '/api/auth',
  '/api/session',
  '/api/user',
  '/api/admin',
  '/login',
  '/logout',
  '/api/csrf',
];

// Routes that should use network-first strategy
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/dashboard',
];

// Cache duration for different content types (in seconds)
const CACHE_DURATION = {
  default: 3600,        // 1 hour
  static: 86400 * 30,   // 30 days
  api: 300,             // 5 minutes
};

/**
 * Install event - precache essential assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Activate immediately without waiting
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Precache failed:', error);
      })
  );
});

/**
 * Activate event - cleanup old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('app-cache-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Claim all clients immediately
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - handle requests with appropriate strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (security)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip sensitive routes (security)
  if (shouldNotCache(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  // Use network-first for dynamic content
  if (shouldUseNetworkFirst(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Use cache-first for static assets
  event.respondWith(cacheFirst(request));
});

/**
 * Check if route should never be cached
 */
function shouldNotCache(pathname) {
  return NO_CACHE_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route should use network-first strategy
 */
function shouldUseNetworkFirst(pathname) {
  return NETWORK_FIRST_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Cache-first strategy - for static assets
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Return cached response, refresh cache in background
    refreshCache(request);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      await addToCache(request, response.clone());
    }
    return response;
  } catch (error) {
    return caches.match('/offline') || new Response('Offline', { status: 503 });
  }
}

/**
 * Network-first strategy - for dynamic content
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await addToCache(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return caches.match('/offline') || new Response('Offline', { status: 503 });
  }
}

/**
 * Add response to cache with security checks
 */
async function addToCache(request, response) {
  // Only cache successful responses
  if (!response.ok) {
    return;
  }

  // Don't cache if response has no-store directive
  const cacheControl = response.headers.get('Cache-Control');
  if (cacheControl && cacheControl.includes('no-store')) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
}

/**
 * Refresh cache in background (stale-while-revalidate)
 */
async function refreshCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await addToCache(request, response);
    }
  } catch (error) {
    // Silently fail - we already have cached version
  }
}

/**
 * Push notification event
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();

    const options = {
      body: data.body || '',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        dateOfArrival: Date.now(),
      },
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', options)
    );
  } catch (error) {
    console.error('[SW] Push notification error:', error);
  }
});

/**
 * Notification click event
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window if available
        for (const client of clients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});

/**
 * Background sync event
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

/**
 * Sync pending data when online
 */
async function syncData() {
  // Implement your sync logic here
  // Example: Send queued form submissions
  console.log('[SW] Syncing data...');
}

/**
 * Message event - communication with main thread
 */
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }

  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

console.log('[SW] Service Worker loaded:', CACHE_VERSION);
