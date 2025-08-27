import { SABNodePool } from './node-pool'
import { SABTreeLinks } from './tree-links'
import { SABBooleanValueArray, SABFloat32ValueArray, SABUint32ValueArray } from './value-array'

export class SABTree {
  readonly #pool: SABNodePool
  readonly #links: SABTreeLinks
  readonly #fvalues: SABFloat32ValueArray
  readonly #uvalues: SABUint32ValueArray
  readonly #bvalues: SABBooleanValueArray

  constructor(
    sab: SharedArrayBuffer,
    capacity: number,
    fvalueCount: number,
    uvalueCount: number,
    bvalueCount: number,
  ) {
    this.#pool = new SABNodePool(sab, 0, capacity)
    let offset = this.#pool.byteLength

    this.#links = new SABTreeLinks(sab, offset, capacity)
    offset += this.#links.byteLength

    this.#fvalues = new SABFloat32ValueArray(sab, offset, capacity, fvalueCount)
    offset += this.#fvalues.byteLength

    this.#uvalues = new SABUint32ValueArray(sab, offset, capacity, uvalueCount)
    offset += this.#uvalues.byteLength

    this.#bvalues = new SABBooleanValueArray(sab, offset, capacity, bvalueCount)
  }

  static bytesRequired(capacity: number, fvalueCount: number, uvalueCount: number, bvalueCount: number): number {
    const queueBytes = SABNodePool.bytesRequired(capacity)
    const linksBytes = SABTreeLinks.bytesRequired(capacity)
    const fvalueBytes = SABFloat32ValueArray.bytesRequired(capacity, fvalueCount)
    const uvalueBytes = SABUint32ValueArray.bytesRequired(capacity, uvalueCount)
    const bvalueBytes = SABBooleanValueArray.bytesRequired(capacity, bvalueCount)
    return queueBytes + linksBytes + fvalueBytes + uvalueBytes + bvalueBytes
  }

  remove(i: number) {
    this.#links.remove(i)
    this.#pool.free(i)
  }

  insert(p: number, c: number) { this.#links.insert(p, c) }
  insertAt(p: number, c: number, index: number) { this.#links.insertAt(p, c, index) }

  setFValue(i: number, j: number, v: number) { this.#fvalues.set(i, j, v) }
  getFValue(i: number, j: number) { return this.#fvalues.get(i, j) }

  setUValue(i: number, j: number, v: number) { this.#uvalues.set(i, j, v) }
  getUValue(i: number, j: number) { return this.#uvalues.get(i, j) }

  setBValue(i: number, j: number, v: boolean) { this.#bvalues.set(i, j, v) }
  getBValue(i: number, j: number) { return this.#bvalues.get(i, j) }

  forEach(visitor: (node: number) => void) {
    this.#links.forEach(visitor)
  }

  sortChildren(parent: number, uvalueIndex: number) {
    this.#links.sortChildren(parent, (i) => this.#uvalues.get(i, uvalueIndex))
  }
}
