import { autoDetectRenderer, Container, DOMAdapter, WebWorkerAdapter } from 'pixi.js';
export class Renderer {
    #canvas;
    #objectStateTree;
    #root = new Container();
    #pixiRenderer;
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
            this.#objectStateTree.forEach((i) => {
                //TODO
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