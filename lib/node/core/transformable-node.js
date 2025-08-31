import { GameNode } from './game-node';
import { GlobalTransform, LocalTransform } from './transform';
export function isTransformableNode(v) {
    return v.globalTransform !== undefined;
}
export class TransformableNode extends GameNode {
    localTransform = new LocalTransform();
    globalTransform = new GlobalTransform();
    update(dt) {
        super.update(dt);
        const parent = this.parent;
        if (parent && isTransformableNode(parent)) {
            this.globalTransform.update(parent.globalTransform, this.localTransform);
        }
    }
    _resetTransformDirty() {
        this.globalTransform.resetDirty();
        for (const child of this.children) {
            if (isTransformableNode(child))
                child._resetTransformDirty();
        }
    }
    set x(v) { this.localTransform.x = v; }
    get x() { return this.localTransform.x; }
    set y(v) { this.localTransform.y = v; }
    get y() { return this.localTransform.y; }
    set scale(v) { this.localTransform.scaleX = v; this.localTransform.scaleY = v; }
    get scale() { return this.localTransform.scaleX; }
}
//# sourceMappingURL=transformable-node.js.map