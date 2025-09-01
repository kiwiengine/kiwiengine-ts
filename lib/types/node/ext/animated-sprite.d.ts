import { SpritesheetData } from 'pixi.js';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type AnimatedSpriteNodeOptions = {
    src: string;
    atlas: SpritesheetData;
    animation: string;
    fps: number;
    loop?: boolean;
} & GameObjectOptions;
export declare class AnimatedSpriteNode extends GameObject {
    #private;
    constructor(options: AnimatedSpriteNodeOptions);
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
//# sourceMappingURL=animated-sprite.d.ts.map