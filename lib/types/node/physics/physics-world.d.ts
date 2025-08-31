import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { GameNode } from '../core/game-node';
import { HasPixiContainer } from '../core/has-pixi-container';
export declare class PhysicsWorld<E extends EventMap> extends GameNode<E> implements HasPixiContainer {
    pixiContainer: Container<import("pixi.js").ContainerChild>;
    add(...children: GameNode[]): void;
    remove(): void;
}
//# sourceMappingURL=physics-world.d.ts.map