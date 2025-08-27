import { SABTree } from './sab-data-structures/tree';
const OBJ_CAPACITY = 1_000_000;
const OBJ_FVALUE_COUNT = 18;
const OBJ_UVALUE_COUNT = 0;
const OBJ_BVALUE_COUNT = 0;
// floats
const X_IDX = 0;
const Y_IDX = 1;
// uints
// booleans
export function createInitialObjectStateBuffer() {
    return new SharedArrayBuffer(SABTree.bytesRequired(OBJ_CAPACITY, OBJ_FVALUE_COUNT, OBJ_UVALUE_COUNT, OBJ_BVALUE_COUNT));
}
export class ObjectStateTree extends SABTree {
    constructor(sab) {
        super(sab, OBJ_CAPACITY, OBJ_FVALUE_COUNT, OBJ_UVALUE_COUNT, OBJ_BVALUE_COUNT);
    }
    getX(i) { return this.getFValue(i, X_IDX); }
    setX(i, v) { this.setFValue(i, X_IDX, v); }
    getY(i) { return this.getFValue(i, Y_IDX); }
    setY(i, v) { this.setFValue(i, Y_IDX, v); }
}
//# sourceMappingURL=object-state-tree.js.map