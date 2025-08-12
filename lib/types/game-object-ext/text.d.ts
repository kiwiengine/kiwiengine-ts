import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../game-object/game-object';
type TextObjectOptions = {
    text: string;
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: number;
    color?: string;
} & GameObjectOptions;
declare class TextObject<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    constructor(opts?: TextObjectOptions);
    get text(): string | undefined;
    set text(text: string | undefined);
    get textAlign(): "left" | "center" | "right" | undefined;
    set textAlign(textAlign: 'left' | 'center' | 'right' | undefined);
    get fontSize(): number | undefined;
    set fontSize(fontSize: number | undefined);
    get color(): string | undefined;
    set color(color: string | undefined);
    get anchorX(): number;
    set anchorX(value: number);
    get anchorY(): number;
    set anchorY(value: number);
}
export { TextObject };
//# sourceMappingURL=text.d.ts.map