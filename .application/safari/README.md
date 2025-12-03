# Safari/iOS PWA Configuration

## Overview

Safari on iOS and macOS requires specific meta tags and icons for PWA ("Add to Home Screen") functionality.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Simplified manifest (Safari ignores many fields) |
| `apple-touch-icons.html` | All required meta tags and icon links |

## Installation

1. Copy `manifest.json` to your `public/` directory
2. Add all meta tags from `apple-touch-icons.html` to your `<head>`
3. Create all required icon sizes (see below)

## Required Icons

### Apple Touch Icons
Safari requires multiple icon sizes for different devices:

| Size | Device |
|------|--------|
| 57x57 | iPhone (non-Retina) |
| 60x60 | iPhone (iOS 7+) |
| 72x72 | iPad (non-Retina) |
| 76x76 | iPad (iOS 7+) |
| 114x114 | iPhone (Retina) |
| 120x120 | iPhone (iOS 7+ Retina) |
| 144x144 | iPad (Retina) |
| 152x152 | iPad (iOS 7+ Retina) |
| 167x167 | iPad Pro |
| 180x180 | iPhone 6 Plus |
| 1024x1024 | App Store |

### Safari Pinned Tab
SVG icon with single color for Safari pinned tabs:
```html
<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#0f172a">
```

## Splash Screens

iOS requires device-specific splash screens. Generate all sizes listed in `apple-touch-icons.html`.

### Quick Generation (using pwa-asset-generator)

```bash
npx pwa-asset-generator ./logo.png ./public/icons \
  --splash-only --type png --background "#ffffff"
```

## Safari-Specific Behaviors

### Status Bar Style
```html
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```
Options: `default`, `black`, `black-translucent`

### Standalone Mode Detection
```javascript
if (window.navigator.standalone === true) {
  // Running as installed PWA on iOS
}
```

### Safe Area Insets (Notch)
```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

## Limitations

Safari PWAs have some limitations compared to Chrome:

- No background sync
- No push notifications (iOS 16.4+ supports with limitations)
- No Web Bluetooth
- Service worker eviction after 2 weeks of non-use
- No install prompt (users must manually "Add to Home Screen")

## Security Notes

- Service workers require HTTPS
- Cross-origin requests need proper CORS headers
- Cookies require `SameSite` and `Secure` attributes

## Testing

1. Open Safari on iOS
2. Navigate to your site
3. Tap Share button > "Add to Home Screen"
4. Verify icon and name appear correctly
5. Open from home screen to test standalone mode

## Resources

- [Apple PWA Documentation](https://developer.apple.com/documentation/webkit/developing_a_webpage_for_safari)
- [Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
