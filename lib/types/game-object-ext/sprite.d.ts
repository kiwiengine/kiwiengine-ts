import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../game-object/game-object';
type SpriteOptions = {
    src?: string;
} & GameObjectOptions;
declare class SpriteObject<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    constructor(opts?: SpriteOptions);
    get src(): string | undefined;
    set src(src: string | undefined);
    remove(): void;
}
export { SpriteObject };
//# sourceMappingURL=sprite.d.ts.map