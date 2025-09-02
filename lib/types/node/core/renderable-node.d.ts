import { EventMap } from '@webtaku/event-emitter';
import { Container as PixiContainer } from 'pixi.js';
import { Renderer } from '../../renderer/renderer';
import { DirtyNumber } from './dirty-number';
import { GameNode } from './game-node';
import { WorldTransform } from './transform';
export declare function isRenderableNode(n: unknown): n is {
    renderer?: Renderer;
    _pixiContainer: PixiContainer;
    worldTransform: WorldTransform;
    worldAlpha: DirtyNumber;
    _resetTransformDirty: () => void;
};
export declare abstract class RenderableNode<E extends EventMap = EventMap> extends GameNode<E> {
    #private;
    _pixiContainer: PixiContainer<import("pixi.js").ContainerChild>;
    worldTransform: WorldTransform;
    constructor();
    add(...children: GameNode<EventMap>[]): void;
    remove(): void;
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    _resetTransformDirty(): void;
}
//# sourceMappingURL=renderable-node.d.ts.map