import { EventMap } from '@webtaku/event-emitter';
import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { DisplayNode, DisplayNodeOptions } from '../core/display-node';
export type RectangleNodeOptions = {
    width: number;
    height: number;
    fill?: FillInput;
    stroke?: StrokeInput;
} & DisplayNodeOptions;
export declare class RectangleNode extends DisplayNode<Graphics, EventMap> {
    #private;
    constructor(x: number, y: number, options: RectangleNodeOptions);
}
//# sourceMappingURL=rectangle.d.ts.map