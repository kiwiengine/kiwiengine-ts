import { EventMap } from '@webtaku/event-emitter';
import { FillInput, StrokeInput } from 'pixi.js';
import { GameObject } from '../game-object/game-object';
declare class RectangleObject<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    constructor();
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get fill(): FillInput | undefined;
    set fill(value: FillInput | undefined);
    get stroke(): StrokeInput | undefined;
    set stroke(value: StrokeInput | undefined);
}
export { RectangleObject };
//# sourceMappingURL=rect.d.ts.map