export class SABFloat32ValueArray {
  readonly #values: Float32Array
  readonly #stride: number

  constructor(
    sab: SharedArrayBuffer,
    byteOffset: number,
    valueCount: number,
    capacity: number,
  ) {
    this.#stride = valueCount
    this.#values = new Float32Array(sab, byteOffset, valueCount * capacity)
  }

  static bytesRequired(valueCount: number, capacity: number): number {
    return valueCount * capacity * Float32Array.BYTES_PER_ELEMENT
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
