import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { GameNode } from './game-node';
import { HasPixiContainer } from './has-pixi-container';
import { TransformableNode } from './transformable-node';
export declare abstract class DisplayNode<E extends EventMap> extends TransformableNode<E> implements HasPixiContainer {
    pixiContainer: Container;
    constructor(pixiContainer: Container);
    add(...children: (GameNode<EventMap> & HasPixiContainer)[]): void;
    remove(): void;
}
//# sourceMappingURL=display-node.d.ts.map