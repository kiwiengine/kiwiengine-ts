export declare class SABFloat32ValueArray {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number, valueCount: number);
    static bytesRequired(capacity: number, valueCount: number): number;
    get byteLength(): number;
    set(i: number, j: number, v: number): void;
    get(i: number, j: number): number;
}
//# sourceMappingURL=value-array.d.ts.map