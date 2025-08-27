import { autoDetectRenderer, Container, DOMAdapter, WebWorkerAdapter } from 'pixi.js';
export async function createRenderer(parameters) {
    const root = new Container();
    const pixiRenderer = await autoDetectRenderer({
        canvas: parameters.canvas,
    });
    return {
        root,
        render: () => { pixiRenderer.render(root); }
    };
}
export async function createWebWorkerRenderer(parameters) {
    DOMAdapter.set(WebWorkerAdapter);
    return await createRenderer(parameters);
}
//# sourceMappingURL=renderer.js.map