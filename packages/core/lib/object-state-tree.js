import { SABTree } from './sab-data-structures/tree';
const OBJ_CAPACITY = 1_000_000;
const OBJ_FIELD_COUNT = 18;
export function createInitialObjectStateBuffer() {
    return new SharedArrayBuffer(SABTree.bytesRequired(OBJ_CAPACITY, OBJ_FIELD_COUNT));
}
export class ObjectStateTree extends SABTree {
    constructor(sab) {
        super(sab, OBJ_CAPACITY, OBJ_FIELD_COUNT);
    }
}
//# sourceMappingURL=object-state-tree.js.map