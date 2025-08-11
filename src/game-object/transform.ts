export class LocalTransform {
  x = 0;
  y = 0;
  pivotX = 0;
  pivotY = 0;
  scaleX = 1;
  scaleY = 1;
  rotation = 0;
  alpha = 1;
}

class DirtyNumber {
  #value: number;
  #dirty: boolean;

  constructor(v: number) {
    this.#value = v;
    this.#dirty = false;
  }

  get dirty(): boolean {
    return this.#dirty;
  }

  get value(): number {
    return this.#value;
  }

  set value(v: number) {
    if (this.#value !== v) this.#dirty = true;
    this.#value = v;
  }
}

export class GlobalTransform {
  x = new DirtyNumber(0);
  y = new DirtyNumber(0);
  scaleX = new DirtyNumber(1);
  scaleY = new DirtyNumber(1);
  rotation = new DirtyNumber(0);
  alpha = new DirtyNumber(1);

  update(parent: GlobalTransform, local: LocalTransform) {
    const rx = local.x * parent.scaleX.value;
    const ry = local.y * parent.scaleY.value;
    const pCos = Math.cos(parent.rotation.value);
    const pSin = Math.sin(parent.rotation.value);

    this.scaleX.value = parent.scaleX.value * local.scaleX;
    this.scaleY.value = parent.scaleY.value * local.scaleY;

    const pivotX = local.pivotX * this.scaleX.value;
    const pivotY = local.pivotY * this.scaleY.value;
    const cos = Math.cos(local.rotation);
    const sin = Math.sin(local.rotation);

    this.x.value = parent.x.value + (rx * pCos - ry * pSin) - (pivotX * cos - pivotY * sin);
    this.y.value = parent.y.value + (rx * pSin + ry * pCos) - (pivotX * sin + pivotY * cos);

    this.rotation.value = parent.rotation.value + local.rotation;
    this.alpha.value = parent.alpha.value * local.alpha;
  }
}
