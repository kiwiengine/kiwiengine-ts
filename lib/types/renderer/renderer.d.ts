import { GameNode } from '../node/core/game-node';
export type RendererOptions = {
    layers?: {
        name: string;
        drawOrder: number;
    }[];
};
export declare class Renderer {
    #private;
    container: HTMLElement;
    _isContainerSizeDirty: boolean;
    canvasLeft: number;
    canvasTop: number;
    viewportScale: number;
    centerX: number;
    centerY: number;
    constructor(container: HTMLElement, options?: RendererOptions);
    _addToLayer(node: GameNode, layerName: string): void;
}
//# sourceMappingURL=renderer.d.ts.map