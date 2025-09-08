import { DirtyNumber } from './dirty-number';
export declare class LocalTransform {
    #private;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    pivotX: number;
    pivotY: number;
    get cos(): number;
    get sin(): number;
    get rotation(): number;
    set rotation(v: number);
}
export declare class WorldTransform {
    x: DirtyNumber;
    y: DirtyNumber;
    scaleX: DirtyNumber;
    scaleY: DirtyNumber;
    rotation: DirtyNumber;
    cos: number;
    sin: number;
    update(parent: WorldTransform, local: LocalTransform): void;
    get dirty(): boolean;
    resetDirty(): void;
}
//# sourceMappingURL=transform.d.ts.map