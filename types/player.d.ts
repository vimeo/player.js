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
    Pixels,
    VideoQualityId,
    VimeoAudioTrack,
    AudioLanguage,
    AudioKind,
} from "./formats";

import type {
    EventDataWithGenerics,
    PlayerEventMap,
} from "./events";

import type { TimingObject } from "timing-object";
import type { TimingSrcConnector, TimingSrcConnectorOptions } from "../src/lib/timing-src-connector";

/**
 * @typedef {import('./errors').RangeError} RangeError
 * @typedef {import('./errors').UnsupportedError} UnsupportedError
 * @typedef {import('./errors').InvalidParameterError} InvalidParameterError
 * @typedef {import('./errors').NotFoundError} NotFoundError
 * @typedef {import('./errors').PasswordError} PasswordError
 * @typedef {import('./errors').PrivacyError} PrivacyError
 */

declare class Player {
    /**
     * Create a new Player instance
     * @param {HTMLIFrameElement | HTMLElement | string} elementOrSelector - iframe to attach Player to, element to inject player into, or element id to find and inject player into
     * @param {VimeoEmbedParameters} [options] - Optional parameters for the player
     */
    constructor(
        elementOrSelector: HTMLIFrameElement | HTMLElement | string,
        options?: VimeoEmbedParameters
    );

    static isVimeoUrl(url: VimeoUrl | string): boolean;

    /**
     * Trigger a function when the player iframe has initialized.
     * You do not need to wait for ready to trigger to begin adding
     * event listeners or calling other methods.
     */
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
     * Pause the video if it is playing
     * @throws {PasswordError} If the video requires a password that was not provided
     * @throws {PrivacyError} If the video is private and requires authentication
     */
    pause(): Promise<void>;
    getPaused(): Promise<boolean>;

    /**
     * Set the volume of the player on a scale from 0 to 1.
     * When set via the API, the volume level will not be synchronized to
     * other players or stored as the viewer’s preference.
     * Most mobile devices (including iOS and Android) do not support
     * setting the volume because the volume is controlled at the system level.
     * An error will not be triggered in that situation.
     * @throws {RangeError} If volume is less than 0 or greater than 1
     */
    setVolume(volume: VolumeLevel): Promise<VolumeLevel>;

    /**
     * Get the current volume level between 0 and 1
     */
    getVolume(): Promise<VolumeLevel>;

    /**
     * Mute or unmute the video
     * @param {boolean} muted - Whether to mute the video
     */
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

    /**
     * Get the available video qualities
     */
    getQualities(): Promise<VimeoQuality[]>;

    /**
     * Get the current video quality
     */
    getQuality(): Promise<VideoQualityId>;

    /**
     * Set the quality of the video using the quality id (e.g. "2160p"). (available to Plus, PRO and Business accounts)
     * @throws {TypeError} If the specified quality is not available
     */
    setQuality(quality: VideoQualityId): Promise<VimeoQuality>;

    getSeekable(): Promise<TimeRange[]>;
    getSeeking(): Promise<boolean>;

    getBuffered(): Promise<TimeRange[]>;
    getPlayed(): Promise<TimeRange[]>;

    /**
     * Enable a text track
     * @throws {InvalidParameterError} If no track was available with the specified language
     * @throws {InvalidTrackError} If no track was available with the specified language and kind
     */
    enableTextTrack(language: string, kind?: string, showing?: boolean): Promise<VimeoTextTrack>;

    disableTextTrack(): Promise<void>;
    getTextTracks(): Promise<VimeoTextTrack[]>;

    /**
     * Enable an audio track
     * @throws {InvalidParameterError} If no track was available with the specified language
     * @throws {InvalidTrackError} If no track was available with the specified language and kind
     */
    selectAudioTrack(language: AudioLanguage, kind?: AudioKind): Promise<VimeoAudioTrack>;
    selectDefaultAudioTrack(): Promise<VimeoAudioTrack>;

