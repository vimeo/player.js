/**
 * @module lib/callbacks
 */

export const callbackMap = new WeakMap();

/**
 * Store a callback for a method or event for a player.
 *
 * @param {Player} player The player object.
 * @param {string} name The method or event name.
 * @param {(function(this:Player, *): void|{resolve: function, reject: function})} callback
 *        The callback to call or an object with resolve and reject functions for a promise.
 * @return {void}
 */
export function storeCallback(player, name, callback) {
    const playerCallbacks = callbackMap.get(player.element) || {};

    if (!(name in playerCallbacks)) {
        playerCallbacks[name] = [];
    }

    playerCallbacks[name].push(callback);
    callbackMap.set(player.element, playerCallbacks);
}

/**
 * Get the callbacks for a player and event or method.
 *
 * @param {Player} player The player object.
 * @param {string} name The method or event name
 * @return {function[]}
 */
export function getCallbacks(player, name) {
    const playerCallbacks = callbackMap.get(player.element) || {};
    return playerCallbacks[name] || [];
}

/**
 * Remove a stored callback for a method or event for a player.
 *
 * @param {Player} player The player object.
 * @param {string} name The method or event name
 * @param {function} [callback] The specific callback to remove.
 * @return {boolean} Was this the last callback?
 */
export function removeCallback(player, name, callback) {
    const playerCallbacks = callbackMap.get(player.element) || {};

    if (!playerCallbacks[name]) {
        return true;
    }

    // If no callback is passed, remove all callbacks for the event
    if (!callback) {
        playerCallbacks[name] = [];
        callbackMap.set(player.element, playerCallbacks);

        return true;
    }

    const index = playerCallbacks[name].indexOf(callback);

    if (index !== -1) {
        playerCallbacks[name].splice(index, 1);
    }

    callbackMap.set(player.element, playerCallbacks);
    return playerCallbacks[name] && playerCallbacks[name].length === 0;
}

/**
 * Return the first stored callback for a player and event or method.
 *
 * @param {Player} player The player object.
 * @param {string} name The method or event name.
 * @return {function} The callback, or false if there were none
 */
export function shiftCallbacks(player, name) {
    const playerCallbacks = getCallbacks(player, name);

    if (playerCallbacks.length < 1) {
        return false;
    }

    const callback = playerCallbacks.shift();
    removeCallback(player, name, callback);
    return callback;
}

/**
 * Move callbacks associated with an element to another element.
 *
 * @param {HTMLElement} oldElement The old element.
 * @param {HTMLElement} newElement The new element.
 * @return {void}
 */
export function swapCallbacks(oldElement, newElement) {
    const playerCallbacks = callbackMap.get(oldElement);

    callbackMap.set(newElement, playerCallbacks);
    callbackMap.delete(oldElement);
}
