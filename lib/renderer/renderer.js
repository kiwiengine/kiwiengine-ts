import { autoDetectRenderer, Container as PixiContainer } from 'pixi.js';
import { debugMode } from '../debug';
import { setStyle } from '../dom/dom-utils';
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
    #backgroundAlpha;
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
            if (options.backgroundAlpha !== undefined)
                this.#backgroundAlpha = options.backgroundAlpha;
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
        this.init();
    }
    async init() {
        const options = {
            eventMode: 'none',
            resolution: window.devicePixelRatio,
        };
        if (this.#logicalWidth)
            options.width = this.#logicalWidth;
        if (this.#logicalHeight)
            options.height = this.#logicalHeight;
        if (this.#backgroundColor)
            options.backgroundColor = this.#backgroundColor;
        if (this.#backgroundAlpha)
            options.backgroundAlpha = this.#backgroundAlpha;
        const pr = await autoDetectRenderer(options);
        setStyle(pr.canvas, {
            position: 'absolute',
            touchAction: 'auto',
        });
        this.container.appendChild(pr.canvas);
        this.#pixiRenderer = pr;
        const cr = this.container.getBoundingClientRect();
        this.#updateSize(cr.width, cr.height);
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
            setStyle(this.#pixiRenderer.canvas, {
                width: `${displayWidth}px`,
                height: `${displayHeight}px`,
                left: `${canvasLeft}px`,
                top: `${canvasTop}px`,
            });
            this.emit('resize', canvasWidth, canvasHeight);
        }
        this._isSizeDirty = true;
    }
    #render(dt) {
        this.update(dt); // 로직 업데이트
        this._updateWorldTransform();
        this._resetWorldTransformDirty();
        this.#pixiRenderer?.render(this._pixiContainer);
        this.fpsDisplay?.update();
        this._isSizeDirty = false;
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
    screenToWorld(screenX, screenY) {
        const x = (screenX - this.canvasLeft) / this.viewportScale - this.canvasWidth / 2;
        const y = (screenY - this.canvasTop) / this.viewportScale - this.canvasHeight / 2;
        return { x, y };
    }
}
//# sourceMappingURL=renderer.js.map