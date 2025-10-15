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
export type LoadVideoOptions = VideoId | VimeoEmbedParameters & (
    // Provide either clip id or video url when using VimeoEmbedParameters in LoadVideoOptions
    Required<{ id: VideoId }> | Required<{ url: VimeoUrl }>
);

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

// see https://developer.vimeo.com/player/sdk/embed for more details about embed parameters and their default values
export type VimeoEmbedParameters = {
    /**
     * The Vimeo clip ID of video to load. Must be provided if not providing `url` or iframe element to first argument of Player constructor
     * @default undefined
     */
    id?: VideoId;

    /**
     * The Vimeo video URL to load. Must be provided if not providing `id` or iframe element to first argument of Player constructor
     * @default undefined
     */
    url?: VimeoUrl;

    /**
     * Whether AirPlay is enabled in the embeddable player
     * @default true
     */
    airplay?: boolean;

    /**
     * Whether multiple audio tracks can appear in the embeddable player
     * @default true
     */
    audio_tracks?: boolean;

    /**
     * The initial audio track to play with the video. Can be language code (fr),
     * language code and region (fr-ca), or language code and kind (fr,descriptions).
     * Set to 'main' to select the original audio
     * @default undefined
     */
    audiotrack?: string;

    /**
     * Whether to pause the current video when another Vimeo video on the same page starts to play
     * @default true
     */
    autopause?: boolean;

    /**
     * Whether to start playback of the video automatically. This feature might not work on all devices
     * @default false
     */
    autoplay?: boolean;

    /**
     * Whether the player is in background mode, which hides the playback controls, enables autoplay, and loops the video
     * @default false
     */
    background?: boolean;

    /**
     * Whether to display the video owner's name
     * @default true
     */
    byline?: boolean;

    /**
     * Whether closed captions are enabled in the embeddable player
     * @default true
     */
    cc?: boolean;

    /**
     * The chapter by ID to start playback at.
     * This is only available when the Player is created with a video id or url, not an existing iframe
     * @default undefined
     */
    chapter_id?: string;

    /**
     * Whether chapters are enabled in the embeddable player
     * @default true
     */
    chapters?: boolean;

    /**
     * Whether the Chromecast button appears in the embeddable player
     * @default true
     */
    chromecast?: boolean;

    /**
     * The hexadecimal accent color value of the playback controls (normally 00ADEF)
     * @default undefined
     */
    color?: HexColor;

    /**
     * The hexadecimal color values of the player in order: [Primary, Accent, Text/Icon, Background]
     * Default values: ["000000", "00ADEF", "FFFFFF", "000000"]
     * @default undefined
     */
    colors?: VimeoColors;

    /**
     * Whether to display the player's interactive elements, including the playbar and sharing buttons
     * @default true
     */
    controls?: boolean;

    /**
     * Whether to prevent the player from tracking session data, including setting cookies
     * @default false
     */
    dnt?: boolean;

    /**
     * In Segmented Playback mode, the time in seconds where playback ends for the video.
     * This is only available when the Player is created with a video id or url, not an existing iframe
     * @default undefined
     */
    end_time?: Seconds;

    /**
     * Whether to show the fullscreen button in the embeddable player
     * @default true
     */
    fullscreen?: boolean;

    /**
     * The height of the video in pixels
     * @default undefined (calculated based on aspect ratio)
     */
    height?: Pixels;

    /**
     * The playback quality of the first seconds of video loaded. Common values are 360p, 720p, 1080p, 2k, and 4k
     * @default undefined
     */
    initial_quality?: VideoQualityId;

    /**
     * Whether to display markers representing the timestamp where hotspots appear on an interactive video
     * @default true
     */
    interactive_markers?: boolean;

    /**
     * Key-value pairs representing dynamic parameters that are utilized on interactive videos
     * @default undefined
     */
    interactive_params?: Record<string, string>;

    /**
     * Whether to enable keyboard input to trigger player events
     * @default true
     */
    keyboard?: boolean;

    /**
     * Whether to restart the video automatically after reaching the end
     * @default false
     */
    loop?: boolean;

    /**
     * The height of the video in pixels, where the video won't exceed its native height
     * @default undefined
     */
    maxheight?: Pixels;

    /**
     * The highest possible quality that the player automatically switches to during video playback
     * @default undefined
     */
    max_quality?: VideoQualityId;

    /**
     * The width of the video in pixels, where the video won't exceed its native width
     * @default undefined
     */
    maxwidth?: Pixels;

    /**
     * The lowest possible quality that the player automatically switches to during video playback
     * @default undefined
     */
    min_quality?: VideoQualityId;

    /**
     * Whether the video is muted upon loading. The true value is required for the autoplay behavior in some browsers
     * @default false
     */
    muted?: boolean;

    /**
     * Whether to include the picture-in-picture button among the player controls
     * @default true
     */
    pip?: boolean;

    /**
     * The position of the play button within the embeddable player. Other possible values include 'bottom' and 'center'
     * @default 'auto'
     */
    play_button_position?: 'auto' | 'bottom' | 'center';

    /**
     * Whether the video plays inline on supported mobile devices
     * @default true
     */
    playsinline?: boolean;

    /**
     * Whether to display the video owner's portrait
     * @default true
     */
    portrait?: boolean;

    /**
     * The loading behavior for the player before playback is initiated.
     * 'metadata' = load metadata immediately
     * 'metadata_on_hover' = load metadata only when user hovers
     * 'auto' = load metadata and first few seconds immediately
     * 'auto_on_hover' = load metadata and first few seconds on hover
     * 'none' = don't load any data until playback begins
     * @default 'metadata_on_hover'
     */
    preload?: 'metadata' | 'metadata_on_hover' | 'auto' | 'auto_on_hover' | 'none';

    /**
     * Whether to show the progress bar in the embeddable player
     * @default true
     */
    progress_bar?: boolean;

    /**
     * The playback quality of the video. Use 'auto' for best quality given available bandwidth
     * @default 'auto'
     */
    quality?: VideoQualityId;

    /**
     * Whether to show the quality selector in the embeddable player
     * @default true
     */
    quality_selector?: boolean;

    /**
     * Whether to return a responsive embed code
     * @default false
     */
    responsive?: boolean;

    /**
     * Whether users can skip forward in the embeddable player
     * @default true
     */
    skipping_forward?: boolean;

    /**
     * Whether to include playback speed among the player preferences
     * @default false
     */
    speed?: boolean;

    /**
     * The time in seconds to start playback at.
     * This is only available when the Player is created with a video id or url, not an existing iframe
     * @default 0
     */
    start_time?: Seconds;

    /**
     * The text track to display with the video. Can be language code (en),
     * language code and locale (en-US), or language code and kind (en.captions).
     * Use 'en-x-autogen' for automatically generated closed captions
     * @default undefined
     */
    texttrack?: string;

    /**
     * The ID of the thumbnail to load from the video's available thumbnail set
     * @default undefined
     */
    thumbnail_id?: string;

    /**
     * Whether to display the video's title
     * @default true
     */
    title?: boolean;

    /**
     * Whether transcript controls can appear in the embeddable player
     * @default true
     */
    transcript?: boolean;

    /**
     * Whether the responsive player and transparent background are enabled
     * @default true
     */
    transparent?: boolean;

    /**
     * Whether to display the unmute button
     * @default true
     */
    unmute_button?: boolean;

    /**
     * Whether to show the Vimeo logo in the embeddable player
     * @default true
     */
    vimeo_logo?: boolean;

    /**
     * Whether to show the volume selector in the embeddable player
     * @default true
     */
    volume?: boolean;

    /**
     * Whether to show the Watch Full Video button when Segmented Playback mode is enabled
     * @default true
     */
    watch_full_video?: boolean;

    /**
     * The width of the video in pixels
     * @default undefined
     */
    width?: Pixels;

    /**
     * Whether to allow MMS (Managed Media Source) for video playback in Safari
     * @default false
     */
    prefer_mms?: boolean;
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

/**
 * The identifier (not label) for the video quality (e.g. "2160p")
 */
export type VideoQualityId = string;

export interface VimeoQuality {
    /** Human readable label for the video quality (e.g. "4K") */
    label: string;
    /** The identifier for the video quality (e.g. "2160p") */
    id: VideoQualityId;
    /** Whether the video quality is currently active */
    active: boolean;
}

/** Array of four hex colors representing the player's color scheme */
export type VimeoColors = readonly [primary?: HexColor, accent?: HexColor, text?: HexColor, background?: HexColor];

/**
 * The ISO language, or language-locale, code for a track.
 * e.g. 'en' or 'en-US'.
 * {@link https://www.w3schools.com/tags/ref_language_codes.asp}
 * {@link https://www.w3schools.com/tags/ref_country_codes.asp}
*/
export type AudioLanguage = string;

/**
 * The different kinds of audio tracks.
 */
export type AudioKind =
    /** The original audio track associated with the video. */
    'main' |
    /** A track translated into a language other than the main track. */
    'translation' |
    /** An audio track containing audio descriptions for visually impaired users. */
    'descriptions' |
    /** An audio track containing commentary. */
    'commentary';

/**
 * The origin of the audio track.
 */
export type AudioProvenance =
    'PROVENANCE_USER_UPLOADED' |
    'PROVENANCE_AI_GENERATED' |
    'PROVENANCE_USER_UPLOADED_AI_GENERATED';

/**
 * A representation of an audio track on a video.
 *
 */
export type VimeoAudioTrack = {
    /** The ISO language code, optionally including the locale, such as 'en' or 'en-US'. */
    language: AudioLanguage;
    /** The kind of track it is (main, translation, descriptions, or commentary). */
    kind: AudioKind;
    /** The human‐readable label for the track. */
    label: string;
    /** String describing how the track was generated (PROVENANCE_USER_UPLOADED, PROVENANCE_AI_GENERATED, PROVENANCE_USER_UPLOADED_AI_GENERATED). */
    provenance: AudioProvenance;
    /** Boolean reflecting whether the track is currently enabled. */
    enabled: boolean;
}
