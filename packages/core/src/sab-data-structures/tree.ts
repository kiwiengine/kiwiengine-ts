import { SABNodePool } from "./node-pool"
import { SABTreeLinks } from "./tree-links"
import { SABFloat32ValueArray } from "./value-array"

export class SABTree {
  readonly #pool: SABNodePool
  readonly #links: SABTreeLinks
  readonly #values: SABFloat32ValueArray

  constructor(sab: SharedArrayBuffer, capacity: number, valueCount: number) {
    this.#pool = new SABNodePool(sab, 0, capacity)
    let offset = this.#pool.byteLength

    this.#links = new SABTreeLinks(sab, offset, capacity)
    offset += this.#links.byteLength

    this.#values = new SABFloat32ValueArray(sab, offset, capacity, valueCount)
    offset += this.#values.byteLength
  }

  static bytesRequired(capacity: number, valueCount: number): number {
    const queueBytes = SABNodePool.bytesRequired(capacity)
    const linksBytes = SABTreeLinks.bytesRequired(capacity)
    const valueBytes = SABFloat32ValueArray.bytesRequired(capacity, valueCount)
    return queueBytes + linksBytes + valueBytes
  }

  remove(i: number) {
    this.#links.remove(i)
    this.#pool.free(i)
  }

  insert(p: number, c: number) { this.#links.insert(p, c) }
  insertAt(p: number, c: number, index: number) { this.#links.insertAt(p, c, index) }

  setValue(i: number, j: number, v: number) { this.#values.set(i, j, v) }
  getValue(i: number, j: number) { return this.#values.get(i, j) }

  forEach(visitor: (node: number) => void): void { this.#links.forEach(visitor) }
}
