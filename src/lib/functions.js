/**
 * @module lib/functions
 */

/**
 * Check to see this is a node environment.
 * @type {Boolean}
 */
/* global global */
export const isNode = typeof global !== 'undefined' &&
  ({}).toString.call(global) === '[object global]';

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
