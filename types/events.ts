import {
    Seconds,
    VolumeLevel,
    PlaybackRate,
    CameraProperties,
    VimeoTextTrackCuePoint,
    ProportionPercent,
    VideoQuality,
    VimeoCuePoint,
    Pixels,
} from "./formats";

export enum PlayerEvent {
    /** Triggered when video playback is initiated */
    Play = "play",

    /** Triggered when the video pauses */
    Pause = "pause",

    /** Triggered any time the video playback reaches the end. Note: when loop is turned on, the ended event will not fire */
    Ended = "ended",

    /** Triggered as the currentTime of the video updates. Generally fires every 250ms, but may vary depending on the browser */
    TimeUpdate = "timeupdate",

    /** Triggered as the video is loaded. Reports back the amount of the video that has been buffered */
    Progress = "progress",

    /** Triggered when the player starts seeking to a specific time. A timeupdate event will also be fired at the same time */
    Seeking = "seeking",

    /** Triggered when the player seeks to a specific time. A timeupdate event will also be fired at the same time */
    Seeked = "seeked",

    /** Triggered when the active text track (captions/subtitles) changes. The values will be null if text tracks are turned off */
    TextTrackChange = "texttrackchange",

    /** Triggered when the active cue for the current text track changes. It also fires when the active text track changes. There may be multiple cues active */
    CueChange = "cuechange",

    /** Triggered when the current chapter changes */
    ChapterChange = "chapterchange",

    /** Triggered when the current time hits a registered cue point */
    CuePoint = "cuepoint",

    /** Triggered when a new video is loaded in the player */
    Loaded = "loaded",

    /** Triggered when video metadata is loaded */
    LoadedMetadata = "loadedmetadata",

    /** Triggered when the volume in the player changes. Some devices do not support setting the volume independently from system volume */
    VolumeChange = "volumechange",

    /** Triggered when the playback rate changes. The ability to change rate can be disabled by the creator */
    PlaybackRateChange = "playbackratechange",

    /** Triggered when the set quality changes */
    QualityChange = "qualitychange",

    /** Triggered when the player enters or exits fullscreen */
    FullscreenChange = "fullscreenchange",

    /** Triggered when any of the camera properties change for 360° videos */
    CameraChange = "camerachange",

    /** Triggered when the intrinsic size of the media changes */
    Resize = "resize",

    /** Triggered when the player enters picture-in-picture */
    EnterPictureInPicture = "enterpictureinpicture",

    /** Triggered when the player leaves picture-in-picture */
    LeavePictureInPicture = "leavepictureinpicture",

    /** Triggered when some kind of error is generated in the player */
    Error = "error",

    /** Triggered when buffering starts in the player. This is also triggered during preload and while seeking */
    BufferStart = "bufferstart",

    /** Triggered when buffering ends in the player. This is also triggered at the end of preload and seeking */
    BufferEnd = "bufferend",

    /** Triggered when the duration attribute has been updated */
    DurationChange = "durationchange",

    /** Triggered when the availability of remote playback changes */
    RemotePlaybackAvailabilityChanged = "remoteplaybackavailabilitychanged",

    /** Triggered when the player is attempting to connect to a remote playback device */
    RemotePlaybackConnecting = "remoteplaybackconnecting",

    /** Triggered when the player has successfully connected to a remote playback device */
    RemotePlaybackConnected = "remoteplaybackconnected",

    /** Triggered when the player has disconnected from a remote playback device */
    RemotePlaybackDisconnected = "remoteplaybackdisconnected",

    /** Triggered when a hotspot is clicked */
    InteractiveHotspotClicked = "interactivehotspotclicked",

    /** Triggered when the overlay panel (buttons or images) within the interactive overlay is clicked */
    InteractiveOverlayPanelClicked = "interactiveoverlaypanelclicked"
}

export interface VimeoEvent {
    duration: Seconds;
    percent: ProportionPercent;
    seconds: Seconds;
}

export interface FullscreenChangeEvent {
    fullscreen: boolean;
}

export interface TextTrackChangeEvent {
    kind: string | undefined;
    label: string | undefined;
    language: string | undefined;
}

export interface ChapterChangeEvent {
    startTime: Seconds;
    /** Title of the chapter */
    title: string;
    /**
     * The index property of each chapter is the place it holds
     * in the order of all the chapters. It starts at 1.
     */
    index: number;
}

export interface CuePointEvent<T = Record<string, unknown>> extends VimeoCuePoint<T> {}

export interface CueChangeEvent extends TextTrackChangeEvent {
    cues: VimeoTextTrackCuePoint[];
}

export interface LoadedEvent {
    id: number;
}

export interface DurationChangeEvent {
    duration: Seconds;
}

export interface VolumeChangeEvent {
    volume: VolumeLevel;
    muted: boolean;
}

export interface PlaybackRateChangeEvent {
    playbackRate: PlaybackRate;
}

export interface QualityChangeEvent {
    quality: VideoQuality;
}

export interface CameraChangeEvent extends CameraProperties {}

export interface ResizeEvent {
    videoWidth: Pixels;
    videoHeight: Pixels;
}

