import test from 'ava';
import html from './helpers/html';
import { getMethodName, isDomElement, isInteger, isVimeoUrl, isVimeoEmbed, getVimeoUrl, getOembedDomain, findIframeBySourceWindow } from '../src/lib/functions';

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
    t.true(isVimeoUrl('http://player.subdomain.videoji.cn') === true);
    t.true(isVimeoUrl('http://player.subdomain.videoji.cn/video/12345') === true);
    t.true(isVimeoUrl('http://player.subdomain.videoji.cn/video/12345?h=a1b2c3d4') === true);
    t.true(isVimeoUrl('http://player.subdomain.vimeo.work') === true);
    t.true(isVimeoUrl('http://player.subdomain.vimeo.work/video/12345') === true);
    t.true(isVimeoUrl('http://player.subdomain.vimeo.work/video/12345?h=a1b2c3d4') === true);
    t.true(isVimeoUrl('http://player.subdomain.videoji.hk') === true);
    t.true(isVimeoUrl('http://player.subdomain.videoji.hk/video/12345') === true);
    t.true(isVimeoUrl('http://player.subdomain.videoji.hk/video/12345?h=a1b2c3d4') === true);
    t.true(isVimeoUrl('http://subdomain.videoji.hk') === true);
    t.true(isVimeoUrl('http://videoji.hk') === false);
    t.true(isVimeoUrl('//player.vimeo.com') === true);
    t.true(isVimeoUrl('https://player.vimeo.com') === true);
    t.true(isVimeoUrl('https://notvimeo.com') === false);
    t.true(isVimeoUrl('https://vimeo.someone.com') === false);
    t.true(isVimeoUrl('https://player.vimeo.com/video/123') === true);
    t.true(isVimeoUrl('https://vimeo.com/445351154') === true);
    t.true(isVimeoUrl('https://vimeo.com.evil.net') === false);
    t.true(isVimeoUrl('http://player.vimeo.com.evil.com') === false);
    t.true(isVimeoUrl('https://player.vimeozcom') === false);
    t.true(isVimeoUrl('https://www2vimeo.com') === false);
});

test('isVimeoEmbed identifies Vimeo embeds only', (t) => {
    t.true(isVimeoEmbed('https://player.vimeo.com/video/76979871?h=8272103f6e') === true);
    t.true(isVimeoEmbed('https://player.vimeo.com/video/76979871') === true);
    t.true(isVimeoEmbed('http://player.vimeo.com/video/76979871?h=8272103f6e') === false);
    t.true(isVimeoEmbed('http://player.subdomain.videoji.hk/video/76979871?h=8272103f6e') === false);
    t.true(isVimeoEmbed('https://player.subdomain.videoji.hk/video/76979871?h=8272103f6e') === true);
    t.true(isVimeoEmbed('http2://not-vimeo.com/video/76979871') === false);
    t.true(isVimeoEmbed('https://player.subdomain.videoji.cn/video/76979871?h=8272103f6e') === true);
    t.true(isVimeoEmbed('https://player.subdomain.vimeo.work/video/76979871?h=8272103f6e') === true);
    t.true(isVimeoEmbed('http2://not-vimeo.com/video/76979871') === false);
});

test('getOembedDomain correctly returns a domain from a url', (t) => {
    t.true(getOembedDomain('https://player.vimeo.com/video/76979871?h=8272103f6e') === 'vimeo.com');
    t.true(getOembedDomain('https://player.vimeo.com/video/76979871') === 'vimeo.com');
    t.true(getOembedDomain('http://player.vimeo.com/video/76979871?h=8272103f6e') === 'vimeo.com');
    t.true(getOembedDomain('http://player.subdomain.videoji.hk/video/76979871?h=8272103f6e') === 'subdomain.videoji.hk');
    t.true(getOembedDomain('https://player.subdomain.videoji.hk/video/76979871?h=8272103f6e') === 'subdomain.videoji.hk');
    t.true(getOembedDomain('https://player.subdomain.videoji.cn/video/76979871?h=8272103f6e') === 'subdomain.videoji.cn');
    t.true(getOembedDomain('https://player.subdomain.vimeo.work/video/76979871?h=8272103f6e') === 'subdomain.vimeo.work');
    t.true(getOembedDomain('http2://not-vimeo.com/video/76979871') === 'vimeo.com');
    t.true(getOembedDomain(null) === 'vimeo.com');
    t.true(getOembedDomain(undefined) === 'vimeo.com');
    t.true(getOembedDomain('') === 'vimeo.com');
});

