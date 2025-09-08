import { EventMap } from '@webtaku/event-emitter';
import { Atlas } from '../types/atlas';
import { DomGameObject, DomGameObjectOptions } from './dom-game-object';
export type DomAnimatedSpriteNodeOptions = {
    src: string;
    atlas: Atlas;
    animation: string;
    fps: number;
    loop?: boolean;
} & DomGameObjectOptions;
export declare class DomAnimatedSpriteNode<E extends EventMap = EventMap> extends DomGameObject<E & {
    animationend: (animation: string) => void;
}> {
    #private;
    constructor(options: DomAnimatedSpriteNodeOptions);
    render(dt: number): void;
    set src(src: string);
    get src(): string;
    set atlas(atlas: Atlas);
    get atlas(): Atlas;
    set animation(animation: string);
    get animation(): string;
    set fps(fps: number);
    get fps(): number;
    set loop(loop: boolean);
    get loop(): boolean;
    remove(): void;
}
//# sourceMappingURL=dom-animated-sprite.d.ts.map