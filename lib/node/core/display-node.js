import { DirtyNumber } from './dirty-number';
import { isRenderableNode } from './renderable-node';
import { TransformableNode } from './transformable-node';
function hasWorldAlpha(v) {
    return v.worldAlpha !== undefined;
}
export class DisplayNode extends TransformableNode {
    _pixiContainer;
    #renderer;
    #layer;
    #useYSort = false;
    alpha = 1;
    worldAlpha = new DirtyNumber(1);
    constructor(pixiContainer, options) {
        super(options);
        this._pixiContainer = pixiContainer;
        this.#layer = options.layer;
        this.#useYSort = options.useYSort ?? false;
        if (options.alpha !== undefined)
            this.alpha = options.alpha;
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
    update(dt) {
        super.update(dt);
        const parent = this.parent;
        if (parent && hasWorldAlpha(parent)) {
            this.worldAlpha.v = parent.worldAlpha.v * this.alpha;
        }
        const pc = this._pixiContainer;
        const renderer = this.renderer;
        // 레이어 상에 있는 경우, 독립적으로 업데이트
        if (this.#layer && renderer) {
            const wt = this.worldTransform;
            pc.position.set(wt.x.v, wt.y.v);
            pc.scale.set(wt.scaleX.v, wt.scaleY.v);
            pc.rotation = wt.rotation.v;
            pc.alpha = this.worldAlpha.v;
        }
        else {
            const lt = this.localTransform;
            pc.position.set(lt.x, lt.y);
            if (this.#useYSort)
                pc.zIndex = lt.y;
            pc.pivot.set(lt.pivotX, lt.pivotY);
            pc.scale.set(lt.scaleX, lt.scaleY);
            pc.rotation = lt.rotation;
            pc.alpha = this.alpha;
        }
    }
    _resetTransformDirty() {
        super._resetTransformDirty();
        this.worldAlpha.resetDirty();
    }
}
//# sourceMappingURL=display-node.js.map