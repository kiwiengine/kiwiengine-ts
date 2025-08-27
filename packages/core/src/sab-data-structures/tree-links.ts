export const ROOT = 0 as const

const NODE_WORDS = 5 as const
const PARENT = 0 as const
const FIRST = 1 as const
const LAST = 2 as const
const PREV = 3 as const
const NEXT = 4 as const

const NONE = 0xFFFFFFFF as const

export class SABTreeLinks {
  readonly #meta: Uint32Array

  constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number) {
    this.#meta = new Uint32Array(sab, byteOffset, capacity * NODE_WORDS)
  }

  static bytesRequired(capacity: number): number {
    return capacity * NODE_WORDS * Uint32Array.BYTES_PER_ELEMENT
  }

  get byteLength() { return this.#meta.byteLength }

  #offset(i: number) { return i * NODE_WORDS }
  #first(i: number) { return this.#meta[this.#offset(i) + FIRST] }
  #last(i: number) { return this.#meta[this.#offset(i) + LAST] }
  #next(i: number) { return this.#meta[this.#offset(i) + NEXT] }

  remove(i: number) {
    const o = this.#offset(i)
    const p = this.#meta[o + PARENT]
    const l = this.#meta[o + PREV]
    const r = this.#meta[o + NEXT]

    if (p !== NONE) {
      const po = this.#offset(p)
      if (this.#meta[po + FIRST] === i) this.#meta[po + FIRST] = r
      if (this.#meta[po + LAST] === i) this.#meta[po + LAST] = l
    }
    if (l !== NONE) this.#meta[this.#offset(l) + NEXT] = r
    if (r !== NONE) this.#meta[this.#offset(r) + PREV] = l
  }

  #linkAsOnlyChild(p: number, c: number) {
    const po = this.#offset(p), co = this.#offset(c)
    this.#meta[co + PARENT] = p
    this.#meta[co + PREV] = NONE
    this.#meta[co + NEXT] = NONE
    this.#meta[po + FIRST] = c
    this.#meta[po + LAST] = c
  }

  #insertAfterSibling(p: number, left: number, c: number) {
    const lo = this.#offset(left)
    const right = this.#meta[lo + NEXT]
    const co = this.#offset(c)

    this.#meta[co + PARENT] = p
    this.#meta[co + PREV] = left
    this.#meta[co + NEXT] = right

    this.#meta[lo + NEXT] = c
    if (right !== NONE) this.#meta[this.#offset(right) + PREV] = c
    else this.#meta[this.#offset(p) + LAST] = c
  }

  #insertBeforeSibling(p: number, right: number, c: number) {
    const ro = this.#offset(right)
    const left = this.#meta[ro + PREV]
    const co = this.#offset(c)

    this.#meta[co + PARENT] = p
    this.#meta[co + NEXT] = right
    this.#meta[co + PREV] = left

    this.#meta[ro + PREV] = c
    if (left !== NONE) this.#meta[this.#offset(left) + NEXT] = c
    else this.#meta[this.#offset(p) + FIRST] = c
  }

  insert(p: number, c: number) {
    this.remove(c)
    const last = this.#last(p)
    if (last === NONE) this.#linkAsOnlyChild(p, c)
    else this.#insertAfterSibling(p, last, c)
  }

  insertAt(p: number, c: number, index: number) {
    this.remove(c)

    const f = this.#first(p)
    if (f === NONE) { this.#linkAsOnlyChild(p, c); return }

    if (index <= 0) { this.#insertBeforeSibling(p, f, c); return }

    let i = 0, cur = f
    while (cur !== NONE && i < index) { cur = this.#next(cur); i++ }

    if (cur === NONE) this.insert(p, c)
    else this.#insertBeforeSibling(p, cur, c)
  }
}
