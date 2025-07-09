'use strict';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    root: true,
    plugins: ['ava'],
    extends: 'plugin:ava/recommended',
    parserOptions: {
        'ecmaVersion': 2021,
    },
    parser: '@babel/eslint-parser',
    rules: {
        'no-restricted-syntax': OFF,
        'max-nested-callbacks': [WARNING, 3],
    }
};
