export class DirtyNumber {
  #value: number
  #isDirty: boolean

  constructor(initialValue: number) {
    this.#value = initialValue
    this.#isDirty = false
  }

  get isDirty(): boolean {
    return this.#isDirty
  }

  get value(): number {
    return this.#value
  }

  set value(newValue: number) {
    if (this.#value !== newValue) this.#isDirty = true
    this.#value = newValue
  }

  resetDirty() {
    this.#isDirty = false
  }
}
