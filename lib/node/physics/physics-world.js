import { Container } from 'pixi.js';
import { GameNode } from '../core/game-node';
export class PhysicsWorld extends GameNode {
    pixiContainer = new Container({ sortableChildren: true });
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
//# sourceMappingURL=physics-world.js.map