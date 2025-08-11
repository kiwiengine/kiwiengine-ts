class DirtyNumber {
  #v: number;
  #dirty: boolean;

  constructor(v: number) {
    this.#v = v;
    this.#dirty = false;
  }

  get dirty(): boolean {
    return this.#dirty;
  }

  get v(): number {
    return this.#v;
  }

  set v(v: number) {
    if (this.#v !== v) this.#dirty = true;
    this.#v = v;
  }
}

export class LocalTransform {
  x = new DirtyNumber(0);
  y = new DirtyNumber(0);
  pivotX = new DirtyNumber(0);
  pivotY = new DirtyNumber(0);
  scaleX = new DirtyNumber(1);
  scaleY = new DirtyNumber(1);
  rotation = new DirtyNumber(0);
  alpha = new DirtyNumber(1);
}

export class GlobalTransform {
  x = new DirtyNumber(0);
  y = new DirtyNumber(0);
  scaleX = new DirtyNumber(1);
  scaleY = new DirtyNumber(1);
  rotation = new DirtyNumber(0);
  alpha = new DirtyNumber(1);

  update(parent: GlobalTransform, local: LocalTransform) {
    const rx = local.x.v * parent.scaleX.v;
    const ry = local.y.v * parent.scaleY.v;
    const pCos = Math.cos(parent.rotation.v);
    const pSin = Math.sin(parent.rotation.v);

    this.scaleX.v = parent.scaleX.v * local.scaleX.v;
    this.scaleY.v = parent.scaleY.v * local.scaleY.v;

    const pivotX = local.pivotX.v * this.scaleX.v;
    const pivotY = local.pivotY.v * this.scaleY.v;
    const cos = Math.cos(local.rotation.v);
    const sin = Math.sin(local.rotation.v);

    this.x.v = parent.x.v + (rx * pCos - ry * pSin) - (pivotX * cos - pivotY * sin);
    this.y.v = parent.y.v + (rx * pSin + ry * pCos) - (pivotX * sin + pivotY * cos);

    this.rotation.v = parent.rotation.v + local.rotation.v;
    this.alpha.v = parent.alpha.v * local.alpha.v;
  }
}
