import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { GameNode } from '../core/game-node';
import { HasPixiContainer } from '../core/has-pixi-container';
import { DirtyNumber } from './dirty-number';
import { WorldTransform } from './transform';
export declare function isHasPixiContainer(v: unknown): v is HasPixiContainer;
export declare abstract class PixiContainerNode<E extends EventMap = EventMap> extends GameNode<E> implements HasPixiContainer {
    _pixiContainer: Container<import("pixi.js").ContainerChild>;
    worldTransform: WorldTransform;
    protected globalAlpha: DirtyNumber;
    constructor();
    add(...children: GameNode<EventMap>[]): void;
    remove(): void;
    _resetTransformDirty(): void;
}
//# sourceMappingURL=pixi-container-node.d.ts.map