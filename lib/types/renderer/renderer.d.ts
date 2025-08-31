import { GameNode } from '../node/core/game-node';
export type RendererOptions = {
    layers?: {
        name: string;
        drawOrder: number;
    }[];
};
export declare class Renderer {
    #private;
    target: HTMLElement;
    constructor(target: HTMLElement, options?: RendererOptions);
    _addToLayer(node: GameNode, layerName: string): void;
}
//# sourceMappingURL=renderer.d.ts.map