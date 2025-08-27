import { SABNodePool } from './node-pool';
import { SABTreeLinks } from './tree-links';
import { SABBooleanValueArray, SABFloat32ValueArray, SABUint32ValueArray } from './value-array';
export class SABTree {
    #pool;
    #links;
    #fvalues;
    #uvalues;
    #bvalues;
    constructor(sab, capacity, fvalueCount, uvalueCount, bvalueCount) {
        this.#pool = new SABNodePool(sab, 0, capacity);
        let offset = this.#pool.byteLength;
        this.#links = new SABTreeLinks(sab, offset, capacity);
        offset += this.#links.byteLength;
        this.#fvalues = new SABFloat32ValueArray(sab, offset, capacity, fvalueCount);
        offset += this.#fvalues.byteLength;
        this.#uvalues = new SABUint32ValueArray(sab, offset, capacity, uvalueCount);
        offset += this.#uvalues.byteLength;
        this.#bvalues = new SABBooleanValueArray(sab, offset, capacity, bvalueCount);
    }
    static bytesRequired(capacity, fvalueCount, uvalueCount, bvalueCount) {
        const queueBytes = SABNodePool.bytesRequired(capacity);
        const linksBytes = SABTreeLinks.bytesRequired(capacity);
        const fvalueBytes = SABFloat32ValueArray.bytesRequired(capacity, fvalueCount);
        const uvalueBytes = SABUint32ValueArray.bytesRequired(capacity, uvalueCount);
        const bvalueBytes = SABBooleanValueArray.bytesRequired(capacity, bvalueCount);
        return queueBytes + linksBytes + fvalueBytes + uvalueBytes + bvalueBytes;
    }
    remove(i) {
        this.#links.remove(i);
        this.#pool.free(i);
    }
    insert(p, c) { this.#links.insert(p, c); }
    insertAt(p, c, index) { this.#links.insertAt(p, c, index); }
    setFValue(i, j, v) { this.#fvalues.set(i, j, v); }
    getFValue(i, j) { return this.#fvalues.get(i, j); }
    setUValue(i, j, v) { this.#uvalues.set(i, j, v); }
    getUValue(i, j) { return this.#uvalues.get(i, j); }
    setBValue(i, j, v) { this.#bvalues.set(i, j, v); }
    getBValue(i, j) { return this.#bvalues.get(i, j); }
    forEach(visitor) {
        this.#links.forEach(visitor);
    }
    sortChildren(parent, uvalueIndex) {
        this.#links.sortChildren(parent, (i) => this.#uvalues.get(i, uvalueIndex));
    }
}
//# sourceMappingURL=tree.js.map