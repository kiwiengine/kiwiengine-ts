import { GameObject } from './game-object';
type BaseCollider = {
    x?: number;
    y?: number;
};
type RectangleCollider = BaseCollider & {
    type: 'rect';
    width: number;
    height: number;
};
type CircleCollider = BaseCollider & {
    type: 'circle';
    radius: number;
};
type VerticesCollider = BaseCollider & {
    type: 'vert';
    vertices: {
        x: number;
        y: number;
    }[];
};
export type Collider = RectangleCollider | CircleCollider | VerticesCollider;
export declare class GameObjectPhysics {
    #private;
    constructor(go: GameObject);
    applyChanges(): void;
    destroy(): void;
    get collider(): Collider | undefined;
    set collider(value: Collider | undefined);
    get isStatic(): boolean;
    set isStatic(value: boolean);
    get isSensor(): boolean;
    set isSensor(value: boolean);
    get velocityX(): number;
    set velocityX(value: number);
    get velocityY(): number;
    set velocityY(value: number);
    get fixedRotation(): boolean;
    set fixedRotation(value: boolean);
}
export {};
//# sourceMappingURL=game-object-physics.d.ts.map