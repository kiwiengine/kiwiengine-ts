import { GameObject } from '../core/game-object';
export class DomContainerNode extends GameObject {
    #el;
    constructor(options) {
        super(options);
        const el = this.#el = options.el;
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.top = '0';
        el.style.zIndex = '1';
    }
    #syncTransform() {
        const renderer = this.renderer;
        if (renderer) {
            const gt = this.globalTransform;
            const S = renderer.viewportScale;
            this.#el.style.transform = `
        translate(
          calc(-50% + ${gt.x.value * S + renderer.canvasLeft + renderer.centerX * S}px),
          calc(-50% + ${gt.y.value * S + renderer.canvasTop + renderer.centerY * S}px)
        )
        scale(${gt.scaleX.value * S}, ${gt.scaleY.value * S})
        rotate(${gt.rotation.value}rad)
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
        if (renderer && (renderer._isContainerSizeDirty || this.globalTransform.isDirty)) {
            this.#syncTransform();
        }
        if (this.globalAlpha.isDirty)
            this.#el.style.opacity = this.globalAlpha.value.toString();
    }
}
//# sourceMappingURL=dom-container.js.map