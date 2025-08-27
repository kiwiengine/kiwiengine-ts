import { SABTree } from './sab-data-structures/tree'

const OBJ_CAPACITY = 1_000_000
const OBJ_FIELD_COUNT = 18 as const

export function createInitialObjectStateBuffer(): SharedArrayBuffer {
  return new SharedArrayBuffer(SABTree.bytesRequired(OBJ_CAPACITY, OBJ_FIELD_COUNT))
}

export class ObjectStateTree extends SABTree {
  constructor(sab: SharedArrayBuffer) {
    super(sab, OBJ_CAPACITY, OBJ_FIELD_COUNT)
  }
}
