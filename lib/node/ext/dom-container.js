import { GameObject } from '../core/game-object';
export class DomContainerNode extends GameObject {
    #el;
    constructor(x, y, el, options) {
        super(x, y, options);
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.top = '0';
        el.style.zIndex = '1';
        this.#el = el;
    }
    #syncTransform() {
        const renderer = this.renderer;
        if (renderer) {
            const gt = this.globalTransform;
            const S = renderer.viewportScale;
            this.#el.style.transform = `
        translate(
          calc(-50% + ${gt.x.v * S + renderer.canvasLeft + renderer.centerX * S}px),
          calc(-50% + ${gt.y.v * S + renderer.canvasTop + renderer.centerY * S}px)
        )
        scale(${gt.scaleX.v * S}, ${gt.scaleY.v * S})
        rotate(${gt.rotation.v}rad)
      `;
        }
    }
    set renderer(renderer) {
        super.renderer = renderer;
        if (renderer) {
            renderer.container.appendChild(this.#el);
            this.#syncTransform();
        }
    }
    get renderer() {
        return super.renderer;
    }
    update(deltaTime) {
        super.update(deltaTime);
        const renderer = this.renderer;
        if (renderer && (renderer._isContainerSizeDirty || this.globalTransform.dirty)) {
            this.#syncTransform();
        }
        if (this.globalAlpha.dirty)
            this.#el.style.opacity = this.globalAlpha.v.toString();
    }
}
//# sourceMappingURL=dom-container.js.map