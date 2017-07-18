import test from 'ava';
import html from './helpers/html';
import { getMethodName, isDomElement, isInteger, isVimeoUrl, getVimeoUrl } from '../src/lib/functions';

test('getMethodName properly formats the method name', (t) => {
    t.true(getMethodName('color', 'get') === 'getColor');
    t.true(getMethodName('color', 'GET') === 'getColor');
    t.true(getMethodName('getColor', 'get') === 'getColor');
    t.true(getMethodName('color', 'set') === 'setColor');
    t.true(getMethodName('color', 'SET') === 'setColor');
    t.true(getMethodName('setColor', 'set') === 'setColor');
});

test('isDomElement returns true for elements', (t) => {
    t.true(isDomElement() === false);
    t.true(isDomElement('string') === false);
    t.true(isDomElement(true) === false);
    t.true(isDomElement(false) === false);
    t.true(isDomElement(1) === false);
    t.true(isDomElement(1.1) === false);
    t.true(isDomElement(html`<iframe></iframe>`) === true);
    t.true(isDomElement(html`<div></div>`) === true);
});

test('isInteger returns true for integers', (t) => {
    t.true(isInteger(1) === true);
    t.true(isInteger('1') === true);
    t.true(isInteger(1.0) === true);
    t.true(isInteger(1.1) === false);
    t.true(isInteger(false) === false);
    t.true(isInteger(NaN) === false);
    t.true(isInteger(Infinity) === false);
});

test('isVimeoUrl identifies *.vimeo.com only', (t) => {
    t.true(isVimeoUrl('http://vimeo.com') === true);
    t.true(isVimeoUrl('https://vimeo.com') === true);
    t.true(isVimeoUrl('//vimeo.com') === true);
    t.true(isVimeoUrl('http://www.vimeo.com') === true);
    t.true(isVimeoUrl('https://www.vimeo.com') === true);
    t.true(isVimeoUrl('//www.vimeo.com') === true);
    t.true(isVimeoUrl('http://player.vimeo.com') === true);
    t.true(isVimeoUrl('//player.vimeo.com') === true);
    t.true(isVimeoUrl('https://player.vimeo.com') === true);
    t.true(isVimeoUrl('https://notvimeo.com') === false);
    t.true(isVimeoUrl('https://vimeo.someone.com') === false);
    t.true(isVimeoUrl('https://player.vimeo.com/video/123') === true);
    t.true(isVimeoUrl('https://vimeo.com/2') === true);
    t.true(isVimeoUrl('https://vimeo.com.evil.net') === false);
    t.true(isVimeoUrl('http://player.vimeo.com.evil.com') === false);
});

test('getVimeoUrl correctly returns a url from the embed parameters', (t) => {
    t.true(getVimeoUrl({ id: 2 }) === 'https://vimeo.com/2');
    t.true(getVimeoUrl({ url: 'http://vimeo.com/2' }) === 'https://vimeo.com/2');
    t.true(getVimeoUrl({ url: 'https://vimeo.com/2' }) === 'https://vimeo.com/2');

});

test('getVimeoUrl throws when the required keys don’t exist', (t) => {
    t.throws(() => {
        getVimeoUrl();
    }, Error);

    t.throws(() => {
        getVimeoUrl({ id: 'string' });
    }, TypeError);

    t.throws(() => {
        getVimeoUrl({ id: 'https://notvimeo.com/2' });
    }, TypeError);

    t.throws(() => {
        getVimeoUrl({ url: 'https://notvimeo.com/2' });
    }, TypeError);
});
