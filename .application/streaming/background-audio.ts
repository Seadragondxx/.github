/**
 * Background Audio Controller
 * Enables audio playback when app is in background or screen is off
 *
 * SECURITY: Only plays user-uploaded content or approved streams
 */

interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
}

interface AudioState {
  isPlaying: boolean;
  currentTrack: TrackMetadata | null;
  queue: string[];
  currentIndex: number;
}

class BackgroundAudioController {
  private audio: HTMLAudioElement | null = null;
  private state: AudioState = {
    isPlaying: false,
    currentTrack: null,
    queue: [],
    currentIndex: 0,
  };

  constructor() {
    this.initAudio();
    this.initMediaSession();
    this.initVisibilityHandler();
  }

  /**
   * Initialize audio element with background playback support
   */
  private initAudio(): void {
    this.audio = new Audio();

    // Enable background playback
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');

    // Prevent audio from being suspended
    this.audio.addEventListener('pause', () => {
      if (this.state.isPlaying && document.hidden) {
        // Attempt to resume if paused while in background
        this.audio?.play().catch(() => {});
      }
    });

    this.audio.addEventListener('ended', () => {
      this.playNext();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.playNext();
    });
  }

  /**
   * Initialize Media Session API for lock screen / notification controls
   */
  private initMediaSession(): void {
    if (!('mediaSession' in navigator)) {
      console.warn('Media Session API not supported');
      return;
    }

    // Set action handlers
    navigator.mediaSession.setActionHandler('play', () => this.play());
    navigator.mediaSession.setActionHandler('pause', () => this.pause());
    navigator.mediaSession.setActionHandler('stop', () => this.stop());
    navigator.mediaSession.setActionHandler('previoustrack', () => this.playPrevious());
    navigator.mediaSession.setActionHandler('nexttrack', () => this.playNext());

    // Seek handlers (for scrubbing)
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      if (this.audio) {
        this.audio.currentTime = Math.max(0, this.audio.currentTime - (details.seekOffset || 10));
      }
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      if (this.audio) {
        this.audio.currentTime = Math.min(
          this.audio.duration,
          this.audio.currentTime + (details.seekOffset || 10)
        );
      }
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (this.audio && details.seekTime !== undefined) {
        this.audio.currentTime = details.seekTime;
      }
    });
  }

  /**
   * Handle visibility changes (keep audio playing in background)
   */
  private initVisibilityHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.isPlaying) {
        // App went to background while playing - ensure playback continues
        this.ensurePlayback();
      }
    });

    // Handle iOS-specific background audio
    window.addEventListener('pagehide', () => {
      if (this.state.isPlaying) {
        this.ensurePlayback();
      }
    });
  }

  /**
   * Ensure playback continues (especially on iOS)
   */
  private ensurePlayback(): void {
    if (this.audio && this.state.isPlaying) {
      // iOS workaround: recreate audio context if suspended
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
  }

  /**
   * Update Media Session metadata (shows on lock screen)
   */
  private updateMediaSession(track: TrackMetadata): void {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album || 'Get0ff Live',
      artwork: track.artwork ? [
        { src: track.artwork, sizes: '96x96', type: 'image/png' },
        { src: track.artwork, sizes: '128x128', type: 'image/png' },
        { src: track.artwork, sizes: '192x192', type: 'image/png' },
        { src: track.artwork, sizes: '256x256', type: 'image/png' },
        { src: track.artwork, sizes: '384x384', type: 'image/png' },
        { src: track.artwork, sizes: '512x512', type: 'image/png' },
      ] : [],
    });

    // Update playback state
    navigator.mediaSession.playbackState = this.state.isPlaying ? 'playing' : 'paused';
  }

  /**
   * Update position state for scrubber
   */
  private updatePositionState(): void {
    if (!('mediaSession' in navigator) || !this.audio) return;

    try {
      navigator.mediaSession.setPositionState({
        duration: this.audio.duration || 0,
        playbackRate: this.audio.playbackRate,
        position: this.audio.currentTime,
      });
    } catch (e) {
      // Position state not supported or invalid
    }
  }

  /**
   * Load and play a track
   */
  public async loadTrack(url: string, metadata: TrackMetadata): Promise<void> {
    if (!this.audio) return;

    this.state.currentTrack = metadata;
    this.audio.src = url;

    try {
      await this.audio.load();
      await this.play();
      this.updateMediaSession(metadata);
    } catch (error) {
      console.error('Failed to load track:', error);
      throw error;
    }
  }

  /**
   * Set queue of tracks (for old mixes playlist)
   */
  public setQueue(urls: string[]): void {
    this.state.queue = urls;
    this.state.currentIndex = 0;
  }

  /**
   * Play current track
   */
  public async play(): Promise<void> {
    if (!this.audio) return;

    try {
      await this.audio.play();
      this.state.isPlaying = true;
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    } catch (error) {
      console.error('Playback failed:', error);
      // Handle autoplay restrictions
      if ((error as Error).name === 'NotAllowedError') {
        console.log('Autoplay blocked - waiting for user interaction');
      }
    }
  }

  /**
   * Pause playback
   */
  public pause(): void {
    if (!this.audio) return;

    this.audio.pause();
    this.state.isPlaying = false;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
    }
  }

  /**
   * Stop playback and reset
   */
  public stop(): void {
    if (!this.audio) return;

    this.audio.pause();
    this.audio.currentTime = 0;
    this.state.isPlaying = false;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
    }
  }

  /**
   * Play next track in queue
   */
  public playNext(): void {
    if (this.state.queue.length === 0) return;

    this.state.currentIndex = (this.state.currentIndex + 1) % this.state.queue.length;
    const nextUrl = this.state.queue[this.state.currentIndex];

    if (nextUrl && this.audio) {
      this.audio.src = nextUrl;
      this.play();
    }
  }

  /**
   * Play previous track in queue
   */
  public playPrevious(): void {
    if (this.state.queue.length === 0) return;

    this.state.currentIndex = this.state.currentIndex === 0
      ? this.state.queue.length - 1
      : this.state.currentIndex - 1;

    const prevUrl = this.state.queue[this.state.currentIndex];

    if (prevUrl && this.audio) {
      this.audio.src = prevUrl;
      this.play();
    }
  }

  /**
   * Get current playback time
   */
  public getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  /**
   * Get track duration
   */
  public getDuration(): number {
    return this.audio?.duration || 0;
  }

  /**
   * Seek to position
   */
  public seek(time: number): void {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration || 0));
      this.updatePositionState();
    }
  }

  /**
   * Set volume (0-1)
   */
  public setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Check if currently playing
   */
  public isPlaying(): boolean {
    return this.state.isPlaying;
  }
}

// Export singleton instance
export const backgroundAudio = new BackgroundAudioController();

// Export for use in components
export default BackgroundAudioController;
