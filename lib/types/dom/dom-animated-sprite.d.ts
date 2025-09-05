import { EventMap } from '@webtaku/event-emitter';
import { SpritesheetData } from 'pixi.js';
import { DomGameObject, DomGameObjectOptions } from './dom-game-object';
export type DomAnimatedSpriteNodeOptions = {
    src: string;
    atlas: SpritesheetData;
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
    set atlas(atlas: SpritesheetData);
    get atlas(): SpritesheetData;
    set animation(animation: string);
    get animation(): string;
    set fps(fps: number);
    get fps(): number;
    set loop(loop: boolean);
    get loop(): boolean;
    remove(): void;
}
//# sourceMappingURL=dom-animated-sprite.d.ts.map