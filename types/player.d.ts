import type {
    VimeoEmbedParameters,
    VimeoUrl,
    LoadVideoOptions,
    HexColor,
    VolumeLevel,
    PlaybackRate,
    VimeoQuality,
    TimeRange,
    VimeoTextTrack,
    VimeoChapter,
    VimeoCuePoint,
    CameraProperties,
    Seconds,
    VimeoColors,
} from "./formats";

import type {
    PlayerEvent,
    PlayerEventMap,
} from "./events";

/**
 * @typedef {import('./errors').RangeError} RangeError
 * @typedef {import('./errors').UnsupportedError} UnsupportedError
 * @typedef {import('./errors').InvalidParameterError} InvalidParameterError
 * @typedef {import('./errors').NotFoundError} NotFoundError
 * @typedef {import('./errors').PasswordError} PasswordError
 * @typedef {import('./errors').PrivacyError} PrivacyError
 */

declare class Player {
    constructor(
        element: HTMLIFrameElement | HTMLElement | string,
        options?: VimeoEmbedParameters
    );

    static isVimeoUrl(url: VimeoUrl | string): boolean;

    ready(): Promise<void>;
    destroy(): Promise<void>;

    /**
     * Load a new video into the player
     * @throws {PasswordError} If the video requires a password that was not provided
     * @throws {PrivacyError} If the video is private and requires authentication
     * @throws {NotFoundError} If the video does not exist
     */
    loadVideo(loadOptions: LoadVideoOptions): Promise<void>;

    /**
     * Play the video
     * @throws {PasswordError} If the video requires a password that was not provided
     * @throws {PrivacyError} If the video is private and requires authentication
     */
    play(): Promise<void>;

    /**
     * Play the video
     * @throws {PasswordError} If the video requires a password that was not provided
     * @throws {PrivacyError} If the video is private and requires authentication
     */
    pause(): Promise<void>;
    getPaused(): Promise<boolean>;

    /**
     * Set the volume level
     * @throws {RangeError} If volume is less than 0 or greater than 1
     */
    setVolume(volume: VolumeLevel): Promise<VolumeLevel>;
    getVolume(): Promise<VolumeLevel>;
    setMuted(muted: boolean): Promise<boolean>;
    getMuted(): Promise<boolean>;

    /**
     * Seek to a specific time in the video
     * @throws {RangeError} If seconds is less than 0 or greater than the video's duration
     */
    setCurrentTime(seconds: Seconds): Promise<Seconds>;
    getCurrentTime(): Promise<Seconds>;
    getDuration(): Promise<Seconds>;
    setAutopause(autopause: boolean): Promise<boolean>;
    getAutopause(): Promise<boolean>;

    /**
     * Set the playback rate
     * @throws {RangeError} If playbackRate is less than 0.5 or greater than 2
     */
    setPlaybackRate(playbackRate: PlaybackRate): Promise<PlaybackRate>;
    getPlaybackRate(): Promise<PlaybackRate>;

    setLoop(loop: boolean): Promise<boolean>;
    getLoop(): Promise<boolean>;

    getQualities(): Promise<VimeoQuality[]>;
    getQuality(): Promise<VimeoQuality>;
    setQuality(quality: VimeoQuality): Promise<VimeoQuality>;

    getSeekable(): Promise<TimeRange[]>;
    getSeeking(): Promise<boolean>;

    getBuffered(): Promise<TimeRange[]>;
    getPlayed(): Promise<TimeRange[]>;

    /**
     * Enable a text track
     * @throws {InvalidParameterError} If no track was available with the specified language
     */
    enableTextTrack(language: string, kind?: string): Promise<VimeoTextTrack>;
    disableTextTrack(): Promise<void>;
    getTextTracks(): Promise<VimeoTextTrack[]>;

    getChapters(): Promise<VimeoChapter[]>;
    getCurrentChapter(): Promise<VimeoChapter | undefined>;

    /**
     * Add a cue point to the video
     * @throws {RangeError} If time is less than 0 or greater than the video's duration
     * @throws {UnsupportedError} If cue points are not supported
     */
    addCuePoint(time: Seconds, data?: Record<string, any>): Promise<string>;

    /**
     * Remove a cue point from the video
     * @throws {InvalidParameterError} If the cue point with the specified ID cannot be found
     * @throws {UnsupportedError} If cue points are not supported
     */
    removeCuePoint(id: string): Promise<string>;

    /**
     * Get all active cue points
     * @throws {UnsupportedError} If cue points are not supported
     */
    getCuePoints(): Promise<VimeoCuePoint[]>;

    /**
     * Get the primary player color
     */
    getColor(): Promise<HexColor>;

    /**
     * Set the primary player color
     * @throws {TypeError} If the color is not a valid hex or rgb color
     */
    setColor(color: HexColor): Promise<HexColor>;

    getColors(): Promise<VimeoColors>;

    /**
     * Set multiple player colors
     * @throws {TypeError} If any color is not a valid hex or rgb color
     */
    setColors(
        colors: [HexColor?, HexColor?, HexColor?, HexColor?]
    ): Promise<VimeoColors>;

    getCameraProps(): Promise<CameraProperties>;
    setCameraProps(
        camera: Partial<CameraProperties>
    ): Promise<CameraProperties>;

    /**
     * Get the embed code of the video
     * @throws {PrivacyError} If the video is private
     */
    getVideoEmbedCode(): Promise<string>;

    /**
     * Get the URL of the video
     * @throws {PrivacyError} If the video is private
     */
    getVideoUrl(): Promise<VimeoUrl>;

    requestPictureInPicture(): Promise<void>;
    exitPictureInPicture(): Promise<void>;
    getPictureInPicture(): Promise<boolean>;

    requestFullscreen(): Promise<void>;
    exitFullscreen(): Promise<void>;
    getFullscreen(): Promise<boolean>;

    /**
     * Add an event listener for the specified event
     * @param event The event name to listen for
     * @param callback The function to call when the event occurs
     */
    on<E extends PlayerEvent>(
        event: E,
        callback: (data: PlayerEventMap[E]) => void
    ): void;

    /**
     * Remove an event listener for the specified event
     * @param event The event name to stop listening for
     * @param callback The function to remove (optional, removes all listeners if not provided)
     */
    off<E extends PlayerEvent>(
        event: E,
        callback?: (data: PlayerEventMap[E]) => void
    ): void;

    /**
     * Add an event listener that will be triggered only once
     * @param event The event name to listen for
     * @param callback The function to call when the event occurs
     */
    once<E extends PlayerEvent>(
        event: E,
        callback: (data: PlayerEventMap[E]) => void
    ): void;
}

export default Player;
