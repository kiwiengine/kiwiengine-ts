import { Graphics } from 'pixi.js';
import { DisplayNode } from '../core/display-node';
export class RectangleNode extends DisplayNode {
    #width;
    #height;
    #fill;
    #stroke;
    constructor(x, y, options) {
        super(new Graphics({ sortableChildren: true }), options);
        this.localTransform.x = x;
        this.localTransform.y = y;
        this.#width = options.width;
        this.#height = options.height;
        this.#fill = options.fill;
        this.#stroke = options.stroke;
        this.#draw();
    }
    #draw() {
        this._pixiContainer.clear().rect(-this.#width / 2, -this.#height / 2, this.#width, this.#height);
        if (this.#fill)
            this._pixiContainer.fill(this.#fill);
        if (this.#stroke)
            this._pixiContainer.stroke(this.#stroke);
    }
}
//# sourceMappingURL=rectangle.js.map