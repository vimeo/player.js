import test from "ava";
import {TimingSrcConnector} from "../src/lib/timing-src-connector";

test('updates player from timing object', async t => {
    const timingObject = getMockTimingObject();
    const player = getMockPlayer();
    new TimingSrcConnector(player, timingObject)
    timingObject.updatedReadyState('open');

    timingObject.update({position: 10, velocity: 1});
    await flushTasks();
    t.is(await player.getCurrentTime(), 10);
    t.is(await player.getPaused(), false);

    timingObject.update({velocity: 0});
    await flushTasks();
    t.is(await player.getPaused(), true);
})

test('updates timing object from player when role = "controller"', async t => {
    const timingObject = getMockTimingObject();
    const player = getMockPlayer();
    new TimingSrcConnector(player, timingObject, {role: 'controller'})
    timingObject.updatedReadyState('open');

    player.setCurrentTime(20);
    player.setPlaybackRate(2);
    player.play();
    await flushTasks();
    t.is(timingObject.query().position, 20)
    t.is(timingObject.query().velocity, 2)

    player.setPlaybackRate(1);
    await flushTasks();
    t.is(timingObject.query().velocity, 1)
})

function flushTasks () {
    return new Promise(setTimeout)
}

function getMockPlayer() {
    const eventTarget = new EventTarget();
    eventTarget['on'] = eventTarget.addEventListener;
    eventTarget['off'] = eventTarget.removeEventListener;

    return Object.assign(eventTarget, {
        duration: 0,
        currentTime: 0,
        paused: true,
        playbackRate: 1,
        muted: false,
        play:  async function () {
            this.paused = false;
        },
        pause:  async function () {
            this.paused = true;
        },
        getPaused:  async function () {
            return this.paused;
        },
        setCurrentTime: async function (time) {
            this.currentTime = time;
        },
        getCurrentTime: async function () {
            return this.currentTime;
        },
        setPlaybackRate: async function (rate) {
            this.playbackRate = rate;
            this.dispatchEvent(new Event('ratechange'))
        },
        getPlaybackRate: async function () {
            return this.playbackRate;
        },
        setMuted: async function (muted) {
            this.muted = muted;
        },
        getMuted: async function () {
            return this.muted;
        },
    })
}

function getMockTimingObject() {
    return Object.assign(new EventTarget(), {
        readyState: 'closed',
        vector: {
            position: 0,
            velocity: 0,
        },
        updatedReadyState: function (state) {
            this.readyState = state;
            this.dispatchEvent(new Event('readystatechange'));
        },
        update: function (vector)  {
            Object.assign(this.vector, vector);
            this.dispatchEvent(new Event('change'));
        },
        query: function () {
            return this.vector;
        },

    })
}
