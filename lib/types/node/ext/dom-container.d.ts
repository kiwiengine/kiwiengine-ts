import { Renderer } from '../../renderer/renderer';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type DomContainerNodeOptions = {} & GameObjectOptions;
export declare class DomContainerNode extends GameObject {
    #private;
    constructor(el: HTMLElement, options?: DomContainerNodeOptions);
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    protected update(dt: number): void;
}
//# sourceMappingURL=dom-container.d.ts.map