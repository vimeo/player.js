# Vimeo Player API [![npm](https://img.shields.io/npm/v/@vimeo/player.svg?cacheSeconds=120)](https://www.npmjs.com/package/@vimeo/player) [![Coverage](https://img.shields.io/codecov/c/github/vimeo/player.js.svg?cacheSeconds=120)](https://codecov.io/gh/vimeo/player.js) ![Badge size](https://img.badgesize.io/https://raw.githubusercontent.com/vimeo/player.js/master/dist/player.min.js?compression=gzip&label=gzip)

The Vimeo Player API allows you to interact with and control an embedded Vimeo
Player.

## Installation

You can install the Vimeo Player API through either npm:

```bash
npm install @vimeo/player
```

Alternatively, you can reference an up‐to‐date version on our CDN:

```html
<script src="https://player.vimeo.com/api/player.js"></script>
```

**Warning:** when used with RequireJS it is required to load the script dynamically via the RequireJS load system.
https://requirejs.org/docs/api.html#jsfiles

## Getting Started

In order to control the Vimeo Player, you need a player to control. There are a
few ways to get a player:

### Pre-existing player

Already have a player on the page? Pass the element to the `Vimeo.Player`
constructor and you’re ready to go.

```html
<iframe src="https://player.vimeo.com/video/76979871?h=8272103f6e" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>

<script src="https://player.vimeo.com/api/player.js"></script>
<script>
    const iframe = document.querySelector('iframe');
    const player = new Vimeo.Player(iframe);

    player.on('play', function() {
        console.log('played the video!');
    });

    player.getVideoTitle().then(function(title) {
        console.log('title:', title);
    });
</script>
```

### Create with a video id or url

