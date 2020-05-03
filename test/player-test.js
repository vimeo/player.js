import test from 'ava';
import sinon from 'sinon';
import html from './helpers/html';
import Player from '../src/player';

test('constructor accepts only Vimeo embeds', (t) => {
    t.throws(() => {
        void new Player(html`<div data-vimeo-initialized><iframe></iframe></div>`);
    });

    t.throws(() => {
        void new Player('string');
    });

    t.throws(() => {
        void new Player(html`<iframe></iframe>`);
    });

    t.throws(() => {
        void new Player(html`<iframe src="https://www.youtube.com/embed/Uj3_KqkI9Zo"></iframe>`);
    });
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

// test.skip('constructor accepts a div without attributes when there is an options object', (t) => {
//     t.notThrows(() => {
//         void new Player(html`<div id="player"></div>`, { id: 76979871 });
//     });
// });
//
// test.skip('constructor finds iframe elements within the provided element', (t) => {
//     const div = html`<div></div>`;
//     const iframe = html`<iframe src="https://player.vimeo.com/video/159195552" width="640" height="360" frameborder="0" allowfullscreen mozallowfullscreen webkitallowfullscreen></iframe>`;
//     div.appendChild(iframe);
//
//     const player = new Player(div);
//
//     t.ok(player.element === iframe);
// });

// test.skip('constructor gets an element by id if passed a string', (t) => {
//     const element = document.getElementById('test_player');
//     const player = new Player('test_player');
//
//     t.ok(player.element === element);
// });

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

test('player object includes all api methods', (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    t.true(typeof player.get === 'function');
    t.true(typeof player.set === 'function');
    t.true(typeof player.callMethod === 'function');
    t.true(typeof player.on === 'function');
    t.true(typeof player.off === 'function');
    t.true(typeof player.loadVideo === 'function');
    t.true(typeof player.enableTextTrack === 'function');
    t.true(typeof player.disableTextTrack === 'function');
    t.true(typeof player.pause === 'function');
    t.true(typeof player.play === 'function');
    t.true(typeof player.unload === 'function');
    t.true(typeof player.getAutopause === 'function');
    t.true(typeof player.setAutopause === 'function');
    t.true(typeof player.getChapters === 'function');
    t.true(typeof player.getCurrentChapter === 'function');
    t.true(typeof player.getColor === 'function');
    t.true(typeof player.setColor === 'function');
    t.true(typeof player.getCurrentTime === 'function');
    t.true(typeof player.setCurrentTime === 'function');
    t.true(typeof player.getDuration === 'function');
    t.true(typeof player.getEnded === 'function');
    t.true(typeof player.getLoop === 'function');
    t.true(typeof player.setLoop === 'function');
    t.true(typeof player.getPaused === 'function');
    t.true(typeof player.getPlaybackRate === 'function');
    t.true(typeof player.setPlaybackRate === 'function');
    t.true(typeof player.getTextTracks === 'function');
    t.true(typeof player.getVideoEmbedCode === 'function');
    t.true(typeof player.getVideoId === 'function');
    t.true(typeof player.getVideoTitle === 'function');
    t.true(typeof player.getVideoWidth === 'function');
    t.true(typeof player.getVideoHeight === 'function');
    t.true(typeof player.getVideoUrl === 'function');
    t.true(typeof player.getVolume === 'function');
    t.true(typeof player.setVolume === 'function');
    t.true(typeof player.getBuffered === 'function');
    t.true(typeof player.getPlayed === 'function');
    t.true(typeof player.getSeekable === 'function');
    t.true(typeof player.getSeeking === 'function');
    t.true(typeof player.getMuted === 'function');
    t.true(typeof player.setMuted === 'function');
});

test('set requires a value', async (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    await t.throwsAsync(() => player.set('color'), TypeError);
});

test('on requires an event and a callback', (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    t.throws(() => player.on(), TypeError, 'You must pass an event name.');
    t.throws(() => player.on('play'), TypeError, 'You must pass a callback function.');
    t.throws(() => player.on('play', 'string'), TypeError, 'The callback must be a function.');
    t.notThrows(() => player.on('play', () => {
    }));
});

test('off requires an event name, and the optional callback must be a function', (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    t.throws(() => player.off(), TypeError, 'You must pass an event name.');
    t.throws(() => player.off('play', 'string'), TypeError, 'The callback must be a function.');
    t.notThrows(() => player.off('play', () => {
    }));
});
