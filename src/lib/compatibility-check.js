export const isNode = typeof global !== 'undefined' && ({}).toString.call(global) === '[object global]';
const arrayIndexOfSupport = typeof Array.prototype.indexOf !== 'undefined';
const postMessageSupport = typeof window !== 'undefined' && typeof window.postMessage !== 'undefined';

export function checkCompatibility() {
    if (!arrayIndexOfSupport || !postMessageSupport) {
        throw new Error('Sorry, the Vimeo Player API is not available in this browser.');
    }
}
