import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type BitmapTextNodeOptions = {
    fnt: string;
    src: string;
    text: string;
} & GameObjectOptions;
export declare class BitmapTextNode<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    constructor(options: BitmapTextNodeOptions);
    changeFont(fnt: string, src: string): void;
    remove(): void;
}
//# sourceMappingURL=bitmap-text.d.ts.map