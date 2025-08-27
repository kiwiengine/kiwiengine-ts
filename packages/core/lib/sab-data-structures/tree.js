import { SABUint32Queue } from './queue';
const ROOT_IDX = 0;
export class SABTree {
    #freeQueue;
    #data;
    #capacity;
    #stride;
    constructor(sab, capacity, v) {
        this.#freeQueue = new SABUint32Queue(sab, capacity - 1);
        for (let i = 1; i < capacity; i++) {
            this.#freeQueue.enqueue(i);
        }
        this.#data = new Float32Array(sab, this.#freeQueue.byteLength, capacity);
        this.#capacity = capacity;
    }
    static bytesRequired(capacity) {
        return SABUint32Queue.bytesRequired(capacity - 1) + capacity * Float32Array.BYTES_PER_ELEMENT;
    }
}
//# sourceMappingURL=tree.js.map