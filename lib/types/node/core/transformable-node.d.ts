import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from './game-node';
import { GlobalTransform, LocalTransform } from './transform';
export declare abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
    protected localTransform: LocalTransform;
    protected globalTransform: GlobalTransform;
}
//# sourceMappingURL=transformable-node.d.ts.map