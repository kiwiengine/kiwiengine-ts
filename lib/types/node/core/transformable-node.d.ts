import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from './game-node';
import { GlobalTransform, LocalTransform } from './transform';
export declare function isTransformableNode(v: unknown): v is TransformableNode<EventMap>;
export declare abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
    protected localTransform: LocalTransform;
    protected globalTransform: GlobalTransform;
    protected update(dt: number): void;
    _resetTransformDirty(): void;
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
}
//# sourceMappingURL=transformable-node.d.ts.map