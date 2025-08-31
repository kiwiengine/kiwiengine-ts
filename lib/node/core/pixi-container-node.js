import { Container } from 'pixi.js';
import { GameNode } from '../core/game-node';
export function isHasPixiContainer(v) {
    return !!v && typeof v.pixiContainer === 'object';
}
export class PixiContainerNode extends GameNode {
    _pixiContainer = new Container({ sortableChildren: true });
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
}
//# sourceMappingURL=pixi-container-node.js.map