export interface PlayerControls {
    getCurrentTime: () => Promise<number>;
    getPlaybackRate: () => Promise<number>;
    setCurrentTime: (t: number) => any;
    setPlaybackRate: (t: number) => any;
    play: () => Promise<any>
    pause: () => Promise<any>
    getPaused: () => Promise<boolean>;
    getMuted: () => Promise<boolean>;
    setMuted: (m: boolean) => any;
}

export interface TimingSrcConnectorOptions {
    /**
     * The role of the player in relation to the TimingObject.
     * With "viewer" the TimingObject is the source of truth and the video does not update the TimingObject.
     * With "controller" the video is the source of truth and updates the TimingObject but does not get updated from the TimingObject.
     */
    role: 'viewer' | 'controller';
    /**
     * Whether the video should attempt to play muted if initial playback attempt fails.
     * This might help if the failure was related to autoplay not being allowed when not muted.
     */
    autoPlayMuted: boolean;
    /**
     * The amount the video can get out of sync from the TimingObject before the connector re-syncs.
     */
    allowedDrift: number;
    /**
     * The maximum amount allowed for the video to get out of sync from the Timing Object.
     * This affects both the frequency at which the connector runs a sync check and also the strategy it uses to resync.
     * If the connector detects that this limit has been surpassed it'll immediately reset the video's currentTime.
     */
    maxAllowedDrift: number;
    /**
     * The smallest time interval (in seconds) the connector can check sync.
     * The smaller, the more frame-accurate the sync will be but will also incur a performance penalty.
     */
    minCheckInterval: number;
    /**
     * The maximum amount we allow the connector to change the video's playbackRate in order to resync with
     * the Timing Object. 0.1 would mean 10%. The higher the number the less likely we will need to resync using
     * `currentTime` (which creates an audible click) but the penalty would be distorted content.
     */
    maxRateAdjustment: number;
    /**
     * The maximum amount of time we want it to take for re-syncing the video with the TimingObject.
     * This affects the frequency at which the connector runs a sync check and also the strategy it uses to resync as well as the speed
     * at which to set the playbackRate if that's the strategy used to resync.
     */
    maxTimeToCatchUp: number;
}
