import { GameObject, GameObjectOptions } from '../game-object/game-object';
import { WorldPhysics } from "./world-physics";
import { WorldRendering } from "./world-rendering";
export type WorldOptions = {
    width?: number;
    height?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
    gravity?: number;
    layers?: {
        name: string;
        drawOrder: number;
    }[];
} & GameObjectOptions;
export declare class World extends GameObject<{
    resize: (width: number, height: number) => void;
    collisionStart: (a: GameObject, b: GameObject) => void;
}> {
    #private;
    container: HTMLDivElement;
    _worldRendering: WorldRendering;
    _worldPhysics: WorldPhysics;
    _containerSizeDirty: boolean;
    constructor(opts?: WorldOptions);
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
    get backgroundColor(): number;
    set backgroundColor(v: number);
    get backgroundAlpha(): number;
    set backgroundAlpha(v: number);
    get gravity(): number;
    set gravity(v: number);
    get cameraX(): number;
    set cameraX(v: number);
    get cameraY(): number;
    set cameraY(v: number);
    _addToLayer(child: GameObject, layer: string): void;
    get backgroundImage(): string | undefined;
    set backgroundImage(image: string | undefined);
}
//# sourceMappingURL=world.d.ts.map