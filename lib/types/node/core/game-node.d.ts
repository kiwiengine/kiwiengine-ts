import { EventEmitter, EventMap } from '@webtaku/event-emitter';
import { Renderer } from '../../renderer/renderer';
export declare abstract class GameNode<E extends EventMap> extends EventEmitter<E> {
    #private;
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    add(...children: GameNode<EventMap>[]): void;
    remove(): void;
    protected update(deltaTime: number): void;
}
//# sourceMappingURL=game-node.d.ts.map