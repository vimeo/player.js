/** Base error type for Vimeo Player errors */
export interface VimeoError extends Error {
    name: string;
}

/** Error when a value is out of the acceptable range */
export interface RangeError extends VimeoError {
    name: "RangeError";
}

/** Error when a feature is not supported */
export interface UnsupportedError extends VimeoError {
    name: "UnsupportedError";
}

/** Error when an invalid parameter is provided */
export interface InvalidParameterError extends VimeoError {
    name: "InvalidParameterError";
}

/** Error when a requested item cannot be found */
export interface NotFoundError extends VimeoError {
    name: "NotFoundError";
}

/** Error when a password is required */
export interface PasswordError extends VimeoError {
    name: "PasswordError";
}

/** Error when a video is private */
export interface PrivacyError extends VimeoError {
    name: "PrivacyError";
}
