import { EventEmitter, EventMap } from '@webtaku/event-emitter';
export declare class DomGameObject<E extends EventMap = EventMap> extends EventEmitter<E & {
    update: (dt: number) => void;
}> {
    #private;
    protected _container: HTMLDivElement;
    attachToDom(target: HTMLElement): void;
    add(...children: DomGameObject[]): void;
    remove(): void;
    protected update(dt: number): void;
    protected _afterRender(dt: number): void;
    _engineUpdate(dt: number): void;
    constructor(opts?: DomGameObjectOptions);
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    get pivotX(): number;
    set pivotX(v: number);
    get pivotY(): number;
    set pivotY(v: number);
    get scale(): number;
    set scale(v: number);
    get scaleX(): number;
    set scaleX(v: number);
    get scaleY(): number;
    set scaleY(v: number);
    get rotation(): number;
    set rotation(v: number);
    get alpha(): number;
    set alpha(v: number);
    get drawOrder(): number;
    set drawOrder(v: number);
}
export type DomGameObjectOptions = {
    x?: number;
    y?: number;
    pivotX?: number;
    pivotY?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    alpha?: number;
    drawOrder?: number;
};
//# sourceMappingURL=dom-game-object.d.ts.map