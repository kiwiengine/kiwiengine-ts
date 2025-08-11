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

export class World extends GameObject {
  container = document.createElement('div');
  _rendering = new WorldRendering();
  _physics = new WorldPhysics();
  #debug = new WorldDebug(this.container);

  #width?: number;
  #height?: number;

  #hasEverBeenConnected = false;
  #destroyed = false;

  #pt = new WorldTransform();
  #update(dt: number) {
    if (this.container.isConnected) this.#hasEverBeenConnected = true;
    else if (this.#hasEverBeenConnected) { this.#destroy(); return; }

    this._physics.update(dt);
    this._engineUpdate(dt, this.#pt);
    this._rendering.update();
    this.#debug.update();
  }

  #applySize() {
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const canvasWidth = this.#width ?? rect.width;
    const canvasHeight = this.#height ?? rect.height;

    this._rendering.setCanvasSize(rect, canvasWidth, canvasHeight);

    //TODO
  }

  #destroy() {
    //TODO
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
    if (opts) {
      if (opts.width !== undefined) this.#width = opts.width;
      if (opts.height !== undefined) this.#height = opts.height;
      if (opts.backgroundAlpha !== undefined) this.backgroundAlpha = opts.backgroundAlpha;
      if (opts.gravity !== undefined) this.gravity = opts.gravity;
    }
    this.#init();
  }

  get backgroundAlpha() { return this._rendering.backgroundAlpha; }
  set backgroundAlpha(v: number) { this._rendering.backgroundAlpha = v; }
  get gravity() { return this._physics.gravity; }
  set gravity(v: number) { this._physics.gravity = v; }
}
