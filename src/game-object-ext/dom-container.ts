import { GameObject, GameObjectOptions } from "../game-object/game-object";
import { WorldTransform } from '../game-object/transform';
import { World } from '../world/world';

type DomContainerObjectOptions = {
  el?: HTMLElement;
} & GameObjectOptions;

export class DomContainerObject extends GameObject {
  #el?: HTMLElement;

  constructor(opts?: DomContainerObjectOptions) {
    super(opts);
    if (opts) {
      if (opts.el) this.el = opts.el;
    }
  }

  protected _setWorld(world: World): void {
    super._setWorld(world);
    if (this.#el) world.container.appendChild(this.#el);
  }

  get el() {
    return this.#el;
  }

  set el(el: HTMLElement | undefined) {
    this.#el = el;
    if (el) {
      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.top = '0';
      el.style.zIndex = '1';

      const world = this._getWorld();
      if (world) world.container.appendChild(el);
    }
  }

  _engineUpdate(dt: number, pt: WorldTransform) {
    super._engineUpdate(dt, pt);

    const world = this._getWorld();
    if (world && this.#el) {
      const R = world._rendering;
      const S = R.canvasScale;

      this.#el.style.transform = `
        translate(
          calc(-50% + ${this._wt.x.v * S + R.canvasLeft + R.centerX * S}px),
          calc(-50% + ${this._wt.y.v * S + R.canvasTop + R.centerY * S}px)
        )
        scale(${this._wt.scaleX.v * S}, ${this._wt.scaleY.v * S})
        rotate(${this._wt.rotation.v}rad)
      `;
      this.#el.style.opacity = this._wt.alpha.v.toString();
    }
  }
}
