import { EventEmitter, EventMap } from '@webtaku/event-emitter';
import { Renderer } from '../../renderer/renderer';
export declare abstract class GameNode<E extends EventMap = EventMap> extends EventEmitter<E & {
    update: (dt: number) => void;
}> {
    #private;
    protected children: GameNode[];
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    protected set parent(parent: GameNode | undefined);
    protected get parent(): GameNode | undefined;
    add(...children: GameNode[]): void;
    remove(): void;
    protected update(dt: number): void;
}
//# sourceMappingURL=game-node.d.ts.map