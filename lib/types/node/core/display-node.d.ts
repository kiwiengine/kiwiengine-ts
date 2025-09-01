import { EventMap } from '@webtaku/event-emitter';
import { Container } from 'pixi.js';
import { Renderer } from '../../renderer/renderer';
import { DirtyNumber } from './dirty-number';
import { GameNode } from './game-node';
import { HasPixiContainer } from './has-pixi-container';
import { TransformableNode, TransformableNodeOptions } from './transformable-node';
export type DisplayNodeOptions = {
    alpha?: number;
    layer?: string;
    useYSort?: boolean;
} & TransformableNodeOptions;
export declare abstract class DisplayNode<C extends Container, E extends EventMap> extends TransformableNode<E> implements HasPixiContainer {
    #private;
    _pixiContainer: C;
    alpha: number;
    protected globalAlpha: DirtyNumber;
    constructor(pixiContainer: C, options: DisplayNodeOptions);
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    add(...children: GameNode<EventMap>[]): void;
    remove(): void;
    protected update(dt: number): void;
    _resetTransformDirty(): void;
}
//# sourceMappingURL=display-node.d.ts.map