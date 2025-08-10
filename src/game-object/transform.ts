export class LocalTransform {
  x: number;
  y: number;
  pivotX: number;
  pivotY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  alpha: number;
}

export class GlobalTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  alpha: number;

  update(parent: GlobalTransform, local: LocalTransform) {
    const rx = local.x * parent.scaleX;
    const ry = local.y * parent.scaleY;
    const pCos = Math.cos(parent.rotation);
    const pSin = Math.sin(parent.rotation);

    this.scaleX = parent.scaleX * local.scaleX;
    this.scaleY = parent.scaleY * local.scaleY;

    const pivotX = local.pivotX * this.scaleX;
    const pivotY = local.pivotY * this.scaleY;
    const cos = Math.cos(local.rotation);
    const sin = Math.sin(local.rotation);

    this.x = parent.x + (rx * pCos - ry * pSin) - (pivotX * cos - pivotY * sin);
    this.y = parent.y + (rx * pSin + ry * pCos) - (pivotX * sin + pivotY * cos);

    this.rotation = parent.rotation + local.rotation;
    this.alpha = parent.alpha * local.alpha;
  }
}
