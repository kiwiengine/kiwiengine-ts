import { Container } from 'pixi.js';
import { GameNode } from '../node/core/game-node';
export class Layer extends GameNode {
    pixiContainer = new Container({ sortableChildren: true });
    constructor(drawOrder) {
        super();
        this.pixiContainer.zIndex = drawOrder;
    }
    add(...children) {
        super.add(...children);
        for (const child of children) {
            if ('pixiContainer' in child) {
                this.pixiContainer.addChild(child.pixiContainer);
            }
        }
    }
    remove() {
        this.pixiContainer.destroy({ children: true });
        super.remove();
    }
}
//# sourceMappingURL=layer.js.map