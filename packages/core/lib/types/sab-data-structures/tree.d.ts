export declare class SABTree {
    #private;
    constructor(sab: SharedArrayBuffer, valueCount: number, capacity: number);
    static bytesRequired(valueCount: number, capacity: number): number;
    remove(i: number): void;
    insert(p: number, c: number): void;
    insertAt(p: number, c: number, index: number): void;
    setValue(i: number, j: number, v: number): void;
    getValue(i: number, j: number): number;
}
//# sourceMappingURL=tree.d.ts.map