# Chrome/Chromium PWA Configuration

## Overview

Chrome and Chromium-based browsers (Chrome, Edge, Brave, Opera) use the Web App Manifest for PWA installation.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Web App Manifest with full Chrome PWA features |

## Installation

1. Copy `manifest.json` to your `public/` directory
2. Link in your HTML `<head>`:

```html
<link rel="manifest" href="/manifest.json" crossorigin="use-credentials">
```

3. Add meta tags (see `../shared/meta-tags.html`)

## Chrome-Specific Features

### Window Controls Overlay
```json
"display_override": ["window-controls-overlay", "standalone"]
```
Enables custom title bar on desktop.

### Protocol Handlers
```json
"protocol_handlers": [{ "protocol": "web+get0ff", "url": "/handle?url=%s" }]
```
Register custom URL protocols.

### File Handlers
```json
"file_handlers": [{ "action": "/import", "accept": { "application/json": [".json"] }}]
```
Handle file types when opened.

### Share Target
Receive shared content from other apps.

### Edge Side Panel
```json
"edge_side_panel": { "preferred_width": 400 }
```
Works in Edge's side panel mode.

## Security Requirements

- Must be served over HTTPS
- Service worker required for offline
- CSP headers recommended (see `../security/`)

## Testing

```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Application tab > Manifest
3. Check for errors/warnings

# Lighthouse PWA Audit
1. DevTools > Lighthouse
2. Select "Progressive Web App"
3. Run audit
```

## Resources

- [Web App Manifest - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Chrome PWA Criteria](https://web.dev/install-criteria/)
