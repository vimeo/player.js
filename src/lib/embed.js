/**
 * @module lib/embed
 */

import { isVimeoUrl, getVimeoUrl } from './functions';

const oEmbedParameters = [
    'id',
    'url',
    'width',
    'maxwidth',
    'height',
    'maxheight',
    'portrait',
    'title',
    'byline',
    'color',
    'autoplay',
    'autopause',
    'loop',
    'responsive'
];

/**
 * Get the 'data-vimeo'-prefixed attributes from an element as an object.
 *
 * @author Brad Dougherty <brad@vimeo.com>
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
 * Make an oEmbed call for the specified URL.
 *
 * @author Brad Dougherty <brad@vimeo.com>
 * @param {string} videoUrl The vimeo.com url for the video.
 * @param {Object} [params] Parameters to pass to oEmbed.
 * @return {Promise}
 */
export function getOEmbedData(videoUrl, params = {}) {
    return new Promise((resolve, reject) => {
        if (!isVimeoUrl(videoUrl)) {
            throw new TypeError(`“${videoUrl}” is not a vimeo.com url.`);
        }

        let url = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;

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
 * Create an embed from oEmbed data inside an element.
 *
 * @author Brad Dougherty <brad@vimeo.com>
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
 * Initialize all embeds within a specific element
 *
 * @author Brad Dougherty <brad@vimeo.com>
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

            getOEmbedData(url, params).then((data) => {
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
 * @author Brad Dougherty <brad@vimeo.com>
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */
export function resizeEmbeds(parent = document) {
    const onMessage = (event) => {
        if (!isVimeoUrl(event.origin)) {
            return;
        }

        if (!event.data || event.data.event !== 'spacechange') {
            return;
        }

        const iframes = parent.querySelectorAll('iframe');

        for (let i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow !== event.source) {
                continue;
            }

            const space = iframes[i].parentElement;

            if (space && space.className.indexOf('vimeo-space') !== -1) {
                space.style.paddingBottom = `${event.data.data[0].bottom}px`;
            }

            break;
        }
    };

    if (window.addEventListener) {
        window.addEventListener('message', onMessage, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onmessage', onMessage);
    }
}
