import { TransformableNode } from './transformable-node';
export class DisplayNode extends TransformableNode {
    #container;
    constructor(container) {
        super();
        this.#container = container;
    }
    remove() {
        this.#container.destroy({ children: true });
        super.remove();
    }
}
//# sourceMappingURL=display-node.js.map