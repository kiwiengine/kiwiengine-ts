export class DirtyNumber {
    #value;
    #isDirty;
    constructor(initialValue) {
        this.#value = initialValue;
        this.#isDirty = false;
    }
    get isDirty() {
        return this.#isDirty;
    }
    get value() {
        return this.#value;
    }
    set value(newValue) {
        if (this.#value !== newValue)
            this.#isDirty = true;
        this.#value = newValue;
    }
    resetDirty() {
        this.#isDirty = false;
    }
}
//# sourceMappingURL=dirty-number.js.map