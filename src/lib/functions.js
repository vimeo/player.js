/**
 * @module lib/functions
 */

/**
 * Check to see this is a Node environment.
 * @type {boolean}
 */
/* global global */
export const isNode = typeof global !== 'undefined' &&
  ({}).toString.call(global) === '[object global]';

/**
 * Check to see if this is a Bun environment.
 * @see https://bun.sh/guides/util/detect-bun
 * @type {boolean}
 */
export const isBun = typeof Bun !== 'undefined';

/**
 * Check to see if this is a Deno environment.
 * @see https://docs.deno.com/api/deno/~/Deno
 * @type {boolean}
 */
export const isDeno = typeof Deno !== 'undefined';

/**
 * Check if this is a server runtime
 * @type {boolean}
 */
export const isServerRuntime = isNode || isBun || isDeno;

/**
 * Get the name of the method for a given getter or setter.
 *
 * @param {string} prop The name of the property.
 * @param {string} type Either “get” or “set”.
 * @return {string}
 */
export function getMethodName(prop, type) {
    if (prop.indexOf(type.toLowerCase()) === 0) {
        return prop;
    }

    return `${type.toLowerCase()}${prop.substr(0, 1).toUpperCase()}${prop.substr(1)}`;
}

/**
 * Check to see if the object is a DOM Element.
 *
 * @param {*} element The object to check.
 * @return {boolean}
 */
export function isDomElement(element) {
    return Boolean(
        element && element.nodeType === 1 && 'nodeName' in element &&
        element.ownerDocument && element.ownerDocument.defaultView
    );
}

/**
 * Check to see whether the value is a number.
 *
 * @see http://dl.dropboxusercontent.com/u/35146/js/tests/isNumber.html
 * @param {*} value The value to check.
 * @param {boolean} integer Check if the value is an integer.
 * @return {boolean}
 */
export function isInteger(value) {
    // eslint-disable-next-line eqeqeq
    return !isNaN(parseFloat(value)) && isFinite(value) && Math.floor(value) == value;
}

/**
 * Check to see if the URL is a Vimeo url.
 *
 * @param {string} url The url string.
 * @return {boolean}
 */
export function isVimeoUrl(url) {
    return (/^(https?:)?\/\/((((player|www)\.)?vimeo\.com)|((player\.)?[a-zA-Z0-9-]+\.(videoji\.(hk|cn)|vimeo\.work)))(?=$|\/)/).test(url);
}

/**
 * Check to see if the URL is for a Vimeo embed.
 *
 * @param {string} url The url string.
 * @return {boolean}
 */
export function isVimeoEmbed(url) {
    const expr = /^https:\/\/player\.((vimeo\.com)|([a-zA-Z0-9-]+\.(videoji\.(hk|cn)|vimeo\.work)))\/video\/\d+/;
    return expr.test(url);
}

export function getOembedDomain(url) {
    const match = (url || '').match(/^(?:https?:)?(?:\/\/)?([^/?]+)/);
    const domain = ((match && match[1]) || '').replace('player.', '');
    const customDomains = [
        '.videoji.hk',
        '.vimeo.work',
        '.videoji.cn'
    ];

    for (const customDomain of customDomains) {
        if (domain.endsWith(customDomain)) {
            return domain;
        }
    }

    return 'vimeo.com';
}

/**
 * Get the Vimeo URL from an element.
 * The element must have either a data-vimeo-id or data-vimeo-url attribute.
 *
 * @param {object} oEmbedParameters The oEmbed parameters.
 * @return {string}
 */
export function getVimeoUrl(oEmbedParameters = {}) {
    const id = oEmbedParameters.id;
    const url = oEmbedParameters.url;
    const idOrUrl = id || url;

    if (!idOrUrl) {
        throw new Error('An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.');
    }

    if (isInteger(idOrUrl)) {
        return `https://vimeo.com/${idOrUrl}`;
    }

    if (isVimeoUrl(idOrUrl)) {
        return idOrUrl.replace('http:', 'https:');
    }

    if (id) {
        throw new TypeError(`“${id}” is not a valid video id.`);
    }

    throw new TypeError(`“${idOrUrl}” is not a vimeo.com url.`);
}

/* eslint-disable max-params */
/**
 * A utility method for attaching and detaching event handlers
 *
 * @param {EventTarget} target
 * @param {string | string[]} eventName
 * @param {function} callback
 * @param {'addEventListener' | 'on'} onName
 * @param {'removeEventListener' | 'off'} offName
 * @return {{cancel: (function(): void)}}
 */
export const subscribe = (target, eventName, callback, onName = 'addEventListener', offName = 'removeEventListener') => {
    const eventNames = typeof eventName === 'string' ? [eventName] : eventName;

    eventNames.forEach((evName) => {
        target[onName](evName, callback);
    });

    return {
        cancel: () => eventNames.forEach((evName) => target[offName](evName, callback))
    };
};

export const logSurveyLink = () => {
    console.log(
        '\n%cVimeo is looking for feedback!\n%cComplete our survey about the Player SDK: https://t.maze.co/393567477',
        'color:#00adef;font-size:1.2em;',
        'color:#aaa;font-size:0.8em;'
    );
};

/**
 * Find the iframe element that contains a specific source window
 *
 * @param {Window} sourceWindow The source window to find the iframe for
 * @param {Document} [doc=document] The document to search within
 * @return {HTMLIFrameElement|null} The iframe element if found, otherwise null
 */
export function findIframeBySourceWindow(sourceWindow, doc = document) {
    if (!sourceWindow || !doc || typeof doc.querySelectorAll !== 'function') {
        return null;
    }

    const iframes = doc.querySelectorAll('iframe');

    for (let i = 0; i < iframes.length; i++) {
        if (iframes[i] && iframes[i].contentWindow === sourceWindow) {
            return iframes[i];
        }
    }

    return null;
}
