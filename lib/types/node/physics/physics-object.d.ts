import { EventMap } from '@webtaku/event-emitter';
import { Container as PixiContainer } from 'pixi.js';
import { Collider } from '../../collision/colliders';
import { GameNode } from '../core/game-node';
import { RenderableNode } from '../core/renderable';
export type PhysicsObjectOptions = {
    collider: Collider;
    x?: number;
    y?: number;
    rotation?: number;
    fixedRotation?: boolean;
    velocityX?: number;
    velocityY?: number;
    isStatic?: boolean;
};
export declare class PhysicsObject<E extends EventMap = EventMap> extends RenderableNode<PixiContainer, E> {
    #private;
    constructor(options: PhysicsObjectOptions);
    protected set parent(parent: GameNode<EventMap> | undefined);
    protected get parent(): GameNode<EventMap> | undefined;
    _updateWorldTransform(): void;
    remove(): void;
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set rotation(v: number);
    get rotation(): number;
    set velocityX(v: number);
    get velocityX(): number;
    set velocityY(v: number);
    get velocityY(): number;
    set isStatic(v: boolean);
    get isStatic(): boolean;
    disableCollisions(): void;
}
//# sourceMappingURL=physics-object.d.ts.map