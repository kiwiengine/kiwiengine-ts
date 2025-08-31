import { DirtyNumber } from './dirty-number';
import { isHasPixiContainer } from './pixi-container-node';
import { TransformableNode } from './transformable-node';
export class DisplayNode extends TransformableNode {
    _pixiContainer;
    #layer;
    #useYSort = false;
    localAlpha = new DirtyNumber(1);
    globalAlpha = new DirtyNumber(1);
    constructor(pixiContainer, options) {
        super();
        this._pixiContainer = pixiContainer;
        this.#layer = options.layer;
        this.#useYSort = options.useYSort ?? false;
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
    update(deltaTime) {
        super.update(deltaTime);
        const pc = this._pixiContainer;
        const renderer = this.renderer;
        if (this.#layer && renderer) {
            const lt = this.localTransform;
            if (lt.x.dirty)
                pc.x = lt.x.v;
            if (lt.y.dirty) {
                pc.y = lt.y.v;
                if (this.#useYSort)
                    pc.zIndex = lt.y.v;
            }
            if (lt.pivotX.dirty)
                pc.pivot.x = lt.pivotX.v;
            if (lt.pivotY.dirty)
                pc.pivot.y = lt.pivotY.v;
            if (lt.scaleX.dirty)
                pc.scale.x = lt.scaleX.v;
            if (lt.scaleY.dirty)
                pc.scale.y = lt.scaleY.v;
            if (lt.rotation.dirty)
                pc.rotation = lt.rotation.v;
        }
        if (this.localAlpha.dirty)
            pc.alpha = this.localAlpha.v;
    }
}
//# sourceMappingURL=display-node.js.map