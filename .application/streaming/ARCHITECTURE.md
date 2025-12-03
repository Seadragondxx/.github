# Streaming Architecture

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                         YOUR DEVICE (Admin/DJ)                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Camera     │    │  Microphone  │    │   DJ Mixer   │          │
│  │   (Video)    │    │   (Voice)    │    │   (Music)    │          │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘          │
│         │                   │                   │                   │
│         └───────────────────┼───────────────────┘                   │
│                             ▼                                        │
│                    ┌─────────────────┐                              │
│                    │  Your Browser   │                              │
│                    │  (PWA Studio)   │◄── You see yourself here     │
│                    └────────┬────────┘                              │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              │ WebRTC / RTMP
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        MEDIA SERVER (Cloud)                          │
│                                                                      │
│    ┌────────────────┐    ┌────────────────┐    ┌────────────────┐  │
│    │   Transcode    │───►│   HLS/DASH     │───►│   CDN Edge     │  │
│    │   (Quality)    │    │   (Segments)   │    │   (Global)     │  │
│    └────────────────┘    └────────────────┘    └────────────────┘  │
│                                                                      │
│    Providers: Cloudflare Stream, Mux, AWS IVS, Livepeer             │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HLS Stream (HTTPS)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       VIEWER DEVICES (Worldwide)                     │
│                                                                      │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐              │
│   │  Viewer 1   │   │  Viewer 2   │   │  Viewer 3   │   ...        │
│   │  (Phone)    │   │  (Desktop)  │   │  (Tablet)   │              │
│   │             │   │             │   │             │              │
│   │ ┌─────────┐ │   │ ┌─────────┐ │   │ ┌─────────┐ │              │
│   │ │ YOUR    │ │   │ │ YOUR    │ │   │ │ YOUR    │ │              │
│   │ │ STREAM  │ │   │ │ STREAM  │ │   │ │ STREAM  │ │              │
│   │ │ HERE    │ │   │ │ HERE    │ │   │ │ HERE    │ │              │
│   │ └─────────┘ │   │ └─────────┘ │   │ └─────────┘ │              │
│   │             │   │             │   │             │              │
│   │ 🎵 Crystal  │   │ 🎵 Crystal  │   │ 🎵 Crystal  │              │
│   │    Clear    │   │    Clear    │   │    Clear    │              │
│   │    Audio    │   │    Audio    │   │    Audio    │              │
│   └─────────────┘   └─────────────┘   └─────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

## Audio Quality Settings

For DJ/music streaming, we prioritize audio quality:

| Setting | Value | Why |
|---------|-------|-----|
| Audio Bitrate | 256-320 kbps | CD-quality music |
| Audio Codec | AAC or Opus | Best quality/compression |
| Sample Rate | 48kHz | Professional standard |
| Channels | Stereo | Full stereo mix |

### Recommended Stream Settings

```javascript
const streamConfig = {
  audio: {
    bitrate: 320000,      // 320 kbps for music
    sampleRate: 48000,    // 48 kHz
    channelCount: 2,      // Stereo
    echoCancellation: false, // Don't process music
    noiseSuppression: false, // Keep full frequency range
    autoGainControl: false,  // Manual gain control
  },
  video: {
    width: 1280,
    height: 720,
    frameRate: 30,
    bitrate: 2500000,     // 2.5 Mbps
  }
};
```

## What Viewers Experience

1. **They open your link** → Your PWA loads
2. **They see your window** → Video player with your stream
3. **They hear your music** → Crystal clear, low latency (2-5 seconds)
4. **They can interact** → Send tokens, chat, react
5. **It works everywhere** → Phone, tablet, desktop, any browser

## Token Flow

```
Viewer                     Platform                    You (Performer)
  │                           │                              │
  │ ──── Sends 50 tokens ────►│                              │
  │                           │ ──── Notification ──────────►│
  │                           │                              │
  │                           │ ──── 50 tokens added ───────►│
  │                           │      (minus platform fee)    │
  │                           │                              │
  │ ◄─── Animation shown ─────│                              │
  │                           │                              │
```

## When You're Offline (Playing Old Mixes)

Viewers can still enjoy your pre-recorded sets:

```
┌─────────────────────────────────────────────────────────┐
│                     VIEWER'S DEVICE                      │
│                                                          │
│   ┌────────────────────────────────────────────────┐    │
│   │              YOUR PROFILE                       │    │
│   │                                                 │    │
│   │   [🔴 OFFLINE]                                 │    │
│   │                                                 │    │
│   │   ┌─────────────────────────────────────┐     │    │
│   │   │         YOUR PHOTO                   │     │    │
│   │   │                                      │     │    │
│   │   └─────────────────────────────────────┘     │    │
│   │                                                 │    │
│   │   🎵 Now Playing: Friday Night Set #42         │    │
│   │   ▶️ advancement bar ════════════●════════     │    │
│   │                                                 │    │
│   │   [Previous] [Play/Pause] [Next] [Queue]       │    │
│   │                                                 │    │
│   │   Recorded Mixes:                              │    │
│   │   • Friday Night Set #42 (Playing)             │    │
│   │   • Deep House Sunday                          │    │
│   │   • Techno Thursday Live                       │    │
│   │                                                 │    │
│   └────────────────────────────────────────────────┘    │
│                                                          │
│   Audio plays with same quality as live stream          │
│   Cached locally for offline playback                   │
└─────────────────────────────────────────────────────────┘
```

## Latency Comparison

| Method | Latency | Use Case |
|--------|---------|----------|
| WebRTC | 0.5-2s | Interactive (chat, reactions) |
| Low-latency HLS | 2-5s | Good for most streaming |
| Standard HLS | 10-30s | Maximum compatibility |

**Recommendation**: Use low-latency HLS for best balance of quality and interaction.

## Streaming Providers (Pick One)

| Provider | Free Tier | Best For | Audio Quality |
|----------|-----------|----------|---------------|
| **Cloudflare Stream** | 1000 min/mo | Easy setup, global CDN | Excellent |
| **Mux** | 100 min free | Best analytics | Excellent |
| **Livepeer** | Pay-as-you-go | Decentralized, cheap | Excellent |
| **AWS IVS** | 5 hrs/mo | AWS ecosystem | Excellent |

## Summary

**Yes, when you go live:**
- You appear in a window on every viewer's device
- They hear your music with crystal clear quality
- Works on any device, any browser
- Low latency for real-time interaction
- When offline, your recorded mixes play automatically
