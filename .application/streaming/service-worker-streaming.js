/**
 * Service Worker for Live Streaming Platform
 *
 * SECURITY PRIORITY:
 * - Never cache auth/payment routes
 * - Never cache live streams (always fresh)
 * - Cache static assets and recorded mixes
 * - Secure handling of user content
 */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const AUDIO_CACHE = `audio-${CACHE_VERSION}`;

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// SECURITY: Routes that must NEVER be cached
const NO_CACHE_ROUTES = [
  '/api/auth',
  '/api/session',
  '/api/user',
  '/api/tokens',
  '/api/payment',
  '/api/payout',
  '/api/stream/live',
  '/login',
  '/logout',
  '/studio/live',
  '/api/csrf',
  '/api/admin',
];

// Live stream patterns - NEVER cache
const LIVE_STREAM_PATTERNS = [
  /\.m3u8$/,           // HLS manifest
  /\.ts$/,             // HLS segments (live)
  /\.mpd$/,            // DASH manifest
  /\.m4s$/,            // DASH segments
  /\/live\//,          // Live stream paths
  /stream\.mux\.com/,  // Mux live
  /cloudflarestream/,  // Cloudflare live
  /livepeer/,          // Livepeer
  /webrtc/,            // WebRTC
];

// Recorded audio - OK to cache
const CACHEABLE_AUDIO = [
  /\/mixes\//,
  /\/recordings\//,
  /\/uploads\//,
  /\.mp3$/,
  /\.wav$/,
  /\.flac$/,
  /\.m4a$/,
  /\.ogg$/,
];

/**
 * Install - precache essential assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate - clean old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== AUDIO_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

/**
 * Fetch - route requests to appropriate strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip cross-origin (except known CDNs)
  if (url.origin !== self.location.origin && !isTrustedCDN(url)) {
    return;
  }

  // SECURITY: Never cache sensitive routes
  if (isNoCacheRoute(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  // Never cache live streams
  if (isLiveStream(url)) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache recorded audio with network-first
  if (isCacheableAudio(url)) {
    event.respondWith(audioCacheStrategy(request));
    return;
  }

  // Static assets - cache first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Default - network first
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

/**
 * Check if URL is a trusted CDN
 */
function isTrustedCDN(url) {
  const trustedHosts = [
    'cloudflarestream.com',
    'stream.mux.com',
    'image.mux.com',
    'cdn.supabase.co',
  ];
  return trustedHosts.some((host) => url.hostname.includes(host));
}

/**
 * Check if route should never be cached
 */
function isNoCacheRoute(pathname) {
  return NO_CACHE_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if URL is a live stream
 */
function isLiveStream(url) {
  const fullUrl = url.href;
  return LIVE_STREAM_PATTERNS.some((pattern) => pattern.test(fullUrl));
}

/**
 * Check if URL is cacheable audio
 */
function isCacheableAudio(url) {
  const fullUrl = url.href;
  return CACHEABLE_AUDIO.some((pattern) => pattern.test(fullUrl));
}

/**
 * Check if URL is static asset
 */
function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/.test(url.pathname);
}

/**
 * Cache-first strategy
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return caches.match('/offline');
  }
}

/**
 * Network-first strategy
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || caches.match('/offline');
  }
}

/**
 * Audio cache strategy - cache for offline playback
 * Uses separate cache with larger storage allowance
 */
async function audioCacheStrategy(request) {
  const cache = await caches.open(AUDIO_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Clone and cache for offline playback
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Offline - serve from cache
    const cached = await cache.match(request);
    if (cached) return cached;

    return new Response('Audio unavailable offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Background sync for offline token transactions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tokens') {
    event.waitUntil(syncPendingTokens());
  }
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

/**
 * Sync pending token transactions when back online
 */
async function syncPendingTokens() {
  // Get pending transactions from IndexedDB
  // Send to server
  // Clear pending on success
  console.log('[SW] Syncing pending token transactions');
}

/**
 * Sync analytics events
 */
async function syncAnalytics() {
  console.log('[SW] Syncing analytics');
}

/**
 * Push notifications for performer alerts
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      tag: data.tag || 'default',
      renotify: true,
      requireInteraction: data.requireInteraction || false,
      data: {
        url: data.url || '/',
        type: data.type, // 'tip', 'follower', 'live', etc.
      },
      actions: data.actions || [],
    };

    // Custom icons for notification types
    if (data.type === 'tip') {
      options.icon = '/icons/notification-tip.png';
    } else if (data.type === 'live') {
      options.icon = '/icons/notification-live.png';
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('[SW] Push error:', error);
  }
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window or open new
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      })
  );
});

/**
 * Handle audio focus / Now Playing integration
 */
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CACHE_AUDIO') {
    // Proactively cache a mix for offline playback
    event.waitUntil(
      caches.open(AUDIO_CACHE)
        .then((cache) => cache.add(event.data.url))
        .then(() => event.ports[0]?.postMessage({ success: true }))
        .catch((err) => event.ports[0]?.postMessage({ success: false, error: err.message }))
    );
  }

  if (event.data.type === 'CLEAR_AUDIO_CACHE') {
    event.waitUntil(
      caches.delete(AUDIO_CACHE)
        .then(() => event.ports[0]?.postMessage({ success: true }))
    );
  }

  if (event.data.type === 'GET_CACHED_AUDIO') {
    event.waitUntil(
      caches.open(AUDIO_CACHE)
        .then((cache) => cache.keys())
        .then((keys) => keys.map((req) => req.url))
        .then((urls) => event.ports[0]?.postMessage({ urls }))
    );
  }
});

console.log('[SW] Streaming Service Worker loaded:', CACHE_VERSION);
