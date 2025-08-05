/** Time value in seconds */
export type Seconds = number;

/** Proportion percent value between 0 and 1 */
export type ProportionPercent = number;

/** Volume level between 0 and 1 */
export type VolumeLevel = number;

/** Playback rate between 0.5 and 2 */
export type PlaybackRate = number;

/** Hex color code (e.g. '#00adef') */
export type HexColor = `#${string}`;

/** Vimeo URL format */
export type VimeoUrl = `https://vimeo.com/${string}` | `https://player.vimeo.com/video/${string}`;

/** Vimeo video ID */
export type VideoId = number | VimeoUrl;

/** Vimeo video loading options */
export type LoadVideoOptions = VideoId | VimeoEmbedParameters;

/** 
 * Camera angles for 360° videos:
 * - YawAngle: 0 to 360°
 * - PitchAngle: -90 to 90°
 * - RollAngle: -180 to 180°
 * - FieldOfView: view angle in degrees
 */
export type YawAngle = number;
export type PitchAngle = number;
export type RollAngle = number;
export type FieldOfView = number;

export interface VimeoEmbedParameters {
    id?: VideoId;
    url?: VimeoUrl;
    autopause?: boolean;
    autoplay?: boolean;
    background?: boolean;
    byline?: boolean;
    color?: HexColor;
    controls?: boolean;
    dnt?: boolean;
    height?: number;
    loop?: boolean;
    maxheight?: number;
    maxwidth?: number;
    muted?: boolean;
    playsinline?: boolean;
    portrait?: boolean;
    responsive?: boolean;
    speed?: boolean;
    quality?: VimeoQuality;
    texttrack?: string;
    title?: boolean;
    transparent?: boolean;
    width?: number;
}

export interface VimeoCuePoint {
    time: number;
    data: Record<string, any>;
    id: string;
}

export interface VimeoTextTrackCuePoint extends VimeoTextTrack {
    html: string;
    text: string;
}

export interface VimeoChapter {
    startTime: number;
    title: string;
    index: number;
}

export interface VimeoTextTrack {
    language: string;
    kind: string;
    label: string;
}

export interface CameraProperties {
    yaw: YawAngle;     // Number between 0 and 360
    pitch: PitchAngle;   // Number between -90 and 90
    roll: RollAngle;    // Number between -180 and 180
    fov: FieldOfView;     // The field of view in degrees
}

export interface TimeRange {
    start: Seconds;
    end: Seconds;
}

export type VimeoQuality = 'auto' | '240p' | '360p' | '540p' | '720p' | '1080p' | '2k' | '4k';

export type VimeoColors = [HexColor, HexColor, HexColor, HexColor]; // [Primary, Accent, Text/Icon, Background]
