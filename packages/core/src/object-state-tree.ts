import { SABTree } from './sab-data-structures/tree'

const OBJ_FIELD_COUNT = 18 as const

export function createInitialObjectStateBuffer(capacity: number): SharedArrayBuffer {
  return new SharedArrayBuffer(SABTree.bytesRequired(OBJ_FIELD_COUNT, capacity))
}

export class ObjectStateTree extends SABTree {
  constructor(sab: SharedArrayBuffer, capacity: number) {
    super(sab, OBJ_FIELD_COUNT, capacity)
  }
}