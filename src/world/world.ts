import { Sprite } from 'pixi.js';
import { textureLoader } from '../asset/loaders/texture';
import { GameObject, GameObjectOptions } from '../game-object/game-object';
import { WorldTransform } from '../game-object/transform';
import { debugMode } from '../utils/debug';
import { WorldDebug } from './world-debug';
import { WorldPhysics } from "./world-physics";
import { WorldRendering } from "./world-rendering";

export type WorldOptions = {
  width?: number;
  height?: number;
  backgroundAlpha?: number;
  gravity?: number;
} & GameObjectOptions;

export class World extends GameObject<{
  resize: (width: number, height: number) => void;
  collisionStart: (a: GameObject, b: GameObject) => void;
}> {
  container = document.createElement('div');
  #containerResizeObserver: ResizeObserver;

  _rendering = new WorldRendering();
  _physics = new WorldPhysics();
  #debug = new WorldDebug(this.container);

  #width?: number;
  #height?: number;

  #hasEverBeenConnected = false;
  #destroyed = false;

  #pt = new WorldTransform();
  #update(dt: number) {
    if (this.container.isConnected) {
      if (!this.#hasEverBeenConnected) {
        this.#hasEverBeenConnected = true;
        this.#applySize();
      }

      this._physics.update(dt);
      this._engineUpdate(dt, this.#pt);
      this._rendering.update();
      this.#debug.update();

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

    if (rect.width === this.#lastContainerW && rect.height === this.#lastContainerH) return;
    this.#lastContainerW = rect.width;
    this.#lastContainerH = rect.height;
    this._containerSizeDirty = true;

    if (rect.width === 0 || rect.height === 0) return;

    const canvasWidth = this.#width ?? rect.width;
    const canvasHeight = this.#height ?? rect.height;

    this._rendering.setRendererSize(rect, canvasWidth, canvasHeight);
    //TODO this.#debug.setDebugRendererSize(rect, canvasWidth, canvasHeight);

    this.emit('resize', this.width, this.height);
  }

  #destroy() {
    this.#containerResizeObserver.disconnect();
    this._rendering.destroy();
    this._physics.destroy();
    this.#debug.destroy();

    this.#destroyed = true;
  }

  async #init() {
    await this._rendering.init(this.container, this.#width, this.#height);
    this.#applySize();

    let prevTime = 0;
    let lagSeconds = 0;
    let fpsCap: number | undefined;

    const step = (timestamp: number) => {
      if (this.#destroyed) return;

      const dt = (timestamp - prevTime) / 1000;
      if (dt > 0) {
        if (fpsCap !== undefined && fpsCap > 0) {
          lagSeconds += dt;
          const fixedStep = 1 / fpsCap;
          if (lagSeconds >= fixedStep) {
            this.#update(fixedStep);
            if (lagSeconds >= fixedStep * 2) { this.#update(dt); lagSeconds = 0; }
            else { lagSeconds -= fixedStep; }
          }
        } else {
          this.#update(dt);
        }
        prevTime = timestamp;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    if (debugMode) {
      if (!document.hasFocus()) fpsCap = 6;
      window.addEventListener('blur', () => fpsCap = 6);
      window.addEventListener('focus', () => fpsCap = undefined);
      window.addEventListener('pageshow', (event) => { if (event.persisted) fpsCap = undefined; });
    }
  }

  constructor(opts?: WorldOptions) {
    super(opts);
    this._setWorld(this);

    this.#containerResizeObserver = new ResizeObserver(this.#applySize.bind(this));
    this.#containerResizeObserver.observe(this.container);

    this._physics.on('collisionStart', (a, b) => this.emit('collisionStart', a, b));

    if (opts) {
      if (opts.width !== undefined) this.#width = opts.width;
      if (opts.height !== undefined) this.#height = opts.height;
      if (opts.backgroundAlpha !== undefined) this.backgroundAlpha = opts.backgroundAlpha;
      if (opts.gravity !== undefined) this.gravity = opts.gravity;
    }

    this.#init();
  }

  get width() { return this.#width ?? this._rendering.renderWidth; }
  set width(v: number) { this.#width = v; this.#applySize(); }
  get height() { return this.#height ?? this._rendering.renderHeight; }
  set height(v: number) { this.#height = v; this.#applySize(); }

  get backgroundAlpha() { return this._rendering.backgroundAlpha; }
  set backgroundAlpha(v: number) { this._rendering.backgroundAlpha = v; }
  get gravity() { return this._physics.gravity; }
  set gravity(v: number) { this._physics.gravity = v; }

  get cameraX() { return this._rendering.cameraX; }
  set cameraX(v: number) { this._rendering.cameraX = v; }
  get cameraY() { return this._rendering.cameraY; }
  set cameraY(v: number) { this._rendering.cameraY = v; }

  #backgroundImage?: string;
  #backgroundSprite?: Sprite;
  get backgroundImage() { return this.#backgroundImage; }
  set backgroundImage(image: string | undefined) {
    this.#backgroundImage = image;
    if (image) {
      if (!textureLoader.checkLoaded(image)) {
        console.info(`Background image not preloaded. Loading now: ${image}`);
      }
      textureLoader.load(image).then((texture) => {
        if (texture) {
          this.#backgroundSprite?.destroy();
          this.#backgroundSprite = new Sprite({
            x: this.cameraX,
            y: this.cameraY,
            texture,
            anchor: { x: 0.5, y: 0.5 },
            width: this.width,
            height: this.height,
            zIndex: -999999,
          });
          this._rendering.addPixiChildToRoot(this.#backgroundSprite);
        }
      });
    }
  }
}
