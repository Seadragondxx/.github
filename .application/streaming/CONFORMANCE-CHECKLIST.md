# Browser Conformance Checklist

## Overview

Use this checklist to verify your streaming PWA works correctly across all browsers. **Security items are marked with 🔒 and are highest priority.**

---

## Phase 1: Security (Do First) 🔒

### All Browsers

- [ ] 🔒 HTTPS enforced (no HTTP access)
- [ ] 🔒 HSTS header present (`Strict-Transport-Security`)
- [ ] 🔒 CSP header blocks inline scripts in production
- [ ] 🔒 X-Frame-Options: DENY (prevent embedding)
- [ ] 🔒 Auth routes never cached by service worker
- [ ] 🔒 Payment/token routes never cached
- [ ] 🔒 Live streams never cached (always fresh)
- [ ] 🔒 Cookies have `Secure`, `HttpOnly`, `SameSite` flags
- [ ] 🔒 CORS only allows your domains
- [ ] 🔒 Rate limiting on API endpoints
- [ ] 🔒 Input validation on all forms
- [ ] 🔒 WebRTC permissions requested explicitly

### Test Security Headers
```bash
# Quick check
curl -I https://your-domain.com

# Full audit
npx is-website-vulnerable https://your-domain.com

# Online tools
# https://securityheaders.com
# https://observatory.mozilla.org
```

---

## Phase 2: Core PWA Functionality

### Chrome (Desktop & Android)

#### Installation
- [ ] Install prompt appears (address bar icon)
- [ ] App name and icon correct in prompt
- [ ] App installs to desktop/home screen
- [ ] App opens in standalone window (no browser UI)
- [ ] Shortcuts appear in right-click menu

#### Streaming
- [ ] Camera/microphone permissions work
- [ ] Live stream plays smoothly
- [ ] Screen share works (if applicable)
- [ ] WebRTC connects successfully
- [ ] No audio/video lag

#### Background Audio
- [ ] Audio continues when tab backgrounded
- [ ] Audio continues when screen locked
- [ ] Media Session controls appear in notification
- [ ] Play/pause/skip work from lock screen
- [ ] Album art shows in notification

#### Offline
- [ ] Offline page appears when disconnected
- [ ] Cached mixes play offline
- [ ] App shell loads offline
- [ ] Pending tokens sync when back online

#### Test Commands
```bash
# DevTools > Application > Manifest
# DevTools > Application > Service Workers
# DevTools > Lighthouse > PWA Audit
```

---

### Safari (iOS & macOS)

#### Installation
- [ ] "Add to Home Screen" works from share sheet
- [ ] App icon appears on home screen
- [ ] Splash screen displays on launch
- [ ] Status bar style correct (`black-translucent`)
- [ ] Safe area insets respected (notch)

#### Streaming
- [ ] Camera/microphone permissions work
- [ ] HLS streams play (`.m3u8`)
- [ ] Inline video works (`playsinline`)
- [ ] No autoplay issues (user gesture required)

#### Background Audio
- [ ] Audio plays when app backgrounded
- [ ] Control Center controls work
- [ ] Lock screen controls work
- [ ] Now Playing info shows (title, artist, artwork)
- [ ] Audio doesn't pause on screen lock

#### Known Limitations (Plan Workarounds)
- [ ] Push notifications (iOS 16.4+ only, with limitations)
- [ ] Background sync not supported
- [ ] Service worker may be evicted after 2 weeks
- [ ] No install prompt (manual add to home screen only)

#### Test Steps
```
1. Open Safari on iOS
2. Navigate to your site
3. Tap Share > Add to Home Screen
4. Open app from home screen
5. Test all streaming functions
6. Lock screen, verify audio continues
7. Check Control Center controls
```

---

### Firefox (Desktop & Android)

#### Installation (Desktop)
- [ ] Install "PWAs for Firefox" extension
- [ ] Extension icon shows install option
- [ ] App installs and opens standalone

#### Installation (Android)
- [ ] "Add to Home screen" appears in menu
- [ ] App icon on home screen
- [ ] Opens in standalone mode

#### Streaming
- [ ] Camera/microphone permissions work
- [ ] WebRTC functions correctly
- [ ] getUserMedia returns streams
- [ ] Audio/video playback smooth

#### Background Audio
- [ ] Audio continues in background tab
- [ ] Media controls in browser toolbar
- [ ] Picture-in-picture works (if implemented)

#### Privacy Features (Test Compatibility)
- [ ] Works with Enhanced Tracking Protection enabled
- [ ] Works with strict cookie blocking
- [ ] Third-party CDN resources load

#### Test Steps
```
1. Firefox > about:debugging > This Firefox
2. Check service worker status
3. Test with Enhanced Tracking Protection ON
4. Verify no resources blocked
```

---

