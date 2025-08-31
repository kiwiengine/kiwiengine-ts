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
export class DirtyRadian extends DirtyNumber {
    #cos;
    #sin;
    constructor(initialValue) {
        super(initialValue);
        this.#cos = Math.cos(initialValue);
        this.#sin = Math.sin(initialValue);
    }
    get cos() { return this.#cos; }
    get sin() { return this.#sin; }
    set v(newValue) {
        if (super.v !== newValue) {
            this.#cos = Math.cos(newValue);
            this.#sin = Math.sin(newValue);
        }
        super.v = newValue;
    }
    get v() { return super.v; }
}
//# sourceMappingURL=dirty-number.js.map