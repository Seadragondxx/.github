# Streaming Platform Configuration

## Overview

This directory contains configurations specific to live streaming and audio playback for the DJ/performer platform.

## Files

| File | Purpose |
|------|---------|
| `manifest-streaming.json` | PWA manifest with audio/streaming permissions |
| `csp-streaming.json` | Content Security Policy allowing media streams |
| `service-worker-streaming.js` | SW that caches mixes but never caches live streams |
| `background-audio.ts` | Controller for background/lock screen playback |
| `CONFORMANCE-CHECKLIST.md` | Browser testing checklist |

## Quick Start

### 1. Copy Manifest
```bash
cp .application/streaming/manifest-streaming.json public/manifest.json
```

### 2. Copy Service Worker
```bash
cp .application/streaming/service-worker-streaming.js public/sw.js
```

### 3. Add CSP Headers

In `next.config.js`:
```javascript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  media-src 'self' blob: mediastream: https://*.cloudflarestream.com https://*.mux.com;
  connect-src 'self' https: wss:;
  worker-src 'self' blob:;
  frame-ancestors 'none';
`;

module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: cspHeader.replace(/\n/g, '') },
        { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), autoplay=(self)' },
      ],
    }];
  },
};
```

### 4. Implement Background Audio

```typescript
import { backgroundAudio } from '@/lib/background-audio';

// Load a recorded mix
await backgroundAudio.loadTrack('/mixes/set-001.mp3', {
  title: 'Friday Night Set',
  artist: 'DJ Name',
  artwork: '/covers/set-001.jpg',
});

// Play/pause
backgroundAudio.play();
backgroundAudio.pause();

// Queue multiple mixes
backgroundAudio.setQueue([
  '/mixes/set-001.mp3',
  '/mixes/set-002.mp3',
  '/mixes/set-003.mp3',
]);
```

## Security Notes (PRIORITY)

### Never Cache These Routes
The service worker is configured to **never cache**:
- `/api/auth/*` - Authentication
- `/api/tokens/*` - Token transactions
- `/api/payment/*` - Payments
- `/api/payout/*` - Performer payouts
- `/studio/live` - Live streaming studio
- Any `.m3u8`, `.mpd` (live stream manifests)

### Always Cache These
- Static assets (JS, CSS, images)
- Recorded mixes (`/mixes/*`, `/recordings/*`)
- Offline page

### WebRTC Security
- Camera/microphone permissions requested explicitly
- Streams only sent to your signaling server
- TURN/STUN servers should be your own or trusted providers

## Streaming Architecture

```
Performer                    Platform                     Viewer
   │                            │                           │
   │ Camera/Mic ──WebRTC──►     │                           │
   │                            │ ──── HLS/DASH ──────►     │
   │                            │                           │
   │ ◄── Tokens ────────────────│◄───── Tokens ─────────    │
   │                            │                           │
   │ Old Mixes (cached) ◄───────│                           │
```

## Token System Integration

The service worker supports offline token queuing:

```javascript
// Queue a token transaction when offline
if (!navigator.onLine) {
  await saveToIndexedDB('pending-tokens', {
    type: 'tip',
    amount: 50,
    recipient: 'performer-id',
    timestamp: Date.now(),
  });

  // Register for background sync
  await registration.sync.register('sync-tokens');
}
```

When back online, pending transactions are synced automatically.

## Browser Support Matrix

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Live Streaming | ✅ | ✅ | ✅ | ✅ |
| Background Audio | ✅ | ✅ | ✅ | ✅ |
| Media Session | ✅ | ✅ | ✅ | ✅ |
| Offline Mixes | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ⚠️* | ✅ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |

*Safari iOS 16.4+ only, with limitations

## Testing

Use `CONFORMANCE-CHECKLIST.md` to verify functionality across all browsers.

### Quick Smoke Test
1. Open app in each browser
2. Start a test stream
3. Send a test token
4. Play a recorded mix
5. Lock screen → verify audio continues
6. Go offline → verify cached mixes play
7. Return online → verify tokens synced
