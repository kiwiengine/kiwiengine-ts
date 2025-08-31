export declare class DirtyNumber {
    #private;
    constructor(initialValue: number);
    get dirty(): boolean;
    get v(): number;
    set v(newValue: number);
    reset(): void;
}
export declare class DirtyRadian extends DirtyNumber {
    #private;
    constructor(initialValue: number);
    get cos(): number;
    get sin(): number;
    set v(newValue: number);
    get v(): number;
}
//# sourceMappingURL=dirty-number.d.ts.map