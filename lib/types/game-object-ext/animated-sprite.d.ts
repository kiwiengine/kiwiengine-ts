import { EventMap } from '@webtaku/event-emitter';
import { SpritesheetData } from 'pixi.js';
import { GameObject, GameObjectOptions } from '../game-object/game-object';
type AnimatedSpriteOptions = {
    src?: string;
    atlas?: SpritesheetData;
    animation?: string;
    fps?: number;
    loop?: boolean;
} & GameObjectOptions;
declare class AnimatedSpriteObject<E extends EventMap = EventMap> extends GameObject<E & {
    animationend: (animation: string) => void;
}> {
    #private;
    constructor(opts?: AnimatedSpriteOptions);
    get src(): string | undefined;
    set src(src: string | undefined);
    get atlas(): SpritesheetData | undefined;
    set atlas(atlas: SpritesheetData | undefined);
    get animation(): string | undefined;
    set animation(animation: string | undefined);
    get fps(): number | undefined;
    set fps(fps: number | undefined);
    get loop(): boolean | undefined;
    set loop(loop: boolean | undefined);
    remove(): void;
}
export { AnimatedSpriteObject };
//# sourceMappingURL=animated-sprite.d.ts.map