# Firefox PWA Configuration

## Overview

Firefox supports the Web App Manifest standard but with some differences from Chromium-based browsers.

**Note**: Firefox on desktop requires the [Progressive Web Apps for Firefox](https://addons.mozilla.org/firefox/addon/pwas-for-firefox/) extension for full PWA installation. Firefox on Android supports PWAs natively.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Standard Web App Manifest (Firefox-compatible subset) |

## Installation

1. Copy `manifest.json` to your `public/` directory
2. Link in your HTML `<head>`:

```html
<link rel="manifest" href="/manifest.json">
```

## Firefox-Specific Notes

### Desktop PWA Support
Firefox desktop doesn't natively support PWA installation. Options:

1. **PWAs for Firefox Extension**: Users install the extension, then can install PWAs
2. **Site-Specific Browser (SSB)**: Firefox's experimental feature (about:config)

### Android PWA Support
Firefox for Android fully supports PWAs:
- Install prompt appears automatically
- Standalone mode works
- Service workers function normally

### Supported Manifest Fields
Firefox supports these manifest properties:
- `name`, `short_name`, `description`
- `start_url`, `scope`
- `display` (standalone, minimal-ui, fullscreen, browser)
- `orientation`
- `theme_color`, `background_color`
- `icons`
- `shortcuts`
- `lang`, `dir`
- `categories`

### Unsupported/Limited Features
- `display_override` (ignored)
- `protocol_handlers` (limited)
- `file_handlers` (not supported)
- `share_target` (not supported)
- `handle_links` (not supported)

## Service Worker in Firefox

Firefox has full service worker support:

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  }).then(reg => {
    console.log('SW registered:', reg.scope);
  });
}
```

### Firefox-Specific Considerations

1. **Storage Quota**: Firefox may evict service worker cache under storage pressure
2. **Private Browsing**: Service workers disabled in private windows
3. **Enhanced Tracking Protection**: May affect third-party requests

## Security Features

Firefox has strong privacy/security defaults:

### Enhanced Tracking Protection
May block third-party cookies and trackers. Ensure your auth works:

```javascript
// Check if cookies are available
document.cookie = "test=1; SameSite=Strict; Secure";
```

### Permissions
```javascript
// Request permissions explicitly
const permission = await Notification.requestPermission();
```

## Testing

### Desktop
1. Install "PWAs for Firefox" extension
2. Visit your site
3. Click the extension icon to install

### Android
1. Visit your site in Firefox for Android
2. Look for "Add to Home screen" in menu
3. Or wait for install banner

### Developer Tools
1. Open DevTools (F12)
2. Application panel > Manifest
3. Check for warnings

## Debug Service Workers

```
about:debugging#/runtime/this-firefox
```

Lists all registered service workers with options to inspect/unregister.

## Resources

- [Firefox PWA Support](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWAs for Firefox Extension](https://github.com/nicegram/nicegram-firefox)
- [Firefox Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
