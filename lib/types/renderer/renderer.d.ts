import { ColorSource } from 'pixi.js';
import { HasPixiContainer } from '../node/core/has-pixi-container';
import { PixiContainerNode } from '../node/core/pixi-container-node';
import { Camera } from './camera';
import { FpsDisplay } from './fps-display';
import { GlobalTransform } from '../node/core/transform';
import { DirtyNumber } from '../node/core/dirty-number';
export type RendererOptions = {
    logicalWidth?: number;
    logicalHeight?: number;
    backgroundColor?: ColorSource;
    layers?: {
        name: string;
        drawOrder: number;
    }[];
};
export declare class Renderer extends PixiContainerNode {
    #private;
    container: HTMLElement;
    camera: Camera;
    fpsDisplay?: FpsDisplay;
    _isSizeDirty: boolean;
    canvasLeft: number;
    canvasTop: number;
    viewportScale: number;
    centerX: number;
    centerY: number;
    protected globalTransform: GlobalTransform;
    protected globalAlpha: DirtyNumber;
    constructor(container: HTMLElement, options?: RendererOptions);
    private init;
    _addToLayer(node: HasPixiContainer, layerName: string): void;
    remove(): void;
}
//# sourceMappingURL=renderer.d.ts.map