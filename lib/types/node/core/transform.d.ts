import { DirtyNumber } from './dirty-number';
export declare class LocalTransform {
    x: DirtyNumber;
    y: DirtyNumber;
    pivotX: DirtyNumber;
    pivotY: DirtyNumber;
    scaleX: DirtyNumber;
    scaleY: DirtyNumber;
    rotation: DirtyNumber;
}
export declare class GlobalTransform {
    x: DirtyNumber;
    y: DirtyNumber;
    scaleX: DirtyNumber;
    scaleY: DirtyNumber;
    rotation: DirtyNumber;
    dirty: boolean;
}
//# sourceMappingURL=transform.d.ts.map