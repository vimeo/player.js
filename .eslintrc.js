'use strict';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    extends: '@vimeo/eslint-config-player/es6',
    plugins: ['compat'],
    parserOptions: {
        ecmaVersion: 12
    },
    parser: '@babel/eslint-parser',
    rules: {
        'compat/compat': ERROR
    },
    globals: {
        XDomainRequest: false
    },
    settings: {
        polyfills: [
            'Promise'
        ]
    }
};
