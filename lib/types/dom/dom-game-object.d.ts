import { EventMap } from '@webtaku/event-emitter';
import { DirtyNumber } from '../node/core/dirty-number';
import { GameNode } from '../node/core/game-node';
import { WorldTransform } from '../node/core/transform';
export type DomGameObjectOptions = {
    x?: number;
    y?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    pivotX?: number;
    pivotY?: number;
    rotation?: number;
    alpha?: number;
    useYSort?: boolean;
};
export declare class DomGameObject<E extends EventMap = EventMap> extends GameNode<E> {
    #private;
    protected el: HTMLDivElement;
    worldTransform: WorldTransform;
    alpha: number;
    worldAlpha: DirtyNumber;
    constructor(options?: DomGameObjectOptions);
    render(dt: number): void;
    protected _updateWorldTransform(): void;
    attachTo(target: HTMLElement): this;
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
//# sourceMappingURL=dom-game-object.d.ts.map