import { PixiContainerNode } from '../node/core/pixi-container-node';
export class Layer extends PixiContainerNode {
    constructor(drawOrder) {
        super();
        this._pixiContainer.zIndex = drawOrder;
    }
}
//# sourceMappingURL=layer.js.map