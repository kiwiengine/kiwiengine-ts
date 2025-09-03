import { DirtyNumber } from './dirty-number';
import { GameNode } from './game-node';
import { WorldTransform } from './transform';
export function isRenderableNode(v) {
    return v.worldTransform !== undefined;
}
export class RenderableNode extends GameNode {
    #renderer;
    _pixiContainer;
    worldTransform = new WorldTransform();
    worldAlpha = new DirtyNumber(1);
    constructor(pixiContainer) {
        super();
        this._pixiContainer = pixiContainer;
    }
    set renderer(renderer) {
        this.#renderer = renderer;
        for (const child of this.children) {
            if (isRenderableNode(child)) {
                child.renderer = renderer;
            }
        }
    }
    get renderer() {
        return this.#renderer;
    }
    add(...children) {
        super.add(...children);
        for (const child of children) {
            if (isRenderableNode(child)) {
                this._pixiContainer.addChild(child._pixiContainer);
                // 렌더러 설정
                if (this.#renderer)
                    child.renderer = this.#renderer;
            }
        }
    }
    remove() {
        this._pixiContainer.destroy({ children: true });
        super.remove();
    }
    _updateWorldTransform() {
        for (const child of this.children) {
            if (isRenderableNode(child))
                child._updateWorldTransform();
        }
        this.worldTransform.resetDirty();
    }
    set tint(t) { this._pixiContainer.tint = t; }
    get tint() { return this._pixiContainer.tint; }
}
//# sourceMappingURL=renderable.js.map