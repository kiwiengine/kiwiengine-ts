import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from "../game-object/game-object";
import { World } from '../world/world';
type DomContainerObjectOptions = {
    el?: HTMLElement;
} & GameObjectOptions;
export declare class DomContainerObject<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    constructor(opts?: DomContainerObjectOptions);
    protected _setWorld(world: World): void;
    get el(): HTMLElement | undefined;
    set el(el: HTMLElement | undefined);
    _afterRender(): void;
}
export {};
//# sourceMappingURL=dom-container.d.ts.map