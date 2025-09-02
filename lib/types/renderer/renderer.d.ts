import { EventMap } from '@webtaku/event-emitter';
import { ColorSource, Container as PixiContainer } from 'pixi.js';
import { RenderableNode } from '../node/core/renderable';
import { Camera } from './camera';
import { FpsDisplay } from './fps-display';
export type RendererOptions = {
    logicalWidth?: number;
    logicalHeight?: number;
    backgroundColor?: ColorSource;
    layers?: {
        name: string;
        drawOrder: number;
    }[];
};
export declare class Renderer extends RenderableNode<PixiContainer, EventMap> {
    #private;
    container: HTMLElement;
    camera: Camera;
    fpsDisplay?: FpsDisplay;
    _isSizeDirty: boolean;
    canvasWidth: number;
    canvasHeight: number;
    canvasLeft: number;
    canvasTop: number;
    viewportScale: number;
    centerX: number;
    centerY: number;
    constructor(container: HTMLElement, options?: RendererOptions);
    private init;
    _addToLayer(node: RenderableNode<PixiContainer, EventMap>, layerName: string): void;
    remove(): void;
}
//# sourceMappingURL=renderer.d.ts.map