### Edge (Windows 10/11)

#### Installation
- [ ] Install icon in address bar
- [ ] App appears in Start menu
- [ ] Taskbar shortcuts work
- [ ] Jump list shows app shortcuts

#### Windows 11 Widgets (Optional)
- [ ] Widget appears in Widget Board
- [ ] Widget data refreshes
- [ ] Widget click opens app

#### Side Panel
- [ ] App works in Edge side panel
- [ ] Responsive at 400px width

#### Streaming
- [ ] All Chrome features work (Chromium-based)
- [ ] Windows audio routing correct
- [ ] Screen share includes audio option

#### Background Audio
- [ ] System media controls work
- [ ] Windows notification shows Now Playing
- [ ] Keyboard media keys work

#### Test Steps
```
1. Edge > ... > Apps > Install this site as an app
2. Check Start menu for app
3. Right-click taskbar icon for shortcuts
4. Test Windows 11 widgets if implemented
```

---

## Phase 3: Streaming-Specific Tests

### Live Streaming (Go Live)

| Test | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Camera access | ☐ | ☐ | ☐ | ☐ |
| Microphone access | ☐ | ☐ | ☐ | ☐ |
| Stream starts | ☐ | ☐ | ☐ | ☐ |
| Stream visible to viewers | ☐ | ☐ | ☐ | ☐ |
| Chat works | ☐ | ☐ | ☐ | ☐ |
| Tokens received | ☐ | ☐ | ☐ | ☐ |
| Stream ends cleanly | ☐ | ☐ | ☐ | ☐ |

### Recorded Mixes (Playback)

| Test | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Mix loads | ☐ | ☐ | ☐ | ☐ |
| Playback starts | ☐ | ☐ | ☐ | ☐ |
| Seek works | ☐ | ☐ | ☐ | ☐ |
| Volume control | ☐ | ☐ | ☐ | ☐ |
| Background playback | ☐ | ☐ | ☐ | ☐ |
| Lock screen controls | ☐ | ☐ | ☐ | ☐ |
| Offline playback | ☐ | ☐ | ☐ | ☐ |
| Queue/playlist | ☐ | ☐ | ☐ | ☐ |

### Token System

| Test | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Token balance shows | ☐ | ☐ | ☐ | ☐ |
| Send tokens works | ☐ | ☐ | ☐ | ☐ |
| Receive tokens shows | ☐ | ☐ | ☐ | ☐ |
| Transaction history | ☐ | ☐ | ☐ | ☐ |
| Offline tokens sync | ☐ | ☐ | ☐ | ☐ |

---

## Phase 4: Performance

### Lighthouse Scores (Target: 90+)

| Metric | Chrome | Safari* | Firefox* | Edge |
|--------|--------|---------|----------|------|
| Performance | ☐ 90+ | N/A | N/A | ☐ 90+ |
| Accessibility | ☐ 90+ | N/A | N/A | ☐ 90+ |
| Best Practices | ☐ 90+ | N/A | N/A | ☐ 90+ |
| SEO | ☐ 90+ | N/A | N/A | ☐ 90+ |
| PWA | ☐ Pass | N/A | N/A | ☐ Pass |

*Lighthouse only runs in Chromium browsers

### Streaming Performance

- [ ] Stream latency < 3 seconds
- [ ] No buffering on stable connection
- [ ] Adaptive bitrate works
- [ ] Graceful degradation on slow networks
- [ ] Memory usage stable during long streams

---

## Phase 5: Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader announces controls
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Captions available (if applicable)
- [ ] Reduced motion respected

---

## Quick Test Commands

```bash
# Run all security checks
npx is-website-vulnerable https://your-domain.com

# Test manifest
curl https://your-domain.com/manifest.json | jq

# Test service worker
# DevTools > Application > Service Workers

# Test offline
# DevTools > Network > Offline checkbox

# Lighthouse CLI
npx lighthouse https://your-domain.com --view
```

---

## Browser Test Environments

### Recommended Devices

| Browser | Device/OS |
|---------|-----------|
| Chrome Desktop | Windows 11, macOS, Linux |
| Chrome Android | Pixel, Samsung Galaxy |
| Safari macOS | MacBook (latest macOS) |
| Safari iOS | iPhone 14+, iPad |
| Firefox Desktop | Windows, macOS |
| Firefox Android | Any Android device |
| Edge | Windows 10/11 |

### BrowserStack / LambdaTest

For cross-browser testing without physical devices.

---

## Sign-Off

| Phase | Completed | Date | Notes |
|-------|-----------|------|-------|
| Security 🔒 | ☐ | | |
| Core PWA | ☐ | | |
| Streaming | ☐ | | |
| Performance | ☐ | | |
| Accessibility | ☐ | | |

**Final Approval:** _________________ Date: _________
