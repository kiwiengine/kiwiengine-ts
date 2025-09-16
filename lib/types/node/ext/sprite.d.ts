import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type SpriteNodeOptions = {
    src: string;
} & GameObjectOptions;
export declare class SpriteNode<E extends EventMap = {}> extends GameObject<E & {
    load: () => void;
}> {
    #private;
    constructor(options: SpriteNodeOptions);
    set src(src: string);
    get src(): string;
    remove(): void;
}
//# sourceMappingURL=sprite.d.ts.map