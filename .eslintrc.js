'use strict';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    root: true,
    extends: [],
    plugins: ['compat'],
    parserOptions: {
        ecmaVersion: 2021
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
