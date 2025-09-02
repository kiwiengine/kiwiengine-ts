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
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
    get fill(): FillInput | undefined;
    set fill(v: FillInput | undefined);
    get stroke(): StrokeInput | undefined;
    set stroke(v: StrokeInput | undefined);
}
//# sourceMappingURL=rectangle.d.ts.map