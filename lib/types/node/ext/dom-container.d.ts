import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../core/game-object';
import { Renderer } from '../../renderer';
type DomContainerNodeOptions = {
    el: HTMLElement;
} & GameObjectOptions;
export declare class DomContainerNode extends GameObject<EventMap> {
    #private;
    constructor(opts: DomContainerNodeOptions);
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    protected update(deltaTime: number): void;
}
export {};
//# sourceMappingURL=dom-container.d.ts.map