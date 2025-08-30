import { GameObject } from '../core/game-object';
export class DomContainerNode extends GameObject {
    #el;
    constructor(opts) {
        super(opts);
        this.#el = opts.el;
    }
    update(deltaTime) {
        super.update(deltaTime);
        const renderer = this.renderer;
        if (renderer) {
        }
    }
}
//# sourceMappingURL=dom-container.js.map