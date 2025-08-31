import { autoDetectRenderer } from 'pixi.js';
import { PixiContainerNode } from '../node/core/pixi-container-node';
import { isTransformableNode } from '../node/core/transformable-node';
import { RendererContainerManager } from './container-manager';
import { Layer } from './layer';
import { Ticker } from './ticker';
export class Renderer extends PixiContainerNode {
    container;
    #containerManager;
    #ticker = new Ticker((dt) => this.update(dt));
    #logicalWidth;
    #logicalHeight;
    #backgroundColor;
    #pixiRenderer;
    #layers = {};
    _isSizeDirty = false;
    canvasLeft = 0;
    canvasTop = 0;
    viewportScale = 1;
    centerX = 0;
    centerY = 0;
    constructor(container, options) {
        super();
        this.container = container;
        this.#containerManager = new RendererContainerManager(container);
        this.#containerManager.on('resize', (width, height) => this.#updateSize(width, height));
        if (options) {
            if (options.logicalWidth !== undefined)
                this.#logicalWidth = options.logicalWidth;
            if (options.logicalHeight !== undefined)
                this.#logicalHeight = options.logicalHeight;
            if (options.backgroundColor !== undefined)
                this.#backgroundColor = options.backgroundColor;
            if (options.layers) {
                for (const layerOption of options.layers) {
                    const layer = new Layer(layerOption.drawOrder);
                    this._pixiContainer.addChild(layer._pixiContainer);
                    this.#layers[layerOption.name] = layer;
                }
            }
        }
        this.init();
    }
    async init() {
        const pr = await autoDetectRenderer({
            width: this.#logicalWidth,
            height: this.#logicalHeight,
            backgroundColor: this.#backgroundColor,
            eventMode: 'none',
            resolution: window.devicePixelRatio,
        });
        const canvas = pr.canvas;
        canvas.style.position = 'absolute';
        canvas.style.touchAction = 'auto';
        this.container.appendChild(canvas);
        this.#pixiRenderer = pr;
    }
    #updateSize(containerWidth, containerHeight) {
        //TODO
    }
    #render(dt) {
        this.update(dt);
        for (const child of this.children) {
            if (isTransformableNode(child))
                child._resetTransformDirty();
        }
        this.#pixiRenderer?.render(this._pixiContainer);
    }
    _addToLayer(node, layerName) {
        const layer = this.#layers[layerName];
        if (!layer)
            throw new Error(`Layer ${layerName} does not exist.`);
        layer._pixiContainer.addChild(node._pixiContainer);
    }
    remove() {
        this.#containerManager.remove();
        super.remove();
    }
}
//# sourceMappingURL=renderer.js.map