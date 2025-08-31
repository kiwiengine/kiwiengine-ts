import { TransformableNode } from './transformable-node';
export class DisplayNode extends TransformableNode {
    pixiContainer;
    constructor(pixiContainer) {
        super();
        this.pixiContainer = pixiContainer;
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
//# sourceMappingURL=display-node.js.map