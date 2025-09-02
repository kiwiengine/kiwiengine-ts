import { Container as PixiContainer } from 'pixi.js';
import { RenderableNode } from '../core/renderable';
export class PhysicsWorld extends RenderableNode {
    constructor() {
        super(new PixiContainer({ sortableChildren: true }));
        this.worldTransform.x.v = 0;
        this.worldTransform.y.v = 0;
        this.worldTransform.resetDirty();
    }
}
//# sourceMappingURL=physics-world.js.map