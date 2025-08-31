import { DirtyNumber } from './dirty-number';
import { isHasPixiContainer } from './pixi-container-node';
import { TransformableNode } from './transformable-node';
export class DisplayNode extends TransformableNode {
    _pixiContainer;
    #layer;
    #useYSort = false;
    alpha = 1;
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
        // 레이어 상에 있는 경우, 독립적으로 업데이트
        if (this.#layer && renderer) {
            //TODO
        }
        else {
            const lt = this.localTransform;
            pc.x = lt.x;
            pc.y = lt.y;
            if (this.#useYSort)
                pc.zIndex = lt.y;
            pc.pivot.x = lt.pivotX;
            pc.pivot.y = lt.pivotY;
            pc.scale.x = lt.scaleX;
            pc.scale.y = lt.scaleY;
            pc.rotation = lt.rotation;
            pc.alpha = this.alpha;
        }
    }
}
//# sourceMappingURL=display-node.js.map