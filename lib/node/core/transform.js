import { DirtyNumber, DirtyRadian } from './dirty-number';
export class LocalTransform {
    x = 0;
    y = 0;
    scaleX = 1;
    scaleY = 1;
    pivotX = 0;
    pivotY = 0;
    #rotation = 0;
    #cos = 1;
    #sin = 0;
    get cos() { return this.#cos; }
    get sin() { return this.#sin; }
    get rotation() { return this.#rotation; }
    set rotation(v) {
        if (this.#rotation !== v) {
            this.#rotation = v;
            this.#cos = Math.cos(v);
            this.#sin = Math.sin(v);
        }
    }
}
export class WorldTransform {
    x = new DirtyNumber(Number.NEGATIVE_INFINITY);
    y = new DirtyNumber(Number.NEGATIVE_INFINITY);
    scaleX = new DirtyNumber(1);
    scaleY = new DirtyNumber(1);
    rotation = new DirtyRadian(0);
    update(parent, local) {
        const rx = local.x * parent.scaleX.v;
        const ry = local.y * parent.scaleY.v;
        const pCos = parent.rotation.cos;
        const pSin = parent.rotation.sin;
        this.scaleX.v = parent.scaleX.v * local.scaleX;
        this.scaleY.v = parent.scaleY.v * local.scaleY;
        const pivotX = local.pivotX * this.scaleX.v;
        const pivotY = local.pivotY * this.scaleY.v;
        const cos = local.cos;
        const sin = local.sin;
        this.x.v = parent.x.v + (rx * pCos - ry * pSin) - (pivotX * cos - pivotY * sin);
        this.y.v = parent.y.v + (rx * pSin + ry * pCos) - (pivotX * sin + pivotY * cos);
        this.rotation.v = parent.rotation.v + local.rotation;
    }
    get dirty() {
        return this.x.dirty ||
            this.y.dirty ||
            this.scaleX.dirty ||
            this.scaleY.dirty ||
            this.rotation.dirty;
    }
    resetDirty() {
        this.x.resetDirty();
        this.y.resetDirty();
        this.scaleX.resetDirty();
        this.scaleY.resetDirty();
        this.rotation.resetDirty();
    }
}
//# sourceMappingURL=transform.js.map