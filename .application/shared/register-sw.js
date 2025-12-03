/**
 * Service Worker Registration
 * Secure registration with update handling
 */

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers not supported');
    return null;
  }

  // Only register on HTTPS or localhost (security requirement)
  if (location.protocol !== 'https:' && !location.hostname.includes('localhost')) {
    console.warn('Service worker requires HTTPS');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none', // Always check for updates
    });

    console.log('SW registered:', registration.scope);

    // Check for updates on page load
    registration.update();

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available
          dispatchEvent(new CustomEvent('sw-update-available', {
            detail: { registration }
          }));
        }
      });
    });

    // Handle controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Optionally reload to get new version
      // window.location.reload();
    });

    return registration;

  } catch (error) {
    console.error('SW registration failed:', error);
    return null;
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaiting(registration) {
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Clear all caches
 */
export async function clearCache() {
  if (!navigator.serviceWorker.controller) {
    return false;
  }

  return new Promise((resolve) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event) => {
      resolve(event.data.success);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'CLEAR_CACHE' },
      [channel.port2]
    );
  });
}

/**
 * Get current service worker version
 */
export async function getVersion() {
  if (!navigator.serviceWorker.controller) {
    return null;
  }

  return new Promise((resolve) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event) => {
      resolve(event.data.version);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_VERSION' },
      [channel.port2]
    );
  });
}

/**
 * Request push notification permission
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  // Request permission
  const result = await Notification.requestPermission();
  return result;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(vapidPublicKey) {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  return subscription;
}

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
