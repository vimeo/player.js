import {
    Seconds,
    VideoId,
    VolumeLevel,
    PlaybackRate,
    VimeoQuality,
    CameraProperties,
    VimeoTextTrackCuePoint,
    ProportionPercent,
} from "./formats";

export type PlayerEvent =
    | "play"
    | "pause"
    | "ended"
    | "timeupdate"
    | "progress"
    | "seeking"
    | "seeked"
    | "texttrackchange"
    | "cuechange"
    | "cuepoint"
    | "loaded"
    | "loadedmetadata"
    | "volumechange"
    | "playbackratechange"
    | "qualitychange"
    | "fullscreenchange"
    | "camerachange"
    | "resize"
    | "enterpictureinpicture"
    | "leavepictureinpicture"
    | "error";

export interface TimeUpdateEvent {
    duration: Seconds;
    percent: ProportionPercent;
    seconds: Seconds;
}

export interface ProgressEvent {
    duration: Seconds;
    percent: ProportionPercent;
    seconds: Seconds;
}

export interface SeekEvent {
    duration: Seconds;
    percent: ProportionPercent;
    seconds: Seconds;
}

export interface TextTrackChangeEvent {
    kind: string | undefined;
    label: string | undefined;
    language: string | undefined;
}

export interface ChapterChangeEvent {
    startTime: Seconds;
    title: string;
    index: number;
}

export interface CuePointEvent {
    time: Seconds;
    data: Record<string, any>;
    id: string;
}

export interface CueChangeEvent extends TextTrackChangeEvent {
    cues: VimeoTextTrackCuePoint[];
}

export interface LoadedEvent {
    id: VideoId;
}

export interface DurationChangeEvent {
    duration: Seconds;
}

export interface VolumeChangeEvent {
    volume: VolumeLevel;
}

export interface PlaybackRateChangeEvent {
    playbackRate: PlaybackRate;
}

export interface QualityChangeEvent {
    quality: VimeoQuality;
}

export interface CameraChangeEvent extends CameraProperties {}

export interface ResizeEvent {
    videoWidth: number;
    videoHeight: number;
}

export interface ErrorEvent {
    name: string;
    message: string;
    method: string;
}

/** Maps event names to their corresponding event data types */
export interface PlayerEventMap {
    play: void;
    pause: void;
    ended: void;
    timeupdate: TimeUpdateEvent;
    progress: ProgressEvent;
    seeking: SeekEvent;
    seeked: SeekEvent;
    texttrackchange: TextTrackChangeEvent;
    cuechange: CueChangeEvent;
    cuepoint: CuePointEvent;
    loaded: LoadedEvent;
    loadedmetadata: { duration: number };
    volumechange: VolumeChangeEvent;
    playbackratechange: PlaybackRateChangeEvent;
    qualitychange: QualityChangeEvent;
    fullscreenchange: boolean;
    camerachange: CameraChangeEvent;
    resize: ResizeEvent;
    enterpictureinpicture: void;
    leavepictureinpicture: void;
    error: ErrorEvent;
}
