export declare class SABTree {
    #private;
    constructor(sab: SharedArrayBuffer, capacity: number, fvalueCount: number, uvalueCount: number, bvalueCount: number);
    static bytesRequired(capacity: number, fvalueCount: number, uvalueCount: number, bvalueCount: number): number;
    remove(i: number): void;
    insert(p: number, c: number): void;
    insertAt(p: number, c: number, index: number): void;
    setFValue(i: number, j: number, v: number): void;
    getFValue(i: number, j: number): number;
    setUValue(i: number, j: number, v: number): void;
    getUValue(i: number, j: number): number;
    setBValue(i: number, j: number, v: boolean): void;
    getBValue(i: number, j: number): boolean;
    forEach(visitor: (node: number) => void): void;
    sortChildren(parent: number, uvalueIndex: number): void;
}
//# sourceMappingURL=tree.d.ts.map