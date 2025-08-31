import { Container } from 'pixi.js';
import { GameNode } from '../node/core/game-node';
export class Layer extends GameNode {
    pixiContainer = new Container({ sortableChildren: true });
    constructor(options) {
        super();
        this.pixiContainer.zIndex = options.drawOrder;
    }
    add(...children) {
        super.add(...children);
        for (const child of children) {
            this.pixiContainer.addChild(child.pixiContainer);
        }
    }
    remove() {
        this.pixiContainer.destroy({ children: true });
        super.remove();
    }
}
//# sourceMappingURL=layer.js.map