    getAudioTracks(): Promise<VimeoAudioTrack[]>;
    getEnabledAudioTrack(): Promise<VimeoAudioTrack | undefined>;
    getDefaultAudioTrack(): Promise<VimeoAudioTrack | undefined>;

    getChapters(): Promise<VimeoChapter[]>;
    getCurrentChapter(): Promise<VimeoChapter | undefined>;

    /**
     * Add a cue point to the video
     * @throws {RangeError} If time is less than 0 or greater than the video's duration
     * @throws {UnsupportedError} If cue points are not supported
     */
    addCuePoint<T = Record<string, unknown>>(time: Seconds, data?: T): Promise<string>;

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
    getCuePoints<T = Record<string, unknown>>(): Promise<VimeoCuePoint<T>[]>;

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
        colors: VimeoColors
    ): Promise<VimeoColors>;

    /**
     * Get the camera properties for 360° videos
     */
    getCameraProps(): Promise<CameraProperties>;

    /**
     * Set the camera properties for 360° videos
     * @throws {RangeError} If any camera property is out of range
     */
    setCameraProps(
        camera: Partial<CameraProperties>
    ): Promise<CameraProperties>;

    /**
     * Get the embed code of the video (HTML iframe)
     * @throws {PrivacyError} If the video is private
     */
    getVideoEmbedCode(): Promise<string>;

    /**
     * Get the URL of the video
     * @throws {PrivacyError} If the video is private
     */
    getVideoUrl(): Promise<VimeoUrl>;

    /**
     * Get the video ID
     */
    getVideoId(): Promise<number>;

    /**
     * Get the video title
     */
    getVideoTitle(): Promise<string>;

    /**
     * Get the native width of the currently‐playing video.
     * The width of the highest resolution available will be used before playback begins.
     */
    getVideoWidth(): Promise<Pixels>;

    /**
     * Get the native height of the currently‐playing video.
     * The height of the highest resolution available will be used before playback begins.
     */
    getVideoHeight(): Promise<Pixels>;

    /**
     * Syncs a Timing Object to the video player (https://webtiming.github.io/timingobject/)
     */
    setTimingSrc(timingObject: typeof TimingObject, options?: TimingSrcConnectorOptions): Promise<TimingSrcConnector>;

    requestPictureInPicture(): Promise<void>;
    exitPictureInPicture(): Promise<void>;
    getPictureInPicture(): Promise<boolean>;

    requestFullscreen(): Promise<void>;
    exitFullscreen(): Promise<void>;
    getFullscreen(): Promise<boolean>;

    getEnded(): Promise<boolean>;

    unload(): Promise<void>;

    remotePlaybackPrompt(): Promise<void>;
    getRemotePlaybackAvailability(): Promise<boolean>;
    getRemotePlaybackState(): Promise<'connecting' | 'connected' | 'disconnected'>;

    /**
     * Add an event listener for the specified event
     * @param event The event name to listen for
     * @param callback The function to call when the event occurs
     */
    on<E extends keyof PlayerEventMap, T = Record<string, unknown>>(
        event: E,
        callback: (data: EventDataWithGenerics<E, T>) => void
    ): void;

    /**
     * Remove an event listener for the specified event
     * @param event The event name to stop listening for
     * @param callback The function to remove (optional, removes all listeners if not provided)
     */
    off<E extends keyof PlayerEventMap, T = Record<string, unknown>>(
        event: E,
        callback?: (data: EventDataWithGenerics<E, T>) => void
    ): void;

    /**
     * Add an event listener that will be triggered only once
     * @param event The event name to listen for
     * @param callback The function to call when the event occurs
     */
    once<E extends keyof PlayerEventMap, T = Record<string, unknown>>(
        event: E,
        callback: (data: EventDataWithGenerics<E, T>) => void
    ): void;
}

export default Player;
export * from "./events";
export * from "./errors";
export * from "./formats";
