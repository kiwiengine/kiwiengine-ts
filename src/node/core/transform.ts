import { DirtyNumber } from './dirty-number'

export class LocalTransform {
  x = 0
  y = 0
  scaleX = 1
  scaleY = 1
  pivotX = 0
  pivotY = 0

  #rotation = 0
  #cos = 1
  #sin = 0

  get cos() { return this.#cos }
  get sin() { return this.#sin }
  get rotation() { return this.#rotation }

  set rotation(v) {
    if (this.#rotation !== v) {
      this.#rotation = v
      this.#cos = Math.cos(v)
      this.#sin = Math.sin(v)
    }
  }
}

export class WorldTransform {
  x = new DirtyNumber(Number.NEGATIVE_INFINITY)
  y = new DirtyNumber(Number.NEGATIVE_INFINITY)
  scaleX = new DirtyNumber(1)
  scaleY = new DirtyNumber(1)
  rotation = new DirtyNumber(0)
  cos = 1
  sin = 0

  update(parent: WorldTransform, local: LocalTransform) {
    const rx = local.x * parent.scaleX.v
    const ry = local.y * parent.scaleY.v
    const pCos = parent.cos
    const pSin = parent.sin

    this.scaleX.v = parent.scaleX.v * local.scaleX
    this.scaleY.v = parent.scaleY.v * local.scaleY

    const pivotX = local.pivotX * this.scaleX.v
    const pivotY = local.pivotY * this.scaleY.v

    // 로컬 회전
    const lCos = local.cos
    const lSin = local.sin
    // 월드 회전(부모+자식) cos/sin — 덧셈정리
    const wCos = pCos * lCos - pSin * lSin
    const wSin = pSin * lCos + pCos * lSin

    // 위치: 부모 회전으로 (rx,ry) 회전 + 월드 회전으로 피벗 보정
    this.x.v = parent.x.v + (rx * pCos - ry * pSin) - (pivotX * wCos - pivotY * wSin)
    this.y.v = parent.y.v + (rx * pSin + ry * pCos) - (pivotX * wSin + pivotY * wCos)

    // 회전(스칼라 값)
    const rot = parent.rotation.v + local.rotation
    this.rotation.v = rot
    this.cos = wCos
    this.sin = wSin
  }

  get dirty() {
    return this.x.dirty ||
      this.y.dirty ||
      this.scaleX.dirty ||
      this.scaleY.dirty ||
      this.rotation.dirty
  }

  resetDirty() {
    this.x.resetDirty()
    this.y.resetDirty()
    this.scaleX.resetDirty()
    this.scaleY.resetDirty()
    this.rotation.resetDirty()
  }
}
