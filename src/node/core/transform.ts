import { DirtyNumber } from './dirty-number'

export class LocalTransform {
  x = new DirtyNumber(Number.NEGATIVE_INFINITY)
  y = new DirtyNumber(Number.NEGATIVE_INFINITY)
  pivotX = new DirtyNumber(0)
  pivotY = new DirtyNumber(0)
  scaleX = new DirtyNumber(1)
  scaleY = new DirtyNumber(1)
  rotation = new DirtyNumber(0)
}

export class GlobalTransform {
  x = new DirtyNumber(Number.NEGATIVE_INFINITY)
  y = new DirtyNumber(Number.NEGATIVE_INFINITY)
  scaleX = new DirtyNumber(1)
  scaleY = new DirtyNumber(1)
  rotation = new DirtyNumber(0)
  isDirty = false
}
