declare class DirtyNumber {
    #private;
    constructor(v: number);
    get dirty(): boolean;
    get v(): number;
    set v(v: number);
    markClean(): void;
}
export declare class LocalTransform {
    x: DirtyNumber;
    y: DirtyNumber;
    pivotX: DirtyNumber;
    pivotY: DirtyNumber;
    scaleX: DirtyNumber;
    scaleY: DirtyNumber;
    rotation: DirtyNumber;
    alpha: DirtyNumber;
    markClean(): void;
}
export declare class WorldTransform {
    x: DirtyNumber;
    y: DirtyNumber;
    scaleX: DirtyNumber;
    scaleY: DirtyNumber;
    rotation: DirtyNumber;
    alpha: DirtyNumber;
    update(parent: WorldTransform, local: LocalTransform): void;
    markClean(): void;
}
export declare function localOffsetToWorld(world: WorldTransform, ox: number, oy: number): {
    x: number;
    y: number;
};
export declare function worldToLocalWithNewWorld(world: WorldTransform, local: LocalTransform, targetWorldX: number, targetWorldY: number, targetWorldRotation: number): {
    x: number;
    y: number;
    rotation: number;
    newWorldX: number;
    newWorldY: number;
    newWorldRotation: number;
};
export {};
//# sourceMappingURL=transform.d.ts.map