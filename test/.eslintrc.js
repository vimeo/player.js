'use strict';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    root: true,
    plugins: ['ava'],
    extends: 'plugin:ava/recommended',
    parserOptions: {
        'ecmaVersion': 12,
    },
    parser: '@babel/eslint-parser',
    rules: {
        'ava/no-cb-test': ERROR,
        'no-restricted-syntax': OFF,
        'max-nested-callbacks': [WARNING, 3],
    }
};
