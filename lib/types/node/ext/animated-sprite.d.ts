import { EventMap } from '@webtaku/event-emitter';
import { Atlas } from '../../types/atlas';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type AnimatedSpriteNodeOptions = {
    src: string;
    atlas: Atlas;
    animation: string;
} & GameObjectOptions;
export declare class AnimatedSpriteNode<E extends EventMap = EventMap> extends GameObject<E & {
    animationend: (animation: string) => void;
}> {
    #private;
    constructor(options: AnimatedSpriteNodeOptions);
    set src(src: string);
    get src(): string;
    set atlas(atlas: Atlas);
    get atlas(): Atlas;
    set animation(animation: string);
    get animation(): string;
    remove(): void;
}
//# sourceMappingURL=animated-sprite.d.ts.map