/**
 * @module lib/functions
 */

/**
 * Get the name of the method for a given getter or setter.
 *
 * @author Brad Dougherty <brad@vimeo.com>
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
 * @author Brad Dougherty <brad@vimeo.com>
 * @param {*} element The object to check.
 * @return {boolean}
 */
export function isDomElement(element) {
    return element instanceof window.HTMLElement;
}

/**
 * Check to see whether the value is a number.
 *
 * @author Brad Dougherty <brad@vimeo.com>
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
 * @author Brad Dougherty <brad@vimeo.com>
 * @param {string} url The url string.
 * @return {boolean}
 */
export function isVimeoUrl(url) {
    return (/^(https?:)?\/\/((player|www).)?vimeo.com(?=$|\/)/).test(url);
}

/**
 * Get the Vimeo URL from an element.
 * The element must have either a data-vimeo-id or data-vimeo-url attribute.
 *
 * @author Brad Dougherty <brad@vimeo.com>
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
