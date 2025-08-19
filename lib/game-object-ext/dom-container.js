import { GameObject } from "../game-object/game-object";
export class DomContainerObject extends GameObject {
    #el;
    constructor(opts) {
        super(opts);
        if (opts) {
            if (opts.el)
                this.el = opts.el;
        }
    }
    _setWorld(world) {
        super._setWorld(world);
        if (this.#el)
            world.container.appendChild(this.#el);
    }
    get el() {
        return this.#el;
    }
    set el(el) {
        this.#el = el;
        if (el) {
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.top = '0';
            el.style.zIndex = '1';
            const world = this._getWorld();
            if (world)
                world.container.appendChild(el);
        }
    }
    _afterRender(dt) {
        const world = this._getWorld();
        if (world && this.#el) {
            if (world._containerSizeDirty ||
                this._wt.x.dirty ||
                this._wt.y.dirty ||
                this._wt.scaleX.dirty ||
                this._wt.scaleY.dirty ||
                this._wt.rotation.dirty) {
                const R = world._worldRendering;
                const S = R.renderScale;
                this.#el.style.transform = `
        translate(
          calc(-50% + ${this._wt.x.v * S + R.canvasLeft + R.centerX * S}px),
          calc(-50% + ${this._wt.y.v * S + R.canvasTop + R.centerY * S}px)
        )
        scale(${this._wt.scaleX.v * S}, ${this._wt.scaleY.v * S})
        rotate(${this._wt.rotation.v}rad)
      `;
            }
            if (this._wt.alpha.dirty)
                this.#el.style.opacity = this._wt.alpha.v.toString();
        }
    }
}
//# sourceMappingURL=dom-container.js.map