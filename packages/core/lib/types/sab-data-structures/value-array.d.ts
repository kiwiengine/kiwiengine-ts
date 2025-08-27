export declare class SABFloat32ValueArray {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, valueCount: number, capacity: number);
    static bytesRequired(valueCount: number, capacity: number): number;
    get byteLength(): number;
    set(i: number, j: number, v: number): void;
    get(i: number, j: number): number;
}
//# sourceMappingURL=value-array.d.ts.map