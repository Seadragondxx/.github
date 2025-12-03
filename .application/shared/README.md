# Shared PWA Assets

## Overview

This directory contains browser-agnostic configurations shared across all platforms.

## Files

| File | Purpose |
|------|---------|
| `service-worker.js` | Production-ready service worker with caching strategies |
| `register-sw.js` | Service worker registration utilities |
| `meta-tags.html` | Universal meta tags for all browsers |

## Service Worker

### Features
- **Precaching**: Essential assets cached on install
- **Cache-first**: Static assets served from cache
- **Network-first**: Dynamic content fetched fresh
- **Security**: Sensitive routes never cached
- **Push notifications**: Full support
- **Background sync**: Offline action queuing
- **Auto-update**: Old caches cleaned up

### Security Measures
1. HTTPS enforcement (won't register on HTTP)
2. Same-origin only (no cross-origin caching)
3. Sensitive routes excluded (`/api/auth`, `/login`, etc.)
4. Respects `Cache-Control: no-store`
5. Separate cache per version

### Installation

1. Copy `service-worker.js` to your `public/` as `sw.js`
2. Import registration utilities:

```typescript
// app/layout.tsx or _app.tsx
'use client';
import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/register-sw';

export default function RootLayout({ children }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <html>...</html>;
}
```

### Update Handling

```typescript
// Listen for updates
window.addEventListener('sw-update-available', (event) => {
  const { registration } = event.detail;

  if (confirm('New version available. Reload?')) {
    skipWaiting(registration);
    window.location.reload();
  }
});
```

### Customization

Edit these constants in `service-worker.js`:

```javascript
// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  // Add your critical assets
];

// Routes to never cache
const NO_CACHE_ROUTES = [
  '/api/auth',
  '/api/session',
  // Add sensitive routes
];

// Routes using network-first
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/dashboard',
  // Add dynamic routes
];
```

## Meta Tags

### Installation

Copy contents of `meta-tags.html` into your `<head>`:

**Next.js (app/layout.tsx):**
```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Paste meta tags here */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Or use next/head:**
```tsx
import Head from 'next/head';

<Head>
  {/* Paste meta tags here */}
</Head>
```

### Required Updates

Replace these placeholder values:
- `https://example.com` → Your domain
- `Get0ff App` → Your app name
- `Secure progressive web application` → Your description
- `Your Name` → Your name/company

## Icon Requirements

Create these icons for full PWA support:

### Favicons
- `favicon.ico` (multi-size: 16, 32, 48)
- `favicon-16x16.png`
- `favicon-32x32.png`

### PWA Icons
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `icon-maskable-192x192.png` (with safe zone)
- `icon-maskable-512x512.png` (with safe zone)

### Apple Icons
- `apple-touch-icon.png` (180x180)
- `apple-touch-icon-180x180.png`
- `safari-pinned-tab.svg` (single color)

### Windows
- `ms-icon-144x144.png`

### Generate All Icons

```bash
# Using pwa-asset-generator
npx pwa-asset-generator ./logo.png ./public/icons \
  --index ./public/index.html \
  --manifest ./public/manifest.json \
  --type png \
  --background "#ffffff" \
  --padding "10%"
```

## Testing

### Lighthouse PWA Audit
1. Open Chrome DevTools
2. Lighthouse tab
3. Select "Progressive Web App"
4. Run audit

### Service Worker Debug
- Chrome: `chrome://serviceworker-internals/`
- Firefox: `about:debugging#/runtime/this-firefox`
- Edge: `edge://serviceworker-internals/`

### Offline Testing
1. DevTools → Application → Service Workers
2. Check "Offline"
3. Reload page
4. Verify offline functionality

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ⚠️ iOS 16.4+ | ✅ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |
| Install Prompt | ✅ | ❌ | ⚠️ Extension | ✅ |
| File Handling | ✅ | ❌ | ❌ | ✅ |
| Share Target | ✅ | ❌ | ❌ | ✅ |
