import { Container } from 'pixi.js';
import { GameNode } from '../core/game-node';
import { DirtyNumber } from './dirty-number';
import { WorldTransform } from './transform';
import { isTransformableNode } from './transformable-node';
export function isHasPixiContainer(v) {
    return v._pixiContainer !== undefined;
}
export class PixiContainerNode extends GameNode {
    _pixiContainer = new Container({ sortableChildren: true });
    worldTransform = new WorldTransform();
    globalAlpha = new DirtyNumber(1);
    constructor() {
        super();
        this.worldTransform.x.v = 0;
        this.worldTransform.y.v = 0;
        this.worldTransform.resetDirty();
    }
    add(...children) {
        super.add(...children);
        for (const child of children) {
            if (isHasPixiContainer(child)) {
                this._pixiContainer.addChild(child._pixiContainer);
            }
        }
    }
    remove() {
        this._pixiContainer.destroy({ children: true });
        super.remove();
    }
    _resetTransformDirty() {
        this.worldTransform.resetDirty();
        for (const child of this.children) {
            if (isTransformableNode(child))
                child._resetTransformDirty();
        }
    }
}
//# sourceMappingURL=pixi-container-node.js.map