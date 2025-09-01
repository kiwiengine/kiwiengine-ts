import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from '../core/game-node';
import { GameObject } from '../core/game-object';
export declare class PhysicsObject<E extends EventMap> extends GameObject<E> {
    set parent(parent: GameNode<EventMap> | undefined);
    get parent(): GameNode<EventMap> | undefined;
}
//# sourceMappingURL=physics-object.d.ts.map