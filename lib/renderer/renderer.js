import { autoDetectRenderer, Container as PixiContainer } from 'pixi.js';
import { debugMode } from '../debug';
import { RenderableNode } from '../node/core/renderable';
import { Camera } from './camera';
import { RendererContainerManager } from './container-manager';
import { FpsDisplay } from './fps-display';
import { Layer } from './layer';
import { Ticker } from './ticker';
export class Renderer extends RenderableNode {
    container;
    #containerManager;
    #ticker = new Ticker((dt) => this.#render(dt));
    camera = new Camera();
    fpsDisplay;
    #logicalWidth;
    #logicalHeight;
    #backgroundColor;
    #pixiRenderer;
    #layers = {};
    _isSizeDirty = false;
    canvasWidth = 0;
    canvasHeight = 0;
    canvasLeft = 0;
    canvasTop = 0;
    viewportScale = 1;
    centerX = 0;
    centerY = 0;
    constructor(container, options) {
        super(new PixiContainer({ sortableChildren: true }));
        this.container = container;
        this.renderer = this;
        this.worldTransform.x.v = 0;
        this.worldTransform.y.v = 0;
        this.worldTransform.resetDirty();
        this.#containerManager = new RendererContainerManager(container);
        this.#containerManager.on('resize', (width, height) => this.#updateSize(width, height));
        this.camera.on('positionChanged', () => this.#updatePosition());
        this.camera.on('scaleChanged', () => this.#updatePosition());
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
        if (debugMode) {
            this.fpsDisplay = new FpsDisplay(container);
        }
        const cr = this.container.getBoundingClientRect();
        this.#updateSize(cr.width, cr.height);
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
    #updatePosition() {
        const S = this.camera.scale;
        this._pixiContainer.scale = S;
        this._pixiContainer.position.set(this.centerX - this.camera.x * S, this.centerY - this.camera.y * S);
    }
    #updateSize(containerWidth, containerHeight) {
        const canvasWidth = this.#logicalWidth ?? containerWidth;
        const canvasHeight = this.#logicalHeight ?? containerHeight;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight / 2;
        this.#updatePosition();
        const S = Math.min(containerWidth / canvasWidth, containerHeight / canvasHeight);
        this.viewportScale = S;
        const displayWidth = canvasWidth * S;
        const displayHeight = canvasHeight * S;
        const canvasLeft = (containerWidth - displayWidth) / 2;
        const canvasTop = (containerHeight - displayHeight) / 2;
        this.canvasLeft = canvasLeft;
        this.canvasTop = canvasTop;
        if (this.#pixiRenderer) {
            this.#pixiRenderer.resize(canvasWidth, canvasHeight);
            const canvas = this.#pixiRenderer.canvas;
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            canvas.style.left = `${canvasLeft}px`;
            canvas.style.top = `${canvasTop}px`;
        }
        this._isSizeDirty = true;
    }
    #render(dt) {
        this._isSizeDirty = false;
        this.update(dt);
        this._updateWorldTransform();
        this.#pixiRenderer?.render(this._pixiContainer);
        this.fpsDisplay?.update();
    }
    _addToLayer(node, layerName) {
        const layer = this.#layers[layerName];
        if (!layer)
            throw new Error(`Layer ${layerName} does not exist.`);
        layer._pixiContainer.addChild(node._pixiContainer);
    }
    remove() {
        this.#containerManager.remove();
        this.#ticker.remove();
        this.#pixiRenderer?.destroy();
        this.fpsDisplay?.remove();
        super.remove();
    }
}
//# sourceMappingURL=renderer.js.map