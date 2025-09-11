import type {
    Seconds,
    VolumeLevel,
    PlaybackRate,
    CameraProperties,
    VimeoTextTrackCuePoint,
    ProportionPercent,
    VideoQualityId,
    VimeoCuePoint,
    Pixels,
} from "./formats";

export interface VimeoEvent {
    duration: Seconds;
    percent: ProportionPercent;
    seconds: Seconds;
}

export interface FullscreenChangeEvent {
    fullscreen: boolean;
}

export interface TextTrackChangeEvent {
    kind: string | null;
    label: string | null;
    language: string | null;
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
    quality: VideoQualityId;
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
         * on `event`, `overlay`, `seek`, `url` action
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
export type EventDataWithGenerics<E extends keyof PlayerEventMap, T> = PlayerEventMap[E] extends CuePointEvent<any>
    ? CuePointEvent<T>
    : PlayerEventMap[E];

/** Maps event names to their corresponding event data types */
export interface PlayerEventMap {
    play: VimeoEvent;
    playing: VimeoEvent;
    pause: VimeoEvent;
    ended: VimeoEvent;
    timeupdate: VimeoEvent;
    progress: VimeoEvent;
    seeking: VimeoEvent;
    seeked: VimeoEvent;
    texttrackchange: TextTrackChangeEvent;
    chapterchange: ChapterChangeEvent;
    cuechange: CueChangeEvent;
    cuepoint: CuePointEvent;
    loaded: LoadedEvent;
    loadedmetadata: { duration: number };
    volumechange: VolumeChangeEvent;
    playbackratechange: PlaybackRateChangeEvent;
    qualitychange: QualityChangeEvent;
    fullscreenchange: FullscreenChangeEvent;
    camerachange: CameraChangeEvent;
    resize: ResizeEvent;
    enterpictureinpicture: void;
    leavepictureinpicture: void;
    error: ErrorEvent;
    bufferstart: void;
    bufferend: void;
    durationchange: DurationChangeEvent;
    remoteplaybackavailabilitychange: void;
    remoteplaybackconnecting: void;
    remoteplaybackconnect: void;
    remoteplaybackdisconnect: void;
    interactivehotspotclicked: InteractiveHotspotClickEvent;
    interactiveoverlaypanelclicked: InteractiveOverlayPanelClickEvent;
}
