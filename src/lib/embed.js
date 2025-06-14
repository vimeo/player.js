/**
 * @module lib/embed
 */

import Player from '../player';
import { isVimeoUrl, isVimeoEmbed, getVimeoUrl, getOembedDomain } from './functions';
import { parseMessageData } from './postmessage';

const oEmbedParameters = [
    'airplay',
    'audio_tracks',
    'audiotrack',
    'autopause',
    'autoplay',
    'background',
    'byline',
    'cc',
    'chapter_id',
    'chapters',
    'chromecast',
    'color',
    'colors',
    'controls',
    'dnt',
    'end_time',
    'fullscreen',
    'height',
    'id',
    'initial_quality',
    'interactive_params',
    'keyboard',
    'loop',
    'maxheight',
    'max_quality',
    'maxwidth',
    'min_quality',
    'muted',
    'play_button_position',
    'playsinline',
    'portrait',
    'preload',
    'progress_bar',
    'quality',
    'quality_selector',
    'responsive',
    'skipping_forward',
    'speed',
    'start_time',
    'texttrack',
    'thumbnail_id',
    'title',
    'transcript',
    'transparent',
    'unmute_button',
    'url',
    'vimeo_logo',
    'volume',
    'watch_full_video',
    'width'
];

/**
 * Get the 'data-vimeo'-prefixed attributes from an element as an object.
 *
 * @param {HTMLElement} element The element.
 * @param {Object} [defaults={}] The default values to use.
 * @return {Object<string, string>}
 */
export function getOEmbedParameters(element, defaults = {}) {
    return oEmbedParameters.reduce((params, param) => {
        const value = element.getAttribute(`data-vimeo-${param}`);

        if (value || value === '') {
            params[param] = value === '' ? 1 : value;
        }

        return params;
    }, defaults);
}

/**
 * Create an embed from oEmbed data inside an element.
 *
 * @param {object} data The oEmbed data.
 * @param {HTMLElement} element The element to put the iframe in.
 * @return {HTMLIFrameElement} The iframe embed.
 */
export function createEmbed({ html }, element) {
    if (!element) {
        throw new TypeError('An element must be provided');
    }

    if (element.getAttribute('data-vimeo-initialized') !== null) {
        return element.querySelector('iframe');
    }

    const div = document.createElement('div');
    div.innerHTML = html;

    element.appendChild(div.firstChild);
    element.setAttribute('data-vimeo-initialized', 'true');

    return element.querySelector('iframe');
}

/**
 * Make an oEmbed call for the specified URL.
 *
 * @param {string} videoUrl The vimeo.com url for the video.
 * @param {Object} [params] Parameters to pass to oEmbed.
 * @param {HTMLElement} element The element.
 * @return {Promise}
 */
