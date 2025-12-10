# Microsoft Edge / Windows PWA Configuration

## Overview

Microsoft Edge is Chromium-based and supports all standard PWA features, plus Windows-specific integrations like widgets, taskbar shortcuts, and live tiles.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Full Web App Manifest with Edge extensions |
| `browserconfig.xml` | Windows tile and notification config |
| `windows-meta.html` | Meta tags for Windows integration |

## Installation

1. Copy `manifest.json` to your `public/` directory
2. Copy `browserconfig.xml` to your `public/` directory
3. Add meta tags from `windows-meta.html` to your `<head>`

## Edge-Specific Features

### Side Panel Support
```json
"edge_side_panel": {
  "preferred_width": 400
}
```
Allows your PWA to run in Edge's side panel.

### Windows Widgets
```json
"widgets": [{
  "name": "Quick Status",
  "tag": "status-widget",
  "ms_ac_template": "/widgets/status.json",
  "data": "/api/widgets/status"
}]
```
Create Windows 11 widget board widgets.

### Window Controls Overlay
```json
"display_override": ["window-controls-overlay", "standalone"]
```
Custom title bar with native window controls.

### Handle Links
```json
"handle_links": "preferred"
```
PWA becomes default handler for in-scope links.

## Windows Tile Icons

Create these icons for Windows Start menu tiles:

| Size | Purpose |
|------|---------|
| 70x70 | Small tile |
| 150x150 | Medium tile |
| 310x310 | Large tile |
| 310x150 | Wide tile |

## Taskbar Integration

### Jump List (Shortcuts)
```json
"shortcuts": [
  {
    "name": "Dashboard",
    "url": "/dashboard",
    "icons": [{ "src": "/icons/shortcut-dashboard.png", "sizes": "96x96" }]
  }
]
```

### Badge Notifications
```html
<meta name="msapplication-badge" content="frequency=30;polling-uri=/api/notifications/badge">
```

Server should return badge count at `/api/notifications/badge`.

## Windows 11 Widgets

### Widget Template (Adaptive Card)
Create `/public/widgets/status.json`:

```json
{
  "type": "AdaptiveCard",
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "Status: Online",
      "weight": "Bolder"
    }
  ]
}
```

### Widget Data Endpoint
Create `/api/widgets/status`:

```typescript
export async function GET() {
  return Response.json({
    status: "online",
    count: 42
  });
}
```

## Security Considerations

### Content Security Policy
Edge respects CSP headers. See `../security/` for recommended policies.

### Windows Defender SmartScreen
- New sites may trigger SmartScreen warnings
- Build reputation through legitimate usage
- Consider EV code signing for desktop apps

### Permissions
```javascript
// Request permissions with user gesture
button.onclick = async () => {
  const result = await Notification.requestPermission();
};
```

## Testing

### Edge DevTools
1. Open DevTools (F12)
2. Application tab > Manifest
3. Check for errors

### PWA Installation
1. Visit your site in Edge
2. Click install icon in address bar (or ... menu > Apps > Install)
3. Verify Windows integration (Start menu, taskbar)

### Widget Testing
1. Requires Windows 11
2. Add widget in Widget Board
3. Test refresh/data updates

## Publishing to Microsoft Store

PWAs can be published to the Microsoft Store:

1. Use [PWABuilder](https://pwabuilder.com)
2. Generate MSIX package
3. Submit to Partner Center

## Resources

- [Edge PWA Documentation](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/)
- [Windows Widget Development](https://docs.microsoft.com/en-us/windows/apps/design/widgets/)
- [PWABuilder](https://pwabuilder.com)
