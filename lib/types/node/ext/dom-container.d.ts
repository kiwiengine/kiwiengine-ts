import { EventMap } from '@webtaku/event-emitter';
import { Renderer } from '../../renderer/renderer';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type DomContainerNodeOptions = {} & GameObjectOptions;
export declare class DomContainerNode extends GameObject<EventMap> {
    #private;
    constructor(x: number, y: number, el: HTMLElement, options?: DomContainerNodeOptions);
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    protected update(deltaTime: number): void;
}
//# sourceMappingURL=dom-container.d.ts.map