export interface ErrorEvent {
    name: string;
    message: string;
    method: string;
}

export interface InteractiveHotspotClickEvent {
    action: 'seek' | 'event' | 'none' | 'overlay' | 'url';
    actionPreference: {
        /**
         * // on `event`, `overlay`, `seek`, `url` action
         */
        pauseOnAction?: boolean;
        /**
         * on `overlay` action
         */
        overlayId?: number;
        /**
         * on `seek` action
         */
        seekTo?: number;
        /**
         * on `url` action
         */
        url?: string;
    };
    currentTime: number;
    customPayloadData: any | null;
    hotspotId: number;
}
export interface InteractiveOverlayPanelClickEvent {
    action: 'seek' | 'clickthrough' | 'close' | 'event' | 'none';
    actionPreference: {
        /** on `close`, `seek` action */
        pauseOnAction?: boolean;
        /** on `seek` action */
        seekTo?: number;
        /** on `clickthrough` action */
        url?: string;
    };
    currentTime: Seconds;
    customPayloadData: unknown | null;
    overlayId: number;
    panelId: string;
}

/**
 * Utility type that maps an event's data type to a generic version if supported
 */
export type EventDataWithGenerics<E extends PlayerEvent, T> = PlayerEventMap[E] extends CuePointEvent<any>
    ? CuePointEvent<T>
    : PlayerEventMap[E];

/** Maps event names to their corresponding event data types */
type EventString<T extends PlayerEvent> = T | (string & { _eventBrand?: T });

/** Maps event names to their corresponding event data types */
export interface PlayerEventMap {
    [PlayerEvent.Play]: VimeoEvent;
    play: VimeoEvent;
    [PlayerEvent.Pause]: VimeoEvent;
    pause: VimeoEvent;
    [PlayerEvent.Ended]: VimeoEvent;
    ended: VimeoEvent;
    [PlayerEvent.TimeUpdate]: VimeoEvent;
    timeupdate: VimeoEvent;
    [PlayerEvent.Progress]: VimeoEvent;
    progress: VimeoEvent;
    [PlayerEvent.Seeking]: VimeoEvent;
    seeking: VimeoEvent;
    [PlayerEvent.Seeked]: VimeoEvent;
    seeked: VimeoEvent;
    [PlayerEvent.TextTrackChange]: TextTrackChangeEvent;
    texttrackchange: TextTrackChangeEvent;
    [PlayerEvent.ChapterChange]: ChapterChangeEvent;
    chapterchange: ChapterChangeEvent;
    [PlayerEvent.CueChange]: CueChangeEvent;
    cuechange: CueChangeEvent;
    [PlayerEvent.CuePoint]: CuePointEvent;
    cuepoint: CuePointEvent;
    [PlayerEvent.Loaded]: LoadedEvent;
    loaded: LoadedEvent;
    [PlayerEvent.LoadedMetadata]: { duration: number };
    loadedmetadata: { duration: number };
    [PlayerEvent.VolumeChange]: VolumeChangeEvent;
    volumechange: VolumeChangeEvent;
    [PlayerEvent.PlaybackRateChange]: PlaybackRateChangeEvent;
    playbackratechange: PlaybackRateChangeEvent;
    [PlayerEvent.QualityChange]: QualityChangeEvent;
    qualitychange: QualityChangeEvent;
    [PlayerEvent.FullscreenChange]: FullscreenChangeEvent;
    fullscreenchange: FullscreenChangeEvent;
    [PlayerEvent.CameraChange]: CameraChangeEvent;
    camerachange: CameraChangeEvent;
    [PlayerEvent.Resize]: ResizeEvent;
    resize: ResizeEvent;
    [PlayerEvent.EnterPictureInPicture]: void;
    enterpictureinpicture: void;
    [PlayerEvent.LeavePictureInPicture]: void;
    leavepictureinpicture: void;
    [PlayerEvent.Error]: ErrorEvent;
    error: ErrorEvent;
    [PlayerEvent.BufferStart]: void;
    bufferstart: void;
    [PlayerEvent.BufferEnd]: void;
    bufferend: void;
    [PlayerEvent.DurationChange]: DurationChangeEvent;
    durationchange: DurationChangeEvent;
    [PlayerEvent.RemotePlaybackAvailabilityChanged]: void;
    remoteplaybackavailabilitychanged: void;
    [PlayerEvent.RemotePlaybackConnecting]: void;
    remoteplaybackconnecting: void;
    [PlayerEvent.RemotePlaybackConnected]: void;
    remoteplaybackconnected: void;
    [PlayerEvent.RemotePlaybackDisconnected]: void;
    remoteplaybackdisconnected: void;
    [PlayerEvent.InteractiveHotspotClicked]: InteractiveHotspotClickEvent;
    interactivehotspotclicked: InteractiveHotspotClickEvent;
    [PlayerEvent.InteractiveOverlayPanelClicked]: InteractiveOverlayPanelClickEvent;
    interactiveoverlaypanelclicked: InteractiveOverlayPanelClickEvent;
}
