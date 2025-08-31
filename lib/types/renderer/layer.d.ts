import { Container } from 'pixi.js';
import { GameNode } from '../node/core/game-node';
import { HasPixiContainer } from '../node/core/has-pixi-container';
export declare class Layer extends GameNode implements HasPixiContainer {
    pixiContainer: Container<import("pixi.js").ContainerChild>;
    constructor(drawOrder: number);
    add(...children: GameNode[]): void;
    remove(): void;
}
//# sourceMappingURL=layer.d.ts.map