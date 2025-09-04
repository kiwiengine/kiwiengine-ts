import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type SpineNodeOptions = {
    atlas: string;
    texture: string | Record<string, string>;
    rawSkeletonData?: any;
    skel?: string;
    json?: string;
    skins?: string[];
    animation?: string;
    loop?: boolean;
} & GameObjectOptions;
export declare class SpineNode<E extends EventMap = EventMap> extends GameObject<E & {
    animationend: (animation: string) => void;
}> {
    #private;
    constructor(options: SpineNodeOptions);
    set atlas(atlas: string);
    get atlas(): string;
    set texture(texture: string | Record<string, string>);
    get texture(): string | Record<string, string>;
    set rawSkeletonData(rawSkeletonData: any);
    get rawSkeletonData(): any;
    set skel(skel: string | undefined);
    get skel(): string | undefined;
    set json(json: string | undefined);
    get json(): string | undefined;
    set skins(skins: string[] | undefined);
    get skins(): string[] | undefined;
    set animation(animation: string | undefined);
    get animation(): string | undefined;
    set loop(loop: boolean | undefined);
    get loop(): boolean | undefined;
    remove(): void;
}
//# sourceMappingURL=spine.d.ts.map