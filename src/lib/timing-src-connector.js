import { subscribe } from './functions';

/** @typedef {import('./timing-src-connector.types').PlayerControls} PlayerControls */
/** @typedef {import('./timing-object.types').TimingObject} TimingObject */
/** @typedef {import('./timing-src-connector.types').TimingSrcConnectorOptions} TimingSrcConnectorOptions */
/** @typedef {(msg: string) => any} Logger */
/** @typedef {import('timing-object.types').TConnectionState} TConnectionState */

/**
 * @type {TimingSrcConnectorOptions}
 *
 * For details on these properties and their effects, see the typescript definition referenced above.
 */
const defaultOptions = {
    role: 'viewer',
    autoPlayMuted: true,
    allowedDrift: 0.3,
    maxAllowedDrift: 1,
    minCheckInterval: 0.1,
    maxRateAdjustment: 0.2,
    maxTimeToCatchUp: 1
};


/**
 * There's a proposed W3C spec for the Timing Object which would introduce a new set of APIs that would simplify time-synchronization tasks for browser applications.
 *
 * Proposed spec: https://webtiming.github.io/timingobject/
 * V3 Spec: https://timingsrc.readthedocs.io/en/latest/
 * Demuxed talk: https://www.youtube.com/watch?v=cZSjDaGDmX8
 *
 * This class makes it easy to connect Vimeo.Player to a provided TimingObject via Vimeo.Player.setTimingSrc(myTimingObject, options) and the synchronization will be handled automatically.
 *
 * There are 5 general responsibilities in TimingSrcConnector:
 *
 * 1. `updatePlayer()` which sets the player's currentTime, playbackRate and pause/play state based on current state of the TimingObject.
 * 2. `updateTimingObject()` which sets the TimingObject's position and velocity from the player's state.
 * 3. `playerUpdater` which listens for change events on the TimingObject and will respond by calling updatePlayer.
 * 4. `timingObjectUpdater` which listens to the player events of seeked, play and pause and will respond by calling `updateTimingObject()`.
 * 5. `maintainPlaybackPosition` this is code that constantly monitors the player to make sure it's always in sync with the TimingObject. This is needed because videos will generally not play with precise time accuracy and there will be some drift which becomes more noticeable over longer periods (as noted in the timing-object spec). More details on this method below.
 */
export class TimingSrcConnector extends EventTarget {
    logger;

    /**
     * @param {PlayerControls} player
     * @param {TimingObject} timingObject
     * @param {TimingSrcConnectorOptions} options
     * @param {Logger} logger
     */
    constructor(player, timingObject, options = {}, logger) {
        super();
        this.logger = logger;
        this.init(timingObject, player, { ...defaultOptions, ...options });
    }

    disconnect() {
        this.dispatchEvent(new Event('disconnect'));
    }


    /**
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {Promise<void>}
     */
    async init(timingObject, player, options) {
        await this.waitForTOReadyState(timingObject, 'open');

        if (options.role === 'viewer') {
            await this.updatePlayer(timingObject, player, options);
            const playerUpdater = subscribe(timingObject, 'change', () => this.updatePlayer(timingObject, player, options));
            const positionSync = this.maintainPlaybackPosition(timingObject, player, options);
            this.addEventListener('disconnect', () => {
                positionSync.cancel();
                playerUpdater.cancel();
            });
        }
        else {
            await this.updateTimingObject(timingObject, player);
            const timingObjectUpdater = subscribe(player, ['seeked', 'play', 'pause', 'ratechange'], () => this.updateTimingObject(timingObject, player), 'on', 'off');
            this.addEventListener('disconnect', () => timingObjectUpdater.cancel());
        }
    }

    /**
     * Sets the TimingObject's state to reflect that of the player
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @return {Promise<void>}
     */
    async updateTimingObject(timingObject, player) {
        timingObject.update({
            position: await player.getCurrentTime(),
            velocity: await player.getPaused() ? 0 : await player.getPlaybackRate()
        });
    }


    /**
     * Sets the player's timing state to reflect that of the TimingObject
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {Promise<void>}
     */
    async updatePlayer(timingObject, player, options) {
        const { position, velocity } = timingObject.query();
        if (typeof position === 'number') {
            player.setCurrentTime(position);
        }
        if (typeof velocity === 'number') {
            if (velocity === 0) {
                if ((await player.getPaused()) === false) {
                    player.pause();
                }
            }
            else if (velocity > 0) {
                if ((await player.getPaused()) === true) {
                    await player.play()
                        .catch(async(err) => {
                            if (err.name === 'NotAllowedError' && options.autoPlayMuted) {
                                await player.setMuted(true);
                                await player.play().catch((err2) => console.error('Couldn\'t play the video from TimingSrcConnector. Error:', err2));
                            }
                        });
                    this.updatePlayer(timingObject, player, options);
                }
                if ((await player.getPlaybackRate()) !== velocity) {
                    player.setPlaybackRate(velocity);
                }
            }
        }
    }

    /**
     * Since video players do not play with 100% time precision, we need to closely monitor
     * our player to be sure it remains in sync with the TimingObject.
     *
     * If out of sync, we use the current conditions and the options provided to determine
     * whether to re-sync via setting currentTime or adjusting the playbackRate
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {{cancel: (function(): void)}}
     */
    maintainPlaybackPosition(timingObject, player, options) {
        const { allowedDrift, maxAllowedDrift, minCheckInterval, maxRateAdjustment, maxTimeToCatchUp } = options;
        const syncInterval = Math.min(maxTimeToCatchUp, Math.max(minCheckInterval, maxAllowedDrift)) * 1000;

        const check = async() => {
            if (timingObject.query().velocity === 0 || await player.getPaused() === true) {
                return;
            }
            const diff = timingObject.query().position - (await player.getCurrentTime());
            const diffAbs = Math.abs(diff);
            this.log(`Drift: ${diff}`);
            if (diffAbs > maxAllowedDrift) {
                await this.adjustSpeed(player, 0);
                player.setCurrentTime(timingObject.query().position);
                this.log('Resync by currentTime');
            }
            else if (diffAbs > allowedDrift) {
                const min = diffAbs / maxTimeToCatchUp;
                const max = maxRateAdjustment;
                const adjustment = min < max ? (max - min) / 2 : max;
                await this.adjustSpeed(player, adjustment * Math.sign(diff));
                this.log('Resync by playbackRate');
            }
        };
        const interval = setInterval(() => check(), syncInterval);
        return { cancel: () => clearInterval(interval) };
    }

    /**
     * @param {string} msg
     */
    log(msg) {
        this.logger?.(`TimingSrcConnector: ${msg}`);
    }

    speedAdjustment = 0;

    /**
     * @param {PlayerControls} player
     * @param {number} newAdjustment
     * @return {Promise<void>}
     */
    adjustSpeed = async(player, newAdjustment) => {
        if (this.speedAdjustment === newAdjustment) {
            return;
        }
        const newPlaybackRate = (await player.getPlaybackRate()) - this.speedAdjustment + newAdjustment;
        this.log(`New playbackRate:  ${newPlaybackRate}`);
        await player.setPlaybackRate(newPlaybackRate);
        this.speedAdjustment = newAdjustment;
    };

    /**
     * @param {TimingObject} timingObject
     * @param {TConnectionState} state
     * @return {Promise<void>}
     */
    waitForTOReadyState(timingObject, state) {
        return new Promise((resolve) => {
            const check = () => {
                if (timingObject.readyState === state) {
                    resolve();
                }
                else {
                    timingObject.addEventListener('readystatechange', check, { once: true });
                }
            };
            check();
        });
    }
}
