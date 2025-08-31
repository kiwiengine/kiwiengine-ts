import { GameObject } from '../core/game-object';
export class DomContainerNode extends GameObject {
    #el;
    constructor(opts) {
        super(opts);
        this.#el = opts.el;
    }
    set renderer(renderer) {
        super.renderer = renderer;
        if (renderer)
            renderer.target.appendChild(this.#el);
    }
    get renderer() {
        return super.renderer;
    }
    update(deltaTime) {
        super.update(deltaTime);
        const renderer = this.renderer;
        if (renderer) {
            //TODO
        }
    }
}
//# sourceMappingURL=dom-container.js.map