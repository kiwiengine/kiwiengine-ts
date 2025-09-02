import { EventMap } from '@webtaku/event-emitter';
import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { DisplayNode, DisplayNodeOptions } from '../core/display-node';
export type CircleNodeOptions = {
    radius: number;
    fill?: FillInput;
    stroke?: StrokeInput;
} & DisplayNodeOptions;
export declare class CircleNode extends DisplayNode<Graphics, EventMap> {
    #private;
    constructor(options: CircleNodeOptions);
    get radius(): number;
    set radius(v: number);
    get fill(): FillInput | undefined;
    set fill(v: FillInput | undefined);
    get stroke(): StrokeInput | undefined;
    set stroke(v: StrokeInput | undefined);
}
//# sourceMappingURL=circle.d.ts.map