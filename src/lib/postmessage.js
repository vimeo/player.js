/**
 * @module lib/postmessage
 */

import { getCallbacks, removeCallback, shiftCallbacks } from './callbacks';

/**
 * Parse a message received from postMessage.
 *
 * @param {*} data The data received from postMessage.
 * @return {object}
 */
export function parseMessageData(data) {
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    return data;
}

/**
 * Post a message to the specified target.
 *
 * @param {Player} player The player object to use.
 * @param {string} method The API method to call.
 * @param {object} params The parameters to send to the player.
 * @return {void}
 */
export function postMessage(player, method, params) {
    if (!player.element.contentWindow || !player.element.contentWindow.postMessage) {
        return;
    }

    let message = {
        method
    };

    if (params !== undefined) {
        message.value = params;
    }

    // IE 8 and 9 do not support passing messages, so stringify them
    const ieVersion = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, '$1'));
    if (ieVersion >= 8 && ieVersion < 10) {
        message = JSON.stringify(message);
    }

    player.element.contentWindow.postMessage(message, player.origin);
}

/**
 * Parse the data received from a message event.
 *
 * @param {Player} player The player that received the message.
 * @param {(Object|string)} data The message data. Strings will be parsed into JSON.
 * @return {void}
 */
export function processData(player, data) {
    data = parseMessageData(data);
    let callbacks = [];
    let param;

    if (data.event) {
        if (data.event === 'error') {
            const promises = getCallbacks(player, data.data.method);

            promises.forEach((promise) => {
                const error = new Error(data.data.message);
                error.name = data.data.name;

                promise.reject(error);
                removeCallback(player, data.data.method, promise);
            });
        }

        callbacks = getCallbacks(player, `event:${data.event}`);
        param = data.data;
    }
    else if (data.method) {
        const callback = shiftCallbacks(player, data.method);

        if (callback) {
            callbacks.push(callback);
            param = data.value;
        }
    }

    callbacks.forEach((callback) => {
        try {
            if (typeof callback === 'function') {
                callback.call(player, param);
                return;
            }

            callback.resolve(param);
        }
        catch (e) {
            // empty
        }
    });
}