You can use the library to make the embed for you. All you need is an empty
element and the video id or vimeo.com url (and optional
[embed options](#embed-options)).

**NOTE:** If the video [privacy settings](https://vimeo.zendesk.com/hc/en-us/articles/224817847-Privacy-settings-overview) are "Unlisted", instead of providing an `id` property, you will need to provide the full video URL as a `url` property and include the `h` parameter.

```html
<div id="made-in-ny"></div>

<script src="https://player.vimeo.com/api/player.js"></script>
<script>
    const options = {
        id: 59777392,
        width: 640,
        loop: true
    };

    const player = new Vimeo.Player('made-in-ny', options);

    player.setVolume(0);

    player.on('play', function() {
        console.log('played the video!');
    });
</script>
```

### Automatically with HTML attributes

When the library loads, it will scan your page for elements with Vimeo
attributes. Each element must have at least a `data-vimeo-id` or
`data-vimeo-url` attribute in order for the embed to be created automatically.
You can also add attributes for any of the [embed options](#embed-options),
prefixed with `data-vimeo` (`data-vimeo-portrait="false"`, for example).

**NOTE:** If the video [privacy settings](https://vimeo.zendesk.com/hc/en-us/articles/224817847-Privacy-settings-overview) are "Unlisted", instead of providing a `data-vimeo-id` attribute, you will need to provide the full video URL in a `data-vimeo-url` attribute and include the `h` parameter.

```html
<div data-vimeo-id="19231868" data-vimeo-width="640" id="handstick"></div>
<div data-vimeo-url="https://player.vimeo.com/video/76979871?h=8272103f6e" id="playertwo"></div>

<script src="https://player.vimeo.com/api/player.js"></script>
<script>
    // If you want to control the embeds, you’ll need to create a Player object.
    // You can pass either the `<div>` or the `<iframe>` created inside the div.
    const handstickPlayer = new Vimeo.Player('handstick');
    handstickPlayer.on('play', function() {
        console.log('played the handstick video!');
    });

    const playerTwoPlayer = new Vimeo.Player('playertwo');
    playerTwoPlayer.on('play', function() {
        console.log('played the player 2.0 video!');
    });
</script>
```

## Browser Support

The Player API library is supported in IE 11+, Chrome, Firefox, Safari, and
Opera.

## Migrate from Froogaloop

Using our old Froogaloop library? See the [migration doc](docs/migrate-from-froogaloop.md)
for details on how to update your code to use this library.

## Using with a module bundler

If you’re using a module bundler like [webpack](https://webpack.js.org) or
[rollup](https://rollupjs.org/), the exported object will be the Player
constructor (unlike the browser where it is attached to `window.Vimeo`):

```js
import Player from '@vimeo/player';

const player = new Player('handstick', {
    id: 19231868,
    width: 640
});

player.on('play', function() {
    console.log('played the video!');
});
```

Similarly, if you’re using [RequireJS](https://requirejs.org/) in the browser,
it will also import the Player constructor directly:

```html
<iframe src="https://player.vimeo.com/video/76979871?h=8272103f6e" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>

<script>
    require(['https://player.vimeo.com/api/player.js'], function (Player) {
        const iframe = document.querySelector('iframe');
        const player = new Player(iframe);

        player.on('play', function() {
            console.log('played the video!');
        });
    });
</script>
```

## Table of Contents

* [Create a Player](#create-a-player)
* [Embed Options](#embed-options)
* [Methods](#methods)
    + [on](#onevent-string-callback-function-void)
    + [off](#offevent-string-callback-function-void)
    + [loadVideo](#loadvideooptions-numberstringobject-promisenumberobject-typeerrorpassworderrorerror)
    + [ready](#ready-promisevoid-error)
    + [enableTextTrack](#enabletexttracklanguage-string-kind-string-promiseobject-invalidtracklanguageerrorinvalidtrackerrorerror)
    + [disableTextTrack](#disabletexttrack-promisevoid-error)
    + [pause](#pause-promisevoid-passworderrorprivacyerrorerror)
    + [play](#play-promisevoid-passworderrorprivacyerrorerror)
    + [unload](#unload-promisevoid-error)
    + [destroy](#destroy-promisevoid-error)
    + [requestFullscreen](#requestfullscreen-promisevoid-error)
    + [exitFullscreen](#exitfullscreen-promisevoid-error)
    + [getFullscreen](#getfullscreen-promiseboolean-error)
    + [requestPictureInPicture](#requestpictureinpicture-promisevoid-error)
    + [exitPictureInPicture](#exitpictureinpicture-promisevoid-error)
    + [getPictureInPicture](#getpictureinpicture-promiseboolean-error)
    + [remotePlaybackPrompt](#remoteplaybackprompt-promisevoid-error)
    + [getRemotePlaybackAvailability](#getremoteplaybackavailability-promisestring-error)
    + [getRemotePlaybackState](#getremoteplaybackstate-promiseboolean-error)
    + [getAutopause](#getautopause-promiseboolean-unsupportederrorerror)
    + [setAutopause](#setautopauseautopause-boolean-promiseboolean-unsupportederrorerror)
    + [getBuffered](#getbuffered-promisearray-error)
    + [getChapters](#getchapters-promisearray-error)
    + [getCurrentChapter](#getcurrentchapter-promiseobject-error)
    + [getColor](#getcolor-promisestring-error)
    + [getColors](#getcolors-promisestring-error)
    + [setColor](#setcolorcolor-string-promisestring-contrasterrortypeerrorerror)
    + [setColors](#setcolorscolors-string-promisestring-contrasterrortypeerrorerror)
    + [addCuePoint](#addcuepointtime-number-data-object-promisestring-unsupportederrorrangeerrorerror)
    + [removeCuePoint](#removecuepointid-string-promisestring-unsupportederrorinvalidcuepointerror)
    + [getCuePoints](#getcuepoints-promisearray-unsupportederrorerror)
    + [getCurrentTime](#getcurrenttime-promisenumber-error)
    + [setCurrentTime](#setcurrenttimeseconds-number-promisenumber-rangeerrorerror)
    + [getDuration](#getduration-promisenumber-error)
    + [getEnded](#getended-promiseboolean-error)
    + [getLoop](#getloop-promiseboolean-error)
    + [setLoop](#setlooploop-boolean-promiseboolean-error)
    + [getMuted](#getmuted-promiseboolean-error)
    + [setMuted](#setmuted-boolean-promiseboolean-error)
    + [getPaused](#getpaused-promiseboolean-error)
    + [getPlaybackRate](#getplaybackrate-promisenumber-error)
    + [setPlaybackRate](#setplaybackrateplaybackrate-number-promisenumber-rangeerrorerror)
    + [getPlayed](#getplayed-promisearray-error)
    + [getSeekable](#getseekable-promisearray-error)
    + [getSeeking](#getseeking-promiseboolean-error)
    + [getTextTracks](#gettexttracks-promiseobject-error)
    + [getVideoEmbedCode](#getvideoembedcode-promisestring-error)
    + [getVideoId](#getvideoid-promisenumber-error)
    + [getVideoTitle](#getvideotitle-promisestring-error)
    + [getVideoWidth](#getvideowidth-promisenumber-error)
    + [getVideoHeight](#getvideoheight-promisenumber-error)
    + [getVideoUrl](#getvideourl-promisestring-privacyerrorerror)
    + [getVolume](#getvolume-promisenumber-error)
    + [setVolume](#setvolumevolume-number-promisenumber-rangeerrorerror)
    + [setTimingSrc](#settimingsrctimingobject-timingobject-options-timingsrcconnectoroptions-promisetimingsrcconnector)
    + [getQualities](#getqualities-promiseobject-error)
    + [getQuality](#getquality-promisestring-error)
    + [setQuality](#setqualityquality-string-promisestring-typeerrorerror)
    + [getCameraProps](#getcameraprops-promiseobject-error)
    + [setCameraProps](#setcamerapropscameraprops-object-promiseobject-rangeerrorerror)
* [Events](#events)
    + [play](#play)
    + [playing](#playing)
    + [pause](#pause)
    + [ended](#ended)
    + [timeupdate](#timeupdate)
    + [progress](#progress)
    + [seeking](#seeking)
    + [seeked](#seeked)
    + [texttrackchange](#texttrackchange)
    + [chapterchange](#chapterchange)
    + [cuechange](#cuechange)
    + [cuepoint](#cuepoint)
    + [volumechange](#volumechange)
    + [playbackratechange](#playbackratechange)
    + [bufferstart](#bufferstart)
    + [bufferend](#bufferend)
    + [error](#error)
    + [loaded](#loaded)
    + [durationchange](#durationchange)
    + [fullscreenchange](#fullscreenchange)
    + [qualitychange](#qualitychange)
    + [camerachange](#camerachange)
    + [resize](#resize)
    + [enterpictureinpicture](#enterpictureinpicture)
    + [leavepictureinpicture](#leavepictureinpicture)
    + [remoteplaybackavailabilitychange](#remoteplaybackavailabilitychange)
    + [remoteplaybackconnecting](#remoteplaybackconnecting)
    + [remoteplaybackconnect](#remoteplaybackconnect)
    + [remoteplaybackdisconnect](#remoteplaybackdisconnect)
    + [interactivehotspotclicked](#interactivehotspotclicked)
    + [interactiveoverlaypanelclicked](#interactiveoverlaypanelclicked)
* [Dev Options](#dev-options)
    + [prefer_mms](#prefer_mms)

## Create a Player

The `Vimeo.Player` object wraps an iframe so you can interact with and control a
Vimeo Player embed.

### Existing embed

If you already have a Vimeo `<iframe>` on your page, pass that element into the
constructor to get a `Player` object. You can also use jQuery to select the
element, or pass a string that matches the `id` of the `<iframe>`.

```js
// Select with the DOM API
const iframe = document.querySelector('iframe');
const iframePlayer = new Vimeo.Player(iframe);

// Select with jQuery
// If multiple elements are selected, it will use the first element.
const jqueryPlayer = new Vimeo.Player($('iframe'));

// Select with the `<iframe>`’s id
// Assumes that there is an <iframe id="player1"> on the page.
const idPlayer = new Vimeo.Player('player1');
```

### Create an embed

Pass any element and an options object to the `Vimeo.Player` constructor to make
an embed inside that element. The options object should consist of either an
`id` or `url` and any other [embed options](#embed-options) for the embed.

**NOTE:** If the video [privacy settings](https://vimeo.zendesk.com/hc/en-us/articles/224817847-Privacy-settings-overview) are "Unlisted", instead of providing an `id` property, you will need to provide the full video URL as a `url` property and include the `h` parameter.

```html
<div id="made-in-ny"></div>

<script src="https://player.vimeo.com/api/player.js"></script>
<script>
    const options = {
        id: 59777392,
        width: 640,
        loop: true
    };

    // Will create inside the made-in-ny div:
    // <iframe src="https://player.vimeo.com/video/59777392?h=ab882a04fd&loop=1" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
    const madeInNy = new Vimeo.Player('made-in-ny', options);
</script>
```

Embed options will also be read from the `data-vimeo-*` attributes. Attributes
on the element will override any defined in the options object passed to the
constructor (similar to how the `style` attribute overrides styles defined in
CSS).

Elements with a `data-vimeo-id` or `data-vimeo-url` attribute will have embeds
created automatically when the player API library is loaded. You can use the
`data-vimeo-defer` attribute to prevent that from happening and create the embed
at a later time. This is useful for situations where the player embed wouldn’t
be visible right away, but only after some action was taken by the user (a
lightbox opened from clicking on a thumbnail, for example).

```html
<div data-vimeo-id="59777392" data-vimeo-defer id="made-in-ny"></div>
<div data-vimeo-id="19231868" data-vimeo-defer data-vimeo-width="500" id="handstick"></div>

<script src="https://player.vimeo.com/api/player.js"></script>
<script>
    const options = {
        width: 640,
        loop: true
    };

    // Will create inside the made-in-ny div:
    // <iframe src="https://player.vimeo.com/video/59777392?h=ab882a04fd&loop=1" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
    const madeInNy = new Vimeo.Player('made-in-ny', options);

    // Will create inside the handstick div:
    // <iframe src="https://player.vimeo.com/video/19231868?h=1034d5269b&loop=1" width="500" height="281" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
    const handstick = new Vimeo.Player(document.getElementById('handstick'), options);
</script>
```

## Embed Options

These options are available to be appended to the query string of the player URL, used as `data-vimeo-` attributes on elements, or included as
an object passed to the `Vimeo.Player` constructor. The complete list of embed options can be found in our [official SDK documentation](https://developer.vimeo.com/player/sdk/embed).

## Methods

You can call methods on the player by calling the function on the Player object:

```js
player.play();
```

All methods, except for `on()` and `off()` return a
[Promise](https://web.dev/articles/promises?hl=en). The Promise may
or may not resolve with a value, depending on the specific method.

```js
player.disableTextTrack().then(function() {
    // the track was disabled
}).catch(function(error) {
    // an error occurred
});
```

Promises for getters are resolved with the value of the property:

```js
player.getLoop().then(function(loop) {
    // whether or not the player is set to loop
});
```

Promises for setters are resolved with the value set, or rejected with an error
if the set fails. For example:

```js
player.setColor('#00adef').then(function(color) {
    // the color that was set
}).catch(function(error) {
    // an error occurred setting the color
});
```

### on(event: string, callback: function): void

Add an event listener for the specified event. Will call the callback with a
single parameter, `data`, that contains the data for that event. See
[events](#events) below for details.

```js
const onPlay = function(data) {
    // data is an object containing properties specific to that event
};

player.on('play', onPlay);
```

### off(event: string, callback?: function): void

Remove an event listener for the specified event. Will remove all listeners for
that event if a `callback` isn’t passed, or only that specific callback if it is
passed.

```js
const onPlay = function(data) {
    // data is an object containing properties specific to that event
};

player.on('play', onPlay);

// If later on you decide that you don’t need to listen for play anymore.
player.off('play', onPlay);

// Alternatively, `off` can be called with just the event name to remove all
// listeners.
player.off('play');
```

### loadVideo(options: number|string|object): Promise&lt;number|object, (TypeError|PasswordError|Error)&gt;

Load a new video into this embed. The promise will be resolved if the video is
successfully loaded, or it will be rejected if it could not be loaded.

**NOTE:** If the video [privacy settings](https://vimeo.zendesk.com/hc/en-us/articles/224817847-Privacy-settings-overview) are "Unlisted", instead of providing an `id` argument, you will need to provide the full video URL as a `url` argument and include the `h` parameter.

```js
player.loadVideo(76979871).then(function(id) {
    // the video successfully loaded
}).catch(function(error) {
    switch (error.name) {
        case 'TypeError':
            // the id was not a number
            break;

        case 'PasswordError':
            // the video is password-protected and the viewer needs to enter the
            // password first
            break;

        case 'PrivacyError':
            // the video is password-protected or private
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### ready(): Promise&lt;void, Error&gt;

Trigger a function when the player iframe has initialized. You do not need to
wait for `ready` to trigger to begin adding event listeners or calling other
methods.

```js
player.ready().then(function() {
    // the player is ready
});
```

### enableTextTrack(language: string, kind?: string): Promise&lt;object, (InvalidTrackLanguageError|InvalidTrackError|Error)&gt;

Enable the text track with the specified language, and optionally the specified
kind (captions or subtitles).

When set via the API, the track language will not change the viewer’s stored
preference.

```js
player.enableTextTrack('en').then(function(track) {
    // track.language = the iso code for the language
    // track.kind = 'captions' or 'subtitles'
    // track.label = the human-readable label
}).catch(function(error) {
    switch (error.name) {
        case 'InvalidTrackLanguageError':
            // no track was available with the specified language
            break;

        case 'InvalidTrackError':
            // no track was available with the specified language and kind
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### disableTextTrack(): Promise&lt;void, Error&gt;

Disable the currently-active text track.

```js
player.disableTextTrack().then(function() {
    // the track was disabled
}).catch(function(error) {
    // an error occurred
});
```

### pause(): Promise&lt;void, (PasswordError|PrivacyError|Error)&gt;

Pause the video if it’s playing.

```js
player.pause().then(function() {
    // the video was paused
}).catch(function(error) {
    switch (error.name) {
        case 'PasswordError':
            // the video is password-protected and the viewer needs to enter the
            // password first
            break;

        case 'PrivacyError':
            // the video is private
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### play(): Promise&lt;void, (PasswordError|PrivacyError|Error)&gt;

Play the video if it’s paused. **Note:** on iOS and some other mobile devices,
you cannot programmatically trigger play. Once the viewer has tapped on the play
button in the player, however, you will be able to use this function.

```js
player.play().then(function() {
    // the video was played
}).catch(function(error) {
    switch (error.name) {
        case 'PasswordError':
            // the video is password-protected and the viewer needs to enter the
            // password first
            break;

        case 'PrivacyError':
            // the video is private
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### unload(): Promise&lt;void, Error&gt;

Return the internal player (iframe) to its initial state.

```js
player.unload().then(function() {
    // the video was unloaded
}).catch(function(error) {
    // an error occurred
});
```
### destroy(): Promise&lt;void, Error&gt;

Cleanup the player and remove it from the DOM.

It won't be usable and a new one should be constructed
 in order to do any operations.

```js
player.destroy().then(function() {
    // the player was destroyed
}).catch(function(error) {
    // an error occurred
});
```

### requestFullscreen(): Promise&lt;void, Error&gt;

Request the player enters fullscreen.

```js
player.requestFullscreen().then(function() {
    // the player entered fullscreen
}).catch(function(error) {
    // an error occurred
});
```

### exitFullscreen(): Promise&lt;void, Error&gt;

Request the player exits fullscreen.

```js
player.exitFullscreen().then(function() {
    // the player exits fullscreen
}).catch(function(error) {
    // an error occurred
});
```

### getFullscreen(): Promise&lt;boolean, Error&gt;

Checks whether the player is currently fullscreen.

```js
player.getFullscreen().then(function(fullscreen) {
    // fullscreen = whether fullscreen is turned on or off
}).catch(function(error) {
    // an error occurred
});
```

### requestPictureInPicture(): Promise&lt;void, Error&gt;

Request the player enters picture-in-picture.

```js
player.requestPictureInPicture().then(function() {
    // the player entered picture-in-picture
}).catch(function(error) {
    // an error occurred
});
```

### exitPictureInPicture(): Promise&lt;void, Error&gt;

Request the player exits picture-in-picture.

```js
player.exitPictureInPicture().then(function() {
    // the player exits picture-in-picture
}).catch(function(error) {
    // an error occurred
});
```

### getPictureInPicture(): Promise&lt;boolean, Error&gt;

Checks whether the player is currently picture-in-picture.

```js
player.getPictureInPicture().then(function(pip) {
    // pip = whether picture-in-picture is turned on or off
}).catch(function(error) {
    // an error occurred
});
```

### remotePlaybackPrompt(): Promise&lt;void, Error&gt;

Prompt the viewer to activate or deactivate a remote playback device, if one is available.

*Note:* This method may require user interaction directly with the player before working properly and must be triggered by a user interaction. It is best to wait for initial playback before calling this method.

```js
player.remotePlaybackPrompt().then(function() {
    // viewer has been prompted
}).catch(function(error) {
    switch (error.name) {
        case 'NotFoundError':
            // remote playback is not supported or there is no device available
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getRemotePlaybackAvailability(): Promise&lt;string, Error&gt;

Checks if there is a remote playback device available.

```js
player.getRemotePlaybackAvailability().then(function(remotePlaybackAvailable) {
    // remotePlaybackAvailable = whether there is a remote playback device available or not
}).catch(function(error) {
    // an error occurred
})
```

### getRemotePlaybackState(): Promise&lt;boolean, Error&gt;

Get the current state of remote playback. Can be one of `connecting`, `connected`, or `disconnected`. These values are equivalent to the state values in the [Remote Playback API](https://developer.mozilla.org/en-US/docs/Web/API/RemotePlayback/state).

```js
player.getRemotePlaybackState().then(function(remotePlaybackState) {
    // remotePlaybackState === 'connecting': player is attempting to connect to the remote device
    // remotePlaybackState === 'connected': player successfully connected and is playing on the remote playback device
    // remotePlaybackState === 'disconnected': player is not connected to a remote playback device
}).catch(function(error) {
    // an error occurred
})
```

### getAutopause(): Promise&lt;boolean, (UnsupportedError|Error)&gt;

Get the autopause behavior for this player.

```js
player.getAutopause().then(function(autopause) {
    // autopause = whether autopause is turned on or off
}).catch(function(error) {
    switch (error.name) {
        case 'UnsupportedError':
            // Autopause is not supported with the current player or browser
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### setAutopause(autopause: boolean): Promise&lt;boolean, (UnsupportedError|Error)&gt;

Enable or disable the autopause behavior of this player. By default, when
another video is played in the same browser, this player will automatically
pause. Unless you have a specific reason for doing so, we recommend that you
leave autopause set to the default (`true`).

```js
player.setAutopause(false).then(function(autopause) {
    // autopause was turned off
}).catch(function(error) {
    switch (error.name) {
        case 'UnsupportedError':
            // Autopause is not supported with the current player or browser
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getBuffered(): Promise&lt;array, Error&gt;

Get the buffered time ranges of the video.

```js
player.getBuffered().then(function(buffered) {
    // buffered = an array of the buffered video time ranges.
}).catch(function(error) {
    // an error occurred
});
```

### getChapters(): Promise&lt;array, Error&gt;

Get an array of the chapters that are on the video.

```js
player.getChapters().then(function(chapters) {
    // chapters = an array of chapters objects
}).catch(function(error) {
    // an error occurred
});
```
Each chapters object looks like this:

```js
{
    "startTime": 15,
    "title": "Chapter Title",
    "index": 1
}
```

### getCurrentChapter(): Promise&lt;object, Error&gt;

Get the current chapter. A chapter is "current" when the `currentTime` of the video is equal to or after its `startTime` and before the `startTime` of the next chapter or the end of the video.

```js
player.getCurrentChapter().then(function(chapter) {
    // chapter = a chapter object
}).catch(function(error) {
    // an error occurred
});
```

### getColor(): Promise&lt;string, Error&gt;

Get the accent color for this player. Note that this is deprecated in place of `getColors`.
```js
player.getColor().then(function(color) {
    // color = the hex color of the player
}).catch(function(error) {
    // an error occurred
});

```

### getColors(): Promise&lt;string[], Error&gt;

Get all colors used for this player.
The return value is an array of primary, accent, text/icon, and background.

```js
player.getColors().then(function(colors) {
    // colors = [primary, accent, text/icon, background]
}).catch(function(error) {
    // an error occurred
});
```

### setColor(color: string): Promise&lt;string, (ContrastError|TypeError|Error)&gt;

Set the accent color of this player to a hex or rgb string. Setting the color may fail
if the owner of the video has set their embed preferences to force a specific
color. Note that this setter is deprecated and should be replaced with `setColors`.

```js
player.setColor('#00adef').then(function(color) {
    // color was successfully set
}).catch(function(error) {
    switch (error.name) {

        case 'TypeError':
            // the string was not a valid hex or rgb color
            break;

        case 'EmbedSettingsError':
            // the owner of the video has chosen to use a specific color
            break;

        default:
            // some other error occurred
            break;
    }
});

```

### setColors(colors: string[]): Promise&lt;string[], (ContrastError|TypeError|Error)&gt;

Set all colors of this player with an array of hex values. Setting the color may fail
if the owner of the video has set their embed preferences to force a specific
color.

```js
player.setColors(['abc', 'def', '123', '456']).then(function(color) {
    // colors were successfully set
    // Array order: [primary, accent, text/icon, background]
}).catch(function(error) {
    switch (error.name) {

        case 'TypeError':
            // the string was not a valid hex or rgb color
            break;

        case 'EmbedSettingsError':
            // the owner of the video has chosen to use a specific color
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### addCuePoint(time: number, data: object): Promise&lt;string, (UnsupportedError|RangeError|Error)&gt;

Add a cue point to the player. Cue points fire a `cuepoint` event when the
`currentTime` of the video passes the specified time. *Note:* cue points should
be accurate to within a tenth of a second, but the precision may vary based on
browser or environment.

```js
player.addCuePoint(15, {
    customKey: 'customValue'
}).then(function(id) {
    // cue point was added successfully
}).catch(function(error) {
    switch (error.name) {
        case 'UnsupportedError':
            // cue points are not supported with the current player or browser
            break;

        case 'RangeError':
            // the time was less than 0 or greater than the video’s duration
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### removeCuePoint(id: string): Promise&lt;string, (UnsupportedError|InvalidCuePoint|Error)&gt;

Remove the specified cue point using the id returned from `addCuePoint()` or
from `getCuePoints()`.

```js
player.removeCuePoint('09ecf4e4-b587-42cf-ad9f-e666b679c9ab').then(function(id) {
    // cue point was removed successfully
}).catch(function(error) {
    switch (error.name) {
        case 'UnsupportedError':
            // cue points are not supported with the current player or browser
            break;

        case 'InvalidCuePoint':
            // a cue point with the id passed wasn’t found
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getCuePoints(): Promise&lt;array, (UnsupportedError|Error)&gt;

Get an array of the cue points that have been added to the video.

```js
player.getCuePoints().then(function(cuePoints) {
    // cuePoints = an array of cue point objects
}).catch(function(error) {
    switch (error.name) {
        case 'UnsupportedError':
            // cue points are not supported with the current player or browser
            break;

        default:
            // some other error occurred
            break;
    }
});
```
Each cue point object looks like this:

```js
{
    "time": 15,
    "data": {
        "customKey": "customValue"
    },
    "id": "09ecf4e4-b587-42cf-ad9f-e666b679c9ab"
}
```

### getCurrentTime(): Promise&lt;number, Error&gt;

Get the current playback position in seconds.

```js
player.getCurrentTime().then(function(seconds) {
    // seconds = the current playback position
}).catch(function(error) {
    // an error occurred
});
```

### setCurrentTime(seconds: number): Promise&lt;number, (RangeError|Error)&gt;

Set the current playback position in seconds. Once playback has started, if the
player was paused, it will remain paused. Likewise, if the player was playing,
it will resume playing once the video has buffered. Setting the current time
before playback has started will cause playback to start.

You can provide an accurate time and the player will attempt to seek to as close
to that time as possible. The exact time will be the fulfilled value of the
promise.

```js
player.setCurrentTime(30.456).then(function(seconds) {
    // seconds = the actual time that the player seeked to
}).catch(function(error) {
    switch (error.name) {
        case 'RangeError':
            // the time was less than 0 or greater than the video’s duration
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getDuration(): Promise&lt;number, Error&gt;

Get the duration of the video in seconds. It will be rounded to the nearest
second before playback begins, and to the nearest thousandth of a second after
playback begins.

```js
player.getDuration().then(function(duration) {
    // duration = the duration of the video in seconds
}).catch(function(error) {
    // an error occurred
});
```

### getEnded(): Promise&lt;boolean, Error&gt;

Get the ended state of the video. The video has ended if
`currentTime === duration`.

```js
player.getEnded().then(function(ended) {
    // ended = whether or not the video has ended
}).catch(function(error) {
    // an error occurred
});
```

### getLoop(): Promise&lt;boolean, Error&gt;

Get the loop state of the player.

```js
player.getLoop().then(function(loop) {
    // loop = whether loop is turned on or not
}).catch(function(error) {
    // an error occurred
});
```

### setLoop(loop: boolean): Promise&lt;boolean, Error&gt;

Set the loop state of the player. When set to `true`, the player will start over
immediately once playback ends. *Note:* when loop is turned on, the `ended`
event will not fire.

```js
player.setLoop(true).then(function(loop) {
    // loop was turned on
}).catch(function(error) {
    // an error occurred
});
```

### getMuted(): Promise&lt;boolean, Error&gt;

Get the muted state of the player.

```js
player.getMuted().then(function(muted) {
    // muted = whether muted is turned on or not
}).catch(function(error) {
    // an error occurred
});
```

### setMuted(muted: boolean): Promise&lt;boolean, Error&gt;

Set the muted state of the player. When set to `true`, the player volume will be muted.

```js
player.setMuted(true).then(function(muted) {
    // muted was turned on
}).catch(function(error) {
    // an error occurred
});
```

### getPaused(): Promise&lt;boolean, Error&gt;

Get the paused state of the player.

```js
player.getPaused().then(function(paused) {
    // paused = whether or not the player is paused
}).catch(function(error) {
    // an error occurred
});
```

### getPlaybackRate(): Promise&lt;number, Error&gt;

Get the playback rate of the player on a scale from `0` to `2`.

```js
player.getPlaybackRate().then(function(playbackRate) {
    // playbackRate = a numeric value of the current playback rate
}).catch(function(error) {
    // an error occurred
});
```

### setPlaybackRate(playbackRate: number): Promise&lt;number, (RangeError|Error)&gt;

Set the playback rate of the player on a scale from `0` to `2` (available to PRO and Business accounts). When set
via the API, the playback rate will not be synchronized to other
players or stored as the viewer's preference.

```js
player.setPlaybackRate(0.5).then(function(playbackRate) {
    // playback rate was set
}).catch(function(error) {
    switch (error.name) {
        case 'RangeError':
            // the playback rate was less than 0 or greater than 2
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getPlayed(): Promise&lt;array, Error&gt;

Get the played time ranges of the video.

```js
player.getPlayed().then(function(played) {
    // played = array values of the played video time ranges.
}).catch(function(error) {
    // an error occurred
});
```

### getSeekable(): Promise&lt;array, Error&gt;

Get the video time ranges that are seekable.

```js
player.getSeekable().then(function(seekable) {
    // seekable = array values of the seekable video time ranges.
}).catch(function(error) {
    // an error occurred
});
```

### getSeeking(): Promise&lt;boolean, Error&gt;

Get if the player is currently seeking.

```js
player.getSeeking().then(function(seeking) {
    // seeking = whether the player is seeking or not
}).catch(function(error) {
    // an error occurred
});
```

### getTextTracks(): Promise&lt;object[], Error&gt;

Get an array of the text tracks that exist for the video. For example:

```js
player.getTextTracks().then(function(tracks) {
    // tracks = an array of track objects
}).catch(function(error) {
    // an error occurred
});
```

Each track object looks like this:

```js
{
    "label": "English CC",
    "language": "en",
    "kind": "captions",
    "mode": "showing"
}
```

Kind can be either `captions` or `subtitles`. The mode can be either `showing`
or `disabled`. Only one track can be `showing` at any given time; the rest will
be `disabled`.

### getVideoEmbedCode(): Promise&lt;string, Error&gt;

Get the `<iframe>` embed code for the video.

```js
player.getVideoEmbedCode().then(function(embedCode) {
    // embedCode = <iframe> embed code
}).catch(function(error) {
    // an error occurred
});
```

### getVideoId(): Promise&lt;number, Error&gt;

Get the id of the video.

```js
player.getVideoId().then(function(id) {
    // id = the video id
}).catch(function(error) {
    // an error occurred
});
```

### getVideoTitle(): Promise&lt;string, Error&gt;

Get the title of the video.

```js
player.getVideoTitle().then(function(title) {
    // title = the title of the video
}).catch(function(error) {
    // an error occurred
});
```

### getVideoWidth(): Promise&lt;number, Error&gt;

Get the native width of the currently‐playing video. The width of the highest
resolution available will be used before playback begins.

```js
player.getVideoWidth().then(function(width) {
    // width = the width of the video that is currently playing
}).catch(function(error) {
    // an error occurred
});
```

### getVideoHeight(): Promise&lt;number, Error&gt;

Get the native height of the currently‐playing video. The height of the highest
resolution available will be used before playback begins.

```js
player.getVideoHeight().then(function(height) {
    // height = the height of the video that is currently playing
}).catch(function(error) {
    // an error occurred
});
```

To get both the width and height, you can do this:

```js
Promise.all([player.getVideoWidth(), player.getVideoHeight()]).then(function(dimensions) {
    var width = dimensions[0];
    var height = dimensions[1];
});
```

### getVideoUrl(): Promise&lt;string, (PrivacyError|Error)&gt;

Get the [vimeo.com](https://vimeo.com) url for the video.

```js
player.getVideoUrl().then(function(url) {
    // url = the vimeo.com url for the video
}).catch(function(error) {
    switch (error.name) {
        case 'PrivacyError':
            // the url isn’t available because of the video’s privacy setting
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getVolume(): Promise&lt;number, Error&gt;

Get the current volume level of the player on a scale from `0` to `1`.

Most mobile devices do not support an independent volume from the system volume.
In those cases, this method will always return `1`.

```js
player.getVolume().then(function(volume) {
    // volume = the volume level of the player
}).catch(function(error) {
    // an error occurred
});
```

### setVolume(volume: number): Promise&lt;number, (RangeError|Error)&gt;

Set the volume of the player on a scale from `0` to `1`. When set via the API,
the volume level will not be synchronized to other players or stored as the
viewer’s preference.

Most mobile devices (including iOS and Android) do not support setting the
volume because the volume is controlled at the system level. An error will *not*
be triggered in that situation.

```js
player.setVolume(0.5).then(function(volume) {
    // volume was set
}).catch(function(error) {
    switch (error.name) {
        case 'RangeError':
            // the volume was less than 0 or greater than 1
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### setTimingSrc(timingObject: TimingObject, options?: TimingSrcConnectorOptions): Promise&lt;TimingSrcConnector&gt;

Syncs a Timing Object to the video player (https://webtiming.github.io/timingobject/)


```console
npm install @vimeo/player timing-object
```

```html
<div id="handstick"></div>
```

```js
import Player from '@vimeo/player';
import {TimingObject} from 'timing-object';

const player = new Player('handstick', {
    id: 19231868,
    width: 640
});

const timingObject = new TimingObject();

player.setTimingSrc(timingObject)
// any update to the timing object will reflect in the player

player.setTimingSrc(timingObject, {role: 'controller'})
// any update to the player will reflect in the timing object
```
See [TimingSrcConnectorOptions](src/lib/timing-src-connector.types.ts) for available options.

See this [demo app](https://salmoro.github.io/vimeo-timing-object-demo/dist) which syncs video playback in real-time for all viewers.


### getQualities(): Promise&lt;object[], Error&gt;

Get the available qualities of the current video.

```js
player.getQualities().then(function(qualities) {
    // qualities = an array of quality objects
}).catch(function(error) {
    // an error occurred
});
```

Each quality object looks like this:

```js
{
    "label": "4K",
    "id": "2160p",
    "active": true
}
```

### getQuality(): Promise&lt;string, Error&gt;

Get the current selected quality.

```js
player.getQuality().then(function(quality) {
    // quality = the current selected quality
}).catch(function(error) {
    // an error occurred
});
```

### setQuality(quality: string): Promise&lt;string, (TypeError|Error)&gt;

Set the quality of the video. (available to Plus, PRO and Business accounts)

```js
player.setQuality('720p').then(function(quality) {
    // quality was successfully set
}).catch(function(error) {
    switch (error.name) {
        case 'TypeError':
            // the quality selected is not valid
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getCameraProps(): Promise&lt;object, Error&gt;

Get the current camera properties for a 360° video.

```js
player.getCameraProps().then(function(cameraProps) {
    // cameraProps = the current camera properties
}).catch(function(error) {
    // an error occurred
});
```

Each `cameraProps` object looks like this:

```js
{
    "yaw": 360,
    "pitch": 90,
    "roll": 180,
    "fov": 45
}
```

### setCameraProps(cameraProps: object): Promise&lt;object, (RangeError|Error)&gt;

Set the camera properties for a 360° video.

```js
player.setCameraProps({
    "yaw": 360,     // Number between 0 and 360, left and right.
    "pitch": 90,    // Number between -90 and 90, up and down.
    "roll": 180,    // Number between -180 and 180.
    "fov": 45       // The field of view in degrees.
}).then(function(cameraProps) {
    // cameraProps was successfully set
}).catch(function(error) {
    switch (error.name) {
        case 'RangeError':
            // one of the camera properties is out of range
            break;

        default:
            // some other error occurred
            break;
    }
});
```


## Events

You can listen for events in the player by attaching a callback using `.on()`:

```js
player.on('eventName', function(data) {
    // data is an object containing properties specific to that event
});
```

The events are similar to the HTML5 video events.

To remove a listener, call `.off()` with the callback function:

```js
var callback = function() {};

player.off('eventName', callback);
```

If you pass only an event name, all listeners for that event will be removed.

### play

Triggered when video playback is initiated.

```js
{
    duration: 61.857
    percent: 0
    seconds: 0
}
```

### playing

Triggered when the video starts playing.

```js
{
    duration: 61.857
    percent: 0
    seconds: 0
}
```

### pause

Triggered when the video pauses.

```js
{
    duration: 61.857
    percent: 0
    seconds: 0
}
```

### ended

Triggered any time the video playback reaches the end. *Note:* when loop is
turned on, the `ended` event will not fire.

```js
{
    duration: 61.857
    percent: 1
    seconds: 61.857
}
```

### timeupdate

Triggered as the `currentTime` of the video updates. It generally fires every
250ms, but it may vary depending on the browser.

```js
{
    duration: 61.857
    percent: 0.049
    seconds: 3.034
}
```

### progress

Triggered as the video is loaded. Reports back the amount of the video that has
been buffered.

```js
{
    duration: 61.857
    percent: 0.502
    seconds: 31.052
}
```

### seeking

Triggered when the player starts seeking to a specific time. A `timeupdate` event will
also be fired at the same time.

```js
{
    duration: 61.857
    percent: 0.485
    seconds: 30
}
```

### seeked

Triggered when the player seeks to a specific time. A `timeupdate` event will
also be fired at the same time.

```js
{
    duration: 61.857
    percent: 0.485
    seconds: 30
}
```

### texttrackchange

Triggered when the active text track (captions/subtitles) changes. The values
will be null if text tracks are turned off.

```js
{
    kind: "captions",
    label: "English CC",
    language: "en"
}
```

### chapterchange

Triggered when the current chapter changes.

```js
{
    startTime: 15,
    title: "Chapter 1",
    index: 1
}
```

The `index` property of each chapter is the place it holds in the order of all the chapters. It starts at 1.

### cuechange

Triggered when the active cue for the current text track changes. It also fires
when the active text track changes. There may be multiple cues active.

```js
{
    cues: [
        {
            html: "<i>Here at Vimeo, there's always <br>one thing on our minds:</i>",
            text: "<i>Here at Vimeo, there's always ↵one thing on our minds:</i>"
        }
    ],
    kind: "captions",
    label: "English CC",
    language: "en"
}
```

The `text` property of each cue is the raw value parsed from the caption or
subtitle file. The `html` property contains the HTML that the Player renders for
that cue.

### cuepoint

Triggered when the current time hits a registered cue point.

```js
{
    time: 15,
    data: {
        customKey: 'customValue'
    },
    id: "40f5722b-09aa-4060-a887-3c81aaa37cce"
}
```

The `data` property will be the custom data provided in the `addCuePoint()`
call, or an empty object if none was provided.

### volumechange

Triggered when the volume in the player changes. Some devices do not support
setting the volume of the video independently from the system volume, so this
event will never fire on those devices.

```js
{
    volume: 0.5,
    muted: false
}
```

### playbackratechange

Triggered when the playback rate of the video in the player changes. The ability to change rate can be disabled by the creator
and the event will not fire for those videos. The new playback rate is returned with the event.

```js
{
    playbackRate: 1.5
}
```

### bufferstart

Triggered when buffering starts in the player. This is also triggered during preload and while seeking. There is no associated data with this event.


### bufferend

Triggered when buffering ends in the player. This is also triggered at the end of preload and seeking. There is no associated data with this event.


### error

Triggered when some kind of error is generated in the player. In general if you
are using this API library, you should use `.catch()` on each method call
instead of globally listening for error events.

If the error was generated from a method call, the name of that method will be
included.

```js
{
    message: "#984220 does not meet minimum contrast ratio. We recommend using brighter colors. (You could try #d35e30 instead.) See WCAG 2.0 guidelines: http://www.w3.org/TR/WCAG/#visual-audio-contrast"
    method: "setColor"
    name: "ContrastError"
}
```

### loaded

Triggered when a new video is loaded in the player.

```js
{
    id: 76979871
}
```

### durationchange

Triggered when the duration attribute has been updated.

```js
{
    duration: 60
}
```

### fullscreenchange

Triggered when the player enters or exits fullscreen.

```js
{
    fullscreen: true
}
```

### qualitychange

Triggered when the set quality changes.

```js
{
    quality: '720p'
}
```

### camerachange

Triggered when any of the camera properties change for 360° videos.

```js
{
    yaw: 270,
    pitch: 90,
    roll: 0,
    fov: 45
}
```

### resize

Triggered when the intrinsic size of the media changes.

```js
{
    videoWidth: 1280,
    videoHeight: 720
}
```

### enterpictureinpicture

Triggered when the player enters picture-in-picture.

### leavepictureinpicture

Triggered when the player leaves picture-in-picture.

### remoteplaybackavailabilitychange

Triggered when the availability of remote playback changes.

Listening for this event is equivalent to the [RemotePlayback.watchAvailability() API](http://developer.mozilla.org/en-US/docs/Web/API/RemotePlayback/watchAvailability), except that there is no `cancelWatchAvailability()`. You can remove the listener for this event instead.

### remoteplaybackconnecting

Triggered when the player is attempting to connect to a remote playback device.

### remoteplaybackconnect

Triggered when the player has successfully connected to a remote playback device.

### remoteplaybackdisconnect

Triggered when the player has disconnected from a remote playback device.

### interactivehotspotclicked

Triggered when a hotspot is clicked.

```js
{
    action: 'seek', // event, none, overlay, seek, url
    actionPreference: {
        pauseOnAction: false, // on `event`, `overlay`, `seek`, `url` action
        overlayId: 864334, // on `overlay` action
        seekTo: 30, // on `seek` action
        url: 'https://your-url.com', // on `url` action
    },
    currentTime: 15.585,
    customPayloadData: null,
    hotspotId: 8148223
}
```

### interactiveoverlaypanelclicked

Triggered when the overlay panel (buttons or images) within the interactive overlay is clicked.

```js
{
    action: 'seek', // clickthrough, close, event, none, seek
    actionPreference: {
        pauseOnAction: true, // on `close`, `seek` action
        seekTo: 30, // on `seek` action
        url: 'https://your-url.com', // on `clickthrough` action
    },
    currentTime: 25.67,
    customPayloadData: null,
    overlayId: 864334,
    panelId: 'c47193a0-8320-4572-9bcd-8425851b36e9'
}
```

## Dev Options

### prefer_mms

The Vimeo Player uses [Managed Media Source](https://developer.apple.com/videos/play/wwdc2023/10122/?time=762) (MMS) where available for [Media Source Extension](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API) powered playback on iOS devices.

Unfortunately, there are [known issues](https://bugs.webkit.org/show_bug.cgi?id=266764) with MMS in certain versions of the Xcode iOS Simulator. Therefore, we have added a query parameter to disable MMS and force native HLS playback via: `prefer_mms=0` or `prefer_mms=false`.
