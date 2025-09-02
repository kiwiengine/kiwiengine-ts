import { EventMap } from '@webtaku/event-emitter';
import { Collider } from '../../collision/colliders';
import { GameNode } from '../core/game-node';
import { PixiContainerNode } from '../core/pixi-container-node';
export type PhysicsObjectOptions = {
    collider: Collider;
    x?: number;
    y?: number;
    rotation?: number;
};
export declare class PhysicsObject<E extends EventMap = EventMap> extends PixiContainerNode<E> {
    #private;
    constructor(options: PhysicsObjectOptions);
    protected set parent(parent: GameNode<EventMap> | undefined);
    protected get parent(): GameNode<EventMap> | undefined;
    protected update(dt: number): void;
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set rotation(v: number);
    get rotation(): number;
}
//# sourceMappingURL=physics-object.d.ts.map