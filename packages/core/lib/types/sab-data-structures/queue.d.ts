export declare class SABUint32Queue {
    #private;
    constructor(sab: SharedArrayBuffer, capacity: number);
    static bytesRequired(capacity: number): number;
    get byteLength(): number;
    enqueue(value: number): void;
    dequeue(): number;
}
//# sourceMappingURL=queue.d.ts.map