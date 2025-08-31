import { DirtyNumber } from './dirty-number'

export class GlobalTransform {
  x = new DirtyNumber(0)
  y = new DirtyNumber(0)
  scaleX = new DirtyNumber(1)
  scaleY = new DirtyNumber(1)
  rotation = new DirtyNumber(0)
  isDirty = false
}
