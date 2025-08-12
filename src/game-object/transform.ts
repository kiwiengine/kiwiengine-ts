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

  markClean() {
    this.#dirty = false;
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

  markClean() {
    this.x.markClean();
    this.y.markClean();
    this.pivotX.markClean();
    this.pivotY.markClean();
    this.scaleX.markClean();
    this.scaleY.markClean();
    this.rotation.markClean();
    this.alpha.markClean();
  }
}

export class WorldTransform {
  x = new DirtyNumber(0);
  y = new DirtyNumber(0);
  scaleX = new DirtyNumber(1);
  scaleY = new DirtyNumber(1);
  rotation = new DirtyNumber(0);
  alpha = new DirtyNumber(1);

  update(parent: WorldTransform, local: LocalTransform) {
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

  markClean() {
    this.x.markClean();
    this.y.markClean();
    this.scaleX.markClean();
    this.scaleY.markClean();
    this.rotation.markClean();
    this.alpha.markClean();
  }
}

export function localToWorld(
  world: WorldTransform,
  px: number,
  py: number
): { x: number; y: number } {
  const cos = Math.cos(world.rotation.v);
  const sin = Math.sin(world.rotation.v);
  const sx = px * world.scaleX.v;
  const sy = py * world.scaleY.v;

  const x = world.x.v + (sx * cos - sy * sin);
  const y = world.y.v + (sx * sin + sy * cos);
  return { x, y };
}

export function worldToLocalWithNewWorld(
  world: WorldTransform,
  local: LocalTransform,
  targetWorldX: number,
  targetWorldY: number,
  targetWorldRotation: number
): {
  x: number;
  y: number;
  rotation: number;
  newWorldX: number;
  newWorldY: number;
  newWorldRotation: number;
} {
  const invLocalScaleX = local.scaleX.v !== 0 ? 1 / local.scaleX.v : 0;
  const invLocalScaleY = local.scaleY.v !== 0 ? 1 / local.scaleY.v : 0;

  const parentScaleX = world.scaleX.v * invLocalScaleX;
  const parentScaleY = world.scaleY.v * invLocalScaleY;
  const parentRot = world.rotation.v - local.rotation.v;

  const pCos = Math.cos(parentRot);
  const pSin = Math.sin(parentRot);

  const cosOld = Math.cos(local.rotation.v);
  const sinOld = Math.sin(local.rotation.v);

  const pivotX = local.pivotX.v * world.scaleX.v;
  const pivotY = local.pivotY.v * world.scaleY.v;

  const rx0 = local.x.v * parentScaleX;
  const ry0 = local.y.v * parentScaleY;

  const parentX = world.x.v - (rx0 * pCos - ry0 * pSin) + (pivotX * cosOld - pivotY * sinOld);
  const parentY = world.y.v - (rx0 * pSin + ry0 * pCos) + (pivotX * sinOld + pivotY * cosOld);

  const rotation = targetWorldRotation - parentRot;

  const cosNew = Math.cos(rotation);
  const sinNew = Math.sin(rotation);

  const tx = (targetWorldX - parentX) + (pivotX * cosNew - pivotY * sinNew);
  const ty = (targetWorldY - parentY) + (pivotX * sinNew + pivotY * cosNew);

  const rx = tx * pCos + ty * pSin;
  const ry = -tx * pSin + ty * pCos;

  const invParentScaleX = parentScaleX !== 0 ? 1 / parentScaleX : 0;
  const invParentScaleY = parentScaleY !== 0 ? 1 / parentScaleY : 0;

  const x = rx * invParentScaleX;
  const y = ry * invParentScaleY;

  const newRx = x * parentScaleX;
  const newRy = y * parentScaleY;
  const newWorldX = parentX + (newRx * pCos - newRy * pSin) - (pivotX * cosNew - pivotY * sinNew);
  const newWorldY = parentY + (newRx * pSin + newRy * pCos) - (pivotX * sinNew + pivotY * cosNew);
  const newWorldRotation = parentRot + rotation;

  return { x, y, rotation, newWorldX, newWorldY, newWorldRotation };
}
