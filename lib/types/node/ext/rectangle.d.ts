import { EventMap } from '@webtaku/event-emitter';
import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { TransformableNode, TransformableNodeOptions } from '../core/transformable';
export type RectangleNodeOptions = {
    width: number;
    height: number;
    fill?: FillInput;
    stroke?: StrokeInput;
} & TransformableNodeOptions;
export declare class RectangleNode extends TransformableNode<Graphics, EventMap> {
    #private;
    constructor(options: RectangleNodeOptions);
    set width(v: number);
    get width(): number;
    set height(v: number);
    get height(): number;
    set fill(v: FillInput | undefined);
    get fill(): FillInput | undefined;
    set stroke(v: StrokeInput | undefined);
    get stroke(): StrokeInput | undefined;
}
//# sourceMappingURL=rectangle.d.ts.map