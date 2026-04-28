/**
 * dotlottie-web
 * A JavaScript library for rendering Lottie and dotLottie animations in the browser.
 *
 * @module dotlottie-web
 */

export interface DotLottieConfig {
  /** The canvas element to render the animation on */
  canvas: HTMLCanvasElement;
  /** URL or path to the Lottie/dotLottie animation file */
  src?: string;
  /** Whether the animation should loop */
  loop?: boolean;
  /** Whether the animation should autoplay on load */
  autoplay?: boolean;
  /** Playback speed multiplier (default: 1) */
  speed?: number;
  /** Background color of the canvas */
  backgroundColor?: string;
  /** Render mode for the animation */
  renderConfig?: RenderConfig;
}

export interface RenderConfig {
  /** Device pixel ratio for rendering (default: window.devicePixelRatio) */
  devicePixelRatio?: number;
  /** Whether to freeze the animation on the last frame when not looping */
  freezeOnLastFrame?: boolean;
}

export type PlaybackState = 'playing' | 'paused' | 'stopped' | 'loading' | 'error';

export type DotLottieEventType =
  | 'load'
  | 'loadError'
  | 'play'
  | 'pause'
  | 'stop'
  | 'complete'
  | 'loop'
  | 'frame'
  | 'destroy';

export type DotLottieEventListener = (event?: unknown) => void;

/**
 * Main DotLottie class for rendering Lottie and dotLottie animations.
 */
export class DotLottie {
  private _canvas: HTMLCanvasElement;
  private _config: DotLottieConfig;
  private _state: PlaybackState = 'stopped';
  private _eventListeners: Map<DotLottieEventType, Set<DotLottieEventListener>> = new Map();
  private _currentFrame: number = 0;
  private _totalFrames: number = 0;

  public constructor(config: DotLottieConfig) {
    this._canvas = config.canvas;
    this._config = {
      loop: false,
      autoplay: false,
      speed: 1,
      ...config,
    };

    if (config.src) {
      this._load(config.src);
    }
  }

  /**
   * Returns the current playback state.
   */
  public get state(): PlaybackState {
    return this._state;
  }

  /**
   * Returns the current frame number.
   */
  public get currentFrame(): number {
    return this._currentFrame;
  }

  /**
   * Returns the total number of frames in the animation.
   */
  public get totalFrames(): number {
    return this._totalFrames;
  }

  /**
   * Loads an animation from a URL or path.
   */
  public load(src: string): void {
    this._config.src = src;
    this._load(src);
  }

  private _load(_src: string): void {
    this._state = 'loading';
    // Actual loading logic will be implemented with the renderer
  }

  /** Plays the animation. */
  public play(): void {
    if (this._state === 'loading' || this._state === 'error') return;
    this._state = 'playing';
    this._emit('play');
  }

  /** Pauses the animation. */
  public pause(): void {
    if (this._state !== 'playing') return;
    this._state = 'paused';
    this._emit('pause');
  }

  /** Stops the animation and resets to the first frame. */
  public stop(): void {
    this._state = 'stopped';
    this._currentFrame = 0;
    this._emit('stop');
  }

  /** Destroys the instance and cleans up resources. */
  public destroy(): void {
    this.stop();
    this._eventListeners.clear();
    this._emit('destroy');
  }

  /** Registers an event listener. */
  public addEventListener(event: DotLottieEventType, listener: DotLottieEventListener): void {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, new Set());
    }
    this._eventListeners.get(event)!.add(listener);
  }

  /** Removes a previously registered event listener. */
  public removeEventListener(event: DotLottieEventType, listener: DotLottieEventListener): void {
    this._eventListeners.get(event)?.delete(listener);
  }

  private _emit(event: DotLottieEventType, data?: unknown): void {
    this._eventListeners.get(event)?.forEach((listener) => listener(data));
  }
}

export default DotLottie;
