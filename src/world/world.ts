import { GameObject, GameObjectOptions } from '../game-object/game-object';
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
  #rendering = new WorldRendering();
  _physics = new WorldPhysics();
  #debug = new WorldDebug(this.container);

  #width?: number;
  #height?: number;

  async #init() {
    await this.#rendering.init(this.#width, this.#height);
  }

  constructor(opts?: WorldOptions) {
    super(opts);
    if (opts) {
      if (opts.width !== undefined) this.#width = opts.width;
      if (opts.height !== undefined) this.#height = opts.height;
      if (opts.backgroundAlpha !== undefined) this.backgroundAlpha = opts.backgroundAlpha;
      if (opts.gravity !== undefined) this.gravity = opts.gravity;
    }
    this.#init();
  }

  get backgroundAlpha() { return this.#rendering.backgroundAlpha; }
  set backgroundAlpha(v: number) { this.#rendering.backgroundAlpha = v; }
  get gravity() { return this._physics.gravity; }
  set gravity(v: number) { this._physics.gravity = v; }
}
