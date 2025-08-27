export class SABFloat32ValueArray {
  readonly #values: Float32Array
  readonly #stride: number

  constructor(
    sab: SharedArrayBuffer,
    byteOffset: number,
    capacity: number,
    valueCount: number,
  ) {
    this.#stride = valueCount
    this.#values = new Float32Array(sab, byteOffset, capacity * valueCount)
  }

  static bytesRequired(capacity: number, valueCount: number): number {
    return capacity * valueCount * Float32Array.BYTES_PER_ELEMENT
  }

  get byteLength() { return this.#values.byteLength }

  #offset(i: number) { return i * this.#stride }

  set(i: number, j: number, v: number) {
    this.#values[this.#offset(i) + j] = v
  }

  get(i: number, j: number): number {
    return this.#values[this.#offset(i) + j]
  }
}
