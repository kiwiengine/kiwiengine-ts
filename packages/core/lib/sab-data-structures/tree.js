import { SABNodePool } from "./node-pool";
import { SABTreeLinks } from "./tree-links";
import { SABFloat32ValueArray } from "./value-array";
export class SABTree {
    #pool;
    #links;
    #values;
    constructor(sab, valueCount, capacity) {
        this.#pool = new SABNodePool(sab, 0, capacity);
        let offset = this.#pool.byteLength;
        this.#links = new SABTreeLinks(sab, offset, capacity);
        offset += this.#links.byteLength;
        this.#values = new SABFloat32ValueArray(sab, offset, valueCount, capacity);
        offset += this.#values.byteLength;
    }
    static bytesRequired(valueCount, capacity) {
        const queueBytes = SABNodePool.bytesRequired(capacity);
        const linksBytes = SABTreeLinks.bytesRequired(capacity);
        const valueBytes = SABFloat32ValueArray.bytesRequired(valueCount, capacity);
        return queueBytes + linksBytes + valueBytes;
    }
    remove(i) {
        this.#links.remove(i);
        this.#pool.free(i);
    }
    insert(p, c) { this.#links.insert(p, c); }
    insertAt(p, c, index) { this.#links.insertAt(p, c, index); }
    setValue(i, j, v) { this.#values.set(i, j, v); }
    getValue(i, j) { return this.#values.get(i, j); }
}
//# sourceMappingURL=tree.js.map