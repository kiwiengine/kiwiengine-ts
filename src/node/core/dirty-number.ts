export class DirtyNumber {
  #value: number
  #isDirty: boolean

  constructor(initialValue: number) {
    this.#value = initialValue
    this.#isDirty = false
  }

  get dirty(): boolean { return this.#isDirty }
  get v(): number { return this.#value }

  set v(newValue: number) {
    if (this.#value !== newValue) this.#isDirty = true
    this.#value = newValue
  }

  reset() {
    this.#isDirty = false
  }
}
