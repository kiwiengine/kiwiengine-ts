import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { Renderer } from '../../renderer/renderer';
import { DirtyNumber } from './dirty-number';
import { GameNode } from './game-node';
import { HasPixiContainer } from './has-pixi-container';
import { TransformableNode } from './transformable-node';
export type DisplayNodeOptions = {
    layer?: string;
    useYSort?: boolean;
};
export declare abstract class DisplayNode<E extends EventMap> extends TransformableNode<E> implements HasPixiContainer {
    #private;
    _pixiContainer: Container;
    alpha: number;
    protected globalAlpha: DirtyNumber;
    constructor(pixiContainer: Container, options: DisplayNodeOptions);
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    add(...children: GameNode[]): void;
    remove(): void;
    protected update(dt: number): void;
}
//# sourceMappingURL=display-node.d.ts.map