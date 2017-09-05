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

test('processData resolves a method promise with the proper data', async (t) => {
    const player = { element: {} };
    const callback = {};
    const methodPromise = new Promise((resolve, reject) => {
        callback.resolve = resolve;
        callback.reject = reject;
    });

    storeCallback(player, 'getColor', callback);

    processData(player, { method: 'getColor', value: '00adef' });

    t.true(getCallbacks(player, 'getColor').length === 0);

    const value = await methodPromise;
    t.true(value === '00adef');
});

test('processData resolves multiple of the same method calls with the proper data', async (t) => {
    const player = { element: {} };

    const callbackOne = {};
    const methodPromiseOne = new Promise((resolve, reject) => {
        callbackOne.resolve = resolve;
        callbackOne.reject = reject;
    });

    const callbackTwo = {};
    const methodPromiseTwo = new Promise((resolve, reject) => {
        callbackTwo.resolve = resolve;
        callbackTwo.reject = reject;
    });

    const callbackThree = {};
    const methodPromiseThree = new Promise((resolve, reject) => {
        callbackThree.resolve = resolve;
        callbackThree.reject = reject;
    });

    storeCallback(player, 'addCuePoint', callbackOne);
    storeCallback(player, 'addCuePoint', callbackTwo);
    processData(player, { method: 'addCuePoint', value: 'bf6a88a0-87ac-4196-b249-a66fde4339f2' });
    storeCallback(player, 'addCuePoint', callbackThree);
    processData(player, { method: 'addCuePoint', value: 'a6f3de01-f4cb-4956-a639-221e640ed458' });
    processData(player, { method: 'addCuePoint', value: 'b9a2834a-6461-4785-8301-7e6501c3cf4c' });

    const [idOne, idTwo, idThree] = await Promise.all([methodPromiseOne, methodPromiseTwo, methodPromiseThree]);
    t.true(idOne === 'bf6a88a0-87ac-4196-b249-a66fde4339f2');
    t.true(idTwo === 'a6f3de01-f4cb-4956-a639-221e640ed458');
    t.true(idThree === 'b9a2834a-6461-4785-8301-7e6501c3cf4c');
});

test('processData rejects a method promise on an error event', async (t) => {
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
    await t.throws(methodPromise, (error) => {
        return error.name === 'TypeError' && error.message === 'The color should be 3- or 6-digit hex value.';
    });
});
