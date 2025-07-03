'use strict';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    extends: [],
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
