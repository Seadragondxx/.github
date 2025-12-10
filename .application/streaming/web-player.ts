/**
 * Web Audio Player - No App Install Required
 *
 * Viewers visit the website → music plays immediately
 * Works in any browser, no download needed
 */

interface StreamConfig {
  liveStreamUrl?: string;      // Current live performer
  radioStreamUrl: string;       // 24/7 station (fallback)
  volume: number;
  autoplay: boolean;
}

interface PerformerRoom {
  id: string;
  name: string;
  isLive: boolean;
  streamUrl?: string;
  genre: 'techno' | 'hiphop' | 'latin' | 'mixed';
}

class WebPlayer {
  private audio: HTMLAudioElement;
  private video: HTMLVideoElement | null = null;
  private config: StreamConfig;
  private isPlaying: boolean = false;
  private hasUserInteracted: boolean = false;

  constructor(config: StreamConfig) {
    this.config = config;
    this.audio = new Audio();
    this.setupAudio();
    this.setupAutoplayWorkaround();
  }

  /**
   * Setup audio element for streaming
   */
  private setupAudio(): void {
    this.audio.preload = 'auto';
    this.audio.volume = this.config.volume;

    // For iOS
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');

    // Auto-reconnect on error
    this.audio.addEventListener('error', () => {
      console.log('Stream error, reconnecting...');
      setTimeout(() => this.reconnect(), 3000);
    });

    // Loop back to radio when stream ends
    this.audio.addEventListener('ended', () => {
      this.playRadio();
    });
  }

  /**
   * Handle browser autoplay restrictions
   * Music starts on first user interaction (click anywhere)
   */
  private setupAutoplayWorkaround(): void {
    const startPlayback = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        this.play();

        // Remove listeners after first interaction
        document.removeEventListener('click', startPlayback);
        document.removeEventListener('touchstart', startPlayback);
        document.removeEventListener('keydown', startPlayback);
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', startPlayback);
    document.addEventListener('touchstart', startPlayback);
    document.addEventListener('keydown', startPlayback);

    // Try to autoplay (works if user has interacted with site before)
    this.attemptAutoplay();
  }

  /**
   * Attempt autoplay - browsers allow if user has prior engagement
   */
  private async attemptAutoplay(): Promise<void> {
    try {
      this.audio.src = this.config.radioStreamUrl;
      this.audio.muted = true; // Muted autoplay usually allowed
      await this.audio.play();

      // Unmute after successful play
      this.audio.muted = false;
      this.isPlaying = true;
      this.hasUserInteracted = true;

      console.log('Autoplay successful');
    } catch (error) {
      // Autoplay blocked - show "Click to play" UI
      console.log('Autoplay blocked, waiting for user interaction');
      this.showPlayPrompt();
    }
  }

  /**
   * Show unobtrusive play prompt
   */
  private showPlayPrompt(): void {
    // Dispatch event for UI to show play button
    window.dispatchEvent(new CustomEvent('audio-needs-interaction', {
      detail: { message: 'Tap anywhere to start music' }
    }));
  }

  /**
   * Play audio (call after user interaction)
   */
  public async play(): Promise<void> {
    try {
      if (!this.audio.src) {
        this.audio.src = this.config.liveStreamUrl || this.config.radioStreamUrl;
      }
      await this.audio.play();
      this.isPlaying = true;

      window.dispatchEvent(new CustomEvent('audio-playing'));
    } catch (error) {
      console.error('Playback failed:', error);
    }
  }

  /**
   * Pause audio
   */
  public pause(): void {
    this.audio.pause();
    this.isPlaying = false;
  }

  /**
   * Toggle play/pause
   */
  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Enter a performer's room - switch to their stream
   */
  public async enterRoom(room: PerformerRoom): Promise<void> {
    if (room.isLive && room.streamUrl) {
      // Switch to live performer
      this.audio.src = room.streamUrl;
      await this.play();

      console.log(`Now playing: ${room.name} (${room.genre})`);
    } else {
      // Performer offline - play radio station
      this.playRadio();
    }
  }

  /**
   * Leave room - switch back to radio
   */
  public leaveRoom(): void {
    this.playRadio();
  }

  /**
   * Play 24/7 radio station
   */
  public playRadio(): void {
    this.audio.src = this.config.radioStreamUrl;
    this.play();
    console.log('Playing: 24/7 Radio Station');
  }

  /**
   * Reconnect to stream
   */
  private reconnect(): void {
    const currentSrc = this.audio.src;
    this.audio.src = '';
    this.audio.src = currentSrc;
    this.play();
  }

  /**
   * Set volume (0-1)
   */
  public setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.config.volume = this.audio.volume;
  }

  /**
   * Get current volume
   */
  public getVolume(): number {
    return this.audio.volume;
  }

  /**
   * Mute/unmute
   */
  public toggleMute(): void {
    this.audio.muted = !this.audio.muted;
  }

  /**
   * Check if currently playing
   */
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Export singleton for easy use
export const webPlayer = new WebPlayer({
  radioStreamUrl: '/api/radio/stream', // Your 24/7 stream URL
  volume: 0.8,
  autoplay: true,
});

export default WebPlayer;


/**
 * USAGE IN YOUR SITE:
 *
 * // On page load - music tries to autoplay
 * import { webPlayer } from './web-player';
 *
 * // When viewer enters a performer's room
 * webPlayer.enterRoom({
 *   id: 'dj-mike',
 *   name: 'DJ Mike',
 *   isLive: true,
 *   streamUrl: 'https://stream.example.com/dj-mike',
 *   genre: 'techno'
 * });
 *
 * // When viewer leaves room (back to lobby)
 * webPlayer.leaveRoom(); // switches to 24/7 radio
 *
 * // Volume control
 * webPlayer.setVolume(0.5);
 *
 * // NO INSTALL NEEDED - this is just JavaScript in the browser
 */
