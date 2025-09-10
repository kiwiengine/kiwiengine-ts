import { EventMap } from '@webtaku/event-emitter';
import { Container as PixiContainer } from 'pixi.js';
import { Renderer } from '../../renderer/renderer';
import { DirtyNumber } from './dirty-number';
import { GameNode } from './game-node';
import { WorldTransform } from './transform';
export declare function isRenderableNode(v: unknown): v is RenderableNode<PixiContainer, EventMap>;
export declare abstract class RenderableNode<C extends PixiContainer, E extends EventMap> extends GameNode<E> {
    #private;
    _pixiContainer: C;
    worldTransform: WorldTransform;
    worldAlpha: DirtyNumber;
    constructor(pixiContainer: C);
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    add(...children: GameNode<EventMap>[]): void;
    remove(): void;
    _updateWorldTransform(): void;
    _resetWorldTransformDirty(): void;
    set tint(t: number);
    get tint(): number;
}
//# sourceMappingURL=renderable.d.ts.map