import { EventMap } from '@webtaku/event-emitter';
import { SpritesheetData } from 'pixi.js';
import { DomGameObject, DomGameObjectOptions } from './dom-game-object';
type DomAnimatedSpriteOptions = {
    src?: string;
    atlas?: SpritesheetData;
    animation?: string;
    fps?: number;
    loop?: boolean;
} & DomGameObjectOptions;
export declare class DomAnimatedSpriteObject<E extends EventMap = EventMap> extends DomGameObject<E & {
    animationend: (animation: string) => void;
}> {
    #private;
    constructor(opts?: DomAnimatedSpriteOptions);
    protected _afterRender(dt: number): void;
    get src(): string | undefined;
    set src(src: string | undefined);
    get atlas(): SpritesheetData | undefined;
    set atlas(atlas: SpritesheetData | undefined);
    get animation(): string | undefined;
    set animation(animation: string | undefined);
    get fps(): number | undefined;
    set fps(fps: number | undefined);
    get loop(): boolean;
    set loop(loop: boolean);
}
export {};
//# sourceMappingURL=dom-animated-sprite.d.ts.map