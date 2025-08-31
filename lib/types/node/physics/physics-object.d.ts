import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { GameNode } from '../core/game-node';
import { HasPixiContainer } from '../core/has-pixi-container';
export declare class PhysicsObject extends GameNode<EventMap> implements HasPixiContainer {
    pixiContainer: Container<import("pixi.js").ContainerChild>;
    add(...children: (GameNode<EventMap> & HasPixiContainer)[]): void;
    remove(): void;
}
//# sourceMappingURL=physics-object.d.ts.map