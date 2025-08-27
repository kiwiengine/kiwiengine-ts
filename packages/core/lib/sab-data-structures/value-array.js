export class SABFloat32ValueArray {
    #values;
    #stride;
    constructor(sab, byteOffset, capacity, valueCount) {
        this.#stride = valueCount;
        this.#values = new Float32Array(sab, byteOffset, capacity * valueCount);
    }
    static bytesRequired(capacity, valueCount) {
        return capacity * valueCount * Float32Array.BYTES_PER_ELEMENT;
    }
    get byteLength() { return this.#values.byteLength; }
    #offset(i) { return i * this.#stride; }
    set(i, j, v) {
        this.#values[this.#offset(i) + j] = v;
    }
    get(i, j) {
        return this.#values[this.#offset(i) + j];
    }
}
//# sourceMappingURL=value-array.js.map