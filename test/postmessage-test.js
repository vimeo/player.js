import test from 'ava';
import sinon from 'sinon';
import { storeCallback, getCallbacks } from '../src/lib/callbacks';
import { parseMessageData, postMessage, processData } from '../src/lib/postmessage';

test('parseMessageData passes through objects', (t) => {
    t.deepEqual(parseMessageData({ method: 'getColor' }), { method: 'getColor' });
});

test('parseMessageData parses strings', (t) => {
    t.deepEqual(parseMessageData('{ "method": "getColor" }'), { method: 'getColor' });
});

test('postMessage doesn\'t fail if contentWindow is null', (t) => {
    const player = {
        element: {
            contentWindow: null
        },
        origin: 'playerOrigin'
    };

    postMessage(player, 'testMethod');
});

test('postMessage called correctly with just a method', (t) => {
    const postMessageSpy = sinon.spy();
    const player = {
        element: {
            contentWindow: {
                postMessage: postMessageSpy
            }
        },
        origin: 'playerOrigin'
    };

    postMessage(player, 'testMethod');

    t.true(postMessageSpy.called);
    t.true(postMessageSpy.calledWith({ method: 'testMethod' }, 'playerOrigin'));
});

test('postMessage called correctly with a method and single param', (t) => {
    const postMessageSpy = sinon.spy();
    const player = {
        element: {
            contentWindow: {
                postMessage: postMessageSpy
            }
        },
        origin: 'playerOrigin'
    };

    postMessage(player, 'testMethodWithParams', 'testParam');

    t.true(postMessageSpy.called);
    t.true(postMessageSpy.calledWith({ method: 'testMethodWithParams', value: 'testParam' }, 'playerOrigin'));
});

test('postMessage called correctly with a method and params object', (t) => {
    const postMessageSpy = sinon.spy();
    const player = {
        element: {
            contentWindow: {
                postMessage: postMessageSpy
            }
        },
        origin: 'playerOrigin'
    };

    postMessage(player, 'testMethodWithParamObject', { language: 'en', kind: 'captions' });

    t.true(postMessageSpy.called);
    t.true(postMessageSpy.calledWith({
        method: 'testMethodWithParamObject',
        value: {
            language: 'en',
            kind: 'captions'
        }
    }, 'playerOrigin'));
});

test.todo('postMessage stringifies the message in IE 9');

test('processData calls the proper callbacks for an event', (t) => {
    const player = { element: {} };
    const callbacks = [sinon.spy(), sinon.spy()];

    callbacks.forEach((callback) => {
        storeCallback(player, 'event:play', callback);
    });

    processData(player, { event: 'play', data: { seconds: 0 } });

    callbacks.forEach((callback) => {
        t.true(callback.called);
        t.true(callback.calledWith({ seconds: 0 }));
    });
});

test('processData resolves a method promise with the proper data', (t) => {
    const player = { element: {} };
    const callback = {};
    const methodPromise = new Promise((resolve, reject) => {
        callback.resolve = resolve;
        callback.reject = reject;
    });

    storeCallback(player, 'getColor', callback);

    processData(player, { method: 'getColor', value: '00adef' });

    t.true(getCallbacks(player, 'getColor').length === 0);
    // eslint-disable-next-line promise/always-return
    return methodPromise.then((value) => {
        t.true(value === '00adef');
    });
});

test('processData rejects a method promise on an error event', (t) => {
    const player = { element: {} };
    const callback = {};
    const methodPromise = new Promise((resolve, reject) => {
        callback.resolve = resolve;
        callback.reject = reject;
    });

    storeCallback(player, 'getColor', callback);

    processData(player, {
        event: 'error',
        data: {
            method: 'getColor',
            name: 'TypeError',
            message: 'The color should be 3- or 6-digit hex value.'
        }
    });

    t.true(getCallbacks(player, 'getColor').length === 0);
    t.throws(methodPromise, (error) => {
        return error.name === 'TypeError' && error.message === 'The color should be 3- or 6-digit hex value.';
    });
});
