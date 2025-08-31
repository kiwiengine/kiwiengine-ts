import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { GameNode } from '../node/core/game-node';
import { HasPixiContainer } from '../node/core/has-pixi-container';
export type LayerOptions = {
    drawOrder: number;
};
export declare class Layer extends GameNode<EventMap> implements HasPixiContainer {
    pixiContainer: Container<import("pixi.js").ContainerChild>;
    constructor(options: LayerOptions);
    add(...children: (GameNode<EventMap> & HasPixiContainer)[]): void;
    remove(): void;
}
//# sourceMappingURL=layer.d.ts.map