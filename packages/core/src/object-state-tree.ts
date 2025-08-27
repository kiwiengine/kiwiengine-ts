import { SABTree } from './sab-data-structures/tree'

const OBJ_CAPACITY = 1_000_000 as const
const OBJ_FVALUE_COUNT = 18 as const
const OBJ_UVALUE_COUNT = 0 as const
const OBJ_BVALUE_COUNT = 0 as const

// floats
const X_IDX = 0 as const
const Y_IDX = 1 as const

// uints

// booleans

export function createInitialObjectStateBuffer(): SharedArrayBuffer {
  return new SharedArrayBuffer(SABTree.bytesRequired(OBJ_CAPACITY, OBJ_FVALUE_COUNT, OBJ_UVALUE_COUNT, OBJ_BVALUE_COUNT))
}

export class ObjectStateTree extends SABTree {
  constructor(sab: SharedArrayBuffer) {
    super(sab, OBJ_CAPACITY, OBJ_FVALUE_COUNT, OBJ_UVALUE_COUNT, OBJ_BVALUE_COUNT)
  }

  getX(i: number) { return this.getFValue(i, X_IDX) }
  setX(i: number, v: number) { this.setFValue(i, X_IDX, v) }

  getY(i: number) { return this.getFValue(i, Y_IDX) }
  setY(i: number, v: number) { this.setFValue(i, Y_IDX, v) }
}
