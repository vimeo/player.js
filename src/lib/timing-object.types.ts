export type TConnectionState = 'closed' | 'closing' | 'connecting' | 'open';

export interface TimingStateVector {
    readonly acceleration: number;

    readonly position: number;

    readonly timestamp: number;

    readonly velocity: number;
}

export interface TimingProvider extends EventTarget {
    readonly endPosition: number;

    readonly error: null | Error;

    onadjust: null | (() => any);

    onchange: null | (() => any);

    onreadystatechange: null | (() => any);

    readonly readyState: TConnectionState;

    readonly skew: number;

    readonly startPosition: number;

    readonly vector: TimingStateVector;

    update(newVector: Exclude<TimingStateVector, 'timestamp'>): Promise<void>;
}

export interface TimingObject extends EventTarget {
    readonly endPosition: number;

    onchange: null | (() => this);

    onerror: null | (() => this);

    onreadystatechange: null | (() => this);

    ontimeupdate: null | (() => this);

    readonly readyState: TConnectionState;

    readonly startPosition: number;

    readonly timingProviderSource: null | TimingProvider;

    query(): TimingStateVector;

    update(newVector: Partial<Omit<TimingStateVector, 'timestamp'>>): Promise<void>;
}
