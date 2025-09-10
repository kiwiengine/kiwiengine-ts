import { EventMap } from '@webtaku/event-emitter';
import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { TransformableNode, TransformableNodeOptions } from '../core/transformable';
export type CircleNodeOptions = {
    radius: number;
    fill?: FillInput;
    stroke?: StrokeInput;
} & TransformableNodeOptions;
export declare class CircleNode extends TransformableNode<Graphics, EventMap> {
    #private;
    constructor(options: CircleNodeOptions);
    set radius(v: number);
    get radius(): number;
    set fill(v: FillInput | undefined);
    get fill(): FillInput | undefined;
    set stroke(v: StrokeInput | undefined);
    get stroke(): StrokeInput | undefined;
}
//# sourceMappingURL=circle.d.ts.map