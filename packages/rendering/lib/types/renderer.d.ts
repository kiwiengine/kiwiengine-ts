import { Container, ICanvas } from 'pixi.js';
export type CreateRendererParameters = {
    canvas: ICanvas;
};
export type Renderer = {
    root: Container;
    render: () => void;
};
export declare function createRenderer(parameters: CreateRendererParameters): Promise<Renderer>;
export declare function createWebWorkerRenderer(parameters: CreateRendererParameters): Promise<Renderer>;
//# sourceMappingURL=renderer.d.ts.map