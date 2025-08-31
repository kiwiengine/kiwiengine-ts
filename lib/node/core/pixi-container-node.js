import { Container } from 'pixi.js';
import { GameNode } from '../core/game-node';
export function isHasPixiContainer(v) {
    return !!v && typeof v.pixiContainer === 'object';
}
export class PixiContainerNode extends GameNode {
    pixiContainer = new Container({ sortableChildren: true });
    add(...children) {
        super.add(...children);
        for (const child of children) {
            if (isHasPixiContainer(child)) {
                this.pixiContainer.addChild(child.pixiContainer);
            }
        }
    }
    remove() {
        this.pixiContainer.destroy({ children: true });
        super.remove();
    }
}
//# sourceMappingURL=pixi-container-node.js.map