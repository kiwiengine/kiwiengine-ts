import { EventMap } from '@webtaku/event-emitter';
import { Container as PixiContainer } from 'pixi.js';
import { Renderer } from '../../renderer/renderer';
import { RenderableNode } from './renderable';
import { LocalTransform } from './transform';
export type TransformableNodeOptions = {
    x?: number;
    y?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    pivotX?: number;
    pivotY?: number;
    rotation?: number;
    drawOrder?: number;
    alpha?: number;
    layer?: string;
    useYSort?: boolean;
};
export declare abstract class TransformableNode<C extends PixiContainer, E extends EventMap> extends RenderableNode<C, E> {
    #private;
    protected localTransform: LocalTransform;
    alpha: number;
    constructor(pixiContainer: C, options: TransformableNodeOptions);
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    _updateWorldTransform(): void;
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set scale(v: number);
    get scale(): number;
    set scaleX(v: number);
    get scaleX(): number;
    set scaleY(v: number);
    get scaleY(): number;
    set pivotX(v: number);
    get pivotX(): number;
    set pivotY(v: number);
    get pivotY(): number;
    set rotation(v: number);
    get rotation(): number;
    set drawOrder(v: number);
    get drawOrder(): number;
}
//# sourceMappingURL=transformable.d.ts.map