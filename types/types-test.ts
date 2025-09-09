import Player from './player';
import { PlayerEventMap } from './events';
import {
    Seconds,
    VolumeLevel,
    PlaybackRate,
    HexColor,
    VimeoUrl,
    VideoId,
    LoadVideoOptions,
    VimeoEmbedParameters,
    CameraProperties,
    VimeoCuePoint,
    VimeoTextTrack,
    VimeoChapter,
    VimeoColors,
    VimeoQuality
} from './formats';

// Test basic types
const seconds: Seconds = 42.5;
const volume: VolumeLevel = 0.75;
const rate: PlaybackRate = 1.5;
const color: HexColor = '00adef';

// Test URL and ID types
const validUrls: VimeoUrl[] = [
    'https://vimeo.com/123456789',
    'https://player.vimeo.com/video/123456789'
];

const validIds: VideoId[] = [
    '123456789',
    123456789,
    'https://vimeo.com/123456789'
];

// Test embed parameters
const embedParams: VimeoEmbedParameters = {
    id: '123456789',
    autopause: true,
    autoplay: false,
    background: false,
    byline: true,
    color: '00adef',
    controls: true,
    height: 720,
    width: 1280,
    loop: false,
    muted: false,
    playsinline: true,
    portrait: true,
    responsive: true,
    speed: true,
    title: true,
    transparent: false,
    start_time: 30,
    end_time: 60
};

// Test camera properties for 360° videos
const camera: CameraProperties = {
    yaw: 180,
    pitch: 45,
    roll: 0,
    fov: 90
};

// Test cue points with generic data
interface CustomCuePointData {
    title: string;
    action: 'seek' | 'pause';
}

const cuePoint: VimeoCuePoint<CustomCuePointData> = {
    time: 15.5,
    data: {
        title: 'Chapter 1',
        action: 'seek'
    },
    id: 'cp_1'
};

// Test text tracks
const textTrack: VimeoTextTrack = {
    language: 'en',
    kind: 'subtitles',
    label: 'English',
    mode: 'showing'
};

// Test chapters
const chapter: VimeoChapter = {
    startTime: 0,
    title: 'Introduction',
    index: 0
};

const iframe = document.querySelector('iframe');
if (!iframe) throw new Error('iframe not found');

const playerFromIframe = new Player(iframe);
const playerFromId = new Player('video-container');
const playerFromIframeWithOptions = new Player(iframe, {
    responsive: true,
});


// Ensure TS types take priority over JSDoc comments
const player = new Player('video-container');

// Event handler type tests
player.on('play', (event) => {
    const duration: Seconds = event.duration;
    const percent: number = event.percent;
    const seconds: Seconds = event.seconds;
});

// can use string for event name
player.on('play', (data) => {
    console.log(data.duration);
    console.log(data.percent);
    console.log(data.seconds);
    // @ts-expect-error
    console.log(data.foo);
});

// @ts-expect-error - can't use unknown event names
player.on('foo', (data) => {
    // @ts-expect-error - unknown event name, so no data typing should be available
    console.log(data.duration);
});

player.on('volumechange', (event) => {
    const volume: VolumeLevel = event.volume;
    const muted: boolean = event.muted;
});

player.on('camerachange', (event) => {
    const camera: CameraProperties = event;
});

player.on('cuepoint', (event) => {
    const cuePoint: VimeoCuePoint = event;
});

// Test event map completeness
type EventMapTest = {
    [K in keyof PlayerEventMap]: PlayerEventMap[K];
};

// Test colors array type
const colors: VimeoColors = ['00adef', 'ff0000', '00ff00', '0000ff'];

// Test quality settings
const qualities: VimeoQuality[] = [
    { label: '4K', id: '2160p', active: false },
    { label: '1080p', id: '1080p', active: true },
    { label: '720p', id: '720p', active: false }
];

// Test load video options
const loadOptions: LoadVideoOptions[] = [
    '123456789',
    'https://vimeo.com/123456789',
    { id: '123456789', autoplay: true },
    { url: 'https://vimeo.com/123456789', autoplay: true },
    // @ts-expect-error - missing url or id
    { autoplay: true }
];

// Test invalid types with ts-expect-error

// Invalid URL format
// @ts-expect-error
const invalidUrl: VimeoUrl = 'http://www.invalid-url.com';

// Invalid volume level
// @ts-expect-error
const invalidVolume: VolumeLevel = '0.5';

// Invalid camera properties
// @ts-expect-error
const invalidCamera: CameraProperties = { yaw: 180 };

// Invalid event handler type
const callback = (event: { wrongProp: string }) => void event.wrongProp;
// @ts-expect-error
player.on(PlayerEvent.Play, callback);

// Invalid embed parameters
// @ts-expect-error
const invalidEmbed: VimeoEmbedParameters = { colour: '#00adef' };

// Invalid colors array
// @ts-expect-error
const invalidColors: VimeoColors = ['00adef', 'ff0000', 1234];

// Invalid cue point data
// @ts-expect-error
const invalidCuePoint: VimeoCuePoint = { time: 15.5, data: {} };

// Invalid text track mode
const invalidTextTrack: VimeoTextTrack = {
    language: 'en',
    kind: 'subtitles',
    label: 'English',
    // @ts-expect-error - invalid mode
    mode: 'invalid'
};

// Test event handler with wrong event type
// @ts-expect-error
player.on('play', (event: { foo: string }) => {
    const foo: string = event.foo;
});

// Test event handler with missing parameter
// @ts-expect-error
player.on('play');

