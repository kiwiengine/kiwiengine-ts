import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { GameNode } from '../core/game-node';
import { HasPixiContainer } from '../core/has-pixi-container';
export declare function isHasPixiContainer(v: unknown): v is HasPixiContainer;
export declare abstract class PixiContainerNode<E extends EventMap = EventMap> extends GameNode<E> implements HasPixiContainer {
    _pixiContainer: Container<import("pixi.js").ContainerChild>;
    add(...children: GameNode<EventMap>[]): void;
    remove(): void;
}
//# sourceMappingURL=pixi-container-node.d.ts.map