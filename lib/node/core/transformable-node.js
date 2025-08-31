import { GameNode } from './game-node';
import { GlobalTransform, LocalTransform } from './transform';
function isTransformableNode(v) {
    return v.globalTransform !== undefined;
}
export class TransformableNode extends GameNode {
    localTransform = new LocalTransform();
    globalTransform = new GlobalTransform();
    update(deltaTime) {
        super.update(deltaTime);
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
}
//# sourceMappingURL=transformable-node.js.map