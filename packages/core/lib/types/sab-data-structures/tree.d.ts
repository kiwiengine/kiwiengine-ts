export declare class SABTree {
    #private;
    constructor(sab: SharedArrayBuffer, capacity: number, valueCount: number);
    static bytesRequired(capacity: number, valueCount: number): number;
    remove(i: number): void;
    insert(p: number, c: number): void;
    insertAt(p: number, c: number, index: number): void;
    setValue(i: number, j: number, v: number): void;
    getValue(i: number, j: number): number;
    forEach(visitor: (node: number) => void): void;
}
//# sourceMappingURL=tree.d.ts.map