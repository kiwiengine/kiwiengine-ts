import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from '../core/game-node';
import { PixiContainerNode } from '../core/pixi-container-node';
export declare class PhysicsObject<E extends EventMap> extends PixiContainerNode<E> {
    set parent(parent: GameNode | undefined);
    get parent(): GameNode | undefined;
}
//# sourceMappingURL=physics-object.d.ts.map