import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from './game-node';
import { DirtyNumber } from './dirty-number';
import { GlobalTransform } from './transform';
export declare abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
    protected globalTransform: GlobalTransform;
    protected globalAlpha: DirtyNumber;
}
//# sourceMappingURL=transformable-node.d.ts.map