export function getOEmbedData(videoUrl, params = {}, element) {
    return new Promise((resolve, reject) => {
        if (!isVimeoUrl(videoUrl)) {
            throw new TypeError(`“${videoUrl}” is not a vimeo.com url.`);
        }

        const domain = getOembedDomain(videoUrl);
        let url = `https://${domain}/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;

        for (const param in params) {
            if (params.hasOwnProperty(param)) {
                url += `&${param}=${encodeURIComponent(params[param])}`;
            }
        }

        const xhr = 'XDomainRequest' in window ? new XDomainRequest() : new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function() {
            if (xhr.status === 404) {
                reject(new Error(`“${videoUrl}” was not found.`));
                return;
            }

            if (xhr.status === 403) {
                reject(new Error(`“${videoUrl}” is not embeddable.`));
                return;
            }

            try {
                const json = JSON.parse(xhr.responseText);
                // Check api response for 403 on oembed
                if (json.domain_status_code === 403) {
                    // We still want to create the embed to give users visual feedback
                    createEmbed(json, element);
                    reject(new Error(`“${videoUrl}” is not embeddable.`));
                    return;
                }

                resolve(json);
            }
            catch (error) {
                reject(error);
            }
        };

        xhr.onerror = function() {
            const status = xhr.status ? ` (${xhr.status})` : '';
            reject(new Error(`There was an error fetching the embed code from Vimeo${status}.`));
        };

        xhr.send();
    });
}

/**
 * Initialize all embeds within a specific element
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */
export function initializeEmbeds(parent = document) {
    const elements = [].slice.call(parent.querySelectorAll('[data-vimeo-id], [data-vimeo-url]'));

    const handleError = (error) => {
        if ('console' in window && console.error) {
            console.error(`There was an error creating an embed: ${error}`);
        }
    };

    elements.forEach((element) => {
        try {
            // Skip any that have data-vimeo-defer
            if (element.getAttribute('data-vimeo-defer') !== null) {
                return;
            }

            const params = getOEmbedParameters(element);
            const url = getVimeoUrl(params);

            getOEmbedData(url, params, element).then((data) => {
                return createEmbed(data, element);
            }).catch(handleError);
        }
        catch (error) {
            handleError(error);
        }
    });
}

/**
 * Resize embeds when messaged by the player.
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */
export function resizeEmbeds(parent = document) {
    // Prevent execution if users include the player.js script multiple times.
    if (window.VimeoPlayerResizeEmbeds_) {
        return;
    }
    window.VimeoPlayerResizeEmbeds_ = true;

    const onMessage = (event) => {
        if (!isVimeoUrl(event.origin)) {
            return;
        }

        // 'spacechange' is fired only on embeds with cards
        if (!event.data || event.data.event !== 'spacechange') {
            return;
        }

        const iframes = parent.querySelectorAll('iframe');

        for (let i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow !== event.source) {
                continue;
            }

            // Change padding-bottom of the enclosing div to accommodate
            // card carousel without distorting aspect ratio
            const space = iframes[i].parentElement;
            space.style.paddingBottom = `${event.data.data[0].bottom}px`;

            break;
        }
    };

    window.addEventListener('message', onMessage);
}

/**
 * Add chapters to existing metadata for Google SEO
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */
export function initAppendVideoMetadata(parent = document) {
    //  Prevent execution if users include the player.js script multiple times.
    if (window.VimeoSeoMetadataAppended) {
        return;
    }
    window.VimeoSeoMetadataAppended = true;

    const onMessage = (event) => {
        if (!isVimeoUrl(event.origin)) {
            return;
        }

        const data = parseMessageData(event.data);
        if (!data || data.event !== 'ready') {
            return;
        }

        const iframes = parent.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];

            // Initiate appendVideoMetadata if iframe is a Vimeo embed
            const isValidMessageSource = iframe.contentWindow === event.source;
            if (isVimeoEmbed(iframe.src) && isValidMessageSource) {
                const player = new Player(iframe);
                player.callMethod('appendVideoMetadata', window.location.href);
            }
        }
    };

    window.addEventListener('message', onMessage);
}

/**
 * Seek to time indicated by vimeo_t query parameter if present in URL
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */
export function checkUrlTimeParam(parent = document) {
    //  Prevent execution if users include the player.js script multiple times.
    if (window.VimeoCheckedUrlTimeParam) {
        return;
    }
    window.VimeoCheckedUrlTimeParam = true;

    const handleError = (error) => {
        if ('console' in window && console.error) {
            console.error(`There was an error getting video Id: ${error}`);
        }
    };

    const onMessage = (event) => {
        if (!isVimeoUrl(event.origin)) {
            return;
        }

        const data = parseMessageData(event.data);
        if (!data || data.event !== 'ready') {
            return;
        }

        const iframes = parent.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            const isValidMessageSource = iframe.contentWindow === event.source;

            if (isVimeoEmbed(iframe.src) && isValidMessageSource) {
                const player = new Player(iframe);
                player
                    .getVideoId()
                    .then((videoId) => {
                        const matches = new RegExp(`[?&]vimeo_t_${videoId}=([^&#]*)`).exec(window.location.href);
                        if (matches && matches[1]) {
                            const sec = decodeURI(matches[1]);
                            player.setCurrentTime(sec);
                        }
                        return;
                    })
                    .catch(handleError);
            }
        }
    };

    window.addEventListener('message', onMessage);
}
