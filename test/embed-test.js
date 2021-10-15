import test from 'ava';
import html from './helpers/html';
import { getOEmbedParameters, getOEmbedData, createEmbed, initializeEmbeds, resizeEmbeds } from '../src/lib/embed';

test('getOEmbedParameters retrieves the params from data attributes', (t) => {
    const el = html`<div data-vimeo-id="336812660" data-vimeo-width="640" data-vimeo-autoplay></div>`;
    t.deepEqual(getOEmbedParameters(el), {
        id: '336812660',
        width: '640',
        autoplay: 1
    });
});

test('getOEmbedParameters builds off of a defaults object', (t) => {
    const el = html`<div data-vimeo-id="336812660" data-vimeo-width="640" data-vimeo-autoplay></div>`;
    t.deepEqual(getOEmbedParameters(el, { loop: true }), {
        id: '336812660',
        width: '640',
        autoplay: 1,
        loop: true
    });
});

test('getOEmbedData doesn’t operate on non-Vimeo urls', async (t) => {
    t.plan(1);
    await t.throwsAsync(() => getOEmbedData('https://notvimeo.com'), { instanceOf: TypeError });
});

test('getOEmbedData returns a json oembed response', async (t) => {
    t.plan(2);
    const result = await getOEmbedData('https://player.vimeo.com/video/336812660');
    t.is(typeof result, 'object');
    t.is(result.type, 'video');
});

test('createEmbed should throw if there’s no element', (t) => {
    t.throws(() => {
        createEmbed({ html: 'html' });
    }, { instanceOf: TypeError });
});

test('createEmbed returns the already-initialized iframe', (t) => {
    const container = html`<div data-vimeo-initialized></div>`;
    const iframe = html`<iframe src="https://player.vimeo.com/336812660"></iframe>`;
    container.appendChild(iframe);
    t.deepEqual(createEmbed({ html: 'html' }, container), iframe);
});

test('createEmbed makes an iframe from the oembed data', (t) => {
    const container = html`<div></div>`;
    const markup = '<iframe src="https://player.vimeo.com/336812660"></iframe>';

    const embed = createEmbed({ html: markup }, container);
    t.true(container.getAttribute('data-vimeo-initialized') === 'true');
    t.deepEqual(embed.outerHTML, html`<iframe src="https://player.vimeo.com/336812660"></iframe>`.outerHTML);
});

test('createEmbed returns the iframe from a responsive embed', (t) => {
    const container = html`<div></div>`;
    const markup = '<div style="position:relative;padding-bottom:42.5%;height:0"><iframe src="https://player.vimeo.com/video/336812660" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0"></iframe></div>';

    const embed = createEmbed({ html: markup }, container);
    t.true(container.getAttribute('data-vimeo-initialized') === 'true');
    t.deepEqual(embed.outerHTML, html`<iframe src="https://player.vimeo.com/video/336812660" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0"></iframe>`.outerHTML);
});

test('initializeEmbeds should create embeds', async (t) => {
    const div = html`<div data-vimeo-id="336812660" data-vimeo-width="640" id="handstick"></div>`;
    document.body.appendChild(div);

    await new Promise((resolve, reject) => {
        initializeEmbeds();
        // wait 500ms for the embeds to initialize.
        setTimeout(resolve, 500);
    });

    t.is(document.body.querySelector('#handstick').firstChild.nodeName, 'IFRAME');
});

test('resizeEmbeds is a function and sets a window property', (t) => {
    t.plan(2);
    t.true(typeof resizeEmbeds === 'function');

    resizeEmbeds();
    t.true(window.VimeoPlayerResizeEmbeds_);
});
