import { isServerRuntime } from './functions';

const arrayIndexOfSupport = typeof Array.prototype.indexOf !== 'undefined';
const postMessageSupport = typeof window !== 'undefined' && typeof window.postMessage !== 'undefined';

if (!isServerRuntime && (!arrayIndexOfSupport || !postMessageSupport)) {
    throw new Error('Sorry, the Vimeo Player API is not available in this browser.');
}
