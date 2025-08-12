/** Time value in seconds */
export type Seconds = number;

/** Pixels value */
export type Pixels = number;

/** Proportion percent value between 0 and 1 */
export type ProportionPercent = number;

/** Volume level between 0 and 1 */
export type VolumeLevel = number;

/** Playback rate between 0.5 and 2 */
export type PlaybackRate = number;

/** Hex color code without the hash (e.g. '00adef') */
export type HexColor = string;

/** Vimeo URL format */
export type VimeoUrl = `https://vimeo.com/${string}` | `https://player.vimeo.com/video/${string}`;

/** Vimeo video ID */
export type VideoId = string | number | VimeoUrl;

/** Options for loading a video. Provide either clip id, video url, or embed parameters */
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

export type VimeoEmbedParameters = (
    // Provide either clip id or video url
    { id: VideoId; url?: VimeoUrl } |
    { id?: VideoId; url: VimeoUrl }
) & {
    autopause?: boolean;
    autoplay?: boolean;
    background?: boolean;
    byline?: boolean;
    color?: HexColor;
    colors?: VimeoColors;
    controls?: boolean;
    dnt?: boolean;
    height?: number;
    loop?: boolean;
    maxheight?: number;
    maxwidth?: number;
    muted?: boolean;
    playsinline?: boolean;
    portrait?: boolean;
    prefer_mms?: boolean;
    responsive?: boolean;
    speed?: boolean;
    quality?: VimeoQuality;
    texttrack?: string;
    title?: boolean;
    transparent?: boolean;
    width?: number;
    start_time?: number;
    end_time?: number;
}

export interface VimeoCuePoint<T = Record<string, unknown>> {
    time: number;
    data: T;
    id: string;
}

export interface VimeoTextTrack {
    /** Language ISO code */
    language: string;
    /** Kind of text track (e.g. "subtitles", "captions") */
    kind: string;
    /** Human readable label for the text track */
    label: string;
    mode: "showing" | "hidden" | "disabled";
}

export interface VimeoTextTrackCuePoint {
    /**
     * The html property contains the HTML that the Player renders for that cue.
     */
    html: string;
    /**
     * The text property of each cue is the raw
     * value parsed from the caption or subtitle file.
     */
    text: string;
}

export interface VimeoChapter {
    startTime: number;
    title: string;
    index: number;
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

export type VideoQuality = 'auto' | '240p' | '360p' | '540p' | '720p' | '1080p' | '2k' | '4k';

export interface VimeoQuality {
    /** Human readable label for the video quality (e.g. "720p") */
    label: string;
    /** The identifier for the video quality */
    id: VideoQuality;
    /** Whether the video quality is currently active */
    active: boolean;
}

/** Array of four hex colors representing the player's color scheme */
export type VimeoColors = readonly [primary?: HexColor, accent?: HexColor, text?: HexColor, background?: HexColor];
