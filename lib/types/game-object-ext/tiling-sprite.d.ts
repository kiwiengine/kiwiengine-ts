import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../game-object/game-object';
import { WorldTransform } from '../game-object/transform';
type TilingSpriteOptions = {
    src?: string;
    scrollSpeedX?: number;
    scrollSpeedY?: number;
} & GameObjectOptions;
declare class TilingSpriteObject<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    scrollSpeedX?: number;
    scrollSpeedY?: number;
    constructor(opts?: TilingSpriteOptions);
    get src(): string | undefined;
    set src(src: string | undefined);
    _engineUpdate(dt: number, pt: WorldTransform): void;
    remove(): void;
}
export { TilingSpriteObject };
//# sourceMappingURL=tiling-sprite.d.ts.map