export class DirtyNumber {
    #value;
    #isDirty;
    constructor(initialValue) {
        this.#value = initialValue;
        this.#isDirty = false;
    }
    get dirty() { return this.#isDirty; }
    get v() { return this.#value; }
    set v(newValue) {
        if (this.#value !== newValue)
            this.#isDirty = true;
        this.#value = newValue;
    }
    resetDirty() {
        this.#isDirty = false;
    }
}
//# sourceMappingURL=dirty-number.js.map