test('getVimeoUrl correctly returns a url from the embed parameters', (t) => {
    t.true(getVimeoUrl({ id: 445351154 }) === 'https://vimeo.com/445351154');
    t.true(getVimeoUrl({ url: 'http://vimeo.com/445351154' }) === 'https://vimeo.com/445351154');
    t.true(getVimeoUrl({ url: 'https://vimeo.com/445351154' }) === 'https://vimeo.com/445351154');
});

test('getVimeoUrl throws when the required keys don’t exist', (t) => {
    t.throws(() => {
        getVimeoUrl();
    }, { instanceOf: Error });

    t.throws(() => {
        getVimeoUrl({ id: 'string' });
    }, { instanceOf: TypeError });

    t.throws(() => {
        getVimeoUrl({ id: 'https://notvimeo.com/2' });
    }, { instanceOf: TypeError });

    t.throws(() => {
        getVimeoUrl({ url: 'https://notvimeo.com/2' });
    }, { instanceOf: TypeError });
});

test('findIframeBySourceWindow returns the correct iframe for a given source window', (t) => {
    // Create a mock document with iframes
    const mockDoc = {
        iframes: [],
        querySelectorAll: function(selector) {
            if (selector === 'iframe') {
                return this.iframes;
            }
            return [];
        }
    };

    // Create mock iframes with contentWindow properties
    const mockWindow1 = {};
    const mockWindow2 = {};
    const mockWindow3 = {};

    const mockIframe1 = { contentWindow: mockWindow1 };
    const mockIframe2 = { contentWindow: mockWindow2 };
    const mockIframe3 = { contentWindow: mockWindow3 };

    mockDoc.iframes = [mockIframe1, mockIframe2, mockIframe3];

    // Test finding each iframe by its source window
    t.is(findIframeBySourceWindow(mockWindow1, mockDoc), mockIframe1);
    t.is(findIframeBySourceWindow(mockWindow2, mockDoc), mockIframe2);
    t.is(findIframeBySourceWindow(mockWindow3, mockDoc), mockIframe3);

    // Test with a window that doesn't match any iframe
    const unknownWindow = {};
    t.is(findIframeBySourceWindow(unknownWindow, mockDoc), null);
});

test('findIframeBySourceWindow handles edge cases and invalid inputs', (t) => {
    // Create a minimal mock document
    const mockDoc = {
        iframes: [],
        querySelectorAll: function(selector) {
            if (selector === 'iframe') {
                return this.iframes;
            }
            return [];
        }
    };

    // Test with null/undefined inputs
    t.is(findIframeBySourceWindow(null, mockDoc), null);
    t.is(findIframeBySourceWindow(undefined, mockDoc), null);
    t.is(findIframeBySourceWindow({}, null), null);
    t.is(findIframeBySourceWindow({}, undefined), null);

    // Test with a document that doesn't have querySelectorAll
    t.is(findIframeBySourceWindow({}, {}), null);

    // Test with empty iframe array
    t.is(findIframeBySourceWindow({}, mockDoc), null);

    // Test with iframe that has null contentWindow
    mockDoc.iframes = [{ contentWindow: null }];
    t.is(findIframeBySourceWindow({}, mockDoc), null);

    // Test with iframe that is null
    mockDoc.iframes = [null];
    t.is(findIframeBySourceWindow({}, mockDoc), null);
});
