import { ROOT } from '@kiwiengine/core';
import { autoDetectRenderer, Container, DOMAdapter, WebWorkerAdapter } from 'pixi.js';
export class Renderer {
    #canvas;
    #objectStateTree;
    #pixiRenderer;
    #root = new Container({ sortableChildren: true });
    #containers = new Map();
    constructor(canvas, objectStateTree) {
        this.#canvas = canvas;
        this.#objectStateTree = objectStateTree;
        this.#init();
    }
    async #init() {
        this.#pixiRenderer = await autoDetectRenderer({
            canvas: this.#canvas,
        });
    }
    render() {
        if (this.#pixiRenderer) {
            let zIndex = 0;
            this.#objectStateTree.forEach((i) => {
                if (i === ROOT)
                    return;
                const id = i.toString();
                const container = this.#containers.get(id);
                if (container) {
                    container.zIndex = zIndex;
                }
                else {
                    const container = new Container();
                    this.#containers.set(id, container);
                    this.#root.addChild(container);
                    container.zIndex = zIndex;
                }
                zIndex++;
            });
            this.#pixiRenderer.render(this.#root);
        }
    }
}
export class WebWorkerRenderer extends Renderer {
    constructor(canvas, objectStateTree) {
        DOMAdapter.set(WebWorkerAdapter);
        super(canvas, objectStateTree);
    }
}
//# sourceMappingURL=renderer.js.map