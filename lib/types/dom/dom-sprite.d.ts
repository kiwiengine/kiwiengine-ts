import { EventMap } from '@webtaku/event-emitter';
import { DomGameObject, DomGameObjectOptions } from './dom-game-object';
export type DomSpriteNodeOptions = {
    src: string;
} & DomGameObjectOptions;
export declare class DomSpriteNode<E extends EventMap = {}> extends DomGameObject<E> {
    #private;
    constructor(options: DomSpriteNodeOptions);
    set src(src: string);
    get src(): string;
    remove(): void;
}
//# sourceMappingURL=dom-sprite.d.ts.map