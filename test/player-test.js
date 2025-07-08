import test from 'ava';
import sinon from 'sinon';
import html from './helpers/html';
import Player from '../src/player';

test('constructor accepts only Vimeo embeds', (t) => {
    t.throws(() => {
        void new Player(html`<div data-vimeo-initialized><iframe></iframe></div>`);
    }, null);

    t.throws(() => {
        void new Player('string');
    }, null);

    t.throws(() => {
        void new Player(html`<iframe></iframe>`);
    }, null);

    t.throws(() => {
        void new Player(html`<iframe src="https://www.youtube.com/embed/Uj3_KqkI9Zo"></iframe>`);
    }, null);
});

test('contructor does not throw if jquery is not present', (t) => {
    /* eslint-env jquery */
    /* globals jQuery:true */
    const frames = jQuery('iframe')[0];
    const oldJQuery = jQuery;

    window.jQuery = jQuery = undefined;

    t.notThrows(() => {
        void new Player(frames);
    });

    jQuery = window.jQuery = oldJQuery;
});

test('constructor uses the first element from a jQuery object', (t) => {
    /* eslint-env jquery */
    const consoleWarnSpy = sinon.spy(console, 'warn');

    const iframes = jQuery('iframe');
    const player = new Player(iframes);

    t.true(consoleWarnSpy.called);
    t.true(player.element === iframes[0]);

    console.warn.restore();
});

test('constructor does not warn if only one jQuery object', (t) => {
    /* eslint-env jquery */
    const consoleWarnSpy = sinon.spy(console, 'warn');

    const div = jQuery('.one');
    const player = new Player(div);

    t.true(consoleWarnSpy.called === false);
    t.true(player.element === div[0]);

    console.warn.restore();
});

test('constructor returns the same player object for the same element', (t) => {
    const iframe = document.querySelector('.one');
    const player1 = new Player(iframe);
    const player2 = new Player(iframe);

    t.true(player1 === player2);
});

test('constructing a player with a bad URI should fail', async (t) => {
    const player1 = new Player(
        html`<div data-vimeo-id="1"></div>`
    );
    await t.throwsAsync(() => player1.ready());
});

test('future calls to destroyed player should not not work', async (t) => {
    const player1 = new Player(
        html`<iframe id="to-destroy" src="https://player.vimeo.com/video/76979871"></iframe>`
    );

    await t.notThrows(() => player1.destroy());
    t.falsy(document.querySelector('#to-destroy'));

    await t.throwsAsync(() => player1.ready());
    await t.throwsAsync(() => player1.loadVideo(1));
});

test('player object includes all api methods', async (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    const methods = Object.getOwnPropertyNames(Player.prototype)
        .filter((method) => method !== 'constructor')

    methods.forEach((method) => {
        t.true(typeof player[method] === 'function');
    });

    const getters = methods.filter((method) => /^get[A-Z]/.test(method));
    getters.forEach((method) => {
        t.true(player[method]() instanceof Promise);
    });

    const setters = methods.filter((method) => /^set[A-Z]/.test(method));
    for (const method of setters) {
        await t.throwsAsync(() => player[method](), { instanceOf: TypeError });
    }

    t.true(player.ready() instanceof Promise);
    t.true(player.play() instanceof Promise);
    t.true(player.pause() instanceof Promise);
    t.true(player.loadVideo() instanceof Promise);
    await t.throws(() => player.enableTextTrack(), { instanceOf: TypeError });
    await t.throwsAsync(() => player.setTimingSrc(), { instanceOf: TypeError });
    t.true(player.enableTextTrack('en') instanceof Promise);
    t.true(player.disableTextTrack() instanceof Promise);
    t.true(player.addCuePoint() instanceof Promise);
    t.true(player.removeCuePoint() instanceof Promise);
    t.true(player.requestFullscreen() instanceof Promise);
    t.true(player.exitFullscreen() instanceof Promise);
    t.true(player.remotePlaybackPrompt() instanceof Promise);
});

test('set requires a value', async (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    await t.throwsAsync(() => player.set('color'), { instanceOf: TypeError });
});

test('on requires an event and a callback', (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    t.throws(() => player.on(), { instanceOf: TypeError }, 'You must pass an event name.');
    t.throws(() => player.on('play'), { instanceOf: TypeError }, 'You must pass a callback function.');
    t.throws(() => player.on('play', 'string'), { instanceOf: TypeError }, 'The callback must be a function.');
    t.notThrows(() => player.on('play', () => {
    }));
});

test('off requires an event name, and the optional callback must be a function', (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    t.throws(() => player.off(), { instanceOf: TypeError }, 'You must pass an event name.');
    t.throws(() => player.off('play', 'string'), { instanceOf: TypeError }, 'The callback must be a function.');
    t.notThrows(() => player.off('play', () => {
    }));
});

test('player class static method isVimeoUrl ', (t) => {
    t.true(typeof Player.isVimeoUrl === 'function', 'isVimeoUrl should be a function');
    t.true(Player.isVimeoUrl('https://vimeo.com/76979871'));
    t.true(Player.isVimeoUrl('https://player.vimeo.com/video/19231868?h=1034d5269b&loop=1'));
    t.false(Player.isVimeoUrl('https://livestream.com/123456789'));
});
