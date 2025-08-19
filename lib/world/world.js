import { GameObject } from '../game-object/game-object';
import { WorldTransform } from '../game-object/transform';
import { debugMode } from '../utils/debug';
import { WorldDebug } from './world-debug';
import { WorldPhysics } from "./world-physics";
import { WorldRendering } from "./world-rendering";
export class World extends GameObject {
    container = document.createElement('div');
    #containerResizeObserver;
    _worldRendering = new WorldRendering();
    _worldPhysics = new WorldPhysics();
    #worldDebug = new WorldDebug(this.container);
    #width;
    #height;
    #hasEverBeenConnected = false;
    #destroyed = false;
    #pt = new WorldTransform();
    #update(dt) {
        if (this.container.isConnected) {
            if (!this.#hasEverBeenConnected) {
                this.#hasEverBeenConnected = true;
                this.#applySize();
            }
            this._worldPhysics.update(dt);
            this._engineUpdate(dt, this.#pt);
            this._worldRendering.update();
            this.#worldDebug.update();
            this._containerSizeDirty = false;
        }
        else if (this.#hasEverBeenConnected) {
            this.#destroy();
            return;
        }
    }
    #lastContainerW = 0;
    #lastContainerH = 0;
    _containerSizeDirty = false;
    #applySize() {
        const rect = this.container.getBoundingClientRect();
        if (rect.width === this.#lastContainerW && rect.height === this.#lastContainerH)
            return;
        this.#lastContainerW = rect.width;
        this.#lastContainerH = rect.height;
        this._containerSizeDirty = true;
        if (rect.width === 0 || rect.height === 0)
            return;
        const canvasWidth = this.#width ?? rect.width;
        const canvasHeight = this.#height ?? rect.height;
        this._worldRendering.setRendererSize(rect, canvasWidth, canvasHeight);
        this.#worldDebug.setMatterDebugRendererSize(rect, canvasWidth, canvasHeight, this.cameraX, this.cameraY);
        this.emit('resize', this.width, this.height);
    }
    #destroy() {
        this.#containerResizeObserver.disconnect();
        this._worldRendering.destroy();
        this._worldPhysics.destroy();
        this.#worldDebug.destroy();
        this.#destroyed = true;
    }
    async #init() {
        await this._worldRendering.init(this.container, this.#width, this.#height);
        this.#applySize();
        let prevTime = 0;
        let lagSeconds = 0;
        let fpsCap;
        const step = (timestamp) => {
            if (this.#destroyed)
                return;
            const dt = (timestamp - prevTime) / 1000;
            if (dt > 0) {
                if (fpsCap !== undefined && fpsCap > 0) {
                    lagSeconds += dt;
                    const fixedStep = 1 / fpsCap;
                    if (lagSeconds >= fixedStep) {
                        this.#update(fixedStep);
                        if (lagSeconds >= fixedStep * 2) {
                            this.#update(dt);
                            lagSeconds = 0;
                        }
                        else {
                            lagSeconds -= fixedStep;
                        }
                    }
                }
                else {
                    this.#update(dt);
                }
                prevTime = timestamp;
            }
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        if (debugMode) {
            if (!document.hasFocus())
                fpsCap = 6;
            window.addEventListener('blur', () => fpsCap = 6);
            window.addEventListener('focus', () => fpsCap = undefined);
            window.addEventListener('pageshow', (event) => { if (event.persisted)
                fpsCap = undefined; });
        }
    }
    constructor(opts) {
        super(opts);
        this._setWorld(this);
        this._worldRendering.addPixiChildToRoot(this._rendering._container);
        this.#containerResizeObserver = new ResizeObserver(this.#applySize.bind(this));
        this.#containerResizeObserver.observe(this.container);
        this._worldRendering.on('positionChanged', () => this.#worldDebug.setMatterDebugRendererCamera(this.cameraX, this.cameraY));
        this._worldPhysics.on('engineCreated', (engine) => this.#worldDebug.createMatterDebugRenderer(engine, this.width, this.height));
        this._worldPhysics.on('collisionStart', (a, b) => this.emit('collisionStart', a, b));
        if (opts) {
            if (opts.width !== undefined)
                this.#width = opts.width;
            if (opts.height !== undefined)
                this.#height = opts.height;
            if (opts.backgroundColor !== undefined)
                this.backgroundColor = opts.backgroundColor;
            if (opts.backgroundAlpha !== undefined)
                this.backgroundAlpha = opts.backgroundAlpha;
            if (opts.gravity !== undefined)
                this.gravity = opts.gravity;
        }
        this.#init();
    }
    get width() { return this.#width ?? this._worldRendering.renderWidth; }
    set width(v) { this.#width = v; this.#applySize(); }
    get height() { return this.#height ?? this._worldRendering.renderHeight; }
    set height(v) { this.#height = v; this.#applySize(); }
    get backgroundColor() { return this._worldRendering.backgroundColor; }
    set backgroundColor(v) { this._worldRendering.backgroundColor = v; }
    get backgroundAlpha() { return this._worldRendering.backgroundAlpha; }
    set backgroundAlpha(v) { this._worldRendering.backgroundAlpha = v; }
    get gravity() { return this._worldPhysics.gravity; }
    set gravity(v) { this._worldPhysics.gravity = v; }
    get cameraX() { return this._worldRendering.cameraX; }
    set cameraX(v) { this._worldRendering.cameraX = v; }
    get cameraY() { return this._worldRendering.cameraY; }
    set cameraY(v) { this._worldRendering.cameraY = v; }
    #backgroundImage;
    get backgroundImage() { return this.#backgroundImage; }
    set backgroundImage(image) {
        this.#backgroundImage = image;
        this._worldRendering.setBackgroundImage(image);
    }
}
//# sourceMappingURL=world.js.map