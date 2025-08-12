import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../game-object/game-object';
type SpineOptions = {
    atlas?: string;
    skeletonData?: any;
    skel?: string;
    json?: string;
    texture?: string | Record<string, string>;
    skins?: string[];
    animation?: string;
    loop?: boolean;
} & GameObjectOptions;
declare class SpineObject<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    constructor(opts?: SpineOptions);
    get atlas(): string | undefined;
    set atlas(atlas: string | undefined);
    get skeletonData(): any | undefined;
    set skeletonData(skeletonData: any | undefined);
    get skel(): string | undefined;
    set skel(skel: string | undefined);
    get json(): string | undefined;
    set json(json: string | undefined);
    get texture(): string | Record<string, string> | undefined;
    set texture(texture: string | Record<string, string> | undefined);
    get skins(): string[] | undefined;
    set skins(skins: string[] | undefined);
    get animation(): string | undefined;
    set animation(animation: string | undefined);
    get loop(): boolean | undefined;
    set loop(loop: boolean | undefined);
    remove(): void;
}
export { SpineObject };
//# sourceMappingURL=spine.d.ts.map