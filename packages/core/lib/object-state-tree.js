import { SABTree } from './sab-data-structures/tree';
const OBJ_FIELD_COUNT = 18;
export function createInitialObjectStateBuffer(capacity) {
    return new SharedArrayBuffer(SABTree.bytesRequired(OBJ_FIELD_COUNT, capacity));
}
export class ObjectStateTree extends SABTree {
    constructor(sab, capacity) {
        super(sab, OBJ_FIELD_COUNT, capacity);
    }
}
//# sourceMappingURL=object-state-tree.js.map