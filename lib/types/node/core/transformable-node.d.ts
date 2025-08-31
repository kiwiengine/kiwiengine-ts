import { EventMap } from '@webtaku/event-emitter';
import { DirtyNumber } from './dirty-number';
import { GameNode } from './game-node';
import { GlobalTransform, LocalTransform } from './transform';
export declare abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
    protected localTransform: LocalTransform;
    protected globalTransform: GlobalTransform;
    protected globalAlpha: DirtyNumber;
}
//# sourceMappingURL=transformable-node.d.ts.map