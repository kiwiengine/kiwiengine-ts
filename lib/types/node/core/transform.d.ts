import { DirtyNumber, DirtyRadian } from './dirty-number';
export declare class LocalTransform {
    #private;
    x: number;
    y: number;
    pivotX: number;
    pivotY: number;
    scaleX: number;
    scaleY: number;
    get cos(): number;
    get sin(): number;
    get rotation(): number;
    set rotation(value: number);
}
export declare class GlobalTransform {
    x: DirtyNumber;
    y: DirtyNumber;
    scaleX: DirtyNumber;
    scaleY: DirtyNumber;
    rotation: DirtyRadian;
    update(parent: GlobalTransform, local: LocalTransform): void;
    get dirty(): boolean;
}
//# sourceMappingURL=transform.d.ts.map