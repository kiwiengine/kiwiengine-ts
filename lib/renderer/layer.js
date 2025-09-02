import { Container as PixiContainer } from 'pixi.js';
import { RenderableNode } from '../node/core/renderable';
export class Layer extends RenderableNode {
    constructor(drawOrder) {
        super(new PixiContainer({ sortableChildren: true }));
        this._pixiContainer.zIndex = drawOrder;
        this.worldTransform.x.v = 0;
        this.worldTransform.y.v = 0;
        this.worldTransform.resetDirty();
    }
}
//# sourceMappingURL=layer.js.map