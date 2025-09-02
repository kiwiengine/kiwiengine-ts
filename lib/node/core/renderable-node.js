import { Container as PixiContainer } from 'pixi.js';
import { GameNode } from './game-node';
import { WorldTransform } from './transform';
export function isRenderableNode(n) {
    return n.worldTransform !== undefined;
}
export class RenderableNode extends GameNode {
    #renderer;
    _pixiContainer = new PixiContainer({ sortableChildren: true });
    worldTransform = new WorldTransform();
    constructor() {
        super();
        this.worldTransform.x.v = 0;
        this.worldTransform.y.v = 0;
        this.worldTransform.resetDirty();
    }
    add(...children) {
        super.add(...children);
        for (const child of children) {
            if (isRenderableNode(child)) {
                this._pixiContainer.addChild(child._pixiContainer);
            }
        }
    }
    remove() {
        this._pixiContainer.destroy({ children: true });
        super.remove();
    }
    set renderer(renderer) {
        this.#renderer = renderer;
        for (const child of this.children) {
            if (isRenderableNode(child)) {
                child.renderer = renderer;
            }
        }
        if (this.#layer && renderer) {
            renderer._addToLayer(this, this.#layer);
        }
    }
    get renderer() {
        return this.#renderer;
    }
    _resetTransformDirty() {
        this.worldTransform.resetDirty();
        for (const child of this.children) {
            if (isRenderableNode(child)) {
                child._resetTransformDirty();
            }
        }
    }
}
//# sourceMappingURL=renderable-node.js.map