export class DirtyNumber {
  #value: number
  #isDirty: boolean

  constructor(initialValue: number) {
    this.#value = initialValue
    this.#isDirty = false
  }

  get dirty() { return this.#isDirty }
  get v() { return this.#value }

  set v(newValue: number) {
    if (this.#value !== newValue) this.#isDirty = true
    this.#value = newValue
  }

  reset() {
    this.#isDirty = false
  }
}

export class DirtyRadian extends DirtyNumber {
  #cos: number
  #sin: number

  constructor(initialValue: number) {
    super(initialValue)
    this.#cos = Math.cos(initialValue)
    this.#sin = Math.sin(initialValue)
  }

  get cos() { return this.#cos }
  get sin() { return this.#sin }

  override set v(newValue: number) {
    if (super.v !== newValue) {
      this.#cos = Math.cos(newValue)
      this.#sin = Math.sin(newValue)
    }
    super.v = newValue
  }

  override get v() { return super.v }
}
