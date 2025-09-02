import { DirtyNumber } from './dirty-number';
import { isHasPixiContainer } from './pixi-container-node';
import { TransformableNode } from './transformable-node';
function hasGlobalAlpha(v) {
    return v.globalAlpha !== undefined;
}
export class DisplayNode extends TransformableNode {
    _pixiContainer;
    #layer;
    #useYSort = false;
    alpha = 1;
    globalAlpha = new DirtyNumber(1);
    constructor(pixiContainer, options) {
        super(options);
        this._pixiContainer = pixiContainer;
        this.#layer = options.layer;
        this.#useYSort = options.useYSort ?? false;
        if (options.alpha !== undefined)
            this.alpha = options.alpha;
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
    update(dt) {
        super.update(dt);
        const parent = this.parent;
        if (parent && hasGlobalAlpha(parent)) {
            this.globalAlpha.v = parent.globalAlpha.v * this.alpha;
        }
        const pc = this._pixiContainer;
        const renderer = this.renderer;
        // 레이어 상에 있는 경우, 독립적으로 업데이트
        if (this.#layer && renderer) {
            const wt = this.worldTransform;
            pc.position.set(wt.x.v, wt.y.v);
            pc.scale.set(wt.scaleX.v, wt.scaleY.v);
            pc.rotation = wt.rotation.v;
            pc.alpha = this.globalAlpha.v;
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
        this.globalAlpha.resetDirty();
    }
}
//# sourceMappingURL=display-node.js.map