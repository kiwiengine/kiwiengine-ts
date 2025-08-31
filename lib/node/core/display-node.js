import { isHasPixiContainer } from './pixi-container-node';
import { TransformableNode } from './transformable-node';
export class DisplayNode extends TransformableNode {
    _pixiContainer;
    #layer;
    constructor(pixiContainer, options) {
        super();
        this._pixiContainer = pixiContainer;
        this.#layer = options.layer;
    }
    set renderer(renderer) {
        super.renderer = renderer;
        if (this.#layer && renderer)
            renderer._addToLayer(this, this.#layer);
    }
    get renderer() {
        return super.renderer;
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
}
//# sourceMappingURL=display-node.js.map