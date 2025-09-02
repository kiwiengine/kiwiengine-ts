import { Container as PixiContainer } from 'pixi.js';
import { TransformableNode } from './transformable';
export class GameObject extends TransformableNode {
    constructor(options) {
        super(new PixiContainer({ sortableChildren: true }), options ?? {});
    }
}
//# sourceMappingURL=game-object.js.map