export class SABFloat32ValueArray {
    #values;
    #stride;
    constructor(sab, byteOffset, valueCount, capacity) {
        this.#stride = valueCount;
        this.#values = new Float32Array(sab, byteOffset, valueCount * capacity);
    }
    static bytesRequired(valueCount, capacity) {
        return valueCount * capacity * Float32Array.BYTES_PER_ELEMENT;
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